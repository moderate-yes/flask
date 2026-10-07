import json
import os
import unittest
from unittest.mock import patch
from app import app
import usage_stats


class UsageStatsTests(unittest.TestCase):
    def setUp(self):
        self.env = patch.dict(os.environ, {
            'USAGE_SCRIPT_URL': 'https://script.google.com/macros/s/test-deployment/exec',
            'USAGE_SCRIPT_SECRET': 'x' * 48,
        })
        self.env.start()
        self.addCleanup(self.env.stop)
        usage_stats._snapshot = None
        self.events = {}
        self.client = app.test_client()
        def bridge(action, **values):
            if action == 'event':
                self.events.setdefault(values['event_id'], values['kind'])
            return dict(ok=True, visits=list(self.events.values()).count('visit'),
                        jobs=list(self.events.values()).count('job'), started='2026-10-07')
        self.storage = patch.object(usage_stats, 'bridge', side_effect=bridge)
        self.storage.start()
        self.addCleanup(self.storage.stop)

    def test_navigation_and_duplicate_events_are_not_counted_twice(self):
        self.assertEqual(self.client.get('/api/usage').status_code, 200)
        for _ in range(3):
            self.client.post('/api/usage', json={'kind': 'visit'})
            self.client.get('/api/usage')
        event = {'kind': 'job', 'tool': 'pdf-split', 'event_id': '12345678-1234-1234-1234-123456789abc'}
        for _ in range(2):
            self.client.post('/api/usage', json=event)
        result = self.client.get('/api/usage').get_json()
        self.assertEqual((result['visits'], result['jobs']), (1, 1))

    def test_invalid_requests_and_missing_cookie_do_not_record_events(self):
        self.assertEqual(self.client.post('/api/usage', json={'kind': 'visit'}).status_code, 409)
        self.client.get('/api/usage')
        self.assertEqual(self.client.post('/api/usage', json={'kind': 'visit'}, headers={'Origin': 'https://foreign.example'}).status_code, 403)
        self.assertEqual(self.client.post('/api/usage', json={'kind': 'job', 'tool': 'unknown'}).status_code, 400)
        self.assertEqual(self.events, {})

    def test_unavailable_storage_is_not_presented_as_zero(self):
        with patch.object(usage_stats, 'bridge', side_effect=RuntimeError('offline')):
            usage_stats._snapshot = None
            result = self.client.get('/api/usage')
            self.assertEqual(result.status_code, 503)
            self.assertEqual(result.get_json(), {'available': False})

    def test_public_page_never_contains_bridge_secret(self):
        html = self.client.get('/pdf-split').get_data(as_text=True)
        self.assertIn('data-usage-stats', html)
        self.assertNotIn('x' * 48, html)
        self.assertNotIn('test-deployment', html)

    def test_disabled_storage_does_not_display_statistics(self):
        with patch.dict(os.environ, {'USAGE_SCRIPT_URL': '', 'USAGE_SCRIPT_SECRET': ''}):
            self.assertNotIn('data-usage-stats', self.client.get('/').get_data(as_text=True))


if __name__ == '__main__':
    unittest.main()
