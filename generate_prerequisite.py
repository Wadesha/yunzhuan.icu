import os

BASE_DIR = '/workspace/prerequisite'

MAJORS_DATA = {
    'computer': {
        'name': '计算机类',
        'en_name': 'Computer',
        'count': 7,
        'majors': [
            {'id': 'cs', 'cn': '计算机科学', 'en': 'Computer Science'},
            {'id': 'software', 'cn': '软件工程', 'en': 'Software Engineering'},
            {'id': 'ai', 'cn': '人工智能', 'en': 'Artificial Intelligence'},
            {'id': 'data', 'cn': '数据科学', 'en': 'Data Science'},
            {'id': 'cyber', 'cn': '网络安全', 'en': 'Cybersecurity'},
            {'id': 'info', 'cn': '信息系统', 'en': 'Information Systems'},
            {'id': 'hci', 'cn': '人机交互', 'en': 'Human-Computer Interaction'},
        ],
        'prereq_courses': [
            {'id': 'math-algebra', 'cn': '代数基础', 'en': 'Algebra Fundamentals'},
            {'id': 'math-calc1', 'cn': '微积分I', 'en': 'Calculus I'},
            {'id': 'math-discrete', 'cn': '离散数学入门', 'en': 'Intro to Discrete Math'},
            {'id': 'physics-mech', 'cn': '力学基础', 'en': 'Mechanics Fundamentals'},
            {'id': 'prog-basic', 'cn': '编程入门', 'en': 'Programming Basics'},
            {'id': 'logic-reason', 'cn': '逻辑推理', 'en': 'Logical Reasoning'},
            {'id': 'digital-literacy', 'cn': '数字素养', 'en': 'Digital Literacy'},
        ]
    },
    'engineering': {
        'name': '工程类',
        'en_name': 'Engineering',
        'count': 7,
        'majors': [
            {'id': 'electrical', 'cn': '电气工程', 'en': 'Electrical Engineering'},
            {'id': 'mechanical', 'cn': '机械工程', 'en': 'Mechanical Engineering'},
            {'id': 'biomedical', 'cn': '生物医学工程', 'en': 'Biomedical Engineering'},
            {'id': 'civil', 'cn': '土木工程', 'en': 'Civil Engineering'},
            {'id': 'chemical', 'cn': '化学工程', 'en': 'Chemical Engineering'},
            {'id': 'industrial', 'cn': '工业工程', 'en': 'Industrial Engineering'},
            {'id': 'aerospace', 'cn': '航空航天工程', 'en': 'Aerospace Engineering'},
        ],
        'prereq_courses': [
            {'id': 'math-algebra', 'cn': '代数基础', 'en': 'Algebra Fundamentals'},
            {'id': 'math-calc1', 'cn': '微积分I', 'en': 'Calculus I'},
            {'id': 'math-calc2', 'cn': '微积分II', 'en': 'Calculus II'},
            {'id': 'physics-mech', 'cn': '力学基础', 'en': 'Mechanics Fundamentals'},
            {'id': 'physics-em', 'cn': '电磁学', 'en': 'Electromagnetism'},
            {'id': 'chem-general', 'cn': '普通化学', 'en': 'General Chemistry'},
            {'id': 'eng-graphics', 'cn': '工程制图', 'en': 'Engineering Graphics'},
        ]
    },
    'business': {
        'name': '商科类',
        'en_name': 'Business',
        'count': 7,
        'majors': [
            {'id': 'finance', 'cn': '金融学', 'en': 'Finance'},
            {'id': 'accounting', 'cn': '会计学', 'en': 'Accounting'},
            {'id': 'analytics', 'cn': '商业分析', 'en': 'Business Analytics'},
            {'id': 'marketing', 'cn': '市场营销', 'en': 'Marketing'},
            {'id': 'management', 'cn': '管理学', 'en': 'Management'},
            {'id': 'international', 'cn': '国际商务', 'en': 'International Business'},
            {'id': 'supply', 'cn': '供应链管理', 'en': 'Supply Chain Management'},
        ],
        'prereq_courses': [
            {'id': 'math-algebra', 'cn': '代数基础', 'en': 'Algebra Fundamentals'},
            {'id': 'math-stat', 'cn': '统计学入门', 'en': 'Intro to Statistics'},
            {'id': 'econ-principles', 'cn': '经济学原理', 'en': 'Principles of Economics'},
            {'id': 'acct-basic', 'cn': '会计学基础', 'en': 'Accounting Basics'},
            {'id': 'business-law', 'cn': '商法入门', 'en': 'Business Law Intro'},
            {'id': 'info-tech', 'cn': '信息技术基础', 'en': 'IT Fundamentals'},
            {'id': 'communication', 'cn': '商务沟通', 'en': 'Business Communication'},
        ]
    },
    'biology': {
        'name': '生物与健康类',
        'en_name': 'Biology & Health',
        'count': 6,
        'majors': [
            {'id': 'biomedical', 'cn': '生物医学科学', 'en': 'Biomedical Sciences'},
            {'id': 'nursing', 'cn': '护理学', 'en': 'Nursing'},
            {'id': 'molecular', 'cn': '分子生物学', 'en': 'Molecular Biology'},
            {'id': 'public', 'cn': '公共卫生', 'en': 'Public Health'},
            {'id': 'neuroscience', 'cn': '神经科学', 'en': 'Neuroscience'},
            {'id': 'biochemistry', 'cn': '生物化学', 'en': 'Biochemistry'},
        ],
        'prereq_courses': [
            {'id': 'math-algebra', 'cn': '代数基础', 'en': 'Algebra Fundamentals'},
            {'id': 'math-stat', 'cn': '统计学入门', 'en': 'Intro to Statistics'},
            {'id': 'chem-general', 'cn': '普通化学', 'en': 'General Chemistry'},
            {'id': 'chem-organic', 'cn': '有机化学入门', 'en': 'Intro to Organic Chemistry'},
            {'id': 'bio-general', 'cn': '普通生物学', 'en': 'General Biology'},
            {'id': 'physics-mech', 'cn': '力学基础', 'en': 'Mechanics Fundamentals'},
            {'id': 'lab-tech', 'cn': '实验室技术', 'en': 'Lab Techniques'},
        ]
    },
    'social': {
        'name': '社会科学类',
        'en_name': 'Social Sciences',
        'count': 6,
        'majors': [
            {'id': 'economics', 'cn': '经济学', 'en': 'Economics'},
            {'id': 'psychology', 'cn': '心理学', 'en': 'Psychology'},
            {'id': 'political', 'cn': '政治学', 'en': 'Political Science'},
            {'id': 'sociology', 'cn': '社会学', 'en': 'Sociology'},
            {'id': 'history', 'cn': '历史学', 'en': 'History'},
            {'id': 'anthropology', 'cn': '人类学', 'en': 'Anthropology'},
        ],
        'prereq_courses': [
            {'id': 'math-algebra', 'cn': '代数基础', 'en': 'Algebra Fundamentals'},
            {'id': 'math-stat', 'cn': '统计学入门', 'en': 'Intro to Statistics'},
            {'id': 'history-world', 'cn': '世界历史', 'en': 'World History'},
            {'id': 'econ-principles', 'cn': '经济学原理', 'en': 'Principles of Economics'},
            {'id': 'research-methods', 'cn': '研究方法', 'en': 'Research Methods'},
            {'id': 'writing-academic', 'cn': '学术写作', 'en': 'Academic Writing'},
            {'id': 'critical-thinking', 'cn': '批判性思维', 'en': 'Critical Thinking'},
        ]
    },
    'science': {
        'name': '自然科学类',
        'en_name': 'Natural Sciences',
        'count': 4,
        'majors': [
            {'id': 'physics', 'cn': '物理学', 'en': 'Physics'},
            {'id': 'chemistry', 'cn': '化学', 'en': 'Chemistry'},
            {'id': 'mathematics', 'cn': '数学', 'en': 'Mathematics'},
            {'id': 'environmental', 'cn': '环境科学', 'en': 'Environmental Science'},
        ],
        'prereq_courses': [
            {'id': 'math-algebra', 'cn': '代数基础', 'en': 'Algebra Fundamentals'},
            {'id': 'math-calc1', 'cn': '微积分I', 'en': 'Calculus I'},
            {'id': 'math-calc2', 'cn': '微积分II', 'en': 'Calculus II'},
            {'id': 'physics-mech', 'cn': '力学基础', 'en': 'Mechanics Fundamentals'},
            {'id': 'chem-general', 'cn': '普通化学', 'en': 'General Chemistry'},
            {'id': 'bio-general', 'cn': '普通生物学', 'en': 'General Biology'},
            {'id': 'lab-tech', 'cn': '实验室技术', 'en': 'Lab Techniques'},
        ]
    },
    'arts': {
        'name': '艺术类',
        'en_name': 'Arts',
        'count': 4,
        'majors': [
            {'id': 'fine-arts', 'cn': '艺术', 'en': 'Fine Arts'},
            {'id': 'music', 'cn': '音乐', 'en': 'Music'},
            {'id': 'design', 'cn': '设计', 'en': 'Design'},
            {'id': 'communication', 'cn': '传媒', 'en': 'Communication'},
        ],
        'prereq_courses': [
            {'id': 'art-history', 'cn': '艺术史', 'en': 'Art History'},
            {'id': 'drawing-basic', 'cn': '绘画基础', 'en': 'Drawing Basics'},
            {'id': 'design-principles', 'cn': '设计原理', 'en': 'Design Principles'},
            {'id': 'color-theory', 'cn': '色彩理论', 'en': 'Color Theory'},
            {'id': 'writing-academic', 'cn': '学术写作', 'en': 'Academic Writing'},
            {'id': 'digital-tools', 'cn': '数字工具', 'en': 'Digital Tools'},
            {'id': 'communication', 'cn': '沟通技巧', 'en': 'Communication Skills'},
        ]
    },
    'education': {
        'name': '教育类',
        'en_name': 'Education',
        'count': 3,
        'majors': [
            {'id': 'education', 'cn': '教育学', 'en': 'Education'},
            {'id': 'special', 'cn': '特殊教育', 'en': 'Special Education'},
            {'id': 'early', 'cn': '幼儿教育', 'en': 'Early Childhood Education'},
        ],
        'prereq_courses': [
            {'id': 'psych-general', 'cn': '普通心理学', 'en': 'General Psychology'},
            {'id': 'child-dev', 'cn': '儿童发展', 'en': 'Child Development'},
            {'id': 'education-history', 'cn': '教育史', 'en': 'Education History'},
            {'id': 'learning-theory', 'cn': '学习理论', 'en': 'Learning Theory'},
            {'id': 'writing-academic', 'cn': '学术写作', 'en': 'Academic Writing'},
            {'id': 'classroom-mgmt', 'cn': '课堂管理', 'en': 'Classroom Management'},
            {'id': 'diversity', 'cn': '多元文化教育', 'en': 'Multicultural Education'},
        ]
    },
}

