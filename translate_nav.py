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

        if '回到顶部' not in content:
            continue

        original = content

        content = content.replace('回到顶部', 'Back to top')
        content = content.replace('网站首页', 'Home')
        content = content.replace('先修课程导航', 'Prerequisites')
        content = content.replace('返回本专业', 'Back to Major')
        content = content.replace('下一个课程', 'Next Course')
        content = content.replace('随机课程', 'Random Course')
        content = content.replace('下一个专业', 'Next Major')
        content = content.replace('随机专业', 'Random Major')
        content = content.replace('返回上一页', 'Back')
        content = content.replace('展开全部', 'Expand All')
        content = content.replace('收起', 'Collapse')
        content = content.replace('先修课程导航', 'Prerequisites')

        if content != original:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(content)
            count += 1
            print(f'  OK: {rel}')

print(f'\nDone! Updated {count} pages.')
