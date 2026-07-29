/**
 * utils/practice-engine.js
 * 小程序版刷题引擎（v43 engine 适配）：
 *   - 用 require 复用 /js/practice-engine.js 不行（依赖 document/window）
 *   - 这里实现核心逻辑：Storage + subject 答题记录 + 错题本 + 统计
 */
'use strict';

const Storage = require('./api.js').Storage;

const STORAGE_KEY = 'yz_practice_data';

function loadData() {
  return Storage.get(STORAGE_KEY) || { records: {} };
}

function saveData(data) {
  return Storage.set(STORAGE_KEY, data);
}

function getRecords(subject) {
  const data = loadData();
  if (!data.records[subject]) data.records[subject] = {};
  return data.records[subject];
}

function recordAnswer(subject, qid, selected, correct, topic) {
  const data = loadData();
  if (!data.records[subject]) data.records[subject] = {};
  data.records[subject][qid] = {
    selected: selected,
    correct: !!correct,
    topic: topic || '',
    ts: Date.now()
  };
  saveData(data);
}

function clearSubject(subject) {
  const data = loadData();
  if (data.records[subject]) delete data.records[subject];
  saveData(data);
}

function getStats(subject) {
  const recs = getRecords(subject);
  const ids = Object.keys(recs);
  let total = ids.length;
  let correct = 0;
  let wrong = 0;
  const wrongIds = [];
  for (let i = 0; i < ids.length; i++) {
    const r = recs[ids[i]];
    if (r.correct) correct++; else { wrong++; wrongIds.push(ids[i]); }
  }
  return {
    subject: subject,
    total: total,
    correct: correct,
    wrong: wrong,
    accuracy: total ? +(correct * 100 / total).toFixed(1) : 0,
    wrongIds: wrongIds
  };
}

function getAllStats() {
  const data = loadData();
  const subjects = Object.keys(data.records || {});
  return subjects.map(s => getStats(s));
}

module.exports = {
  loadData: loadData,
  saveData: saveData,
  getRecords: getRecords,
  recordAnswer: recordAnswer,
  clearSubject: clearSubject,
  getStats: getStats,
  getAllStats: getAllStats
};
