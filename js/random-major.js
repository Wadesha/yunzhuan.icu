// 专业随机跳转
(function() {
    var majors = [
        "../computer/cs.html",
        "../computer/software.html",
        "../computer/ai.html",
        "../computer/data.html",
        "../computer/cyber.html",
        "../computer/info.html",
        "../computer/hci.html",
        "../engineering/electrical.html",
        "../engineering/mechanical.html",
        "../engineering/biomedical.html",
        "../engineering/civil.html",
        "../engineering/chemical.html",
        "../engineering/industrial.html",
        "../engineering/aerospace.html",
        "../business/finance.html",
        "../business/accounting.html",
        "../business/analytics.html",
        "../business/marketing.html",
        "../business/management.html",
        "../business/international.html",
        "../business/supply.html",
        "../biology/biomedical.html",
        "../biology/nursing.html",
        "../biology/molecular.html",
        "../biology/public.html",
        "../biology/neuroscience.html",
        "../biology/biochemistry.html",
        "../social/economics.html",
        "../social/psychology.html",
        "../social/political.html",
        "../social/sociology.html",
        "../social/history.html",
        "../social/anthropology.html",
        "../science/physics.html",
        "../science/chemistry.html",
        "../science/mathematics.html",
        "../science/statistics.html",
        "../science/environmental.html",
        "../arts/fine-arts.html",
        "../arts/music.html",
        "../arts/design.html",
        "../arts/communication.html",
        "../education/education.html",
        "../education/special.html",
        "../education/early.html"
    ];
    window.goRandomMajor = function() {
        var current = window.location.pathname;
        var candidates = majors.filter(function(m) {
            // 排除当前专业
            return !current.endsWith(m.replace('../', ''));
        });
        if (candidates.length === 0) candidates = majors;
        var random = candidates[Math.floor(Math.random() * candidates.length)];
        window.location.href = random;
    };
})();
