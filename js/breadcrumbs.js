// Breadcrumb Navigation & Related Pages
// Auto-generates breadcrumbs based on URL path

(function() {
    const PATH_LABELS = {
        'index.html': { en: 'Home', cn: '首页' },
        'majors': { en: 'Majors', cn: '专业' },
        'science': { en: 'Science', cn: '理科' },
        'engineering': { en: 'Engineering', cn: '工科' },
        'business': { en: 'Business', cn: '商科' },
        'humanities': { en: 'Humanities', cn: '人文' },
        'art': { en: 'Art & Design', cn: '艺术' },
        'social': { en: 'Social Sciences', cn: '社科' },
        'health': { en: 'Health', cn: '健康' },
        'education': { en: 'Education', cn: '教育' },
        'schools': { en: 'Schools', cn: '学校' },
        'us': { en: 'US', cn: '美国' },
        'uk': { en: 'UK', cn: '英国' },
        'ca': { en: 'Canada', cn: '加拿大' },
        'au': { en: 'Australia', cn: '澳洲' },
        'hk': { en: 'Hong Kong', cn: '香港' },
        'sg': { en: 'Singapore', cn: '新加坡' },
        'tests': { en: 'Tests & Tools', cn: '考试工具' },
        'essays': { en: 'Essays', cn: '文书' },
        'scholarships': { en: 'Scholarships', cn: '奖学金' },
        'interviews': { en: 'Interviews', cn: '面试' },
        'guides': { en: 'Guides', cn: '指南' },
        'prerequisite': { en: 'Prerequisites', cn: '先修课' },
    };

    const RELATED_MAP = {
        'salary.html': [
            { url: 'computer/cs.html', title: 'Computer Science', desc: 'CS 专业详解' },
            { url: 'schools/compare.html', title: 'School Compare', desc: '选校对比' },
            { url: 'career-guide.html', title: 'Career Guide', desc: '职业发展' },
            { url: 'rankings.html', title: 'Rankings', desc: '专业排名' },
        ],
        'rankings.html': [
            { url: 'salary.html', title: 'Salary & Outlook', desc: '薪资就业' },
            { url: 'schools/compare.html', title: 'School Compare', desc: '选校对比' },
            { url: 'major-guide.html', title: 'Major Guide', desc: '选专业指南' },
        ],
        'faq.html': [
            { url: 'guides/index.html', title: 'All Guides', desc: '全部指南' },
            { url: 'glossary.html', title: 'Glossary', desc: '术语表' },
            { url: 'contact.html', title: 'Contact', desc: '联系我们' },
        ],
        'glossary.html': [
            { url: 'faq.html', title: 'FAQ', desc: '常见问题' },
            { url: 'application-systems.html', title: 'App Systems', desc: '申请系统' },
        ],
        'cost-calculator.html': [
            { url: 'scholarships/index.html', title: 'Scholarships', desc: '奖学金' },
            { url: 'schools/compare.html', title: 'School Compare', desc: '选校对比' },
            { url: 'cost-calculator.html', title: 'Cost Calculator', desc: '费用计算' },
        ],
        'application-timeline.html': [
            { url: 'tests/application-checklist.html', title: 'Checklist', desc: '申请清单' },
            { url: 'application-systems.html', title: 'App Systems', desc: '申请系统' },
            { url: 'essays/index.html', title: 'Essays', desc: '文书资源' },
        ],
        'major-guide.html': [
            { url: 'major-quiz.html', title: 'Major Quiz', desc: '专业测评' },
            { url: 'salary.html', title: 'Salary', desc: '薪资前景' },
            { url: 'rankings.html', title: 'Rankings', desc: '专业排名' },
        ],
        'major-quiz.html': [
            { url: 'major-guide.html', title: 'Major Guide', desc: '选专业指南' },
            { url: 'index.html', title: 'All Majors', desc: '全部专业' },
        ],
        'gpa-calculator.html': [
            { url: 'tests/score-converter.html', title: 'Score Converter', desc: '分数换算' },
            { url: 'schools/matcher.html', title: 'School Matcher', desc: '选校推荐' },
        ],
        'score-converter.html': [
            { url: 'tests/gpa-calculator.html', title: 'GPA Calculator', desc: 'GPA 计算' },
            { url: 'schools/matcher.html', title: 'School Matcher', desc: '选校推荐' },
            { url: 'tests/vocab-test.html', title: 'Vocab Test', desc: '词汇测试' },
        ],
    };

    function getPrefix(depth) {
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    }

    function getLabel(segment) {
        if (PATH_LABELS[segment]) return PATH_LABELS[segment];
        const clean = segment.replace('.html', '').replace(/-/g, ' ');
        return {
            en: clean.replace(/\b\w/g, c => c.toUpperCase()),
            cn: ''
        };
    }

    function getPageTitle() {
        const title = document.querySelector('h1');
        if (title) {
            let text = title.textContent.trim();
            text = text.replace(/\s+/g, ' ');
            return { en: text, cn: '' };
        }
        const t = document.title;
        return { en: t.replace(/\s*[-|].*$/, ''), cn: '' };
    }

    function buildBreadcrumbs() {
        const path = location.pathname.replace(/^\/+/, '');
        if (!path || path === 'index.html' || path === '') return;

        const parts = path.split('/').filter(Boolean);
        const depth = parts.length - 1;
        const prefix = getPrefix(depth);

        let crumbs = [];
        crumbs.push({ label: { en: 'Home', cn: '首页' }, href: prefix + 'index.html' });

        let currentPath = '';
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            currentPath += (i > 0 ? '/' : '') + part;
            const isLast = i === parts.length - 1;
            const label = isLast ? getPageTitle() : getLabel(part);

            if (isLast) {
                crumbs.push({ label: label, href: null });
            } else {
                const subDepth = depth - i - 1;
                const subPrefix = getPrefix(subDepth);
                crumbs.push({
                    label: label,
                    href: subPrefix + part + '/index.html'
                });
            }
        }

        const html = '<nav class="breadcrumbs">' + crumbs.map((c, i) => {
            const labelText = c.label.cn
                ? `<span>${c.label.en}</span> <span style="color:var(--text-faint);font-size:0.7rem">${c.label.cn}</span>`
                : c.label.en;
            if (c.href) {
                return `<a href="${c.href}">${labelText}</a>${i < crumbs.length - 1 ? '<span class="separator">›</span>' : ''}`;
            }
            return `<span class="current">${labelText}</span>`;
        }).join('') + '</nav>';

        const target = document.querySelector('h1');
        if (target) {
            target.insertAdjacentHTML('beforebegin', html);
        }
    }

    function buildRelated() {
        const path = location.pathname.split('/').pop() || 'index.html';
        const related = RELATED_MAP[path];
        if (!related || related.length === 0) return;

        const depth = (location.pathname.match(/\//g) || []).length - 1;
        const prefix = depth > 0 ? '../'.repeat(depth) : './';

        const html = `
            <div class="related-section">
                <h3>Related Pages <span class="cn">相关页面</span></h3>
                <div class="related-grid">
                    ${related.map(r => `
                        <a href="${prefix}${r.url}" class="related-card">
                            <div class="related-card-title">${r.title}</div>
                            <div class="related-card-desc">${r.desc}</div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;

        const footer = document.querySelector('.footer');
        if (footer) {
            footer.insertAdjacentHTML('beforebegin', html);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        buildBreadcrumbs();
        buildRelated();
    });
})();
