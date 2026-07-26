import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

THEME_CSS_LINK = '    <link rel="stylesheet" href="CSS_PATH/css/theme.css">'
THEME_JS_LINK = '    <script src="JS_PATH/js/theme.js"></script>'

def get_path_prefix(html_path):
    rel = os.path.relpath(html_path, ROOT)
    depth = rel.count(os.sep)
    if depth == 0:
        return '.'
    return '/'.join(['..'] * depth)

def add_theme_to_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'theme.css' in content:
        return False

    prefix = get_path_prefix(filepath)

    if '</style>' not in content or '</head>' not in content:
        return False

    css_link = THEME_CSS_LINK.replace('CSS_PATH', prefix)
    js_link = THEME_JS_LINK.replace('JS_PATH', prefix)

    old = '</style>\n</head>'
    new = f'</style>\n{css_link}\n{js_link}\n</head>'
    if old in content:
        content = content.replace(old, new, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    old2 = '</style>\n\n</head>'
    new2 = f'</style>\n\n{css_link}\n{js_link}\n\n</head>'
    if old2 in content:
        content = content.replace(old2, new2, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    head_match = re.search(r'</style>\s*</head>', content)
    if head_match:
        old_text = head_match.group(0)
        new_text = f'</style>\n    <link rel="stylesheet" href="{prefix}/css/theme.css">\n    <script src="{prefix}/js/theme.js"></script>\n</head>'
        content = content.replace(old_text, new_text, 1)
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True

    return False

def process_html_files(directory, skip_snapshots=True):
    count = 0
    for root, dirs, files in os.walk(directory):
        if skip_snapshots and SNAPSHOTS_DIR in root:
            continue
        if skip_snapshots and root.endswith('snapshots'):
            dirs[:] = []
            continue
        if 'node_modules' in root or '.git' in root:
            continue
        for fname in files:
            if fname.endswith('.html'):
                fpath = os.path.join(root, fname)
                if add_theme_to_file(fpath):
                    count += 1
                    print(f'  Added: {os.path.relpath(fpath, ROOT)}')
    return count

if __name__ == '__main__':
    print('Adding dark mode to all HTML files...')
    total = process_html_files(ROOT)
    print(f'\nDone! Updated {total} files.')