COURSE_DETAILS = {
    'math-algebra': {
        'cn': '代数基础',
        'en': 'Algebra Fundamentals',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '代数是数学的基础分支，学习变量、方程式、不等式、函数、多项式等核心概念。掌握代数运算规则和方程求解方法，为后续的微积分、线性代数等高等数学课程打下坚实基础。',
        'desc_en': 'Algebra is the foundation of mathematics, covering variables, equations, inequalities, functions, polynomials, and other core concepts. Master algebraic operations and equation-solving methods to prepare for advanced math courses.',
        'demo_cn': '举个例子，用代数方法解决一个实际问题：假设你每月存200美元，已经存了500美元，要存到2500美元需要多少个月？设x为月数，则500 + 200x = 2500，解得x = 10。这就是代数的基本应用。',
        'demo_en': 'Example: You save $200/month with $500 already saved. How many months to reach $2500? Let x = months, then 500 + 200x = 2500, solving gives x = 10. This demonstrates basic algebra application.',
    },
    'math-calc1': {
        'cn': '微积分I',
        'en': 'Calculus I',
        'credits': '4',
        'term': '第1学期',
        'desc_cn': '微积分是高等数学的核心，学习极限、导数、积分等概念。掌握求导法则、微分应用、不定积分和定积分计算，培养用微积分思维分析变化率和累积量的能力。',
        'desc_en': 'Calculus is the core of advanced mathematics, covering limits, derivatives, and integrals. Master differentiation rules, differential applications, and integral calculations to analyze rates of change and accumulation.',
        'demo_cn': '比如计算一辆汽车的瞬时速度：如果位置函数是s(t) = t² + 3t，那么速度就是导数v(t) = s\'(t) = 2t + 3。当t=5秒时，瞬时速度就是13米/秒。这就是导数的物理意义。',
        'demo_en': 'Example: Calculate instantaneous velocity of a car. If position function is s(t) = t² + 3t, velocity is the derivative v(t) = 2t + 3. At t=5s, velocity is 13 m/s. This illustrates the physical meaning of derivatives.',
    },
    'math-calc2': {
        'cn': '微积分II',
        'en': 'Calculus II',
        'credits': '4',
        'term': '第2学期',
        'desc_cn': '微积分II深入学习定积分的应用、级数、向量和多元函数微积分。掌握积分在几何和物理中的应用，以及级数收敛性判断和泰勒级数展开。',
        'desc_en': 'Calculus II covers applications of definite integrals, series, vectors, and multivariable calculus. Master integral applications in geometry and physics, series convergence, and Taylor series expansion.',
        'demo_cn': '用定积分计算一个曲边梯形的面积：函数y = x²在区间[0, 2]上的积分就是∫₀²x²dx = [x³/3]₀² = 8/3。这个值就是曲线下方的面积，体现了积分的几何意义。',
        'demo_en': 'Calculate area under a curve: The integral of y = x² from 0 to 2 is ∫₀²x²dx = 8/3. This value represents the area under the curve, demonstrating the geometric meaning of integration.',
    },
    'math-discrete': {
        'cn': '离散数学入门',
        'en': 'Intro to Discrete Math',
        'credits': '3',
        'term': '第2学期',
        'desc_cn': '离散数学研究离散对象的数学结构，包括集合论、逻辑、图论、组合数学等。培养逻辑推理和抽象思维能力，为计算机科学和算法设计奠定数学基础。',
        'desc_en': 'Discrete mathematics studies mathematical structures of discrete objects, including set theory, logic, graph theory, and combinatorics. Develop logical reasoning and abstract thinking for computer science.',
        'demo_cn': '用图论分析社交网络：每个人是一个节点，朋友关系是边。我们可以计算节点的度数来衡量一个人的社交活跃程度，或者找最短路径来计算两个人之间的"六度分隔"。',
        'demo_en': 'Analyze social networks using graph theory: People are nodes, friendships are edges. Calculate node degree to measure social activity, or find shortest paths to analyze "six degrees of separation".',
    },
    'math-stat': {
        'cn': '统计学入门',
        'en': 'Intro to Statistics',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '统计学研究数据的收集、整理、分析和解释。学习描述统计、概率分布、假设检验、回归分析等方法，培养用数据说话的能力。',
        'desc_en': 'Statistics studies data collection, organization, analysis, and interpretation. Learn descriptive statistics, probability distributions, hypothesis testing, and regression analysis.',
        'demo_cn': '分析考试成绩数据：计算平均分、标准差来描述整体水平和离散程度，用直方图展示成绩分布，通过假设检验判断两个班级的成绩是否存在显著差异。',
        'demo_en': 'Analyze exam scores: Calculate mean and standard deviation to describe overall performance and dispersion, use histograms to show score distribution, and test for significant differences between classes.',
    },
    'physics-mech': {
        'cn': '力学基础',
        'en': 'Mechanics Fundamentals',
        'credits': '4',
        'term': '第1学期',
        'desc_cn': '力学研究物体的运动规律和受力分析。学习牛顿运动定律、动量守恒、能量守恒等基本原理，掌握用数学方法描述物理现象的能力。',
        'desc_en': 'Mechanics studies motion and force analysis. Learn Newton\'s laws, momentum conservation, energy conservation, and mathematical descriptions of physical phenomena.',
        'demo_cn': '分析抛体运动：一个球以30度角、20米/秒的速度抛出，计算它能飞多远。用牛顿第二定律分解速度，结合运动学公式可以算出水平射程约35.3米。',
        'demo_en': 'Analyze projectile motion: A ball is thrown at 30° with 20 m/s velocity. Calculate horizontal range using Newton\'s laws and kinematic equations. Result: approximately 35.3 meters.',
    },
    'physics-em': {
        'cn': '电磁学',
        'en': 'Electromagnetism',
        'credits': '4',
        'term': '第2学期',
        'desc_cn': '电磁学研究电荷、电场、磁场和电磁波的相互作用。学习库仑定律、高斯定理、安培定律、法拉第电磁感应定律等核心理论。',
        'desc_en': 'Electromagnetism studies interactions of charges, electric fields, magnetic fields, and electromagnetic waves. Learn Coulomb\'s law, Gauss\'s law, Ampere\'s law, and Faraday\'s law.',
        'demo_cn': '设计一个简单的电磁铁：绕在铁芯上的线圈通电后产生磁场。通过改变线圈匝数和电流大小，可以控制磁场强度，这就是电动机和变压器的基本原理。',
        'demo_en': 'Design an electromagnet: A coil around an iron core generates magnetic field when current flows. Adjust coil turns and current to control magnetic strength - the principle behind motors and transformers.',
    },
    'chem-general': {
        'cn': '普通化学',
        'en': 'General Chemistry',
        'credits': '4',
        'term': '第1学期',
        'desc_cn': '普通化学介绍物质的组成、结构、性质和变化规律。学习原子结构、化学键、化学反应、溶液化学等基础知识，培养化学思维和实验技能。',
        'desc_en': 'General chemistry introduces composition, structure, properties, and changes of matter. Learn atomic structure, chemical bonds, reactions, and solution chemistry with lab skills.',
        'demo_cn': '酸碱中和反应实验：将盐酸滴入氢氧化钠溶液中，用酚酞指示剂观察颜色变化。当溶液从红色变为无色时，表示酸碱恰好中和，这是化学分析的基本方法。',
        'demo_en': 'Acid-base neutralization experiment: Add HCl to NaOH solution, observe color change with phenolphthalein indicator. When solution turns colorless, neutralization is complete - a basic chemical analysis method.',
    },
    'chem-organic': {
        'cn': '有机化学入门',
        'en': 'Intro to Organic Chemistry',
        'credits': '3',
        'term': '第2学期',
        'desc_cn': '有机化学研究含碳化合物的结构、性质和反应。学习烃类、醇、醛、酮、羧酸等有机化合物的命名、结构和典型反应。',
        'desc_en': 'Organic chemistry studies carbon-containing compounds. Learn nomenclature, structure, and reactions of hydrocarbons, alcohols, aldehydes, ketones, and carboxylic acids.',
        'demo_cn': '分析葡萄糖的结构：葡萄糖是一种六碳醛糖，分子式C₆H₁₂O₆。它有开链结构和环状结构两种形式，环状结构在溶液中更稳定，这解释了糖类的许多化学性质。',
        'demo_en': 'Analyze glucose structure: Glucose is a six-carbon aldose with formula C₆H₁₂O₆. It exists in open-chain and cyclic forms, with cyclic form more stable in solution, explaining many sugar properties.',
    },
    'bio-general': {
        'cn': '普通生物学',
        'en': 'General Biology',
        'credits': '4',
        'term': '第1学期',
        'desc_cn': '普通生物学介绍生命的基本特征和生物多样性。学习细胞结构、新陈代谢、遗传与进化、生态系统等核心概念，培养对生命科学的基本认知。',
        'desc_en': 'General biology introduces basic characteristics of life and biodiversity. Learn cell structure, metabolism, genetics, evolution, and ecosystems to build foundational biological knowledge.',
        'demo_cn': '观察细胞有丝分裂：用显微镜观察洋葱根尖细胞，可以看到染色体在细胞分裂过程中的变化。从间期、前期、中期、后期到末期，染色体的行为揭示了遗传物质的传递机制。',
        'demo_en': 'Observe mitosis: Use microscope to view onion root tip cells. Chromosome behavior during interphase, prophase, metaphase, anaphase, and telophase reveals genetic material transmission mechanisms.',
    },
    'prog-basic': {
        'cn': '编程入门',
        'en': 'Programming Basics',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '编程入门学习计算机编程的基本概念和技能。学习变量、数据类型、控制结构、函数、数组等基础语法，掌握用代码解决简单问题的能力。',
        'desc_en': 'Programming basics introduces fundamental concepts and skills. Learn variables, data types, control structures, functions, arrays, and problem-solving with code.',
        'demo_cn': '写一个简单的猜数字游戏：程序随机生成一个1-100的数字，用户输入猜测，程序提示"太大"或"太小"，直到猜对为止。这个练习涵盖了随机数、输入输出和循环控制。',
        'demo_en': 'Build a number guessing game: Program generates random number 1-100, user guesses, program hints "too big" or "too small" until correct. This covers random numbers, I/O, and loop control.',
    },
    'logic-reason': {
        'cn': '逻辑推理',
        'en': 'Logical Reasoning',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '逻辑推理培养严谨的思维能力。学习命题逻辑、谓词逻辑、推理规则、证明方法等，提高分析和论证能力。',
        'desc_en': 'Logical reasoning develops rigorous thinking. Learn propositional logic, predicate logic, inference rules, and proof methods to improve analytical and argumentative skills.',
        'demo_cn': '分析一个论证是否有效："如果天下雨，地面就会湿。地面湿了，所以天在下雨。"这是一个典型的肯定后件谬误，因为地面湿可能有其他原因，比如洒水车经过。',
        'demo_en': 'Analyze argument validity: "If it rains, the ground is wet. The ground is wet, therefore it is raining." This is affirming the consequent fallacy - wet ground could have other causes like a sprinkler.',
    },
    'digital-literacy': {
        'cn': '数字素养',
        'en': 'Digital Literacy',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '数字素养培养在数字时代的信息获取、评估和应用能力。学习信息检索、数据处理、网络安全、数字工具使用等实用技能。',
        'desc_en': 'Digital literacy develops skills for information access, evaluation, and application in the digital age. Learn information retrieval, data processing, cybersecurity, and digital tools.',
        'demo_cn': '评估网络信息的可信度：看到一篇关于健康的文章，需要检查作者资质、信息来源、发布时间和是否有引用。警惕标题党和缺乏证据的断言。',
        'demo_en': 'Evaluate online information credibility: Check author credentials, sources, publication date, and citations for a health article. Be wary of clickbait and unsubstantiated claims.',
    },
    'eng-graphics': {
        'cn': '工程制图',
        'en': 'Engineering Graphics',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '工程制图学习用图形表达工程设计的方法。掌握三视图、剖视图、尺寸标注、公差配合等标准，培养空间想象和工程表达能力。',
        'desc_en': 'Engineering graphics teaches graphical representation of engineering designs. Master orthographic projection, section views, dimensioning, and tolerances to develop spatial visualization.',
        'demo_cn': '绘制一个螺栓的三视图：从正面、顶面和侧面三个方向观察螺栓，画出主视图、俯视图和左视图，标注螺纹规格、长度和直径等关键尺寸。',
        'demo_en': 'Draw three views of a bolt: Observe bolt from front, top, and side, create front view, top view, and left view with thread specifications, length, and diameter dimensions.',
    },
    'econ-principles': {
        'cn': '经济学原理',
        'en': 'Principles of Economics',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '经济学原理介绍微观和宏观经济的基本概念。学习供需理论、市场均衡、消费者行为、生产理论、国民经济核算等核心内容。',
        'desc_en': 'Principles of economics introduces micro and macroeconomic fundamentals. Learn supply and demand, market equilibrium, consumer behavior, production theory, and national accounting.',
        'demo_cn': '分析咖啡价格上涨的影响：巴西干旱导致咖啡豆减产，供给曲线左移，价格上升。消费者可能转向替代品如茶，同时咖啡店可能推出促销活动。',
        'demo_en': 'Analyze coffee price increase: Brazilian drought reduces coffee supply, shifting supply curve left, raising prices. Consumers may switch to substitutes like tea, while cafes may offer promotions.',
    },
    'acct-basic': {
        'cn': '会计学基础',
        'en': 'Accounting Basics',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '会计学基础学习财务报表的编制和解读。掌握借贷记账法、资产负债表、利润表、现金流量表等基本概念和方法。',
        'desc_en': 'Accounting basics teaches preparation and interpretation of financial statements. Master double-entry bookkeeping, balance sheet, income statement, and cash flow statement.',
        'demo_cn': '记录一笔简单的交易：公司用现金购买办公用品。会计分录是借：办公用品（资产增加），贷：现金（资产减少）。这笔交易不影响所有者权益。',
        'demo_en': 'Record a simple transaction: Company buys office supplies with cash. Journal entry: Debit Office Supplies (asset increase), Credit Cash (asset decrease). This transaction doesn\'t affect equity.',
    },
    'business-law': {
        'cn': '商法入门',
        'en': 'Business Law Intro',
        'credits': '2',
        'term': '第2学期',
        'desc_cn': '商法入门介绍商业活动中的法律框架。学习合同、侵权、知识产权、公司法等基本法律概念，培养商业法律意识。',
        'desc_en': 'Business law intro covers legal framework for commercial activities. Learn contracts, torts, intellectual property, and corporate law to develop business legal awareness.',
        'demo_cn': '分析合同的有效性：一份合同需要具备要约、承诺、对价、合法目的等要素。如果一方是未成年人或者合同内容违法，合同可能无效或可撤销。',
        'demo_en': 'Analyze contract validity: A contract requires offer, acceptance, consideration, and legal purpose. If one party is a minor or content is illegal, the contract may be void or voidable.',
    },
    'info-tech': {
        'cn': '信息技术基础',
        'en': 'IT Fundamentals',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '信息技术基础介绍计算机硬件、软件、网络和数据库的基本概念。学习操作系统使用、办公软件、网络基础知识等实用技能。',
        'desc_en': 'IT fundamentals introduces computer hardware, software, networks, and databases. Learn OS usage, office software, and basic networking skills.',
        'demo_cn': '配置一个简单的局域网：用路由器连接多台电脑，设置IP地址和子网掩码，实现文件共享和打印机共享。这是小型办公室的常见网络配置。',
        'demo_en': 'Configure a simple LAN: Connect computers with a router, set IP addresses and subnet masks, enable file and printer sharing. This is common in small office networks.',
    },
    'communication': {
        'cn': '商务沟通',
        'en': 'Business Communication',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '商务沟通学习在商业环境中的有效沟通技巧。掌握书面沟通、口头表达、演讲技巧、会议主持等能力。',
        'desc_en': 'Business communication teaches effective communication skills in commercial environments. Learn written communication, oral presentation, public speaking, and meeting facilitation.',
        'demo_cn': '准备一个产品推介演讲：结构包括开场吸引注意、介绍产品特点、展示数据证据、处理异议、结束呼吁行动。使用简洁的幻灯片和生动的案例。',
        'demo_en': 'Prepare a product pitch: Structure includes attention-grabbing opening, product features, data evidence, objection handling, and call to action. Use concise slides and vivid examples.',
    },
    'lab-tech': {
        'cn': '实验室技术',
        'en': 'Lab Techniques',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '实验室技术学习科学实验的基本操作和安全规范。掌握实验仪器使用、数据记录、误差分析、报告撰写等技能。',
        'desc_en': 'Lab techniques teaches basic experimental operations and safety protocols. Learn instrument use, data recording, error analysis, and report writing.',
        'demo_cn': '测量液体密度：用天平称量液体质量，用量筒测量体积，然后计算密度。多次测量取平均值，评估误差来源如温度变化对密度的影响。',
        'demo_en': 'Measure liquid density: Weigh liquid with balance, measure volume with graduated cylinder, calculate density. Average multiple measurements and evaluate error sources like temperature effects.',
    },
    'history-world': {
        'cn': '世界历史',
        'en': 'World History',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '世界历史介绍人类文明的发展历程。学习古代文明、中世纪、近代和现代历史的重大事件和发展趋势，培养历史思维和全球视野。',
        'desc_en': 'World history introduces human civilization development. Learn major events and trends from ancient civilizations to modern era, developing historical thinking and global perspective.',
        'demo_cn': '分析工业革命的影响：18世纪英国工业革命带来了蒸汽机、工厂制度和城市化。它不仅改变了生产方式，还引发了社会结构、阶级关系和国际关系的深刻变革。',
        'demo_en': 'Analyze Industrial Revolution impact: 18th-century British Industrial Revolution brought steam engines, factory systems, and urbanization. It transformed production methods and reshaped social structures, class relations, and international relations.',
    },
    'research-methods': {
        'cn': '研究方法',
        'en': 'Research Methods',
        'credits': '3',
        'term': '第2学期',
        'desc_cn': '研究方法学习社会科学研究的基本方法论。掌握文献综述、研究设计、数据收集、数据分析和论文撰写等技能。',
        'desc_en': 'Research methods teaches social science research methodology. Learn literature review, research design, data collection, analysis, and academic writing.',
        'demo_cn': '设计一个问卷调查：确定研究问题如"社交媒体使用对青少年心理健康的影响"，设计量表和问题，进行信效度检验，收集数据后用统计软件分析。',
        'demo_en': 'Design a survey: Define research question like "Social media impact on adolescent mental health", create scales and questions, test reliability and validity, collect and analyze data with statistical software.',
    },
    'writing-academic': {
        'cn': '学术写作',
        'en': 'Academic Writing',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '学术写作学习学术论文和报告的规范写法。掌握论文结构、引用格式、论证方法、学术语言等核心技能。',
        'desc_en': 'Academic writing teaches formal writing for papers and reports. Master paper structure, citation formats, argumentation methods, and academic language.',
        'demo_cn': '写一篇短文的引言：先介绍研究背景，提出研究问题，综述现有研究，说明本文的贡献。比如研究"气候变化对农业的影响"，需要引用IPCC报告和相关研究。',
        'demo_en': 'Write an essay introduction: Start with background, state research question, review existing literature, explain contribution. For "Climate change impact on agriculture", cite IPCC reports and related studies.',
    },
    'critical-thinking': {
        'cn': '批判性思维',
        'en': 'Critical Thinking',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '批判性思维培养独立思考和理性判断能力。学习识别论证结构、评估证据质量、发现逻辑谬误、构建合理论证等技能。',
        'desc_en': 'Critical thinking develops independent thinking and rational judgment. Learn argument structure identification, evidence evaluation, fallacy detection, and sound reasoning.',
        'demo_cn': '评估一篇新闻报道：检查信息来源是否可靠，是否存在偏见，数据是否准确，结论是否有证据支持。警惕选择性报道和情绪化语言。',
        'demo_en': 'Evaluate a news article: Check source reliability, detect bias, verify data accuracy, and assess evidence support for conclusions. Be wary of selective reporting and emotional language.',
    },
    'art-history': {
        'cn': '艺术史',
        'en': 'Art History',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '艺术史介绍不同时期和文化的艺术发展。学习古代艺术、中世纪艺术、文艺复兴、现代艺术等流派，培养艺术鉴赏能力。',
        'desc_en': 'Art history introduces art development across periods and cultures. Learn ancient, medieval, Renaissance, and modern art movements to develop appreciation skills.',
        'demo_cn': '分析蒙娜丽莎的艺术特点：达芬奇运用了晕涂法创造柔和的过渡，金字塔构图稳定和谐，神秘的微笑引发观者的情感共鸣。这些手法体现了文艺复兴的人文主义精神。',
        'demo_en': 'Analyze Mona Lisa: Da Vinci used sfumato for soft transitions, pyramid composition for stability, and the mysterious smile evokes emotional resonance. These techniques reflect Renaissance humanism.',
    },
    'drawing-basic': {
        'cn': '绘画基础',
        'en': 'Drawing Basics',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '绘画基础学习素描和色彩的基本技法。掌握线条、明暗、透视、构图等技巧，培养观察力和表现力。',
        'desc_en': 'Drawing basics teaches sketch and color fundamentals. Master line, shading, perspective, and composition to develop observation and expression skills.',
        'demo_cn': '画一个立方体的素描：用线条勾勒轮廓，运用透视原理表现立体感，通过明暗对比塑造体积。注意光源方向和阴影的变化。',
        'demo_en': 'Draw a cube sketch: Outline with lines, use perspective for 3D effect, create volume through light-dark contrast. Pay attention to light source direction and shadow variations.',
    },
    'design-principles': {
        'cn': '设计原理',
        'en': 'Design Principles',
        'credits': '3',
        'term': '第2学期',
        'desc_cn': '设计原理介绍视觉设计的基本法则。学习对比、对齐、重复、层次、平衡等设计原则，培养设计思维和审美能力。',
        'desc_en': 'Design principles introduces fundamental visual design rules. Learn contrast, alignment, repetition, hierarchy, and balance to develop design thinking and aesthetics.',
        'demo_cn': '设计一个海报：确定主题和信息层级，使用对比色吸引注意，对齐元素保持整洁，重复视觉元素增强一致性。比如音乐会海报可以用乐器图形和渐变背景。',
        'demo_en': 'Design a poster: Define theme and information hierarchy, use contrasting colors for attention, align elements for neatness, repeat visual elements for consistency. A concert poster could use instrument graphics and gradient background.',
    },
    'color-theory': {
        'cn': '色彩理论',
        'en': 'Color Theory',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '色彩理论学习色彩的基本属性和搭配原则。掌握色相、明度、饱和度、色彩和谐、对比等概念，培养色彩感知和运用能力。',
        'desc_en': 'Color theory teaches color properties and combination principles. Master hue, value, saturation, color harmony, and contrast to develop color perception and application skills.',
        'demo_cn': '选择一套品牌配色：主色使用蓝色传达信任和专业，辅助色用橙色增加活力，中性色用灰色和白色保持平衡。确保在不同背景下都有良好的可读性。',
        'demo_en': 'Choose brand colors: Use blue as primary color for trust and professionalism, orange as accent for energy, gray and white neutrals for balance. Ensure good readability across backgrounds.',
    },
    'digital-tools': {
        'cn': '数字工具',
        'en': 'Digital Tools',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '数字工具学习设计和创作常用的软件。掌握图像处理、矢量绘图、排版设计等工具的基本操作，培养数字化创作能力。',
        'desc_en': 'Digital tools teaches common design and creation software. Learn image processing, vector graphics, and layout design to develop digital creation skills.',
        'demo_cn': '制作一张社交媒体图片：用Photoshop调整图片大小和色彩，添加文字和图形元素，确保尺寸适合不同平台如Instagram、微博等。',
        'demo_en': 'Create a social media image: Use Photoshop to resize and adjust colors, add text and graphic elements, ensure dimensions fit platforms like Instagram and Weibo.',
    },
    'psych-general': {
        'cn': '普通心理学',
        'en': 'General Psychology',
        'credits': '3',
        'term': '第1学期',
        'desc_cn': '普通心理学介绍心理学的基本概念和研究领域。学习认知、情绪、人格、社会心理学等核心内容，培养对人类行为和心理的科学理解。',
        'desc_en': 'General psychology introduces basic concepts and research areas. Learn cognition, emotion, personality, and social psychology to develop scientific understanding of human behavior.',
        'demo_cn': '分析记忆的工作机制：短时记忆容量约为7±2个组块，通过复述可以将信息转入长时记忆。比如记电话号码时，人们会把数字分组来提高记忆效率。',
        'demo_en': 'Analyze memory mechanisms: Short-term memory holds about 7±2 chunks, rehearsal transfers to long-term memory. When memorizing phone numbers, people group digits to improve efficiency.',
    },
    'child-dev': {
        'cn': '儿童发展',
        'en': 'Child Development',
        'credits': '3',
        'term': '第2学期',
        'desc_cn': '儿童发展学习儿童从出生到青春期的身心发展规律。掌握认知发展、社会性发展、语言发展等理论，培养观察和理解儿童的能力。',
        'desc_en': 'Child development studies physical and psychological growth from birth to adolescence. Learn cognitive, social, and language development theories to understand children.',
        'demo_cn': '观察儿童的认知发展：皮亚杰的守恒实验显示，7岁以下儿童认为同样多的液体倒入不同形状的杯子后量会改变，而7岁以上儿童能理解守恒概念。',
        'demo_en': 'Observe cognitive development: Piaget\'s conservation experiment shows children under 7 think liquid quantity changes when poured into different-shaped cups, while older children understand conservation.',
    },
    'education-history': {
        'cn': '教育史',
        'en': 'Education History',
        'credits': '2',
        'term': '第1学期',
        'desc_cn': '教育史介绍教育思想和制度的发展历程。学习古代教育、近代教育改革、现代教育理论等内容，理解教育发展的历史脉络。',
        'desc_en': 'Education history introduces development of educational ideas and systems. Learn ancient education, modern reforms, and contemporary theories to understand historical context.',
        'demo_cn': '比较中西方教育传统：中国古代强调儒家经典和科举制度，注重道德修养；西方近代强调科学知识和个性发展，注重培养批判性思维。',
        'demo_en': 'Compare Chinese and Western education traditions: Ancient China emphasized Confucian classics and imperial exams, focusing on moral cultivation; modern West emphasizes science and individuality, fostering critical thinking.',
    },
    'learning-theory': {
        'cn': '学习理论',
        'en': 'Learning Theory',
        'credits': '3',
        'term': '第2学期',
        'desc_cn': '学习理论介绍人类学习的基本理论和模型。掌握行为主义、认知主义、建构主义等学习理论，理解不同教学方法的理论基础。',
        'desc_en': 'Learning theory introduces fundamental theories and models of human learning. Master behaviorism, cognitivism, and constructivism to understand teaching methodology foundations.',
        'demo_cn': '应用强化理论设计课堂激励：表扬学生的良好行为（正强化），忽视不当行为（消退），合理运用奖励机制可以有效塑造学生的学习行为。',
        'demo_en': 'Apply reinforcement theory in classroom: Praise good behavior (positive reinforcement), ignore inappropriate behavior (extinction), use rewards appropriately to shape student learning behavior.',
    },
    'classroom-mgmt': {
        'cn': '课堂管理',
        'en': 'Classroom Management',
        'credits': '2',
        'term': '第2学期',
        'desc_cn': '课堂管理学习有效组织和管理课堂的方法。掌握规则制定、行为管理、时间管理、课堂氛围营造等技能。',
        'desc_en': 'Classroom management teaches effective classroom organization. Learn rule-setting, behavior management, time management, and classroom climate building.',
        'demo_cn': '设计课堂规则：规则要简洁明确，如"举手发言""按时完成作业"，用积极语言表述，让学生参与制定过程，提高遵守的自觉性。',
        'demo_en': 'Design classroom rules: Keep rules simple and clear like "Raise hand to speak" and "Complete homework on time", use positive language, involve students in rule-setting to increase compliance.',
    },
    'diversity': {
        'cn': '多元文化教育',
        'en': 'Multicultural Education',
        'credits': '2',
        'term': '第2学期',
        'desc_cn': '多元文化教育学习在多元文化背景下的教育理念和实践。理解文化差异，培养包容意识，学会设计适合多元文化学生的教学方案。',
        'desc_en': 'Multicultural education teaches educational philosophy and practice in diverse contexts. Understand cultural differences, develop inclusivity, and design culturally responsive teaching.',
        'demo_cn': '设计多元文化课程：在历史课中加入不同文化的视角，比如讲述哥伦布发现美洲时，同时介绍原住民的历史和文化，培养学生的多元文化视角。',
        'demo_en': 'Design multicultural curriculum: Include diverse perspectives in history class, such as presenting Indigenous history alongside Columbus\' voyage, fostering students\' multicultural awareness.',
    },
}

