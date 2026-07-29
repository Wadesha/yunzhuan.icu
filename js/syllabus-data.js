/* ================================================================
 * syllabus-data.js v13
 * 8科结构化考纲数据层 (Structured Syllabus Data Layer)
 *
 * Schema:
 *   subject -> papers[] -> topics[] -> { code, name, weight, questionIds[], prereq[] }
 *
 * 8 科: sat / act / ap / ib / alevel / toefl / ielts / igcse
 *
 * 说明:
 *   - questionIds[] 初始为空 []，由 buildQuestionMap(subjectKey, domNodes)
 *     在页面加载时从 practice.html 的 topic-code 标签反向映射动态填充。
 *   - weight: 有明确权重的科目(SAT/ACT/IB HL/AL CIE)填百分比字符串；
 *     无明确权重(AP/TOEFL/IELTS/IGCSE)填 '—'。
 *   - prereq[]: 标注前置依赖 topic-code，无依赖填 []。
 *
 * 使用方法:
 *   var sub  = SYLLABUS_DATA.getSubject('sat');
 *   var top  = SYLLABUS_DATA.getTopic('sat', 'M-Alg-1a');
 *   var cov  = SYLLABUS_DATA.getCoverage('ib');
 *   SYLLABUS_DATA.buildQuestionMap('sat', document.querySelectorAll('.q'));
 * ================================================================ */
