(function() {
    var ua = navigator.userAgent.toLowerCase();
    var isWechat = ua.indexOf('micromessenger') !== -1;
    var isQQ = ua.indexOf('qq/') !== -1 && ua.indexOf('qqbrowser') === -1;

    if (!isWechat && !isQQ) return;

    var style = document.createElement('style');
    style.innerHTML = [
        '.wx-mask{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:999999;display:flex;justify-content:center;align-items:flex-start;padding-top:60px;}',
        '.wx-mask-content{color:#fff;text-align:center;max-width:320px;padding:20px;}',
        '.wx-mask-icon{font-size:60px;margin-bottom:20px;}',
        '.wx-mask-title{font-size:18px;font-weight:600;margin-bottom:12px;}',
        '.wx-mask-desc{font-size:14px;line-height:1.8;opacity:0.9;}',
        '.wx-mask-arrow{position:absolute;top:20px;right:40px;font-size:50px;color:#fff;}',
        '.wx-mask-btn{margin-top:24px;padding:12px 28px;background:#fff;color:#333;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;}',
        '.wx-mask-close{position:absolute;top:20px;left:20px;color:#fff;font-size:24px;opacity:0.6;cursor:pointer;}'
    ].join('');
    document.head.appendChild(style);

    var mask = document.createElement('div');
    mask.className = 'wx-mask';
    mask.innerHTML = [
        '<div class="wx-mask-arrow">↗</div>',
        '<div class="wx-mask-close">×</div>',
        '<div class="wx-mask-content">',
        '   <div class="wx-mask-icon">🔗</div>',
        '   <div class="wx-mask-title">请在浏览器中打开</div>',
        '   <div class="wx-mask-desc">',
        '       微信内暂不支持完整浏览<br>',
        '       点击右上角「···」<br>',
        '       选择「在浏览器中打开」',
        '   </div>',
        '   <button class="wx-mask-btn">点击复制链接</button>',
        '</div>'
    ].join('');

    function showMask() {
        document.body.appendChild(mask);
        document.body.style.overflow = 'hidden';
    }

    function hideMask() {
        if (mask.parentNode) mask.parentNode.removeChild(mask);
        document.body.style.overflow = '';
    }

    mask.querySelector('.wx-mask-close').addEventListener('click', hideMask);
    mask.querySelector('.wx-mask-btn').addEventListener('click', function() {
        var url = window.location.href;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function() {
                alert('链接已复制，请在浏览器中粘贴打开');
            });
        } else {
            var input = document.createElement('textarea');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            try {
                document.execCommand('copy');
                alert('链接已复制，请在浏览器中粘贴打开');
            } catch (e) {
                alert('请手动复制地址栏链接');
            }
            document.body.removeChild(input);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showMask);
    } else {
        showMask();
    }
})();
