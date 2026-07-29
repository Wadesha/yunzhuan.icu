// pages/practice/practice.js
const { getSubject, listSubjects } = require('../../utils/syllabus-data.js');
const { recordAnswer, getStats } = require('../../utils/practice-engine.js');

Page({
  data: {
    subjectCode: 'sat',
    subjectName: 'SAT',
    subjectDesc: '',
    papers: [],
    currentTopic: null,
    currentQ: null,
    selected: null,
    showSolution: false,
    stats: null,
    questionIdx: 0
  },

  onLoad(opts) {
    const code = (opts && opts.subject) || 'sat';
    const sub = getSubject(code) || getSubject('sat');
    const papers = (sub.papers || []).map(p => ({
      code: p.code,
      name: p.name,
      topics: p.topics
    }));
    // 简单生成 5 道样题
    const questions = this._buildQuestions(sub);
    this.setData({
      subjectCode: sub.code,
      subjectName: sub.name,
      subjectDesc: sub.desc,
      papers: papers,
      questions: questions,
      currentQ: questions[0] || null,
      stats: getStats(sub.code)
    });
    wx.setNavigationBarTitle({ title: '刷题 - ' + sub.name });
  },

  _buildQuestions(sub) {
    // 简单生成 5 道演示题（真实数据应来自题库）
    const base = [
      { id: sub.code + '-Q1', topic: 'CR', stem: 'According to the passage, the author\'s main purpose is to ___', options: ['criticize', 'describe', 'compare', 'argue'], answer: 1, solution: '题干询问作者主要目的，需回到文章主题句定位。' },
      { id: sub.code + '-Q2', topic: 'INFO', stem: 'Which choice best describes the overall structure of the passage?', options: ['Chronological', 'Cause and effect', 'Compare-contrast', 'Problem-solution'], answer: 2, solution: '识别段落关系和连接词。' },
      { id: sub.code + '-Q3', topic: 'ALG', stem: 'If 3x + 5 = 20, what is the value of x?', options: ['3', '5', '6', '15'], answer: 1, solution: '3x = 15 → x = 5。' },
      { id: sub.code + '-Q4', topic: 'GEO', stem: 'The area of a circle with radius 4 is ___', options: ['8π', '12π', '16π', '4π'], answer: 2, solution: 'S = πr² = π × 16 = 16π。' },
      { id: sub.code + '-Q5', topic: 'CONV', stem: 'Choose the option with correct subject-verb agreement.', options: ['The list of items are long', 'The list of items is long', 'The list of items were long', 'A list of items are long'], answer: 1, solution: '主语是 list（单数），动词用 is。' }
    ];
    return base;
  },

  pickOption(e) {
    if (this.data.selected != null) return;
    const idx = e.currentTarget.dataset.idx;
    const q = this.data.currentQ;
    this.setData({
      selected: idx,
      showSolution: true
    });
    recordAnswer(this.data.subjectCode, q.id, idx, idx === q.answer, q.topic);
    this.setData({ stats: getStats(this.data.subjectCode) });
  },

  nextQuestion() {
    const idx = this.data.questionIdx + 1;
    if (idx >= this.data.questions.length) {
      wx.showToast({ title: '已到最后一题', icon: 'none' });
      return;
    }
    this.setData({
      questionIdx: idx,
      currentQ: this.data.questions[idx],
      selected: null,
      showSolution: false
    });
  },

  prevQuestion() {
    const idx = Math.max(0, this.data.questionIdx - 1);
    this.setData({
      questionIdx: idx,
      currentQ: this.data.questions[idx],
      selected: null,
      showSolution: false
    });
  },

  toggleSolution() {
    this.setData({ showSolution: !this.data.showSolution });
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goDashboard() {
    wx.switchTab({ url: '/pages/dashboard/dashboard' });
  }
});