def create_homepage():
    html = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>美国大学专业先修课程导航 - yunzhuan.icu</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1100px;
            margin: 0 auto;
            padding: 20px 16px;
            background: #f5f5f5;
            color: #333;
        }
        h1 {
            text-align: center;
            color: #333;
            margin-bottom: 4px;
            font-size: 1.5rem;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 16px;
            font-size: 0.9rem;
        }
        .stats {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin-bottom: 16px;
        }
        .stat-item {
            background: white;
            padding: 6px 14px;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            font-size: 0.85rem;
            color: #666;
        }
        .stat-item b {
            color: #667eea;
            margin-right: 4px;
        }
        .category {
            background: white;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .category h2 {
            color: #333;
            margin-bottom: 8px;
            font-size: 1rem;
            font-weight: 600;
            display: flex;
            align-items: baseline;
            gap: 8px;
        }
        .category h2 .en {
            color: #999;
            font-size: 0.8rem;
            font-weight: normal;
        }
        .category .count {
            font-size: 0.75rem;
            color: #888;
            font-weight: normal;
        }
        .major-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 6px;
        }
        .major-link {
            display: block;
            padding: 6px 10px;
            background: #f8f9fa;
            border-radius: 4px;
            text-decoration: none;
            color: #333;
            transition: all 0.15s ease;
            border-left: 3px solid #667eea;
            font-size: 0.88rem;
            line-height: 1.3;
        }
        .major-link:hover {
            background: #e8eaf6;
            border-left-color: #764ba2;
        }
        .major-link .cn {
            font-weight: 600;
            font-size: 0.9rem;
        }
        .major-link .en {
            font-size: 0.75rem;
            color: #888;
            margin-left: 4px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 0.8rem;
        }
        @media (max-width: 768px) {
            h1 { font-size: 1.3rem; }
            .major-list { grid-template-columns: 1fr; }
            .major-link .en { display: block; margin-left: 0; margin-top: 2px; }
        }
    </style>
