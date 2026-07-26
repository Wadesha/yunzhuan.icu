// Mobile Navigation Enhancements
// Bottom tab bar + hamburger menu dropdown

(function() {
    const TAB_ITEMS = [
        { icon: '🏠', label: 'Home', cn: '首页', path: 'index.html', match: ['index.html'] },
        { icon: '📚', label: 'Majors', cn: '专业', path: 'index.html#majors', match: ['majors', 'science', 'engineering', 'business', 'humanities', 'art', 'social', 'health', 'education'] },
        { icon: '🎓', label: 'Schools', cn: '学校', path: 'schools/index.html', match: ['schools/'] },
        { icon: '🔧', label: 'Tools', cn: '工具', path: 'tests/index.html', match: ['tests/', 'score-converter', 'gpa-calculator', 'application-checklist', 'cost-calculator', 'compare', 'matcher', 'timeline', 'quiz'] },
        { icon: '📖', label: 'Guides', cn: '指南', path: 'guides/index.html', match: ['guides/', 'faq', 'glossary', 'resources', 'salary', 'rankings', 'visa', 'predeparture', 'course-guide', 'campus-life', 'career-guide', 'transfer', 'gap-year', 'extracurricular'] },
    ];

    function getPathPrefix() {
        const depth = (location.pathname.match(/\//g) || []).length - 1;
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    }

    function isActive(item) {
        const path = location.pathname.toLowerCase();
        return item.match.some(m => path.includes(m.toLowerCase()));
    }

    function buildTabBar() {
        const prefix = getPathPrefix();
        const bar = document.createElement('div');
        bar.className = 'mobile-tab-bar';

        let inner = '<div class="mobile-tab-bar-inner">';
        TAB_ITEMS.forEach(item => {
            const active = isActive(item) ? ' active' : '';
            const href = item.path.startsWith('#') ? item.path : prefix + item.path;
            inner += `
                <a href="${href}" class="mobile-tab-item${active}">
                    <span class="mobile-tab-icon">${item.icon}</span>
                    <span class="mobile-tab-label">${item.label}</span>
                </a>
            `;
        });
        inner += '</div>';
        bar.innerHTML = inner;
        document.body.appendChild(bar);
    }

    function buildHamburger() {
        const navLinks = document.querySelector('.nav-links');
        const navbar = document.querySelector('.navbar');
        if (!navLinks || !navbar) return;

        const links = navLinks.querySelectorAll('a');
        if (links.length === 0) return;

        const menuHtml = Array.from(links).map(a => a.outerHTML).join('');

        const dropdown = document.createElement('div');
        dropdown.className = 'mobile-nav-dropdown';
        dropdown.innerHTML = menuHtml;

        const btn = document.createElement('button');
        btn.className = 'hamburger-btn';
        btn.innerHTML = '☰';
        btn.setAttribute('aria-label', 'Menu');
        btn.style.marginRight = '4px';

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdown.classList.toggle('open');
        });

        document.addEventListener('click', function() {
            dropdown.classList.remove('open');
        });

        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });

        navLinks.insertBefore(btn, navLinks.firstChild);
        navbar.appendChild(dropdown);
    }

    document.addEventListener('DOMContentLoaded', function() {
        if (window.innerWidth <= 768) {
            buildTabBar();
            buildHamburger();
        }
    });

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const existingBar = document.querySelector('.mobile-tab-bar');
            const existingBtn = document.querySelector('.hamburger-btn');
            const existingDropdown = document.querySelector('.mobile-nav-dropdown');

            if (window.innerWidth <= 768) {
                if (!existingBar) buildTabBar();
                if (!existingBtn) buildHamburger();
            } else {
                if (existingBar) existingBar.remove();
                if (existingBtn) existingBtn.remove();
                if (existingDropdown) existingDropdown.remove();
            }
        }, 200);
    });
})();
