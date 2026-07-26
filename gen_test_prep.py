#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成标化考试备考页 (基于 tests/sat-prep.html 模板)
生成: act-prep.html, toefl-prep.html, ielts-prep.html, det-prep.html
"""
import os

OUT_DIR = '/workspace/tests'

TESTS = [
    {
        'slug': 'act-prep',
        'name': 'ACT Preparation',
        'cn_name': 'ACT 备考资源',
        'code_line': 'Official resources · textbooks · practice plan · test-day strategy',
        'overview_href': 'act.html',
        'official_resources': [
            ('ACT Official Online Prep', 'ACT 官方在线备考平台，含真题模考、技能点练习与个性化学习路径。'),
            ('The Official ACT Prep Guide', '官方纸质版真题集，含 6 套完整官方模考与详细解析。'),
            ('ACT Academy (Free)', '官方免费在线学习平台，按弱项推送视频与练习。'),
            ('ACT Sample Questions', '官网公开的样题集，按 English / Math / Reading / Science 四模块分类。'),
        ],
        'textbooks': [
            ('The Official ACT Prep Guide', '官方真题集，必须用作模考基准'),
            ('Barron\'s ACT Premium', '难度略高于真题，适合冲刺阶段拉分'),
            ('Princeton Review ACT Premium', '解题技巧讲解细致，适合入门阶段'),
            ('Erica Meltzer - The Complete Guide to ACT English', 'English 模块专项，适合文法卡瓶颈'),
            ('Kaplan ACT Math & Science Workbook', '数学与科学推理分难度题集'),
        ],
        'timeline': [
            ('Phase 1 · Diagnostic (Week 1-2)', '用 Official Online Prep 第 1 套模考建立基线分数，按 English/Math/Reading/Science 四模块分析错题类型。'),
            ('Phase 2 · Skill Building (Week 3-8)', '按模块专项练习，每周完成 1 套完整模考，错题入错题本；Science 训练图表检索速度。'),
            ('Phase 3 · Practice Tests (Week 9-12)', '每周 1-2 套官方模考，严格按考试时段（上午）进行，训练耐力与时间分配（每模块严格控时）。'),
            ('Phase 4 · Final Tune-up (Week 13-16)', '回归错题本，针对性复习；Science 与 Reading 训练"扫读-定位"流程；考前 1 周保持手感。'),
        ],
        'modules': [
            ('English (45 min, 75 Q)', '75 道文法题，重点是 rhetoric（修辞）与 usage/mechanics（用法与机制）。训练先读全文再答题，关注过渡词、句子顺序与段落逻辑。'),
            ('Math (60 min, 60 Q)', '代数、几何、三角与统计。题量大但难度低，关键是速度。考前训练 Desmos 风格计算器使用与公式速查。'),
            ('Reading (35 min, 40 Q)', '4 篇文章（散文、社科、人文、自然科学），每篇 10 题。训练先读题干再扫文章，定位关键词；避免逐字精读。'),
            ('Science (35 min, 40 Q)', '6-7 篇科学推理题，重点不是科学知识而是图表与实验分析。训练图表速读、变量识别、实验对比三类技能。'),
            ('Writing (Optional, 40 min)', '1 篇议论文，分析复杂问题并给出立场。多数顶尖大学不再要求，但部分仍接受作为补充材料。'),
        ],
        'score_strategy': [
            ('Free Score Reports', '考试后可在报名时选择 4 所学校免费送分'),
            ('Score Choice', '可按考试场次选择性送分，但部分学校要求全部成绩'),
            ('Superscore', 'ACT 官方支持跨场次拼分；多数美国大学接受 ACT superscore'),
            ('TIR (Test Information Release)', '特定考试场次可购买试题与答案（12 月、4 月、6 月），适合复盘'),
        ],
    },
    {
        'slug': 'toefl-prep',
        'name': 'TOEFL Preparation',
        'cn_name': 'TOEFL 备考资源',
        'code_line': 'Official resources · textbooks · practice plan · test-day strategy',
        'overview_href': 'toefl.html',
        'official_resources': [
            ('TOEFL Official Practice Online (TPO)', 'ETS 官方机经模考软件，含完整机考界面与计时，最接近真实考试。'),
            ('The Official Guide to the TOEFL iBT', '官方纸质版指南，含 4 套完整模考与解析，附 CD-ROM 听力音频。'),
            ('Official TOEFL iBT Tests Volumes', '官方真题集（Vol 1 / Vol 2 / Vol 3），各含 5 套完整模考。'),
            ('TOEFL Go! Official App', 'ETS 官方移动 App，含免费练习题与考试当日提醒。'),
        ],
        'textbooks': [
            ('The Official Guide to the TOEFL iBT (ETS)', '官方指南，必读，含真实评分标准'),
            ('Barron\'s TOEFL iBT Premium', '难度略高于真题，适合冲刺阶段拉分'),
            ('Delta\'s Key to the TOEFL iBT', '技能点分类训练，适合入门阶段'),
            ('Notefull TOEFL Mastery', '在线视频课程，Speaking 与 Writing 模板实用'),
            ('Vocabulary 4000 for TOEFL', '学术词汇专项，适合 Reading 与 Listening 词汇盲区'),
        ],
        'timeline': [
            ('Phase 1 · Diagnostic (Week 1-2)', '用 TPO 第 1 套模考建立基线分数，按 Reading / Listening / Speaking / Writing 四模块分析弱项。'),
            ('Phase 2 · Skill Building (Week 3-8)', '按模块专项练习，每天 30 分钟精听 + 30 分钟泛读；积累学科词汇与听力笔记系统。'),
            ('Phase 3 · Practice Tests (Week 9-12)', '每周 1-2 套 TPO 模考，严格按考试时段进行；Speaking 用录音回放自评，Writing 用 ETS 评分标准对照。'),
            ('Phase 4 · Final Tune-up (Week 13-16)', '回归错题本与高频词汇；Speaking 与 Writing 训练模板熟练度；考前 1 周保持每日 1 套听力。'),
        ],
        'modules': [
            ('Reading (54-72 min, 30-40 Q)', '3-4 篇学术文章，每篇 ~700 词 10 题。题型含主旨、细节、推断、词汇、句子简化、插入句、文章小结。训练先读题干再扫文章，关键词定位。'),
            ('Listening (41-57 min, 28-39 Q)', '6-9 段听力：2-3 段对话（校园场景）+ 4-6 段讲座（学术）。重点训练笔记系统：记关键词与逻辑关系，不逐字记录。'),
            ('Speaking (17 min, 4 tasks)', '1 题独立口语（个人观点）+ 3 题综合口语（读 + 听 + 说）。模板化输出：开头观点 → 2 个理由 + 例证 → 结尾总结。'),
            ('Writing (50 min, 2 tasks)', '1 题综合写作（20 min，读 + 听 + 写 ~200 词）+ 1 题独立写作（30 min，~400 词）。综合写作重点是听力反驳点的转写，独立写作重论证结构。'),
        ],
        'score_strategy': [
            ('Free Score Reports', '考试前可指定 4 所学校免费送分'),
            ('MyBest Scores', 'TOEFL 自动拼分送最近 2 年内最高分项，多数大学接受'),
            ('Score Validity', 'TOEFL 成绩 2 年有效'),
            ('Rush Reporting', '$40/所加急送分，3-5 个工作日送达'),
        ],
    },
    {
        'slug': 'ielts-prep',
        'name': 'IELTS Preparation',
        'cn_name': 'IELTS 备考资源',
        'code_line': 'Official resources · textbooks · practice plan · test-day strategy',
        'overview_href': 'ielts.html',
        'official_resources': [
            ('Cambridge IELTS Series (1-19)', '剑桥官方真题集，每本含 4 套完整模考与音频，必备。最新版本（17-19）难度最接近现行考试。'),
            ('Official IELTS Practice Materials', '官方发布的练习册，含考官点评与样例答案。'),
            ('British Council Road to IELTS', 'British Council 官方免费在线课程，含 9 套模考与视频讲解。'),
            ('IELTS.org Sample Questions', '官网公开的样题集，按 Listening / Reading / Writing / Speaking 四模块分类。'),
        ],
        'textbooks': [
            ('Cambridge IELTS 17-19', '官方最新真题集，必须用作模考基准'),
            ('The Official Cambridge Guide to IELTS', '官方指南，技能点讲解 + 真题'),
            ('Pauline Cullen - Vocabulary for IELTS Advanced', '学术词汇专项，适合冲 7.5+'),
            ('Matt Clark - IELTS Speaking Success', 'Speaking 话题卡 + 高分答案模板'),
            ('IELTS Liz (Free Blog)', '免费在线资源，Writing Task 2 模板实用'),
        ],
        'timeline': [
            ('Phase 1 · Diagnostic (Week 1-2)', '用 Cambridge IELTS 19 第 1 套模考建立基线分数，按四模块分析弱项；确认 Academic 还是 General Training。'),
            ('Phase 2 · Skill Building (Week 3-8)', '按模块专项练习，每天 30 分钟听力 + 30 分钟阅读；积累高频话题词汇与同义替换。'),
            ('Phase 3 · Practice Tests (Week 9-12)', '每周 1-2 套 Cambridge 真题模考，严格按考试时段进行；Writing 用考官评分标准对照，Speaking 录音回放自评。'),
            ('Phase 4 · Final Tune-up (Week 13-16)', '回归错题本与高频话题卡；Writing Task 1 与 Task 2 训练模板熟练度；考前 1 周保持每日 1 套听力。'),
        ],
        'modules': [
            ('Listening (30 min + 10 min transfer, 40 Q)', '4 段听力：2 段日常对话 + 2 段学术讲座。重点训练预读题目、关键词定位与拼写准确（纸笔考试需填答题卡）。'),
            ('Reading (60 min, 40 Q)', '3 篇文章，约 2150-2750 词。题型含 T/F/NG、匹配、填空、选择题、Heading。重点训练 T/F/NG 区分 Not Given 与 False，避免主观推断。'),
            ('Writing (60 min, 2 tasks)', 'Task 1（20 min，~150 词）：描述图表（线图、柱图、饼图、表格、流程图、地图）。Task 2（40 min，~250 词）：议论文。重点训练 Task 1 数据对比与 Task 2 论证结构。'),
            ('Speaking (11-14 min, 3 parts)', 'Part 1（4-5 min）：日常问答。Part 2（3-4 min）：话题卡 1 分钟准备 + 2 分钟独白。Part 3（4-5 min）：基于 Part 2 的深度讨论。重点训练话题卡结构与 Part 3 抽象表达。'),
        ],
        'score_strategy': [
            ('Free TRF (Test Report Form)', '报名时可指定 5 所学校免费送分'),
            ('Score Validity', 'IELTS 成绩 2 年有效'),
            ('EOR (Enquiry on Results)', '6 周内可申请重判（费用 ~$200，成功则退还）'),
            ('Rush Reporting', '电子版送分 3-5 个工作日；纸质版 7-10 天'),
        ],
    },
    {
        'slug': 'det-prep',
        'name': 'Duolingo English Test (DET) Preparation',
        'cn_name': 'DET 备考资源',
        'code_line': 'Official resources · practice plan · test-day strategy',
        'overview_href': 'det.html',
        'official_resources': [
            ('Duolingo English Test Official Practice', '官网免费练习题，含各题型样题与官方评分标准。'),
            ('DET Practice Test (Free)', '官网免费 15 分钟模拟测试，了解题型与界面。'),
            ('Duolingo English Test Official Guide', '官方发布的考试指南，含题型说明与样题解析。'),
            ('Duolingo English Test YouTube Channel', '官方频道，含考试流程讲解与高分技巧视频。'),
        ],
        'textbooks': [
            ('Duolingo English Test Official Guide', '官方指南，必读，含题型说明与评分标准'),
            ('DET Practice Book (Third-party)', '第三方题集，适合熟悉题型'),
            ('Vocabulary.com', '学术词汇专项，DET 词汇题占比高'),
            ('TED Talks', '听力与口语训练，学术话题与 DET 题材接近'),
            ('The Economist / National Geographic', '阅读训练，学术文章与 DET 阅读题材接近'),
        ],
        'timeline': [
            ('Phase 1 · Diagnostic (Week 1-2)', '用官网免费 Practice Test 建立基线分数，熟悉考试界面与自适应机制；确认设备（摄像头、麦克风、网络）达标。'),
            ('Phase 2 · Skill Building (Week 3-8)', '按题型专项练习：Read & Complete、Listen & Type、Read & Select、C-Test；积累学术词汇与听说转换速度。'),
            ('Phase 3 · Practice Tests (Week 9-12)', '每周 2-3 次完整 Practice Test，训练自适应节奏；Speaking 与 Writing Sample 用官方评分标准对照。'),
            ('Phase 4 · Final Tune-up (Week 13-16)', '回归高频词汇与题型模板；训练设备调试与环境检查流程；考前 1 周保持每日 30 分钟练习。'),
        ],
        'modules': [
            ('Read & Complete (Fill in blanks)', '阅读段落填空，考察语法与上下文推断。训练快速识别词性与语法关系。'),
            ('Listen & Type (Dictation)', '听句子写下来，考察听力与拼写。训练短时记忆与拼写准确度，注意标点。'),
            ('Read & Select (Real words)', '从单词列表中选择真实英语单词，考察词汇广度。重点积累学术高频词与同根词。'),
            ('C-Test (Incomplete text)', '阅读段落填空，每第二个词缺失一半字母。考察语法、词汇与上下文推断。'),
            ('Interactive Reading', '阅读理解互动题，含选词填空、句子匹配、段落主旨选择与文章标题。'),
            ('Speaking Sample (1-3 min)', '就指定话题说 1-3 分钟，考察流利度、词汇与发音。训练话题展开结构与连贯表达。'),
            ('Writing Sample (3-5 min)', '就指定话题写 3-5 分钟，考察语法、词汇与论证。训练快速构思与结构化输出。'),
        ],
        'score_strategy': [
            ('Free Score Reports', '考试后可免费发送给无限多所学校'),
            ('Score Validity', 'DET 成绩 2 年有效'),
            ('Speed Scoring', '48 小时内出分（加急 12 小时，加 $39）'),
            ('Adaptive Scoring', '考试自适应调整题目难度，前几题决定整体难度，不要在前段过度耗时'),
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
            padding: 8px 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.9rem;
            line-height: 1.5;
        }}
        .topic-list li:last-child {{ border-bottom: none; }}
        .topic-list .topic-title {{ font-weight: 600; color: #333; }}
        .topic-list .topic-desc {{ color: #777; font-size: 0.82rem; margin-top: 2px; }}
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
        .phase-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 8px;
            margin-top: 8px;
        }}
        .phase-card {{
            background: #f8f9fa;
            border-radius: 6px;
            padding: 10px 12px;
            border-left: 3px solid #667eea;
        }}
        .phase-card .phase-name {{ color: #667eea; font-size: 0.85rem; font-weight: 600; }}
        .phase-card .phase-detail {{ color: #555; font-size: 0.82rem; margin-top: 4px; line-height: 1.5; }}
        .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 0.8rem; }}
    </style>
    <link rel="stylesheet" href="/css/collapse.css">
</head>
<body>
    <a href="index.html" class="back-link">&larr; Back to Standardized Tests</a>
    <a href="{overview_href}" class="back-link" style="margin-left:10px;">Overview &rarr;</a>

    <h1>{name}</h1>
    <p class="en-name">{cn_name}</p>
    <p class="code-line">{code_line}</p>

    <div class="section">
        <h2>Official Resources <span class="en">官方资源</span></h2>
        <p class="cn-hint">所有备考以官方资源为基准，第三方教材用于补充练习。</p>
        <ul class="topic-list">
            {official_html}
        </ul>
    </div>

    <div class="section">
        <h2>Recommended Textbooks <span class="en">推荐教材</span></h2>
        <table class="meta-table">
            {textbooks_html}
        </table>
    </div>

    <div class="section">
        <h2>Prep Timeline <span class="en">备考节奏</span></h2>
        <p class="cn-hint">建议 12-16 周完成一个完整备考周期，可按下面四阶段推进。</p>
        <div class="phase-grid">
            {timeline_html}
        </div>
    </div>

    <div class="section">
        <h2>Module Strategy <span class="en">分模块策略</span></h2>
        <ul class="topic-list">
            {modules_html}
        </ul>
    </div>

    <div class="section">
        <h2>Error Log Practice <span class="en">错题本规范</span></h2>
        <p class="cn-hint">错题本质量直接决定提分上限，建议每道错题至少记录以下四项。</p>
        <table class="meta-table">
            <tr><td class="label">Question (题目)</td><td class="value">抄录或截图，标注来源（如 Cambridge 18 Test 3 Q12）</td></tr>
            <tr><td class="label">Error Type (错误类型)</td><td class="value">知识盲区 / 审题失误 / 听力漏听 / 时间不足</td></tr>
            <tr><td class="label">Correct Approach (正确思路)</td><td class="value">用一句话写下"应该怎么想"</td></tr>
            <tr><td class="label">Takeaway (要点)</td><td class="value">下次遇到同类题先做什么动作（如先标关键词、先看图表）</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Test Day Checklist <span class="en">考试当日清单</span></h2>
        <ul class="topic-list">
            <li><div class="topic-title">Device / Materials</div><div class="topic-desc">机考：充满电的笔记本或考场电脑；纸笔考：2B 铅笔、橡皮、身份证件。</div></li>
            <li><div class="topic-title">ID</div><div class="topic-desc">护照或政府签发带照片证件，姓名与准考证一致。</div></li>
            <li><div class="topic-title">Admission Ticket</div><div class="topic-desc">打印纸质准考证，提前核对考点地址。</div></li>
            <li><div class="topic-title">Water &amp; Snack</div><div class="topic-desc">休息时补充能量，避免高糖导致犯困。</div></li>
            <li><div class="topic-title">Arrival</div><div class="topic-desc">提前 30 分钟到达考点，留出签到时间。</div></li>
        </ul>
    </div>

    <div class="section">
        <h2>Score Strategy <span class="en">送分策略</span></h2>
        <table class="meta-table">
            {score_html}
        </table>
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


def gen_one(t):
    official_html = '\n            '.join(
        f'<li>\n                <div class="topic-title">{title}</div>\n                <div class="topic-desc">{desc}</div>\n            </li>'
        for title, desc in t['official_resources']
    )
    textbooks_html = '\n            '.join(
        f'<tr><td class="label">{title}</td><td class="value">{desc}</td></tr>'
        for title, desc in t['textbooks']
    )
    timeline_html = '\n            '.join(
        f'<div class="phase-card">\n                <div class="phase-name">{name}</div>\n                <div class="phase-detail">{detail}</div>\n            </div>'
        for name, detail in t['timeline']
    )
    modules_html = '\n            '.join(
        f'<li>\n                <div class="topic-title">{name}</div>\n                <div class="topic-desc">{desc}</div>\n            </li>'
        for name, desc in t['modules']
    )
    score_html = '\n            '.join(
        f'<tr><td class="label">{title}</td><td class="value">{desc}</td></tr>'
        for title, desc in t['score_strategy']
    )
    html = TEMPLATE.format(
        official_html=official_html,
        textbooks_html=textbooks_html,
        timeline_html=timeline_html,
        modules_html=modules_html,
        score_html=score_html,
        **{k: v for k, v in t.items() if k not in (
            'official_resources', 'textbooks', 'timeline', 'modules', 'score_strategy'
        )}
    )
    out_path = os.path.join(OUT_DIR, t['slug'] + '.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  generated: {out_path}')


def main():
    print(f'Generating {len(TESTS)} test prep pages...')
    for t in TESTS:
        gen_one(t)
    print(f'Done. Total: {len(TESTS)} files in {OUT_DIR}')


if __name__ == '__main__':
    main()
