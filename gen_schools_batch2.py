#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
第二批美国大学详情卡生成 (v13.3)
生成: Johns Hopkins, Northwestern, Duke, UCB, UCLA, UMich, CMU, NYU, 
      Boston University, UIUC, Georgia Tech, UWashington
"""
import os

OUT_DIR = '/workspace/schools/us'

SCHOOLS = [
    {
        'slug': 'johns-hopkins',
        'name': 'Johns Hopkins University',
        'cn_name': '约翰斯·霍普金斯大学',
        'location': 'Baltimore, MD',
        'founded': '1876',
        'type': 'Private · Research',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~7.8%',
        'sat_mid': '1520-1570',
        'act_mid': '35-36',
        'tuition': '$62,350',
        'intl_pct': '~13%',
        'enrollment': '~6,200',
        'app_system': 'Common App / Coalition',
        'app_fee': '$70 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26 (recommended for international)',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + JHU supplemental essay',
        'interview': 'Alumni interview, optional and by invitation',
        'early_label': 'Early Decision (ED)',
        'early_date': 'Nov 1 (decision mid-Dec, binding)',
        'rd_date': 'Jan 2 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，生物医学与公共卫生全美顶尖，本科科研资源丰富。',
        'academic_en': 'Johns Hopkins offers a 4-year undergraduate curriculum across the Krieger School of Arts and Sciences and the Whiting School of Engineering. The university is renowned for its biomedical research and the Johns Hopkins Hospital. Undergraduates have extensive research opportunities through the Office of Undergraduate Research. The semester system allows for focused study with January intersession options.',
        'programs': [
            ('Biomedical Engineering', 'Top-ranked BME program, linked to JHU Medical School'),
            ('Public Health', 'Bloomberg School of Public Health undergraduate programs'),
            ('Molecular & Cellular Biology', 'Strong premed feeder with research labs'),
            ('International Studies', 'SAIS-affiliated international relations program'),
            ('Computer Science', 'Growing CS program with strong AI and security focus'),
        ],
        'cost_cn': 'JHU 对国际生实行 need-aware 助学金政策。',
        'cost_total': '~$89,500 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning <$80k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED is binding: must attend if admitted and withdraw other applications.',
            'JHU supplemental essay focuses on community and collaboration.',
            'Premed culture is intense; research opportunities start as early as freshman year.',
            'Baltimore location requires awareness of surrounding neighborhood safety.',
            'Need-aware for international: applying for aid may slightly reduce admission chances.',
        ],
    },
    {
        'slug': 'northwestern',
        'name': 'Northwestern University',
        'cn_name': '西北大学',
        'location': 'Evanston, IL',
        'founded': '1851',
        'type': 'Private · Research',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~7.2%',
        'sat_mid': '1500-1560',
        'act_mid': '34-35',
        'tuition': '$65,997',
        'intl_pct': '~10%',
        'enrollment': '~8,800',
        'app_system': 'Common App',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Northwestern supplemental essays',
        'interview': 'Alumni interview, optional',
        'early_label': 'Early Decision (ED)',
        'early_date': 'Nov 1 (decision mid-Dec, binding)',
        'rd_date': 'Jan 3 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，新闻与传播学院全美顶尖，商科、工科、表演艺术均衡强势。',
        'academic_en': 'Northwestern offers a 4-year undergraduate curriculum across 12 schools and colleges. The Medill School of Journalism is nationally renowned, while the Kellogg School of Management offers undergraduate certificates. The McCormick School of Engineering and Bienen School of Music add to the university interdisciplinary strength. The quarter system provides flexibility with 3 terms per year.',
        'programs': [
            ('Journalism (Medill)', 'Top-ranked journalism program with Medill School'),
            ('Communication Studies', 'Strong in media and performance studies'),
            ('Kellogg Certificate Programs', 'Undergraduate business certificates from Kellogg'),
            ('Computer Science', 'Growing CS with strong human-computer interaction'),
            ('Music / Performance (Bienen)', 'Conservatory-level music program'),
        ],
        'cost_cn': '西北大学对国际生实行 need-aware 助学金政策。',
        'cost_total': '~$92,300 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning <$60k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED is binding: must attend if admitted and withdraw other applications.',
            'Northwestern supplemental essays include "Why Northwestern" and short takes.',
            'Quarter system means 10-week terms; pace can be intense.',
            'Strong reputation in consulting and journalism career placement.',
            'Need-aware for international: applying for aid may reduce admission chances.',
        ],
    },
    {
        'slug': 'duke',
        'name': 'Duke University',
        'cn_name': '杜克大学',
        'location': 'Durham, NC',
        'founded': '1838',
        'type': 'Private · Research',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~6.0%',
        'sat_mid': '1510-1570',
        'act_mid': '34-35',
        'tuition': '$66,172',
        'intl_pct': '~12%',
        'enrollment': '~7,000',
        'app_system': 'Common App / Coalition',
        'app_fee': '$85 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26 (recommended for international)',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Duke supplemental essays',
        'interview': 'Alumni interview, optional and by invitation',
        'early_label': 'Early Decision (ED)',
        'early_date': 'Nov 1 (decision mid-Dec, binding)',
        'rd_date': 'Jan 2 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，工科与商科均衡强势，公共政策与医学预科突出。',
        'academic_en': 'Duke offers a 4-year undergraduate curriculum across Trinity College of Arts and Sciences and the Pratt School of Engineering. The Sanford School of Public Policy and Fuqua School of Business offer undergraduate certificates and classes. Duke is known for its strong athletic programs and vibrant campus life. The semester system includes a summer term option.',
        'programs': [
            ('Pratt Engineering', 'BME, ECE, and Mechanical Engineering all top-tier'),
            ('Public Policy (Sanford)', 'Undergraduate public policy flagship program'),
            ('Economics', 'Strong quantitative economics with finance track'),
            ('Computer Science', 'Fast-growing CS with AI and systems focus'),
            ('Biology / Premed', 'Strong premed with Duke Med School affiliation'),
        ],
        'cost_cn': '杜克对国际生实行 need-aware 助学金政策。',
        'cost_total': '~$91,000 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning <$150k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED is binding: must attend if admitted and withdraw other applications.',
            'Duke supplemental essays focus on community, diversity, and intellectual curiosity.',
            'Pratt School of Engineering and Trinity College are separate application choices.',
            'Duke is part of the Research Triangle (with UNC-Chapel Hill and NC State).',
            'Need-aware for international: applying for aid may reduce admission chances.',
        ],
    },
    {
        'slug': 'berkeley',
        'name': 'UC Berkeley',
        'cn_name': '加州大学伯克利分校',
        'location': 'Berkeley, CA',
        'founded': '1868',
        'type': 'Public · Research (flagship)',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~11.4%',
        'sat_mid': '1410-1530',
        'act_mid': '31-35',
        'tuition': '$45,442 (out-of-state)',
        'intl_pct': '~18%',
        'enrollment': '~32,400',
        'app_system': 'UC Application',
        'app_fee': '$80 (international, fee waiver available for CA residents)',
        'std_tests': 'Test-blind (not considered for admission)',
        'english_req': 'TOEFL / IELTS / Duolingo / IB English required for international',
        'recs': 'Not required (some programs may request after application)',
        'essays': 'UC Personal Insight Questions (PIQs) - 4 out of 8 prompts',
        'interview': 'Not offered (some programs have alumni interviews by invitation)',
        'early_label': 'No Early Action / Decision',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Nov 30 (application deadline, decisions late Mar)',
        'aid_date': 'March 2 (FAFSA + Cal Grant deadline)',
        'academic_cn': '公立旗舰大学，工程与计算机全美顶尖，学费相比私立低但规模大。',
        'academic_en': 'UC Berkeley offers a 4-year undergraduate curriculum across 15 colleges and schools. The College of Engineering and Haas School of Business are nationally renowned. With over 350 degree programs across 130+ departments, Berkeley offers exceptional academic breadth. The semester system provides a traditional academic calendar.',
        'programs': [
            ('Electrical Engineering & Computer Science (EECS)', 'Top-ranked EECS program, highly competitive'),
            ('Haas School of Business', 'Undergraduate business program, apply sophomore year'),
            ('Mechanical Engineering', 'Strong design and robotics focus'),
            ('Data Science', 'New and fast-growing undergraduate major'),
            ('Chemistry / Chemical Engineering', 'Top-ranked with Lawrence Berkeley Lab ties'),
        ],
        'cost_cn': 'UC Berkeley 对国际生不提供助学金，需要全额自费。',
        'cost_total': '~$76,000 / year (out-of-state, incl. room, board, personal)',
        'cost_aid_policy': 'Need-based aid only for CA residents; no aid for international',
        'cost_aid_threshold': 'N/A for international students',
        'cost_aid_form': 'FAFSA + Cal Grant (US / CA residents only)',
        'notes': [
            'Test-blind: SAT/ACT scores are not considered for admission.',
            'UC application deadline is Nov 30 - no extensions.',
            'Large class sizes (200+ for lower-division) can feel impersonal.',
            'EECS is highly impacted; direct admission from high school is very competitive.',
            'No financial aid for international students; plan for full cost of attendance.',
        ],
    },
    {
        'slug': 'ucla',
        'name': 'UCLA',
        'cn_name': '加州大学洛杉矶分校',
        'location': 'Los Angeles, CA',
        'founded': '1919',
        'type': 'Public · Research (flagship)',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~8.6%',
        'sat_mid': '1400-1530',
        'act_mid': '31-34',
        'tuition': '$45,442 (out-of-state)',
        'intl_pct': '~14%',
        'enrollment': '~32,400',
        'app_system': 'UC Application',
        'app_fee': '$80 (international, fee waiver available for CA residents)',
        'std_tests': 'Test-blind (not considered for admission)',
        'english_req': 'TOEFL / IELTS / Duolingo / IB English required for international',
        'recs': 'Not required (some programs may request after application)',
        'essays': 'UC Personal Insight Questions (PIQs) - 4 out of 8 prompts',
        'interview': 'Alumni interview, optional for some majors',
        'early_label': 'No Early Action / Decision',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Nov 30 (application deadline, decisions late Mar)',
        'aid_date': 'March 2 (FAFSA + Cal Grant deadline)',
        'academic_cn': '公立旗舰大学，地理位置优越，电影、艺术、医学预科和工程都很强。',
        'academic_en': 'UCLA offers a 4-year undergraduate curriculum across 12 colleges and schools. The Anderson School of Management, School of Theater, Film and Television, and Geffen School of Medicine are nationally ranked. With over 130 undergraduate majors, UCLA provides excellent academic breadth. The semester system follows a traditional academic calendar.',
        'programs': [
            ('Film & Television (TFT)', 'Top-ranked film school with industry connections'),
            ('Business Economics', 'Anderson-affiliated undergraduate business program'),
            ('Computer Science (Samueli)', 'Growing CS program with strong AI focus'),
            ('Psychology / Neuroscience', 'Top-ranked with research opportunities'),
            ('Engineering (Samueli)', 'ME, EE, CS all strong with industry ties'),
        ],
        'cost_cn': 'UCLA 对国际生不提供助学金，需要全额自费。',
        'cost_total': '~$76,000 / year (out-of-state, incl. room, board, personal)',
        'cost_aid_policy': 'Need-based aid only for CA residents; no aid for international',
        'cost_aid_threshold': 'N/A for international students',
        'cost_aid_form': 'FAFSA + Cal Grant (US / CA residents only)',
        'notes': [
            'Test-blind: SAT/ACT scores are not considered for admission.',
            'UC application deadline is Nov 30 - no extensions.',
            'Los Angeles location provides excellent internship and networking opportunities.',
            'UCLA receives the most applications of any US university each year.',
            'No financial aid for international students; plan for full cost of attendance.',
        ],
    },
    {
        'slug': 'umich',
        'name': 'University of Michigan',
        'cn_name': '密歇根大学安娜堡分校',
        'location': 'Ann Arbor, MI',
        'founded': '1817',
        'type': 'Public · Research (flagship)',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~17.7%',
        'sat_mid': '1420-1540',
        'act_mid': '32-35',
        'tuition': '$57,273 (out-of-state)',
        'intl_pct': '~17%',
        'enrollment': '~32,700',
        'app_system': 'Common App / Coalition',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26',
        'english_req': 'TOEFL / IELTS / Duolingo / Cambridge accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + Michigan supplemental essays',
        'interview': 'Not offered for most programs',
        'early_label': 'Early Action (EA)',
        'early_date': 'Nov 1 (decision late Jan, non-binding)',
        'rd_date': 'Feb 1 (decision early Apr)',
        'aid_date': 'Feb 1 (for full consideration)',
        'academic_cn': '公立旗舰大学，Ross 商学院和工程学院全美顶尖，校队和校园氛围活跃。',
        'academic_en': 'University of Michigan offers a 4-year undergraduate curriculum across 19 schools and colleges. The Ross School of Business and College of Engineering are both top-ranked. With over 280 degree programs, Michigan provides exceptional academic breadth and depth. The semester system includes a spring/summer term option.',
        'programs': [
            ('Ross School of Business', 'Top-ranked undergraduate business program, direct admit available'),
            ('Engineering (CoE)', 'Aerospace, ME, ECE, CS all top-tier'),
            ('Computer Science', 'Strong in AI/ML, theory, and systems'),
            ('Public Policy (Ford School)', 'Undergraduate public policy program'),
            ('Economics', 'Strong quantitative economics with business links'),
        ],
        'cost_cn': '密歇根大学对国际生不提供助学金，需要全额自费。',
        'cost_total': '~$83,000 / year (out-of-state, incl. room, board, personal)',
        'cost_aid_policy': 'Need-based aid primarily for Michigan residents; limited merit aid for international',
        'cost_aid_threshold': 'Merit scholarships available for top applicants (all residents)',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / FAFSA only (some international merit)',
        'notes': [
            'EA is non-binding: you can apply to other schools early.',
            'Ross School has direct admission from high school or cross-campus transfer.',
            'Michigan is known for strong school spirit and Big Ten athletics.',
            'Winter in Ann Arbor can be very cold (0°F / -18°C not unusual).',
            'Limited merit-based aid available for international top applicants.',
        ],
    },
    {
        'slug': 'cmu',
        'name': 'Carnegie Mellon University',
        'cn_name': '卡内基梅隆大学',
        'location': 'Pittsburgh, PA',
        'founded': '1900',
        'type': 'Private · Research',
        'tag_class': 'tag-reach', 'tag_label': 'Reach',
        'accept_rate': '~11.3%',
        'sat_mid': '1470-1570',
        'act_mid': '34-35',
        'tuition': '$63,829',
        'intl_pct': '~28%',
        'enrollment': '~7,500',
        'app_system': 'Common App',
        'app_fee': '$75 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26 (recommended for CS/engineering)',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor (some programs require more)',
        'essays': 'Common App personal essay + CMU supplemental essays (school-specific)',
        'interview': 'Not offered for most programs',
        'early_label': 'Early Decision (ED)',
        'early_date': 'Nov 1 (decision mid-Dec, binding)',
        'rd_date': 'Jan 4 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '4 年制研究型大学，计算机、机器人、艺术全美顶尖，跨学科氛围浓厚。',
        'academic_en': 'Carnegie Mellon offers a 4-year undergraduate curriculum across 7 undergraduate colleges. The School of Computer Science is world-renowned, while the College of Engineering, Tepper School of Business, and College of Fine Arts are also top-ranked. CMU is known for its interdisciplinary culture, with popular dual-degree programs like BCSA (Computer Science + Art).',
        'programs': [
            ('Computer Science (SCS)', 'World-renowned CS program, highly competitive direct admit'),
            ('Robotics Institute', 'Undergraduate robotics program, first in the nation'),
            ('Electrical & Computer Engineering (ECE)', 'Top-ranked with AI/ML and systems focus'),
            ('Tepper School of Business', 'Quantitative business with computational finance track'),
            ('Art / Design (CFA)', 'Top-ranked fine arts with strong digital media focus'),
        ],
        'cost_cn': 'CMU 对国际生实行 need-aware 助学金政策，国际生录取率低于本土学生。',
        'cost_total': '~$91,500 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning <$75k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED is binding: must attend if admitted and withdraw other applications.',
            'CMU has 7 separate undergraduate colleges with different admissions standards.',
            'SCS (Computer Science) direct admit is extremely competitive (<5% acceptance).',
            'Interdisciplinary programs (BXA, CSA, etc.) are unique CMU strengths.',
            'Need-aware for international: aid applicants have lower acceptance rates.',
        ],
    },
    {
        'slug': 'nyu',
        'name': 'New York University',
        'cn_name': '纽约大学',
        'location': 'New York, NY',
        'founded': '1831',
        'type': 'Private · Research',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~8% (all campuses)',
        'sat_mid': '1450-1550',
        'act_mid': '33-35',
        'tuition': '$60,438',
        'intl_pct': '~30%',
        'enrollment': '~29,700 (Washington Square)',
        'app_system': 'Common App',
        'app_fee': '$80 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26 (recommended for international)',
        'english_req': 'TOEFL / IELTS / Duolingo / Cambridge accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + NYU supplemental essay (Why NYU)',
        'interview': 'Not offered (some programs may request alumni interviews)',
        'early_label': 'Early Decision (ED I / ED II)',
        'early_date': 'Nov 15 (ED I, decision late Dec); Jan 15 (ED II, decision Feb)',
        'rd_date': 'Jan 5 (decision early Apr)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '私立研究型大学，Stern 商学院和 Tisch 艺术学院全美顶尖，地理位置极佳。',
        'academic_en': 'NYU offers a 4-year undergraduate curriculum across 10 undergraduate schools and colleges with campuses in New York, Abu Dhabi, and Shanghai. The Stern School of Business and Tisch School of the Arts are both nationally renowned. New York City location provides unparalleled internship and cultural access across all fields.',
        'programs': [
            ('Stern School of Business', 'Top-ranked undergraduate business program'),
            ('Tisch School of the Arts', 'Film, theater, and performing arts flagship'),
            ('Steinhardt (Education & Human Development)', 'Education, media, psychology, and nutrition'),
            ('Computer Science (Courant)', 'Strong CS program with AI/systems focus'),
            ('Economics', 'Strong quantitative economics with Wall Street ties'),
        ],
        'cost_cn': 'NYU 对国际生实行 need-aware 助学金政策，助学金竞争激烈。',
        'cost_total': '~$92,800 / year (incl. room, board, personal, NYC cost of living)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Families earning <$100k (US) typically pay no tuition',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED I and ED II are both binding.',
            'NYU has a global network with degree-granting campuses in Abu Dhabi and Shanghai.',
            'NYC is the campus - no traditional campus, buildings scattered across Greenwich Village.',
            'Cost of living in New York is significantly higher than most college towns.',
            'Need-aware for international: aid applicants have lower acceptance rates.',
        ],
    },
    {
        'slug': 'boston-university',
        'name': 'Boston University',
        'cn_name': '波士顿大学',
        'location': 'Boston, MA',
        'founded': '1839',
        'type': 'Private · Research',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~14.4%',
        'sat_mid': '1390-1500',
        'act_mid': '31-34',
        'tuition': '$63,798',
        'intl_pct': '~24%',
        'enrollment': '~18,500',
        'app_system': 'Common App',
        'app_fee': '$80 (fee waiver available)',
        'std_tests': 'Test-optional for 2025-26',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': '2 teachers + counselor',
        'essays': 'Common App personal essay + BU supplemental essay',
        'interview': 'Alumni interview, optional',
        'early_label': 'Early Decision (ED I / ED II)',
        'early_date': 'Nov 1 (ED I, decision mid-Dec); Jan 4 (ED II, decision mid-Feb)',
        'rd_date': 'Jan 4 (decision late Mar)',
        'aid_date': 'Same as application deadline',
        'academic_cn': '私立研究型大学，传媒、酒店管理、生物医学工程都很强，波士顿地理位置好。',
        'academic_en': 'Boston University offers a 4-year undergraduate curriculum across 17 schools and colleges. The College of Communication and School of Hospitality Administration are nationally ranked. BU is the largest private university in Massachusetts and offers extensive study abroad programs across the globe.',
        'programs': [
            ('College of Communication (COM)', 'Journalism, film, advertising, PR - all top-tier'),
            ('School of Hospitality Administration (SHA)', 'Top-ranked hospitality program'),
            ('Biomedical Engineering', 'Strong BME with Boston medical center ties'),
            ('Questrom School of Business', 'Undergraduate business program with finance focus'),
            ('International Relations', 'Strong IR program with global studies focus'),
        ],
        'cost_cn': 'BU 对国际生实行 need-aware 助学金政策，有少量优秀奖学金。',
        'cost_total': '~$88,200 / year (incl. room, board, personal)',
        'cost_aid_policy': 'Need-blind for US applicants; need-aware for international',
        'cost_aid_threshold': 'Trustee Scholarship for top applicants (full-tuition merit)',
        'cost_aid_form': 'CSS Profile + FAFSA (US) / CSS Profile (intl)',
        'notes': [
            'ED I and ED II are both binding.',
            'Boston University is one of the largest private universities in the US.',
            'BU Academy and Kilachand Honors College offer smaller, more selective tracks.',
            'Boston location means excellent internship and networking opportunities.',
            'Trustee Scholarship is BU most prestigious merit award (covers full tuition).',
        ],
    },
    {
        'slug': 'uiuc',
        'name': 'University of Illinois Urbana-Champaign',
        'cn_name': '伊利诺伊大学厄巴纳-香槟分校',
        'location': 'Urbana-Champaign, IL',
        'founded': '1867',
        'type': 'Public · Research (flagship)',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~45%',
        'sat_mid': '1350-1490',
        'act_mid': '29-33',
        'tuition': '$38,088 (out-of-state)',
        'intl_pct': '~15%',
        'enrollment': '~34,800',
        'app_system': 'Common App / Coalition / MyIllini',
        'app_fee': '$75 (international)',
        'std_tests': 'Test-optional for 2025-26 (recommended for engineering)',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': 'Not required (some programs may request)',
        'essays': 'Personal statement + program-specific essays (some majors)',
        'interview': 'Not offered',
        'early_label': 'Early Action (EA)',
        'early_date': 'Nov 1 (decision late Jan, non-binding)',
        'rd_date': 'Jan 5 (decision mid-Feb)',
        'aid_date': 'Feb 15 (priority deadline)',
        'academic_cn': '公立旗舰大学，计算机和工程全美顶尖，学费相对友好，性价比很高。',
        'academic_en': 'UIUC offers a 4-year undergraduate curriculum across 16 colleges and instructional units. The Grainger College of Engineering and Department of Computer Science are both top-ranked. UIUC is known for its strong engineering programs and the National Center for Supercomputing Applications (NCSA).',
        'programs': [
            ('Computer Science', 'Top-ranked CS program with theory, systems, and AI strengths'),
            ('Grainger College of Engineering', 'ECE, ME, AE, all top-tier public engineering'),
            ('Electrical & Computer Engineering (ECE)', 'Top-ranked with strong VLSI/systems focus'),
            ('Accountancy (Gies College of Business)', 'Top-ranked accounting program'),
            ('Aerospace Engineering', 'Strong with NASA and industry partnerships'),
        ],
        'cost_cn': 'UIUC 对国际生不提供助学金，但有少量优秀奖学金。',
        'cost_total': '~$58,000 / year (out-of-state, incl. room, board, personal)',
        'cost_aid_policy': 'Need-based aid for Illinois residents only; merit aid available for all',
        'cost_aid_threshold': 'Merit scholarships for top applicants (all residents)',
        'cost_aid_form': 'FAFSA (US residents only)',
        'notes': [
            'EA is non-binding: you can apply to other schools early.',
            'UIUC has direct admission to most majors (CS, Engineering are competitive).',
            'Grainger Engineering is consistently ranked top 5 among public universities.',
            'Small college town vibe with Big Ten athletics and strong school spirit.',
            'Lower cost than comparable private universities; strong ROI for engineering/CS.',
        ],
    },
    {
        'slug': 'georgia-tech',
        'name': 'Georgia Tech',
        'cn_name': '佐治亚理工学院',
        'location': 'Atlanta, GA',
        'founded': '1885',
        'type': 'Public · Research (STEM-focused)',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~17%',
        'sat_mid': '1380-1520',
        'act_mid': '31-34',
        'tuition': '$34,766 (out-of-state)',
        'intl_pct': '~17%',
        'enrollment': '~18,400',
        'app_system': 'Common App / Coalition / Georgia Tech App',
        'app_fee': '$75 (international)',
        'std_tests': 'Test-optional for 2025-26',
        'english_req': 'TOEFL / IELTS / Duolingo accepted',
        'recs': 'Counselor recommendation only (teacher recs optional)',
        'essays': 'Personal essay + short answer questions',
        'interview': 'Not offered',
        'early_label': 'Early Action (EA)',
        'early_date': 'Oct 15 (EA1, GA residents); Nov 1 (EA2, out-of-state/international)',
        'rd_date': 'Jan 5 (decision mid-Mar)',
        'aid_date': 'March 1 (priority deadline)',
        'academic_cn': '公立理工强校，工程与计算机全美顶尖，学费性价比极高。',
        'academic_en': 'Georgia Tech offers a 4-year undergraduate curriculum focused on engineering, computing, and science. The College of Engineering and College of Computing are both top-ranked. With six colleges total, Georgia Tech provides STEM-focused education with strong industry connections and cooperative education programs.',
        'programs': [
            ('College of Computing', 'Top-ranked CS with strong focus on AI and data science'),
            ('Aerospace Engineering', 'Top-ranked aerospace with NASA and industry ties'),
            ('Industrial & Systems Engineering', ' #1 ranked ISyE program'),
            ('Computer Engineering', 'Strong combination of ECE and CS'),
            ('Scheller College of Business', 'Business with technology management focus'),
        ],
        'cost_cn': '佐治亚理工对国际生不提供助学金，但学费相对便宜，性价比高。',
        'cost_total': '~$55,000 / year (out-of-state, incl. room, board, personal)',
        'cost_aid_policy': 'Need-based aid for GA residents; merit aid available for top applicants',
        'cost_aid_threshold': 'Merit scholarships including Stamps President Scholars (full ride)',
        'cost_aid_form': 'FAFSA + Georgia Scholarship Application (US residents)',
        'notes': [
            'EA is non-binding: two rounds - EA1 (GA) and EA2 (OOS/international).',
            'Georgia Tech has one of the lowest tuition costs among top engineering schools.',
            'Co-op program is very strong - many students graduate with work experience.',
            'Atlanta location provides excellent tech industry internship opportunities.',
            'STEM-focused culture; humanities offerings are more limited than comprehensive universities.',
        ],
    },
    {
        'slug': 'washington',
        'name': 'University of Washington',
        'cn_name': '华盛顿大学西雅图分校',
        'location': 'Seattle, WA',
        'founded': '1861',
        'type': 'Public · Research (flagship)',
        'tag_class': 'tag-match', 'tag_label': 'Match',
        'accept_rate': '~48.5%',
        'sat_mid': '1320-1470',
        'act_mid': '29-34',
        'tuition': '$40,740 (out-of-state)',
        'intl_pct': '~18%',
        'enrollment': '~37,000',
        'app_system': 'Coalition Application / UW Application',
        'app_fee': '$90 (international)',
        'std_tests': 'Test-optional for 2025-26',
        'english_req': 'TOEFL / IELTS / Duolingo / SAT Reading/English required',
        'recs': 'Not required (may be requested for some programs)',
        'essays': 'Coalition essay + UW writing section',
        'interview': 'Not offered',
        'early_label': 'No Early Action / Decision',
        'early_date': 'N/A (no early program)',
        'rd_date': 'Nov 15 (application deadline, decisions mid-Mar)',
        'aid_date': 'February (priority deadline)',
        'academic_cn': '公立旗舰大学，计算机科学全美顶尖，西雅图科技公司多，实习就业好。',
        'academic_en': 'The University of Washington offers a 4-year undergraduate curriculum across 16 colleges and schools. The Paul G. Allen School of Computer Science & Engineering is nationally renowned. UW has extensive research partnerships with Seattle tech companies including Amazon, Microsoft, and Google.',
        'programs': [
            ('Computer Science & Engineering (CSE)', 'Top-ranked Allen School CS program'),
            ('Paul G. Allen School', 'Direct admission and standard admission pathways'),
            ('Bioengineering', 'Strong with Seattle biotech industry ties'),
            ('Business (Foster School)', 'Undergraduate business with tech focus'),
            ('Health Sciences', 'Nursing, pharmacy, and public health all top-ranked'),
        ],
        'cost_cn': 'UW 对国际生不提供助学金，但学费相对便宜，西雅图工作机会多。',
        'cost_total': '~$62,000 / year (out-of-state, incl. room, board, personal)',
        'cost_aid_policy': 'Need-based aid for WA residents; no need-based aid for international',
        'cost_aid_threshold': 'Merit scholarships available for top OOS applicants',
        'cost_aid_form': 'FAFSA + WASFA (US / WA residents only)',
        'notes': [
            'No early action/decision program - all applications due Nov 15.',
            'CSE direct admission is very competitive; most students enter via standard admission.',
            'Seattle location provides unparalleled access to tech industry internships.',
            'Washington state has no state income tax, slightly reducing cost of living.',
            'No need-based aid for international students; plan for full cost.',
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
            <tr><td class="label">Application System</td><td class="value">{app_system}</td></tr>
            <tr><td class="label">Application Fee</td><td class="value">{app_fee}</td></tr>
            <tr><td class="label">Standardized Tests</td><td class="value">{std_tests}</td></tr>
            <tr><td class="label">English Proficiency</td><td class="value">{english_req}</td></tr>
            <tr><td class="label">Recommendations</td><td class="value">{recs}</td></tr>
            <tr><td class="label">Essays</td><td class="value">{essays}</td></tr>
            <tr><td class="label">Interview</td><td class="value">{interview}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Deadlines <span class="en">申请截止时间</span></h2>
        <table class="meta-table">
            <tr><td class="label">{early_label}</td><td class="value">{early_date}</td></tr>
            <tr><td class="label">Regular Decision (RD)</td><td class="value">{rd_date}</td></tr>
            <tr><td class="label">Financial Aid</td><td class="value">{aid_date}</td></tr>
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
    print(f'Generating {len(SCHOOLS)} school profile pages (v13.3)...')
    for s in SCHOOLS:
        gen_one(s)
    print(f'Done. Total: {len(SCHOOLS)} files in {OUT_DIR}')


if __name__ == '__main__':
    main()
