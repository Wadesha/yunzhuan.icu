#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成学校补充文书页 (基于 essays/supplemental-harvard.html 模板)
生成: supplemental-mit.html, supplemental-stanford.html, supplemental-yale.html,
      supplemental-princeton.html, supplemental-columbia.html,
      supplemental-uchicago.html, supplemental-upenn.html
"""
import os

OUT_DIR = '/workspace/essays'

SCHOOLS = [
    {
        'slug': 'supplemental-mit',
        'name': 'MIT Supplemental Essays',
        'cn_name': 'MIT 补充文书题库',
        'school_slug': 'mit',
        'school_name': 'MIT',
        'overview_cn': 'MIT 补充文书以短答为主，重在展示求知欲与动手实践，而非华丽叙事。每题 100-250 字，回答要直接、具体、有动作。',
        'overview_en': 'MIT uses short-answer questions rather than traditional essays. Each response should be direct, specific, and action-oriented — show what you actually do, not what you value in the abstract. Avoid philosophical framing; MIT wants to see how you think and build.',
        'required_prompts': [
            ('M1', 'What field of study appeals to you the most right now? (~100 words)', '"Tell us more about why this field of study at MIT appeals to you."',
             '策略：具体到 MIT 的某个 lab / project / course；不要泛谈"我喜欢 CS"，要写"MIT CSAIL 的 X 项目让我..."。'),
            ('M2', 'How have you contributed to your community? (~250 words)', '"We know you lead a busy life, full of activities, many of which are required of you. Tell us about something you do simply for the pleasure of it."',
             '策略：选一件纯兴趣驱动的事（不是为申请做的）；MIT 重视纯粹的求知与好奇心。'),
            ('M3', 'Describe the world you come from (~250 words)', '"Describe the world you come from (for example, your family, school, community, city) and how that world has shaped your dreams and aspirations."',
             '策略：选一个具体的"world"（家庭、社团、社区），写它如何塑造你的具体梦想，不要泛谈价值观。'),
            ('M4', 'How did you handle a setback or failure? (~250 words)', '"Tell us about a significant challenge you\'ve faced or something that didn\'t go according to plan. How did you manage the situation?"',
             '策略：聚焦一个具体事件，重点写应对过程而非情绪宣泄；MIT 重视 resilience 与 problem-solving。'),
        ],
        'optional_prompts': [
            ('M5', 'Optional Additional Info', '"Is there anything else we should know about you?"',
             '策略：仅在有重大未解释的事实（如转学、gap year、家庭变故）时使用；不要为了凑数硬写。'),
        ],
        'strategy': [
            ('Action over reflection (动作胜反思)', 'MIT 偏好"我做了 X"而非"我意识到 Y"。每段都包含一个具体动作或决策。'),
            ('Specific MIT references (具体到 MIT)', '提到具体的 lab、course、professor、student club；显示你做过研究。'),
            ('STEM portfolio optional', 'Maker Portfolio 可作为补充材料展示工程项目；非 STEM 申请者也可用其他形式展示创造。'),
            ('Short-answer discipline (短答纪律)', '100 字的题不要写到 250；MIT 重视简洁与精准。'),
        ],
        'word_budget': [
            ('M1 Field of study', 'MIT 具体资源 ~50 字 + 你的具体兴趣 ~50 字'),
            ('M2 Pleasure', '一件事 + 为什么让你快乐 ~250 字'),
            ('M3 World', 'world 描述 ~100 字 + 它如何塑造你 ~150 字'),
            ('M4 Challenge', '事件描述 ~80 字 + 应对过程 ~120 字 + 反思 ~50 字'),
        ],
    },
    {
        'slug': 'supplemental-stanford',
        'name': 'Stanford Supplemental Essays',
        'cn_name': '斯坦福补充文书题库',
        'school_slug': 'stanford',
        'school_name': 'Stanford University',
        'overview_cn': '斯坦福补充文书由多个短答 + 3 篇较长文书组成，重在展示求知欲、社群参与与个人特质。短答要精炼有力，长文书要有叙事弧线。',
        'overview_en': 'Stanford uses a mix of short-answer questions (50 words) and three longer essays (250 words). The short answers reward precision and personality; the longer essays reward narrative arc and intellectual depth. Treat short answers as compressed poetry, not truncated essays.',
        'required_prompts': [
            ('S1', 'What is meaningful to you and why? (~250 words)', '"What is the most significant challenge that society faces today?"',
             '策略：选一个你真正关心的社会问题；不要写"气候变暖"这种大众话题，要写你具体能影响的层面。'),
            ('S2', 'Why Stanford? (~250 words)', '"Why Stanford? Reflect on an idea or experience that makes you genuinely excited about learning."',
             '策略：具体到 Stanford 的一个 program / professor / tradition；避免"Stanford 是顶尖大学"这种废话。'),
            ('S3', 'Reflect on something you read (~250 words)', '"Briefly elaborate on one of your extracurricular activities, a job you hold, or responsibilities you have for your family."',
             '策略：选一个对你最重要的活动；写做这件事时你的决策与成长，而不是再次罗列成就。'),
            ('S4', 'Roommate note (~250 words)', '"Write a note to your future roommate that reveals something about you or that will help your roommate know you better."',
             '策略：用日常语气写真实习惯、兴趣或怪癖；这题最忌假装成熟，要保持 17 岁声音。'),
        ],
        'optional_prompts': [],
        'strategy': [
            ('Short-answer precision (短答精准)', '50 字短答每词都要承载信息；避免 "I am passionate about..." 这种填充。'),
            ('Intellectual vitality (思想活力)', '至少一篇文书展示你为某个想法"停不下来"的状态；Stanford 重视纯粹的求知欲。'),
            ('Concrete Stanford fit (具体的 Stanford 契合)', 'Why Stanford 必须提到具体的 Stanford 资源；SIS、特定课程、特定学生社团都行。'),
            ('Roommate authenticity (室友题真实)', '室友题最忌假装成熟；写真实习惯与怪癖，保持 17 岁声音。'),
        ],
        'word_budget': [
            ('S1 Society challenge', '问题定义 ~80 字 + 你的具体角度 ~120 字 + 你想做什么 ~50 字'),
            ('S2 Why Stanford', 'Stanford 具体资源 ~100 字 + 它如何匹配你的目标 ~150 字'),
            ('S3 Activity', '角色与决策 ~150 字 + 反思与成长 ~100 字'),
            ('S4 Roommate', '1-2 个真实习惯 / 兴趣 / 怪癖，写透即可'),
        ],
    },
    {
        'slug': 'supplemental-yale',
        'name': 'Yale Supplemental Essays',
        'cn_name': '耶鲁补充文书题库',
        'school_slug': 'yale',
        'school_name': 'Yale University',
        'overview_cn': '耶鲁补充文书包含短答与长文书，重在展示思想深度、社群参与与对 Yale 的具体兴趣。短答要精炼有力，长文书要有叙事弧线。',
        'overview_en': 'Yale uses short-answer questions (35-125 words) and one longer essay (~250 words). The short answers reward precision and personality; the longer essay rewards narrative depth. Treat the short answers as polished fragments, not drafts.',
        'required_prompts': [
            ('Y1', 'Why Yale? (~125 words)', '"What is it about Yale that has led you to apply?"',
             '策略：具体到 Yale 的一个 academic program、教授、社区传统；避免"Yale 是常春藤"这种废话。'),
            ('Y2', 'Intellectual interest (~250 words)', '"Reflect on a time when you have pursued a topic or idea that captivates you."',
             '策略：选一件让你"停不下来想"的事；写出思考过程而非结论；展现好奇心。'),
            ('Y3', 'Community engagement (~250 words)', '"Reflect on your engagement with a community to which you belong."',
             '策略：选一个你真正投入的社群（家庭、社团、地方社区）；写你的具体贡献与从中学到的东西。'),
            ('Y4', 'Why this Yale program?', '"Yale\'s residential colleges regularly host conversations with guests representing a wide range of experiences and viewpoints. If you could host a conversation, who would you invite?"',
             '策略：选一个真正让你兴奋的对话者；不要选名人凑数，要写为什么这个对话对你重要。'),
        ],
        'optional_prompts': [],
        'strategy': [
            ('35-word discipline (35 字纪律)', 'Yale 的 35 字短答每词都要承载信息；写完先删 30% 再交。'),
            ('Intellectual depth (思想深度)', 'Y2 是 Yale 最看重的题；写出"为什么这个问题让你停不下来"。'),
            ('Community contribution (社群贡献)', 'Y3 不要写"我参加了 X 社团"；要写你具体做了什么改变了社群。'),
            ('Residential college fit (住宿学院契合)', 'Y1 可提到 Yale 的 residential college 系统；显示你了解 Yale 文化。'),
        ],
        'word_budget': [
            ('Y1 Why Yale', 'Yale 具体资源 ~75 字 + 它如何匹配你的目标 ~50 字'),
            ('Y2 Intellectual', '话题引入 ~50 字 + 思考过程 ~150 字 + 后续影响 ~50 字'),
            ('Y3 Community', '社群描述 ~50 字 + 你的贡献 ~150 字 + 反思 ~50 字'),
            ('Y4 Conversation', '对话者选择 ~50 字 + 为什么 ~150 字 + 你想问什么 ~50 字'),
        ],
    },
    {
        'slug': 'supplemental-princeton',
        'name': 'Princeton Supplemental Essays',
        'cn_name': '普林斯顿补充文书题库',
        'school_slug': 'princeton',
        'school_name': 'Princeton University',
        'overview_cn': '普林斯顿补充文书强调学术兴趣、社群参与与对 Princeton 的具体了解。要求包括 Your Voice（个人故事）、Service/Citizenship（社群参与）、Why Princeton 三大类。',
        'overview_en': 'Princeton requires supplemental essays covering three areas: Your Voice (personal story), Service & Citizenship (community engagement), and Why Princeton (fit). Each essay should reveal a distinct facet of your profile. Princeton values intellectual depth and commitment to service.',
        'required_prompts': [
            ('P1', 'Your Voice - Background (~250 words)', '"As a research institution that also prides itself on its liberal arts curriculum, Princeton allows students to explore areas across the humanities and the sciences. Reflecting on your own experience, describe a time when you felt out of your comfort zone."',
             '策略：选一个真正走出舒适区的经历；写你如何应对与新学到的东西。'),
            ('P2', 'Your Voice - Conversation (~250 words)', '"Princeton has a commitment to service and civic engagement. Tell us how your story intersects with these ideals."',
             '策略：具体到一件你为社群做的事；不要空谈"我想改变世界"。'),
            ('P3', 'Why Princeton? (~250 words)', '"Princeton supplements its liberal arts curriculum with a precept system. Please respond to this prompt in 250 words or fewer."',
             '策略：具体到 Princeton 的一个 program、教授、precept 体验；显示你了解 Princeton 的学术文化。'),
            ('P4', 'Service / Citizenship (~250 words)', '"Princeton values community service and civic responsibility. Please describe how you have contributed to your community."',
             '策略：选一个长期投入的服务项目；写你具体做了什么、产生了什么影响。'),
        ],
        'optional_prompts': [],
        'strategy': [
            ('Precept fit (precept 契合)', 'Why Princeton 要提到对 precept 系统的理解；显示你适合小班讨论。'),
            ('Service continuity (服务延续性)', 'Princeton 重视长期服务而非一次性活动；P4 要展示持续投入。'),
            ('Voice authenticity (个人声音真实)', 'Your Voice 题最忌假装成熟；保持 17 岁真实声音。'),
            ('Junior paper awareness (了解独立研究)', '可提到对 junior paper / senior thesis 的期待；显示你了解 Princeton 的学术要求。'),
        ],
        'word_budget': [
            ('P1 Voice - Background', '场景引入 ~80 字 + 应对过程 ~120 字 + 学到的东西 ~50 字'),
            ('P2 Voice - Conversation', '故事 ~100 字 + 它如何与 service 理念交集 ~150 字'),
            ('P3 Why Princeton', 'Princeton 具体资源 ~100 字 + 它如何匹配你的目标 ~150 字'),
            ('P4 Service', '项目描述 ~80 字 + 你的角色 ~120 字 + 影响 ~50 字'),
        ],
    },
    {
        'slug': 'supplemental-columbia',
        'name': 'Columbia Supplemental Essays',
        'cn_name': '哥大补充文书题库',
        'school_slug': 'columbia',
        'school_name': 'Columbia University',
        'overview_cn': '哥大补充文书包含列表题与短文书，列表题展示你的阅读与兴趣广度，短文书展示社群参与与对 Columbia Core 的兴趣。',
        'overview_en': 'Columbia uses list questions (books, media, cultural events) and short essays. The list questions reward breadth and authenticity — do not curate for admissions. The essays reward engagement with NYC and the Core Curriculum.',
        'required_prompts': [
            ('C1', 'List - Books (~75 words)', '"List the titles of the books, essays, poetry, short stories or plays you read outside of academic classes that you enjoyed most during secondary/high school."',
             '策略：列出真实读过的书；不要为申请凑经典书单。审查官能识别"为申请而读"的书单。'),
            ('C2', 'List - Media (~75 words)', '"List the titles of the films, concerts, shows, exhibits, lectures and other entertainments you enjoyed most during secondary/high school."',
             '策略：列真实消费过的媒体；包括电影、演出、展览、讲座等。'),
            ('C3', 'List - Communities (~75 words)', '"List the student organizations, publications, competitions, research, community service, family duties, jobs or other ways you have spent time outside the classroom."',
             '策略：列出真实参与的活动；不要按"含金量"排序，按你的时间投入排序。'),
            ('C4', 'Why Columbia? (~250 words)', '"Why are you interested in attending Columbia University?"',
             '策略：具体到 Core Curriculum、NYC 资源、特定学院（CC 或 SEAS）；显示你了解 Columbia 文化。'),
            ('C5', 'Why your field? (~250 words)', '"Why does the field of study you indicated appeal to you?"',
             '策略：写出你为什么对这个领域感兴趣；具体到一件事触发了你的兴趣。'),
        ],
        'optional_prompts': [],
        'strategy': [
            ('List authenticity (列表真实)', '列表题最忌为申请凑书单；列真实读过的书和参与的活动。'),
            ('Core Curriculum fit (核心课程契合)', 'Why Columbia 要提到 Core；显示你了解 Columbia 的学术文化。'),
            ('NYC engagement (纽约市参与)', '可提到对 NYC 资源的期待；但不要只写"NYC 很好玩"。'),
            ('CC vs SEAS 区分', '申请 CC 与 SEAS 文书重点不同；按你申请的具体学院调整。'),
        ],
        'word_budget': [
            ('C1-C3 Lists', '每个列表 5-10 条；按时间投入或真实喜爱排序'),
            ('C4 Why Columbia', 'Columbia 具体资源 ~100 字 + 它如何匹配你的目标 ~150 字'),
            ('C5 Why field', '兴趣触发事件 ~80 字 + 持续探索 ~120 字 + 未来方向 ~50 字'),
        ],
    },
    {
        'slug': 'supplemental-uchicago',
        'name': 'UChicago Supplemental Essays',
        'cn_name': '芝加哥大学补充文书题库',
        'school_slug': 'uchicago',
        'school_name': 'University of Chicago',
        'overview_cn': '芝大补充文书以"古怪题目"著称，Extended Essay 每年变化，鼓励创意思考。Why UChicago 题展示对芝大独特学术文化的兴趣。',
        'overview_en': 'UChicago is famous for its quirky Extended Essay prompts, which change yearly and reward creative thinking. The Why UChicago essay demonstrates fit with the university\'s intellectually intense culture. Treat Extended Essay as a chance to show how you think, not what you know.',
        'required_prompts': [
            ('U1', 'Why UChicago? (~250 words)', '"How does the University of Chicago, as you know it now, satisfy your desire for a particular kind of learning, community, and future?"',
             '策略：具体到芝大的 Core、Socratic method、quarter system；显示你了解"Life of the Mind"文化。'),
            ('U2', 'Extended Essay (~650 words)', '"Choose one of the six extended essay prompts [changes yearly]."',
             '策略：选一个让你"停不下来想"的题；不要写"安全"答案。Extended Essay 是展示思想风格的机会。'),
        ],
        'optional_prompts': [
            ('U3', 'Optional Additional Info', '"Is there any additional information you would like to share with us?"',
             '策略：仅在主文书 + 必答题没讲清的关键事实需要补充时使用；不要为了凑数硬写。'),
        ],
        'strategy': [
            ('Quirky prompt embrace (拥抱古怪题)', 'Extended Essay 不要选"安全"题；选一个让你能展示思考风格的题。'),
            ('Life of the Mind fit (思想生活契合)', 'Why UChicago 要展示你适合高强度学术文化；提到 Core 与 Socratic method。'),
            ('Creative thinking over knowledge (创意胜知识)', 'Extended Essay 不是考察你懂什么，而是考察你怎么想；过程比结论重要。'),
            ('Voice consistency (语气一致)', 'Why UChicago 与 Extended Essay 语气可以不同，但应能看出是同一个作者。'),
        ],
        'word_budget': [
            ('U1 Why UChicago', 'UChicago 具体资源 ~100 字 + 它如何匹配你的目标 ~150 字'),
            ('U2 Extended Essay', '开头钩子 ~100 字 + 思考过程 ~400 字 + 反思或反转 ~150 字'),
        ],
    },
    {
        'slug': 'supplemental-upenn',
        'name': 'UPenn Supplemental Essays',
        'cn_name': '宾大补充文书题库',
        'school_slug': 'upenn',
        'school_name': 'University of Pennsylvania',
        'overview_cn': '宾大补充文书按学院不同要求不同，必答题展示对 Penn 社群与跨学科兴趣，学院题展示对该学院具体资源的了解。',
        'overview_en': 'UPenn requires a school-specific essay (College, Wharton, SEAS, or Nursing) plus common essays on community and interdisciplinary interest. The school-specific essay must demonstrate deep knowledge of that school\'s programs. Penn values interdisciplinary study and practical application.',
        'required_prompts': [
            ('U1', 'Thank you note (~200 words)', '"Write a short thank-you note to someone you have not yet thanked."',
             '策略：选一个真实未感谢过的人；写具体帮助而非泛泛感谢。'),
            ('U2', 'How will you explore community? (~200 words)', '"How will you explore community at Penn?"',
             '策略：具体到 Penn 的一个 club / organization / tradition；显示你了解 Penn 社群文化。'),
            ('U3', 'School-specific essay (~300 words)', '"The school-specific essay prompt depends on which undergraduate school you are applying to (College, Wharton, SEAS, Nursing)."',
             '策略：按申请学院（College / Wharton / SEAS / Nursing）回答；提到该学院的具体 program、教授、course。'),
        ],
        'optional_prompts': [
            ('U4', 'Optional Additional Info', '"Is there anything else we should know about you?"',
             '策略：仅在主文书 + 必答题没讲清的关键事实需要补充时使用；不要为了凑数硬写。'),
        ],
        'strategy': [
            ('School specificity (学院具体性)', 'School-specific essay 必须提到该学院的具体资源；不要泛谈 Penn。'),
            ('Interdisciplinary fit (跨学科契合)', 'Penn 重视跨学科；可提到 One University policy 与跨学院选课。'),
            ('Thank-you authenticity (感谢信真实)', 'Thank you note 最忌假装感人；写真实未感谢过的人。'),
            ('Practical application (实践应用)', 'Penn 重视实践应用；可提到实习、创业、社区项目的具体计划。'),
        ],
        'word_budget': [
            ('U1 Thank you', '人物与帮助描述 ~100 字 + 你的反思 ~100 字'),
            ('U2 Community', 'Penn 具体社群 ~100 字 + 你的贡献 ~100 字'),
            ('U3 School-specific', '学院资源 ~150 字 + 你的具体兴趣 ~150 字'),
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
        .topic-list {{ list-style: none; }}
        .topic-list li {{
            padding: 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.9rem;
            line-height: 1.5;
        }}
        .topic-list li:last-child {{ border-bottom: none; }}
        .topic-list .topic-title {{ font-weight: 600; color: #333; }}
        .topic-list .topic-desc {{ color: #777; font-size: 0.82rem; margin-top: 4px; line-height: 1.6; }}
        .topic-list .prompt-quote {{
            color: #555;
            font-size: 0.85rem;
            font-style: italic;
            background: #f8f9fa;
            padding: 6px 10px;
            border-left: 3px solid #667eea;
            margin-top: 4px;
        }}
        .prompt-tag {{
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.75rem;
            font-weight: 600;
            margin-right: 6px;
            background: #e8f4fd;
            color: #1976d2;
        }}
        .word-tag {{
            display: inline-block;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 0.72rem;
            font-weight: 600;
            background: #fce4ec;
            color: #c2185b;
            margin-left: 6px;
        }}
        .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 0.8rem; }}
    </style>
    <link rel="stylesheet" href="/css/collapse.css">
</head>
<body>
    <a href="index.html" class="back-link">&larr; Back to Essay Resources</a>
    <a href="../schools/us/{school_slug}.html" class="back-link" style="margin-left:10px;">{school_name} Profile &rarr;</a>

    <h1>{name}</h1>
    <p class="en-name">{cn_name}</p>
    <p class="code-line">2025-26 application cycle · Required + Optional prompts</p>

    <div class="section">
        <h2>Overview <span class="en">题目总览</span></h2>
        <p class="cn-hint">{overview_cn}</p>
        <p>{overview_en}</p>
    </div>

    <div class="section">
        <h2>Required Prompts <span class="en">必答题</span></h2>
        <ul class="topic-list">
            {required_html}
        </ul>
    </div>

    {optional_section}

    <div class="section">
        <h2>Writing Strategy <span class="en">写作策略</span></h2>
        <ul class="topic-list">
            {strategy_html}
        </ul>
    </div>

    <div class="section">
        <h2>Word Budget <span class="en">字数分配建议</span></h2>
        <ul class="topic-list">
            {word_budget_html}
        </ul>
    </div>

    <p class="footer">&copy; 2026 yunzhuan.icu | {name}</p>
    <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
    <div style="text-align:center;padding:8px 0;font-size:0.75rem;color:#aaa;">
        <a href="../index.html" style="color:#aaa;text-decoration:none;">Home</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="../intl-exams/index.html" style="color:#aaa;text-decoration:none;">International Exams</a>
        <span style="margin:0 6px;">&middot;</span>
        <a href="javascript:window.scrollTo(0,0)" style="color:#aaa;text-decoration:none;">Back to top</a>
    </div>
</body>
</html>
'''

OPTIONAL_TEMPLATE = '''    <div class="section">
        <h2>Optional Prompts <span class="en">选答题</span></h2>
        <ul class="topic-list">
            {optional_html}
        </ul>
    </div>
'''


def render_prompt(p):
    tag, title, quote, strategy = p
    # extract word count from title if present
    return (
        f'<li>\n'
        f'                <div class="topic-title"><span class="prompt-tag">{tag}</span>{title}</div>\n'
        f'                <div class="prompt-quote">{quote}</div>\n'
        f'                <div class="topic-desc">{strategy}</div>\n'
        f'            </li>'
    )


def gen_one(s):
    required_html = '\n            '.join(render_prompt(p) for p in s['required_prompts'])
    strategy_html = '\n            '.join(
        f'<li>\n                <div class="topic-title">{t}</div>\n                <div class="topic-desc">{d}</div>\n            </li>'
        for t, d in s['strategy']
    )
    word_budget_html = '\n            '.join(
        f'<li><div class="topic-title">{t}</div><div class="topic-desc">{d}</div></li>'
        for t, d in s['word_budget']
    )
    if s['optional_prompts']:
        optional_html = '\n            '.join(render_prompt(p) for p in s['optional_prompts'])
        optional_section = OPTIONAL_TEMPLATE.format(optional_html=optional_html)
    else:
        optional_section = ''
    html = TEMPLATE.format(
        required_html=required_html,
        strategy_html=strategy_html,
        word_budget_html=word_budget_html,
        optional_section=optional_section,
        **{k: v for k, v in s.items() if k not in (
            'required_prompts', 'optional_prompts', 'strategy', 'word_budget'
        )}
    )
    out_path = os.path.join(OUT_DIR, s['slug'] + '.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  generated: {out_path}')


def main():
    print(f'Generating {len(SCHOOLS)} supplemental essay pages...')
    for s in SCHOOLS:
        gen_one(s)
    print(f'Done. Total: {len(SCHOOLS)} files in {OUT_DIR}')


if __name__ == '__main__':
    main()
