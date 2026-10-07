"""Anonymous, browser-reported usage totals persisted through Google Apps Script."""
import hashlib
import hmac
import json
import os
import re
import time
import uuid
from urllib.parse import urlsplit
from urllib.request import Request, urlopen

from flask import Blueprint, abort, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

usage = Blueprint('usage', __name__)
TOOLS = frozenset(('pdf-merge', 'pdf-split', 'pdf-organizer', 'pdf-annotations',
    'pdf-to-images', 'images-to-pdf', 'image-toolkit', 'image-transform', 'file-hash', 'qr-generator'))
COOKIE = 'bt_usage_session'
_snapshot = None
_snapshot_at = 0


def settings():
    url = os.getenv('USAGE_SCRIPT_URL', '').strip()
    secret = os.getenv('USAGE_SCRIPT_SECRET', '').strip()
    parsed = urlsplit(url)
    if parsed.scheme != 'https' or parsed.hostname != 'script.google.com' or not re.fullmatch(r'/macros/s/[\w-]+/exec', parsed.path) or len(secret) < 32:
        return None
    return url, secret


def ready():
    return settings() is not None


def bridge(action, **values):
    config = settings()
    if not config:
        raise RuntimeError('Usage storage is not configured')
    url, secret = config
    payload = json.dumps(dict(action=action, timestamp=int(time.time()), **values), separators=(',', ':'))
    signature = hmac.new(secret.encode(), payload.encode(), hashlib.sha256).hexdigest()
    body = json.dumps({'payload': payload, 'signature': signature}).encode()
    req = Request(url, data=body, headers={'Content-Type': 'application/json'}, method='POST')
    with urlopen(req, timeout=12) as response:
        result = json.loads(response.read(32768))
    if result.get('ok') is not True:
        raise RuntimeError('Usage storage did not acknowledge the request')
    for field in ('visits', 'jobs'):
        if type(result.get(field)) is not int or result[field] < 0:
            raise RuntimeError('Invalid usage totals')
    if not isinstance(result.get('started'), str) or not re.fullmatch(r'\d{4}-\d{2}-\d{2}', result['started']):
        raise RuntimeError('Invalid tracking start date')
    return result


def snapshot(force=False):
    global _snapshot, _snapshot_at
    if force or _snapshot is None or time.monotonic() - _snapshot_at > 60:
        _snapshot = bridge('snapshot')
        _snapshot_at = time.monotonic()
    return _snapshot


def public_counts(value):
    return {key: value[key] for key in ('visits', 'jobs', 'started')}


def signer():
    return URLSafeTimedSerializer(settings()[1], salt='browser-tools-usage-v1')


def session_id():
    try:
        return signer().loads(request.cookies.get(COOKIE, ''), max_age=1800)
    except (BadSignature, SignatureExpired):
        return str(uuid.uuid4())


@usage.get('/api/usage')
def read_usage():
    if not ready():
        return jsonify(available=False), 503
    try:
        result = snapshot()
    except Exception:
        return jsonify(available=False), 503
    response = jsonify(available=True, **public_counts(result))
    response.headers['Cache-Control'] = 'no-store'
    response.set_cookie(COOKIE, signer().dumps(session_id()), httponly=True,
                        secure=request.is_secure, samesite='Lax', max_age=1800)
    return response


@usage.post('/api/usage')
def record_usage():
    origin = request.headers.get('Origin')
    if origin and origin.rstrip('/') != request.host_url.rstrip('/'):
        abort(403)
    if request.headers.get('Sec-Fetch-Site') == 'cross-site':
        abort(403)
    if request.content_length is None or request.content_length > 1024:
        abort(400)
    if not ready():
        return jsonify(available=False), 503
    try:
        sid = signer().loads(request.cookies.get(COOKIE, ''), max_age=1800)
    except (BadSignature, SignatureExpired):
        return jsonify(available=False, refresh=True), 409
    body = request.get_json(silent=True) or {}
    kind, tool = body.get('kind'), body.get('tool', '')
    if kind == 'visit':
        event_id, tool = sid, ''
    elif kind == 'job' and tool in TOOLS:
        event_id = body.get('event_id', '')
        if not isinstance(event_id, str) or not re.fullmatch(r'[0-9a-f-]{36}', event_id):
            abort(400)
    else:
        abort(400)
    try:
        result = bridge('event', event_id=event_id, kind=kind, tool=tool)
    except Exception:
        return jsonify(available=False), 503
    global _snapshot, _snapshot_at
    _snapshot, _snapshot_at = result, time.monotonic()
    response = jsonify(available=True, **public_counts(result))
    response.headers['Cache-Control'] = 'no-store'
    response.set_cookie(COOKIE, signer().dumps(sid), httponly=True,
                        secure=request.is_secure, samesite='Lax', max_age=1800)
    return response
