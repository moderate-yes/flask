import unittest
from unittest.mock import patch

from ad_policy import advertising_allowed
from app import app


class AdvertisingPolicyTests(unittest.TestCase):
    def test_production_has_no_unverified_exemptions(self):
        for country in ('IN', 'US', 'KR', 'DE', None, '', 'XX'):
            self.assertFalse(advertising_allowed(True, None, {
                'browserfiletools.verified_country': country,
            }))

    def test_reviewed_country_still_requires_trusted_location(self):
        # Synthetic eligibility for testing only; not a real country approval.
        with patch('ad_policy.VERIFIED_AUTO_AD_COUNTRIES', frozenset({'US'})):
            self.assertTrue(advertising_allowed(True, None, {
                'browserfiletools.verified_country': 'US',
            }))
            for country in (None, '', 'IN', 'USA', ['US']):
                self.assertFalse(advertising_allowed(True, None, {
                    'browserfiletools.verified_country': country,
                }))
            self.assertFalse(advertising_allowed(True, None, {
                'HTTP_CF_IPCOUNTRY': 'US',
            }))

    def test_choice_and_disable_override_geography(self):
        with patch('ad_policy.VERIFIED_AUTO_AD_COUNTRIES', frozenset({'US'})):
            environ = {'browserfiletools.verified_country': 'US'}
            self.assertFalse(advertising_allowed(True, 'deny', environ))
            self.assertFalse(advertising_allowed(True, 'invalid', environ))
            self.assertFalse(advertising_allowed(False, 'allow', environ))
            self.assertTrue(advertising_allowed(True, 'allow', {}))

    def test_http_headers_cannot_enable_ads(self):
        with app.test_client() as client:
            response = client.get('/?country=US', headers={
                'CF-IPCountry': 'US', 'X-Country-Code': 'US',
                'Browserfiletools.Verified_Country': 'US',
            })
            self.assertNotIn('highrevenueformat.com', response.get_data(as_text=True))

    def test_automatic_display_keeps_withdrawal_control(self):
        with patch.dict(app.config, ADSTERRA_ENABLED=True), \
                patch('ad_policy.VERIFIED_AUTO_AD_COUNTRIES', frozenset({'US'})), \
                app.test_client() as client:
            environ = {'browserfiletools.verified_country': 'US'}
            html = client.get('/', environ_overrides=environ).get_data(as_text=True)
            self.assertIn('highrevenueformat.com', html)
            self.assertIn('Turn off advertising', html)
            client.post('/advertising-choice', data={'choice': 'deny'})
            html = client.get('/', environ_overrides=environ).get_data(as_text=True)
            self.assertNotIn('highrevenueformat.com', html)


if __name__ == '__main__':
    unittest.main()
