(function() {
    'use strict';
    var toggles = document.querySelectorAll('.collapsible-toggle');
    toggles.forEach(function(toggle) {
        toggle.addEventListener('click', function() {
            var section = this.parentElement;
            var content = section.querySelector('.collapsible-content');
            if (content) {
                if (content.classList.contains('collapsed')) {
                    content.classList.remove('collapsed');
                    content.classList.add('expanded');
                    this.textContent = '收起';
                    var overlay = section.querySelector('.collapsible-overlay');
                    if (overlay) overlay.style.display = 'none';
                } else {
                    content.classList.remove('expanded');
                    content.classList.add('collapsed');
                    this.textContent = '展开';
                    var overlay = section.querySelector('.collapsible-overlay');
                    if (overlay) overlay.style.display = 'block';
                }
            }
        });
    });
})();