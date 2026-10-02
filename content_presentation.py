"""Keep shared information in one public home without deleting legacy source copy."""
from copy import deepcopy

CONTENT_REDIRECTS = {"/about": "/contact", "/guides": "/learn"}


def streamlined_content(slug, page):
    if slug == 'privacy' and page is not None:
        result = deepcopy(page)
        result['updated'] = 'Last updated: October 2, 2026'
        replaced = {'ADVERTISING AND COOKIES', 'YOUR ADVERTISING CHOICES', 'REGIONAL CONSENT', 'ADVERTISING MEASUREMENT'}
        result['sections'] = [s for s in result['sections'] if s['title'] not in replaced]
        result['sections'].insert(5, {
            'title': 'ADSTERRA ADVERTISING AND YOUR CHOICES',
            'text': 'We offer an optional Adsterra banner. Before using the tools, choose Yes, allow advertising or No, continue without ads in the bottom prompt. Either choice gives access to all tools. Privacy, terms and contact pages remain accessible before choosing. The advertising delivery script is loaded from highrevenueformat.com only after you allow advertising. Adsterra and its advertising partners may process your IP address, device and browser information, cookies and identifiers to deliver and measure advertisements. Our integration does not send selected file contents as advertising parameters. We store your choice in the session cookie bt_ad_choice_v1. Use Advertising preferences in the footer to change your choice, or Turn off advertising below a loaded banner to stop further ad loading by reloading the page. Previously sent information cannot be recalled; third-party cookies can be removed in your browser settings. Google AdSense and Google Ads conversion tags are disabled during this trial.',
            'links': [{'label': 'Adsterra privacy policy', 'url': 'https://adsterra.com/privacy-policy/'}, {'label': 'Adsterra cookies policy', 'url': 'https://adsterra.com/cookies/'}],
        })
        for section in result['sections']:
            if section['title'] == 'ADSTERRA ADVERTISING AND YOUR CHOICES':
                section['text'] = section['text'].replace(
                    'We store your choice in the session cookie bt_ad_choice_v1.',
                    'We store your choice in the cookie bt_ad_choice_v1. Permission is stored for up to 400 days and renewed when you visit a page. Refusal is stored for 24 hours without renewal; after it expires, your next page visit asks again. Your browser may remove or expire cookies earlier. Clearing cookies also removes your choice.'
                )
                section['text'] = section['text'].replace(
                    'Use Advertising preferences in the footer to change your choice, or Turn off advertising below a loaded banner to stop further ad loading by reloading the page.',
                    'Select Turn off advertising below a loaded banner to stop further ad loading by reloading the page. When advertising is off, select Accept advertising cookies in the advertising area to allow it again.'
                )
                section['text'] = section['text'].replace('Yes, allow advertising or No, continue without ads', 'Accept advertising cookies or Reject advertising cookies')
        return result
    if slug != "faq" or page is None:
        return page
    result = deepcopy(page)
    result["description"] = "Sitewide help with browser compatibility, local work, large files, and checking results."
    result["intro"] = "For task-specific instructions, open the relevant tool. These answers cover questions shared across the site."
    shared_questions = {
        "WHAT HAPPENS WHEN I CLOSE A TOOL?",
        "WHICH BROWSERS ARE SUPPORTED?",
        "WHY DOES A LARGE FILE FEEL SLOW?",
        "ARE THE TOOLS GUARANTEED TO BE ERROR-FREE?",
    }
    result["sections"] = [section for section in result["sections"] if section["title"] in shared_questions]
    return result
