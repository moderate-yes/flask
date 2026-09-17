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

        self.assertEqual(len(locations), 25)
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
        pages = {
            "/focus-timer": "<h1>FOCUS TIMER.</h1>",
            "/calculator": "<h1>MULTI CALCULATOR.</h1>",
        }
        for path, expected_heading in pages.items():
            with self.subTest(path=path):
                response = self.client.get(
                    path,
                    base_url="https://browserfiletools.net",
                )
                html = response.get_data(as_text=True)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(html.count("<h1"), 1)
                self.assertIn(expected_heading, html)


if __name__ == "__main__":
    unittest.main()
