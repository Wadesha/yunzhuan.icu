import os
import re

BASE_DIR = '/workspace/prerequisite'

pages = []
for root, dirs, files in os.walk(BASE_DIR):
    for f in files:
        if f.endswith('.html'):
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, BASE_DIR)
            pages.append(rel_path)

print(f'共发现 {len(pages)} 个HTML页面')

# 检测所有链接
broken = []
for page in pages:
    page_path = os.path.join(BASE_DIR, page)
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    hrefs = re.findall(r'href="([^"#]+)"', content)
    page_dir = os.path.dirname(page)
    for href in hrefs:
        if href.startswith('http') or href.startswith('//') or href.startswith('mailto:'):
            continue
        if href.startswith('/'):
            continue
        target = os.path.normpath(os.path.join(page_dir, href))
        if target.startswith('..'):
            continue
        full_target = os.path.join(BASE_DIR, target)
        if not os.path.exists(full_target):
            broken.append((page, href, target))

print(f'\n发现 {len(broken)} 个无效链接：')
for page, href, target in broken:
    print(f'  [{page}] -> {href} (解析为: {target})')

# 检查所有专业页面是否都有先修课程
print('\n=== 各专业页面先修课程数量 ===')
for page in pages:
    if page.count('/') == 1 and page.endswith('.html'):
        page_path = os.path.join(BASE_DIR, page)
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        course_links = re.findall(r'courses/([\w-]+)\.html', content)
        if course_links:
            print(f'  {page}: {len(set(course_links))} 门课程')
        else:
            print(f'  [警告] {page}: 没有先修课程')

# 检查课程页面是否有demo
print('\n=== 课程页面检查 ===')
course_pages = [p for p in pages if '/courses/' in p]
print(f'共 {len(course_pages)} 个课程页面')
for cp in course_pages:
    page_path = os.path.join(BASE_DIR, cp)
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'demo-box' not in content:
        print(f'  [警告] {cp}: 缺少学习示例demo')

# 检查专业页面是否有导航
print('\n=== 专业页面导航检查 ===')
for page in pages:
    if page.count('/') == 1 and page.endswith('.html'):
        page_path = os.path.join(BASE_DIR, page)
        with open(page_path, 'r', encoding='utf-8') as f:
            content = f.read()
        if 'nav-links' not in content and 'nav-link' not in content:
            print(f'  [提示] {page}: 缺少底部导航')
