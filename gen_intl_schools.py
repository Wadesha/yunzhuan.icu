#!/usr/bin/env python3
import os
import json

SCHOOLS_DATA = {
    'ca': {
        'name_cn': '加拿大',
        'name_en': 'Canada',
        'app_system': 'OUAC (Ontario) / Direct application to other provinces',
        'duration': '4-year bachelor',
        'schools': [
            {
                'slug': 'toronto',
                'name': 'University of Toronto',
                'cn_name': '多伦多大学',
                'location': 'Toronto, Ontario',
                'founded': '1827',
                'type': 'Public',
                'acceptance': '~43% (overall)',
                'alevel_req': 'AAA - A*A*A* (varies by faculty)',
                'ib_req': '36-42 points (with 6s/7s at HL)',
                'ap_req': 'Five or more 4-5 scores',
                'tuition': '$59,000 - $67,000 CAD',
                'intl_pct': '~23%',
                'ugrad_enrollment': '~74,000',
                'rank_note': 'Ranked #1 in Canada, top 20 globally',
                'description': 'University of Toronto is Canadas largest and most prestigious university, with three campuses (St. George, UTM, UTSC). Known for its research output, Rotman Commerce, engineering, computer science, and life sciences programs.',
                'description_cn': '多大是加拿大规模最大、最负盛名的大学，有圣乔治、密西沙加、士嘉堡三个校区。以科研产出、罗德曼商学院、工程、计算机和生命科学专业著称。',
                'strengths': [
                    ('Computer Science', 'UofT CS - one of the strongest in North America'),
                    ('Rotman Commerce', 'Top business school in Canada'),
                    ('Engineering', 'Engineering Science - one of the most competitive programs'),
                    ('Life Sciences & Medicine', 'Temerty Medicine - renowned medical school'),
                    ('Humanities & Social Sciences', 'Strong across the board'),
                ],
                'app_notes': [
                    'OUAC 105 application for international students',
                    'Program-specific supplementary applications required for some programs (Commerce, Engineering, CS)',
                    'Prerequisite courses required for most programs (e.g., calculus for engineering)',
                    'Top 6 Grade 12 (or equivalent) courses considered',
                    'Highly competitive programs may require 95%+ average',
                ],
                'deadlines': [
                    ('OUAC 105', 'January 15 (most programs)'),
                    ('Supplementary Apps', 'February - March (varies by faculty)'),
                    ('Offers', 'February - May (rolling)'),
                ],
                'college_system': 'No college system (faculty-based)',
                'student_life': 'Located in downtown Toronto, one of North Americas most diverse cities. Hundreds of clubs, Greek life, strong school spirit. St. George campus is beautiful with historic architecture.',
                'weather': 'Toronto has four distinct seasons. Winters can be cold (-5 to -15°C) with snow. Summers are warm and humid (25-30°C).',
            },
            {
                'slug': 'ubc',
                'name': 'University of British Columbia',
                'cn_name': '不列颠哥伦比亚大学',
                'location': 'Vancouver, British Columbia',
                'founded': '1908',
                'type': 'Public',
                'acceptance': '~50% (overall)',
                'alevel_req': 'AAB - AAA (varies by faculty)',
                'ib_req': '32-38 points (with 5s/6s at HL)',
                'ap_req': 'Three or more 4-5 scores',
                'tuition': '$44,000 - $58,000 CAD',
                'intl_pct': '~28%',
                'ugrad_enrollment': '~56,000',
                'rank_note': 'Ranked #2-3 in Canada, top 40 globally',
                'description': 'UBC is a world-leading research university with two campuses (Vancouver and Okanagan). Known for its stunning campus location, Sauder School of Business, engineering, forestry, and earth sciences.',
                'description_cn': 'UBC 是世界领先的研究型大学，有温哥华和奥肯那根两个校区。以其绝美校园、尚德商学院、工程、林业和地球科学著称。',
                'strengths': [
                    ('Sauder School of Business', 'Top Canadian business school on the west coast'),
                    ('Engineering', 'Engineering Co-op program with excellent employment outcomes'),
                    ('Computer Science', 'Strong CS program with Silicon Valley connections'),
                    ('Forestry', 'World-renowned forestry and environmental programs'),
                    ('Medicine & Life Sciences', 'Faculty of Medicine - highly regarded'),
                ],
                'app_notes': [
                    'Apply through UBCs online application system',
                    'Personal profile required for all applicants (essays + activities)',
                    'Program-specific prerequisites (e.g., Physics + Calculus for Engineering)',
                    'Grades from Grade 11 and Grade 12 considered',
                    'Sauder Commerce and Engineering are most competitive',
                ],
                'deadlines': [
                    ('Application Deadline', 'January 15 (most programs)'),
                    ('Document Deadline', 'March 15'),
                    ('Offers', 'February - May (rolling)'),
                ],
                'college_system': 'No college system',
                'student_life': 'Located on a stunning campus overlooking the Pacific Ocean and mountains. Great balance of academics and outdoor lifestyle. Vancouver is consistently ranked one of the worlds most livable cities.',
                'weather': 'Mild, rainy climate. Winter temperatures rarely drop below freezing (2-8°C), but it rains a lot from November to March. Summers are beautiful, warm and dry (20-28°C).',
            },
            {
                'slug': 'mcgill',
                'name': 'McGill University',
                'cn_name': '麦吉尔大学',
                'location': 'Montreal, Quebec',
                'founded': '1821',
                'type': 'Public',
                'acceptance': '~46% (overall)',
                'alevel_req': 'AAB - A*AA (varies by faculty)',
                'ib_req': '33-40 points (with 5s/6s at HL)',
                'ap_req': 'Four or more 4-5 scores',
                'tuition': '$30,000 - $55,000 CAD',
                'intl_pct': '~30%',
                'ugrad_enrollment': '~26,000',
                'rank_note': 'Ranked #1-2 in Canada, top 30 globally',
                'description': 'McGill is one of Canadas most historic and prestigious universities, located in bilingual Montreal. Known for its medical school, law, Desautels Faculty of Management, and strong emphasis on research.',
                'description_cn': '麦吉尔是加拿大历史最悠久、最负盛名的大学之一，位于双语城市蒙特利尔。以医学院、法学院、德索泰尔管理学院和浓厚的科研氛围著称。',
                'strengths': [
                    ('Medicine & Health Sciences', 'McGill Medicine - world-famous medical school'),
                    ('Desautels Management', 'Desautels Faculty of Management - competitive business school'),
                    ('Engineering', 'Strong engineering with co-op options'),
                    ('Law', 'McGill Law - bilingual, highly prestigious'),
                    ('Science & Arts', 'Well-regarded across disciplines'),
                ],
                'app_notes': [
                    'Apply directly through McGills website',
                    'French is not required for most programs (English instruction)',
                    'Quebec residents have lower tuition and special admission pathways',
                    'Prerequisite courses vary by faculty',
                    'Grade 12 (or equivalent) results required',
                ],
                'deadlines': [
                    ('Application Deadline', 'January 15 (most programs)'),
                    ('Document Deadline', 'March 1'),
                    ('Offers', 'February - May (rolling)'),
                ],
                'college_system': 'No college system',
                'student_life': 'Montreal is a vibrant, bilingual city with amazing food, culture, and nightlife. McGills downtown campus is beautiful with historic stone buildings. Affordable compared to Toronto/Vancouver.',
                'weather': 'Continental climate with four seasons. Winters are cold and snowy (-5 to -15°C). Summers are warm and humid (25-30°C). Beautiful fall foliage.',
            },
            {
                'slug': 'waterloo',
                'name': 'University of Waterloo',
                'cn_name': '滑铁卢大学',
                'location': 'Waterloo, Ontario',
                'founded': '1957',
                'type': 'Public',
                'acceptance': '~53% (overall)',
                'alevel_req': 'AAB - AAA (varies by program)',
                'ib_req': '32-38 points (with 5s/6s at HL)',
                'ap_req': 'Three or more 4-5 scores',
                'tuition': '$46,000 - $58,000 CAD',
                'intl_pct': '~26%',
                'ugrad_enrollment': '~40,000',
                'rank_note': 'Best co-op program in Canada; strong engineering and CS',
                'description': 'University of Waterloo is Canadas most innovative university, renowned for its co-operative education (co-op) program. World-class computer science and engineering programs with the highest graduate employment rate in Canada.',
                'description_cn': '滑铁卢大学是加拿大最具创新性的大学，以其合作教育（Co-op）项目闻名。拥有世界一流的计算机科学和工程项目，毕业生就业率为加拿大最高。',
                'strengths': [
                    ('Computer Science', 'Waterloo CS - Canadas #1 CS program'),
                    ('Engineering', '12 engineering disciplines with mandatory co-op'),
                    ('Math & Statistics', 'Faculty of Mathematics - largest in North America'),
                    ('Co-op Program', 'Work terms integrated with studies, 98% employment rate'),
                    ('Quantum Computing', 'World-leading quantum computing research (IQC)'),
                ],
                'app_notes': [
                    'Apply through OUAC 105 for international students',
                    'Waterloo Admission Information Form (AIF) required - very important!',
                    'Math/CS competitions highly recommended (Euclid, CSMC)',
                    'Extremely competitive CS and Software Engineering programs (95%+)',
                    'Program-specific prerequisites (e.g., Advanced Functions, Calculus for Math/Engineering)',
                ],
                'deadlines': [
                    ('OUAC Application', 'January 15 (most programs)'),
                    ('AIF Deadline', 'February 17'),
                    ('Offers', 'February - May (rolling)'),
                ],
                'college_system': 'No college system (faculty-based) - federated universities (St. Jeromes, Renison, St. Pauls, Conrad Grebel)',
                'student_life': 'Located in Kitchener-Waterloo, a growing tech hub (Canadas Silicon Valley North). Co-op students alternate between school and work. Strong entrepreneurial culture.',
                'weather': 'Continental climate. Winters cold (-5 to -15°C) with snow. Summers warm and humid (25-30°C).',
            },
        ],
    },
    'au': {
        'name_cn': '澳大利亚',
        'name_en': 'Australia',
        'app_system': 'Direct application / UAC (NSW/ACT)',
        'duration': '3-year bachelor (4 years with honours)',
        'schools': [
            {
                'slug': 'melbourne',
                'name': 'University of Melbourne',
                'cn_name': '墨尔本大学',
                'location': 'Melbourne, Victoria',
                'founded': '1853',
                'type': 'Public',
                'acceptance': '~70% (overall)',
                'alevel_req': 'AAB - A*AA (varies by program)',
                'ib_req': '31-38 points',
                'ap_req': 'Three or more 4-5 scores',
                'tuition': '$41,000 - $50,000 AUD',
                'intl_pct': '~40%',
                'ugrad_enrollment': '~36,000',
                'rank_note': 'Ranked #1 in Australia, top 35 globally',
                'description': "Australia's oldest and most prestigious university, known for its Melbourne Model (generalist first year + specialization). Strong in medicine, law, business, engineering, and arts.",
                'description_cn': '澳大利亚最古老、最负盛名的大学，以"墨尔本模式"（第一年通识+后三年专业）著称。医学、法律、商科、工程和艺术都很强。',
                'strengths': [
                    ('Medicine', 'Melbourne Medical School - Australias best'),
                    ('Melbourne Business School', 'MBS - top MBA and business programs'),
                    ('Law', 'Melbourne Law School - prestigious graduate law'),
                    ('Engineering', 'Strong engineering with industry connections'),
                    ('Arts & Humanities', 'Well-regarded arts program'),
                ],
                'app_notes': [
                    'Direct application or through UAC (for Australian high school students)',
                    'Melbourne Model: Bachelor of Arts / Science / Commerce / Environments / Fine Arts / Music',
                    'Professional degrees (Medicine, Law, Engineering) at graduate level',
                    'ATAR or equivalent qualification required',
                    'Prerequisites vary by degree',
                ],
                'deadlines': [
                    ('Semester 1 (Feb)', 'December (international)'),
                    ('Semester 2 (Jul)', 'May (international)'),
                    ('Trimester intakes', 'Some programs have multiple intakes'),
                ],
                'college_system': 'Residential colleges (10 colleges) - similar to Oxbridge but less academic',
                'student_life': 'Melbourne is consistently ranked the worlds most livable city. Great coffee, food, arts, and sports culture. Beautiful campus with historic buildings and parklands.',
                'weather': 'Four seasons in one day is the saying! Mild climate. Winter: 10-15°C, cool and rainy. Summer: 20-30°C, with occasional heatwaves.',
            },
            {
                'slug': 'sydney',
                'name': 'University of Sydney',
                'cn_name': '悉尼大学',
                'location': 'Sydney, New South Wales',
                'founded': '1850',
                'type': 'Public',
                'acceptance': '~60% (overall)',
                'alevel_req': 'AAB - A*AA (varies by program)',
                'ib_req': '33-37 points',
                'ap_req': 'Four or more 4-5 scores',
                'tuition': '$42,000 - $54,000 AUD',
                'intl_pct': '~35%',
                'ugrad_enrollment': '~35,000',
                'rank_note': 'Ranked #2-3 in Australia, top 40 globally',
                'description': 'Australias first university, with its iconic sandstone buildings. Strong across the board, particularly in medicine, law, business, and veterinary science. Direct-entry professional degrees available at undergraduate level.',
                'description_cn': '澳大利亚第一所大学，以其标志性的砂岩建筑闻名。综合实力强，医学、法律、商科和兽医学尤其出色。本科可直接入读专业学位。',
                'strengths': [
                    ('Medicine & Health', 'Sydney Medical School - highly regarded'),
                    ('Sydney Law School', 'Prestigious law school with undergraduate entry'),
                    ('Business', 'Sydney Business School - strong MBA and commerce'),
                    ('Engineering & IT', 'Good engineering with industry partnerships'),
                    ('Veterinary Science', 'One of Australias best vet schools'),
                ],
                'app_notes': [
                    'Direct application or through UAC',
                    'Many professional degrees available at undergraduate level (Medicine, Law, Architecture, etc.)',
                    'ATAR / IB / A-Level / AP all accepted',
                    'Some programs require supplementary applications or interviews',
                    'Entry scores vary significantly by program',
                ],
                'deadlines': [
                    ('Semester 1 (Feb)', 'Late November (international)'),
                    ('Semester 2 (Jul)', 'Late May (international)'),
                    ('Rolling admissions', 'Apply early for popular programs'),
                ],
                'college_system': 'Residential colleges (8 colleges) - social, sporting, and academic support',
                'student_life': 'Sydney is Australias largest city with iconic beaches, harbor, and vibrant culture. Beautiful campus near the city center. Excellent work opportunities in finance and tech.',
                'weather': 'Warm temperate climate. Winter: 10-17°C, mild. Summer: 22-30°C, with occasional heatwaves. Best weather in spring and autumn.',
            },
            {
                'slug': 'unsw',
                'name': 'UNSW Sydney',
                'cn_name': '新南威尔士大学',
                'location': 'Sydney, New South Wales',
                'founded': '1949',
                'type': 'Public',
                'acceptance': '~65% (overall)',
                'alevel_req': 'AAB - AAA (varies by program)',
                'ib_req': '32-36 points',
                'ap_req': 'Three or more 4-5 scores',
                'tuition': '$40,000 - $52,000 AUD',
                'intl_pct': '~38%',
                'ugrad_enrollment': '~34,000',
                'rank_note': 'Ranked #3-4 in Australia; strong engineering and business',
                'description': 'UNSW is a leading research university with strengths in engineering, business, and technology. Known for its strong industry connections and high graduate employment rate. Part of the Group of Eight.',
                'description_cn': 'UNSW 是领先的研究型大学，工程、商科和科技专业实力强劲。以紧密的行业联系和高毕业生就业率著称，是澳洲八大名校之一。',
                'strengths': [
                    ('Engineering', 'Australias top engineering faculty (14 disciplines)'),
                    ('AGSM Business School', 'Australian Graduate School of Management - top MBA'),
                    ('Computer Science', 'Strong CS program with industry connections'),
                    ('Law & Justice', 'UNSW Law - highly regarded'),
                    ('Built Environment', 'Architecture, planning, construction'),
                ],
                'app_notes': [
                    'Direct application or through UAC',
                    'Many undergraduate professional degrees available',
                    'Co-op and industry placement opportunities',
                    'Flexible double degree options very popular',
                    'Entry ranks vary by program',
                ],
                'deadlines': [
                    ('Semester 1 (Feb)', 'December (international)'),
                    ('Semester 2 (Jul)', 'May (international)'),
                    ('Trimester system', '3 terms per year (some programs)'),
                ],
                'college_system': 'UNSW Colleges - 3 residential colleges',
                'student_life': 'Located in Kensington, southeast of Sydney city center. Active campus life with many clubs and societies. Good balance of academics and social life. Trimester system allows faster graduation.',
                'weather': 'Sydney climate - warm temperate. Similar to University of Sydney (see above).',
            },
        ],
    },
    'hk': {
        'name_cn': '香港',
        'name_en': 'Hong Kong',
        'app_system': 'Direct application to each university',
        'duration': '4-year bachelor',
        'schools': [
            {
                'slug': 'hku',
                'name': 'The University of Hong Kong',
                'cn_name': '香港大学',
                'location': 'Hong Kong',
                'founded': '1911',
                'type': 'Public',
                'acceptance': '~12% (non-local)',
                'alevel_req': 'A*AA - A*A*A* (varies by program)',
                'ib_req': '36-43 points (with 5s/7s at HL)',
                'ap_req': 'Five or more 5 scores',
                'tuition': '$185,000 - $250,000 HKD',
                'intl_pct': '~20%',
                'ugrad_enrollment': '~18,000',
                'rank_note': 'Ranked #1 in HK, top 30 globally',
                'description': 'Hong Kongs oldest and most prestigious university, with a strong international reputation. Known for its law, medicine, business, engineering, and dentistry programs. English instruction.',
                'description_cn': '香港历史最悠久、最负盛名的大学，国际声誉卓著。法律、医学、商科、工程和牙医专业都很强。全英文教学。',
                'strengths': [
                    ('Medicine & Dentistry', 'HKU Medical School & Faculty of Dentistry - world-class'),
                    ('Law', 'HKU Law - Asias top law schools'),
                    ('Business & Economics', 'Faculty of Business and Economics'),
                    ('Engineering', 'Strong engineering with research focus'),
                    ('Arts & Social Sciences', 'Well-regarded across disciplines'),
                ],
                'app_notes': [
                    'Direct online application to HKU',
                    'Non-Jupas channel for international / non-DSE students',
                    'Interviews for shortlisted applicants (especially medicine, law, etc.)',
                    'Very competitive - top tier programs accept 5% or fewer applicants',
                    'IB / A-Level / AP / SAT all accepted',
                ],
                'deadlines': [
                    ('Main Round', 'November 17 (early) / December (main)'),
                    ('Interviews', 'December - March'),
                    ('Offers', 'January - May'),
                ],
                'college_system': 'Yes! 10 residential halls / colleges with vibrant hall culture',
                'student_life': 'Located on Hong Kong Island, near the city center. English-language education with international student body. Hall culture is a big part of student life.',
                'weather': 'Subtropical climate. Hot and humid summers (28-33°C). Mild, pleasant winters (15-20°C). Typhoon season June-October.',
            },
            {
                'slug': 'cuhk',
                'name': 'The Chinese University of Hong Kong',
                'cn_name': '香港中文大学',
                'location': 'Sha Tin, Hong Kong',
                'founded': '1963',
                'type': 'Public',
                'acceptance': '~15% (non-local)',
                'alevel_req': 'AAA - A*A*A (varies by program)',
                'ib_req': '35-42 points',
                'ap_req': 'Four or more 4-5 scores',
                'tuition': '$145,000 - $195,000 HKD',
                'intl_pct': '~20%',
                'ugrad_enrollment': '~21,000',
                'rank_note': 'Ranked #2 in HK, top 50 globally',
                'description': 'CUHK is a research-oriented university with a college system. Strong in Chinese studies, business, medicine, science, and engineering. Bilingual (Chinese and English) instruction.',
                'description_cn': 'CUHK 是研究型大学，实行书院制。中文研究、商科、医学、理工科都很强。中英双语教学。',
                'strengths': [
                    ('Chinese Studies & Humanities', 'Best in Hong Kong for Chinese studies'),
                    ('Medicine', 'CUHK Medicine - two medical schools in HK'),
                    ('Business', 'CUHK Business School - AACSB accredited'),
                    ('Science & Engineering', 'Strong research in science and engineering'),
                    ('Social Science', 'Well-regarded social sciences'),
                ],
                'app_notes': [
                    'Direct application to CUHK',
                    'Non-Jupas for international students',
                    'College system - 9 constituent colleges',
                    'Some programs require interviews',
                    'IB / A-Level / AP / SAT all accepted',
                ],
                'deadlines': [
                    ('Application Deadline', 'December (early round)'),
                    ('Interviews', 'January - March'),
                    ('Offers', 'February - May'),
                ],
                'college_system': 'Yes! 9 constituent colleges - very strong college system similar to Oxbridge',
                'student_life': 'Located in Sha Tin in the New Territories, with a large, green campus. Strong college traditions and hall life. Bilingual environment (Cantonese, Mandarin, English).',
                'weather': 'Same as HK generally - subtropical. Slightly cooler than HK Island in winter.',
            },
        ],
    },
    'sg': {
        'name_cn': '新加坡',
        'name_en': 'Singapore',
        'app_system': 'Direct application to each university',
        'duration': '3-4 year bachelor',
        'schools': [
            {
                'slug': 'nus',
                'name': 'National University of Singapore',
                'cn_name': '新加坡国立大学',
                'location': 'Singapore',
                'founded': '1905',
                'type': 'Public',
                'acceptance': '~5-7% (international)',
                'alevel_req': 'A*AA - A*A*A* (varies by faculty)',
                'ib_req': '38-44 points (with 7s at HL for top programs)',
                'ap_req': 'Five or more 5 scores',
                'tuition': '$45,000 - $55,000 SGD',
                'intl_pct': '~25%',
                'ugrad_enrollment': '~30,000',
                'rank_note': 'Ranked #1 in Asia, top 15 globally',
                'description': 'Asias top-ranked university, with a strong global reputation. Excellent programs across engineering, business, computing, law, medicine, and science. Highly competitive admission.',
                'description_cn': '亚洲排名第一的大学，全球声誉卓著。工程、商科、计算机、法律、医学和理工科都非常出色。录取竞争非常激烈。',
                'strengths': [
                    ('Computing', 'NUS Computing - Asias top CS program'),
                    ('Engineering', 'Multiple engineering disciplines, very strong'),
                    ('Business', 'NUS Business School - top MBA and BBA'),
                    ('Law', 'NUS Law - top law school in Asia'),
                    ('Medicine', 'Yong Loo Lin School of Medicine'),
                ],
                'app_notes': [
                    'Direct application to NUS',
                    'Extremely competitive for international students',
                    'Scholarships available for top students (bond required for some)',
                    'Some programs require entrance exams or interviews',
                    'IB / A-Level / AP / SAT all accepted but high scores needed',
                ],
                'deadlines': [
                    ('Application Deadline', 'February - March (for A-level / IB)'),
                    ('Interviews / Tests', 'March - May'),
                    ('Offers', 'May - July'),
                ],
                'college_system': 'Residential College system (7 residential colleges + 2 halls)',
                'student_life': 'Located in southwest Singapore, Kent Ridge campus is large and green. English is the medium of instruction. Diverse student body from all over Asia. Strict but excellent education.',
                'weather': 'Tropical rainforest climate. Hot and humid year-round (25-33°C). Frequent afternoon thunderstorms. No seasons.',
            },
            {
                'slug': 'ntu',
                'name': 'Nanyang Technological University',
                'cn_name': '南洋理工大学',
                'location': 'Singapore',
                'founded': '1981',
                'type': 'Public',
                'acceptance': '~8-10% (international)',
                'alevel_req': 'AAA - A*A*A (varies by program)',
                'ib_req': '36-42 points',
                'ap_req': 'Five or more 5 scores',
                'tuition': '$35,000 - $50,000 SGD',
                'intl_pct': '~25%',
                'ugrad_enrollment': '~25,000',
                'rank_note': 'Ranked #2-3 in Asia, top 30 globally',
                'description': 'One of Asias leading technological universities, known for engineering, business, and science. Beautiful modern campus with eco-friendly design. Strong focus on innovation and entrepreneurship.',
                'description_cn': '亚洲顶尖的科技大学之一，以工程、商科和理科闻名。校园现代美丽，环保设计。非常注重创新和创业。',
                'strengths': [
                    ('Engineering', 'NTU Engineering - consistently top globally'),
                    ('Nanyang Business School', 'NBS - top business school in Asia'),
                    ('Computer Science', 'Strong SCSE (School of Computer Science and Engineering)'),
                    ('Science', 'Strong in physics, chemistry, biological sciences'),
                    ('Art, Design & Media', 'ADM - well-regarded art and design school'),
                ],
                'app_notes': [
                    'Direct application to NTU',
                    'Competitive admission, especially for engineering and business',
                    'Scholarships available for high-achieving students',
                    'Some programs require additional assessments',
                    'IB / A-Level / AP all accepted',
                ],
                'deadlines': [
                    ('Application Deadline', 'March (for A-level / IB students)'),
                    ('Interviews', 'April - May (some programs)'),
                    ('Offers', 'May - July'),
                ],
                'college_system': 'Residential halls (18 halls) with vibrant hall culture',
                'student_life': 'Large, modern campus in western Singapore. Beautiful gardens and eco-friendly buildings. Strong hall culture with many activities and competitions. English medium of instruction.',
                'weather': 'Same as NUS - tropical climate, hot and humid year-round.',
            },
        ],
    },
}


