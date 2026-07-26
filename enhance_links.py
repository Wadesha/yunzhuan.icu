import os
import re

BASE = '/workspace/prerequisite'

# 专业分类和链接
CATEGORIES = {
    'computer': ('计算机类', [
        ('cs.html', '计算机科学'),
        ('software.html', '软件工程'),
        ('ai.html', '人工智能'),
        ('data.html', '数据科学'),
        ('cyber.html', '网络安全'),
        ('info.html', '信息系统'),
        ('hci.html', '人机交互'),
    ]),
    'engineering': ('工程类', [
        ('electrical.html', '电气工程'),
        ('mechanical.html', '机械工程'),
        ('biomedical.html', '生物医学工程'),
        ('civil.html', '土木工程'),
        ('chemical.html', '化学工程'),
        ('industrial.html', '工业工程'),
        ('aerospace.html', '航空航天工程'),
    ]),
    'business': ('商科类', [
        ('finance.html', '金融学'),
        ('accounting.html', '会计学'),
        ('analytics.html', '商业分析'),
        ('marketing.html', '市场营销'),
        ('management.html', '管理学'),
        ('international.html', '国际商务'),
        ('supply.html', '供应链管理'),
    ]),
    'biology': ('生物与健康类', [
        ('biomedical.html', '生物医学科学'),
        ('nursing.html', '护理学'),
        ('molecular.html', '分子生物学'),
        ('public.html', '公共卫生'),
        ('neuroscience.html', '神经科学'),
        ('biochemistry.html', '生物化学'),
    ]),
    'social': ('社会科学类', [
        ('economics.html', '经济学'),
        ('psychology.html', '心理学'),
        ('political.html', '政治学'),
        ('sociology.html', '社会学'),
        ('history.html', '历史学'),
        ('anthropology.html', '人类学'),
    ]),
    'science': ('自然科学类', [
        ('physics.html', '物理学'),
        ('chemistry.html', '化学'),
        ('mathematics.html', '数学'),
        ('environmental.html', '环境科学'),
    ]),
    'arts': ('艺术类', [
        ('fine-arts.html', '美术'),
        ('music.html', '音乐'),
        ('design.html', '设计'),
        ('communication.html', '传媒'),
    ]),
    'education': ('教育类', [
        ('education.html', '教育学'),
        ('special.html', '特殊教育'),
        ('early.html', '幼儿教育'),
    ]),
}

# 专业页提示和链接增强
def enhance_major_page(cat, major_file, major_name, all_majors):
    p = os.path.join(BASE, cat, major_file)
    if not os.path.exists(p):
        return False
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<!-- enhanced-links -->' in content:
        return False
    
    # 在专业简介section后加学习提示
    intro_tip = '''\n        <p style="margin-top:10px;color:#667eea;font-size:0.85rem;">提示：建议按下方顺序学习先修课程，课程页底部可进行刷题自测。</p>'''
    content = content.replace(
        '<p>Computer Science is an interdisciplinary field that requires knowledge and skills from multiple areas. This page lists recommended prerequisite courses to prepare students academically.</p>',
        '<p>Computer Science is an interdisciplinary field that requires knowledge and skills from multiple areas. This page lists recommended prerequisite courses to prepare students academically.</p>' + intro_tip
    )
    # 通用版本（替换中文p标签后的英文段落）
    content = re.sub(
        r'(</p>\s*<p style="margin-top:8px;">[^<]*</p>)',
        r'\1\n        <p style="margin-top:10px;color:#667eea;font-size:0.85rem;">提示：建议按顺序学习下方先修课程，每门课程页底部有刷题入口，可用于自测。</p>',
        content,
        count=1
    )
    
    # 在footer前加统一导航
    footer_pos = content.rfind('<p class="footer">')
    key = (cat, major_file)
    nav = f'''    <div class="global-nav" style="margin-top:18px;padding:14px 16px;background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);font-size:0.85rem;">
        <div style="margin-bottom:8px;color:#666;"><b>导航：</b></div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <a href="../index.html" style="color:#667eea;text-decoration:none;">← 返回首页</a>
            <a href="{all_majors[key][0]}" style="color:#667eea;text-decoration:none;">上一个：{all_majors[key][1]}</a>
            <a href="{all_majors[key][2]}" style="color:#667eea;text-decoration:none;">下一个：{all_majors[key][3]}</a>
            <a href="https://yunzhuan.icu/" style="color:#667eea;text-decoration:none;" target="_blank">主站 yunzhuan.icu →</a>
        </div>
    </div>
    <!-- enhanced-links -->
'''
    if footer_pos > 0:
        content = content[:footer_pos] + nav + content[footer_pos:]
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    return True


def get_major_order():
    """返回每个专业的上一个/下一个链接"""
    orders = {}
    for cat, (cn, majors) in CATEGORIES.items():
        for i, (mf, mname) in enumerate(majors):
            prev = majors[i-1] if i > 0 else majors[-1]
            next_ = majors[i+1] if i < len(majors)-1 else majors[0]
            orders[(cat, mf)] = (prev[0], prev[1], next_[0], next_[1])
    return orders

