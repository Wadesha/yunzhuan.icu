// Theme Toggle - Dark / Light Mode
// Uses CSS variables + localStorage, no dependencies

(function() {
    const THEME_KEY = 'yunzhuan_theme';
    const root = document.documentElement;

    // Get saved theme or detect system preference
    function getInitialTheme() {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') return saved;
        // Detect system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Apply theme immediately (before DOM ready to avoid flash)
    const initialTheme = getInitialTheme();
    root.setAttribute('data-theme', initialTheme);

    // Run after DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Add theme toggle button to navbar if navbar exists
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

        // Listen for system theme change
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
                if (!localStorage.getItem(THEME_KEY)) {
                    setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    });

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

    // Expose for manual use
    window.ThemeToggle = {
        get: () => root.getAttribute('data-theme'),
        set: setTheme,
        toggle: toggleTheme
    };
})();
