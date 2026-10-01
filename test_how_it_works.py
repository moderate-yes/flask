import unittest
from app import app


class HowItWorksTests(unittest.TestCase):
    def test_public_page_and_discovery(self):
        client = app.test_client()
        response = client.get('/how-it-works')
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn('YOUR FILES.<br>YOUR DEVICE.', html)
        self.assertIn('eight-page PDF', html)
        self.assertIn('data-required="false"', html)
        self.assertIn('https://browserfiletools.net/how-it-works', html)
        self.assertIn('/how-it-works', client.get('/sitemap.xml').get_data(as_text=True))
        self.assertIn('HOW IT WORKS', client.get('/').get_data(as_text=True))