(function() {
  'use strict';

  var subjects = {

    // ================================================================
    // SAT (Digital SAT 2025)
    // ================================================================
    sat: {
      name: 'SAT',
      fullName: 'Digital SAT 2025',
      totalQuestions: 120,
      papers: [
        {
          name: 'Reading & Writing',
          code: 'RW',
          weight: '50%',
          topics: [
            { code: 'RW-Craft-1a', name: 'Words in Context', weight: '7%', questionIds: [], prereq: [] },
            { code: 'RW-Craft-1b', name: 'Text Structure & Purpose', weight: '7%', questionIds: [], prereq: [] },
            { code: 'RW-Craft-1c', name: 'Cross-Text Connections', weight: '7%', questionIds: [], prereq: [] },
            { code: 'RW-Craft-1d', name: 'Central Ideas & Details', weight: '7%', questionIds: [], prereq: [] },
            { code: 'RW-Info-2a', name: 'Explicit & Implicit Meaning', weight: '6.5%', questionIds: [], prereq: [] },
            { code: 'RW-Info-2b', name: 'Follow a Logical Sequence', weight: '6.5%', questionIds: [], prereq: [] },
            { code: 'RW-Info-2c', name: 'Cite Textual Evidence', weight: '6.5%', questionIds: [], prereq: [] },
            { code: 'RW-Info-2d', name: 'Dual-Part Graph + Text', weight: '6.5%', questionIds: [], prereq: [] },
            { code: 'RW-Conv-3a', name: 'Boundaries', weight: '8.7%', questionIds: [], prereq: [] },
            { code: 'RW-Conv-3b', name: 'Subordination & Coordination', weight: '8.7%', questionIds: [], prereq: [] },
            { code: 'RW-Conv-3c', name: 'Subject-Verb / Pronoun / Parallelism', weight: '8.6%', questionIds: [], prereq: [] },
            { code: 'RW-Expr-4a', name: 'Transition Words & Phrases', weight: '6.7%', questionIds: [], prereq: [] },
            { code: 'RW-Expr-4b', name: 'Rhetorical Synthesis', weight: '6.7%', questionIds: [], prereq: [] },
            { code: 'RW-Expr-4c', name: 'Adding / Deleting / Revising', weight: '6.6%', questionIds: [], prereq: [] }
          ]
        },
        {
          name: 'Math',
          code: 'M',
          weight: '50%',
          topics: [
            { code: 'M-Alg-1a', name: 'Linear equations, inequalities & systems', weight: '8.75%', questionIds: [], prereq: [] },
            { code: 'M-Alg-1b', name: 'Linear functions', weight: '8.75%', questionIds: [], prereq: ['M-Alg-1a'] },
            { code: 'M-Alg-1c', name: 'Absolute value inequalities', weight: '8.75%', questionIds: [], prereq: ['M-Alg-1a'] },
            { code: 'M-Alg-1d', name: 'Graphing linear relationships', weight: '8.75%', questionIds: [], prereq: ['M-Alg-1b'] },
            { code: 'M-Adv-2a', name: 'Nonlinear functions', weight: '8.75%', questionIds: [], prereq: [] },
            { code: 'M-Adv-2b', name: 'Polynomial operations & factoring', weight: '8.75%', questionIds: [], prereq: ['M-Adv-2a'] },
            { code: 'M-Adv-2c', name: 'Radical & Rational exponents', weight: '8.75%', questionIds: [], prereq: ['M-Adv-2a'] },
            { code: 'M-Adv-2d', name: 'Equivalent expressions / Isolating quantities', weight: '8.75%', questionIds: [], prereq: ['M-Adv-2b'] },
            { code: 'M-PSD-3a', name: 'Ratios, rates, proportions, percentages', weight: '5%', questionIds: [], prereq: [] },
            { code: 'M-PSD-3b', name: '1-variable & 2-variable data', weight: '5%', questionIds: [], prereq: [] },
            { code: 'M-PSD-3c', name: 'Probability & Inference from samples', weight: '5%', questionIds: [], prereq: ['M-PSD-3b'] },
            { code: 'M-GT-4a', name: 'Area, Volume & 2D-3D', weight: '5%', questionIds: [], prereq: [] },
            { code: 'M-GT-4b', name: 'Lines, angles, triangles, circles', weight: '5%', questionIds: [], prereq: [] },
            { code: 'M-GT-4c', name: 'Right triangle trig + Circle trig', weight: '5%', questionIds: [], prereq: ['M-GT-4b'] }
          ]
        }
      ]
    },

    // ================================================================
    // ACT
    // ================================================================
    act: {
      name: 'ACT',
      fullName: 'ACT 2025',
      totalQuestions: 120,
      papers: [
        {
          name: 'English (75q / 45min)',
          code: 'ENG',
          weight: '25%',
          topics: [
            { code: 'E-PW-11', name: 'Production of Writing: Topic dev, organization, unity, cohesion', weight: '29%', questionIds: [], prereq: [] },
            { code: 'E-KL-21', name: 'Knowledge of Language: Word choice, style, tone, concision', weight: '18%', questionIds: [], prereq: [] },
            { code: 'E-CSE-31', name: 'Conventions: Punctuation (comma, apostrophe, dash, colon)', weight: '25%', questionIds: [], prereq: [] },
            { code: 'E-CSE-32', name: 'Conventions: Grammar usage (SVA, pronoun, tense)', weight: '14%', questionIds: [], prereq: [] },
            { code: 'E-CSE-33', name: 'Conventions: Sentence structure (frag, run-on, modifier, parallelism)', weight: '14%', questionIds: [], prereq: [] }
          ]
        },
        {
          name: 'Math (60q / 60min)',
          code: 'M',
          weight: '25%',
          topics: [
            { code: 'M-PAEA-41', name: 'Pre-Algebra (number, fraction, ratio, percent)', weight: '23%', questionIds: [], prereq: [] },
            { code: 'M-PAEA-42', name: 'Elementary Algebra (polynomial, exponent, factoring)', weight: '17%', questionIds: [], prereq: ['M-PAEA-41'] },
            { code: 'M-IACG-51', name: 'Intermediate Algebra (quadratic, log, systems, functions)', weight: '15%', questionIds: [], prereq: ['M-PAEA-42'] },
            { code: 'M-IACG-52', name: 'Coordinate Geometry (slope, line, circle)', weight: '15%', questionIds: [], prereq: ['M-PAEA-42'] },
            { code: 'M-PGT-61', name: 'Plane Geometry (triangle, polygon, circle, area/volume)', weight: '23%', questionIds: [], prereq: [] },
            { code: 'M-PGT-62', name: 'Trigonometry (SOHCAHTOA, identities, special angles)', weight: '7%', questionIds: [], prereq: ['M-PGT-61'] }
          ]
        },
        {
          name: 'Reading (40q / 35min)',
          code: 'R',
          weight: '25%',
          topics: [
            { code: 'R-KID-71', name: 'Key Ideas & Details: Main idea & detail', weight: '35%', questionIds: [], prereq: [] },
            { code: 'R-KID-72', name: 'Key Ideas & Details: Cause-effect, compare, sequence', weight: '20%', questionIds: [], prereq: [] },
            { code: 'R-CS-81', name: 'Craft & Structure: Word meaning, tone, rhetoric', weight: '25%', questionIds: [], prereq: [] },
            { code: 'R-IKI-91', name: 'Integration of Knowledge & Ideas (paired-passage, evidence)', weight: '20%', questionIds: [], prereq: [] }
          ]
        },
        {
          name: 'Science (40q / 35min)',
          code: 'SCI',
          weight: '25%',
          topics: [
            { code: 'S-DR-101', name: 'Data Representation (graph, table, diagram, trend)', weight: '25%', questionIds: [], prereq: [] },
            { code: 'S-DR-102', name: 'Math-in-science (rate, proportion, unit conversion)', weight: '10%', questionIds: [], prereq: ['S-DR-101'] },
            { code: 'S-RS-111', name: 'Research Summary (hypothesis, variable, control, experiment design)', weight: '48%', questionIds: [], prereq: [] },
            { code: 'S-CV-121', name: 'Conflicting Viewpoints (compare models / scientists)', weight: '17%', questionIds: [], prereq: [] }
          ]
        }
      ]
    },

    // ================================================================
    // AP (10 热门科 CED Unit)
    // ================================================================
    ap: {
      name: 'AP',
      fullName: 'Advanced Placement (10 热门科 CED)',
      totalQuestions: 120,
      papers: [
        {
          name: 'Calculus AB/BC',
          code: 'CALC',
          weight: '—',
          topics: [
            { code: 'CALC-U11', name: 'Limits & Continuity', weight: '—', questionIds: [], prereq: [] },
            { code: 'CALC-U21', name: 'Differentiation: Definition & Fundamental Rules', weight: '—', questionIds: [], prereq: ['CALC-U11'] },
            { code: 'CALC-U31', name: 'Composite, Implicit & Inverse Differentiation', weight: '—', questionIds: [], prereq: ['CALC-U21'] },
            { code: 'CALC-U41', name: 'Contextual Applications of Differentiation', weight: '—', questionIds: [], prereq: ['CALC-U31'] },
            { code: 'CALC-U51', name: 'Analytical Applications of Differentiation', weight: '—', questionIds: [], prereq: ['CALC-U31'] },
            { code: 'CALC-U61', name: 'Integration & Accumulation of Change', weight: '—', questionIds: [], prereq: ['CALC-U21'] },
            { code: 'CALC-U71', name: 'Differential Equations', weight: '—', questionIds: [], prereq: ['CALC-U61'] },
            { code: 'CALC-U81', name: 'Applications of Integration', weight: '—', questionIds: [], prereq: ['CALC-U61'] },
            { code: 'CALC-U91', name: 'Parametric / Polar / Vector Functions (BC)', weight: '—', questionIds: [], prereq: ['CALC-U81'] },
            { code: 'CALC-U101', name: 'Infinite Sequences & Series (BC)', weight: '—', questionIds: [], prereq: ['CALC-U91'] }
          ]
        },
        {
          name: 'Statistics',
          code: 'STAT',
          weight: '—',
          topics: [
            { code: 'STAT-U11', name: 'Exploring One-Variable Data', weight: '—', questionIds: [], prereq: [] },
            { code: 'STAT-U21', name: 'Exploring Two-Variable Data', weight: '—', questionIds: [], prereq: ['STAT-U11'] },
            { code: 'STAT-U31', name: 'Collecting Data (sample / experiment)', weight: '—', questionIds: [], prereq: ['STAT-U21'] },
            { code: 'STAT-U41', name: 'Probability, Random Variables & Probability Distributions', weight: '—', questionIds: [], prereq: ['STAT-U31'] },
            { code: 'STAT-U51', name: 'Sampling Distributions', weight: '—', questionIds: [], prereq: ['STAT-U41'] },
            { code: 'STAT-U61', name: 'Inference for Categorical Data: Proportions', weight: '—', questionIds: [], prereq: ['STAT-U51'] },
            { code: 'STAT-U71', name: 'Inference for Quantitative Data: Means', weight: '—', questionIds: [], prereq: ['STAT-U61'] },
            { code: 'STAT-U81', name: 'Chi-Square Inference', weight: '—', questionIds: [], prereq: ['STAT-U71'] },
            { code: 'STAT-U91', name: 'Inference for Slopes (LSRL)', weight: '—', questionIds: [], prereq: ['STAT-U71'] }
          ]
        },
        {
          name: 'Physics C: Mechanics',
          code: 'PHYCM',
          weight: '—',
          topics: [
            { code: 'PHYCM-U11', name: 'Kinematics (1D / 2D)', weight: '—', questionIds: [], prereq: [] },
            { code: 'PHYCM-U21', name: "Newton's Laws of Motion", weight: '—', questionIds: [], prereq: ['PHYCM-U11'] },
            { code: 'PHYCM-U31', name: 'Work, Energy & Power', weight: '—', questionIds: [], prereq: ['PHYCM-U21'] },
            { code: 'PHYCM-U41', name: 'Systems of Particles & Linear Momentum', weight: '—', questionIds: [], prereq: ['PHYCM-U21'] },
            { code: 'PHYCM-U51', name: 'Rotation + Oscillation + Gravitation', weight: '—', questionIds: [], prereq: ['PHYCM-U31', 'PHYCM-U41'] }
          ]
        },
        {
          name: 'Physics C: Electricity & Magnetism',
          code: 'PHYCE',
          weight: '—',
          topics: [
            { code: 'PHYCE-U11', name: 'Electrostatics: Charge, Field, Potential', weight: '—', questionIds: [], prereq: [] },
            { code: 'PHYCE-U21', name: 'Conductors, Capacitors & Dielectrics', weight: '—', questionIds: [], prereq: ['PHYCE-U11'] },
            { code: 'PHYCE-U31', name: 'Electric Circuits (R, C, RC)', weight: '—', questionIds: [], prereq: ['PHYCE-U21'] },
            { code: 'PHYCE-U41', name: 'Magnetic Fields (force on moving charge)', weight: '—', questionIds: [], prereq: ['PHYCE-U11'] },
            { code: 'PHYCE-U51', name: 'Electromagnetism (Faraday, Inductance)', weight: '—', questionIds: [], prereq: ['PHYCE-U41'] }
          ]
        },
        {
          name: 'Chemistry',
          code: 'CHEM',
          weight: '—',
          topics: [
            { code: 'CHEM-U11', name: 'Atomic Structure & Properties', weight: '—', questionIds: [], prereq: [] },
            { code: 'CHEM-U21', name: 'Molecular & Ionic Compound Structure', weight: '—', questionIds: [], prereq: ['CHEM-U11'] },
            { code: 'CHEM-U31', name: 'Intermolecular Forces & Properties', weight: '—', questionIds: [], prereq: ['CHEM-U21'] },
            { code: 'CHEM-U41', name: 'Chemical Reactions (stoichiometry / net ionic)', weight: '—', questionIds: [], prereq: ['CHEM-U31'] },
            { code: 'CHEM-U51', name: 'Kinetics (rate law, mechanism)', weight: '—', questionIds: [], prereq: ['CHEM-U41'] },
            { code: 'CHEM-U61', name: 'Thermodynamics (ΔH, ΔS, ΔG)', weight: '—', questionIds: [], prereq: ['CHEM-U41'] },
            { code: 'CHEM-U71', name: 'Equilibrium (Kc, Kp, Le Chatelier)', weight: '—', questionIds: [], prereq: ['CHEM-U41'] },
            { code: 'CHEM-U81', name: 'Acids & Bases (pH, Ka, buffers, titration)', weight: '—', questionIds: [], prereq: ['CHEM-U71'] },
            { code: 'CHEM-U91', name: 'Applications of Thermodynamics: Electrochemistry', weight: '—', questionIds: [], prereq: ['CHEM-U81'] }
          ]
        },
        {
          name: 'Biology',
          code: 'BIO',
          weight: '—',
          topics: [
            { code: 'BIO-U11', name: 'Chemistry of Life (water, organics, enzymes)', weight: '—', questionIds: [], prereq: [] },
            { code: 'BIO-U21', name: 'Cell Structure & Function (organelles, membrane)', weight: '—', questionIds: [], prereq: ['BIO-U11'] },
            { code: 'BIO-U31', name: 'Cellular Energetics (photosynthesis, respiration)', weight: '—', questionIds: [], prereq: ['BIO-U21'] },
            { code: 'BIO-U41', name: 'Cell Communication & Cell Cycle', weight: '—', questionIds: [], prereq: ['BIO-U21'] },
            { code: 'BIO-U51', name: 'Heredity (meiosis, Mendelian & non-Mendelian)', weight: '—', questionIds: [], prereq: ['BIO-U31'] },
            { code: 'BIO-U61', name: 'Gene Expression & Regulation (central dogma)', weight: '—', questionIds: [], prereq: ['BIO-U41'] },
            { code: 'BIO-U71', name: 'Natural Selection (Hardy-Weinberg, speciation)', weight: '—', questionIds: [], prereq: ['BIO-U51'] },
            { code: 'BIO-U81', name: 'Ecology (population, community, ecosystem)', weight: '—', questionIds: [], prereq: ['BIO-U71'] }
          ]
        },
        {
          name: 'Microeconomics',
          code: 'MICRO',
          weight: '—',
          topics: [
            { code: 'MICRO-U11', name: 'Basic Economic Concepts (scarcity, PPC, trade)', weight: '—', questionIds: [], prereq: [] },
            { code: 'MICRO-U21', name: 'Supply & Demand, Elasticity, Gov Intervention', weight: '—', questionIds: [], prereq: ['MICRO-U11'] },
            { code: 'MICRO-U31', name: 'Production, Cost & Perfect Competition', weight: '—', questionIds: [], prereq: ['MICRO-U21'] },
            { code: 'MICRO-U41', name: 'Imperfect Competition (monopoly, oligopoly, game)', weight: '—', questionIds: [], prereq: ['MICRO-U31'] },
            { code: 'MICRO-U51', name: 'Factor Markets (labor MRP, monopsony)', weight: '—', questionIds: [], prereq: ['MICRO-U31'] },
            { code: 'MICRO-U61', name: 'Market Failure & Gov Role (externality, public good)', weight: '—', questionIds: [], prereq: ['MICRO-U41'] }
          ]
        },
        {
          name: 'Macroeconomics',
          code: 'MACRO',
          weight: '—',
          topics: [
            { code: 'MACRO-U11', name: 'Basic Economic Concepts', weight: '—', questionIds: [], prereq: [] },
            { code: 'MACRO-U21', name: 'Economic Indicators (GDP, CPI, unemployment)', weight: '—', questionIds: [], prereq: ['MACRO-U11'] },
            { code: 'MACRO-U31', name: 'National Income & Price Determination (AD/AS)', weight: '—', questionIds: [], prereq: ['MACRO-U21'] },
            { code: 'MACRO-U41', name: 'Financial Sector (money, banking, policy)', weight: '—', questionIds: [], prereq: ['MACRO-U31'] },
            { code: 'MACRO-U51', name: 'Long-Run Consequences of Stabilization Policies', weight: '—', questionIds: [], prereq: ['MACRO-U41'] },
            { code: 'MACRO-U61', name: 'Open Economy (BOP, exchange rate, capital flows)', weight: '—', questionIds: [], prereq: ['MACRO-U51'] }
          ]
        },
        {
          name: 'Computer Science A (Java)',
          code: 'CSA',
          weight: '—',
          topics: [
            { code: 'CSA-U11', name: 'Primitive Types (int, double, boolean, casting)', weight: '—', questionIds: [], prereq: [] },
            { code: 'CSA-U21', name: 'Using Objects (classes, methods, constructors)', weight: '—', questionIds: [], prereq: ['CSA-U11'] },
            { code: 'CSA-U31', name: 'Boolean Expressions & if/else', weight: '—', questionIds: [], prereq: ['CSA-U21'] },
            { code: 'CSA-U41', name: 'Iteration (for, while, enhanced-for, nested)', weight: '—', questionIds: [], prereq: ['CSA-U31'] },
            { code: 'CSA-U51', name: 'Writing Classes (static, this, toString)', weight: '—', questionIds: [], prereq: ['CSA-U21'] },
            { code: 'CSA-U61', name: 'Array (declare, traverse, search)', weight: '—', questionIds: [], prereq: ['CSA-U41', 'CSA-U51'] },
            { code: 'CSA-U71', name: 'ArrayList<> (add/remove/set, size)', weight: '—', questionIds: [], prereq: ['CSA-U61'] },
            { code: 'CSA-U81', name: '2D Array (nested loops, row-major)', weight: '—', questionIds: [], prereq: ['CSA-U61'] },
            { code: 'CSA-U91', name: 'Inheritance & Polymorphism (extends, super)', weight: '—', questionIds: [], prereq: ['CSA-U51'] },
            { code: 'CSA-U101', name: 'Recursion (base case, binary search, merge sort)', weight: '—', questionIds: [], prereq: ['CSA-U41'] }
          ]
        },
        {
          name: 'Psychology',
          code: 'PSY',
          weight: '—',
          topics: [
            { code: 'PSY-U11', name: 'Biological Bases (neurons, brain, consciousness)', weight: '—', questionIds: [], prereq: [] },
            { code: 'PSY-U21', name: 'Sensation & Perception', weight: '—', questionIds: [], prereq: ['PSY-U11'] },
            { code: 'PSY-U31', name: 'Learning (classical, operant, social, cognitive)', weight: '—', questionIds: [], prereq: [] },
            { code: 'PSY-U41', name: 'Cognitive (memory, thinking, language, intelligence)', weight: '—', questionIds: [], prereq: ['PSY-U21'] },
            { code: 'PSY-U51', name: 'Developmental (life span, Piaget, attachment)', weight: '—', questionIds: [], prereq: [] },
            { code: 'PSY-U61', name: 'Motivation, Emotion & Personality', weight: '—', questionIds: [], prereq: ['PSY-U41'] },
            { code: 'PSY-U71', name: 'Clinical (disorders & therapy)', weight: '—', questionIds: [], prereq: ['PSY-U51'] },
            { code: 'PSY-U81', name: 'Social Psychology (conformity, attitudes, group)', weight: '—', questionIds: [], prereq: [] }
          ]
        },
        {
          name: 'English Language & Composition',
          code: 'ENGLANG',
          weight: '—',
          topics: [
            { code: 'ENGLANG-U1', name: 'Rhetorical Analysis (ethos, pathos, logos, SOAPSTone)', weight: '—', questionIds: [], prereq: [] },
            { code: 'ENGLANG-U2', name: 'Argumentative Writing (claim, evidence, counter)', weight: '—', questionIds: [], prereq: ['ENGLANG-U1'] },
            { code: 'ENGLANG-U3', name: 'Synthesis Writing (integrate sources)', weight: '—', questionIds: [], prereq: ['ENGLANG-U2'] },
            { code: 'ENGLANG-U4', name: 'MCQ Reading: Rhetorical situation & reasoning', weight: '—', questionIds: [], prereq: ['ENGLANG-U1'] },
            { code: 'ENGLANG-U5', name: 'MCQ Writing: Word choice & sentence structure', weight: '—', questionIds: [], prereq: ['ENGLANG-U2'] }
          ]
        },
        {
          name: 'History (APUSH + World History)',
          code: 'HIST',
          weight: '—',
          topics: [
            { code: 'HIST-U1', name: 'APUSH Period 1-3: Foundations & Colonization & Revolution', weight: '—', questionIds: [], prereq: [] },
            { code: 'HIST-U2', name: 'APUSH Period 4-5: Early Republic / Expansion / Civil War', weight: '—', questionIds: [], prereq: ['HIST-U1'] },
            { code: 'HIST-U3', name: 'APUSH Period 6-7: Industrialization / Gilded Age / WW', weight: '—', questionIds: [], prereq: ['HIST-U2'] },
            { code: 'HIST-U4', name: 'APUSH Period 8: Post-WWII Cold War, Civil Rights', weight: '—', questionIds: [], prereq: ['HIST-U3'] },
            { code: 'HIST-U5', name: 'APUSH Period 9: 1980-present Globalization', weight: '—', questionIds: [], prereq: ['HIST-U4'] },
            { code: 'HIST-U6', name: 'WH Period 1-2: c.1200-1450 & 1450-1750 Global', weight: '—', questionIds: [], prereq: [] },
            { code: 'HIST-U7', name: 'WH Period 3-5: Enlightenment / Industrial / Imperial', weight: '—', questionIds: [], prereq: ['HIST-U6'] },
            { code: 'HIST-U8', name: 'WH Period 6: World Wars & Cold War', weight: '—', questionIds: [], prereq: ['HIST-U7'] },
            { code: 'HIST-U9', name: 'WH Period 7-9: Decolonization & Globalization', weight: '—', questionIds: [], prereq: ['HIST-U8'] }
          ]
        }
      ]
    },

    // ================================================================
    // IB Diploma
    // ================================================================
    ib: {
      name: 'IB',
      fullName: 'IB Diploma Programme',
      totalQuestions: 120,
      papers: [
        {
          name: 'Group 1: Language & Literature',
          code: 'G1',
          weight: '16%',
          topics: [
            { code: 'G1-Lit-11', name: 'Chinese A Lit HL: Poetry Analysis (close reading, imagery)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'G1-Lit-12', name: 'Chinese A Lit: Prose / Novel Analysis (narrative, character, theme)', weight: '20%', questionIds: [], prereq: ['G1-Lit-11'] },
            { code: 'G1-Lit-13', name: 'Chinese A Lit: Drama Analysis (staging, dialogue, tragedy/comedy)', weight: '20%', questionIds: [], prereq: ['G1-Lit-11'] },
            { code: 'G1-Lit-14', name: 'Chinese A HL: Comparative Literature (2 works across contexts)', weight: '15%', questionIds: [], prereq: ['G1-Lit-12', 'G1-Lit-13'] },
            { code: 'G1-Lit-15', name: 'Chinese A: Critical Perspectives (feminist, Marxist, post-colonial)', weight: '15%', questionIds: [], prereq: ['G1-Lit-14'] },
            { code: 'G1-LL-16', name: 'Eng A Lang&Lit SL: Text type analysis (article, speech, ad, blog)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'G1-LL-17', name: 'Eng A: Mass media texts (news, editorial, social media)', weight: '20%', questionIds: [], prereq: ['G1-LL-16'] },
            { code: 'G1-LL-18', name: 'Eng A: Language & Power / Identity / Gender', weight: '20%', questionIds: [], prereq: ['G1-LL-16'] },
            { code: 'G1-LL-19', name: 'Eng A: Literary text close reading (fiction / poetry)', weight: '20%', questionIds: [], prereq: ['G1-LL-16'] },
            { code: 'G1-LL-110', name: 'Eng A: Paper 2 comparative essay across 2 texts', weight: '15%', questionIds: [], prereq: ['G1-LL-19'] }
          ]
        },
        {
          name: 'Group 2: Language Acquisition',
          code: 'G2',
          weight: '14%',
          topics: [
            { code: 'G2-EB-21', name: 'English B HL: Listening comprehension (dialogue + lecture)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'G2-EB-22', name: 'English B: Reading (exposition, argument, story, literary)', weight: '20%', questionIds: [], prereq: ['G2-EB-21'] },
            { code: 'G2-EB-23', name: 'English B: Writing (email, opinion article, report, essay)', weight: '25%', questionIds: [], prereq: ['G2-EB-22'] },
            { code: 'G2-EB-24', name: 'English B: Individual Oral (based on 2 texts + stimulus)', weight: '20%', questionIds: [], prereq: ['G2-EB-22'] },
            { code: 'G2-EB-25', name: 'English B HL: Vocabulary + Grammar extensions (subjunctive, inversion)', weight: '20%', questionIds: [], prereq: ['G2-EB-23'] },
            { code: 'G2-CB-26', name: 'Chinese B SL: Listening comprehension', weight: '15%', questionIds: [], prereq: [] },
            { code: 'G2-CB-27', name: 'Chinese B SL: Reading comprehension', weight: '15%', questionIds: [], prereq: ['G2-CB-26'] },
            { code: 'G2-CB-28', name: 'Chinese B SL: Writing (email, diary, essay)', weight: '15%', questionIds: [], prereq: ['G2-CB-27'] }
          ]
        },
        {
          name: 'Group 3: Individuals & Societies',
          code: 'G3',
          weight: '20%',
          topics: [
            { code: 'G3-Econ-31', name: 'Econ Micro 1: Basic problem, PPC, Supply & Demand', weight: '25%', questionIds: [], prereq: [] },
            { code: 'G3-Econ-32', name: 'Econ Micro 2: Elasticities + Gov intervention (tax/subsidy)', weight: '25%', questionIds: [], prereq: ['G3-Econ-31'] },
            { code: 'G3-Econ-33', name: 'Econ Micro 3: Market failure (public good, externality)', weight: '20%', questionIds: [], prereq: ['G3-Econ-32'] },
            { code: 'G3-Econ-34', name: 'Econ Macro 1: GDP, AD-AS, inflation/unemployment', weight: '25%', questionIds: [], prereq: ['G3-Econ-31'] },
            { code: 'G3-Econ-35', name: 'Econ Macro 2: Fiscal & Monetary policy, multiplier', weight: '25%', questionIds: [], prereq: ['G3-Econ-34'] },
            { code: 'G3-Econ-36', name: 'Econ International: Exchange rate, BOP, trade, protectionism', weight: '20%', questionIds: [], prereq: ['G3-Econ-34'] },
            { code: 'G3-Econ-37', name: 'Econ Development (LDC, poverty, inequality, sustainability)', weight: '20%', questionIds: [], prereq: ['G3-Econ-36'] },
            { code: 'G3-BM-36', name: 'BM: Business organization & environment (sole/part/PLC, PEST)', weight: '15%', questionIds: [], prereq: [] },
            { code: 'G3-BM-37', name: 'BM: HRM (recruitment, motivation theories, org culture)', weight: '20%', questionIds: [], prereq: ['G3-BM-36'] },
            { code: 'G3-BM-38', name: 'BM: Marketing (STP, 4Ps, market research, product life cycle)', weight: '20%', questionIds: [], prereq: ['G3-BM-36'] },
            { code: 'G3-BM-39', name: 'BM: Finance & Accounts (3 statements, ratio: ROCE, gearing)', weight: '20%', questionIds: [], prereq: ['G3-BM-36'] },
            { code: 'G3-BM-310', name: 'BM: Operations management (production, quality, supply chain)', weight: '15%', questionIds: [], prereq: ['G3-BM-36'] },
            { code: 'G3-Hist-311', name: 'History HL: Prescribed Subject (1 doc, 10 MCQ + SAQ)', weight: '10%', questionIds: [], prereq: [] },
            { code: 'G3-Hist-312', name: 'History HL: World History Topics (Paper 2 essays)', weight: '20%', questionIds: [], prereq: ['G3-Hist-311'] },
            { code: 'G3-Hist-313', name: 'History HL: HL Option (Paper 3, 3 essays)', weight: '15%', questionIds: [], prereq: ['G3-Hist-312'] }
          ]
        },
        {
          name: 'Group 4: Sciences (Phy / Chem / Bio / CS)',
          code: 'G4',
          weight: '25%',
          topics: [
            { code: 'G4-Phy-41', name: 'Phy HL T1: Measurement + uncertainty + significant figures', weight: '10%', questionIds: [], prereq: [] },
            { code: 'G4-Phy-42', name: 'Phy HL T2: Mechanics (kinematics, forces, energy, momentum)', weight: '25%', questionIds: [], prereq: ['G4-Phy-41'] },
            { code: 'G4-Phy-43', name: 'Phy HL T3: Thermal physics (ideal gas, internal energy)', weight: '10%', questionIds: [], prereq: ['G4-Phy-42'] },
            { code: 'G4-Phy-44', name: 'Phy HL T4: Waves (SHM, interference, diffraction, Doppler)', weight: '20%', questionIds: [], prereq: ['G4-Phy-42'] },
            { code: 'G4-Phy-45', name: 'Phy HL T5: Electricity & Magnetism (Kirchhoff, Faraday, Lenz)', weight: '20%', questionIds: [], prereq: ['G4-Phy-42'] },
            { code: 'G4-Phy-46', name: 'Phy HL T6: Circular motion & Gravitation (Kepler, satellite)', weight: '10%', questionIds: [], prereq: ['G4-Phy-42'] },
            { code: 'G4-Phy-47', name: 'Phy HL T7: Atomic/Nuclear/Particle (half-life, standard model)', weight: '10%', questionIds: [], prereq: ['G4-Phy-41'] },
            { code: 'G4-Phy-48', name: 'Phy HL T8: Energy production (solar, wind, nuclear, Sankey)', weight: '10%', questionIds: [], prereq: ['G4-Phy-43'] },
            { code: 'G4-Phy-49', name: 'Phy HL Option A: Further Mechanics (torque, angular momentum)', weight: '10%', questionIds: [], prereq: ['G4-Phy-42'] },
            { code: 'G4-Phy-410', name: 'Phy HL Option B: Engineering Physics / EM Waves', weight: '10%', questionIds: [], prereq: ['G4-Phy-45'] },
            { code: 'G4-Chem-411', name: 'Chem HL T1: Stoichiometric relationships (mole, %yield, gas laws)', weight: '10%', questionIds: [], prereq: [] },
            { code: 'G4-Chem-412', name: 'Chem HL T2: Atomic structure + electron config + periodic trend', weight: '15%', questionIds: [], prereq: ['G4-Chem-411'] },
            { code: 'G4-Chem-413', name: 'Chem HL T3: Bonding & structure (ionic, covalent, VSEPR, IMF)', weight: '20%', questionIds: [], prereq: ['G4-Chem-412'] },
            { code: 'G4-Chem-414', name: 'Chem HL T4: Energetics/thermochemistry (ΔH, Hess, bond enthalpy)', weight: '18%', questionIds: [], prereq: ['G4-Chem-411'] },
            { code: 'G4-Chem-415', name: 'Chem HL T5: Chemical kinetics (collision, rate, Arrhenius)', weight: '15%', questionIds: [], prereq: ['G4-Chem-414'] },
            { code: 'G4-Chem-416', name: 'Chem HL T6: Equilibrium (Kc, Kp, Le Chatelier, ΔG°=-RTlnK)', weight: '18%', questionIds: [], prereq: ['G4-Chem-414'] },
            { code: 'G4-Chem-417', name: 'Chem HL T8: Acids & Bases (pH, Ka, buffer, titration)', weight: '20%', questionIds: [], prereq: ['G4-Chem-416'] },
            { code: 'G4-Chem-418', name: 'Chem HL T10: Organic (IUPAC, functional groups, synthesis routes)', weight: '25%', questionIds: [], prereq: ['G4-Chem-413'] },
            { code: 'G4-Chem-419', name: 'Chem HL T9: Redox (oxidation number, voltaic cell E°, electrolysis)', weight: '15%', questionIds: [], prereq: ['G4-Chem-411'] },
            { code: 'G4-Chem-420', name: 'Chem HL Option: Materials / Medicinal / Analytical (NMR/IR/MS)', weight: '10%', questionIds: [], prereq: ['G4-Chem-418'] },
            { code: 'G4-Bio-421', name: 'Bio HL T1: Cell biology (prokary/eukary, organelle, mitosis)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'G4-Bio-422', name: 'Bio HL T2: Molecular biology (water, carbs, protein, DNA, enzymes)', weight: '20%', questionIds: [], prereq: ['G4-Bio-421'] },
            { code: 'G4-Bio-423', name: 'Bio HL T3: Genetics (meiosis, Mendelian, linkage, chi-square)', weight: '22%', questionIds: [], prereq: ['G4-Bio-422'] },
            { code: 'G4-Bio-424', name: 'Bio HL T4: Ecology (species, energy pyramids, C/N cycles)', weight: '18%', questionIds: [], prereq: ['G4-Bio-421'] },
            { code: 'G4-Bio-425', name: 'Bio HL T5: Evolution & biodiversity (selection, Hardy-Weinberg)', weight: '18%', questionIds: [], prereq: ['G4-Bio-423'] },
            { code: 'G4-Bio-426', name: 'Bio HL T6: Human physiology (digest, circulatory, immune, neuro)', weight: '22%', questionIds: [], prereq: ['G4-Bio-422'] },
            { code: 'G4-Bio-427', name: 'Bio HL T7: Nucleic acids (DNA replication, epigenetics, CRISPR)', weight: '15%', questionIds: [], prereq: ['G4-Bio-422'] },
            { code: 'G4-Bio-428', name: 'Bio HL T8: Metabolism, respiration & photosynthesis (HL detail)', weight: '15%', questionIds: [], prereq: ['G4-Bio-426'] },
            { code: 'G4-Bio-429', name: 'Bio HL T9: Plant biology (xylem/phloem, transpiration, hormones)', weight: '15%', questionIds: [], prereq: ['G4-Bio-421'] },
            { code: 'G4-Bio-430', name: 'Bio HL T10: Genetics continuation + Animal physiology (HL)', weight: '10%', questionIds: [], prereq: ['G4-Bio-423'] },
            { code: 'G4-CS-431', name: 'CS SL T1: System fundamentals (lifecycle, analysis, design)', weight: '10%', questionIds: [], prereq: [] },
            { code: 'G4-CS-432', name: 'CS SL T2: Computer organization (von Neumann, logic gates, CPU)', weight: '12%', questionIds: [], prereq: ['G4-CS-431'] },
            { code: 'G4-CS-433', name: 'CS SL T3: Networks (LAN/WAN, TCP/IP, security, encryption)', weight: '10%', questionIds: [], prereq: ['G4-CS-432'] },
            { code: 'G4-CS-434', name: 'CS SL T4: Computational thinking & programming (algorithm, OOP)', weight: '15%', questionIds: [], prereq: ['G4-CS-431'] }
          ]
        },
        {
          name: 'Group 5: Mathematics (AA / AI)',
          code: 'G5',
          weight: '20%',
          topics: [
            { code: 'G5-MAA-51', name: 'Math AA HL T1: Algebra & Number (series, complex, matrices, proof)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'G5-MAA-52', name: 'Math AA HL T2: Functions (rational, exp/log, transformations)', weight: '18%', questionIds: [], prereq: ['G5-MAA-51'] },
            { code: 'G5-MAA-53', name: 'Math AA HL T3: Geometry & Trigonometry (vectors, 3D lines/planes)', weight: '22%', questionIds: [], prereq: ['G5-MAA-51'] },
            { code: 'G5-MAA-54', name: 'Math AA HL T4: Calculus (diff, int, Maclaurin/Taylor, DEq)', weight: '22%', questionIds: [], prereq: ['G5-MAA-52'] },
            { code: 'G5-MAA-55', name: 'Math AA HL T5: Statistics & Probability (Normal, hypothesis, χ²)', weight: '18%', questionIds: [], prereq: ['G5-MAA-51'] },
            { code: 'G5-MAA-56', name: 'Math AA HL Calculus Option: Series & Differential Equations', weight: '10%', questionIds: [], prereq: ['G5-MAA-54'] },
            { code: 'G5-MAI-57', name: 'Math AI SL T1: Number & Algebra (finance, sequences, loans)', weight: '15%', questionIds: [], prereq: [] },
            { code: 'G5-MAI-58', name: 'Math AI SL T2: Functions (modelling linear/quadratic/exp/log)', weight: '15%', questionIds: [], prereq: ['G5-MAI-57'] },
            { code: 'G5-MAI-59', name: 'Math AI SL T3: Geometry & Trig (3D volumes, bearings, Voronoi)', weight: '15%', questionIds: [], prereq: ['G5-MAI-57'] },
            { code: 'G5-MAI-510', name: 'Math AI SL T5: Stats/Prob (regression, Markov, χ² test)', weight: '20%', questionIds: [], prereq: ['G5-MAI-57'] }
          ]
        },
        {
          name: 'Group 6: Arts',
          code: 'G6',
          weight: '5%',
          topics: [
            { code: 'G6-VA-61', name: 'VA HL: Process Portfolio (art making, techniques, journal)', weight: '10%', questionIds: [], prereq: [] },
            { code: 'G6-VA-62', name: 'VA HL: Comparative Study (3 artists, cultural context)', weight: '10%', questionIds: [], prereq: ['G6-VA-61'] },
            { code: 'G6-VA-63', name: 'VA HL: Exhibition (curatorial statement + 8-11 works)', weight: '10%', questionIds: [], prereq: ['G6-VA-61'] },
            { code: 'G6-Mu-64', name: 'Music SL: Performance (solo/ensemble) + Creating', weight: '10%', questionIds: [], prereq: [] },
            { code: 'G6-Mu-65', name: 'Music: Listening & Theory (musical elements, score analysis)', weight: '10%', questionIds: [], prereq: ['G6-Mu-64'] },
            { code: 'G6-Mu-66', name: 'Music: Contemporary & World music context', weight: '8%', questionIds: [], prereq: ['G6-Mu-65'] }
          ]
        },
        {
          name: 'Core: TOK + EE + CAS',
          code: 'COR',
          weight: '2%',
          topics: [
            { code: 'COR-TOK-01', name: 'TOK: Knowledge Framework (8 AOKs + 5 WOKs)', weight: '10%', questionIds: [], prereq: [] },
            { code: 'COR-TOK-02', name: 'TOK Essay (PT→KQ→RLE/Counter, 1600 words)', weight: '10%', questionIds: [], prereq: ['COR-TOK-01'] },
            { code: 'COR-TOK-03', name: 'TOK Exhibition (3 objects + IA prompt commentary)', weight: '10%', questionIds: [], prereq: ['COR-TOK-01'] },
            { code: 'COR-EE-02', name: 'EE: 5-step research flow + criteria A-F (4000 words)', weight: '10%', questionIds: [], prereq: [] },
            { code: 'COR-CAS-03', name: 'CAS: 5 Learning Outcomes + 18 months 3 phases', weight: '10%', questionIds: [], prereq: [] }
          ]
        }
      ]
    },

    // ================================================================
    // A-Level (CIE 9708 / 9702 / 9701 / 9700 / 9709 通用)
    // ================================================================
    alevel: {
      name: 'A-Level',
      fullName: 'A-Level (5科 AS + A2, CIE/Edexcel 通用)',
      totalQuestions: 120,
      papers: [
        {
          name: 'Mathematics (Pure / Mechanics / Statistics)',
          code: 'M',
          weight: '30%',
          topics: [
            { code: 'M-P1-11', name: 'P1: Algebra (indices/surds/Remainder-Factor theorem)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'M-P1-12', name: 'P1: Quadratics (completing square/discriminant/inequalities)', weight: '20%', questionIds: [], prereq: ['M-P1-11'] },
            { code: 'M-P1-13', name: 'P1: Inequalities (linear, quadratic, |ax+b|<k)', weight: '10%', questionIds: [], prereq: ['M-P1-12'] },
            { code: 'M-P1-14', name: 'P1: Coordinate geometry (line, circle, tangent)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'M-P1-15', name: 'P1: Trigonometry basic (sin/cos/tan, exact values)', weight: '12%', questionIds: [], prereq: [] },
            { code: 'M-P1-16', name: 'P1: Differentiation (power rule, tangent/normal, max/min)', weight: '18%', questionIds: [], prereq: ['M-P1-12'] },
            { code: 'M-P1-17', name: 'P1: Integration (reverse power, area under curve)', weight: '15%', questionIds: [], prereq: ['M-P1-16'] },
            { code: 'M-P2-21', name: 'P2: Exponentials & logarithms (e^x, ln x, modelling)', weight: '18%', questionIds: [], prereq: ['M-P1-11'] },
            { code: 'M-P2-22', name: 'P2: Binomial expansion (1+x)^n for any rational n', weight: '12%', questionIds: [], prereq: ['M-P1-11'] },
            { code: 'M-P2-23', name: 'P2: Trigonometry (double/half angle, Rsin(x+α), identities)', weight: '18%', questionIds: [], prereq: ['M-P1-15'] },
            { code: 'M-P2-24', name: 'P2: Differentiation 2 (chain/product/quotient, e^x/ln/trig)', weight: '15%', questionIds: [], prereq: ['M-P1-16', 'M-P2-21'] },
            { code: 'M-P2-25', name: 'P2: Integration 2 (1/x, e^x, u-substitution, trapezium)', weight: '15%', questionIds: [], prereq: ['M-P1-17', 'M-P2-24'] },
            { code: 'M-P2-26', name: 'P2: Numerical methods (iteration x_{n+1}=g(x_n))', weight: '10%', questionIds: [], prereq: ['M-P1-12'] },
            { code: 'M-P3-31', name: 'P3: Algebraic fractions + partial fractions', weight: '15%', questionIds: [], prereq: ['M-P2-21'] },
            { code: 'M-P3-32', name: 'P3: Functions (domain/range, composite, inverse, modulus)', weight: '18%', questionIds: [], prereq: ['M-P2-21'] },
            { code: 'M-P3-33', name: 'P3: Series (arith/geom sum + binomial general)', weight: '10%', questionIds: [], prereq: ['M-P2-22'] },
            { code: 'M-P3-34', name: 'P3: Parametric / Polar basics (circles/ellipses, dy/dx)', weight: '10%', questionIds: [], prereq: ['M-P2-24'] },
            { code: 'M-P3-35', name: 'P3: Further calculus (implicit, by parts, partial fractions, volumes)', weight: '20%', questionIds: [], prereq: ['M-P2-25'] },
            { code: 'M-P3-36', name: 'P3: 3D Vectors (dot/cross, line/plane equation, angle)', weight: '20%', questionIds: [], prereq: ['M-P1-14'] },
            { code: 'M-P4-41', name: 'P4: Matrices (determinant, inverse, linear transformations)', weight: '18%', questionIds: [], prereq: ['M-P3-36'] },
            { code: 'M-P4-42', name: 'P4: Complex numbers (Argand, polar, De Moivre, nth roots)', weight: '18%', questionIds: [], prereq: ['M-P3-32'] },
            { code: 'M-P4-43', name: 'P4: Polar coordinates (sketch, area enclosed, symmetry)', weight: '10%', questionIds: [], prereq: ['M-P3-34'] },
            { code: 'M-P4-44', name: 'P4: Differential Equations (separable, integrating factor, 2nd order)', weight: '18%', questionIds: [], prereq: ['M-P3-35'] },
            { code: 'M-P4-45', name: 'P4: Numerical Methods (Newton-Raphson, Simpson, Euler)', weight: '10%', questionIds: [], prereq: ['M-P2-26'] },
            { code: 'M-Mech-51', name: 'M1: Kinematics (SUVAT, v-t/s-t graphs, projectile)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'M-Mech-52', name: "M1: Forces & Newton's laws (F=ma, inclined plane, pulley)", weight: '20%', questionIds: [], prereq: ['M-Mech-51'] },
            { code: 'M-Mech-53', name: 'M1: Equilibrium + friction (μ, limiting) + moments', weight: '18%', questionIds: [], prereq: ['M-Mech-52'] },
            { code: 'M-Mech-54', name: 'M1: Momentum & Impulse (I=Δp, conservation)', weight: '12%', questionIds: [], prereq: ['M-Mech-52'] },
            { code: 'M-Mech-55', name: 'M1: Work, Energy & Power (GPE, KE, P=Fv)', weight: '18%', questionIds: [], prereq: ['M-Mech-52'] },
            { code: 'M-Mech-56', name: 'M2: Projectiles (range, greatest height, trajectory)', weight: '12%', questionIds: [], prereq: ['M-Mech-51'] },
            { code: 'M-Mech-57', name: 'M2: Centre of Mass (lamina, composite, toppling)', weight: '12%', questionIds: [], prereq: ['M-Mech-53'] },
            { code: 'M-Stat-61', name: 'S1: Representing data (mean/median/SD, PMCC, coding)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'M-Stat-62', name: 'S1: Probability (Venn, conditional P(A|B), tree)', weight: '20%', questionIds: [], prereq: [] },
            { code: 'M-Stat-63', name: 'S1: Discrete random variables (Binomial, E(X), Var(X))', weight: '18%', questionIds: [], prereq: ['M-Stat-62'] },
            { code: 'M-Stat-64', name: 'S1: Normal distribution (Z~N(0,1), inverse normal)', weight: '18%', questionIds: [], prereq: ['M-Stat-63'] },
            { code: 'M-Stat-65', name: 'S2: Poisson distribution P(λ), approximation', weight: '12%', questionIds: [], prereq: ['M-Stat-63'] },
            { code: 'M-Stat-66', name: 'S2: Continuous distributions (Uniform, Normal approx)', weight: '12%', questionIds: [], prereq: ['M-Stat-64'] },
            { code: 'M-Stat-67', name: 'S2: Sampling, Estimation, Confidence intervals', weight: '12%', questionIds: [], prereq: ['M-Stat-64'] }
          ]
        },
        {
          name: 'Physics (9702)',
          code: 'P',
          weight: '18%',
          topics: [
            { code: 'P-AS-11', name: 'AS P1: Physical quantities, units, uncertainty, homogeneity', weight: '10%', questionIds: [], prereq: [] },
            { code: 'P-AS-12', name: 'AS P1/2: Kinematics (suvat, graphs, free fall)', weight: '18%', questionIds: [], prereq: ['P-AS-11'] },
            { code: 'P-AS-13', name: 'AS: Dynamics (Newton 1-3, momentum, impulse, equilibrium)', weight: '20%', questionIds: [], prereq: ['P-AS-12'] },
            { code: 'P-AS-14', name: 'AS: Forces, Density, Pressure, Hooke, Young modulus, energy', weight: '22%', questionIds: [], prereq: ['P-AS-13'] },
            { code: 'P-AS-15', name: 'AS: Materials - bulk properties, phase change, stress-strain', weight: '10%', questionIds: [], prereq: ['P-AS-14'] },
            { code: 'P-AS-16', name: 'AS: Waves (superposition, stationary, interference, diffraction, TIR)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'P-AS-17', name: 'AS: Electricity (Ohm, Kirchhoff, resistivity, potential divider)', weight: '22%', questionIds: [], prereq: [] },
            { code: 'P-A2-21', name: 'A2: Motion in a circle (ω, centripetal force, banked)', weight: '12%', questionIds: [], prereq: ['P-AS-12'] },
            { code: 'P-A2-22', name: 'A2: Gravitational field (F=GMm/r², potential, Kepler, satellite)', weight: '15%', questionIds: [], prereq: ['P-A2-21'] },
            { code: 'P-A2-23', name: 'A2: Oscillations (SHM a=-ω²x, energy, resonance, damping)', weight: '18%', questionIds: [], prereq: ['P-AS-16'] },
            { code: 'P-A2-24', name: 'A2: Ideal gases (pV=nRT, kinetic theory, <KE>∝T)', weight: '15%', questionIds: [], prereq: ['P-AS-15'] },
            { code: 'P-A2-25', name: 'A2: Capacitors (C=Q/V, RC, τ=RC, energy ½QV)', weight: '18%', questionIds: [], prereq: ['P-AS-17'] },
            { code: 'P-A2-26', name: 'A2: Magnetic fields & EM induction (F=BIL, Faraday, Lenz)', weight: '22%', questionIds: [], prereq: ['P-AS-17'] },
            { code: 'P-A2-27', name: 'A2: Modern/Quantum (photoelectric, de Broglie, nuclear, fission/fusion)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'P-A2-28', name: 'A2 P5: Planning, Analysis & Evaluation (practical)', weight: '10%', questionIds: [], prereq: ['P-AS-11'] }
          ]
        },
        {
          name: 'Chemistry (9701)',
          code: 'C',
          weight: '18%',
          topics: [
            { code: 'C-AS-11', name: 'AS T1: Atomic structure + electron config + ionisation energy', weight: '12%', questionIds: [], prereq: [] },
            { code: 'C-AS-12', name: 'AS T2: Bonding & structure (ionic/covalent/metallic, VSEPR, IMF)', weight: '22%', questionIds: [], prereq: ['C-AS-11'] },
            { code: 'C-AS-13', name: 'AS T3: Stoichiometry (mole, empirical formula, titration, gas)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'C-AS-14', name: 'AS T4: Periodic Table periodicity (G1/G17/Period 3)', weight: '20%', questionIds: [], prereq: ['C-AS-11'] },
            { code: 'C-AS-15', name: 'AS T5: Chemical energetics (ΔH, Hess, bond enthalpy, calorimetry)', weight: '16%', questionIds: [], prereq: ['C-AS-13'] },
            { code: 'C-AS-16', name: 'AS T6: Electrochemistry/Redox (oxidation number, voltaic, electrolysis)', weight: '18%', questionIds: [], prereq: ['C-AS-13'] },
            { code: 'C-AS-17', name: 'AS T7: Equilibria (Le Chatelier, Kc, Haber/Contact process)', weight: '14%', questionIds: [], prereq: ['C-AS-15'] },
            { code: 'C-AS-18', name: 'AS T8: Reaction Kinetics (collision, Maxwell-Boltzmann, catalyst)', weight: '16%', questionIds: [], prereq: ['C-AS-15'] },
            { code: 'C-AS-19', name: 'AS T9: Organic basics (IUPAC, isomers, SN1/SN2, addition, polymers)', weight: '24%', questionIds: [], prereq: ['C-AS-12'] },
            { code: 'C-A2-21', name: 'A2: Electrochemistry advanced (E°, Nernst, Faraday, electrolysis)', weight: '18%', questionIds: [], prereq: ['C-AS-16'] },
            { code: 'C-A2-22', name: 'A2: Acids & Bases (Ka, pKa, buffer, Henderson, titration curves, Ksp)', weight: '25%', questionIds: [], prereq: ['C-AS-17'] },
            { code: 'C-A2-23', name: 'A2: Lattice energy & Thermodynamics (Born-Haber, ΔS, ΔG=ΔH-TΔS)', weight: '20%', questionIds: [], prereq: ['C-AS-15'] },
            { code: 'C-A2-24', name: 'A2: Kinetics advanced (rate equation, order, Arrhenius, mechanism)', weight: '18%', questionIds: [], prereq: ['C-AS-18'] },
            { code: 'C-A2-25', name: 'A2: Transition Metals (d-block, complex, crystal field, Kstab, catalysis)', weight: '20%', questionIds: [], prereq: ['C-AS-11'] },
            { code: 'C-A2-26', name: 'A2: Organic advanced (aromatic, carbonyl, acyl chlorides, amines, IR/NMR/MS)', weight: '28%', questionIds: [], prereq: ['C-AS-19'] }
          ]
        },
        {
          name: 'Biology (9700)',
          code: 'B',
          weight: '18%',
          topics: [
            { code: 'B-AS-11', name: 'AS T1: Cell structure (microscopy, organelles, prokaryote vs eukaryote)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'B-AS-12', name: 'AS T2: Biological molecules (water, carbs, lipids, proteins, food tests)', weight: '25%', questionIds: [], prereq: ['B-AS-11'] },
            { code: 'B-AS-13', name: 'AS T3: Enzymes (active site, factors, competitive/non-competitive)', weight: '20%', questionIds: [], prereq: ['B-AS-12'] },
            { code: 'B-AS-14', name: 'AS T4: Cell membranes & transport (fluid mosaic, osmosis, active)', weight: '20%', questionIds: [], prereq: ['B-AS-11'] },
            { code: 'B-AS-15', name: 'AS T5: Mitotic cell cycle (PMAT, cytokinesis, stem cells)', weight: '16%', questionIds: [], prereq: ['B-AS-11'] },
            { code: 'B-AS-16', name: 'AS T6: Nucleic acids & protein synthesis (DNA, transcription, translation)', weight: '20%', questionIds: [], prereq: ['B-AS-12'] },
            { code: 'B-AS-17', name: 'AS T7: Transport in plants & animals (heart, vessels, xylem, phloem)', weight: '22%', questionIds: [], prereq: ['B-AS-14'] },
            { code: 'B-AS-18', name: 'AS T8: Gas exchange, infectious disease & immunity (vaccination, HIV)', weight: '25%', questionIds: [], prereq: ['B-AS-13'] },
            { code: 'B-A2-21', name: 'A2 T9: Photosynthesis & Respiration (LDR/Calvin, glycolysis/Krebs/ETC)', weight: '25%', questionIds: [], prereq: ['B-AS-12'] },
            { code: 'B-A2-22', name: 'A2 T10: Homeostasis, nervous & endocrine, excretion (nephron, ADH)', weight: '30%', questionIds: [], prereq: ['B-AS-17'] },
            { code: 'B-A2-23', name: 'A2 T11: Coordination & response, sensory receptors, muscle, plant', weight: '25%', questionIds: [], prereq: ['B-A2-22'] },
            { code: 'B-A2-24', name: 'A2 T12: Inheritance, classification & evolution (meiosis, Hardy-Weinberg)', weight: '28%', questionIds: [], prereq: ['B-AS-16'] },
            { code: 'B-A2-25', name: 'A2 T13: Genetic engineering (PCR, restriction, CRISPR, vectors, GMO)', weight: '25%', questionIds: [], prereq: ['B-A2-24'] },
            { code: 'B-A2-26', name: 'A2 T14: Biotechnology (mAbs, ELISA, qPCR, fermentation, ethics)', weight: '20%', questionIds: [], prereq: ['B-A2-25'] }
          ]
        },
        {
          name: 'Economics (9708)',
          code: 'E',
          weight: '16%',
          topics: [
            { code: 'E-AS-11', name: 'AS: Basic economic problem & resource allocation (scarcity, PPC, trade)', weight: '18%', questionIds: [], prereq: [] },
            { code: 'E-AS-12', name: 'AS: Price system - Demand, Supply, Elasticities, Gov intervention', weight: '25%', questionIds: [], prereq: ['E-AS-11'] },
            { code: 'E-AS-13', name: 'AS: Market failure & externalities (public good, Pigouvian tax)', weight: '20%', questionIds: [], prereq: ['E-AS-12'] },
            { code: 'E-AS-14', name: 'AS: Macro indicators - GDP, inflation, unemployment, BOP', weight: '22%', questionIds: [], prereq: ['E-AS-11'] },
            { code: 'E-AS-15', name: 'AS: Macro policy objectives & instruments (fiscal/monetary)', weight: '20%', questionIds: [], prereq: ['E-AS-14'] },
            { code: 'E-AS-16', name: 'AS: Economic growth, productivity & sustainable development', weight: '15%', questionIds: [], prereq: ['E-AS-14'] },
            { code: 'E-A2-21', name: 'A2: Theory of the Firm (cost curves, market structures, pricing)', weight: '20%', questionIds: [], prereq: ['E-AS-12'] },
            { code: 'E-A2-22', name: 'A2: Labour market (demand/supply of labour, wage, monopsony, unions)', weight: '15%', questionIds: [], prereq: ['E-A2-21'] },
            { code: 'E-A2-23', name: 'A2: International trade (comparative advantage, WTO, protectionism)', weight: '15%', questionIds: [], prereq: ['E-AS-14'] },
            { code: 'E-A2-24', name: 'A2: Exchange rates & Balance of Payments (floating/fixed, correction)', weight: '15%', questionIds: [], prereq: ['E-A2-23'] },
            { code: 'E-A2-25', name: 'A2: Macroeconomic policy (Phillips curve, inflation targeting, conflicts)', weight: '15%', questionIds: [], prereq: ['E-AS-15'] },
            { code: 'E-A2-26', name: 'A2: Economic growth & development (HDI, MDG/SDG, poverty, inequality)', weight: '12%', questionIds: [], prereq: ['E-AS-16'] },
            { code: 'E-A2-27', name: 'A2: Financial sector (money supply, interest rate, credit, central bank)', weight: '12%', questionIds: [], prereq: ['E-AS-15'] },
            { code: 'E-A2-28', name: 'A2: Globalisation & trade liberalisation (MNC/FDI, trade blocs, GVC)', weight: '12%', questionIds: [], prereq: ['E-A2-23'] }
          ]
        }
      ]
    },

    // ================================================================
    // TOEFL iBT
    // ================================================================
    toefl: {
      name: 'TOEFL',
      fullName: 'TOEFL iBT',
      totalQuestions: 120,
      papers: [
        {
          name: 'Reading (35min · 2 passages × 10q)',
          code: 'RD',
          weight: '—',
          topics: [
            { code: 'RD-1a', name: 'Factual Information', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-1b', name: 'Negative Factual Information', weight: '—', questionIds: [], prereq: ['RD-1a'] },
            { code: 'RD-1c', name: 'Inference', weight: '—', questionIds: [], prereq: ['RD-1a'] },
            { code: 'RD-1d', name: 'Rhetorical Purpose', weight: '—', questionIds: [], prereq: ['RD-1c'] },
            { code: 'RD-1e', name: 'Vocabulary', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-1f', name: 'Reference', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-1g', name: 'Sentence Simplification', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-1h', name: 'Insert Text', weight: '—', questionIds: [], prereq: ['RD-1g'] },
            { code: 'RD-1i', name: 'Prose Summary', weight: '—', questionIds: [], prereq: ['RD-1a', 'RD-1d'] },
            { code: 'RD-1j', name: 'Fill in a Table', weight: '—', questionIds: [], prereq: ['RD-1i'] },
            { code: 'RD-TOP-1k', name: 'Art (passage topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-TOP-1l', name: 'History (passage topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-TOP-1m', name: 'Social Science (passage topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-TOP-1n', name: 'Life Science (passage topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'RD-TOP-1o', name: 'Physical Science (passage topic)', weight: '—', questionIds: [], prereq: [] }
          ]
        },
        {
          name: 'Listening (36min · 3 lectures × 6q + 2 conv × 5q)',
          code: 'L',
          weight: '—',
          topics: [
            { code: 'L-2a', name: 'Gist-Content / Gist-Purpose', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-2b', name: 'Detail', weight: '—', questionIds: [], prereq: ['L-2a'] },
            { code: 'L-2c', name: 'Function of What Is Said', weight: '—', questionIds: [], prereq: ['L-2b'] },
            { code: 'L-2d', name: "Speaker's Attitude", weight: '—', questionIds: [], prereq: ['L-2c'] },
            { code: 'L-2e', name: 'Organization', weight: '—', questionIds: [], prereq: ['L-2b'] },
            { code: 'L-2f', name: 'Connecting Content', weight: '—', questionIds: [], prereq: ['L-2b'] },
            { code: 'L-2g', name: 'Making Inferences', weight: '—', questionIds: [], prereq: ['L-2c'] },
            { code: 'L-TOP-2h', name: 'Arts (lecture topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2i', name: 'Life Science (lecture topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2j', name: 'Physical Science (lecture topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2k', name: 'Social Science (lecture topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2l', name: 'History (lecture topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2m', name: 'Environmental (lecture topic)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2n', name: 'Office Hours (conversation scenario)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-TOP-2o', name: 'Service Encounters (conversation scenario)', weight: '—', questionIds: [], prereq: [] }
          ]
        },
        {
          name: 'Speaking (16min · 4 Tasks)',
          code: 'SPK',
          weight: '—',
          topics: [
            { code: 'SPK-3a', name: 'Task 1: Independent Speaking (prep 15s · speak 45s)', weight: '—', questionIds: [], prereq: [] },
            { code: 'SPK-3b', name: 'Task 2: Integrated - Campus Announcement', weight: '—', questionIds: [], prereq: ['SPK-3a'] },
            { code: 'SPK-3c', name: 'Task 3: Integrated - Academic Concept', weight: '—', questionIds: [], prereq: ['SPK-3b'] },
            { code: 'SPK-3d', name: 'Task 4: Integrated - Academic Lecture', weight: '—', questionIds: [], prereq: ['SPK-3c'] }
          ]
        },
        {
          name: 'Writing',
          code: 'WR',
          weight: '—',
          topics: [
            { code: 'WR-4a', name: 'Integrated Writing (read + listen → write 20min)', weight: '—', questionIds: [], prereq: [] },
            { code: 'WR-4b', name: 'Academic Discussion Writing (10min)', weight: '—', questionIds: [], prereq: ['WR-4a'] }
          ]
        }
      ]
    },

    // ================================================================
    // IELTS Academic
    // ================================================================
    ielts: {
      name: 'IELTS',
      fullName: 'IELTS Academic',
      totalQuestions: 120,
      papers: [
        {
          name: 'Listening (30min + 10min · 4 Sections × 40q)',
          code: 'L',
          weight: '—',
          topics: [
            { code: 'L-1a', name: 'Form / Note / Table / Flow-chart / Summary Completion', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-1b', name: 'Multiple Choice (single / multiple)', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-1c', name: 'Matching', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-1d', name: 'Plan / Map / Diagram Labelling', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-1e', name: 'Sentence Completion', weight: '—', questionIds: [], prereq: ['L-1a'] },
            { code: 'L-1f', name: 'Short-answer Questions', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-SC-1x', name: 'Section 1 & 2: Social / Everyday Contexts', weight: '—', questionIds: [], prereq: [] },
            { code: 'L-AC-1y', name: 'Section 3 & 4: Academic / Training Contexts', weight: '—', questionIds: [], prereq: ['L-SC-1x'] }
          ]
        },
        {
          name: 'Reading Academic (60min · 3 passages × 40q)',
          code: 'R',
          weight: '—',
          topics: [
            { code: 'R-2a', name: 'Multiple Choice', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2b', name: 'True / False / Not Given (事实判断)', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2c', name: 'Yes / No / Not Given (作者观点)', weight: '—', questionIds: [], prereq: ['R-2b'] },
            { code: 'R-2d', name: 'Matching Headings (段落主旨匹配)', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2e', name: 'Matching Information (细节定位·乱序)', weight: '—', questionIds: [], prereq: ['R-2d'] },
            { code: 'R-2f', name: 'Matching Features (人物观点匹配)', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2g', name: 'Matching Sentence Endings', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2h', name: 'Sentence / Summary / Note / Table / Flow-chart Completion', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2i', name: 'Diagram Label Completion', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2j', name: 'Short-answer Questions', weight: '—', questionIds: [], prereq: [] },
            { code: 'R-2k', name: 'Multiple Choice (multi-select)', weight: '—', questionIds: [], prereq: ['R-2a'] }
          ]
        },
        {
          name: 'Writing Academic (60min · Task 1 + Task 2)',
          code: 'W',
          weight: '—',
          topics: [
            { code: 'W-3a', name: 'Task 1: Line Graph (曲线图)', weight: '—', questionIds: [], prereq: [] },
            { code: 'W-3b', name: 'Task 1: Bar Chart (柱状图)', weight: '—', questionIds: [], prereq: ['W-3a'] },
            { code: 'W-3c', name: 'Task 1: Pie Chart (饼图)', weight: '—', questionIds: [], prereq: ['W-3a'] },
            { code: 'W-3d', name: 'Task 1: Table (表格)', weight: '—', questionIds: [], prereq: ['W-3a'] },
            { code: 'W-3e', name: 'Task 1: Process Diagram (流程图)', weight: '—', questionIds: [], prereq: [] },
            { code: 'W-3f', name: 'Task 1: Map (地理变迁图)', weight: '—', questionIds: [], prereq: [] },
            { code: 'W-4a', name: 'Task 2: Opinion 题型', weight: '—', questionIds: [], prereq: [] },
            { code: 'W-4b', name: 'Task 2: Discussion 题型', weight: '—', questionIds: [], prereq: ['W-4a'] },
            { code: 'W-4c', name: 'Task 2: Problem-Solution 题型', weight: '—', questionIds: [], prereq: ['W-4a'] },
            { code: 'W-4d', name: 'Task 2: Two-part / Direct Questions 题型', weight: '—', questionIds: [], prereq: ['W-4a'] }
          ]
        },
        {
          name: 'Speaking (11-14min · 3 Parts · 面对面)',
          code: 'S',
          weight: '—',
          topics: [
            { code: 'S-5a', name: 'Part 1: Intro & Interview (日常话题)', weight: '—', questionIds: [], prereq: [] },
            { code: 'S-5b', name: 'Part 2: Long Turn / Cue Card (1-2 min talk)', weight: '—', questionIds: [], prereq: ['S-5a'] },
            { code: 'S-5c', name: 'Part 3: Two-way Discussion (抽象延伸)', weight: '—', questionIds: [], prereq: ['S-5b'] },
            { code: 'S-6a', name: '评分: Fluency & Coherence (F)', weight: '—', questionIds: [], prereq: [] },
            { code: 'S-6b', name: '评分: Lexical Resource (LR)', weight: '—', questionIds: [], prereq: [] },
            { code: 'S-6c', name: '评分: Grammar Range & Accuracy (GRA)', weight: '—', questionIds: [], prereq: [] },
            { code: 'S-6d', name: '评分: Pronunciation (Pron)', weight: '—', questionIds: [], prereq: [] }
          ]
        }
      ]
    },

    // ================================================================
    // IGCSE (CAIE 0580 / 0625 / 0620 / 0610 / 0455)
    // ================================================================
    igcse: {
      name: 'IGCSE',
      fullName: 'IGCSE (CAIE 0580/0625/0620/0610/0455)',
      totalQuestions: 120,
      papers: [
        {
          name: 'Mathematics (0580 · Core / Extended)',
          code: 'MAT',
          weight: '—',
          topics: [
            { code: 'MAT-N-1x', name: 'Number', weight: '—', questionIds: [], prereq: [] },
            { code: 'MAT-AG-2x', name: 'Algebra & Graphs', weight: '—', questionIds: [], prereq: ['MAT-N-1x'] },
            { code: 'MAT-CG-3x', name: 'Coordinate Geometry', weight: '—', questionIds: [], prereq: ['MAT-AG-2x'] },
            { code: 'MAT-Geo-4x', name: 'Geometry', weight: '—', questionIds: [], prereq: [] },
            { code: 'MAT-Mens-5x', name: 'Mensuration', weight: '—', questionIds: [], prereq: ['MAT-Geo-4x'] },
            { code: 'MAT-Trig-6x', name: 'Trigonometry', weight: '—', questionIds: [], prereq: ['MAT-Geo-4x'] },
            { code: 'MAT-Prob-7x', name: 'Probability', weight: '—', questionIds: [], prereq: ['MAT-N-1x'] },
            { code: 'MAT-Stat-8x', name: 'Statistics', weight: '—', questionIds: [], prereq: ['MAT-Prob-7x'] },
            { code: 'MAT-Ext-9x', name: 'Extended-only (vectors, transformation matrices, calculus basics)', weight: '—', questionIds: [], prereq: ['MAT-AG-2x', 'MAT-Geo-4x'] }
          ]
        },
        {
          name: 'Physics (0625 · Core / Extended)',
          code: 'PHY',
          weight: '—',
          topics: [
            { code: 'PHY-GP-1x', name: 'General Physics (Measurement, Kinematics, Forces, Energy, Matter)', weight: '—', questionIds: [], prereq: [] },
            { code: 'PHY-Wv-2x', name: 'Waves, Light, EM Spectrum & Sound', weight: '—', questionIds: [], prereq: ['PHY-GP-1x'] },
            { code: 'PHY-EM-3x', name: 'Electricity & Magnetism', weight: '—', questionIds: [], prereq: ['PHY-GP-1x'] },
            { code: 'PHY-TNS-4x', name: 'Thermal Physics, Nuclear Physics & Space', weight: '—', questionIds: [], prereq: ['PHY-GP-1x'] }
          ]
        },
        {
          name: 'Chemistry (0620 · Core / Extended)',
          code: 'CHEM',
          weight: '—',
          topics: [
            { code: 'CHEM-PC-1x', name: 'Physical Chemistry (states, bonding, stoichiometry, energy, rates, equilibria, redox, acids)', weight: '—', questionIds: [], prereq: [] },
            { code: 'CHEM-INorg-2x', name: 'Inorganic Chemistry (Periodic Table, G1/G2/G7, transition metals, N, S, metallurgy)', weight: '—', questionIds: [], prereq: ['CHEM-PC-1x'] },
            { code: 'CHEM-Org-3x', name: 'Organic Chemistry (alkane/alkene/alcohol/acid/ester/halogenoalkane, polymers, fuels)', weight: '—', questionIds: [], prereq: ['CHEM-PC-1x'] },
            { code: 'CHEM-An-4x', name: 'Analytical Chemistry (qualitative & quantitative analysis)', weight: '—', questionIds: [], prereq: ['CHEM-PC-1x'] }
          ]
        },
        {
          name: 'Biology (0610 · Core / Extended)',
          code: 'BIO',
          weight: '—',
          topics: [
            { code: 'BIO-CBM-1x', name: 'Cells & Biological Molecules (cell structure, transport, enzymes)', weight: '—', questionIds: [], prereq: [] },
            { code: 'BIO-Plnt-2x', name: 'Plant Physiology (photosynthesis, transport, coordination)', weight: '—', questionIds: [], prereq: ['BIO-CBM-1x'] },
            { code: 'BIO-Hum-3x', name: 'Animal / Human Physiology (nutrition, gas exchange, circulation, immunity)', weight: '—', questionIds: [], prereq: ['BIO-CBM-1x'] },
            { code: 'BIO-RIE-4x', name: 'Reroduction, Inheritance & Ecology (selection, evolution, environment)', weight: '—', questionIds: [], prereq: ['BIO-CBM-1x'] }
          ]
        },
        {
          name: 'Economics (0455)',
          code: 'ECON',
          weight: '—',
          topics: [
            { code: 'ECON-Mic-1x', name: 'Microeconomics: The Price System (demand, supply, market failure)', weight: '—', questionIds: [], prereq: [] },
            { code: 'ECON-Mac-2x', name: 'Macroeconomics (GDP, inflation, unemployment, BOP, policies)', weight: '—', questionIds: [], prereq: ['ECON-Mic-1x'] },
            { code: 'ECON-Intl-3x', name: 'International Trade & Globalisation (comparative advantage, tariff, WTO)', weight: '—', questionIds: [], prereq: ['ECON-Mac-2x'] },
            { code: 'ECON-Dev-4x', name: 'Economic Development vs Growth (LDC, poverty, inequality, sustainability)', weight: '—', questionIds: [], prereq: ['ECON-Mac-2x'] }
          ]
        }
      ]
    }
  };

  // ================================================================
  // API
  // ================================================================

  // 内部辅助：遍历某科目所有 topics，回调 (topic, paper)
  function eachTopic(subjectKey, fn) {
    var sub = subjects[subjectKey];
    if (!sub) return;
    sub.papers.forEach(function(paper) {
      paper.topics.forEach(function(topic) {
        fn(topic, paper);
      });
    });
  }

  // 内部辅助：按 topicCode 建立 { code -> topic } 映射
  function buildCodeMap(subjectKey) {
    var map = {};
    eachTopic(subjectKey, function(topic) {
      map[topic.code] = topic;
    });
    return map;
  }

  var api = {
    version: 'v13',
    lastUpdated: '2026-07-29',
    subjects: subjects,

    /**
     * 获取整科数据
     * @param {string} subjectKey - sat/act/ap/ib/alevel/toefl/ielts/igcse
     * @returns {object|null}
     */
    getSubject: function(subjectKey) {
      return subjects[subjectKey] || null;
    },

    /**
     * 按 topic-code 获取单个 topic
     * @param {string} subjectKey
     * @param {string} topicCode
     * @returns {object|null} topic 对象
     */
    getTopic: function(subjectKey, topicCode) {
      var found = null;
      eachTopic(subjectKey, function(topic) {
        if (topic.code === topicCode) found = topic;
      });
      return found;
    },

    /**
     * 获取某 paper 下所有 topics
     * @param {string} subjectKey
     * @param {string} paperCode
     * @returns {Array} topics 数组（空则返回 []）
     */
    getTopicsByPaper: function(subjectKey, paperCode) {
      var sub = subjects[subjectKey];
      if (!sub) return [];
      for (var i = 0; i < sub.papers.length; i++) {
        if (sub.papers[i].code === paperCode) return sub.papers[i].topics;
      }
      return [];
    },

    /**
     * 反查 questionId 所属 topic
     * @param {string} subjectKey
     * @param {string} questionId - 如 'q-1'
     * @returns {object|null} topic 对象（含 questionId）
     */
    getQuestionTopic: function(subjectKey, questionId) {
      var found = null;
      eachTopic(subjectKey, function(topic) {
        if (topic.questionIds && topic.questionIds.indexOf(questionId) !== -1) found = topic;
      });
      return found;
    },

    /**
     * 获取某 topic 的全部 questionIds
     * @param {string} subjectKey
     * @param {string} topicCode
     * @returns {Array}
     */
    getTopicQuestions: function(subjectKey, topicCode) {
      var t = this.getTopic(subjectKey, topicCode);
      return t ? (t.questionIds || []) : [];
    },

    /**
     * 获取某科目每个 topic 的题数覆盖情况
     * @param {string} subjectKey
     * @returns {object} { topicCode: questionCount, ... }
     */
    getCoverage: function(subjectKey) {
      var cov = {};
      eachTopic(subjectKey, function(topic) {
        cov[topic.code] = (topic.questionIds && topic.questionIds.length) || 0;
      });
      return cov;
    },

    /**
     * 获取某科目所有 topic-code 列表
     * @param {string} subjectKey
     * @returns {Array<string>}
     */
    getAllTopicCodes: function(subjectKey) {
      var codes = [];
      eachTopic(subjectKey, function(topic) {
        codes.push(topic.code);
      });
      return codes;
    },

    /**
     * 从 DOM 元素数组反向映射 questionIds（解析每题的 topic-code 标签）。
     *
     * 解析优先级：
     *   1. 元素 data-topic-code / data-topic 属性
     *   2. 子元素 .q-num / .q-topic 文本中 【code】 括号内容
     *   3. 子元素 [data-topic-code] 属性
     *
     * qid 优先级：元素 id > data-qid > 'q-' + (index+1)
     *
     * @param {string} subjectKey
     * @param {NodeList|Array} questions - .q DOM 元素集合
     * @returns {object} { topicCode: topic } 已填充 questionIds 的 topic 映射
     */
    buildQuestionMap: function(subjectKey, questions) {
      var sub = subjects[subjectKey];
      if (!sub) return {};

      // 重置所有 questionIds
      sub.papers.forEach(function(paper) {
        paper.topics.forEach(function(t) {
          t.questionIds = [];
        });
      });

      var codeMap = buildCodeMap(subjectKey);

      // 兼容 NodeList 与 Array
      var nodes = questions;
      if (nodes && typeof nodes.length === 'number' && !Array.isArray(nodes)) {
        nodes = Array.prototype.slice.call(nodes);
      }
      if (!Array.isArray(nodes)) nodes = [];

      nodes.forEach(function(el, i) {
        if (!el) return;

        // 解析 qid
        var qid = '';
        if (el.id) {
          qid = el.id;
        } else if (el.getAttribute && el.getAttribute('data-qid')) {
          qid = el.getAttribute('data-qid');
        } else {
          qid = 'q-' + (i + 1);
        }

        // 解析 topic-code
        var code = '';
        if (el.getAttribute) {
          code = el.getAttribute('data-topic-code') || el.getAttribute('data-topic') || '';
        }

        if (!code && el.querySelector) {
          // 方式2：.q-num / .q-topic 文本中的 【...】
          var qNum = el.querySelector('.q-num, .q-topic, .topic-code');
          if (qNum) {
            var txt = qNum.textContent || qNum.innerText || '';
            var m = txt.match(/[\u3010\u3011\u3008\u3009【】]([A-Za-z0-9][A-Za-z0-9-]*)[\u3010\u3011\u3008\u3009【】]/);
            if (m) {
              code = m[1];
            } else {
              // 兜底：尝试匹配形如 "topic=XXX" 或裸 code（含连字符且全大写字母开头）
              var m2 = txt.match(/topic=([A-Za-z0-9-]+)/);
              if (m2) code = m2[1];
            }
          }
          // 方式3：子元素 data-topic-code 属性
          if (!code) {
            var holder = el.querySelector('[data-topic-code]');
            if (holder) code = holder.getAttribute('data-topic-code');
          }
        }

        if (code && codeMap[code]) {
          codeMap[code].questionIds.push(qid);
        }
      });

      return codeMap;
    }
  };

  // 挂载到全局
  window.SYLLABUS_DATA = api;
})();
