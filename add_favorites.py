import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

SUPABASE_CONFIG_TEMPLATE = '''    <script>
    window.SUPABASE_CONFIG = {{
        url: 'https://otfjbzjvkoectpejhxar.supabase.co',
        anonKey: 'sb_publishable_SBRF6ewKH-se3dNlqFwsXQ_lObhamTr'
    }};
    </script>
    <script src="PREFIX/js/auth.js"></script>
    <script src="PREFIX/js/favorites.js"></script>'''

def add_favorites(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'favorites.js' in content:
        return False

    rel = os.path.relpath(filepath, ROOT)
    depth = rel.replace('\\', '/').count('/')
    if depth == 0:
        prefix = '.'
    else:
        prefix = '/'.join(['..'] * depth)

    config_block = SUPABASE_CONFIG_TEMPLATE.replace('PREFIX', prefix)

    if 'theme.js' in content:
        theme_tag = f'<script src="{prefix}/js/theme.js"></script>'
        if theme_tag in content:
            content = content.replace(theme_tag, theme_tag + '\n' + config_block, 1)
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
        path = os.path.relpath(root, ROOT).replace('\\', '/')
        is_school = '/schools/' in path or path.startswith('schools/')
        is_major_dir = any(cat in path for cat in ['science', 'engineering', 'business', 'humanities', 'art', 'social', 'health', 'education', 'majors'])
        if not is_school and not is_major_dir and path != '.':
            continue
        for fname in files:
            if fname.endswith('.html'):
                fpath = os.path.join(root, fname)
                if add_favorites(fpath):
                    count += 1
                    print(f'  Added: {os.path.relpath(fpath, ROOT)}')
    return count

if __name__ == '__main__':
    print('Adding favorites.js to school and major pages...')
    total = process_directory(ROOT)
    print(f'\nDone! Updated {total} files.')
