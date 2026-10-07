import unittest
from pathlib import Path

from app import app
from seo_pages import TOOL_SEO
from tool_visibility import tool_is_public


class ToolGuideCleanupTests(unittest.TestCase):
    def test_public_tool_pages_keep_help_without_sample_blocks(self):
        client = app.test_client()
        with app.test_request_context():
            from flask import url_for
            urls = [url_for(endpoint) for endpoint in TOOL_SEO if tool_is_public(endpoint)]
        for url in urls:
            with self.subTest(url=url):
                response = client.get(url)
                self.assertEqual(response.status_code, 200)
                html = response.get_data(as_text=True)
                self.assertNotIn('sampleTitle', html)
                self.assertNotIn('Check the result:', html)
                self.assertNotIn('Download the four-page practice PDF', html)
                self.assertIn('HOW TO USE IT', html)
                self.assertIn('FREQUENTLY ASKED QUESTIONS', html)

    def test_standalone_tools_have_no_unrelated_recommendations(self):
        client = app.test_client()
        for path in ['/file-hash', '/qr-generator', '/focus-timer', '/calculator']:
            html = client.get(path).get_data(as_text=True)
            self.assertNotIn('Related browser tools', html)
        self.assertIn('Related browser tools', client.get('/').get_data(as_text=True))

    def test_statistics_use_compact_numbers(self):
        css = Path(__file__).with_name('static').joinpath('css/usage-stats.css').read_text()
        self.assertIn('font-size: 8px', css)
        self.assertNotIn('font-size: 26px', css)


if __name__ == '__main__':
    unittest.main()
