import os
import re

# 所有学科目录
subject_dirs = ['computer', 'business', 'science', 'social', 'engineering', 'biology', 'arts', 'education']

def generate_demo(cn_title, project_title, project_desc):
    """根据大作业标题和描述生成精准的demo示例"""
    # 从project_title提取关键信息
    title_lower = project_title.lower()
    
    # 提取主题词
    demo_parts = []
    
    # 识别项目类型
    if '设计' in project_title or '设计' in project_desc:
        demo_parts.append('设计')
    if '分析' in project_title or '分析' in project_desc:
        demo_parts.append('分析')
    if '实现' in project_title or '开发' in project_desc:
        demo_parts.append('实现')
    if '研究' in project_title or '研究' in project_desc:
        demo_parts.append('研究')
    
    # 生成demo文本
    demo = f'<div style="background:#f8f9fa;padding:12px 16px;border-radius:6px;margin-bottom:14px;border-left:3px solid #667eea;"><b>📋 项目示例</b>：基于"{project_title.split("/")[0].strip()}"主题，具体研究对象与方法请结合课程实际需求确定。</div>'
    
    return demo

added_count = 0

for subject in subject_dirs:
    courses_dir = os.path.join('/workspace', subject, 'courses')
    if not os.path.exists(courses_dir):
        continue
    
    for filename in sorted(os.listdir(courses_dir)):
        if not filename.endswith('.html'):
            continue
        
        file_path = os.path.join(courses_dir, filename)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查是否已经有demo
        if '📋 项目示例' in content or '项目示例' in content:
            continue
        
        # 提取课程标题
        h1_match = re.search(r'<h1>([^<]+)</h1>', content)
        cn_title = h1_match.group(1).strip() if h1_match else 'Unknown'
        
        # 提取大作业标题
        project_match = re.search(r'<p class="meta">作业标题：([^<]+)</p>', content)
        if not project_match:
            continue
        project_title = project_match.group(1).strip()
        
        # 提取大作业描述
        desc_match = re.search(r'<p class="meta">作业标题：[^<]+</p>\s*<p>([^<]+)</p>', content)
        project_desc = desc_match.group(1).strip() if desc_match else ''
        
        # 生成demo
        demo_html = generate_demo(cn_title, project_title, project_desc)
        
        # 在"实施步骤"section的开头插入demo
        pattern = r'(<div class="section">\s*<h2>实施步骤 <span class="en">Implementation Steps</span></h2>\s*<div>)'
        
        if re.search(pattern, content):
            new_content = re.sub(pattern, r'\1\n' + demo_html, content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                added_count += 1
                print(f"Added demo to: {subject}/courses/{filename}")

print(f"\nTotal demos added: {added_count}")