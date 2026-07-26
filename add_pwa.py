import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

def add_pwa(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    changed = False

    if 'manifest.json' not in content:
        rel = os.path.relpath(filepath, ROOT)
        depth = rel.replace('\\', '/').count('/')
        if depth == 0:
            prefix = '.'
        else:
            prefix = '/'.join(['..'] * depth)

        manifest_link = f'    <link rel="manifest" href="{prefix}/manifest.json">\n    <meta name="theme-color" content="#667eea">'
        content = content.replace(
            '    <link rel="stylesheet" href="' + prefix + '/css/theme.css">',
            '    <link rel="stylesheet" href="' + prefix + '/css/theme.css">\n' + manifest_link,
            1
        )
        changed = True

    if 'pwa.js' not in content:
        rel = os.path.relpath(filepath, ROOT)
        depth = rel.replace('\\', '/').count('/')
        if depth == 0:
            prefix = '.'
        else:
            prefix = '/'.join(['..'] * depth)

        pwa_script = f'    <script src="{prefix}/js/pwa.js"></script>'

        if 'js/theme.js' in content:
            content = content.replace(
                '<script src="' + prefix + '/js/theme.js"></script>',
                '<script src="' + prefix + '/js/theme.js"></script>\n' + pwa_script,
                1
            )
            changed = True

    if changed:
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
                if add_pwa(fpath):
                    count += 1
    return count

if __name__ == '__main__':
    print('Adding PWA support to all HTML files...')
    total = process_directory(ROOT)
    print(f'Done! Updated {total} files.')
