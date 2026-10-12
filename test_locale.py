import unittest

from app import app


class LocalePagesTest(unittest.TestCase):
    def setUp(self):
        app.config.update(TESTING=True)
        self.client = app.test_client()

    def test_korean_visitor_starts_on_korean_homepage(self):
        response = self.client.get("/", headers={"CF-IPCountry": "KR"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/ko/")

    def test_korean_visitor_uses_korean_tool_page_by_default(self):
        response = self.client.get("/pdf-split", headers={"CF-IPCountry": "KR"})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.headers["Location"], "/ko/pdf-split")

    def test_explicit_english_choice_is_respected_in_korea(self):
        self.client.set_cookie("bt_locale", "en")
        response = self.client.get("/pdf-split", headers={"CF-IPCountry": "KR"})
        self.assertEqual(response.status_code, 200)
        self.assertIn('<html lang="en">', response.get_data(as_text=True))

    def test_non_korean_visitor_stays_on_english_page(self):
        response = self.client.get("/pdf-split", headers={"CF-IPCountry": "US"})
        self.assertEqual(response.status_code, 200)
        self.assertIn('<html lang="en">', response.get_data(as_text=True))

    def test_search_crawler_is_not_geo_redirected(self):
        response = self.client.get(
            "/pdf-split",
            headers={"CF-IPCountry": "KR", "User-Agent": "Googlebot/2.1"},
        )
        self.assertEqual(response.status_code, 200)

    def test_language_choice_is_remembered(self):
        response = self.client.post(
            "/language",
            data={"locale": "ko", "path": "/pdf-split"},
        )
        self.assertEqual(response.status_code, 303)
        self.assertEqual(response.headers["Location"], "/ko/pdf-split")
        self.assertIn("bt_locale=ko", response.headers["Set-Cookie"])

    def test_korean_page_has_localized_metadata_and_tool_links(self):
        response = self.client.get("/ko/pdf-split")
        html = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn('<html lang="ko">', html)
        self.assertIn('hreflang="en" href="https://browserfiletools.net/pdf-split"', html)
        self.assertIn('hreflang="ko" href="https://browserfiletools.net/ko/pdf-split"', html)
        self.assertIn('href="/ko/pdf-organizer"', html)
        self.assertIn('src="/static/js/locale.js"', html)
        self.assertIn('value="ko" class="active"', html)
        self.assertIn('"inLanguage": "ko-KR"', html)

    def test_information_pages_remain_english(self):
        html = self.client.get("/learn").get_data(as_text=True)
        self.assertIn('<html lang="en">', html)
        self.assertNotIn('src="/static/js/locale.js"', html)
        self.assertIn("LEARN", html)

    def test_pages_include_naver_site_verification(self):
        tag = '<meta name="naver-site-verification" content="fb3623fa57879e66d9b876cafdf79677bef2e77a">'
        english_html = self.client.get("/pdf-split", headers={"CF-IPCountry": "US"}).get_data(as_text=True)
        korean_html = self.client.get("/ko/pdf-split").get_data(as_text=True)
        self.assertIn(tag, english_html)
        self.assertIn(tag, korean_html)

    def test_sitemap_contains_korean_tool_pages(self):
        xml = self.client.get("/sitemap.xml").get_data(as_text=True)
        self.assertIn("https://browserfiletools.net/ko/</loc>", xml)
        self.assertIn("https://browserfiletools.net/ko/pdf-split</loc>", xml)
        self.assertIn('hreflang="ko" href="https://browserfiletools.net/ko/pdf-split"', xml)
        self.assertIn('hreflang="en" href="https://browserfiletools.net/pdf-split"', xml)


if __name__ == "__main__":
    unittest.main()
