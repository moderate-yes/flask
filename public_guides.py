"""Public PDF-focused views; retain paused guide source for later restoration."""
from copy import deepcopy
from learn_pages import LEARN_PAGES
from tool_visibility import tool_is_public, EXTRA_TOOLS_ENABLED


def public_guides():
    result = {slug: deepcopy(page) for slug, page in LEARN_PAGES.items()
              if tool_is_public(page.get('tool_endpoint'))}
    guide = result['practical-tool-examples']
    if not EXTRA_TOOLS_ENABLED:
        guide.update(title='Practical PDF Examples: Split, Merge and Convert',
                 description='Use a four-page sample PDF to check split boundaries, merge order, page-image export and images-to-PDF results.',
                 updated='2026-09-30', reading_time='7 MIN READ')
    guide['sections'] = [s for s in guide['sections'] if tool_is_public(s.get('tool_endpoint'))]
    first = guide['sections'][0]
    if not EXTRA_TOOLS_ENABLED:
        first['paragraphs'][0] = 'The sample PDF has four labeled US Letter pages (612 × 792 points), in this order: Cover, Checklist, Notes, Appendix. Start with this file. The image-to-PDF exercise uses the two PNGs exported in the PDF-to-images exercise below.'
        first['downloads'] = [d for d in first['downloads'] if d['file'] == 'practice-packet.pdf']
    guide['sections'].append({
        'title': 'WHAT WAS CHECKED',
        'paragraphs': [
            'The split, merge, page-image export and images-to-PDF sample workflows were checked locally on September 17, 2026, including their downloaded files. On September 30, automated tests exercised the actual organizer export function with Notes rotated 90 degrees followed by Cover, and a one-page selected extraction. The annotation export functions were tested for adding a highlight and note, editing the saved note data and deleting an annotation after save/reload.',
            'The organizer and annotation outputs were also rendered for inspection. These checks do not cover every browser interaction, password-protected file, digital signature, form, annotation appearance stream or external reader. A viewer may display the same annotation differently. Keep the original and check the output in the reader you intend to use.'
        ]
    })
    return result
