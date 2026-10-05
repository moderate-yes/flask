import unittest
from app import app
from build_static import ROUTES


class AdvertisingShutdownTests(unittest.TestCase):
    def setUp(self):
        previous = app.config['ADSTERRA_ENABLED']
        self.addCleanup(app.config.__setitem__, 'ADSTERRA_ENABLED', previous)
        app.config['ADSTERRA_ENABLED'] = False

    def test_shutdown_blocks_scripts_and_consent_for_all_choices(self):
        for choice in (None, 'allow', 'deny'):
            client = app.test_client()
            if choice:
                client.set_cookie('bt_ad_choice_v1', choice)
            for route in ROUTES:
                with self.subTest(choice=choice, route=route):
                    response = client.get(route)
                    self.assertEqual(response.status_code, 200)
                    html = response.get_data(as_text=True)
                    self.assertNotIn('src="https://www.highrevenueformat.com/', html)
                    self.assertNotIn('id="advertisingChoice"', html)
                    self.assertNotIn('type="submit">Accept advertising cookies', html)
