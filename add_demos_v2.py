import os
import re

subject_dirs = ['computer', 'business', 'science', 'social', 'engineering', 'biology', 'arts', 'education']

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
        if '📋' in content or '项目示例' in content:
            continue
        
        # 提取大作业标题（中文部分）
        project_match = re.search(r'<p class="meta">作业标题：([^/]+)/', content)
        if not project_match:
            project_match = re.search(r'<p class="meta">作业标题：([^<]+)</p>', content)
        if not project_match:
            continue
        project_title = project_match.group(1).strip()
        
        # 提取大作业描述（中文）
        desc_match = re.search(r'<p class="meta">作业标题：[^<]+</p>\s*<p>([^<]+)</p>', content)
        project_desc = desc_match.group(1).strip() if desc_match else ''
        
        # 根据项目标题和描述生成具体demo
        # 从描述中提取关键信息
        demo_text = f'以"{project_title}"为研究对象，具体选题可根据实际需求调整。'
        
        # 尝试从描述中提取更具体的信息
        if '如' in project_desc and '）' in project_desc:
            # 提取括号内的示例
            example_match = re.search(r'如([^）]+）', project_desc)
            if example_match:
                example = example_match.group(1)
                demo_text = f'以{example}为具体研究对象，开展{project_title}相关工作。'
        
        demo_html = f'<div style="background:#f8f9fa;padding:10px 14px;border-radius:6px;margin-bottom:12px;border-left:3px solid #667eea;font-size:0.88rem;"><b>📋 项目示例</b>：{demo_text}</div>'
        
        # 在实施步骤section的开头插入
        pattern = r'(<div class="section">\s*<h2>实施步骤 <span class="en">Implementation Steps</span></h2>\s*<div>)'
        
        if re.search(pattern, content):
            new_content = re.sub(pattern, r'\1\n' + demo_html, content)
            
            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                added_count += 1

print(f"Total demos added: {added_count}")