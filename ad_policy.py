"""Fail-closed advertising eligibility; no visitor-supplied country headers."""

# No countries have been verified for automatic loading of this Adsterra tag.
# Add entries only after reviewing both local requirements and vendor terms.
# Review record: docs/advertising-policy.md
VERIFIED_AUTO_AD_COUNTRIES = frozenset()


def advertising_allowed(enabled, choice, environ):
    if not enabled or choice == 'deny':
        return False
    if choice == 'allow':
        return True
    if choice is not None:
        return False
    # Reserved for a future trusted, server-side geolocation integration.
    # HTTP headers become HTTP_* keys, and cannot set this WSGI-only value.
    # No such integration is currently installed: missing country means opt-in.
    country = environ.get('browserfiletools.verified_country')
    return (
        isinstance(country, str)
        and len(country) == 2
        and country.isascii()
        and country.isalpha()
        and country.upper() in VERIFIED_AUTO_AD_COUNTRIES
    )
