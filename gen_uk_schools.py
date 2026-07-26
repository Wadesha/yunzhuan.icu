#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成英国大学详情卡 (v13.4)
生成: Oxford, Cambridge, Imperial, UCL, LSE, KCL, Edinburgh, Manchester
"""
import os

OUT_DIR = '/workspace/schools/uk'

SCHOOLS = [
    {
        'slug': 'oxford',
        'name': 'University of Oxford',
        'cn_name': '牛津大学',
        'location': 'Oxford, England',
        'founded': '1096',
        'type': 'Public · Collegiate · Russell Group',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~17% (overall)',
        'alevel_req': 'A*A*A - AAA',
        'ib_req': '38-42 points (with 776 at HL)',
        'tuition': '£36,065 - £46,200',
        'intl_pct': '~45%',
        'enrollment': '~26,500',
        'app_system': 'UCAS (choose 1 of 5 choices)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP (many courses require admissions tests)',
        'english_req': 'IELTS 7.0-7.5 overall (7.0+ per component)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (4,000 characters, 47 lines)',
        'interview': 'Shortlisted applicants invited for interviews (Dec)',
        'early_label': 'Early Deadline (Oxbridge)',
        'early_date': 'Oct 15 (UCAS deadline, same for all Oxbridge/medicine)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '学院制大学，3 年制本科，人文社科和理科都顶尖，教学以一对一辅导为特色。',
        'academic_en': 'Oxford offers 3-year undergraduate degrees across 300+ courses in 39 colleges. The collegiate system provides small-group tutorials (unique to Oxford and Cambridge) with 1-3 students per session. The academic year is divided into three eight-week terms (Michaelmas, Hilary, Trinity). Admission is highly competitive, with most courses requiring subject-specific admissions tests.',
        'programs': [
            ('Philosophy, Politics & Economics (PPE)', 'Flagship interdisciplinary program'),
            ('Law (Jurisprudence)', 'Top-ranked law program with tutorial system'),
            ('Medicine (BM BCh)', '6-year medical degree with clinical rotations'),
            ('Computer Science', 'Growing program with strong theoretical focus'),
            ('Engineering Science', 'General engineering first 2 years, then specialize'),
        ],
        'cost_cn': '国际生学费较高，各专业差异大；学院提供少量奖学金。',
        'cost_total': '£48,000 - £58,000 / year (incl. living expenses)',
        'cost_aid_policy': 'Limited scholarships for international students (Oxford Reach, etc.)',
        'cost_aid_threshold': 'Scholarships are merit-based and highly competitive',
        'cost_aid_form': 'Scholarship applications via college / department',
        'notes': [
            'Oct 15 UCAS deadline is earlier than standard Jan deadline.',
            'You can only apply to either Oxford OR Cambridge - not both in the same year.',
            'Most courses require an admissions test (e.g., TSA, PAT, MAT, LNAT, BMAT).',
            'College choice matters: each college has different culture and accommodation.',
            'Tutorial system is the defining feature - small-group teaching with world experts.',
        ],
    },
    {
        'slug': 'cambridge',
        'name': 'University of Cambridge',
        'cn_name': '剑桥大学',
        'location': 'Cambridge, England',
        'founded': '1209',
        'type': 'Public · Collegiate · Russell Group',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~21% (overall)',
        'alevel_req': 'A*A*A - A*AA',
        'ib_req': '40-42 points (with 776 at HL)',
        'tuition': '£30,480 - £37,293',
        'intl_pct': '~30%',
        'enrollment': '~24,400',
        'app_system': 'UCAS (choose 1 of 5 choices)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP (most courses require admissions tests)',
        'english_req': 'IELTS 7.0-7.5 overall (7.0+ per component)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement + MyCambridge Application (supplemental)',
        'interview': 'Shortlisted applicants invited for interviews (Dec)',
        'early_label': 'Early Deadline (Oxbridge)',
        'early_date': 'Oct 15 (UCAS deadline, same for all Oxbridge/medicine)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '学院制大学，3 年制本科，理工科和数学世界顶尖，实验室资源丰富。',
        'academic_en': 'Cambridge offers 3-year undergraduate degrees across 30+ undergraduate courses in 31 colleges. The supervision system (similar to Oxford tutorials) provides small-group teaching. Cambridge has a particularly strong reputation in STEM, with 121 Nobel laureates affiliated with the university. The academic year is divided into three eight-week terms.',
        'programs': [
            ('Natural Sciences (NatSci)', 'Flagship interdisciplinary science program'),
            ('Mathematics (Tripos)', 'World-renowned math program with STEP requirement'),
            ('Engineering', 'General engineering 4-year MEng program'),
            ('Computer Science', 'Strong theoretical CS with competitive entry'),
            ('Law', 'Top-ranked law with Cambridge Law Test (if shortlisted)'),
        ],
        'cost_cn': '国际生学费较高，各专业差异大；有 Gates Cambridge 等奖学金。',
        'cost_total': '£45,000 - £55,000 / year (incl. living expenses)',
        'cost_aid_policy': 'Limited scholarships including Gates Cambridge (postgrad mostly)',
        'cost_aid_threshold': 'Undergraduate international scholarships are rare and competitive',
        'cost_aid_form': 'College-specific scholarships + Cambridge Commonwealth Trust',
        'notes': [
            'Oct 15 UCAS deadline is earlier than standard Jan deadline.',
            'You can only apply to either Oxford OR Cambridge - not both in the same year.',
            'MyCambridge Application is required in addition to UCAS (includes SAQ).',
            'Many courses require subject-specific admissions tests (STEP, ENGAA, NSAA, etc.).',
            'NatSci is unique - students study multiple sciences before specializing in Year 2.',
        ],
    },
    {
        'slug': 'imperial',
        'name': 'Imperial College London',
        'cn_name': '帝国理工学院',
        'location': 'London, England',
        'founded': '1907',
        'type': 'Public · STEM-focused · Russell Group',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~12%',
        'alevel_req': 'A*A*A - A*AA (STEM)',
        'ib_req': '38-42 points (with 6-7 in HL sciences)',
        'tuition': '£35,500 - £46,650',
        'intl_pct': '~50%',
        'enrollment': '~20,600',
        'app_system': 'UCAS (choose 5 choices total)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP (some courses require admissions tests)',
        'english_req': 'IELTS 6.5-7.0 overall (6.0-6.5+ per component)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (4,000 characters)',
        'interview': 'Some courses (Medicine, etc.) require interview',
        'early_label': 'Standard UCAS',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': 'STEM 强校，3-4 年制本科，工程、医学、商科都很强，伦敦地理位置好。',
        'academic_en': 'Imperial is a STEM-focused university offering 3-4 year undergraduate degrees across engineering, medicine, natural sciences, and business. It has a strong reputation for engineering, computing, and biomedical research. Imperial is part of the Golden Triangle (Oxford, Cambridge, London). The Business School is one of the top in Europe.',
        'programs': [
            ('Engineering (all disciplines)', 'MEng 4-year programs across all engineering fields'),
            ('Medicine (MBBS)', '6-year medical degree with clinical placements'),
            ('Computing', 'Strong CS program with AI/ML and industry focus'),
            ('Business School', 'Undergraduate business programs (Economics, Finance, Management)'),
            ('Natural Sciences', 'Chemistry, Physics, Mathematics all top-tier'),
        ],
        'cost_cn': '国际生学费在英国属于最高一档，伦敦生活费也高。',
        'cost_total': '£50,000 - £60,000 / year (incl. London living expenses)',
        'cost_aid_policy': 'Limited scholarships for international students',
        'cost_aid_threshold': 'Merit-based scholarships available for top applicants',
        'cost_aid_form': 'Scholarship applications via department',
        'notes': [
            'Imperial is STEM-only - no humanities or social science programs.',
            'Engineering programs are 4 years MEng (integrated masters).',
            'London location means high cost of living but excellent internship access.',
            'Strong industry connections - many graduates go into tech/finance/engineering.',
            'Acceptance rate is lower than many Russell Group universities for STEM.',
        ],
    },
    {
        'slug': 'ucl',
        'name': 'University College London',
        'cn_name': '伦敦大学学院',
        'location': 'London, England',
        'founded': '1826',
        'type': 'Public · Research · Russell Group',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~23%',
        'alevel_req': 'A*A*A - ABB',
        'ib_req': '34-40 points',
        'tuition': '£28,500 - £44,000',
        'intl_pct': '~52%',
        'enrollment': '~46,800',
        'app_system': 'UCAS (choose 5 choices total)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP (some courses require tests)',
        'english_req': 'IELTS 6.5-7.5 overall (depending on department)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (4,000 characters)',
        'interview': 'Most courses do not require interview',
        'early_label': 'Standard UCAS',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '综合性大学，3 年制本科，学科全面，建筑、教育、医学、经济都很强。',
        'academic_en': 'UCL is a comprehensive research university offering 3-year undergraduate degrees across 11 faculties. It has a particularly strong reputation in architecture (Bartlett), education (IOE), economics, and biomedical sciences. UCL is the largest university in the UK by enrollment and has a very diverse international student body.',
        'programs': [
            ('Architecture (Bartlett)', 'Top-ranked architecture school in Europe'),
            ('Economics', 'Strong economics with finance and econometrics focus'),
            ('Medicine (MBBS)', '6-year medical degree with London teaching hospitals'),
            ('Computer Science', 'Fast-growing CS program with AI/systems focus'),
            ('Law', 'Top-ranked law faculty with international focus'),
        ],
        'cost_cn': '国际生学费中等偏高，伦敦生活费高，但国际生比例也高。',
        'cost_total': '£45,000 - £55,000 / year (incl. London living expenses)',
        'cost_aid_policy': 'Limited scholarships for international students',
        'cost_aid_threshold': 'UCL Global Undergraduate Scholarship (merit-based)',
        'cost_aid_form': 'Online scholarship application via UCL portal',
        'notes': [
            'UCL has the highest international student percentage among Russell Group.',
            'Multiple campuses across London (Bloomsbury is main).',
            'Bartlett Architecture and IOE Education are world #1 in their fields.',
            'No interviews for most courses - grades and PS are everything.',
            'Large university - can feel impersonal but lots of resources.',
        ],
    },
    {
        'slug': 'lse',
        'name': 'London School of Economics',
        'cn_name': '伦敦政治经济学院',
        'location': 'London, England',
        'founded': '1895',
        'type': 'Public · Social Sciences · Russell Group',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~8.9% (most competitive UK)',
        'alevel_req': 'A*AA - AAA',
        'ib_req': '37-38 points',
        'tuition': '£28,656 - £35,856',
        'intl_pct': '~60%',
        'enrollment': '~13,000',
        'app_system': 'UCAS (choose 5 choices total)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP (TMUA for some economics courses)',
        'english_req': 'IELTS 7.0 overall (6.5+ per component, 7.0 in writing)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (very important for LSE)',
        'interview': 'No interviews for most courses',
        'early_label': 'Standard UCAS',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '社科强校，3 年制本科，经济、金融、政治、法律世界顶尖。',
        'academic_en': 'LSE is a social-science-specialized university offering 3-year undergraduate degrees across economics, politics, law, sociology, and related fields. It is consistently ranked top in Europe for social sciences and has a very high international student percentage. LSE is located in central London with strong ties to finance and government.',
        'programs': [
            ('Economics (BSc)', 'Top-ranked economics program in Europe'),
            ('Law (LLB)', 'Top law program with international focus'),
            ('Government / Politics', 'Strong political science and international relations'),
            ('Finance', 'Undergraduate finance with strong quant focus'),
            ('International Relations', 'Top-ranked IR program with global outlook'),
        ],
        'cost_cn': '国际生学费中等，伦敦生活费高；录取竞争非常激烈。',
        'cost_total': '£45,000 - £52,000 / year (incl. London living expenses)',
        'cost_aid_policy': 'Limited scholarships for international students',
        'cost_aid_threshold': 'LSE Undergraduate Support Scheme + departmental scholarships',
        'cost_aid_form': 'Online scholarship application via LSE portal',
        'notes': [
            'Lowest acceptance rate among UK universities (~8.9% overall).',
            'Personal Statement is extremely important - must show academic interest.',
            'Small campus in central London - very urban university feel.',
            'Strong reputation in finance, government, and international organizations.',
            'No interviews - admission based on grades, PS, and reference.',
        ],
    },
    {
        'slug': 'kcl',
        'name': "King's College London",
        'cn_name': '伦敦国王学院',
        'location': 'London, England',
        'founded': '1829',
        'type': 'Public · Research · Russell Group',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~39%',
        'alevel_req': 'A*AA - BBB',
        'ib_req': '32-37 points',
        'tuition': '£27,390 - £43,350',
        'intl_pct': '~45%',
        'enrollment': '~33,000',
        'app_system': 'UCAS (choose 5 choices total)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP',
        'english_req': 'IELTS 6.5-7.5 overall (depending on course)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (4,000 characters)',
        'interview': 'Some courses (Medicine, Dentistry, etc.) require interview',
        'early_label': 'Standard UCAS',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '综合性大学，3 年制本科，医学、法学、商科、人文社科都很强。',
        'academic_en': "King's offers 3-year undergraduate degrees across 9 faculties. It has particularly strong programs in medicine, dentistry, law, business, and humanities. With 5 campuses across London, King's is one of the largest universities in the UK and has a very diverse international student body.",
        'programs': [
            ('Medicine (MBBS)', 'Top medical school with London teaching hospitals'),
            ('Law (LLB)', 'Dickson Poon School of Law - top-ranked'),
            ('Business & Management', "King's Business School - growing fast"),
            ('Computer Science', 'Informatics department with strong AI focus'),
            ('International Relations', 'War Studies department is world-renowned'),
        ],
        'cost_cn': '国际生学费中等，伦敦生活费高；录取相对 G5 友好。',
        'cost_total': '£42,000 - £50,000 / year (incl. London living expenses)',
        'cost_aid_policy': 'Some scholarships for international students',
        'cost_aid_threshold': 'King\'s International Scholarships + departmental awards',
        'cost_aid_form': 'Online scholarship application via King\'s Apply',
        'notes': [
            "King's is part of the University of London federation.",
            'Multiple campuses across London (Strand, Waterloo, Guy\'s, etc.).',
            'Strong medical school with several London teaching hospitals.',
            'War Studies department is unique and world-renowned.',
            'Less competitive than G5 but still a top Russell Group university.',
        ],
    },
    {
        'slug': 'edinburgh',
        'name': 'University of Edinburgh',
        'cn_name': '爱丁堡大学',
        'location': 'Edinburgh, Scotland',
        'founded': '1583',
        'type': 'Public · Research · Russell Group',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~33%',
        'alevel_req': 'A*AA - BBB',
        'ib_req': '32-37 points',
        'tuition': '£29,000 - £40,000',
        'intl_pct': '~45%',
        'enrollment': '~36,000',
        'app_system': 'UCAS (choose 5 choices total)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP',
        'english_req': 'IELTS 6.5-7.0 overall (6.0+ per component)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (4,000 characters)',
        'interview': 'Most courses do not require interview',
        'early_label': 'Standard UCAS',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '苏格兰顶尖大学，4 年制本科，学科全面，计算机、医学、商科都很强。',
        'academic_en': 'Edinburgh offers 4-year undergraduate degrees (Scottish system) across 3 colleges and 21 schools. It is the top-ranked university in Scotland and consistently ranks in the UK top 10. Edinburgh has strong programs in computer science, medicine, veterinary science, and humanities. The university has a very international student body.',
        'programs': [
            ('Computer Science', 'Top-ranked CS in Scotland, strong in AI/NLP'),
            ('Medicine (MBChB)', '6-year medical degree with Edinburgh teaching hospitals'),
            ('Business (Business School)', 'AACSB-accredited business school'),
            ('Veterinary Medicine', 'Top-ranked vet school (Royal Dick)'),
            ('Informatics', 'Strong CS with AI, machine learning, and theory focus'),
        ],
        'cost_cn': '国际生学费中等，苏格兰生活费比伦敦低；4 年制比英格兰多一年。',
        'cost_total': '£40,000 - £48,000 / year (incl. Edinburgh living expenses)',
        'cost_aid_policy': 'Some scholarships for international students',
        'cost_aid_threshold': 'Edinburgh Global Undergraduate Mathematics Scholarship + others',
        'cost_aid_form': 'Online scholarship application via MyEd portal',
        'notes': [
            'Scottish undergraduate degrees are 4 years (MA / MSc / MChem etc.).',
            'Edinburgh is a beautiful historic city - very popular with students.',
            'Lower cost of living compared to London.',
            'Strong international reputation - especially in Asia.',
            'Informatics school is one of the largest and best in Europe.',
        ],
    },
    {
        'slug': 'manchester',
        'name': 'University of Manchester',
        'cn_name': '曼彻斯特大学',
        'location': 'Manchester, England',
        'founded': '1824',
        'type': 'Public · Research · Russell Group',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~49%',
        'alevel_req': 'A*AA - CCC',
        'ib_req': '32-38 points',
        'tuition': '£26,000 - £39,000',
        'intl_pct': '~35%',
        'enrollment': '~46,400',
        'app_system': 'UCAS (choose 5 choices total)',
        'app_fee': '£27.50 (UCAS multiple)',
        'std_tests': 'A-Level / IB / AP',
        'english_req': 'IELTS 6.0-7.0 overall (depending on course)',
        'recs': '1 academic reference (UCAS reference)',
        'essays': 'UCAS Personal Statement (4,000 characters)',
        'interview': 'Some courses (Medicine, etc.) require interview',
        'early_label': 'Standard UCAS',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Jan 29 (standard UCAS deadline)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '综合性大学，3 年制本科，工程、商科、社科都很强，学校规模大。',
        'academic_en': 'Manchester offers 3-year undergraduate degrees across 4 faculties. It is the largest single-site university in the UK and consistently ranks in the UK top 10. Manchester has strong programs in engineering, business, social sciences, and life sciences. The university has a very diverse student body.',
        'programs': [
            ('Business & Management (Alliance MBS)', 'Top-ranked business school in UK'),
            ('Engineering (all disciplines)', 'Strong engineering across all fields'),
            ('Computer Science', 'Growing CS program with AI focus'),
            ('Medicine (MBChB)', '5-year medical degree with Manchester teaching hospitals'),
            ('Social Sciences', 'Strong economics, politics, and sociology'),
        ],
        'cost_cn': '国际生学费中等，曼彻斯特生活费低，性价比高。',
        'cost_total': '£38,000 - £46,000 / year (incl. Manchester living expenses)',
        'cost_aid_policy': 'Some scholarships for international students',
        'cost_aid_threshold': 'Manchester Global Excellence Scholarship + others',
        'cost_aid_form': 'Online scholarship application via University of Manchester portal',
        'notes': [
            'Largest single-site university in the UK - lots of resources.',
            'Manchester is a vibrant student city with low cost of living.',
            'Alliance MBS is one of the top business schools in Europe.',
            'Strong engineering tradition - historical ties to Industrial Revolution.',
            'Good international reputation and large alumni network.',
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
</head>
<body>
    <a href="index.html" class="back-link">&larr; Back to UK Universities</a>

    <h1>{name}</h1>
    <p class="en-name">{cn_name}</p>
    <p class="code-line">{location} &middot; Founded {founded} &middot; {type} <span class="tag {tag_class}">{tag_label}</span></p>

    <div class="section">
        <h2>Snapshot <span class="en">关键数据</span></h2>
        <div class="stat-row">
            <div class="stat-card"><div class="label">Acceptance Rate</div><div class="value">{accept_rate}</div></div>
            <div class="stat-card"><div class="label">A-Level Req</div><div class="value">{alevel_req}</div></div>
            <div class="stat-card"><div class="label">IB Req</div><div class="value">{ib_req}</div></div>
            <div class="stat-card"><div class="label">Tuition (Intl)</div><div class="value">{tuition}</div></div>
            <div class="stat-card"><div class="label">Intl Students</div><div class="value">{intl_pct}</div></div>
            <div class="stat-card"><div class="label">Ugrad Enrollment</div><div class="value">{enrollment}</div></div>
        </div>
        <p class="cn-hint" style="margin-top:10px;">数据为近年公开区间，实际录取以官网为准。</p>
    </div>

    <div class="section">
        <h2>Application Requirements <span class="en">申请要求</span></h2>
        <table class="meta-table">
            <tr><td class="label">Application System</td><td class="value">{app_system}</td></tr>
            <tr><td class="label">Application Fee</td><td class="value">{app_fee}</td></tr>
            <tr><td class="label">Academic Entry</td><td class="value">{std_tests}</td></tr>
            <tr><td class="label">English Proficiency</td><td class="value">{english_req}</td></tr>
            <tr><td class="label">Reference</td><td class="value">{recs}</td></tr>
            <tr><td class="label">Personal Statement</td><td class="value">{essays}</td></tr>
            <tr><td class="label">Interview</td><td class="value">{interview}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Deadlines <span class="en">申请截止时间</span></h2>
        <table class="meta-table">
            <tr><td class="label">{early_label}</td><td class="value">{early_date}</td></tr>
            <tr><td class="label">UCAS Main Deadline</td><td class="value">{rd_date}</td></tr>
            <tr><td class="label">Scholarships</td><td class="value">{aid_date}</td></tr>
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
        <h2>Cost & Scholarships <span class="en">学费与奖学金</span></h2>
        <p class="cn-hint">{cost_cn}</p>
        <table class="meta-table">
            <tr><td class="label">Tuition (International)</td><td class="value">{tuition} / year</td></tr>
            <tr><td class="label">Total Cost of Attendance</td><td class="value">{cost_total}</td></tr>
            <tr><td class="label">Scholarship Policy</td><td class="value">{cost_aid_policy}</td></tr>
            <tr><td class="label">Scholarship Types</td><td class="value">{cost_aid_threshold}</td></tr>
            <tr><td class="label">How to Apply</td><td class="value">{cost_aid_form}</td></tr>
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
        <a href="../../contact.html" style="color:#aaa;text-decoration:none;">Contact</a>
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
    print(f'Generating {len(SCHOOLS)} UK school profile pages (v13.4)...')
    for s in SCHOOLS:
        gen_one(s)
    print(f'Done. Total: {len(SCHOOLS)} files in {OUT_DIR}')


if __name__ == '__main__':
    main()