def generate_school_html(region_code, school_data, region_data):
    slug = school_data['slug']
    deadline_rows = ''.join(
        f'<tr><td class="label">{k}</td><td class="value">{v}</td></tr>'
        for k, v in school_data['deadlines']
    )
    strength_rows = ''.join(
        f'<tr><td class="label">{k}</td><td class="value">{v}</td></tr>'
        for k, v in school_data['strengths']
    )
    app_note_items = ''.join(f'<li>{n}</li>' for n in school_data['app_notes'])

    college_line = f"Yes! {school_data['college_system']}" if college_info(school_data) else "No college system"

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{school_data['name']} - yunzhuan.icu</title>
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
        .stat-card .value {{ color: #333; font-size: 0.95rem; font-weight: 600; margin-top: 2px; }}
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
        .info-list {{ list-style: none; }}
        .info-list li {{
            padding: 6px 10px;
            font-size: 0.88rem;
            line-height: 1.6;
            border-bottom: 1px solid #f0f0f0;
        }}
        .info-list li:last-child {{ border-bottom: none; }}
        .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 0.8rem; }}
    </style>
</head>
<body>
    <a href="index.html" class="back-link">&larr; Back to {region_data['name_en']} Universities</a>

    <h1>{school_data['name']}</h1>
    <p class="en-name">{school_data['cn_name']}</p>
    <p class="code-line">{school_data['location']} &middot; Founded {school_data['founded']} &middot; {school_data['type']} &middot; {school_data['rank_note']}</p>

    <div class="section">
        <h2>Snapshot <span class="en">关键数据</span></h2>
        <div class="stat-row">
            <div class="stat-card"><div class="label">Acceptance Rate</div><div class="value">{school_data['acceptance']}</div></div>
            <div class="stat-card"><div class="label">A-Level Req</div><div class="value">{school_data['alevel_req']}</div></div>
            <div class="stat-card"><div class="label">IB Req</div><div class="value">{school_data['ib_req']}</div></div>
            <div class="stat-card"><div class="label">AP Req</div><div class="value">{school_data['ap_req']}</div></div>
            <div class="stat-card"><div class="label">Tuition (Intl)</div><div class="value">{school_data['tuition']}</div></div>
            <div class="stat-card"><div class="label">Intl Students</div><div class="value">{school_data['intl_pct']}</div></div>
        </div>
        <p class="cn-hint" style="margin-top:10px;">{school_data['description_cn']}</p>
    </div>

    <div class="section">
        <h2>About the University <span class="en">学校简介</span></h2>
        <p>{school_data['description']}</p>
    </div>

    <div class="section">
        <h2>Application Requirements <span class="en">申请要求</span></h2>
        <table class="meta-table">
            <tr><td class="label">Application System</td><td class="value">{region_data['app_system']}</td></tr>
            <tr><td class="label">Program Duration</td><td class="value">{region_data['duration']}</td></tr>
            <tr><td class="label">A-Level</td><td class="value">{school_data['alevel_req']}</td></tr>
            <tr><td class="label">IB Diploma</td><td class="value">{school_data['ib_req']}</td></tr>
            <tr><td class="label">AP</td><td class="value">{school_data['ap_req']}</td></tr>
            <tr><td class="label">English Proficiency</td><td class="value">TOEFL / IELTS / DET accepted (varies by program)</td></tr>
            <tr><td class="label">Undergrad Enrollment</td><td class="value">{school_data['ugrad_enrollment']}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Strong Programs <span class="en">优势专业</span></h2>
        <table class="meta-table">
            {strength_rows}
        </table>
    </div>

    <div class="section">
        <h2>Application Notes <span class="en">申请要点</span></h2>
        <ul class="info-list">
            {app_note_items}
        </ul>
    </div>

    <div class="section">
        <h2>Key Deadlines <span class="en">关键时间</span></h2>
        <table class="meta-table">
            {deadline_rows}
        </table>
    </div>

    <div class="section">
        <h2>Student Life <span class="en">校园生活</span></h2>
        <p>{school_data['student_life']}</p>
    </div>

    <div class="section">
        <h2>Weather <span class="en">气候环境</span></h2>
        <p>{school_data['weather']}</p>
    </div>

    <p class="footer">&copy; 2026 yunzhuan.icu | {school_data['name']}</p>
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
    <div style="text-align:center;padding:8px 0;font-size:0.75rem;color:#aaa;">
        <a href="../index.html" style="color:#aaa;text-decoration:none;">University Database</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="../../index.html" style="color:#aaa;text-decoration:none;">Home</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="../../contact.html" style="color:#aaa;text-decoration:none;">Contact</a>
        <span style="margin:0 6px;">·</span>
        <a href="javascript:window.scrollTo(0,0)" style="color:#aaa;text-decoration:none;">Back to top</a>
    </div>
