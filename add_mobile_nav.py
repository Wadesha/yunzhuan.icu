import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

def get_prefix(filepath):
    rel = os.path.relpath(filepath, ROOT)
    depth = rel.replace('\\', '/').count('/')
    if depth == 0:
        return '.'
    return '/'.join(['..'] * depth)

def add_mobile_nav(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'mobile-nav.js' in content:
        return False

    prefix = get_prefix(filepath)
    script_tag = f'    <script src="{prefix}/js/mobile-nav.js"></script>'

    if 'js/theme.js' in content:
        content = content.replace(
            '<script src="' + prefix + '/js/theme.js"></script>',
            '<script src="' + prefix + '/js/theme.js"></script>\n' + script_tag,
            1
        )
    elif 'theme.js' in content:
        pattern = r'<script src="([^"]*theme\.js)"></script>'
        m = re.search(pattern, content)
        if m:
            content = content.replace(
                m.group(0),
                m.group(0) + '\n' + script_tag,
                1
            )
        else:
            return False
    else:
        return False

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

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
                if add_mobile_nav(fpath):
                    count += 1
    return count

if __name__ == '__main__':
    print('Adding mobile-nav.js to all HTML files...')
    total = process_directory(ROOT)
    print(f'Done! Updated {total} files.')
