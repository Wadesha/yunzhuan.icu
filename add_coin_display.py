import os
import re

BASE = '/workspace/prerequisite'

def add_coin_display(file_path):
    if not os.path.exists(file_path):
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'js/user.js' in content:
        return False
    
    # 在 head 末尾添加 CSS 引用
    content = content.replace(
        '</head>',
        '''<link rel="stylesheet" href="css/user.css">
</head>''',
        count=1
    )
    
    # 在 body 末尾前添加 JS 引用
    content = content.replace(
        '</body>',
        '''<script src="js/user.js"></script>
</body>''',
        count=1
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

def add_coin_display_deep(file_path, depth=0):
    if not os.path.exists(file_path):
        return False
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'js/user.js' in content:
        return False
    
    css_path = '../' * depth + 'css/user.css'
    js_path = '../' * depth + 'js/user.js'
    
    content = content.replace(
        '</head>',
        f'''<link rel="stylesheet" href="{css_path}">
</head>''',
        count=1
    )
    
    content = content.replace(
        '</body>',
        f'''<script src="{js_path}"></script>
</body>''',
        count=1
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

count = 0

# 首页（depth=0）
if add_coin_display(os.path.join(BASE, 'index.html')):
    count += 1
    print('Added: index.html')

# 专业页（depth=1）
for cat in os.listdir(BASE):
    cat_path = os.path.join(BASE, cat)
    if not os.path.isdir(cat_path) or cat in ('css', 'js', 'quiz'):
        continue
    for f in os.listdir(cat_path):
        if f.endswith('.html'):
            p = os.path.join(cat_path, f)
            if add_coin_display_deep(p, 1):
                count += 1
                print(f'Added: {cat}/{f}')

# 课程页（depth=2）
for cat in os.listdir(BASE):
    cat_path = os.path.join(BASE, cat)
    if not os.path.isdir(cat_path) or cat in ('css', 'js', 'quiz'):
        continue
    courses_dir = os.path.join(cat_path, 'courses')
    if not os.path.isdir(courses_dir):
        continue
    for f in os.listdir(courses_dir):
        if f.endswith('.html'):
            p = os.path.join(courses_dir, f)
            if add_coin_display_deep(p, 2):
                count += 1
                print(f'Added: {cat}/courses/{f}')

# 刷题页（depth=1）
quiz_path = os.path.join(BASE, 'quiz', 'index.html')
if add_coin_display_deep(quiz_path, 1):
    count += 1
    print('Added: quiz/index.html')

# 用户档案页（depth=0）
profile_path = os.path.join(BASE, 'profile.html')
if add_coin_display(profile_path):
    count += 1
    print('Added: profile.html')

print(f'\n共为 {count} 个页面添加金币展示')
