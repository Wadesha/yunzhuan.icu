// Mobile Navigation Enhancements
// Hamburger menu dropdown (no bottom tab bar)

(function() {
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
            buildHamburger();
        }
    });

    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            const existingBtn = document.querySelector('.hamburger-btn');
            const existingDropdown = document.querySelector('.mobile-nav-dropdown');

            if (window.innerWidth <= 768) {
                if (!existingBtn) buildHamburger();
            } else {
                if (existingBtn) existingBtn.remove();
                if (existingDropdown) existingDropdown.remove();
            }
        }, 200);
    });
})();
