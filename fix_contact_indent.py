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

        bad_pattern = re.compile(
            r'\n\s*<a href="' + re.escape(prefix) + r'contact\.html"[^>]*>Contact</a>\n\s*<span style="margin:0 6px;">·</span>'
        )

        if bad_pattern.search(content):
            content = bad_pattern.sub('', content, count=1)
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f'  FIXED: {rel}')

print(f'\nDone! Fixed {count} pages.')
