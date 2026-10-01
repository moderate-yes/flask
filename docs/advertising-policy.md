# Automatic advertising eligibility

Reviewed 2026-10-01. No countries currently qualify for automatic loading.

Adsterra publisher terms section 4.9 calls for a cookie consent message to
each visitor where cookies collect information. It does not state a country
exception. A cookie-free mode for the deployed tag has not been verified.
Source: https://adsterra.com/publishers-terms-managed/

India's staged DPDP commencement alone does not establish eligibility.
Source: https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf

Policy:
- Advertising disabled: never load the vendor script.
- Explicit refusal: never load, even in an eligible country.
- Explicit permission: allow loading.
- Otherwise: require both a reviewed country and trusted server geolocation.
- Unknown, unverified or malformed location: require permission.

The reviewed set in `ad_policy.py` is deliberately empty. The country decision
branch is preparation, not an active geolocation service. Production currently
requires permission in every country. No external IP lookup is made.

Before enabling a country, record the applicable vendor permission, legal
basis, tag/data-flow review, review date and re-review date here. Then install
and verify a server-side resolver that sets the WSGI environment key
`browserfiletools.verified_country`. Never copy arbitrary request headers,
query parameters, browser language or timezone into that key. A proxy-based
resolver additionally requires an authenticated/restricted origin path and
headers overwritten by the trusted proxy. Re-review the policy when the
vendor tag or applicable requirements change.
