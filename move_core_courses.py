#!/usr/bin/env python3
"""
将专业导航页面的"核心课程"section 移到页面顶部
（标题下方，介绍section上方）
只处理 science/social/arts/business/engineering 等专业导航页面
不处理大学详情页
"""
import os
import re

ROOT = '/workspace'
TARGET_DIRS = {'science', 'social', 'arts', 'business', 'engineering'}
SKIP_DIRS = {'snapshots', 'node_modules', '.git', 'schools', 'tests', 'essays', 'timeline', 'intl-exams', 'prerequisite', 'admin'}

count = 0

for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    
    rel_dir = os.path.relpath(dirpath, ROOT)
    top_dir = rel_dir.split('/')[0] if rel_dir != '.' else ''
    if top_dir not in TARGET_DIRS:
        continue
    
    for fname in filenames:
        if not fname.endswith('.html'):
            continue
        if 'courses/' in os.path.join(rel_dir, fname):
            continue
            
        fpath = os.path.join(dirpath, fname)
        rel = os.path.relpath(fpath, ROOT)
        
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                content = f.read()
        except Exception:
            continue
        
        if '核心课程' not in content and 'Core Courses' not in content:
            continue
        
        pattern = r'(<div class="section">\s*<h2>核心课程\s*<span class="en">Core Courses</span></h2>\s*<div class="course-list">.*?</div>\s*</div>)'
        match = re.search(pattern, content, re.DOTALL)
        if not match:
            continue
        
        core_section = match.group(1)
        start_pos = match.start()
        end_pos = match.end()
        
        content_without_core = content[:start_pos] + content[end_pos:]
        
        h1_pattern = r'(<h1>.*?</h1>\s*<p class="en-name">.*?</p>\n)'
        h1_match = re.search(h1_pattern, content_without_core)
        if not h1_match:
            continue
        
        insert_pos = h1_match.end()
        new_content = content_without_core[:insert_pos] + '\n    ' + core_section + '\n' + content_without_core[insert_pos:]
        
        if new_content != content:
            with open(fpath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f'  OK: {rel}')

print(f'\nDone! Moved Core Courses section to top in {count} pages.')
