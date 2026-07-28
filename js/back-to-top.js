// Back to top button - auto-injected
(function() {
    function createBackToTop() {
        const btn = document.createElement('button');
        btn.id = 'backToTop';
        btn.innerHTML = '↑';
        btn.setAttribute('aria-label', 'Back to top');
        btn.style.cssText = `
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            border: none;
            background: #667eea;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s, transform 0.2s;
            z-index: 999;
            box-shadow: 0 2px 8px rgba(102,126,234,0.3);
        `;

        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                btn.style.opacity = '1';
                btn.style.visibility = 'visible';
            } else {
                btn.style.opacity = '0';
                btn.style.visibility = 'hidden';
            }
        });

        document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createBackToTop);
    } else {
        createBackToTop();
    }
})();
