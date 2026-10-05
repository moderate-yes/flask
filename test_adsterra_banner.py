import unittest
from app import app


class AdsterraBannerTests(unittest.TestCase):
    def setUp(self):
        self.original = app.config['ADSTERRA_ENABLED']
        app.config['ADSTERRA_ENABLED'] = True
        self.client = app.test_client()

    def tearDown(self):
        app.config['ADSTERRA_ENABLED'] = self.original

    def test_default_preview_does_not_request_vendor(self):
        app.config['ADSTERRA_ENABLED'] = False
        html = self.client.get('/').get_data(as_text=True)
        self.assertEqual(html.count('class="ad-banner"'), 0)
        self.assertNotIn('Advertisement preview — not active', html)
        self.assertNotIn('highrevenueformat.com', html)

    def test_enabled_markup_has_exact_single_unit(self):
        app.config['ADSTERRA_ENABLED'] = True
        self.client.set_cookie('bt_ad_choice_v1', 'allow')
        html = self.client.get('/').get_data(as_text=True)
        self.assertEqual(html.count('https://www.highrevenueformat.com/7b1621a5c77b6e78a09790c1878a8b47/invoke.js'), 1)
        self.assertIn("'height': 250", html)
        self.assertIn("'width': 300", html)
        self.assertNotIn('Advertisement preview — not active', html)

    def test_support_message_is_accurate_and_not_a_click_request(self):
        html = self.client.get('/').get_data(as_text=True)
        self.assertIn('Free to use. No account.', html)
        self.assertIn('Files stay on your device.', html)
        self.assertIn('Ads help keep these tools free.', html)
        self.assertNotIn('No data saved', html)
        self.assertIn('The tools work without advertising consent.', html)

    def test_all_public_pages_have_one_banner(self):
        from build_static import ROUTES
        for enabled in (False, True):
            app.config['ADSTERRA_ENABLED'] = enabled
            self.client.set_cookie('bt_ad_choice_v1', 'allow')
            for path in ROUTES:
                with self.subTest(path=path, enabled=enabled):
                    response = self.client.get(path)
                    self.assertEqual(response.status_code, 200)
                    html = response.get_data(as_text=True)
                    self.assertEqual(html.count('class="ad-banner"'), int(enabled))
                    self.assertEqual(html.count('css/ad-banner.css'), 1)
                    self.assertEqual(html.count('src="https://www.highrevenueformat.com/'), int(enabled))
                    if enabled:
                        self.assertLess(html.index('class="ad-banner"'), html.index('class="site-footer"'))

    def test_error_and_hidden_pages_do_not_load_unit(self):
        app.config['ADSTERRA_ENABLED'] = True
        for path in ['/missing-page', '/path-studio']:
            with self.subTest(path=path):
                html = self.client.get(path).get_data(as_text=True)
                self.assertNotIn('highrevenueformat.com', html)
                self.assertNotIn('class="ad-banner"', html)

    def test_tool_banner_precedes_instructions(self):
        from tool_visibility import SECONDARY_PATHS, EXTRA_PATHS
        for path in ['/', '/pdf-split', '/pdf-organizer', '/pdf-annotations', '/pdf-to-images', '/images-to-pdf', *SECONDARY_PATHS, *EXTRA_PATHS]:
            with self.subTest(path=path):
                html = self.client.get(path).get_data(as_text=True)
                self.assertEqual(html.count('class="ad-banner"'), 1)
                self.assertLess(html.index('class="ad-banner"'), html.index('class="seo-guide"'))

    def test_consent_and_withdrawal(self):
        app.config['ADSTERRA_ENABLED'] = True
        self.assertNotIn('highrevenueformat.com', self.client.get('/').get_data(as_text=True))
        response = self.client.post('/advertising-choice', data={'choice': 'allow', 'next': '/pdf-split'})
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.location, '/pdf-split')
        html = self.client.get('/pdf-split').get_data(as_text=True)
        self.assertIn('highrevenueformat.com', html)
        self.assertNotIn('googletagmanager.com', html)
        self.assertNotIn('adsbygoogle.js', html)
        self.client.post('/advertising-choice', data={'choice': 'deny'})
        self.assertNotIn('highrevenueformat.com', self.client.get('/').get_data(as_text=True))

    def test_choice_rejects_cross_origin_and_external_redirect(self):
        self.assertEqual(self.client.post('/advertising-choice', data={'choice': 'allow'}, headers={'Origin': 'https://evil.example'}).status_code, 403)
        response = self.client.post('/advertising-choice', data={'choice': 'deny', 'next': '//evil.example'})
        self.assertEqual(response.location, '/')

    def test_no_duplicate_advertising_control_when_allowed(self):
        app.config['ADSTERRA_ENABLED'] = True
        self.client.set_cookie('bt_ad_choice_v1', 'allow')
        html = self.client.get('/').get_data(as_text=True)
        self.assertNotIn('data-ad-preferences', html)
        self.assertIn('Turn off advertising', html)
        self.client.set_cookie('bt_ad_choice_v1', 'deny')
        html = self.client.get('/').get_data(as_text=True)
        self.assertNotIn('data-ad-preferences', html)
        banner = html.split('<aside class="ad-banner"', 1)[1].split('</aside>', 1)[0]
        self.assertIn('value="allow" type="submit">Accept advertising cookies', banner)
        self.assertNotIn('highrevenueformat.com', html)
        self.client.post('/advertising-choice', data={'choice': 'allow', 'next': '/'})
        self.assertIn('highrevenueformat.com', self.client.get('/').get_data(as_text=True))
        self.assertNotIn('Turn off advertising', html)

    def test_choice_lifetimes_and_permission_only_renewal(self):
        for choice, seconds in [('allow', 34560000), ('deny', 86400)]:
            response = self.client.post('/advertising-choice', data={'choice': choice})
            cookie = response.headers['Set-Cookie']
            self.assertIn(f'Max-Age={seconds}', cookie)
            self.assertIn('HttpOnly', cookie)
            self.assertIn('SameSite=Lax', cookie)
            response = self.client.get('/')
            cookies = response.headers.getlist('Set-Cookie')
            advertising_cookies = [item for item in cookies if item.startswith('bt_ad_choice_v1=')]
            if choice == 'allow':
                self.assertEqual(len(advertising_cookies), 1)
                self.assertIn('Max-Age=34560000', advertising_cookies[0])
            else:
                self.assertEqual(advertising_cookies, [])
        self.client.delete_cookie('bt_ad_choice_v1')
        html = self.client.get('/').get_data(as_text=True)
        self.assertIn('data-required="true" open', html)
        self.assertNotIn('highrevenueformat.com', html)

    def test_first_visit_requires_choice_but_policy_pages_remain_accessible(self):
        app.config['ADSTERRA_ENABLED'] = True
        for path in ['/', '/pdf-split', '/calculator']:
            html = self.client.get(path).get_data(as_text=True)
            self.assertIn('data-required="true" open', html)
            self.assertNotIn('highrevenueformat.com', html)
            self.assertNotIn('← PDF MERGE', html)
        for path in ['/privacy', '/terms', '/contact']:
            self.assertIn('data-required="false"', self.client.get(path).get_data(as_text=True))
        for choice in ['deny', 'allow']:
            self.client.post('/advertising-choice', data={'choice': choice})
            html = self.client.get('/').get_data(as_text=True)
            self.assertIn('data-required="false"', html)
            self.assertEqual('highrevenueformat.com' in html, choice == 'allow')


if __name__ == '__main__':
    unittest.main()
