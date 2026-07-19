/* track.js - 访问跟踪 - 完全容错，绝不影响页面 */
try {
    (function () {
        function getCookie(name) {
            try {
                var m = document.cookie.match(new RegExp('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)'));
                return m ? m[2] : '';
            } catch (e) { return ''; }
        }
        function setCookie(name, value, days) {
            try {
                var d = new Date();
                d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
                document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
            } catch (e) {}
        }
        var visitorId = getCookie('vid');
        if (!visitorId) {
            visitorId = 'v_' + (new Date().getTime()) + '_' + Math.random().toString(36).substr(2, 9);
            setCookie('vid', visitorId, 365);
        }
        if (typeof fetch === 'function') {
            try {
                fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        path: window.location.pathname,
                        referrer: document.referrer || '',
                        visitorId: visitorId
                    })
                }).catch(function () { });
            } catch (e) { }
        }
    })();
} catch (e) { }
