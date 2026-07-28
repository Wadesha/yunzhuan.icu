// Global shared data layer for Dashboard / Tracker / Learning Path
// All pages read/write through this unified API
const APP_KEY = 'yunzhuan_app_data_v2';

const DEFAULT_DATA = {
    profile: {
        name: '',
        grade: 11,
        targetMajor: 'cs',
        targetSchools: ['Harvard', 'MIT', 'Stanford'],
        gpa: 3.8,
        sat: 1450,
        act: 34,
        toefl: 110,
        ielts: 7.5,
        duolingo: 130
    },
    schools: [
        { name: 'Harvard', type: 'RE', deadline: '2026-01-01', stage: 'preparing', essays: { total: 3, done: 1 }, progress: 60, result: 'pending' },
        { name: 'MIT', type: 'EA', deadline: '2025-11-01', stage: 'submitted', essays: { total: 5, done: 5 }, progress: 100, result: 'pending' },
        { name: 'Stanford', type: 'RD', deadline: '2026-01-05', stage: 'preparing', essays: { total: 3, done: 0 }, progress: 20, result: 'pending' },
        { name: 'UPenn', type: 'ED', deadline: '2025-11-01', stage: 'interview', essays: { total: 2, done: 2 }, progress: 85, result: 'pending' },
        { name: 'Columbia', type: 'RD', deadline: '2026-01-01', stage: 'researching', essays: { total: 4, done: 0 }, progress: 5, result: 'pending' },
        { name: 'UChicago', type: 'EA', deadline: '2025-11-01', stage: 'decision', essays: { total: 3, done: 3 }, progress: 100, result: 'admitted' },
        { name: 'Duke', type: 'RD', deadline: '2026-01-03', stage: 'preparing', essays: { total: 2, done: 1 }, progress: 50, result: 'pending' },
        { name: 'Northwestern', type: 'RD', deadline: '2026-01-02', stage: 'researching', essays: { total: 2, done: 0 }, progress: 10, result: 'pending' },
        { name: 'Johns Hopkins', type: 'RD', deadline: '2026-01-01', stage: 'submitted', essays: { total: 3, done: 3 }, progress: 100, result: 'pending' },
        { name: 'Cornell', type: 'RD', deadline: '2026-01-02', stage: 'preparing', essays: { total: 2, done: 0 }, progress: 30, result: 'pending' }
    ],
    favorites: {
        majors: ['cs', 'finance', 'mechanical-engineering'],
        schools: ['harvard', 'mit', 'stanford', 'columbia'],
        competitions: ['usaco', 'amc', 'himcm'],
        essays: ['common-app-1'],
        guides: ['application-timeline']
    },
    checklist: {},
    pathProgress: {
        cs: { grade9: [], grade10: [], grade11: [], grade12: [] },
        finance: { grade9: [], grade10: [], grade11: [], grade12: [] }
    },
    deadlines: [
        { name: 'Harvard ED', date: '2025-11-01', type: 'application', notified: false },
        { name: 'MIT EA', date: '2025-11-01', type: 'application', notified: false },
        { name: 'Stanford RD', date: '2026-01-05', type: 'application', notified: false },
        { name: 'SAT Registration (Oct)', date: '2025-09-20', type: 'test', notified: false },
        { name: 'CSS Profile', date: '2025-11-15', type: 'financial', notified: false },
        { name: 'FAFSA', date: '2025-10-01', type: 'financial', notified: false },
        { name: 'Recommendation Request', date: '2025-10-15', type: 'document', notified: false }
    ],
    role: 'student',
    version: 'v21.0'
};

const AppData = {
    load() {
        try {
            const raw = localStorage.getItem(APP_KEY);
            if (!raw) return structuredClone(DEFAULT_DATA);
            const data = JSON.parse(raw);
            // Merge with defaults for new fields
            return { ...structuredClone(DEFAULT_DATA), ...data };
        } catch (e) {
            console.warn('AppData load failed, using defaults', e);
            return structuredClone(DEFAULT_DATA);
        }
    },

    save(data) {
        try {
            localStorage.setItem(APP_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('AppData save failed', e);
        }
    },

    get(key) {
        return this.load()[key];
    },

    set(key, value) {
        const data = this.load();
        data[key] = value;
        this.save(data);
    },

    // Profile helpers
    getProfile() { return this.load().profile; },
    setProfile(profile) { this.set('profile', { ...this.getProfile(), ...profile }); },

    // Schools helpers
    getSchools() { return this.load().schools; },
    setSchools(schools) { this.set('schools', schools); },
    updateSchool(name, updates) {
        const schools = this.getSchools();
        const idx = schools.findIndex(s => s.name === name);
        if (idx >= 0) {
            schools[idx] = { ...schools[idx], ...updates };
            this.setSchools(schools);
        }
    },

    // Checklist helpers
    getChecklist() { return this.load().checklist; },
    toggleCheck(id) {
        const data = this.load();
        data.checklist[id] = !data.checklist[id];
        this.save(data);
        return data.checklist[id];
    },

    // Path progress helpers
    getPathProgress(major) {
        const data = this.load();
        return data.pathProgress[major] || { grade9: [], grade10: [], grade11: [], grade12: [] };
    },
    togglePathCheck(major, grade, index) {
        const data = this.load();
        if (!data.pathProgress[major]) data.pathProgress[major] = { grade9: [], grade10: [], grade11: [], grade12: [] };
        const arr = data.pathProgress[major][grade] || [];
        const pos = arr.indexOf(index);
        if (pos >= 0) arr.splice(pos, 1);
        else arr.push(index);
        data.pathProgress[major][grade] = arr;
        this.save(data);
    },

    // Deadlines helpers
    getDeadlines() { return this.load().deadlines; },
    addDeadline(item) {
        const data = this.load();
        data.deadlines.push(item);
        this.save(data);
    },

    // Role helpers
    getRole() { return this.load().role; },
    setRole(role) { this.set('role', role); },

    // Reset
    reset() {
        localStorage.removeItem(APP_KEY);
        return structuredClone(DEFAULT_DATA);
    },

    // Export/Import
    exportJSON() { return JSON.stringify(this.load(), null, 2); },
    importJSON(json) {
        try {
            const data = JSON.parse(json);
            this.save(data);
            return true;
        } catch (e) {
            return false;
        }
    }
};

// Backward compatibility: migrate old keys
(function migrate() {
    const oldDash = localStorage.getItem('yunzhuan_dashboard_v1');
    const oldPath = localStorage.getItem('learningPath_checks_v1');
    const oldTracker = localStorage.getItem('appTrackerSchools_v1');
    if (oldDash && !localStorage.getItem(APP_KEY)) {
        try {
            const dash = JSON.parse(oldDash);
            const data = AppData.load();
            if (dash.scores) {
                data.profile.sat = dash.scores.sat || data.profile.sat;
                data.profile.act = dash.scores.act || data.profile.act;
                data.profile.toefl = dash.scores.toefl || data.profile.toefl;
                data.profile.ielts = dash.scores.ielts || data.profile.ielts;
            }
            if (dash.checklist) data.checklist = dash.checklist;
            AppData.save(data);
        } catch (e) {}
    }
})();

window.AppData = AppData;
