#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量生成月度任务清单页 (基于 timeline/grade-11-monthly.html 模板)
生成: grade-9-10-monthly.html, grade-12-monthly.html
"""
import os

OUT_DIR = '/workspace/timeline'

GRADES = [
    {
        'slug': 'grade-9-10-monthly',
        'title': 'Grade 9-10 Monthly Tasks',
        'subtitle': '9-10 年级月度任务清单 · Exploration phase',
        'intro_en': 'This page breaks Grade 9-10 (the exploration phase) into month-by-month tasks. Each month lists 3-5 concrete actions tagged by category (academics, standardized tests, activities, school research, recommendations). Tasks focus on building foundations rather than application pressure.',
        'intro_cn': '把 9-10 年级拆成 12 个月的清单，每月 3-5 条具体任务，重点是探索兴趣与打好基础。',
        'overview_href': 'grade-9-10.html',
        'months': [
            ('September', '9 月 · 学年开局', 'Focus: Course selection & activity start', [
                ('Academic', 'Confirm course selection for the year; balance rigor with GPA — a B in honors is not always better than an A in regular.'),
                ('Activity', 'Join 1-2 clubs that genuinely interest you; do not stack activities for resume building yet.'),
                ('Academic', 'Set up a study system: planner, note-taking method, weekly review habit. Good habits now pay off in Grade 11.'),
                ('Test', 'Take the PSAT 8/9 (Grade 9) or PSAT 10 (Grade 10) in October if offered at your school.'),
            ]),
            ('October', '10 月 · PSAT 与活动深入', 'Focus: PSAT & activity deepening', [
                ('Test', 'Take PSAT 8/9 or PSAT 10 as practice for the SAT format; do not prep intensively, just familiarize yourself.'),
                ('Activity', 'In Grade 10, identify one activity to commit to long-term; volunteer for a small project or role.'),
                ('Academic', 'Maintain grades; meet with teachers during office hours if needed. Build relationships early.'),
                ('School', 'Attend 1-2 college rep visits at your school (Grade 10); take informal notes on what appeals to you.'),
            ]),
            ('November', '11 月 · 期中与探索', 'Focus: Midterms & exploration', [
                ('Academic', 'Midterm grades matter for cumulative GPA; protect your GPA above all else in Grade 9-10.'),
                ('Activity', 'Document fall activities with hours and outcomes; start an "activity log" you will use later.'),
                ('School', 'Begin browsing college websites informally; look at majors, campus life, and admission requirements.'),
                ('Test', 'If English is not your first language, consider an initial TOEFL/IELTS diagnostic in Grade 10.'),
            ]),
            ('December', '12 月 · 寒假与基础建设', 'Focus: Winter break & foundational skills', [
                ('Academic', 'Use winter break to read 1-2 books for pleasure; reading speed and vocabulary compound over years.'),
                ('Test', 'Grade 10: take a free SAT or ACT diagnostic test to identify baseline; no need to prep yet.'),
                ('Activity', 'Plan a winter break service or personal project — small is fine, just make it real.'),
                ('School', 'Start a "school research" document; add colleges you encounter with one-line notes on what appeals.'),
            ]),
            ('January', '1 月 · 新学期与目标设定', 'Focus: Spring semester goals', [
                ('Academic', 'Set semester goals: target GPA, subjects to strengthen, study habits to build.'),
                ('Activity', 'Take on a small leadership role in one club; quality of involvement matters more than title.'),
                ('Test', 'Grade 10: if first diagnostic was low, begin light SAT/ACT prep (1-2 hours per week, no pressure).'),
                ('Academic', 'Start a reading list of books outside class; aim for 8-10 books across the year.'),
            ]),
            ('February', '2 月 · 兴趣深化', 'Focus: Interest deepening', [
                ('Activity', 'Identify a subject or topic you genuinely want to learn more about; find a book, online course, or club related to it.'),
                ('Academic', 'If eligible, register for AP or honors courses for next year; balance rigor with realistic workload.'),
                ('School', 'Grade 10: attend 1-2 virtual college info sessions; take notes on what you like and dislike.'),
                ('Activity', 'Document leadership activities with measurable outcomes for the activity log.'),
            ]),
            ('March', '3 月 · 春季活动与首次 SAT', 'Focus: Spring activities & first SAT (Grade 10)', [
                ('Test', 'Grade 10: consider taking the March SAT as a baseline (School Day SAT if offered); treat it as diagnostic only.'),
                ('Activity', 'Spring is competition season: AMC, science fairs, debate tournaments. Pick 1-2 to participate in.'),
                ('Academic', 'Spring semester grades; maintain an upward trend if fall was rocky.'),
                ('School', 'Visit 1-2 local college campuses; informal visits help calibrate what "fit" means to you.'),
            ]),
            ('April', '4 月 · 选课与夏季规划', 'Focus: Course planning & summer plans', [
                ('Academic', 'Finalize next year\'s course selection with counselor; aim for appropriate rigor (1-2 APs for Grade 10, 3-5 for Grade 11).'),
                ('Activity', 'Lock in summer plans: camp, internship, research, community service, or personal project. Apply early.'),
                ('Test', 'Grade 10: take April ACT if you prefer ACT format over SAT.'),
                ('School', 'Begin a more structured school research spreadsheet: name, location, mid-50% scores, popular majors.'),
            ]),
            ('May', '5 月 · AP/期末考试', 'Focus: AP exams & finals', [
                ('Academic', 'Take AP exams if enrolled in AP courses; scores are reported to colleges later.'),
                ('Academic', 'Prepare for final exams; year-end grades are the most visible to colleges.'),
                ('Test', 'Grade 10: if taking May SAT or SAT Subject Tests, prepare lightly (do not sacrifice finals for SAT prep).'),
                ('Activity', 'Wrap up spring activities with measurable outcomes; update the activity log.'),
            ]),
            ('June', '6 月 · 学年收尾', 'Focus: Year-end & summer launch', [
                ('Academic', 'Year-end transcript — these are the grades that build your GPA trajectory.'),
                ('Activity', 'Begin summer project: research, internship, language immersion, or community initiative.'),
                ('Test', 'Grade 10: optional June SAT or ACT; comfortable first official sitting before Grade 11 pressure.'),
                ('School', 'Visit 2-3 college campuses during summer travel; informal notes only, no pressure.'),
            ]),
            ('July', '7 月 · 暑期项目', 'Focus: Summer project depth', [
                ('Activity', 'Deepen summer project: aim for a tangible output (paper, code repo, portfolio piece, presentation).'),
                ('Academic', 'Read 2-3 books for pleasure; explore subjects outside your comfort zone.'),
                ('Test', 'Light test prep only: 2-3 hours per week of vocabulary or math practice; no full mock tests yet.'),
                ('School', 'Update school research spreadsheet with summer insights; begin categorizing schools by interest level.'),
            ]),
            ('August', '8 月 · 暑假收尾与新学年准备', 'Focus: Summer wrap-up & fall prep', [
                ('Activity', 'Finalize summer project deliverable; document outcomes for the activity log.'),
                ('Academic', 'Review prerequisite material for next year\'s courses; ensure foundation is solid.'),
                ('Test', 'Grade 10 → 11 transition: take a full SAT or ACT diagnostic to set baseline before Grade 11 prep begins.'),
                ('School', 'Finalize a list of 10-15 colleges of interest; categorize loosely as reach/match/safety (will refine in Grade 11).'),
            ]),
        ],
    },
    {
        'slug': 'grade-12-monthly',
        'title': 'Grade 12 Monthly Tasks',
        'subtitle': '12 年级月度任务清单 · Application phase',
        'intro_en': 'This page breaks Grade 12 (the application phase) into month-by-month tasks. Each month lists 3-6 concrete actions tagged by category (academics, standardized tests, essays, school list, activities, recommendations). Tasks focus on submission, decisions and enrollment.',
        'intro_cn': '把 12 年级拆成 12 个月的清单，每月 3-6 条具体任务，重点是递交申请、面试、录取与就读决策。',
        'overview_href': 'grade-12.html',
        'months': [
            ('September', '9 月 · 申请启动', 'Focus: Application launch', [
                ('School', 'Common App opens; fill out biographical info, activity list, and add schools to your list.'),
                ('Rec Letter', 'Confirm recommenders have submitted or are on track; send gentle reminders 2 weeks before ED/EA deadline.'),
                ('Test', 'Take September ACT or October SAT if retaking; this is the last sitting for ED/EA timelines.'),
                ('Essay', 'Finalize Common App main essay; complete supplemental essays for top 3-5 ED/EA schools.'),
                ('Academic', 'Senior year grades matter — do not slack. Mid-year reports go to colleges in January.'),
            ]),
            ('October', '10 月 · ED/EA 提交', 'Focus: ED/EA submission', [
                ('School', 'Submit ED/EA applications by November 1; verify all materials arrived (transcripts, recs, scores).'),
                ('Test', 'Take October SAT if needed; send official scores to ED/EA schools (allow 2-3 weeks for delivery).'),
                ('Essay', 'Begin drafting RD supplemental essays; aim for 1-2 schools per week through December.'),
                ('School', 'Finalize RD school list to 8-12 across reach/match/safety; verify each school\'s deadline and requirements.'),
                ('Activity', 'Update activity list with senior year roles; document any new leadership or projects.'),
            ]),
            ('November', '11 月 · ED/EA 截止与 RD 推进', 'Focus: ED/EA deadline & RD progress', [
                ('School', 'ED/EA applications due November 1 (some schools November 15). Submit at least 2 days early to avoid crashes.'),
                ('Test', 'Take November SAT or ACT if still retaking; this is the last comfortable sitting for RD timelines.'),
                ('Essay', 'Complete RD supplemental essays for top 5 schools; aim for 1-2 per week.'),
                ('Rec Letter', 'Send thank-you notes to recommenders; confirm counselor submitted school report.'),
                ('Financial', 'Begin CSS Profile draft for early-deadline schools (some ED/EA schools need it by November 15).'),
            ]),
            ('December', '12 月 · ED/EA 出结果与 RD 收尾', 'Focus: ED/EA decisions & RD finalization', [
                ('School', 'Receive ED/EA decisions mid-December; if admitted ED, withdraw other applications immediately.'),
                ('Test', 'Take December SAT or ACT if still retaking; this is typically the last sitting for RD timelines.'),
                ('Essay', 'Complete all RD supplemental essays; aim for "final draft pending review" by end of December.'),
                ('Financial', 'Submit CSS Profile for early-deadline schools; FAFSA opens December 1 (US citizens/permanent residents).'),
                ('Activity', 'Wrap up fall leadership deliverables; document outcomes for mid-year report updates.'),
            ]),
            ('January', '1 月 · RD 截止', 'Focus: RD submission', [
                ('School', 'Submit RD applications by January 1-15 (varies by school); verify all materials arrived.'),
                ('Academic', 'Mid-year reports go to colleges in January; maintain grades and submit updated transcripts.'),
                ('Test', 'Send final official SAT/ACT/TOEFL scores to all RD schools if not already sent.'),
                ('Financial', 'Submit FAFSA for federal aid (US citizens); complete CSS Profile for RD schools requiring it.'),
                ('Essay', 'Update essays if your profile changed significantly since submission (rare; only if asked).'),
            ]),
            ('February', '2 月 · 等待与面试', 'Focus: Interviews & mid-year updates', [
                ('School', 'Attend alumni interviews if invited; prepare thoughtful questions about the school.'),
                ('School', 'Send "letter of continued interest" to waitlist/deferred schools; include any new achievements.'),
                ('Academic', 'Maintain grades; some schools request third-quarter reports before deciding.'),
                ('Activity', 'Continue activities at full intensity; do not check out before decisions arrive.'),
                ('Financial', 'Complete any remaining financial aid forms; respond to verification requests promptly.'),
            ]),
            ('March', '3 月 · RD 出结果', 'Focus: RD decisions', [
                ('School', 'RD decisions released late March to early April; track all decisions in a spreadsheet.'),
                ('School', 'Compare admitted schools: financial aid packages, academic fit, campus culture, location.'),
                ('School', 'Attend admitted student events (Admitted Students Day, virtual sessions); ask current students tough questions.'),
                ('Financial', 'Compare financial aid packages; appeal if packages are significantly different across peer schools.'),
                ('Test', 'Take AP exams registration if applicable; AP scores can earn college credit at admitted schools.'),
            ]),
            ('April', '4 月 · 录取决策与就读确认', 'Focus: Final choice & enrollment', [
                ('School', 'Visit 2-3 top admitted schools if possible; informal visits help with final decision.'),
                ('School', 'Submit enrollment deposit by May 1 (National Decision Day); notify other schools of your decision.'),
                ('School', 'If waitlisted at top-choice school, send updated letter of continued interest with new achievements.'),
                ('Financial', 'Accept financial aid package at enrolled school; complete any remaining paperwork.'),
                ('Test', 'Take AP/IB exams in May; scores will be sent to enrolled school for credit consideration.'),
            ]),
            ('May', '5 月 · AP/IB 考试与过渡', 'Focus: Subject exams & transition', [
                ('Academic', 'Take AP / IB / A-Level exams in May; scores are reported to enrolled school for credit.'),
                ('School', 'Submit final transcript request to counselor; ensure grades do not drop significantly (offers can be rescinded).'),
                ('School', 'Complete enrollment paperwork: housing, meal plan, course registration, orientation signup.'),
                ('Activity', 'Wind down high school activities gracefully; train successors if in leadership roles.'),
                ('Test', 'Take May SAT or ACT only if enrolled school requires it for placement (rare).'),
            ]),
            ('June', '6 月 · 高中毕业', 'Focus: Graduation & handover', [
                ('Academic', 'Final transcripts sent to enrolled college; verify receipt and resolve any discrepancies.'),
                ('School', 'Attend graduation; thank teachers and counselors who supported your application.'),
                ('Activity', 'Close out high school activities; document final outcomes for personal records.'),
                ('School', 'Begin college transition: review summer reading lists, math placement exams, language placement tests.'),
                ('Financial', 'Set up college billing account; understand payment deadlines and refund policies.'),
            ]),
            ('July', '7 月 · 大学准备', 'Focus: College preparation', [
                ('School', 'Complete summer assignments: reading lists, math packets, language placement prep.'),
                ('School', 'Register for orientation; sign up for first-semester courses with advisor input.'),
                ('School', 'Set up college email and student portal; monitor for housing and registration deadlines.'),
                ('Financial', 'Finalize financial aid disbursement; confirm payment plan or loan arrangements.'),
                ('Activity', 'Begin packing and logistics for move-in day; coordinate with roommate if assigned.'),
            ]),
            ('August', '8 月 · 入学过渡', 'Focus: Move-in & first semester', [
                ('School', 'Move into dorm; attend orientation week activities; meet roommate and floor mates.'),
                ('School', 'Finalize course registration with academic advisor; understand add/drop deadlines.'),
                ('Academic', 'Attend first week of classes; assess workload and adjust schedule if needed within add/drop period.'),
                ('Financial', 'Verify tuition payment is complete; understand work-study assignments if applicable.'),
                ('Activity', 'Explore student clubs and organizations; sign up for 2-3 to try in first month.'),
            ]),
        ],
    },
]

TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - Application Timeline - yunzhuan.icu</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 900px;
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
            font-size: 1.5rem;
        }}
        .subtitle {{
            color: #888;
            font-size: 0.95rem;
            margin-bottom: 18px;
        }}
        .intro {{
            background: white;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            font-size: 0.92rem;
            line-height: 1.7;
            color: #444;
        }}
        .month-card {{
            background: white;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border-left: 4px solid #667eea;
        }}
        .month-header {{
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            margin-bottom: 10px;
            flex-wrap: wrap;
            gap: 6px;
        }}
        .month-name {{
            color: #667eea;
            font-size: 1rem;
            font-weight: 600;
        }}
        .month-name .en {{
            color: #999;
            font-size: 0.8rem;
            font-weight: normal;
            margin-left: 6px;
        }}
        .month-focus {{
            color: #888;
            font-size: 0.82rem;
            font-style: italic;
        }}
        .task-list {{ list-style: none; }}
        .task-list li {{
            padding: 6px 10px;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.88rem;
            line-height: 1.6;
            color: #444;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }}
        .task-list li:last-child {{ border-bottom: none; }}
        .task-list li:before {{
            content: "[ ]";
            color: #aaa;
            font-family: monospace;
            flex-shrink: 0;
        }}
        .task-tag {{
            display: inline-block;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 0.7rem;
            font-weight: 600;
            margin-right: 6px;
            flex-shrink: 0;
        }}
        .tag-academic {{ background: #e8f4fd; color: #1976d2; }}
        .tag-test {{ background: #fce4ec; color: #c2185b; }}
        .tag-essay {{ background: #f3e5f5; color: #7b1fa2; }}
        .tag-school {{ background: #e8f5e9; color: #2e7d32; }}
        .tag-activity {{ background: #fff3e0; color: #ef6c00; }}
        .tag-rec {{ background: #fce4ec; color: #c2185b; }}
        .tag-financial {{ background: #fff8e1; color: #f57c00; }}
        .task-link {{
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px dotted #667eea;
        }}
        .task-link:hover {{ text-decoration: underline; }}
        .footer {{ text-align: center; margin-top: 20px; color: #999; font-size: 0.8rem; }}
        .legend {{
            background: white;
            border-radius: 8px;
            padding: 10px 18px;
            margin-bottom: 14px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            font-size: 0.82rem;
            color: #555;
        }}
        .legend b {{ color: #333; }}
    </style>
    <link rel="stylesheet" href="/css/collapse.css">
</head>
<body>
    <a href="index.html" class="back-link">&larr; Back to Application Timeline</a>
    <a href="{overview_href}" class="back-link" style="margin-left:10px;">Overview &rarr;</a>

    <h1>{title}</h1>
    <p class="subtitle">{subtitle}</p>

    <div class="intro">
        {intro_en}
        <br><span style="color:#888;">{intro_cn}</span>
    </div>

    <div class="legend">
        <b>Tags:</b>
        <span class="task-tag tag-academic">Academic</span>
        <span class="task-tag tag-test">Test</span>
        <span class="task-tag tag-essay">Essay</span>
        <span class="task-tag tag-school">School</span>
        <span class="task-tag tag-activity">Activity</span>
        <span class="task-tag tag-rec">Rec Letter</span>
        <span class="task-tag tag-financial">Financial</span>
    </div>

    {months_html}

    <p class="footer">&copy; 2026 yunzhuan.icu | {title}</p>
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

TAG_CLASS = {
    'Academic': 'tag-academic',
    'Test': 'tag-test',
    'Essay': 'tag-essay',
    'School': 'tag-school',
    'Activity': 'tag-activity',
    'Rec Letter': 'tag-rec',
    'Rec': 'tag-rec',
    'Financial': 'tag-financial',
}


def render_month(month_name, month_cn, focus, tasks):
    items_html = '\n            '.join(
        f'<li><span class="task-tag {TAG_CLASS[tag]}">{tag}</span>{text}</li>'
        for tag, text in tasks
    )
    return (
        f'    <div class="month-card">\n'
        f'        <div class="month-header">\n'
        f'            <div class="month-name">{month_name} <span class="en">{month_cn}</span></div>\n'
        f'            <div class="month-focus">{focus}</div>\n'
        f'        </div>\n'
        f'        <ul class="task-list">\n'
        f'            {items_html}\n'
        f'        </ul>\n'
        f'    </div>'
    )


def gen_one(g):
    months_html = '\n\n'.join(render_month(*m) for m in g['months'])
    html = TEMPLATE.format(
        months_html=months_html,
        **{k: v for k, v in g.items() if k != 'months'}
    )
    out_path = os.path.join(OUT_DIR, g['slug'] + '.html')
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  generated: {out_path}')


def main():
    print(f'Generating {len(GRADES)} monthly task list pages...')
    for g in GRADES:
        gen_one(g)
    print(f'Done. Total: {len(GRADES)} files in {OUT_DIR}')


if __name__ == '__main__':
    main()
