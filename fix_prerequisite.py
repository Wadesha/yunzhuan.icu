import os
import re

BASE_DIR = '/workspace/prerequisite'

# 读取课程详情（用于课程导航）
from generate_prerequisite import MAJORS_DATA, COURSE_DETAILS

# 收集所有专业的扁平列表
ALL_MAJORS = []
for cat_key, cat_data in MAJORS_DATA.items():
    for m in cat_data['majors']:
        ALL_MAJORS.append({
            'cat_key': cat_key,
            'cat_name': cat_data['name'],
            'id': m['id'],
            'cn': m['cn'],
            'en': m['en'],
        })

# 按全站统一顺序排列所有专业页
def fix_course_pages():
    """修复课程页面：返回首页链接 + 底部导航"""
    for cat_key, cat_data in MAJORS_DATA.items():
        courses = cat_data['prereq_courses']
        for i, course in enumerate(courses):
            course_id = course['id']
            course_path = os.path.join(BASE_DIR, cat_key, 'courses', f'{course_id}.html')
            if not os.path.exists(course_path):
                continue

            # 计算上下页和所属专业
            prev_course = courses[i-1] if i > 0 else courses[-1]
            next_course = courses[i+1] if i < len(courses)-1 else courses[0]

            # 所属专业（找到该课程的第一个出现的专业）
            owner_major = cat_data['majors'][0]  # 默认第一个专业

            with open(course_path, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1) 修复返回首页链接
            content = content.replace(
                'href="../index.html" class="back-link"',
                'href="../../index.html" class="back-link"'
            )

            # 2) 添加底部导航
            nav_html = f'''
    <div class="course-nav" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:16px;padding:12px 16px;background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);flex-wrap:wrap;">
        <a href="../{owner_major['id']}.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">← 返回{owner_major['cn']}</a>
        <a href="{prev_course['id']}.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">上一门：{prev_course['cn']} →</a>
        <a href="{next_course['id']}.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">下一门：{next_course['cn']} →</a>
        <a href="../../index.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">首页</a>
    </div>
'''
            # 在</div>(最后一个section结束)之后、footer之前插入导航
            # 找 footer 位置
            footer_pattern = r'(\s*<p class="footer">© 2026 yunzhuan\.icu \| 先修课程导航</p>)'
            content = re.sub(footer_pattern, nav_html + r'\1', content)

            with open(course_path, 'w', encoding='utf-8') as f:
                f.write(content)

    print('课程页面导航已添加')


def fix_major_pages():
    """为专业页面添加底部导航"""
    for cat_key, cat_data in MAJORS_DATA.items():
        majors = cat_data['majors']
        for i, m in enumerate(majors):
            page_path = os.path.join(BASE_DIR, cat_key, f'{m["id"]}.html')
            if not os.path.exists(page_path):
                continue

            prev_m = majors[i-1] if i > 0 else majors[-1]
            next_m = majors[i+1] if i < len(majors)-1 else majors[0]

            with open(page_path, 'r', encoding='utf-8') as f:
                content = f.read()

            nav_html = f'''
    <div class="nav-links" style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:16px;padding:12px 16px;background:white;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,0.05);flex-wrap:wrap;">
        <a href="../index.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">← 首页</a>
        <a href="{prev_m['id']}.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">上一个：{prev_m['cn']} →</a>
        <a href="{next_m['id']}.html" style="color:#667eea;text-decoration:none;font-size:0.88rem;">下一个：{next_m['cn']} →</a>
    </div>
'''
            footer_pattern = r'(\s*<p class="footer">© 2026 yunzhuan\.icu \| 先修课程导航</p>)'
            content = re.sub(footer_pattern, nav_html + r'\1', content)

            with open(page_path, 'w', encoding='utf-8') as f:
                f.write(content)

    print('专业页面导航已添加')


def main():
    fix_course_pages()
    fix_major_pages()
    print('完成！')

if __name__ == '__main__':
    main()
