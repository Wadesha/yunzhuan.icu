(function() {
  'use strict';

  var STORAGE_KEY = 'study_notes';
  var HIGHLIGHT_KEY = 'study_highlights';

  function loadNotes() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveNotes(notes) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {}
  }

  function loadHighlights() {
    try {
      var data = localStorage.getItem(HIGHLIGHT_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveHighlights(highlights) {
    try {
      localStorage.setItem(HIGHLIGHT_KEY, JSON.stringify(highlights));
    } catch (e) {}
  }

  window.Notes = {
    addNote: function(qid, text, subject) {
      var notes = loadNotes();
      var key = (subject || 'general') + ':' + qid;
      notes[key] = {
        qid: qid,
        subject: subject || 'general',
        text: text,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      saveNotes(notes);
      return notes[key];
    },
    getNote: function(qid, subject) {
      var notes = loadNotes();
      var key = (subject || 'general') + ':' + qid;
      return notes[key] || null;
    },
    getNotes: function(subject) {
      var notes = loadNotes();
      if (subject) {
        var result = {};
        Object.keys(notes).forEach(function(key) {
          if (notes[key].subject === subject) {
            result[key] = notes[key];
          }
        });
        return result;
      }
      return notes;
    },
    getAllSubjects: function() {
      var notes = loadNotes();
      var subjects = {};
      Object.keys(notes).forEach(function(key) {
        var s = notes[key].subject;
        if (!subjects[s]) subjects[s] = [];
        subjects[s].push(notes[key]);
      });
      return subjects;
    },
    deleteNote: function(qid, subject) {
      var notes = loadNotes();
      var key = (subject || 'general') + ':' + qid;
      delete notes[key];
      saveNotes(notes);
    },
    highlight: function(qid, text) {
      var highlights = loadHighlights();
      highlights[qid] = {
        qid: qid,
        text: text,
        createdAt: Date.now()
      };
      saveHighlights(highlights);
      return highlights[qid];
    },
    getHighlight: function(qid) {
      var highlights = loadHighlights();
      return highlights[qid] || null;
    },
    removeHighlight: function(qid) {
      var highlights = loadHighlights();
      delete highlights[qid];
      saveHighlights(highlights);
    },
    export: function() {
      var data = {
        notes: loadNotes(),
        highlights: loadHighlights(),
        exportedAt: new Date().toISOString()
      };
      return JSON.stringify(data, null, 2);
    },
    import: function(jsonString) {
      try {
        var data = JSON.parse(jsonString);
        if (data.notes) saveNotes(data.notes);
        if (data.highlights) saveHighlights(data.highlights);
        return true;
      } catch (e) {
        return false;
      }
    },
    clear: function() {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(HIGHLIGHT_KEY);
    }
  };

})();