</head>
<body>
    <h1>美国大学专业先修课程导航</h1>
    <p class="subtitle">Prerequisite Courses Navigation</p>

    <div class="stats">
        <div class="stat-item"><b>8</b>专业分类</div>
        <div class="stat-item"><b>44</b>专业数量</div>
    </div>
'''

    for category_key, category_data in MAJORS_DATA.items():
        html += f'''
    <div class="category">
        <h2>{category_data['name']} <span class="en">{category_data['en_name']}</span> <span class="count">{category_data['count']}个专业</span></h2>
        <div class="major-list">
'''
        for major in category_data['majors']:
            html += f'            <a href="{category_key}/{major["id"]}.html" class="major-link"><span class="cn">{major["cn"]}</span><span class="en">{major["en"]}</span></a>\n'
        html += '''        </div>
    </div>
'''

    html += '''
    <p class="footer">© 2026 yunzhuan.icu | 先修课程导航</p>
</body>
</html>
'''
    with open(os.path.join(BASE_DIR, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(html)

def create_major_pages():
    for category_key, category_data in MAJORS_DATA.items():
        for major in category_data['majors']:
            html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{major["cn"]} - {major["en"]} - 先修课程</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 760px;
            margin: 0 auto;
            padding: 20px 16px;
            background: #f5f5f5;
            color: #333;
        }}
        .back-link {{
            color: #667eea;
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 12px;
            display: inline-block;
        }}
        .back-link:hover {{ text-decoration: underline; }}
        h1 {{
            color: #333;
            margin-bottom: 4px;
            font-size: 1.4rem;
        }}
        .en-name {{
            color: #888;
            font-size: 0.95rem;
            margin-bottom: 14px;
            font-weight: normal;
        }}
        .section {{
            background: white;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }}
        .section h2 {{
            color: #667eea;
            margin-bottom: 8px;
            font-size: 1rem;
            font-weight: 600;
        }}
        .section h2 .en {{ color: #999; font-size: 0.8rem; font-weight: normal; }}
        .section p {{
            color: #333;
            line-height: 1.7;
            font-size: 0.92rem;
        }}
        .course-list {{ display: flex; flex-wrap: wrap; gap: 6px; }}
        .course-link {{ display: inline-block; padding: 4px 10px; background: #f8f9fa; border-radius: 4px; text-decoration: none; color: #333; font-size: 0.85rem; border-left: 3px solid #667eea; }}
        .course-link:hover {{ background: #e8eaf6; border-left-color: #764ba2; }}
        .footer {{
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 0.8rem;
        }}
    </style>
</head>
<body>
    <a href="../index.html" class="back-link">← 返回首页</a>
    
    <h1>{major["cn"]}</h1>
    <p class="en-name">{major["en"]}</p>

    <div class="section">
        <h2>专业简介 <span class="en">Program Overview</span></h2>
        <p>{major["cn"]}是一门综合性的学科，涉及多个领域的知识和技能。本页面列出了学习该专业前建议完成的先修课程，帮助学生做好学术准备。</p>
        <p style="margin-top:8px;">{major["en"]} is an interdisciplinary field that requires knowledge and skills from multiple areas. This page lists recommended prerequisite courses to prepare students academically.</p>
    </div>

    <div class="section">
        <h2>先修课程 <span class="en">Prerequisite Courses</span></h2>
        <div class="course-list">
'''
            for course in category_data['prereq_courses']:
                html += f'            <a href="courses/{course["id"]}.html" class="course-link">{course["cn"]}</a>\n'
            html += '''        </div>
    </div>

    <p class="footer">© 2026 yunzhuan.icu | 先修课程导航</p>
</body>
</html>
'''
            file_path = os.path.join(BASE_DIR, category_key, f'{major["id"]}.html')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html)

