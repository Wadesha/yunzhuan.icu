#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成美国大学详情卡 (基于 schools/us/harvard.html 模板)
生成: MIT, Stanford, Yale, Princeton, Columbia, UChicago, UPenn
"""
import os

OUT_DIR = '/workspace/schools/us'

# 每所学校的完整数据
SCHOOLS = [
    {
        'slug': 'mit',
        'name': 'MIT',
        'cn_name': '麻省理工学院',
        'location': 'Cambridge, MA',
        'founded': '1861',
        'type': 'Private · STEM-focused',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~4.5%',
        'sat_mid': '1520-1580',
        'act_mid': '35-36',
        'tuition': '$61,990',
        'intl_pct': '~11%',
        'enrollment': '~4,600',
        'app_system': 'MIT portal (separate application)',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'SAT / ACT required',
        'english_req': 'TOEFL / IELTS / Duolingo / Cambridge English (recommended for non-native speakers)',
        'recs': '2 teachers (1 STEM + 1 humanities) + counselor',
        'essays': 'Short answer questions + supplemental essays',
        'interview': 'Educational Council interview (alumni), by invitation',
        'early_label': 'Early Action (EA)',
        'early_date': 'Nov 1 (decision mid-Dec)',
        'rd_date': 'Jan 4 (decision mid-Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制 STEM 强校，工程与计算机全美顶尖，理科与经济并重。',
        'academic_en': 'MIT offers a 4-year undergraduate curriculum with a strong emphasis on science, engineering and economics. The General Institute Requirements establish a rigorous foundation in calculus, physics, chemistry and biology across all majors. The Undergraduate Research Opportunities Program (UROP) lets students join research projects as early as freshman year.',
        'programs': [
            ('Electrical Engineering & Computer Science', 'EECS flagship program, largest undergraduate major'),
            ('Mechanical Engineering', 'Course 2, strong in design and robotics'),
            ('Mathematics', 'Course 18, pure and applied math excellence'),
            ('Physics', 'Course 8, linked to major research labs'),
            ('Economics', 'Course 14, quantitative economics strength'),
        ],
        'cost_cn': 'MIT 对国际生实行 need-blind 助学金政策，与本土生同等待遇。',
        'cost_total': '~$85,960 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for all applicants, including international',
        'cost_aid_threshold': 'Families earning &lt;$140k pay $0 tuition; &lt;$200k pay reduced',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'EA is single-choice style: applicants cannot apply to other schools\' binding ED, but can apply to public universities\' EA.',
            'MIT requires its own application portal, not Common App or Coalition.',
            'Short answer questions are weighted heavily; treat each as a mini-essay.',
            'STEM portfolio (Maker Portfolio) optional but valuable for engineering applicants.',
            'Need-blind for international students since 2024.',
        ],
    },
    {
        'slug': 'stanford',
        'name': 'Stanford University',
        'cn_name': '斯坦福大学',
        'location': 'Stanford, CA',
        'founded': '1885',
        'type': 'Private · Research',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~3.7%',
        'sat_mid': '1500-1570',
        'act_mid': '34-35',
        'tuition': '$65,127',
        'intl_pct': '~14%',
        'enrollment': '~8,000',
        'app_system': 'Common App / Coalition',
        'app_fee': '$90 (fee waiver available)',
        'std_tests': 'SAT / ACT required for 2025-26 applicants',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Stanford supplemental essays (short answers)',
        'interview': 'Alumni interview, optional and by invitation',
        'early_label': 'Restrictive Early Action (REA)',
        'early_date': 'Nov 1 (decision mid-Dec)',
        'rd_date': 'Jan 5 (decision early Apr)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，计算机与工程全美顶尖，跨学科氛围浓厚。',
        'academic_en': 'Stanford offers a 4-year undergraduate curriculum with a quarter system that allows students to take more courses than a semester system. The university is known for its interdisciplinary culture, with strong ties between computer science, engineering, business and humanities. Stanford Introductory Studies (SIS) provides small-group seminars for freshmen and sophomores.',
        'programs': [
            ('Computer Science', 'Top-ranked CS program, strong in AI/ML and systems'),
            ('Engineering', 'Mechanical, Electrical, Civil, Chemical all top-tier'),
            ('Human Biology', 'Interdisciplinary premad flagship major'),
            ('Economics', 'Quantitative economics with strong ties to GSB'),
            ('Symbolic Systems', 'Unique major combining CS, philosophy, linguistics, psychology'),
        ],
        'cost_cn': '斯坦福对国际生实行 need-blind 助学金政策。',
        'cost_total': '~$89,400 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for all applicants, including international',
        'cost_aid_threshold': 'Families earning &lt;$100k pay no tuition; &lt;$150k pay reduced',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'REA is single-choice: no other private US early applications allowed.',
            'Stanford supplemental essays include 3 short-answer questions (50-250 words each).',
            'Quarter system moves fast; plan to take fewer courses per term.',
            'Silicon Valley location drives strong entrepreneurial culture.',
            'Need-blind for international students since 2005.',
        ],
    },
    {
        'slug': 'yale',
        'name': 'Yale University',
        'cn_name': '耶鲁大学',
        'location': 'New Haven, CT',
        'founded': '1701',
        'type': 'Private · Ivy League',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~4.5%',
        'sat_mid': '1500-1560',
        'act_mid': '33-35',
        'tuition': '$64,700',
        'intl_pct': '~12%',
        'enrollment': '~6,800',
        'app_system': 'Common App / Coalition',
        'app_fee': '$85 (fee waiver available)',
        'std_tests': 'SAT / ACT required for 2025-26 applicants',
        'english_req': 'TOEFL / IELTS / Duolingo recommended for non-native speakers',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Yale supplemental essays',
        'interview': 'Alumni interview, by invitation',
        'early_label': 'Single-Choice Early Action (SCEA)',
        'early_date': 'Nov 1 (decision mid-Dec)',
        'rd_date': 'Jan 2 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制文理学院+研究生院综合大学，人文与社会科学强项，理科近年大幅提升。',
        'academic_en': 'Yale College offers a 4-year liberal arts curriculum with 80+ majors across humanities, social sciences, natural sciences and engineering. The residential college system groups students into 14 communities, each with its own dining hall and facilities. Distribution requirements ensure broad exposure while the major provides depth.',
        'programs': [
            ('History / Political Science', 'Long-standing humanities flagship'),
            ('Economics', 'Strong undergraduate economics program'),
            ('Molecular Biology', 'Premed feeder with strong research labs'),
            ('Computer Science', 'Growing rapidly, strong in theory and systems'),
            ('English / Literature', 'Traditional humanities strength'),
        ],
        'cost_cn': '耶鲁对国际生实行完全 need-blind 助学金政策。',
        'cost_total': '~$87,150 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for all applicants, including international',
        'cost_aid_threshold': 'Families earning &lt;$85k typically pay $0 toward total cost',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'SCEA is single-choice: no other private US early applications allowed.',
            'Yale supplemental essays include "Why Yale" and short takes (35 words).',
            'Residential college assignment happens before freshman year.',
            'Strong humanities tradition; STEM applicants should highlight interdisciplinary work.',
            'Need-blind for international students since 2008.',
        ],
    },
    {
        'slug': 'princeton',
        'name': 'Princeton University',
        'cn_name': '普林斯顿大学',
        'location': 'Princeton, NJ',
        'founded': '1746',
        'type': 'Private · Ivy League',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~4.5%',
        'sat_mid': '1490-1580',
        'act_mid': '34-35',
        'tuition': '$59,710',
        'intl_pct': '~12%',
        'enrollment': '~5,600',
        'app_system': 'Common App / Coalition',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'SAT / ACT required for 2025-26 applicants',
        'english_req': 'TOEFL / IELTS / Duolingo recommended for non-native speakers',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Princeton supplemental essays',
        'interview': 'Alumni interview, by invitation',
        'early_label': 'Single-Choice Early Action (SCEA)',
        'early_date': 'Nov 1 (decision mid-Dec)',
        'rd_date': 'Jan 1 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制文理学院+研究生院综合大学，数学与物理全美顶尖，独立研究要求严格。',
        'academic_en': 'Princeton offers a 4-year liberal arts curriculum with a strong emphasis on independent work. Every student completes a junior paper and senior thesis, working closely with faculty advisors. The precept system supplements lectures with small-group discussions. Distribution requirements ensure breadth across knowledge domains.',
        'programs': [
            ('Mathematics', 'Top-ranked pure and applied math'),
            ('Physics', 'Linked to Institute for Advanced Study'),
            ('Economics', 'Strong quantitative economics'),
            ('Computer Science', 'Theory-focused, strong in theoretical CS'),
            ('Woodrow Wilson School (SPIA)', 'Public policy and international affairs flagship'),
        ],
        'cost_cn': '普林斯顿对国际生实行完全 need-blind 助学金政策，助学金覆盖率高。',
        'cost_total': '~$86,700 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for all applicants, including international',
        'cost_aid_threshold': 'Families earning &lt;$100k typically pay $0 toward total cost',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'SCEA is single-choice: no other private US early applications allowed.',
            'Senior thesis is a graduation requirement; plan for substantial research.',
            'Princeton does not have a law, business, or medical school at the undergraduate level.',
            'Grade deflation policy was abolished; grading is now on a more standard curve.',
            'Need-blind for international students since 2001.',
        ],
    },
    {
        'slug': 'columbia',
        'name': 'Columbia University',
        'cn_name': '哥伦比亚大学',
        'location': 'New York, NY',
        'founded': '1754',
        'type': 'Private · Ivy League',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~3.9%',
        'sat_mid': '1500-1560',
        'act_mid': '34-35',
        'tuition': '$68,400',
        'intl_pct': '~20%',
        'enrollment': '~8,500',
        'app_system': 'Common App / Coalition',
        'app_fee': '$85 (fee waiver available)',
        'std_tests': 'SAT / ACT required for 2025-26 applicants',
        'english_req': 'TOEFL / IELTS / Duolingo recommended for non-native speakers',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Columbia supplemental essays (list questions)',
        'interview': 'Alumni interview, by invitation',
        'early_label': 'Early Decision (ED)',
        'early_date': 'Nov 1 (decision mid-Dec, binding)',
        'rd_date': 'Jan 1 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制文理学院+研究生院综合大学，核心课程严格，纽约市资源丰富。',
        'academic_en': 'Columbia College offers a 4-year liberal arts curriculum built around the Core Curriculum, a set of common courses taken by all students covering literature, philosophy, science, art and music. The Fu Foundation School of Engineering and Applied Science runs parallel programs. New York City location provides extensive internship and cultural access.',
        'programs': [
            ('Computer Science', 'Strong in AI/ML, systems, and theory'),
            ('Economics', 'Linked to NYC financial industry'),
            ('Political Science', 'International relations and public policy'),
            ('English & Comparative Literature', 'Humanities flagship'),
            ('Neuroscience & Behavior', 'Strong premed feeder'),
        ],
        'cost_cn': '哥大对国际生实行 need-aware 助学金政策（国际生申请助学金会影响录取）。',
        'cost_total': '~$93,600 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning &lt;$150k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED is binding: must attend if admitted and withdraw other applications.',
            'Core Curriculum is a defining feature; expect common coursework with all Columbia students.',
            'NYC location means high cost of living but extensive cultural/internship access.',
            'Columbia College and Columbia Engineering are separate programs with different requirements.',
            'Need-aware for international: applying for aid may slightly reduce admission chances.',
        ],
    },
    {
        'slug': 'uchicago',
        'name': 'University of Chicago',
        'cn_name': '芝加哥大学',
        'location': 'Chicago, IL',
        'founded': '1890',
        'type': 'Private · Research',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~5.0%',
        'sat_mid': '1510-1560',
        'act_mid': '34-35',
        'tuition': '$65,340',
        'intl_pct': '~16%',
        'enrollment': '~7,500',
        'app_system': 'Common App / Coalition',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'SAT / ACT test-optional for 2025-26 (recommended for international)',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + UChicago extended essay (quirky prompts)',
        'interview': 'Optional alumni interview',
        'early_label': 'Early Decision I (ED1) / Early Action (EA)',
        'early_date': 'Nov 1 (ED1 decision mid-Dec, EA decision mid-Dec)',
        'rd_date': 'Jan 2 (ED2 + RD decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，经济学与社会科学顶尖，核心课程严格，学术氛围浓厚。',
        'academic_en': 'UChicago offers a 4-year liberal arts curriculum known for its rigorous Core Curriculum and intellectually demanding atmosphere. The famous "Life of the Mind" culture emphasizes theoretical and analytical thinking. The university operates on a quarter system, allowing students to take more courses. The extended essay prompts are intentionally quirky to encourage creative thinking.',
        'programs': [
            ('Economics', 'Long-standing quantitative economics flagship'),
            ('Computer Science', 'Strong in theory and systems'),
            ('Mathematics', 'Pure and applied math excellence'),
            ('Political Science', 'Linked to "Chicago School" of political economy'),
            ('Biological Sciences', 'Strong premed feeder with research focus'),
        ],
        'cost_cn': '芝大对国际生实行 need-aware 助学金政策。',
        'cost_total': '~$90,000 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning &lt;$125k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED1 is binding; EA is non-binding. ED2 (Jan 2) is also binding.',
            'Extended essay prompts change yearly and are famously quirky (e.g., "Where is Waldo really?").',
            'Quarter system moves fast; 10-week terms require tight time management.',
            'Strong economics and social science tradition; "Chicago School" reputation.',
            'Need-aware for international: applying for aid may slightly reduce admission chances.',
        ],
    },
    {
        'slug': 'upenn',
        'name': 'University of Pennsylvania',
        'cn_name': '宾夕法尼亚大学',
        'location': 'Philadelphia, PA',
        'founded': '1740',
        'type': 'Private · Ivy League',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~5.8%',
        'sat_mid': '1500-1560',
        'act_mid': '34-35',
        'tuition': '$61,710',
        'intl_pct': '~13%',
        'enrollment': '~10,600',
        'app_system': 'Common App / Coalition',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'SAT / ACT required for 2025-26 applicants',
        'english_req': 'TOEFL / IELTS / Duolingo recommended for non-native speakers',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Penn supplemental essays (school-specific)',
        'interview': 'Alumni interview, by invitation',
        'early_label': 'Early Decision (ED)',
        'early_date': 'Nov 1 (decision mid-Dec, binding)',
        'rd_date': 'Jan 5 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，商科与跨学科项目强项，沃顿商学院全美顶尖。',
        'academic_en': 'Penn offers a 4-year undergraduate curriculum across four undergraduate schools: College of Arts and Sciences, Wharton School of Business, School of Engineering and Applied Science, and School of Nursing. The One University policy allows students to take courses across schools, encouraging interdisciplinary study. Wharton is the only undergraduate business school among Ivy League peers.',
        'programs': [
            ('Wharton (Business)', 'Top-ranked undergraduate business program'),
            ('Computer Science', 'Strong in AI/ML and dual-degree with Wharton (M&T)'),
            ('Economics', 'Linked to Wharton and business research'),
            ('Nursing', 'Top-ranked BSN program'),
            ('Bioengineering', 'Strong interdisciplinary program'),
        ],
        'cost_cn': '宾大对国际生实行 need-aware 助学金政策。',
        'cost_total': '~$87,860 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning &lt;$75k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED is binding: must attend if admitted and withdraw other applications.',
            'Applicants must specify which undergraduate school (College, Wharton, SEAS, Nursing) they are applying to.',
            'Wharton applicants should show interest in business; supplemental essay is school-specific.',
            'M&T (Management & Technology) and Huntsman are highly competitive dual-degree programs.',
            'Need-aware for international: applying for aid may slightly reduce admission chances.',
        ],
    },
]

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name} - yunzhuan.icu</title>
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
        .back-link {{ color: #667eea; text-decoration: none; font-size: 0.85rem; margin-bottom: 12px; display: inline-block; }}
        .back-link:hover {{ text-decoration: underline; }}
        h1 {{ color: #333; margin-bottom: 4px; font-size: 1.4rem; }}
        .en-name {{ color: #888; font-size: 0.95rem; margin-bottom: 4px; font-weight: normal; }}
        .code-line {{ color: #888; font-size: 0.82rem; margin-bottom: 14px; }}
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
        .section h2 .en {{ color: #999; font-size: 0.8rem; font-weight: normal; }}
        .section p {{ color: #333; line-height: 1.7; font-size: 0.92rem; }}
        .section p.cn-hint {{ color: #666; font-size: 0.85rem; margin-bottom: 6px; }}
        .meta-table {{
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
            margin-top: 6px;
        }}
        .meta-table td {{
            padding: 6px 8px;
            border-bottom: 1px solid #f0f0f0;
            vertical-align: top;
        }}
        .meta-table td.label {{ color: #888; width: 32%; }}
        .meta-table td.value {{ color: #333; }}
        .tag {{
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 4px;
        }}
        .tag-reach {{ background: #fce4ec; color: #c2185b; }}
        .tag-match {{ background: #e8f5e9; color: #2e7d32; }}
        .tag-safety {{ background: #fff3e0; color: #ef6c00; }}
        .stat-row {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 8px;
            margin-top: 8px;
        }}
        .stat-card {{
            background: #f8f9fa;
            border-radius: 6px;
            padding: 8px 10px;
            border-left: 3px solid #667eea;
        }}
        .stat-card .label {{ color: #888; font-size: 0.75rem; }}
        .stat-card .value {{ color: #333; font-size: 1rem; font-weight: 600; margin-top: 2px; }}
        .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 0.8rem; }}
    </style>
    <link rel="stylesheet" href="/css/collapse.css">
</head>
<body>
    <a href="index.html" class="back-link">&larr; Back to US Universities</a>

    <h1>{name}</h1>
    <p class="en-name">{cn_name}</p>
    <p class="code-line">{location} &middot; Founded {founded} &middot; {type} <span class="tag {tag_class}">{tag_label}</span></p>

    <div class="section">
        <h2>Snapshot <span class="en">关键数据</span></h2>
        <div class="stat-row">
            <div class="stat-card"><div class="label">Acceptance Rate</div><div class="value">{accept_rate}</div></div>
            <div class="stat-card"><div class="label">SAT Mid 50%</div><div class="value">{sat_mid}</div></div>
            <div class="stat-card"><div class="label">ACT Mid 50%</div><div class="value">{act_mid}</div></div>
            <div class="stat-card"><div class="label">Tuition (2025-26)</div><div class="value">{tuition}</div></div>
            <div class="stat-card"><div class="label">Intl Students</div><div class="value">{intl_pct}</div></div>
            <div class="stat-card"><div class="label">Ugrad Enrollment</div><div class="value">{enrollment}</div></div>
        </div>
        <p class="cn-hint" style="margin-top:10px;">数据为近年公开区间，实际录取以官网为准。</p>
    </div>

    <div class="section">
        <h2>Application Requirements <span class="en">申请要求</span></h2>
        <table class="meta-table">
            <tr><td class="label">Application System (申请系统)</td><td class="value">{app_system}</td></tr>
            <tr><td class="label">Application Fee (申请费)</td><td class="value">{app_fee}</td></tr>
            <tr><td class="label">Standardized Tests (标化)</td><td class="value">{std_tests}</td></tr>
            <tr><td class="label">English Proficiency (英语要求)</td><td class="value">{english_req}</td></tr>
            <tr><td class="label">Recommendations (推荐信)</td><td class="value">{recs}</td></tr>
            <tr><td class="label">Essays (文书)</td><td class="value">{essays}</td></tr>
            <tr><td class="label">Interview (面试)</td><td class="value">{interview}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Deadlines <span class="en">申请截止时间</span></h2>
        <table class="meta-table">
            <tr><td class="label">{early_label}</td><td class="value">{early_date}</td></tr>
            <tr><td class="label">Regular Decision (RD)</td><td class="value">{rd_date}</td></tr>
            <tr><td class="label">Financial Aid (助学金)</td><td class="value">{aid_date}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Academic Profile <span class="en">学术概况</span></h2>
        <p class="cn-hint">{academic_cn}</p>
        <p>{academic_en}</p>
    </div>

    <div class="section">
        <h2>Strong Programs <span class="en">强势专业</span></h2>
        <table class="meta-table">
            {programs_html}
        </table>
    </div>

    <div class="section">
        <h2>Cost & Financial Aid <span class="en">学费与助学金</span></h2>
        <p class="cn-hint">{cost_cn}</p>
        <table class="meta-table">
            <tr><td class="label">Tuition + Fees</td><td class="value">{tuition} / year</td></tr>
            <tr><td class="label">Total Cost of Attendance</td><td class="value">{cost_total}</td></tr>
            <tr><td class="label">Aid Policy</td><td class="value">{cost_aid_policy}</td></tr>
            <tr><td class="label">Aid Threshold</td><td class="value">{cost_aid_threshold}</td></tr>
            <tr><td class="label">Aid Form</td><td class="value">{cost_aid_form}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Notes for Applicants <span class="en">申请要点</span></h2>
        <ul style="margin-left:20px;font-size:0.9rem;line-height:1.7;color:#444;">
            {notes_html}
        </ul>
    </div>

    <p class="footer">&copy; 2026 yunzhuan.icu | {name} Profile</p>
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
    <div style="text-align:center;padding:8px 0;font-size:0.75rem;color:#aaa;">
        <a href="../../index.html" style="color:#aaa;text-decoration:none;">Home</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="../../intl-exams/index.html" style="color:#aaa;text-decoration:none;">International Exams</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="../../tests/index.html" style="color:#aaa;text-decoration:none;">Standardized Tests</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="../../essays/index.html" style="color:#aaa;text-decoration:none;">Essays</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="javascript:window.scrollTo(0,0)" style="color:#aaa;text-decoration:none;">Back to top</a>
    </div>
</body>
</html>
'''


def gen_one(s):
    programs_html = '\n            '.join(
        f'<tr><td class="label">{name}</td><td class="value">{desc}</td></tr>'
        for name, desc in s['programs']
    )
    notes_html = '\n            '.join(f'<li>{n}</li>' for n in s['notes'])
    html = TEMPLATE.format(
        programs_html=programs_html,
        notes_html=notes_html,
        **{k: v for k, v in s.items() if k not in ('programs', 'notes')}
    )
    out_path = os.path.join(OUT_DIR, s['slug'] + '.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  generated: {out_path}')


def main():
    print(f'Generating {len(SCHOOLS)} school profile pages...')
    for s in SCHOOLS:
        gen_one(s)
    print(f'Done. Total: {len(SCHOOLS)} files in {OUT_DIR}')


if __name__ == '__main__':
    main()
