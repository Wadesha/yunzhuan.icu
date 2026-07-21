# -*- coding: utf-8 -*-
"""
在主站所有页面底部增加常用链接（不显眼）
排除 prerequisite 子站和 snapshots 目录
"""
import os

BASE = '/workspace'
EXCLUDE = {'prerequisite', 'snapshots'}
LINKS_HTML = '''<div style="text-align:center;padding:8px 0;font-size:0.75rem;color:#aaa;">
    <a href="{prereq_url}" style="color:#aaa;text-decoration:none;">先修课程导航</a>
    <span style="margin:0 6px;">·</span>
    <a href="javascript:window.scrollTo(0,0)" style="color:#aaa;text-decoration:none;">回到顶部</a>
    <span style="margin:0 6px;">·</span>
    <a href="{home_url}" style="color:#aaa;text-decoration:none;">网站首页</a>
</div>
<!-- footer-links -->
'''

def get_relative_path(filepath, target):
    """计算从 filepath 到 target 的相对路径"""
    rel = os.path.relpath(target, os.path.dirname(filepath))
    # 确保以 / 分隔，并且目录以 / 结尾
    url = rel.replace(os.sep, '/')
    if os.path.isdir(target) and not url.endswith('/'):
        url += '/'
    return url

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if '<!-- footer-links -->' in content:
        return False

    if '</body>' not in content:
        return False

    # 计算相对路径
    prereq_dir = os.path.join(BASE, 'prerequisite')
    index_file = os.path.join(BASE, 'index.html')

    prereq_url = get_relative_path(filepath, prereq_dir)
    home_url = get_relative_path(filepath, index_file)

    links = LINKS_HTML.format(prereq_url=prereq_url, home_url=home_url)

    content = content.replace('</body>', links + '</body>', count=1)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

count = 0

for root, dirs, files in os.walk(BASE):
    # 排除指定目录
    dirs[:] = [d for d in dirs if d not in EXCLUDE]

    for f in files:
        if not f.endswith('.html'):
            continue
        filepath = os.path.join(root, f)
        if process_file(filepath):
            count += 1

print(f'共为 {count} 个页面添加底部常用链接')
