// Global Search Shortcut
// Press / or Ctrl+K / Cmd+K anywhere to jump to search page
// If already on search page, focus the input instead

(function() {
    const SEARCH_PAGE = 'search.html';

    function getSearchPath() {
        const depth = (document.body.getAttribute('data-depth') || '0');
        let prefix = '';
        for (let i = 0; i < depth; i++) prefix += '../';
        return prefix + SEARCH_PAGE;
    }

    function isOnSearchPage() {
        return window.location.pathname.endsWith('/search.html') ||
               window.location.pathname === '/search.html' ||
               document.getElementById('searchInput') !== null;
    }

    function triggerSearch() {
        if (isOnSearchPage()) {
            const input = document.getElementById('searchInput');
            if (input) {
                input.focus();
                input.select();
            }
        } else {
            window.location.href = getSearchPath();
        }
    }

    document.addEventListener('keydown', function(e) {
        const tag = (e.target.tagName || '').toLowerCase();
        const isTyping = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;

        // Ctrl+K / Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            triggerSearch();
            return;
        }

        // / key (when not typing)
        if (e.key === '/' && !isTyping && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            triggerSearch();
            return;
        }
    });
})();
