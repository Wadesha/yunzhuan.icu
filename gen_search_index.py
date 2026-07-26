import os
import json
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
SNAPSHOTS_DIR = os.path.join(ROOT, 'snapshots')

def extract_text_from_html(html_content):
    text = re.sub(r'<script[^>]*>.*?</script>', '', html_content, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_title(html_content):
    m = re.search(r'<title>(.*?)</title>', html_content, re.DOTALL)
    if m:
        title = m.group(1).strip()
        title = re.sub(r'\s*-\s*yunzhuan\.icu\s*', '', title)
        return title
    return ''

def extract_h1(html_content):
    m = re.search(r'<h1[^>]*>(.*?)</h1>', html_content, re.DOTALL)
    if m:
        return re.sub(r'<[^>]+>', '', m.group(1)).strip()
    return ''

def get_category(filepath):
    rel = os.path.relpath(filepath, ROOT)
    parts = rel.replace('\\', '/').split('/')
    if len(parts) == 1:
        if parts[0] == 'index.html':
            return 'Home'
        return 'Guides'
    cat = parts[0]
    cat_map = {
        'schools': 'Schools',
        'majors': 'Majors',
        'science': 'Majors',
        'engineering': 'Majors',
        'business': 'Majors',
        'humanities': 'Majors',
        'art': 'Majors',
        'social': 'Majors',
        'health': 'Majors',
        'education': 'Majors',
        'tests': 'Tools & Tests',
        'essays': 'Essays',
        'scholarships': 'Scholarships',
        'interviews': 'Interviews',
        'guides': 'Guides',
        'prerequisite': 'Tools',
    }
    return cat_map.get(cat, cat.capitalize())

def build_index():
    pages = []
    for root, dirs, files in os.walk(ROOT):
        if SNAPSHOTS_DIR in root:
            continue
        if root.endswith('snapshots'):
            dirs[:] = []
            continue
        if 'node_modules' in root or '.git' in root:
            continue
        for fname in files:
            if not fname.endswith('.html'):
                continue
            fpath = os.path.join(root, fname)
            try:
                with open(fpath, 'r', encoding='utf-8') as f:
                    content = f.read()
                title = extract_title(content)
                h1 = extract_h1(content)
                text = extract_text_from_html(content)
                url = os.path.relpath(fpath, ROOT).replace('\\', '/')
                category = get_category(fpath)
                pages.append({
                    'url': url,
                    'title': title or h1 or fname,
                    'category': category,
                    'text': text[:1000]
                })
            except Exception as e:
                print(f'Error: {fpath}: {e}')
    return pages

if __name__ == '__main__':
    print('Building search index...')
    pages = build_index()
    output_path = os.path.join(ROOT, 'search-index.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)
    print(f'Indexed {len(pages)} pages -> search-index.json')
