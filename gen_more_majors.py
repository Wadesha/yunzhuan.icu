#!/usr/bin/env python3
"""
批量生成专业详情页
增加更多热门专业到各个分类
"""

import os

# 定义要新增的专业
new_majors = [
    # 计算机类
    {
        "category": "computer",
        "filename": "game-design.html",
        "cn_name": "游戏设计",
        "en_name": "Game Design & Development",
        "cn_intro": "游戏设计专业融合计算机科学、艺术设计和叙事表达，培养学生创建互动游戏和交互体验的能力。课程涵盖游戏引擎、关卡设计、游戏编程、3D建模、角色设计、用户体验等。游戏产业是增长最快的娱乐产业之一，毕业生可就业方向包括游戏开发、VR/AR、交互设计、动画等。",
        "en_intro": "Game Design combines computer science, art and design, and narrative expression, training students to create interactive games and experiences. Curriculum covers game engines, level design, game programming, 3D modeling, character design, and user experience. The gaming industry is one of the fastest-growing entertainment sectors, with graduates going into game development, VR/AR, interaction design, animation, and more.",
        "core_courses": ["Game Programming", "Level Design", "3D Modeling & Animation", "Game Engines (Unity/Unreal)", "Interactive Storytelling", "Game AI", "Game Production"],
        "careers": ["Game Designer", "Game Programmer", "3D Artist", "Level Designer", "VR/AR Developer", "Technical Artist"],
        "avg_salary": "$70,000 - $120,000+",
    },
    # 计算机类
    {
        "category": "computer",
        "filename": "web-development.html",
        "cn_name": "网页开发",
        "en_name": "Web Development",
        "cn_intro": "网页开发专注于构建和移动网站和Web应用程序的开发，前端开发用户界面、后端服务器逻辑、以及全栈开发。课程涵盖 HTML/CSS、JavaScript、React/Vue、Node.js、数据库、API 设计等。Web开发是需求最大的IT方向之一，几乎每行业都需要Web开发者。",
        "en_intro": "Web Development focuses on building websites and web applications, covering frontend user interfaces, backend server logic, and full-stack development. Curriculum includes HTML/CSS, JavaScript, React/Vue, Node.js, databases, API design, and more. Web development is one of the most in-demand IT fields, with every industry needing web developers.",
        "core_courses": ["Frontend Development", "Backend Development", "Database Design", "JavaScript Frameworks", "Web Security", "Responsive Design"],
        "careers": ["Frontend Developer", "Backend Developer", "Full-Stack Developer", "Web Designer", "DevOps Engineer"],
        "avg_salary": "$65,000 - $110,000",
    },
    # 商科类
    {
        "category": "business",
        "filename": "entrepreneurship.html",
        "cn_name": "创业学",
        "en_name": "Entrepreneurship",
        "cn_intro": "创业学教授如何创立和管理新企业，涵盖商业计划、融资、产品开发、市场营销、财务管理、团队建设、风险投资。学生学习如何将创意转化为可落地的商业机会。毕业生可以自己创业，也可以在大公司内部创新创业，或加入初创公司、风险投资、咨询等领域。",
        "en_intro": "Entrepreneurship teaches students how to start and manage new ventures, covering business planning, fundraising, product development, marketing, financial management, team building, and venture capital. Students learn how to turn ideas into viable business opportunities. Graduates can start their own companies, innovate within large corporations, or join startups, venture capital, consulting, and more.",
        "core_courses": ["New Venture Creation", "Business Plan Development", "Venture Capital & Financing", "Entrepreneurial Finance", "Startup Marketing", "Innovation Management"],
        "careers": ["Entrepreneur", "Startup Founder", "Venture Capital", "Management Consultant", "Business Development", "Product Manager"],
        "avg_salary": "Varies widely",
    },
    # 商科
    {
        "category": "business",
        "filename": "hr.html",
        "cn_name": "人力资源管理",
        "en_name": "Human Resource Management",
        "cn_intro": "人力资源管理专注于组织中的人力管理，包括招聘、培训、绩效管理、薪酬福利、员工关系、组织发展。人力资源是企业的重要职能，毕业生在各行业都有需求，尤其是科技、金融、咨询、制造业等。HR的方向包括人才招聘、培训发展、薪酬福利、员工关系、组织发展。",
        "en_intro": "Human Resource Management focuses on managing people in organizations, including recruiting, training, performance management, compensation and benefits, employee relations, and organizational development. HR is an essential business function, with opportunities across all industries including tech, finance, consulting, and manufacturing.",
        "core_courses": ["Talent Acquisition", "Training & Development", "Compensation & Benefits", "Organizational Behavior", "Employment Law", "HR Analytics"],
        "careers": ["HR Generalist", "Recruiter", "Training Specialist", "Compensation Analyst", "HR Manager", "Talent Development"],
        "avg_salary": "$55,000 - $95,000",
    },
    # 工程类
    {
        "category": "engineering",
        "filename": "materials.html",
        "cn_name": "材料工程",
        "en_name": "Materials Science & Engineering",
        "cn_intro": "材料工程研究材料的结构、性能、加工和应用，涵盖金属、陶瓷、聚合物、复合材料、半导体、纳米材料等。材料是所有工程的基础，在航空航天、电子、能源、生物医学、汽车等行业都有广泛应用。",
        "en_intro": "Materials Science and Engineering studies the structure, properties, processing, and applications of materials, including metals, ceramics, polymers, composites, semiconductors, and nanomaterials. Materials are the foundation of all engineering, with applications in aerospace, electronics, energy, biomedicine, automotive, and more.",
        "core_courses": ["Thermodynamics", "Materials Structure", "Materials Properties", "Materials Processing", "Polymer Science", "Nanotechnology"],
        "careers": ["Materials Engineer", "R&D Scientist", "Process Engineer", "Quality Engineer", "Semiconductor Engineer"],
        "avg_salary": "$70,000 - $100,000",
    },
    # 工程类
    {
        "category": "engineering",
        "filename": "environmental-eng.html",
        "cn_name": "环境工程",
        "en_name": "Environmental Engineering",
        "cn_intro": "环境工程应用科学和工程原理解决环境问题，包括水处理、空气污染控制、废物管理、可再生能源、可持续发展。毕业生在政府环保部门、咨询公司、能源公司、制造业等领域工作。",
        "en_intro": "Environmental Engineering applies scientific and engineering principles to solve environmental problems, including water treatment, air pollution control, waste management, renewable energy, and sustainable development. Graduates work in government environmental agencies, consulting firms, energy companies, manufacturing, and more.",
        "core_courses": ["Water Resources Engineering", "Air Pollution Control", "Solid Waste Management", "Environmental Chemistry", "Sustainable Engineering", "Renewable Energy"],
        "careers": ["Environmental Engineer", "Water Resources Engineer", "Environmental Consultant", "Sustainability Specialist"],
        "avg_salary": "$65,000 - $90,000",
    },
    # 社会科学
    {
        "category": "social",
        "filename": "international-relations.html",
        "cn_name": "国际关系",
        "en_name": "International Relations",
        "cn_intro": "国际关系研究国家之间、国际组织、跨国公司等之间的互动，涵盖国际政治、国际经济、国际法、外交、安全研究。毕业生在外交、政府、国际组织、NGO、跨国企业、咨询等领域。",
        "en_intro": "International Relations studies interactions between states, international organizations, multinational corporations, and more, covering international politics, international economics, international law, diplomacy, and security studies. Graduates go into diplomacy, government, international organizations, NGOs, multinational corporations, consulting, and more.",
        "core_courses": ["International Politics", "International Economics", "International Law", "Comparative Politics", "Security Studies", "Diplomacy"],
        "careers": ["Diplomat", "Foreign Service", "Policy Analyst", "NGO Worker", "Intelligence Analyst", "Consultant"],
        "avg_salary": "$50,000 - $90,000",
    },
    # 社会科学
    {
        "category": "social",
        "filename": "communications.html",
        "cn_name": "传播学",
        "en_name": "Communications & Media",
        "cn_intro": "传播学研究信息如何在个人、群体、社会中传递和影响，涵盖新闻学、广告、公共关系、媒体研究、数字媒体。毕业生在媒体、广告、公关、市场营销、企业传播、新闻等领域。",
        "en_intro": "Communications studies how information is transmitted and influences individuals, groups, and society, covering journalism, advertising, public relations, media studies, and digital media. Graduates work in media, advertising, PR, marketing, corporate communications, journalism, and more.",
        "core_courses": ["Media Studies", "Journalism", "Public Relations", "Advertising", "Digital Media", "Communications Theory"],
        "careers": ["Journalist", "PR Specialist", "Marketing", "Content Strategist", "Media Planner", "Corporate Communications"],
        "avg_salary": "$45,000 - $80,000",
    },
    # 自然科学
    {
        "category": "science",
        "filename": "statistics.html",
        "cn_name": "统计学",
        "en_name": "Statistics",
        "cn_intro": "统计学研究数据的收集、分析、解释和呈现，是数据科学、机器学习、数据分析的数学基础。在大数据时代，统计学家在科技、金融、医疗、政府等各行业需求非常大。",
        "en_intro": "Statistics studies the collection, analysis, interpretation, and presentation of data, and is the mathematical foundation of data science, machine learning, and data analysis. In the era of big data, statisticians are in high demand across tech, finance, healthcare, government, and all industries.",
        "core_courses": ["Probability Theory", "Mathematical Statistics", "Regression Analysis", "Data Analysis", "Statistical Computing", "Bayesian Statistics"],
        "careers": ["Statistician", "Data Scientist", "Data Analyst", "Actuary", "Quant Analyst", "Business Intelligence"],
        "avg_salary": "$70,000 - $120,000",
    },
    # 艺术类
    {
        "category": "arts",
        "filename": "animation.html",
        "cn_name": "动画",
        "en_name": "Animation",
        "cn_intro": "动画专业学习2D/3D动画制作，角色动画、视觉效果、游戏动画、电影特效。课程涵盖绘画、动画原理、3D建模、绑定、渲染、合成等。",
        "en_intro": "Animation students learn 2D/3D animation production, including character animation, visual effects, game animation, and film VFX. Curriculum covers drawing, animation principles, 3D modeling, rigging, rendering, compositing, and more.",
        "core_courses": ["2D Animation", "3D Animation", "Character Design", "Storyboarding", "VFX", "Motion Graphics"],
        "careers": ["Animator", "3D Artist", "Character Animator", "VFX Artist", "Motion Designer", "Storyboard Artist"],
        "avg_salary": "$50,000 - $100,000+",
    },
    # 生物类
    {
        "category": "biology",
        "filename": "pharmacy.html",
        "cn_name": "药学",
        "en_name": "Pharmacy & Pharmaceutical Sciences",
        "cn_intro": "药学研究药物的发现、开发、生产、和合理使用，涵盖药物化学、药理学、药剂学、药物分析、临床药学等。是医疗健康领域的重要专业。",
        "en_intro": "Pharmacy and Pharmaceutical Sciences studies drug discovery, development, production, and rational use, covering medicinal chemistry, pharmacology, pharmaceutics, pharmaceutical analysis, clinical pharmacy, and more. It's an important field in healthcare.",
        "core_courses": ["Medicinal Chemistry", "Pharmacology", "Pharmaceutics", "Pharmacokinetics", "Clinical Pharmacy", "Drug Development"],
        "careers": ["Pharmacist", "Pharmaceutical Scientist", "Clinical Pharmacist", "Drug Development", "Regulatory Affairs"],
        "avg_salary": "$100,000 - $150,000+",
    },
    # 教育类
    {
        "category": "education",
        "filename": "educational-technology.html",
        "cn_name": "教育技术",
        "en_name": "Educational Technology",
        "cn_intro": "教育技术结合教育学和技术，研究如何用科技改善学习和教学，涵盖在线学习、教学设计、教育软件、学习分析、教育游戏化。",
        "en_intro": "Educational Technology combines education and technology, studying how to use technology to improve learning and teaching, covering online learning, instructional design, educational software, learning analytics, and gamification.",
        "core_courses": ["Instructional Design", "E-Learning Design", "Learning Sciences", "Educational Media", "Technology Integration", "Learning Analytics"],
        "careers": ["Instructional Designer", "E-Learning Specialist", "EdTech Product Manager", "Training Developer", "Educational Consultant"],
        "avg_salary": "$50,000 - $85,000",
    },
]

