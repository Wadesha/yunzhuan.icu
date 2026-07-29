/**
 * Collab v1 - 小组协作（localStorage 模拟）
 * 提供 createRoom / joinRoom / sendMsg / getRoomList 等 API
 */
(function() {
  'use strict';

  var ROOMS_KEY = 'yz_collab_rooms';
  var MSGS_KEY = 'yz_collab_msgs';
  var LEADER_KEY = 'yz_collab_leaderboard';

  function loadJSON(key, def) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch(e) {}
    return def || {};
  }

  function saveJSON(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {}
  }

  function genRoomCode() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  function loadRooms() {
    return loadJSON(ROOMS_KEY, {});
  }

  function saveRooms(rooms) {
    saveJSON(ROOMS_KEY, rooms);
  }

  function loadMsgs() {
    return loadJSON(MSGS_KEY, {});
  }

  function saveMsgs(msgs) {
    saveJSON(MSGS_KEY, msgs);
  }

  function loadLeaderboard() {
    return loadJSON(LEADER_KEY, {});
  }

  function saveLeaderboard(lb) {
    saveJSON(LEADER_KEY, lb);
  }

  var SUBJECTS = [
    { key: 'sat', name: 'SAT' },
    { key: 'act', name: 'ACT' },
    { key: 'ap', name: 'AP' },
    { key: 'ib', name: 'IB' },
    { key: 'alevel', name: 'A-Level' },
    { key: 'toefl', name: 'TOEFL' },
    { key: 'ielts', name: 'IELTS' },
    { key: 'igcse', name: 'IGCSE' }
  ];

  var api = {
    version: 'v1',

    SUBJECTS: SUBJECTS,

    createRoom: function(roomName, nickname) {
      var rooms = loadRooms();
      var code = genRoomCode();
      while (rooms[code]) code = genRoomCode();

      rooms[code] = {
        name: roomName || '未命名房间',
        code: code,
        createdBy: nickname || '匿名',
        createdAt: Date.now(),
        members: [nickname || '匿名'],
        subjects: []
      };
      saveRooms(rooms);

      var lb = loadLeaderboard();
      lb[code] = lb[code] || {};
      lb[code][nickname || '匿名'] = { correct: 0, total: 0, ts: Date.now() };
      saveLeaderboard(lb);

      return { code: code, name: rooms[code].name };
    },

    joinRoom: function(code, nickname) {
      var rooms = loadRooms();
      code = (code || '').toUpperCase();
      if (!rooms[code]) return null;

      var room = rooms[code];
      if (room.members.indexOf(nickname) === -1) {
        room.members.push(nickname);
        rooms[code] = room;
        saveRooms(rooms);
      }

      var lb = loadLeaderboard();
      lb[code] = lb[code] || {};
      lb[code][nickname] = lb[code][nickname] || { correct: 0, total: 0, ts: Date.now() };
      saveLeaderboard(lb);

      return room;
    },

    getRoom: function(code) {
      var rooms = loadRooms();
      return rooms[(code || '').toUpperCase()] || null;
    },

    getRoomList: function() {
      var rooms = loadRooms();
      var list = [];
      Object.keys(rooms).forEach(function(code) {
        list.push({ code: code, name: rooms[code].name, members: rooms[code].members.length });
      });
      return list.sort(function(a, b) { return b.members - a.members; });
    },

    selectSubjects: function(code, subjectKeys) {
      var rooms = loadRooms();
      code = (code || '').toUpperCase();
      if (!rooms[code]) return false;
      rooms[code].subjects = subjectKeys || [];
      saveRooms(rooms);
      return true;
    },

    sendMsg: function(code, nickname, text) {
      code = (code || '').toUpperCase();
      var msgs = loadMsgs();
      msgs[code] = msgs[code] || [];
      msgs[code].push({
        user: nickname || '匿名',
        text: text,
        ts: Date.now()
      });
      saveMsgs(msgs);
      return true;
    },

    getMsgs: function(code) {
      code = (code || '').toUpperCase();
      var msgs = loadMsgs();
      return msgs[code] || [];
    },

    recordAnswer: function(code, nickname, isCorrect) {
      code = (code || '').toUpperCase();
      var lb = loadLeaderboard();
      lb[code] = lb[code] || {};
      var user = lb[code][nickname] || { correct: 0, total: 0, ts: Date.now() };
      user.total++;
      if (isCorrect) user.correct++;
      user.ts = Date.now();
      lb[code][nickname] = user;
      saveLeaderboard(lb);
      return user;
    },

    getLeaderboard: function(code) {
      code = (code || '').toUpperCase();
      var lb = loadLeaderboard();
      var roomLb = lb[code] || {};
      var arr = [];
      Object.keys(roomLb).forEach(function(name) {
        var u = roomLb[name];
        arr.push({
          name: name,
          correct: u.correct || 0,
          total: u.total || 0,
          rate: u.total > 0 ? Math.round(u.correct / u.total * 100) : 0,
          ts: u.ts
        });
      });
      arr.sort(function(a, b) {
        if (b.correct !== a.correct) return b.correct - a.correct;
        return a.rate - b.rate;
      });
      return arr;
    },

    leaveRoom: function(code, nickname) {
      code = (code || '').toUpperCase();
      var rooms = loadRooms();
      if (!rooms[code]) return false;
      var room = rooms[code];
      room.members = room.members.filter(function(m) { return m !== nickname; });
      if (room.members.length === 0) {
        delete rooms[code];
        var msgs = loadMsgs();
        delete msgs[code];
        saveMsgs(msgs);
        var lb = loadLeaderboard();
        delete lb[code];
        saveLeaderboard(lb);
      } else {
        rooms[code] = room;
      }
      saveRooms(rooms);
      return true;
    },

    deleteRoom: function(code) {
      code = (code || '').toUpperCase();
      var rooms = loadRooms();
      delete rooms[code];
      saveRooms(rooms);
      var msgs = loadMsgs();
      delete msgs[code];
      saveMsgs(msgs);
      var lb = loadLeaderboard();
      delete lb[code];
      saveLeaderboard(lb);
    },

    clearAll: function() {
      localStorage.removeItem(ROOMS_KEY);
      localStorage.removeItem(MSGS_KEY);
      localStorage.removeItem(LEADER_KEY);
    }
  };

  window.Collab = api;
})();