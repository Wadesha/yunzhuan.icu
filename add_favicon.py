import os

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

def add_favicon(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'favicon' in content:
        return False

    rel = os.path.relpath(filepath, ROOT)
    depth = rel.replace('\\', '/').count('/')
    if depth == 0:
        prefix = '.'
    else:
        prefix = '/'.join(['..'] * depth)

    favicon_link = f'    <link rel="icon" type="image/svg+xml" href="{prefix}/favicon.svg">'

    if '<title>' in content:
        # Insert after the first <title> tag
        idx = content.find('</title>') + len('</title>')
        content = content[:idx] + '\n' + favicon_link + content[idx:]
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
                if add_favicon(fpath):
                    count += 1
    return count

if __name__ == '__main__':
    print('Adding favicon to all HTML files...')
    total = process_directory(ROOT)
    print(f'Done! Updated {total} files.')
