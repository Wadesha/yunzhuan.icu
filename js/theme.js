// Theme Toggle - Dark / Light Mode (Internal Testing Only)
// Uses CSS variables + localStorage, no dependencies
// Access via console: ThemeToggle.toggle() / ThemeToggle.set('dark')

(function() {
    const THEME_KEY = 'yunzhuan_theme';
    const root = document.documentElement;

    // Force light mode by default (internal testing only)
    // Uncomment below to enable system preference detection
    function getInitialTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        return 'light'; // default to light for production
    }

    // Apply theme immediately (before DOM ready to avoid flash)
    const initialTheme = getInitialTheme();
    root.setAttribute('data-theme', initialTheme);

    // Toggle button is disabled in production (internal testing only)
    // To test dark mode, open console and type: ThemeToggle.toggle()
    /*
    document.addEventListener('DOMContentLoaded', function() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            const btn = document.createElement('button');
            btn.className = 'theme-toggle';
            btn.title = 'Toggle theme / 切换主题';
            btn.setAttribute('aria-label', 'Toggle theme');
            btn.innerHTML = initialTheme === 'dark' ? '☀️' : '🌙';
            btn.style.marginLeft = '8px';
            btn.addEventListener('click', toggleTheme);
            navLinks.appendChild(btn);
        }

        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                if (!localStorage.getItem(THEME_KEY)) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    });
    */

    function toggleTheme() {
        const current = root.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
        localStorage.setItem(THEME_KEY, next);
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        const btn = document.querySelector('.theme-toggle');
        if (btn) {
            btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
        }
    }

    // Expose for manual use (internal testing)
    window.ThemeToggle = {
        get: () => root.getAttribute('data-theme'),
        set: setTheme,
        toggle: toggleTheme
    };
})();
