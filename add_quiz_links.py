import os
import re

BASE = '/workspace/prerequisite'

# 课程ID到中文名映射
COURSE_NAMES = {
"math-algebra": "代数基础", "math-calc1": "微积分I", "math-calc2": "微积分II",
"math-discrete": "离散数学入门", "math-stat": "统计学入门",
"physics-mech": "力学基础", "physics-em": "电磁学",
"chem-general": "普通化学", "chem-organic": "有机化学入门",
"bio-general": "普通生物学", "prog-basic": "编程入门",
"logic-reason": "逻辑推理", "digital-literacy": "数字素养",
"eng-graphics": "工程制图", "econ-principles": "经济学原理",
"acct-basic": "会计学基础", "business-law": "商法入门",
"info-tech": "信息技术基础", "communication": "商务沟通",
"lab-tech": "实验室技术", "history-world": "世界历史",
"research-methods": "研究方法", "writing-academic": "学术写作",
"critical-thinking": "批判性思维", "art-history": "艺术史",
"drawing-basic": "绘画基础", "design-principles": "设计原理",
"color-theory": "色彩理论", "digital-tools": "数字工具",
"psych-general": "普通心理学", "child-dev": "儿童发展",
"education-history": "教育史", "learning-theory": "学习理论",
"classroom-mgmt": "课堂管理", "diversity": "多元文化教育",
}

def add_quiz_link(file_path, course_id):
    """在课程页面末尾添加刷题入口"""
    if not os.path.exists(file_path):
        return False

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 如果已经有刷题链接,跳过
    if 'quiz-entry' in content or 'quiz/index.html' in content:
        return False

    course_name = COURSE_NAMES.get(course_id, course_id)

    # 计算正确的相对路径: 课程页在 /学科/courses/xxx.html
    # 刷题页在 /quiz/index.html
    # 相对路径: ../../quiz/?course=xxx
    rel_path = '../../quiz/?course=' + course_id

    quiz_block = f'''
    <div class="quiz-entry" style="background:white;border-radius:8px;padding:16px 18px;margin-top:16px;box-shadow:0 1px 3px rgba(0,0,0,0.05);text-align:center;">
        <p style="color:#666;font-size:0.88rem;margin-bottom:10px;">通过刷题快速了解 {course_name} 的核心概念</p>
        <a href="{rel_path}" style="display:inline-block;padding:10px 32px;background:#667eea;color:white;border-radius:22px;text-decoration:none;font-size:0.95rem;">开始刷题</a>
    </div>
'''

    # 在 footer 之前插入
    footer_pattern = r'(\s*<p class="footer">© 2026 yunzhuan\.icu \| 先修课程导航</p>)'
    if re.search(footer_pattern, content):
        new_content = re.sub(footer_pattern, quiz_block + r'\1', content)
    else:
        # 没有footer就直接加在末尾
        new_content = content + quiz_block

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

# 遍历所有课程页
count = 0
for cat in os.listdir(BASE):
    cat_path = os.path.join(BASE, cat)
    if not os.path.isdir(cat_path) or cat in ('css', 'js', 'quiz'):
        continue
    courses_dir = os.path.join(cat_path, 'courses')
    if not os.path.isdir(courses_dir):
        continue
    for f in os.listdir(courses_dir):
        if f.endswith('.html'):
            course_id = f.replace('.html', '')
            file_path = os.path.join(courses_dir, f)
            if add_quiz_link(file_path, course_id):
                count += 1
                print(f'  Added: {cat}/courses/{f}')

print(f'\n共添加 {count} 个刷题入口')
