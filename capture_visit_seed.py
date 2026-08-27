"""Capture the live public visit counts before a Render deployment."""

from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.request import Request, urlopen


ROOT = Path(__file__).resolve().parent
SEED_PATH = ROOT / "deploy_visit_seed.json"
DEFAULT_URL = "https://browsertools.kr/api/visits"


def read_existing_seed() -> dict:
    try:
        value = json.loads(SEED_PATH.read_text(encoding="utf-8"))
        return value if isinstance(value, dict) else {}
    except (OSError, json.JSONDecodeError):
        return {}


def nonnegative_integer(value, default=0) -> int:
    try:
        return max(0, int(value))
    except (TypeError, ValueError):
        return default


def main() -> None:
    existing = read_existing_seed()
    seed_url = os.getenv("VISITOR_SEED_URL", DEFAULT_URL).strip() or DEFAULT_URL
    live = {}

    try:
        request = Request(seed_url, headers={"User-Agent": "BrowserTools-Deploy/1.0"})
        with urlopen(request, timeout=10) as response:
            value = json.load(response)
            if isinstance(value, dict):
                live = value
    except Exception as error:
        print(f"Visit seed capture skipped: {error}")

    existing_total = nonnegative_integer(existing.get("total"), 1)
    live_total = nonnegative_integer(live.get("total"), 0)
    live_date = str(live.get("date") or "")
    existing_date = str(existing.get("date") or "")

    if live_date and live_date == existing_date:
        today = max(
            nonnegative_integer(existing.get("today"), 1),
            nonnegative_integer(live.get("today"), 0),
        )
        visit_date = live_date
    elif live_date:
        today = nonnegative_integer(live.get("today"), 1)
        visit_date = live_date
    else:
        today = nonnegative_integer(existing.get("today"), 1)
        visit_date = existing_date

    seed = {
        "total": max(existing_total, live_total),
        "today": today,
        "date": visit_date,
    }
    SEED_PATH.write_text(json.dumps(seed, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f"Visit seed ready: total={seed['total']} today={seed['today']} date={seed['date']}")


if __name__ == "__main__":
    main()
