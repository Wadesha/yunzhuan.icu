// Navbar User Menu - adds login button or user dropdown to nav bar

(function() {
    function getPrefix() {
        const depth = (location.pathname.match(/\//g) || []).length - 1;
        if (depth <= 0) return './';
        return '../'.repeat(depth);
    }

    function buildAuthBtn() {
        const prefix = getPrefix();
        const a = document.createElement('a');
        a.href = prefix + 'login.html';
        a.className = 'auth-btn';
        a.textContent = 'Sign In';
        return a;
    }

    function buildUserMenu(user) {
        const prefix = getPrefix();
        const wrapper = document.createElement('div');
        wrapper.className = 'user-menu-wrapper';

        const email = user.email || '';
        const initial = (email.charAt(0) || 'U').toUpperCase();

        const btn = document.createElement('button');
        btn.className = 'user-avatar-btn';
        btn.textContent = initial;
        btn.setAttribute('aria-label', 'User menu');

        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="user-info">
                <div class="user-email">${email}</div>
            </div>
            <a href="${prefix}profile.html">My Profile / 个人中心</a>
            <a href="${prefix}profile.html#favorites">Favorites / 我的收藏</a>
            <a href="${prefix}profile.html#schools">School List / 选校名单</a>
            <button id="nav-signout-btn">Sign Out / 退出登录</button>
        `;

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

        dropdown.querySelector('#nav-signout-btn').addEventListener('click', async function() {
            if (window.Auth) {
                try {
                    await window.Auth.signOut();
                    location.reload();
                } catch (e) {
                    alert('Sign out failed: ' + e.message);
                }
            }
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(dropdown);
        return wrapper;
    }

    function init() {
        const navLinks = document.querySelector('.nav-links');
        if (!navLinks) return;

        if (window.Auth && typeof window.Auth.ready === 'function') {
            window.Auth.ready(function(user) {
                if (user) {
                    navLinks.appendChild(buildUserMenu(user));
                } else {
                    navLinks.appendChild(buildAuthBtn());
                }
            });
        } else {
            navLinks.appendChild(buildAuthBtn());
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
