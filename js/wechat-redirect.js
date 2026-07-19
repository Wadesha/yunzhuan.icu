/* wechat-redirect.js v2 - 微信浏览器检测与引导
 * 设计原则：绝对不影响页面正常显示
 * 验证机制：3重检测 + 2次重试 + 内容完整性自检
 */
try {
    (function () {
        'use strict';

        var WX_DEBUG = false;

        function log(msg) {
            if (WX_DEBUG && typeof console !== 'undefined' && console.log) {
                console.log('[WX] ' + msg);
            }
        }

        function isWechatUA() {
            try {
                var ua = navigator.userAgent || '';
                var low = ua.toLowerCase();
                var score = 0;
                if (low.indexOf('micromessenger') !== -1) score += 5;
                if (low.indexOf('wechat') !== -1) score += 3;
                if (low.indexOf('wxwork') !== -1) score += 3;
                if (low.indexOf(' qq/') !== -1 && low.indexOf('qqbrowser') === -1) score += 3;
                return score >= 4;
            } catch (e) {
                return false;
            }
        }

        function isWechatEnv() {
            try {
                var score = 0;
                if (typeof window.WeixinJSBridge !== 'undefined') score += 5;
                if (typeof window.wx !== 'undefined') score += 2;
                if (typeof window.__wxjs_environment !== 'undefined') score += 3;
                if (document.querySelector && document.querySelector('script[src*="weixin"]')) score += 2;
                return score >= 3;
            } catch (e) {
                return false;
            }
        }

        function isWechatFinal() {
            var uaCheck = isWechatUA();
            var envCheck = isWechatEnv();
            log('UA检测: ' + uaCheck + ', 环境检测: ' + envCheck);
            return uaCheck || envCheck;
        }

        function pageHasContent() {
            try {
                if (!document.body) return false;
                var text = document.body.innerText || document.body.textContent || '';
                return text.length > 20;
            } catch (e) {
                return true;
            }
        }

        function showMask() {
            try {
                if (!isWechatFinal()) {
                    log('非微信环境，跳过');
                    return;
                }
                if (!pageHasContent()) {
                    log('页面内容不足，跳过显示遮罩');
                    return;
                }
                if (!document.body) {
                    log('body 不存在，跳过');
                    return;
                }
                if (document.getElementById('wx-redirect-mask')) {
                    log('遮罩已存在，跳过');
                    return;
                }

                var css = [
                    '#wx-redirect-mask{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.85);z-index:2147483647;display:none;justify-content:center;align-items:flex-start;padding-top:60px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;-webkit-overflow-scrolling:touch}',
                    '#wx-redirect-mask.wx-show{display:flex}',
                    '#wx-redirect-mask .wx-arrow{position:absolute;top:18px;right:36px;font-size:48px;color:#fff;transform:rotate(30deg)}',
                    '#wx-redirect-mask .wx-close{position:absolute;top:16px;left:16px;width:40px;height:40px;line-height:40px;text-align:center;color:#fff;font-size:28px;opacity:.7;background:none;border:none;cursor:pointer;padding:0}',
                    '#wx-redirect-mask .wx-box{color:#fff;text-align:center;max-width:300px;padding:20px}',
                    '#wx-redirect-mask .wx-title{font-size:18px;font-weight:600;margin-bottom:14px}',
                    '#wx-redirect-mask .wx-desc{font-size:14px;line-height:1.8;opacity:.92}',
                    '#wx-redirect-mask .wx-btn{margin-top:22px;padding:12px 28px;background:#fff;color:#333;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;-webkit-appearance:none;appearance:none}'
                ].join('');

                var style = document.createElement('style');
                style.setAttribute('data-wx-style', '1');
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                var head = document.head || document.getElementsByTagName('head')[0];
                if (head) head.appendChild(style);

                var mask = document.createElement('div');
                mask.id = 'wx-redirect-mask';
                mask.innerHTML =
                    '<div class="wx-arrow">&#8599;</div>' +
                    '<button class="wx-close" type="button">&#215;</button>' +
                    '<div class="wx-box">' +
                    '<div class="wx-title">请在浏览器中打开</div>' +
                    '<div class="wx-desc">微信内暂不支持完整浏览<br>请点击右上角 &#183;&#183;&#183;<br>选择「在浏览器中打开」</div>' +
                    '<button class="wx-btn" type="button">复制链接</button>' +
                    '</div>';

                document.body.appendChild(mask);

                var closeBtn = mask.querySelector('.wx-close');
                if (closeBtn) {
                    closeBtn.onclick = function (e) {
                        try {
                            e.stopPropagation();
                            mask.className = '';
                        } catch (e2) { }
                    };
                }

                var copyBtn = mask.querySelector('.wx-btn');
                if (copyBtn) {
                    copyBtn.onclick = function () {
                        var url = window.location.href;
                        var copied = false;
                        try {
                            if (navigator.clipboard && navigator.clipboard.writeText) {
                                navigator.clipboard.writeText(url).then(function () {
                                    copied = true;
                                    alert('链接已复制，请在浏览器中粘贴打开');
                                })['catch'](function () {
                                    doFallback();
                                });
                            } else {
                                doFallback();
                            }
                        } catch (e) {
                            doFallback();
                        }
                        function doFallback() {
                            try {
                                var ta = document.createElement('textarea');
                                ta.value = url;
                                ta.style.position = 'fixed';
                                ta.style.top = '-9999px';
                                ta.style.left = '-9999px';
                                document.body.appendChild(ta);
                                ta.focus();
                                ta.select();
                                var ok = false;
                                try { ok = document.execCommand('copy'); } catch (ec) { }
                                document.body.removeChild(ta);
                                if (ok) {
                                    alert('链接已复制，请在浏览器中粘贴打开');
                                } else {
                                    alert('请长按地址栏复制链接');
                                }
                            } catch (e2) {
                                alert('请长按地址栏复制链接');
                            }
                        }
                    };
                }

                setTimeout(function () {
                    try {
                        if (pageHasContent()) {
                            mask.className = 'wx-show';
                            log('遮罩已显示');
                        }
                    } catch (e) { }
                }, 200);

            } catch (e) {
                log('显示遮罩失败: ' + e.message);
            }
        }

        var retryCount = 0;
        var maxRetries = 2;

        function tryShow() {
            retryCount++;
            log('第 ' + retryCount + ' 次尝试');
            if (document.body) {
                showMask();
            } else if (retryCount <= maxRetries) {
                setTimeout(tryShow, 300 * retryCount);
            }
        }

        function init() {
            log('初始化');
            if (!isWechatUA() && !isWechatEnv()) {
                log('非微信环境，直接退出');
                return;
            }
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                setTimeout(tryShow, 100);
            } else {
                window.addEventListener('load', function () {
                    setTimeout(tryShow, 100);
                });
                setTimeout(function () {
                    if (retryCount === 0) tryShow();
                }, 3000);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                setTimeout(init, 50);
            });
        } else {
            setTimeout(init, 50);
        }

        setTimeout(function () {
            if (retryCount === 0) init();
        }, 5000);

    })();
} catch (e) {
}