</body>
</html>'''


def college_info(school_data):
    if 'college_system' not in school_data:
        return None
    if 'No college' in school_data['college_system']:
        return None
    return school_data['college_system']


def update_index_html(region_code, schools, region_data):
    index_path = f'/workspace/schools/{region_code}/index.html'
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()

    top_schools_html = ''
    for s in schools:
        top_schools_html += f'            <a href="{s["slug"]}.html" class="subject-link">{s["name"]}</a>\n'

    old_pattern = '<div class="section">\n        <h2>Top Universities <span class="en">顶尖大学</span></h2>\n        <div class="subject-list">\n'
    idx = content.find(old_pattern)
    if idx >= 0:
        end_idx = content.find('        </div>\n    </div>', idx)
        before = content[:idx + len(old_pattern)]
        after = content[end_idx:]
        content = before + top_schools_html + after

    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)


def main():
    total = 0
    for region_code, region_data in SCHOOLS_DATA.items():
        schools = region_data['schools']
        for school_data in schools:
            html = generate_school_html(region_code, school_data, region_data)
            output_path = f'/workspace/schools/{region_code}/{school_data["slug"]}.html'
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html)
            print(f'  Generated: {output_path}')
            total += 1

        update_index_html(region_code, schools, region_data)
        print(f'  Updated index: schools/{region_code}/index.html')

    print(f'\nTotal: {total} school detail pages generated')


if __name__ == '__main__':
    main()
