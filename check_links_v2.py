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
        # 去掉 query string
        href_clean = href.split('?')[0].split('#')[0]
        if not href_clean:
            continue
        if href_clean.startswith('http') or href_clean.startswith('//') or href_clean.startswith('mailto:') or href_clean.startswith('javascript:'):
            continue
        if href_clean.startswith('/'):
            # 根路径,检查相对于 BASE_DIR
            target = href_clean.lstrip('/')
            full_target = os.path.join(BASE_DIR, target)
        else:
            target = os.path.normpath(os.path.join(page_dir, href_clean))
            if target.startswith('..') or target.startswith('/'):
                continue
            full_target = os.path.join(BASE_DIR, target)
        
        # 如果是目录,默认查找 index.html
        if os.path.isdir(full_target):
            full_target = os.path.join(full_target, 'index.html')
        
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
missing_demo = 0
for cp in course_pages:
    page_path = os.path.join(BASE_DIR, cp)
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'demo-box' not in content:
        missing_demo += 1
        print(f'  [警告] {cp}: 缺少学习示例demo')
if missing_demo == 0:
    print('  所有课程页都有学习示例')

# 检查页面是否有增强链接标记
print('\n=== 导航/提示检查 ===')
no_enhanced = []
for page in pages:
    if page in ['quiz/index.html']:
        continue
    page_path = os.path.join(BASE_DIR, page)
    with open(page_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'enhanced-links' not in content:
        no_enhanced.append(page)

print(f'未增强链接的页面: {len(no_enhanced)}')
for p in no_enhanced[:10]:
    print(f'  {p}')
