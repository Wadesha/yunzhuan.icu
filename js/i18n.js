/**
 * I18n v55 - 多语言（中/英/日）
 *
 * 提供：
 *   - window.I18n.locales: 支持的语言代码列表
 *   - window.I18n.t(key, params?): 翻译取文案
 *   - window.I18n.setLocale(code): 切换语言（持久化 localStorage）
 *   - window.I18n.getLocale(): 当前语言
 *   - window.I18n.apply(root?): 扫描 DOM 中 [data-i18n] 元素并应用翻译
 *   - window.I18n.coverage(): 翻译覆盖率统计
 *
 * 用法：
 *   <h1 data-i18n="dashboard.title">Dashboard</h1>
 *   <span data-i18n="common.welcome" data-i18n-params='{"name":"Tom"}'></span>
 */
(function () {
  'use strict';

  // === Locales ===
  var LOCALES = ['zh-CN', 'en-US', 'ja-JP'];
  var DEFAULT_LOCALE = 'zh-CN';
  var STORAGE_KEY = 'yz_locale';

  // === Dictionary ===
  // 关键 label 覆盖：dashboard / intro / practice / common / nav / footer / error
  var DICT = {
    'zh-CN': {
      'common.appName': 'yunzhuan.icu',
      'common.tagline': '留学申请一站式平台',
      'common.welcome': '欢迎，{name}！',
      'common.search': '搜索',
      'common.submit': '提交',
      'common.cancel': '取消',
      'common.save': '保存',
      'common.delete': '删除',
      'common.edit': '编辑',
      'common.back': '返回',
      'common.next': '下一步',
      'common.prev': '上一步',
      'common.loading': '加载中...',
      'common.empty': '暂无数据',
      'common.yes': '是',
      'common.no': '否',
      'common.confirm': '确认',
      'common.close': '关闭',
      'common.more': '更多',
      'common.less': '收起',
      'common.language': '语言',

      'nav.home': '首页',
      'nav.academics': '学术',
      'nav.practice': '刷题',
      'nav.dashboard': '仪表盘',
      'nav.mock': '模拟考',
      'nav.collab': '协作',
      'nav.parent': '家长模式',
      'nav.api': 'API',
      'nav.install': '安装 App',
      'nav.about': '关于',
      'nav.contact': '联系我们',

      'footer.copyright': '版权所有',
      'footer.privacy': '隐私政策',
      'footer.terms': '使用条款',

      'practice.title': '刷题中心',
      'practice.subtitle': '考纲 · 模拟考题 · 刷题追踪 — 8 科 + 3 竞赛',
      'practice.startMock': '开始模拟考',
      'practice.openDashboard': '打开仪表盘',
      'practice.dailyReview': '每日复习',
      'practice.wrongBook': '错题本',
      'practice.filterTopic': '按 Topic 筛选',
      'practice.questionCount': '共 {n} 题',
      'practice.answeredCount': '已答 {n} 题',
      'practice.correctCount': '答对 {n} 题',
      'practice.accuracy': '正确率 {pct}%',
      'practice.timeUsed': '用时 {m} 分钟',
      'practice.startAnswer': '开始答题',
      'practice.nextQuestion': '下一题',
      'practice.prevQuestion': '上一题',
      'practice.submitAnswer': '提交答案',
      'practice.viewSolution': '查看解析',
      'practice.hideSolution': '隐藏解析',
      'practice.markWrong': '加入错题本',
      'practice.unmarkWrong': '移出错题本',
      'practice.difficulty.easy': '简单',
      'practice.difficulty.medium': '中等',
      'practice.difficulty.hard': '困难',
      'practice.subject.sat': 'SAT',
      'practice.subject.act': 'ACT',
      'practice.subject.ap': 'AP',
      'practice.subject.ib': 'IB',
      'practice.subject.alevel': 'A-Level',
      'practice.subject.igcse': 'IGCSE',
      'practice.subject.toefl': 'TOEFL',
      'practice.subject.ielts': 'IELTS',
      'practice.subject.amc': 'AMC',

      'dashboard.title': '学习仪表盘',
      'dashboard.subtitle': '全科目数据分析 · 知识点掌握度 · 错题趋势',
      'dashboard.totalAnswered': '累计答题',
      'dashboard.totalCorrect': '累计正确',
      'dashboard.accuracy': '正确率',
      'dashboard.streak': '连续天数',
      'dashboard.timeSpent': '学习时长',
      'dashboard.subjectMastery': '科目掌握度',
      'dashboard.recentActivity': '最近活动',
      'dashboard.weakTopics': '薄弱 Topic',
      'dashboard.recommendedPath': '推荐学习路径',
      'practice.stage.explore': '探索期',
      'practice.stage.attack': '攻坚期',
      'practice.stage.apply': '申请季',
      'practice.stage.explore.desc': 'IGCSE 打基础 / TOEFL 入门词汇 / 竞赛试水',
      'practice.stage.attack.desc': 'IB/AP/A-Level 选科定课 / SAT/ACT 冲刺 / 竞赛冲奖',
      'practice.stage.apply.desc': '薄弱 Topic 补漏 / Mock Test 全真模考 / 分数达标确认',

      'intro.sat': 'SAT 是美国大学入学标准化考试，Digital 模式 400-1600 分。',
      'intro.act': 'ACT 包含英语、数学、阅读、科学四部分，单项 1-36 分。',
      'intro.ap': 'AP 共 38 门科目，分数 1-5，可换取大学学分。',
      'intro.ib': 'IB Diploma 由 6 大学科组构成，满分 45 分。',
      'intro.alevel': 'A-Level 由 AS + A2 组成，成绩 A*-E。',
      'intro.igcse': 'IGCSE 包含 Core 与 Extended 两层，成绩 A*-G。',
      'intro.toefl': 'TOEFL iBT 含听、说、读、写四部分，满分 120。',
      'intro.ielts': 'IELTS 含听、说、读、写四部分，满分 9.0。',
      'intro.amc': 'AMC 是美国数学竞赛，含 AMC 8/10/12。',

      'install.title': '安装 yunzhuan App',
      'install.subtitle': '添加到桌面，离线可用，秒开启动',
      'install.button': '安装到桌面',
      'install.detect': '环境检测',
      'install.guide': '安装教程',
      'install.shortcut.mock': '模拟考',
      'install.shortcut.dashboard': '仪表盘',
      'install.shortcut.daily': '每日复习',

      'error.network': '网络错误，请稍后重试',
      'error.notFound': '未找到资源',
      'error.serverError': '服务器错误',
      'error.unknown': '未知错误',
      'error.required': '此字段必填',
      'error.tooShort': '输入过短',
      'error.tooLong': '输入过长',
    },

    'en-US': {
      'common.appName': 'yunzhuan.icu',
      'common.tagline': 'One-stop college application platform',
      'common.welcome': 'Welcome, {name}!',
      'common.search': 'Search',
      'common.submit': 'Submit',
      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.back': 'Back',
      'common.next': 'Next',
      'common.prev': 'Previous',
      'common.loading': 'Loading...',
      'common.empty': 'No data',
      'common.yes': 'Yes',
      'common.no': 'No',
      'common.confirm': 'Confirm',
      'common.close': 'Close',
      'common.more': 'More',
      'common.less': 'Less',
      'common.language': 'Language',

      'nav.home': 'Home',
      'nav.academics': 'Academics',
      'nav.practice': 'Practice',
      'nav.dashboard': 'Dashboard',
      'nav.mock': 'Mock Test',
      'nav.collab': 'Collab',
      'nav.parent': 'Parent',
      'nav.api': 'API',
      'nav.install': 'Install',
      'nav.about': 'About',
      'nav.contact': 'Contact',

      'footer.copyright': 'All rights reserved',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Use',

      'practice.title': 'Practice Center',
      'practice.subtitle': 'Syllabus · Mock tests · Progress tracking — 8 subjects + 3 contests',
      'practice.startMock': 'Start Mock Test',
      'practice.openDashboard': 'Open Dashboard',
      'practice.dailyReview': 'Daily Review',
      'practice.wrongBook': 'Wrong Book',
      'practice.filterTopic': 'Filter by Topic',
      'practice.questionCount': '{n} questions',
      'practice.answeredCount': '{n} answered',
      'practice.correctCount': '{n} correct',
      'practice.accuracy': '{pct}% accuracy',
      'practice.timeUsed': '{m} min spent',
      'practice.startAnswer': 'Start Answering',
      'practice.nextQuestion': 'Next Question',
      'practice.prevQuestion': 'Previous Question',
      'practice.submitAnswer': 'Submit Answer',
      'practice.viewSolution': 'View Solution',
      'practice.hideSolution': 'Hide Solution',
      'practice.markWrong': 'Add to Wrong Book',
      'practice.unmarkWrong': 'Remove from Wrong Book',
      'practice.difficulty.easy': 'Easy',
      'practice.difficulty.medium': 'Medium',
      'practice.difficulty.hard': 'Hard',
      'practice.subject.sat': 'SAT',
      'practice.subject.act': 'ACT',
      'practice.subject.ap': 'AP',
      'practice.subject.ib': 'IB',
      'practice.subject.alevel': 'A-Level',
      'practice.subject.igcse': 'IGCSE',
      'practice.subject.toefl': 'TOEFL',
      'practice.subject.ielts': 'IELTS',
      'practice.subject.amc': 'AMC',

      'dashboard.title': 'Learning Dashboard',
      'dashboard.subtitle': 'Subject analytics · Mastery · Wrong trends',
      'dashboard.totalAnswered': 'Total Answered',
      'dashboard.totalCorrect': 'Total Correct',
      'dashboard.accuracy': 'Accuracy',
      'dashboard.streak': 'Day Streak',
      'dashboard.timeSpent': 'Time Spent',
      'dashboard.subjectMastery': 'Subject Mastery',
      'dashboard.recentActivity': 'Recent Activity',
      'dashboard.weakTopics': 'Weak Topics',
      'dashboard.recommendedPath': 'Recommended Path',
      'practice.stage.explore': 'Exploration',
      'practice.stage.attack': 'Attack',
      'practice.stage.apply': 'Application',
      'practice.stage.explore.desc': 'IGCSE foundations / TOEFL vocab / contest tryouts',
      'practice.stage.attack.desc': 'IB/AP/A-Level choices / SAT/ACT prep / contest awards',
      'practice.stage.apply.desc': 'Weak topic review / Mock test / Score check',

      'intro.sat': 'SAT is the U.S. college admission test, Digital 400-1600.',
      'intro.act': 'ACT has English, Math, Reading and Science, scored 1-36.',
      'intro.ap': 'AP has 38 subjects, scored 1-5, eligible for college credit.',
      'intro.ib': 'IB Diploma has 6 subject groups, max 45 points.',
      'intro.alevel': 'A-Level includes AS + A2, graded A*-E.',
      'intro.igcse': 'IGCSE has Core and Extended tiers, graded A*-G.',
      'intro.toefl': 'TOEFL iBT includes 4 sections, max 120.',
      'intro.ielts': 'IELTS includes 4 sections, max 9.0.',
      'intro.amc': 'AMC is a US math contest with AMC 8/10/12.',

      'install.title': 'Install yunzhuan App',
      'install.subtitle': 'Add to home screen, offline-ready, instant launch',
      'install.button': 'Install to Desktop',
      'install.detect': 'Environment Check',
      'install.guide': 'Install Guide',
      'install.shortcut.mock': 'Mock Test',
      'install.shortcut.dashboard': 'Dashboard',
      'install.shortcut.daily': 'Daily Review',

      'error.network': 'Network error, please retry',
      'error.notFound': 'Resource not found',
      'error.serverError': 'Server error',
      'error.unknown': 'Unknown error',
      'error.required': 'This field is required',
      'error.tooShort': 'Input too short',
      'error.tooLong': 'Input too long',
    },

    'ja-JP': {
      'common.appName': 'yunzhuan.icu',
      'common.tagline': '留学出願ワンストッププラットフォーム',
      'common.welcome': 'ようこそ、{name}さん！',
      'common.search': '検索',
      'common.submit': '送信',
      'common.cancel': 'キャンセル',
      'common.save': '保存',
      'common.delete': '削除',
      'common.edit': '編集',
      'common.back': '戻る',
      'common.next': '次へ',
      'common.prev': '前へ',
      'common.loading': '読み込み中...',
      'common.empty': 'データなし',
      'common.yes': 'はい',
      'common.no': 'いいえ',
      'common.confirm': '確認',
      'common.close': '閉じる',
      'common.more': 'もっと見る',
      'common.less': '閉じる',
      'common.language': '言語',

      'nav.home': 'ホーム',
      'nav.academics': '学業',
      'nav.practice': '問題演習',
      'nav.dashboard': 'ダッシュボード',
      'nav.mock': '模擬試験',
      'nav.collab': '协作',
      'nav.parent': '保護者',
      'nav.api': 'API',
      'nav.install': 'インストール',
      'nav.about': 'について',
      'nav.contact': 'お問い合わせ',

      'footer.copyright': '全著作権所有',
      'footer.privacy': 'プライバシーポリシー',
      'footer.terms': '利用規約',

      'practice.title': '問題演習センター',
      'practice.subtitle': 'シラバス · 模擬試験 · 進捗追跡 — 8 科目 + 3 コンテスト',
      'practice.startMock': '模擬試験を開始',
      'practice.openDashboard': 'ダッシュボードを開く',
      'practice.dailyReview': '每日復習',
      'practice.wrongBook': '間違いノート',
      'practice.filterTopic': 'トピックで絞り込み',
      'practice.questionCount': '{n} 問',
      'practice.answeredCount': '{n} 問回答済み',
      'practice.correctCount': '{n} 問正解',
      'practice.accuracy': '正答率 {pct}%',
      'practice.timeUsed': '{m} 分',
      'practice.startAnswer': '解答開始',
      'practice.nextQuestion': '次の問題',
      'practice.prevQuestion': '前の問題',
      'practice.submitAnswer': '解答を送信',
      'practice.viewSolution': '解説を見る',
      'practice.hideSolution': '解説を隠す',
      'practice.markWrong': '間違いノートに追加',
      'practice.unmarkWrong': '間違いノートから削除',
      'practice.difficulty.easy': '易しい',
      'practice.difficulty.medium': '普通',
      'practice.difficulty.hard': '難しい',
      'practice.subject.sat': 'SAT',
      'practice.subject.act': 'ACT',
      'practice.subject.ap': 'AP',
      'practice.subject.ib': 'IB',
      'practice.subject.alevel': 'A-Level',
      'practice.subject.igcse': 'IGCSE',
      'practice.subject.toefl': 'TOEFL',
      'practice.subject.ielts': 'IELTS',
      'practice.subject.amc': 'AMC',

      'dashboard.title': '学習ダッシュボード',
      'dashboard.subtitle': '科目分析 · 習熟度 · 間違い傾向',
      'dashboard.totalAnswered': '累計解答',
      'dashboard.totalCorrect': '累計正解',
      'dashboard.accuracy': '正答率',
      'dashboard.streak': '連続日数',
      'dashboard.timeSpent': '学習時間',
      'dashboard.subjectMastery': '科目習熟度',
      'dashboard.recentActivity': '最近の活動',
      'dashboard.weakTopics': '苦手なトピック',
      'dashboard.recommendedPath': 'おすすめ学習パス',
      'practice.stage.explore': '探索期',
      'practice.stage.attack': '攻坚期',
      'practice.stage.apply': '出願期',
      'practice.stage.explore.desc': 'IGCSE 基礎 / TOEFL 語彙 / コンテスト試水',
      'practice.stage.attack.desc': 'IB/AP/A-Level 選択 / SAT/ACT 準備 / コンテスト受賞',
      'practice.stage.apply.desc': '苦手克服 / 模擬試験 / スコア確認',

      'intro.sat': 'SAT は米国大学入試テスト、Digital 400-1600 点。',
      'intro.act': 'ACT は英語・数学・読解・理科、1-36 点。',
      'intro.ap': 'AP は 38 科目、1-5 点で大学単位取得可能。',
      'intro.ib': 'IB Diploma は 6 科目群、最大 45 点。',
      'intro.alevel': 'A-Level は AS + A2、A*-E 評価。',
      'intro.igcse': 'IGCSE は Core と Extended、A*-G 評価。',
      'intro.toefl': 'TOEFL iBT は 4 セクション、最大 120 点。',
      'intro.ielts': 'IELTS は 4 セクション、最大 9.0 点。',
      'intro.amc': 'AMC は AMC 8/10/12 を含む数学コンテスト。',

      'install.title': 'yunzhuan アプリをインストール',
      'install.subtitle': 'ホーム画面に追加、オフライン対応、瞬時起動',
      'install.button': 'デスクトップにインストール',
      'install.detect': '環境検出',
      'install.guide': 'インストール手順',
      'install.shortcut.mock': '模擬試験',
      'install.shortcut.dashboard': 'ダッシュボード',
      'install.shortcut.daily': '每日復習',

      'error.network': 'ネットワークエラー、後でもう一度お試しください',
      'error.notFound': 'リソースが見つかりません',
      'error.serverError': 'サーバーエラー',
      'error.unknown': '不明なエラー',
      'error.required': 'この項目は必須です',
      'error.tooShort': '入力が短すぎます',
      'error.tooLong': '入力が長すぎます',
    }
  };

  // === Helpers ===
  function safeStorageGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeStorageSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
  }

  function detectBrowserLocale() {
    var lang = (navigator.language || navigator.userLanguage || DEFAULT_LOCALE).toLowerCase();
    if (lang.indexOf('zh') === 0) return 'zh-CN';
    if (lang.indexOf('ja') === 0) return 'ja-JP';
    if (lang.indexOf('en') === 0) return 'en-US';
    return DEFAULT_LOCALE;
  }

  function getStoredLocale() {
    var v = safeStorageGet(STORAGE_KEY);
    if (v && LOCALES.indexOf(v) !== -1) return v;
    return null;
  }

  // === API ===
  var I18n = {
    locales: LOCALES.slice(),

    _current: null,

    getLocale: function () {
      if (this._current) return this._current;
      this._current = getStoredLocale() || detectBrowserLocale();
      if (LOCALES.indexOf(this._current) === -1) this._current = DEFAULT_LOCALE;
      return this._current;
    },

    setLocale: function (code) {
      if (LOCALES.indexOf(code) === -1) {
        console.warn('[I18n] Unknown locale:', code);
        return false;
      }
      this._current = code;
      safeStorageSet(STORAGE_KEY, code);
      // 设置 <html lang>
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('lang', code);
      }
      // 触发 change 事件
      try {
        if (typeof window !== 'undefined' && window.dispatchEvent) {
          window.dispatchEvent(new CustomEvent('i18n:change', { detail: { locale: code } }));
        }
      } catch (e) {}
      return true;
    },

    t: function (key, params) {
      var loc = this.getLocale();
      var dict = DICT[loc] || DICT[DEFAULT_LOCALE];
      var val = (dict && dict[key]) || (DICT[DEFAULT_LOCALE] && DICT[DEFAULT_LOCALE][key]) || key;
      if (params && typeof params === 'object') {
        val = String(val).replace(/\{(\w+)\}/g, function (_, k) {
          return (params[k] != null) ? String(params[k]) : ('{' + k + '}');
        });
      }
      return val;
    },

    /** 扫描 DOM 中带 data-i18n 属性的元素并替换 textContent */
    apply: function (root) {
      if (typeof document === 'undefined') return;
      var scope = root || document;
      var nodes = scope.querySelectorAll('[data-i18n]');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var key = el.getAttribute('data-i18n');
        var paramsRaw = el.getAttribute('data-i18n-params');
        var params = null;
        if (paramsRaw) {
          try { params = JSON.parse(paramsRaw); } catch (e) { params = null; }
        }
        el.textContent = this.t(key, params);
      }
      // placeholder
      var placeholders = scope.querySelectorAll('[data-i18n-placeholder]');
      for (var j = 0; j < placeholders.length; j++) {
        var el2 = placeholders[j];
        el2.setAttribute('placeholder', this.t(el2.getAttribute('data-i18n-placeholder')));
      }
      // title
      var titles = scope.querySelectorAll('[data-i18n-title]');
      for (var k = 0; k < titles.length; k++) {
        var el3 = titles[k];
        el3.setAttribute('title', this.t(el3.getAttribute('data-i18n-title')));
      }
    },

    /** 翻译覆盖率：返回 { total, translated, missing, coverage } */
    coverage: function () {
      var ref = DICT[DEFAULT_LOCALE] || {};
      var loc = this.getLocale();
      var cur = DICT[loc] || {};
      var refKeys = Object.keys(ref);
      var total = refKeys.length;
      var translated = 0;
      var missing = [];
      for (var i = 0; i < refKeys.length; i++) {
        if (cur[refKeys[i]]) translated++;
        else missing.push(refKeys[i]);
      }
      return {
        locale: loc,
        total: total,
        translated: translated,
        missing: missing,
        coverage: total ? Math.round((translated / total) * 1000) / 10 : 0
      };
    },

    /** 列出所有 key（用于 i18n-demo） */
    keys: function () {
      return Object.keys(DICT[DEFAULT_LOCALE] || {});
    },

    /** 直接读取某 locale 的某 key（不应用参数替换） */
    raw: function (key, locale) {
      var loc = locale || this.getLocale();
      return (DICT[loc] && DICT[loc][key]) || (DICT[DEFAULT_LOCALE] && DICT[DEFAULT_LOCALE][key]) || key;
    }
  };

  // 初始化 <html lang>
  if (typeof document !== 'undefined') {
    try {
      document.documentElement.setAttribute('lang', I18n.getLocale());
    } catch (e) {}
  }

  // 暴露
  if (typeof window !== 'undefined') {
    window.I18n = I18n;
  }
})();
