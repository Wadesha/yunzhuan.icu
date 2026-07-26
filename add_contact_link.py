#!/usr/bin/env python3
import os
import re

ROOT = '/workspace'
SKIP_DIRS = {'snapshots', 'node_modules', '.git'}

count = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fname in filenames:
        if not fname.endswith('.html'):
            continue
        fpath = os.path.join(dirpath, fname)
        rel = os.path.relpath(fpath, ROOT)
        depth = rel.count(os.sep)
        prefix = '../' * depth

        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            continue

        contact_html = f'<a href="{prefix}contact.html" style="color:#aaa;text-decoration:none;">Contact</a>'

        m = re.search(
            r'(\n)([ \t]*)(<a href="javascript:window\.scrollTo\(0,0\)"[^>]*>Back to top</a>)',
            content
        )
        if not m:
            m = re.search(
                r'(\n)([ \t]*)(<a href="javascript:window\.scrollTo\(0,0\)"[^>]*>回到顶部</a>)',
                content
            )
        if not m:
            continue

        indent = m.group(2)
        back_to_top_full = m.group(2) + m.group(3)

        old_text = back_to_top_full
        new_text = f'{indent}{contact_html}\n{indent}<span style="margin:0 6px;">·</span>\n{back_to_top_full}'

        if contact_html in content:
            continue

        content = content.replace(old_text, new_text, 1)

        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(content)
        count += 1
        print(f'  OK: {rel}')

print(f'\nDone! Updated {count} pages.')
