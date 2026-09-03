import json
import os
import unittest


os.environ["SITE_URL"] = "https://browserfiletools.net"

from app import app  # noqa: E402


class DomainConfigurationTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

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


if __name__ == "__main__":
    unittest.main()
