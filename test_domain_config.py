import json
import os
import unittest
from xml.etree import ElementTree


os.environ["SITE_URL"] = "https://browserfiletools.net"

from app import app  # noqa: E402
from site_metadata import SITEMAP_LASTMOD  # noqa: E402


class DomainConfigurationTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_public_pages_do_not_display_or_load_visitor_counter(self):
        from build_static import ROUTES

        for route in ROUTES:
            with self.subTest(route=route):
                response = self.client.get(
                    route, base_url="https://browserfiletools.net"
                )
                self.assertEqual(response.status_code, 200)
                html = response.get_data(as_text=True)
                self.assertNotIn("data-visit-total", html)
                self.assertNotIn("data-visit-today", html)
                self.assertNotIn("visitor-counter.js", html)
                self.assertNotIn("VISITOR COUNTER", html)
                self.assertIn('aria-label="Site information"', html)

    def test_practical_guide_and_assets_are_available(self):
        import hashlib
        from practical_guide import PRACTICAL_GUIDE
        from build_static import ROUTES, INDEXED_ROUTES

        route = "/learn/practical-tool-examples"
        response = self.client.get(route)
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertEqual(html.count("<h1"), 1)
        self.assertIn(route, ROUTES)
        self.assertIn(route, INDEXED_ROUTES)
        self.assertIn(route, self.client.get("/learn").get_data(as_text=True))
        self.assertIn(route, self.client.get("/sitemap.xml").get_data(as_text=True))
        for section in PRACTICAL_GUIDE["sections"]:
            assets = list(section.get("downloads", []))
            if section.get("image"):
                assets.append(section["image"])
                self.assertTrue(section["image"]["alt"])
            for asset in assets:
                path = "/static/guide-examples/" + asset["file"]
                self.assertIn(path, html)
                result = self.client.get(path)
                self.assertEqual(result.status_code, 200)
                result.close()
        sample = self.client.get("/static/guide-examples/abc.txt")
        self.assertEqual(sample.data, b"abc")
        self.assertIn(hashlib.sha256(sample.data).hexdigest(), html)
        sample.close()

    def test_legacy_render_domain_redirects_permanently(self):
        response = self.client.get(
            "/pdf-split?source=test",
            base_url="https://flask-v57n.onrender.com",
        )
        self.assertEqual(response.status_code, 301)
        self.assertEqual(
            response.headers["Location"],
            "https://browserfiletools.net/pdf-split?source=test",
        )

    def test_health_check_remains_available_on_render_hostname(self):
        response = self.client.get(
            "/healthz",
            base_url="https://flask-v57n.onrender.com",
        )
        self.assertEqual(response.status_code, 200)

    def test_browsertools_domain_is_not_redirected_to_primary_site(self):
        for hostname in ("browsertools.kr", "www.browsertools.kr"):
            response = self.client.get(
                "/pdf-split?source=test",
                base_url=f"https://{hostname}",
            )
            self.assertEqual(response.status_code, 200)
            self.assertNotIn("Location", response.headers)

    def test_page_metadata_uses_primary_domain(self):
        response = self.client.get(
            "/pdf-split",
            base_url="https://browserfiletools.net",
        )
        html = response.get_data(as_text=True)

        self.assertEqual(response.status_code, 200)
        self.assertIn(
            '<link rel="canonical" href="https://browserfiletools.net/pdf-split">',
            html,
        )
        self.assertIn(
            '<meta property="og:url" content="https://browserfiletools.net/pdf-split">',
            html,
        )
        self.assertIn("https://schema.org", html)
        self.assertIn("https://browserfiletools.net/pdf-split", html)

        json_ld_blocks = []
        marker = '<script type="application/ld+json">'
        for block in html.split(marker)[1:]:
            json_ld_blocks.append(json.loads(block.split("</script>", 1)[0]))
        self.assertTrue(json_ld_blocks)

    def test_robots_and_sitemap_use_primary_domain(self):
        robots = self.client.get(
            "/robots.txt",
            base_url="https://browserfiletools.net",
        ).get_data(as_text=True)
        sitemap = self.client.get(
            "/sitemap.xml",
            base_url="https://browserfiletools.net",
        ).get_data(as_text=True)

        self.assertIn(
            "Sitemap: https://browserfiletools.net/sitemap.xml",
            robots,
        )
        self.assertIn("<loc>https://browserfiletools.net/</loc>", sitemap)
        self.assertNotIn("flask-v57n.onrender.com", robots + sitemap)

        root = ElementTree.fromstring(sitemap)
        namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
        entries = root.findall("sm:url", namespace)
        locations = [entry.findtext("sm:loc", namespaces=namespace) for entry in entries]
        last_modified = [entry.findtext("sm:lastmod", namespaces=namespace) for entry in entries]

        self.assertEqual(len(locations), 21)
        self.assertEqual(len(locations), len(set(locations)))
        self.assertNotIn("https://browserfiletools.net/path-studio", locations)
        self.assertTrue(all(location.startswith("https://browserfiletools.net/") for location in locations))
        self.assertTrue(all(value == SITEMAP_LASTMOD for value in last_modified))

    def test_path_studio_is_no_longer_public(self):
        response = self.client.get(
            "/path-studio",
            base_url="https://browserfiletools.net",
        )
        self.assertEqual(response.status_code, 404)

    def test_focus_timer_and_calculator_have_one_primary_heading(self):
        from unittest.mock import patch
        pages = {
            "/focus-timer": "<h1>FOCUS TIMER.</h1>",
            "/calculator": "<h1>MULTI CALCULATOR.</h1>",
        }
        for path, expected_heading in pages.items():
            with self.subTest(path=path):
                with patch("tool_visibility.SECONDARY_TOOLS_ENABLED", True):
                    response = self.client.get(path, base_url="https://browserfiletools.net")
                html = response.get_data(as_text=True)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(html.count("<h1"), 1)
                self.assertIn(expected_heading, html)

    def test_paused_tools_are_not_public(self):
        from build_static import ROUTES, INDEXED_ROUTES
        for path in ("/focus-timer", "/calculator"):
            self.assertEqual(self.client.get(path).status_code, 404)
            self.assertNotIn(path, ROUTES)
            self.assertNotIn(path, INDEXED_ROUTES)
            self.assertNotIn(path, self.client.get("/sitemap.xml").get_data(as_text=True))
        for path in ROUTES:
            with self.subTest(path=path):
                html = self.client.get(path).get_data(as_text=True).lower()
                self.assertNotIn("/focus-timer", html)
                self.assertNotIn("/calculator", html)
                self.assertNotIn("focus timer", html)
                self.assertNotIn("calculator", html)

    def test_simplified_navigation_and_retained_help_pages(self):
        import re
        html = self.client.get('/').get_data(as_text=True)
        footer = html.split('<footer class="site-footer">', 1)[1].split('</footer>', 1)[0]
        self.assertEqual(re.findall(r'href="([^"]+)"', footer),
                         ['/learn', '/contact', '/privacy'])
        learn = self.client.get('/learn').get_data(as_text=True)
        for path in ('/faq', '/learn/practical-tool-examples'):
            self.assertIn('href="' + path + '"', learn)
            self.assertEqual(self.client.get(path).status_code, 200)

    def test_contact_has_only_requested_introduction(self):
        html = self.client.get('/contact').get_data(as_text=True)
        self.assertEqual(html.count('<h1'), 1)
        self.assertIn('Free · Unlimited use · Privacy-first.', html)
        self.assertNotIn('No daily usage quota.', html)
        self.assertNotIn('Independently operated by', html)
        self.assertIn('href="/privacy"', html)
        self.assertNotIn('href="/terms"', html)
        for path in ('/privacy', '/terms'):
            self.assertEqual(self.client.get(path).status_code, 200)
        for old_path, destination in (('/about', '/contact'), ('/guides', '/learn')):
            response = self.client.get(old_path)
            self.assertEqual(response.status_code, 301)
            self.assertEqual(response.headers['Location'], destination)
            self.assertNotIn('<loc>https://browserfiletools.net' + old_path + '</loc>', self.client.get('/sitemap.xml').get_data(as_text=True))
        from content_presentation import streamlined_content
        from content_pages import PAGES
        self.assertEqual(len(streamlined_content('faq', PAGES['faq'])['sections']), 4)

    def test_privacy_disclosures_and_sitewide_footer(self):
        import re
        from build_static import ROUTES
        for route in ROUTES:
            with self.subTest(route=route):
                html = self.client.get(route).get_data(as_text=True)
                footer = html.split('<footer class="site-footer">', 1)[1].split('</footer>', 1)[0]
                self.assertEqual(re.findall(r'href="([^"]+)"', footer),
                                 ['/learn', '/contact', '/privacy'])
        html = self.client.get('/privacy').get_data(as_text=True)
        self.assertIn('<h1>PRIVACY POLICY</h1>', html)
        self.assertIn('href="https://adssettings.google.com/"', html)
        self.assertIn('href="https://www.aboutads.info/choices/"', html)
        self.assertIn('Google Ads conversion tracking', html)
        self.assertNotIn('does not yet run its own cookie-consent banner', html)

    def test_paused_tool_documentation_is_retained(self):
        from content_pages import PAGES
        from tool_visibility import public_content_page
        from unittest.mock import patch
        original = PAGES["guides"]
        self.assertTrue(any(s.get("endpoint") == "calculator" for s in original["sections"]))
        public_content_page("guides", original)
        self.assertTrue(any(s.get("endpoint") == "calculator" for s in original["sections"]))
        with patch("tool_visibility.SECONDARY_TOOLS_ENABLED", True):
            self.assertIs(public_content_page("guides", original), original)
            self.assertIn('/focus-timer', self.client.get('/').get_data(as_text=True))
            self.assertIn('/calculator', self.client.get('/sitemap.xml').get_data(as_text=True))


if __name__ == "__main__":
    unittest.main()
