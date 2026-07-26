import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

SEARCH_LINK_PATTERN = r'<a href="search\.html">Search<span class="cn">搜索</span></a>'

CONTACT_LINKS = [
    '<a href="contact.html">Contact<span class="cn">联系</span></a>',
    '<a href="contact.html">Contact <span class="cn">联系</span></a>',
    '<a href="../contact.html">Contact<span class="cn">联系</span></a>',
    '<a href="../../contact.html">Contact<span class="cn">联系</span></a>',
    '<a href="../../../contact.html">Contact<span class="cn">联系</span></a>',
]

def get_prefix(filepath):
    rel = os.path.relpath(filepath, ROOT)
    depth = rel.replace('\\', '/').count('/')
    if depth == 0:
        return ''
    return '/'.join(['..'] * depth) + '/'

def add_search_link(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'search.html' in content:
        return False

    prefix = get_prefix(filepath)
    search_link = f'<a href="{prefix}search.html">Search<span class="cn">搜索</span></a>\n            '

    for contact in CONTACT_LINKS:
        if contact in content:
            content = content.replace(contact, search_link + contact, 1)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True

    return False

def process_directory(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        if SNAPSHOTS_DIR in root:
            continue
        if root.endswith('snapshots'):
            dirs[:] = []
            continue
        if 'node_modules' in root or '.git' in root:
            continue
        for fname in files:
            if fname.endswith('.html'):
                fpath = os.path.join(root, fname)
                if add_search_link(fpath):
                    count += 1
                    print(f'  Added: {os.path.relpath(fpath, ROOT)}')
    return count

if __name__ == '__main__':
    print('Adding Search link to nav bars...')
    total = process_directory(ROOT)
    print(f'\nDone! Updated {total} files.')
