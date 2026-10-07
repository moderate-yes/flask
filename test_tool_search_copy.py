import re
from html import unescape
import unittest

from flask import url_for
from app import app
from seo_pages import TOOL_SEO
from tool_visibility import tool_is_public


class ToolSearchCopyTests(unittest.TestCase):
    def test_each_tool_renders_unique_search_copy(self):
        client = app.test_client()
        titles = set()
        descriptions = set()
        for endpoint, copy in TOOL_SEO.items():
            if not tool_is_public(endpoint):
                continue
            with app.test_request_context():
                path = url_for(endpoint)
            with self.subTest(endpoint=endpoint):
                response = client.get(path)
                self.assertEqual(response.status_code, 200)
                html = response.get_data(as_text=True)
                headings = re.findall(r'<h1\b[^>]*>(.*?)</h1>', html, re.S)
                self.assertEqual([unescape(value) for value in headings], [copy['h1']])
                self.assertIn(copy['intro'], html)
                self.assertIn('FREE', copy['h1'])
                self.assertIn('No account', copy['intro'])
                self.assertNotIn(copy['title'], titles)
                self.assertNotIn(copy['description'], descriptions)
                titles.add(copy['title'])
                descriptions.add(copy['description'])
                self.assertNotIn('sampleTitle', html)
                if endpoint in ['focus_timer', 'calculator', 'qr_generator']:
                    self.assertNotIn('file uploads', copy['intro'])


if __name__ == '__main__':
    unittest.main()