def create_course_pages():
    for category_key, category_data in MAJORS_DATA.items():
        for course in category_data['prereq_courses']:
            course_id = course['id']
            if course_id not in COURSE_DETAILS:
                continue
            details = COURSE_DETAILS[course_id]
            html = f'''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{details["cn"]} - {details["en"]} - 先修课程</title>
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 760px;
            margin: 0 auto;
            padding: 20px 16px;
            background: #f5f5f5;
            color: #333;
        }}
        .back-link {{
            color: #667eea;
            text-decoration: none;
            font-size: 0.85rem;
            margin-bottom: 12px;
            display: inline-block;
        }}
        .back-link:hover {{ text-decoration: underline; }}
        h1 {{
            color: #333;
            margin-bottom: 4px;
            font-size: 1.4rem;
        }}
        .en-name {{
            color: #888;
            font-size: 0.95rem;
            margin-bottom: 14px;
            font-weight: normal;
        }}
        .section {{
            background: white;
            border-radius: 8px;
            padding: 14px 18px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }}
        .section h2 {{
            color: #667eea;
            margin-bottom: 8px;
            font-size: 1rem;
            font-weight: 600;
        }}
        .section h2 .en {{ color: #999; font-size: 0.8rem; font-weight: normal; }}
        .section p {{
            color: #333;
            line-height: 1.7;
            font-size: 0.92rem;
        }}
        .meta {{ font-size: 0.82rem; color: #888; margin-bottom: 8px; }}
        .demo-box {{
            background: #f0f4ff;
            padding: 10px 14px;
            border-radius: 6px;
            margin-top: 10px;
            border-left: 3px solid #667eea;
            font-size: 0.88rem;
        }}
        .demo-box b {{ color: #667eea; }}
        .footer {{
            text-align: center;
            margin-top: 20px;
            color: #999;
            font-size: 0.8rem;
        }}
    </style>
</head>
<body>
    <a href="../index.html" class="back-link">← 返回首页</a>
    
    <h1>{details["cn"]}</h1>
    <p class="en-name">{details["en"]}</p>

    <div class="section">
        <h2>课程介绍 <span class="en">Course Introduction</span></h2>
        <p class="meta">学分：{details["credits"]} | 建议学期：{details["term"]}</p>
        <p>{details["desc_cn"]}</p>
        <p style="margin-top:8px;">{details["desc_en"]}</p>
    </div>

    <div class="section">
        <h2>学习示例 <span class="en">Learning Example</span></h2>
        <div class="demo-box">
            <b>📋 示例：</b>{details["demo_cn"]}
        </div>
        <div class="demo-box" style="margin-top:8px;border-left-color:#764ba2;">
            <b>📋 Example:</b> {details["demo_en"]}
        </div>
    </div>

    <p class="footer">© 2026 yunzhuan.icu | 先修课程导航</p>
</body>
</html>
'''
            file_path = os.path.join(BASE_DIR, category_key, 'courses', f'{course_id}.html')
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(html)

def main():
    print('Creating homepage...')
    create_homepage()
    print('Creating major pages...')
    create_major_pages()
    print('Creating course pages...')
    create_course_pages()
    print('Done!')

if __name__ == '__main__':
    main()