# 增强首页
def enhance_index():
    p = os.path.join(BASE, 'index.html')
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<!-- enhanced-links -->' in content:
        return False
    
    # 在subtitle后加主站链接
    content = content.replace(
        '<p class="subtitle">Prerequisite Courses Navigation</p>',
        '''<p class="subtitle">Prerequisite Courses Navigation</p>
    <div style="text-align:center;margin-bottom:16px;">
        <a href="https://yunzhuan.icu/" style="color:#667eea;text-decoration:none;font-size:0.85rem;" target="_blank">← 返回 yunzhuan.icu 主站</a>
    </div>'''
    )
    
    # 在统计后加提示
    content = content.replace(
        '</div>\n\n    <div class="category">',
        '''</div>

    <div style="background:#f0f4ff;border-left:3px solid #667eea;padding:10px 14px;border-radius:6px;margin-bottom:16px;font-size:0.85rem;color:#555;">
        提示：点击下方专业名称查看先修课程列表，每门课程页底部可刷题自测。建议按课程顺序学习。
    </div>

    <div class="category">''',
        count=1
    )
    
    # 底部加导航
    footer_pos = content.rfind('<p class="footer">')
    nav = '''    <div style="text-align:center;margin-top:20px;padding:14px;background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);font-size:0.85rem;">
        <a href="https://yunzhuan.icu/" style="color:#667eea;text-decoration:none;margin:0 10px;" target="_blank">主站首页</a>
        <span style="color:#ccc;">|</span>
        <a href="javascript:window.scrollTo(0,0)" style="color:#667eea;text-decoration:none;margin:0 10px;">回到顶部</a>
    </div>
    <!-- enhanced-links -->
'''
    if footer_pos > 0:
        content = content[:footer_pos] + nav + content[footer_pos:]
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

# 增强课程页
def enhance_course_page(cat, course_file):
    p = os.path.join(BASE, cat, 'courses', course_file)
    if not os.path.exists(p):
        return False
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<!-- enhanced-links -->' in content:
        return False
    
    major_file = os.path.basename(os.path.dirname(os.path.dirname(p))) + '.html'
    # 实际上应该找对应专业文件，这里简化：链接到上级目录的同名专业
    # 从目录结构看：computer/courses/prog-basic.html 的专业页是 computer/cs.html
    # 我们使用 ../{cat_short}.html 不太对，应该用课程列表中引用该课程的专业
    # 简化：返回 ../index.html
    
    # 在课程介绍后加提示
    content = re.sub(
        r'(</p>\s*<p style="margin-top:8px;">[^<]*</p>)',
        r'\1\n        <p style="margin-top:10px;color:#667eea;font-size:0.85rem;">提示：建议先理解本课程介绍和示例，然后点击下方按钮进行刷题自测。</p>',
        content,
        count=1
    )
    
    # 底部加主站链接
    footer_pos = content.rfind('<p class="footer">')
    nav = f'''    <div class="global-nav" style="margin-top:18px;padding:14px 16px;background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);font-size:0.85rem;">
        <div style="margin-bottom:8px;color:#666;"><b>快速导航：</b></div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;">
            <a href="../index.html" style="color:#667eea;text-decoration:none;">← 返回专业</a>
            <a href="../../index.html" style="color:#667eea;text-decoration:none;">首页</a>
            <a href="https://yunzhuan.icu/" style="color:#667eea;text-decoration:none;" target="_blank">主站 yunzhuan.icu →</a>
        </div>
    </div>
    <!-- enhanced-links -->
'''
    if footer_pos > 0:
        content = content[:footer_pos] + nav + content[footer_pos:]
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

# 增强刷题页
def enhance_quiz_page():
    p = os.path.join(BASE, 'quiz', 'index.html')
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()
    if '<!-- enhanced-links -->' in content:
        return False
    
    # 在progress-bar前加提示
    content = content.replace(
        '<div class="progress-bar">',
        '''<div style="background:#f0f4ff;border-left:3px solid #667eea;padding:8px 12px;border-radius:6px;margin-bottom:12px;font-size:0.8rem;color:#555;">
        提示：按键盘 1-4 选择答案，按空格键朗读题干，答对可获得 1 金币。
    </div>
    <div class="progress-bar">''',
        count=1
    )
    
    # 在结果页加导航
    content = content.replace(
        '<a href="javascript:history.back()" class="btn ghost">返回课程</a>',
        '''<a href="javascript:history.back()" class="btn ghost">返回课程</a>
      <a href="../index.html" class="btn ghost">浏览其他课程</a>''',
        count=1
    )
    
    # 标记
    content = content.replace('</body>', '<!-- enhanced-links -->\n</body>')
    
    with open(p, 'w', encoding='utf-8') as f:
        f.write(content)
    return True

if __name__ == '__main__':
    orders = get_major_order()
    count = 0
    
    # 首页
    if enhance_index():
        count += 1
        print('Enhanced: index.html')
    
    # 专业页
    for (cat, mf), (prev_f, prev_n, next_f, next_n) in orders.items():
        if enhance_major_page(cat, mf, '', orders):
            count += 1
            print(f'Enhanced major: {cat}/{mf}')

    # 重新加载orders字典(因为enhance_major_page可能修改文件,不影响orders,但这里保持清晰)
    orders = get_major_order()
    
    # 课程页
    for cat, (cn, _) in CATEGORIES.items():
        courses_dir = os.path.join(BASE, cat, 'courses')
        if os.path.isdir(courses_dir):
            for f in os.listdir(courses_dir):
                if f.endswith('.html'):
                    if enhance_course_page(cat, f):
                        count += 1
                        print(f'Enhanced course: {cat}/courses/{f}')
    
    # 刷题页
    if enhance_quiz_page():
        count += 1
        print('Enhanced: quiz/index.html')
    
    print(f'\n共增强 {count} 个页面')
