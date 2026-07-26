// Favorites & Recommendations
// Auto-adds favorite button and school/major recommendations

(function() {
    const MAJOR_TO_SCHOOLS = {
        'computer-science': [
            { id: 'us-mit', name: 'MIT', tier: 'Reach', path: 'schools/us/mit.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-cmu', name: 'Carnegie Mellon', tier: 'Reach', path: 'schools/us/cmu.html' },
            { id: 'us-uiuc', name: 'UIUC', tier: 'Match', path: 'schools/us/uiuc.html' },
            { id: 'us-georgia-tech', name: 'Georgia Tech', tier: 'Match', path: 'schools/us/georgia-tech.html' },
        ],
        'cs': [
            { id: 'us-mit', name: 'MIT', tier: 'Reach', path: 'schools/us/mit.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-cmu', name: 'Carnegie Mellon', tier: 'Reach', path: 'schools/us/cmu.html' },
        ],
        'computer-engineering': [
            { id: 'us-mit', name: 'MIT', tier: 'Reach', path: 'schools/us/mit.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-uiuc', name: 'UIUC', tier: 'Match', path: 'schools/us/uiuc.html' },
            { id: 'us-georgia-tech', name: 'Georgia Tech', tier: 'Match', path: 'schools/us/georgia-tech.html' },
            { id: 'ca-waterloo', name: 'Waterloo', tier: 'Match', path: 'schools/ca/waterloo.html' },
        ],
        'mechanical-engineering': [
            { id: 'us-mit', name: 'MIT', tier: 'Reach', path: 'schools/us/mit.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-umich', name: 'U Michigan', tier: 'Match', path: 'schools/us/umich.html' },
            { id: 'us-georgia-tech', name: 'Georgia Tech', tier: 'Match', path: 'schools/us/georgia-tech.html' },
        ],
        'electrical-engineering': [
            { id: 'us-mit', name: 'MIT', tier: 'Reach', path: 'schools/us/mit.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-uiuc', name: 'UIUC', tier: 'Match', path: 'schools/us/uiuc.html' },
            { id: 'us-georgia-tech', name: 'Georgia Tech', tier: 'Match', path: 'schools/us/georgia-tech.html' },
        ],
        'data-science': [
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-cmu', name: 'Carnegie Mellon', tier: 'Reach', path: 'schools/us/cmu.html' },
            { id: 'us-ucla', name: 'UCLA', tier: 'Match', path: 'schools/us/ucla.html' },
            { id: 'us-washington', name: 'U Washington', tier: 'Match', path: 'schools/us/washington.html' },
        ],
        'economics': [
            { id: 'us-harvard', name: 'Harvard', tier: 'Reach', path: 'schools/us/harvard.html' },
            { id: 'us-mit', name: 'MIT', tier: 'Reach', path: 'schools/us/mit.html' },
            { id: 'us-chicago', name: 'U Chicago', tier: 'Reach', path: 'schools/us/chicago.html' },
            { id: 'us-duke', name: 'Duke', tier: 'Reach', path: 'schools/us/duke.html' },
            { id: 'uk-lse', name: 'LSE', tier: 'Reach', path: 'schools/uk/lse.html' },
        ],
        'finance': [
            { id: 'us-penn', name: 'UPenn (Wharton)', tier: 'Reach', path: 'schools/us/penn.html' },
            { id: 'us-chicago', name: 'U Chicago', tier: 'Reach', path: 'schools/us/chicago.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'uk-lse', name: 'LSE', tier: 'Reach', path: 'schools/uk/lse.html' },
            { id: 'us-nyu', name: 'NYU Stern', tier: 'Match', path: 'schools/us/nyu.html' },
        ],
        'business-administration': [
            { id: 'us-penn', name: 'UPenn (Wharton)', tier: 'Reach', path: 'schools/us/penn.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-chicago', name: 'U Chicago', tier: 'Reach', path: 'schools/us/chicago.html' },
            { id: 'us-northwestern', name: 'Northwestern', tier: 'Match', path: 'schools/us/northwestern.html' },
            { id: 'us-umich', name: 'U Michigan', tier: 'Match', path: 'schools/us/umich.html' },
        ],
        'psychology': [
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-ucla', name: 'UCLA', tier: 'Match', path: 'schools/us/ucla.html' },
            { id: 'us-umich', name: 'U Michigan', tier: 'Match', path: 'schools/us/umich.html' },
            { id: 'uk-oxford', name: 'Oxford', tier: 'Reach', path: 'schools/uk/oxford.html' },
        ],
        'biology': [
            { id: 'us-harvard', name: 'Harvard', tier: 'Reach', path: 'schools/us/harvard.html' },
            { id: 'us-stanford', name: 'Stanford', tier: 'Reach', path: 'schools/us/stanford.html' },
            { id: 'us-johns-hopkins', name: 'Johns Hopkins', tier: 'Reach', path: 'schools/us/johns-hopkins.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-ucla', name: 'UCLA', tier: 'Match', path: 'schools/us/ucla.html' },
        ],
        'architecture': [
            { id: 'us-cornell', name: 'Cornell', tier: 'Reach', path: 'schools/us/cornell.html' },
            { id: 'us-berkeley', name: 'UC Berkeley', tier: 'Reach', path: 'schools/us/berkeley.html' },
            { id: 'us-ucla', name: 'UCLA', tier: 'Match', path: 'schools/us/ucla.html' },
            { id: 'uk-cambridge', name: 'Cambridge', tier: 'Reach', path: 'schools/uk/cambridge.html' },
            { id: 'au-melbourne', name: 'U Melbourne', tier: 'Match', path: 'schools/au/melbourne.html' },
        ],
        'nursing': [
            { id: 'us-johns-hopkins', name: 'Johns Hopkins', tier: 'Reach', path: 'schools/us/johns-hopkins.html' },
            { id: 'us-duke', name: 'Duke', tier: 'Reach', path: 'schools/us/duke.html' },
            { id: 'us-ucla', name: 'UCLA', tier: 'Match', path: 'schools/us/ucla.html' },
            { id: 'us-washington', name: 'U Washington', tier: 'Match', path: 'schools/us/washington.html' },
        ],
    };

    function getPrefix() {
        const depth = (location.pathname.match(/\//g) || []).length - 1;
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    }

    function getCurrentPageInfo() {
        const path = location.pathname;
        const h1 = document.querySelector('h1');
        const title = h1 ? h1.textContent.trim().split('\n')[0] : document.title;

        if (path.includes('/schools/') && path.endsWith('.html')) {
            const parts = path.split('/');
            const id = parts[parts.length - 1].replace('.html', '');
            const region = parts[parts.length - 2];
            return {
                type: 'school',
                id: region + '-' + id,
                title: title,
                url: path
            };
        }

        if ((path.includes('/majors/') || path.includes('/science/') || path.includes('/engineering/') ||
             path.includes('/business/') || path.includes('/humanities/') || path.includes('/art/') ||
             path.includes('/social/') || path.includes('/health/') || path.includes('/education/'))
             && path.endsWith('.html')) {
            const parts = path.split('/');
            const id = parts[parts.length - 1].replace('.html', '');
            return {
                type: 'major',
                id: id,
                title: title,
                url: path
            };
        }

        return null;
    }

    function buildFavButton(pageInfo) {
        const btn = document.createElement('button');
        btn.className = 'fav-btn';
        btn.innerHTML = '<span class="star">☆</span> <span class="fav-text">Favorite</span>';

        async function updateState() {
            if (!window.DB || !window.Auth?.isLoggedIn?.()) return;
            try {
                const isFav = await window.DB.isFavorite(pageInfo.type, pageInfo.id);
                if (isFav) {
                    btn.classList.add('active');
                    btn.querySelector('.star').textContent = '⭐';
                    btn.querySelector('.fav-text').textContent = 'Saved';
                } else {
                    btn.classList.remove('active');
                    btn.querySelector('.star').textContent = '☆';
                    btn.querySelector('.fav-text').textContent = 'Favorite';
                }
            } catch (e) {
                console.warn('Fav state check failed:', e);
            }
        }

        btn.addEventListener('click', async function() {
            if (!window.Auth || !window.Auth.isLoggedIn()) {
                window.location.href = getPrefix() + 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
                return;
            }
            btn.disabled = true;
            try {
                if (btn.classList.contains('active')) {
                    await window.DB.removeFavorite(pageInfo.type, pageInfo.id);
                    btn.classList.remove('active');
                    btn.querySelector('.star').textContent = '☆';
                    btn.querySelector('.fav-text').textContent = 'Favorite';
                } else {
                    await window.DB.addFavorite({
                        type: pageInfo.type,
                        id: pageInfo.id,
                        title: pageInfo.title,
                        url: pageInfo.url
                    });
                    btn.classList.add('active');
                    btn.querySelector('.star').textContent = '⭐';
                    btn.querySelector('.fav-text').textContent = 'Saved';
                }
            } catch (e) {
                console.error('Fav toggle failed:', e);
            }
            btn.disabled = false;
        });

        if (window.Auth && typeof window.Auth.ready === 'function') {
            window.Auth.ready(function(user) {
                if (user) updateState();
            });
        }

        return btn;
    }

    function buildSchoolRecommendations(majorId) {
        const schools = MAJOR_TO_SCHOOLS[majorId];
        if (!schools || schools.length === 0) return null;

        const prefix = getPrefix();
        const section = document.createElement('div');
        section.className = 'school-recs';

        section.innerHTML = `
            <h3>Top Schools for This Major <span class="cn">推荐院校</span></h3>
            <div class="school-rec-grid">
                ${schools.map(s => `
                    <a href="${prefix}${s.path}" class="school-rec-card">
                        <div class="school-rec-name">${s.name}</div>
                        <div class="school-rec-meta">${s.tier}</div>
                    </a>
                `).join('')}
            </div>
        `;

        return section;
    }

    function init() {
        const pageInfo = getCurrentPageInfo();
        if (!pageInfo) return;

        const target = document.querySelector('h1');
        if (!target) return;

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'space-between';
        wrapper.style.gap = '12px';
        wrapper.style.flexWrap = 'wrap';
        wrapper.style.marginBottom = '12px';

        target.parentNode.insertBefore(wrapper, target);
        wrapper.appendChild(target);
        wrapper.appendChild(buildFavButton(pageInfo));

        if (pageInfo.type === 'major') {
            const recs = buildSchoolRecommendations(pageInfo.id);
            if (recs) {
                const footer = document.querySelector('.footer');
                if (footer) {
                    footer.parentNode.insertBefore(recs, footer);
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