def generate_major_page(major):
    """生成专业详情页 HTML"""
    courses_html = "\n".join([
        f'<a href="#" class="course-link">{course}</a>'
        for course in major["core_courses"]
    ])
    
    careers_html = "、".join(major["careers"])
    
    html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>{major['cn_name']} - {major['en_name']} - yunzhuan.icu</title>
 <style>
 * {{ margin: 0; padding: 0; box-sizing: border-box; }}
 body {{
 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
 max-width: 760px;
 margin: 0 auto;
 padding: 20px 16px;
 background: #f5f5f5;
 color: #333;
 }}
 .back-link {{
 color: #667eea;
 text-decoration: none;
 font-size: 0.85rem;
 margin-bottom: 12px;
 display: inline-block;
 }}
 .back-link:hover {{ text-decoration: underline; }}
 h1 {{
 color: #333;
 margin-bottom: 4px;
 font-size: 1.4rem;
 }}
 .en-name {{
 color: #888;
 font-size: 0.95rem;
 margin-bottom: 14px;
 font-weight: normal;
 }}
 .section {{
 background: white;
 border-radius: 8px;
 padding: 14px 18px;
 margin-bottom: 10px;
 box-shadow: 0 1px 3px rgba(0,0,0,0.05);
 }}
 .section h2 {{
 color: #667eea;
 margin-bottom: 8px;
 font-size: 1rem;
 font-weight: 600;
 }}
 .section p {{
 color: #333;
 line-height: 1.7;
 font-size: 0.92rem;
 }}
 .section .en {{ color: #999; font-size: 0.8rem; font-weight: normal; }}
 .course-list {{ display: flex; flex-wrap: wrap; gap: 6px; }}
 .course-link {{ display: inline-block; padding: 4px 10px; background: #f8f9fa; border-radius: 4px; text-decoration: none; color: #333; font-size: 0.85rem; border-left: 3px solid #667eea; }}
 .course-link:hover {{ background: #e8eaf6; border-left-color: #764ba2; }}
 .footer {{
 text-align: center;
 margin-top: 20px;
 color: #999;
 font-size: 0.8rem;
 }}
 </style>
<link rel="stylesheet" href="/css/collapse.css">
</head>
<body>
 <a href="../index.html" class="back-link">← 返回首页</a>
 
 <h1>{major['cn_name']}</h1>
 <p class="en-name">{major['en_name']}</p>

 <div class="section">
 <h2>专业介绍</h2>
 <div>
 <p>{major['cn_intro']}</p>
 <p style="margin-top:8px;">{major['en_intro']}</p>
 </div>
    </div>

 <div class="section">
 <h2>核心课程 <span class="en">Core Courses</span></h2>
 <div class="course-list">
{courses_html}
 </div>
    </div>

 <div class="section">
 <h2>就业方向 <span class="en">Career Paths</span></h2>
 <p>{careers_html}</p>
    </div>

 <div class="section">
 <h2>薪资参考 <span class="en">Salary Range</span></h2>
 <p>{major['avg_salary']} (US median / 美国平均)</p>
    </div>

 <p class="footer">© 2026 yunzhuan.icu</p>
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
<div style="text-align:center;padding:8px 0;font-size:0.75rem;color:#aaa;">
 <a href="../index.html" style="color:#aaa;text-decoration:none;">Home</a>
 <span style="margin:0 6px;">·</span>
 <a href="../contact.html" style="color:#aaa;text-decoration:none;">Contact</a>
 <span style="margin:0 6px;">·</span>
 <a href="javascript:window.scrollTo(0,0)" style="color:#aaa;text-decoration:none;">Back to top</a>
</div>
</body>
</html>
'''
    return html

def main():
    base_dir = "/workspace"
    
    for major in new_majors:
        category_dir = os.path.join(base_dir, major["category"])
        os.makedirs(category_dir, exist_ok=True)
        filepath = os.path.join(category_dir, major["filename"])
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(generate_major_page(major))
        print(f"Generated: {major['category']}/{major['filename']}")
    
    print(f"\nTotal new majors: {len(new_majors)}")

if __name__ == "__main__":
    main()
