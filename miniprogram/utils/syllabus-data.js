/**
 * utils/syllabus-data.js
 * 小程序版考纲数据层（v43 syllabus-data 精简适配）。
 * 8 科：sat / act / ap / ib / alevel / toefl / ielts / igcse
 */
'use strict';

const SYLLABUS = {
  sat: {
    code: 'sat',
    name: 'SAT',
    desc: 'Digital · 400-1600 · Reading & Writing + Math',
    papers: [
      { code: 'R&W', name: 'Reading & Writing', topics: [
        { code: 'CR', name: 'Craft & Structure', weight: '28%' },
        { code: 'INFO', name: 'Information & Ideas', weight: '26%' },
        { code: 'CONV', name: 'Conventions of Standard English', weight: '20%' },
        { code: 'EXP', name: 'Expression of Ideas', weight: '26%' }
      ]},
      { code: 'M', name: 'Math', topics: [
        { code: 'ALG', name: 'Algebra', weight: '35%' },
        { code: 'AAM', name: 'Advanced Math', weight: '35%' },
        { code: 'PSD', name: 'Problem Solving & Data', weight: '15%' },
        { code: 'GEO', name: 'Geometry & Trig', weight: '15%' }
      ]}
    ]
  },
  act: {
    code: 'act',
    name: 'ACT',
    desc: 'English + Math + Reading + Science · 1-36',
    papers: [
      { code: 'EN', name: 'English', topics: [
        { code: 'PROD', name: 'Production of Writing', weight: '~30%' },
        { code: 'KLA', name: 'Knowledge of Language', weight: '~25%' },
        { code: 'CW', name: 'Conventions of Standard English', weight: '~45%' }
      ]},
      { code: 'MA', name: 'Math', topics: [
        { code: 'PRE', name: 'Preparing for Higher Math', weight: '~60%' },
        { code: 'NUM', name: 'Number & Quantity', weight: '~10%' },
        { code: 'STA', name: 'Statistics & Probability', weight: '~10%' },
        { code: 'INT', name: 'Integrating Essential Skills', weight: '~20%' }
      ]},
      { code: 'RE', name: 'Reading', topics: [
        { code: 'KID', name: 'Key Ideas & Details', weight: '~52%' },
        { code: 'CS', name: 'Craft & Structure', weight: '~28%' },
        { code: 'INT', name: 'Integration of Knowledge', weight: '~20%' }
      ]},
      { code: 'SC', name: 'Science', topics: [
        { code: 'INT', name: 'Interpretation of Data', weight: '~40%' },
        { code: 'SI', name: 'Scientific Investigation', weight: '~25%' },
        { code: 'EMI', name: 'Evaluation & Models', weight: '~35%' }
      ]}
    ]
  },
  ap: {
    code: 'ap',
    name: 'AP',
    desc: '38 门科目 · 1-5 分',
    papers: [
      { code: 'CORE', name: 'Common Core', topics: [
        { code: 'BIO', name: 'Biology', weight: '—' },
        { code: 'CALC', name: 'Calculus AB/BC', weight: '—' },
        { code: 'CHEM', name: 'Chemistry', weight: '—' },
        { code: 'CS', name: 'Computer Science A', weight: '—' },
        { code: 'ENG', name: 'English Lang/Lit', weight: '—' }
      ]}
    ]
  },
  ib: {
    code: 'ib',
    name: 'IB',
    desc: '6 大学科组 · 45 分满分',
    papers: [
      { code: 'G1', name: 'Language & Literature', topics: [
        { code: 'LIT', name: 'Literature HL/SL', weight: 'HL 25% / SL 35%' }
      ]},
      { code: 'G2', name: 'Language Acquisition', topics: [
        { code: 'LANG', name: 'Language B HL/SL', weight: 'HL 25% / SL 35%' }
      ]},
      { code: 'G3', name: 'Individuals & Societies', topics: [
        { code: 'HIS', name: 'History', weight: 'HL 25% / SL 35%' },
        { code: 'ECO', name: 'Economics', weight: 'HL 30% / SL 40%' }
      ]},
      { code: 'G4', name: 'Sciences', topics: [
        { code: 'BIO', name: 'Biology', weight: 'HL 36% / SL 32%' },
        { code: 'PHY', name: 'Physics', weight: 'HL 36% / SL 32%' }
      ]},
      { code: 'G5', name: 'Mathematics', topics: [
        { code: 'MAA', name: 'Math AA HL/SL', weight: 'HL 30% / SL 40%' },
        { code: 'MAI', name: 'Math AI HL/SL', weight: 'HL 30% / SL 40%' }
      ]},
      { code: 'G6', name: 'The Arts', topics: [
        { code: 'MUS', name: 'Music', weight: 'HL 25% / SL 35%' }
      ]}
    ]
  },
  alevel: {
    code: 'alevel',
    name: 'A-Level',
    desc: 'AS + A2 · A*-E',
    papers: [
      { code: 'MATH', name: 'Mathematics', topics: [
        { code: 'P1', name: 'Pure 1', weight: '33%' },
        { code: 'P2', name: 'Pure 2', weight: '33%' },
        { code: 'MECH', name: 'Mechanics', weight: '17%' },
        { code: 'STAT', name: 'Statistics', weight: '17%' }
      ]}
    ]
  },
  toefl: {
    code: 'toefl',
    name: 'TOEFL',
    desc: 'Reading + Listening + Speaking + Writing · 0-120',
    papers: [
      { code: 'R', name: 'Reading', topics: [
        { code: 'INF', name: 'Information', weight: '—' },
        { code: 'INF2', name: 'Inference', weight: '—' },
        { code: 'VOC', name: 'Vocabulary', weight: '—' }
      ]},
      { code: 'L', name: 'Listening', topics: [
        { code: 'LEC', name: 'Lectures', weight: '—' },
        { code: 'CON', name: 'Conversations', weight: '—' }
      ]},
      { code: 'S', name: 'Speaking', topics: [
        { code: 'IND', name: 'Independent', weight: '—' },
        { code: 'INT', name: 'Integrated', weight: '—' }
      ]},
      { code: 'W', name: 'Writing', topics: [
        { code: 'INT', name: 'Integrated', weight: '—' },
        { code: 'ACAD', name: 'Academic Discussion', weight: '—' }
      ]}
    ]
  },
  ielts: {
    code: 'ielts',
    name: 'IELTS',
    desc: 'Listening + Reading + Writing + Speaking · 0-9.0',
    papers: [
      { code: 'L', name: 'Listening', topics: [
        { code: 'S1', name: 'Section 1', weight: '—' },
        { code: 'S2', name: 'Section 2', weight: '—' },
        { code: 'S3', name: 'Section 3', weight: '—' },
        { code: 'S4', name: 'Section 4', weight: '—' }
      ]}
    ]
  },
  igcse: {
    code: 'igcse',
    name: 'IGCSE',
    desc: 'Core + Extended · A*-G',
    papers: [
      { code: '0580', name: 'Mathematics 0580', topics: [
        { code: 'NUM', name: 'Number', weight: '~25%' },
        { code: 'ALG', name: 'Algebra', weight: '~30%' },
        { code: 'GEO', name: 'Geometry', weight: '~25%' },
        { code: 'STA', name: 'Statistics', weight: '~20%' }
      ]}
    ]
  }
};

function getSubject(code) { return SYLLABUS[code]; }
function listSubjects() { return Object.keys(SYLLABUS).map(k => SYLLABUS[k]); }

module.exports = {
  SYLLABUS: SYLLABUS,
  getSubject: getSubject,
  listSubjects: listSubjects
};
