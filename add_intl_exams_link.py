import os
import re

ROOT = '/workspace/intl-exams'

def add_intl_link(filepath, intl_href):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_segment = (
        f'<a href="{intl_href}" style="color:#aaa;text-decoration:none;">International Exams</a>\n'
        f'        <span style="margin:0 6px;">·</span>\n'
        f'        <a href="javascript:window.scrollTo(0,0)" style="color:#aaa;text-decoration:none;">Back to top</a>'
    )
    
    old_pattern = (
        r'<a href="javascript:window\.scrollTo\(0,0\)" '
        r'style="color:#aaa;text-decoration:none;">Back to top</a>'
    )
    
    if '>International Exams</a>' in content:
        return False
    
    new_content = re.sub(old_pattern, new_segment, content)
    
    if new_content == content:
        return False
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

count = 0

# intl-exams/index.html 自身就是首页，不需要加

# al/index.html - 深度 1 层到 intl-exams
for fname in ['al/index.html']:
    fp = os.path.join(ROOT, fname)
    if os.path.exists(fp) and add_intl_link(fp, '../index.html'):
        count += 1
        print(f'OK: {fname}')

# al/caie/ - 深度 2 层
for fname in os.listdir(os.path.join(ROOT, 'al', 'caie')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'al', 'caie', fname)
        if add_intl_link(fp, '../../index.html'):
            count += 1
            print(f'OK: al/caie/{fname}')

# al/edexcel-ial/ - 深度 2 层
for fname in os.listdir(os.path.join(ROOT, 'al', 'edexcel-ial')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'al', 'edexcel-ial', fname)
        if add_intl_link(fp, '../../index.html'):
            count += 1
            print(f'OK: al/edexcel-ial/{fname}')

# al/aqa/ - 深度 2 层
for fname in os.listdir(os.path.join(ROOT, 'al', 'aqa')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'al', 'aqa', fname)
        if add_intl_link(fp, '../../index.html'):
            count += 1
            print(f'OK: al/aqa/{fname}')

# al/ocr/ - 深度 2 层
for fname in os.listdir(os.path.join(ROOT, 'al', 'ocr')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'al', 'ocr', fname)
        if add_intl_link(fp, '../../index.html'):
            count += 1
            print(f'OK: al/ocr/{fname}')

# ig/ - 深度 1 层
for fname in os.listdir(os.path.join(ROOT, 'ig')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'ig', fname)
        if add_intl_link(fp, '../index.html'):
            count += 1
            print(f'OK: ig/{fname}')

# ib/ - 深度 1 层
for fname in os.listdir(os.path.join(ROOT, 'ib')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'ib', fname)
        if add_intl_link(fp, '../index.html'):
            count += 1
            print(f'OK: ib/{fname}')

# ap/ - 深度 1 层
for fname in os.listdir(os.path.join(ROOT, 'ap')):
    if fname.endswith('.html'):
        fp = os.path.join(ROOT, 'ap', fname)
        if add_intl_link(fp, '../index.html'):
            count += 1
            print(f'OK: ap/{fname}')

print(f'\nTotal files updated: {count}')
