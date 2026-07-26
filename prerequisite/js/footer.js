function renderFooter() {
  var isPrerequisite = window.location.pathname.indexOf('/prerequisite/') !== -1;
  var basePath = isPrerequisite ? '/prerequisite' : '';
  
  var footerHtml = `
    <div class="footer-bar">
      <div class="footer-links">
        <a href="${basePath}/index.html">首页</a>
        <span class="footer-divider">|</span>
        <a href="${basePath}/profile.html">我的档案</a>
        <span class="footer-divider">|</span>
        <a href="${basePath}/login.html">登录/注册</a>
        <span class="footer-divider">|</span>
        <a href="${basePath}/deploy-status.html">部署状态</a>
      </div>
      <div class="footer-copyright">
        <span id="loginIndicator" style="font-size:0.75rem;color:#666;"></span>
        <span style="font-size:0.75rem;color:#999;margin-left:10px;">v${BUILD_INFO?.version || '?'}</span>
      </div>
    </div>
  `;
  
  var footer = document.createElement('div');
  footer.innerHTML = footerHtml;
  document.body.appendChild(footer);
  
  updateLoginIndicator();
  
  var style = document.createElement('style');
  style.textContent = `
    .footer-bar {
      margin-top: 40px;
      padding: 20px;
      background: #f8f9fa;
      border-top: 1px solid #e9ecef;
      text-align: center;
      font-size: 0.85rem;
    }
    .footer-links a {
      color: #666;
      text-decoration: none;
      margin: 0 8px;
    }
    .footer-links a:hover {
      color: #333;
      text-decoration: underline;
    }
    .footer-divider {
      color: #ccc;
    }
    .footer-copyright {
      margin-top: 8px;
      color: #999;
    }
  `;
  document.head.appendChild(style);
}

function updateLoginIndicator() {
  var el = document.getElementById('loginIndicator');
  if (!el) return;
  
  if (typeof CloudSlot !== 'undefined' && CloudSlot.isLoggedIn()) {
    el.textContent = '● 已登录';
    el.style.color = '#4caf50';
  } else {
    el.textContent = '○ 未登录';
    el.style.color = '#999';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderFooter);
} else {
  renderFooter();
}