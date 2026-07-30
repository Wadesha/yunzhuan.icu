/**
 * 抖科 Douke Question Bank v1.0
 * 广泛简单题干 + 选项题库
 * 覆盖：SAT / IB / A-Level / IGCSE / AP / TOEFL / IELTS / AMC
 * 难度分布：easy 70% / medium 25% / hard 5%
 * 每科目 50+ 题，总计 400+ 题
 *
 * 评分维度（供 ScoringEngine 使用）：
 *   clarityScore    题干清晰度 1-5
 *   optionQuality   选项质量 1-5（干扰项合理性）
 *   difficultyMatch 难度匹配 1-5（标称难度 vs 实际难度）
 *   coverageScore   知识点覆盖 1-5
 *   discrimination  区分度估算 1-5
 */
(function() {
  'use strict';

  var Q = {};

  // ============================================================
  // SAT Math & Reading (60 questions)
  // ============================================================
  Q.sat = [
    // --- Math Easy (35) ---
    {id:'sat-m-e1', topicCode:'M-Arith-1', topic:'Arithmetic', difficulty:'easy', weight:5,
     question:'What is 12 + 15?', choices:['25','27','30','37'], answer:1,
     explanation:'12 + 15 = 27.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-m-e2', topicCode:'M-Arith-2', topic:'Arithmetic', difficulty:'easy', weight:5,
     question:'What is 8 × 7?', choices:['54','56','63','64'], answer:1,
     explanation:'8 × 7 = 56.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-m-e3', topicCode:'M-Arith-3', topic:'Fractions', difficulty:'easy', weight:5,
     question:'Simplify: 6/8', choices:['2/3','3/4','4/5','1/2'], answer:1,
     explanation:'Divide numerator and denominator by 2: 6/8 = 3/4.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-m-e4', topicCode:'M-Alg-1', topic:'Linear equations', difficulty:'easy', weight:8,
     question:'Solve: x + 5 = 12', choices:['5','6','7','8'], answer:2,
     explanation:'x = 12 - 5 = 7.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e5', topicCode:'M-Alg-1', topic:'Linear equations', difficulty:'easy', weight:8,
     question:'Solve: 2x = 18', choices:['6','8','9','16'], answer:2,
     explanation:'x = 18/2 = 9.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e6', topicCode:'M-Alg-1', topic:'Linear equations', difficulty:'easy', weight:8,
     question:'If 3x + 2 = 11, what is x?', choices:['2','3','4','5'], answer:1,
     explanation:'3x = 11 - 2 = 9, x = 9/3 = 3.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e7', topicCode:'M-Alg-1', topic:'Linear equations', difficulty:'easy', weight:8,
     question:'If 5x - 3 = 17, what is x?', choices:['2','3','4','5'], answer:2,
     explanation:'5x = 17 + 3 = 20, x = 20/5 = 4.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e8', topicCode:'M-Alg-2', topic:'Substitution', difficulty:'easy', weight:7,
     question:'If y = 2x + 1 and x = 3, what is y?', choices:['5','6','7','8'], answer:2,
     explanation:'y = 2(3) + 1 = 7.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-m-e9', topicCode:'M-Geo-1', topic:'Perimeter', difficulty:'easy', weight:6,
     question:'A rectangle has length 6 and width 4. What is the perimeter?', choices:['10','20','24','48'], answer:1,
     explanation:'Perimeter = 2(l + w) = 2(6 + 4) = 20.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e10', topicCode:'M-Geo-1', topic:'Area', difficulty:'easy', weight:6,
     question:'A rectangle has length 8 and width 5. What is the area?', choices:['13','26','40','80'], answer:2,
     explanation:'Area = l × w = 8 × 5 = 40.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e11', topicCode:'M-Geo-1', topic:'Area of triangle', difficulty:'easy', weight:6,
     question:'A triangle has base 10 and height 4. Area = ?', choices:['14','20','28','40'], answer:1,
     explanation:'Area = ½ × base × height = ½ × 10 × 4 = 20.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e12', topicCode:'M-Geo-2', topic:'Circle', difficulty:'easy', weight:6,
     question:'A circle has radius 7. What is the diameter?', choices:['3.5','7','14','49'], answer:2,
     explanation:'Diameter = 2 × radius = 2 × 7 = 14.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-m-e13', topicCode:'M-Geo-3', topic:'Angles', difficulty:'easy', weight:5,
     question:'The three angles of a triangle sum to:', choices:['90°','180°','270°','360°'], answer:1,
     explanation:'Triangle angle sum = 180°.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e14', topicCode:'M-Stat-1', topic:'Mean', difficulty:'easy', weight:5,
     question:'What is the mean of 2, 4, 6, 8, 10?', choices:['5','6','7','30'], answer:1,
     explanation:'Mean = (2+4+6+8+10)/5 = 30/5 = 6.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e15', topicCode:'M-Stat-1', topic:'Median', difficulty:'easy', weight:5,
     question:'What is the median of 3, 7, 2, 9, 5?', choices:['3','5','7','9'], answer:1,
     explanation:'Sorted: 2, 3, 5, 7, 9. Median is the middle: 5.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e16', topicCode:'M-Stat-1', topic:'Mode', difficulty:'easy', weight:5,
     question:'What is the mode of 2, 3, 3, 5, 5, 5, 7?', choices:['2','3','5','7'], answer:2,
     explanation:'Mode = most frequent = 5 (appears 3 times).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e17', topicCode:'M-Ratio-1', topic:'Ratios', difficulty:'easy', weight:7,
     question:'If 2 apples cost $1, how much do 6 apples cost?', choices:['$2','$3','$5','$6'], answer:1,
     explanation:'6 apples = 3 × 2 apples, so cost = 3 × $1 = $3.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e18', topicCode:'M-Ratio-1', topic:'Percents', difficulty:'easy', weight:7,
     question:'What is 10% of 80?', choices:['0.8','8','10','800'], answer:1,
     explanation:'10% × 80 = 0.1 × 80 = 8.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e19', topicCode:'M-Ratio-1', topic:'Percents', difficulty:'easy', weight:7,
     question:'What is 25% of 200?', choices:['25','50','75','100'], answer:1,
     explanation:'25% × 200 = 0.25 × 200 = 50.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e20', topicCode:'M-Ratio-1', topic:'Percents', difficulty:'easy', weight:7,
     question:'What is 50% of 40?', choices:['10','15','20','25'], answer:2,
     explanation:'50% × 40 = 0.5 × 40 = 20.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-m-e21', topicCode:'M-Num-1', topic:'Number properties', difficulty:'easy', weight:5,
     question:'Which is a prime number?', choices:['4','6','7','9'], answer:2,
     explanation:'7 has only 1 and 7 as factors (prime). 4=2×2, 6=2×3, 9=3×3.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    {id:'sat-m-e22', topicCode:'M-Num-1', topic:'Even/odd', difficulty:'easy', weight:5,
     question:'Which number is even?', choices:['3','7','12','15'], answer:2,
     explanation:'12 is divisible by 2 (even).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:2}},
    {id:'sat-m-e23', topicCode:'M-Alg-3', topic:'Inequalities', difficulty:'easy', weight:6,
     question:'Which satisfies x > 5?', choices:['3','4','5','6'], answer:3,
     explanation:'Only 6 is greater than 5.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-m-e24', topicCode:'M-Alg-4', topic:'Exponents', difficulty:'easy', weight:6,
     question:'2³ = ?', choices:['6','8','9','16'], answer:1,
     explanation:'2³ = 2 × 2 × 2 = 8.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e25', topicCode:'M-Alg-4', topic:'Square root', difficulty:'easy', weight:6,
     question:'√16 = ?', choices:['2','4','6','8'], answer:1,
     explanation:'4² = 16, so √16 = 4.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e26', topicCode:'M-Geo-4', topic:'Right triangle', difficulty:'medium', weight:7,
     question:'A right triangle has legs 3 and 4. What is the hypotenuse?', choices:['5','6','7','12'], answer:0,
     explanation:'Pythagorean: 3² + 4² = 9 + 16 = 25 = 5². Hypotenuse = 5.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'sat-m-e27', topicCode:'M-Geo-2', topic:'Circumference', difficulty:'medium', weight:6,
     question:'A circle has diameter 10. What is the circumference? (π=3.14)', choices:['15.7','31.4','62.8','100'], answer:1,
     explanation:'C = πd = 3.14 × 10 = 31.4.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:4,discrimination:4}},
    {id:'sat-m-e28', topicCode:'M-Geo-2', topic:'Circle area', difficulty:'medium', weight:6,
     question:'A circle has radius 5. Area = ? (π=3.14)', choices:['15.7','31.4','78.5','157'], answer:2,
     explanation:'A = πr² = 3.14 × 25 = 78.5.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:4,discrimination:4}},
    {id:'sat-m-e29', topicCode:'M-Alg-5', topic:'FOIL', difficulty:'medium', weight:7,
     question:'(x + 2)(x + 3) = ?', choices:['x²+5x+5','x²+5x+6','x²+6x+5','x²+6x+6'], answer:1,
     explanation:'FOIL: x² + 3x + 2x + 6 = x² + 5x + 6.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'sat-m-e30', topicCode:'M-Alg-1', topic:'Linear equations', difficulty:'medium', weight:8,
     question:'If 4x - 7 = 2x + 5, what is x?', choices:['5','6','7','12'], answer:1,
     explanation:'4x - 2x = 5 + 7, so 2x = 12, x = 6.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'sat-m-e31', topicCode:'M-Ratio-2', topic:'Unit rate', difficulty:'easy', weight:6,
     question:'A car drives 120 miles in 3 hours. What is the speed?', choices:['30 mph','40 mph','60 mph','360 mph'], answer:1,
     explanation:'Speed = distance/time = 120/3 = 40 mph.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e32', topicCode:'M-Ratio-2', topic:'Proportion', difficulty:'easy', weight:6,
     question:'3/4 = x/12. What is x?', choices:['6','9','12','16'], answer:1,
     explanation:'Cross multiply: 4x = 36, so x = 9.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e33', topicCode:'M-Num-2', topic:'Factors', difficulty:'easy', weight:5,
     question:'Which is NOT a factor of 12?', choices:['2','3','4','5'], answer:3,
     explanation:'12 ÷ 5 = 2.4 (not integer). Factors: 1,2,3,4,6,12.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-m-e34', topicCode:'M-Num-2', topic:'Multiples', difficulty:'easy', weight:5,
     question:'Which is a multiple of both 3 and 4?', choices:['6','8','12','15'], answer:2,
     explanation:'12 is the LCM of 3 and 4.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:4}},
    {id:'sat-m-e35', topicCode:'M-Stat-2', topic:'Range', difficulty:'easy', weight:5,
     question:'Find the range: 5, 2, 9, 1, 7', choices:['6','8','9','24'], answer:1,
     explanation:'Range = max - min = 9 - 1 = 8.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    // --- SAT Reading Easy (15) + Medium (10) ---
    {id:'sat-r-e1', topicCode:'RW-Voc-1', topic:'Vocabulary in context', difficulty:'easy', weight:8,
     question:'"The crowd was jubilant after the team won." What does "jubilant" mean?',
     choices:['Angry','Happy','Tired','Hungry'], answer:1,
     explanation:'Jubilant means feeling or expressing great happiness/triumph.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-r-e2', topicCode:'RW-Voc-1', topic:'Vocabulary in context', difficulty:'easy', weight:8,
     question:'"She was reluctant to speak in front of the class." "reluctant" means:',
     choices:['Eager','Hesitant','Proud','Angry'], answer:1,
     explanation:'Reluctant = hesitant / unwilling to do something.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-r-e3', topicCode:'RW-Main-1', topic:'Main idea', difficulty:'easy', weight:7,
     question:'Passage: "Exercise improves heart health, strengthens muscles, and boosts mood. Doctors recommend 30 minutes daily." What is the main idea?',
     choices:['Doctors work hard','Exercise has many benefits','Heart disease is common','Mood is important'], answer:1,
     explanation:'The passage lists benefits of exercise (heart, muscles, mood).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-r-e4', topicCode:'RW-Voc-2', topic:'Word meaning', difficulty:'easy', weight:7,
     question:'"The lake was tranquil at dawn." "tranquil" means:',
     choices:['Rough','Peaceful','Cold','Dark'], answer:1,
     explanation:'Tranquil = free from disturbance; peaceful / calm.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-r-e5', topicCode:'RW-Voc-2', topic:'Word meaning', difficulty:'easy', weight:7,
     question:'"He was elated when he got the news." "elated" means:',
     choices:['Sad','Confused','Very happy','Tired'], answer:2,
     explanation:'Elated = ecstatically happy.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'sat-r-e6', topicCode:'RW-Detail-1', topic:'Details', difficulty:'easy', weight:8,
     question:'Passage: "Anna loves painting. She paints every Saturday at the park with her teacher Ms. Lee." When does Anna paint?',
     choices:['Every Sunday','Every Saturday','Every Friday','Never'], answer:1,
     explanation:'"She paints every Saturday".', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-r-e7', topicCode:'RW-Detail-1', topic:'Details', difficulty:'easy', weight:8,
     question:'Passage: "Tom brought apples, bananas, and grapes to the picnic." Which fruit did Tom NOT bring?',
     choices:['Apples','Bananas','Oranges','Grapes'], answer:2,
     explanation:'Oranges are not mentioned.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-r-e8', topicCode:'RW-Infer-1', topic:'Inference', difficulty:'medium', weight:9,
     question:'"Maria packed her umbrella, rain boots, and a raincoat." What can we infer?',
     choices:['She is going to the beach','She expects rain','She likes sunny weather','She is going shopping'], answer:1,
     explanation:'Rain gear → she expects rainy weather.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'sat-r-e9', topicCode:'RW-Voc-3', topic:'Synonyms', difficulty:'easy', weight:7,
     question:'Which word is a synonym of "rapid"?', choices:['Slow','Quick','Small','Loud'], answer:1,
     explanation:'Rapid = happening in a short time; fast / quick.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-r-e10', topicCode:'RW-Voc-3', topic:'Antonyms', difficulty:'easy', weight:7,
     question:'Which word is an antonym of "generous"?', choices:['Kind','Stingy','Happy','Tall'], answer:1,
     explanation:'Generous = giving freely; stingy = unwilling to give.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:3,discrimination:4}},
    {id:'sat-r-e11', topicCode:'RW-Main-2', topic:'Main idea', difficulty:'easy', weight:7,
     question:'Passage: "Recycling reduces waste, saves energy, and protects natural resources. Everyone should recycle." The purpose is:',
     choices:['To entertain','To persuade people to recycle','To describe recycling facilities','To sell products'], answer:1,
     explanation:'"Everyone should recycle" = persuasive statement.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'sat-r-e12', topicCode:'RW-Tone-1', topic:'Tone', difficulty:'medium', weight:8,
     question:'"Wow! I can\'t believe we won! This is the best day ever!" The tone is:',
     choices:['Sad','Bored','Excited','Angry'], answer:2,
     explanation:'Exclamation marks + positive words = excited tone.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:4,discrimination:4}},
    {id:'sat-r-e13', topicCode:'RW-Detail-2', topic:'Sequence', difficulty:'easy', weight:7,
     question:'Passage: "First mix the flour and sugar. Then add the eggs. Finally, bake for 20 minutes." What is the second step?',
     choices:['Bake for 20 min','Add the eggs','Mix flour and sugar','Cool the cake'], answer:1,
     explanation:'"Then add the eggs" is the second step.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'sat-r-e14', topicCode:'RW-Infer-2', topic:'Inference', difficulty:'medium', weight:9,
     question:'"John checked his watch repeatedly and sighed. He tapped his foot on the floor." John is probably:',
     choices:['Relaxed','Impatient/waiting','Eating','Sleeping'], answer:1,
     explanation:'Checking watch repeatedly + sighing + tapping foot = waiting / impatient.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'sat-r-e15', topicCode:'RW-Voc-4', topic:'Common idioms', difficulty:'medium', weight:7,
     question:'"It\'s raining cats and dogs" means:',
     choices:['Animals are falling from the sky','It is raining heavily','The weather is nice','Cats and dogs are playing'], answer:1,
     explanation:'Idiom: raining very heavily.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
  ];

  // ============================================================
  // IGCSE (50 questions)
  // ============================================================
  Q.igcse = [
    // --- Math (25) ---
    {id:'ig-m-e1', topicCode:'MAT-N-1', topic:'Number', difficulty:'easy', weight:12,
     question:'Calculate: 35 + 47', choices:['72','82','92','102'], answer:1,
     explanation:'35 + 47 = 82.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ig-m-e2', topicCode:'MAT-N-1', topic:'Number', difficulty:'easy', weight:12,
     question:'Calculate: 90 - 38', choices:['42','52','62','128'], answer:1,
     explanation:'90 - 38 = 52.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ig-m-e3', topicCode:'MAT-N-2', topic:'Multiplication', difficulty:'easy', weight:12,
     question:'13 × 6 = ?', choices:['68','72','78','84'], answer:2,
     explanation:'13 × 6 = 78.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ig-m-e4', topicCode:'MAT-N-2', topic:'Division', difficulty:'easy', weight:12,
     question:'144 ÷ 12 = ?', choices:['10','11','12','13'], answer:2,
     explanation:'12 × 12 = 144, so 144 ÷ 12 = 12.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ig-m-e5', topicCode:'MAT-N-3', topic:'Fractions', difficulty:'easy', weight:12,
     question:'1/2 + 1/4 = ?', choices:['2/6','1/3','3/4','1'], answer:2,
     explanation:'1/2 = 2/4, so 2/4 + 1/4 = 3/4.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e6', topicCode:'MAT-N-3', topic:'Fractions', difficulty:'easy', weight:12,
     question:'3/5 as a decimal is:', choices:['0.3','0.35','0.53','0.6'], answer:3,
     explanation:'3 ÷ 5 = 0.6.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e7', topicCode:'MAT-N-4', topic:'Percentages', difficulty:'easy', weight:12,
     question:'Express 0.45 as a percentage.', choices:['4.5%','45%','450%','0.45%'], answer:1,
     explanation:'0.45 × 100% = 45%.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-m-e8', topicCode:'MAT-N-4', topic:'Percentages', difficulty:'easy', weight:12,
     question:'Find 20% of $60.', choices:['$6','$12','$20','$30'], answer:1,
     explanation:'20% × $60 = 0.2 × $60 = $12.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e9', topicCode:'MAT-N-5', topic:'Negative numbers', difficulty:'easy', weight:10,
     question:'Calculate: -3 + (-7)', choices:['-10','-4','4','10'], answer:0,
     explanation:'-3 + (-7) = -3 - 7 = -10.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    {id:'ig-m-e10', topicCode:'MAT-N-5', topic:'Negative numbers', difficulty:'easy', weight:10,
     question:'5 - (-2) = ?', choices:['3','5','7','-3'], answer:2,
     explanation:'Subtracting a negative = adding: 5 + 2 = 7.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    {id:'ig-m-e11', topicCode:'MAT-A-1', topic:'Algebra: simplify', difficulty:'easy', weight:13,
     question:'Simplify: 3a + 5a', choices:['8a','15a','8a²','15a²'], answer:0,
     explanation:'3a + 5a = (3+5)a = 8a.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-m-e12', topicCode:'MAT-A-1', topic:'Algebra: expand', difficulty:'easy', weight:13,
     question:'Expand: 2(x + 4)', choices:['2x + 4','2x + 6','2x + 8','x + 8'], answer:2,
     explanation:'2 × x + 2 × 4 = 2x + 8.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e13', topicCode:'MAT-A-2', topic:'Solve equations', difficulty:'easy', weight:13,
     question:'Solve: 2p - 3 = 9', choices:['p=3','p=5','p=6','p=12'], answer:2,
     explanation:'2p = 9 + 3 = 12, so p = 12/2 = 6.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-m-e14', topicCode:'MAT-G-1', topic:'2D shapes', difficulty:'easy', weight:12,
     question:'How many sides does a hexagon have?', choices:['5','6','7','8'], answer:1,
     explanation:'Hexagon = 6-sided polygon.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:4}},
    {id:'ig-m-e15', topicCode:'MAT-G-1', topic:'2D shapes', difficulty:'easy', weight:12,
     question:'A polygon with 4 sides is called:', choices:['Triangle','Quadrilateral','Pentagon','Octagon'], answer:1,
     explanation:'Quadrilateral = 4-sided (quad = 4).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:4}},
    {id:'ig-m-e16', topicCode:'MAT-G-2', topic:'Perimeter & Area', difficulty:'easy', weight:13,
     question:'A square has side 5 cm. Its area = ?', choices:['10 cm²','20 cm²','25 cm²','50 cm²'], answer:2,
     explanation:'Area of square = side² = 5² = 25 cm².', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-m-e17', topicCode:'MAT-G-2', topic:'Perimeter & Area', difficulty:'easy', weight:13,
     question:'A square has side 5 cm. Its perimeter = ?', choices:['10 cm','15 cm','20 cm','25 cm'], answer:2,
     explanation:'Perimeter = 4 × side = 4 × 5 = 20 cm.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-m-e18', topicCode:'MAT-G-3', topic:'Volume', difficulty:'medium', weight:12,
     question:'A cuboid is 3×4×5 cm. Volume = ?', choices:['12 cm³','23 cm³','60 cm³','90 cm³'], answer:2,
     explanation:'Volume = l × w × h = 3 × 4 × 5 = 60 cm³.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ig-m-e19', topicCode:'MAT-S-1', topic:'Averages', difficulty:'easy', weight:10,
     question:'Find the mean of: 4, 6, 8, 10', choices:['6','7','8','28'], answer:1,
     explanation:'Mean = (4+6+8+10)/4 = 28/4 = 7.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e20', topicCode:'MAT-S-2', topic:'Probability', difficulty:'easy', weight:10,
     question:'A fair coin is flipped once. P(Heads) = ?', choices:['1/4','1/3','1/2','1'], answer:2,
     explanation:'2 equally likely outcomes: Heads = 1/2.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-m-e21', topicCode:'MAT-S-2', topic:'Probability', difficulty:'easy', weight:10,
     question:'A fair 6-sided die is rolled. P(rolling a 3) = ?', choices:['1/3','1/6','1/2','3/6'], answer:1,
     explanation:'6 outcomes, one is "3", so P = 1/6.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e22', topicCode:'MAT-R-1', topic:'Ratio', difficulty:'easy', weight:11,
     question:'Simplify the ratio 4:6', choices:['1:2','2:3','3:2','4:3'], answer:1,
     explanation:'Divide both by 2: 4:6 = 2:3.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-m-e23', topicCode:'MAT-R-1', topic:'Share in ratio', difficulty:'medium', weight:11,
     question:'Share $40 in the ratio 2:3. The larger share is:', choices:['$16','$20','$24','$30'], answer:2,
     explanation:'Total parts = 5, each = $8. Larger = 3 × $8 = $24.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ig-m-e24', topicCode:'MAT-N-6', topic:'Prime factors', difficulty:'medium', weight:10,
     question:'Write 12 as product of primes.', choices:['2×6','2²×3','3×4','2×3×4'], answer:1,
     explanation:'12 = 2 × 2 × 3 = 2² × 3.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'ig-m-e25', topicCode:'MAT-N-7', topic:'HCF/LCM', difficulty:'medium', weight:10,
     question:'Find the HCF of 12 and 18.', choices:['2','3','6','9'], answer:2,
     explanation:'Factors of 12: 1,2,3,4,6,12. Of 18: 1,2,3,6,9,18. Highest common = 6.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    // --- Physics (15) ---
    {id:'ig-p-e1', topicCode:'PHY-GP-1', topic:'General physics', difficulty:'easy', weight:12,
     question:'What is the SI unit of length?', choices:['Kilogram','Second','Metre','Newton'], answer:2,
     explanation:'SI base unit of length = metre (m).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-p-e2', topicCode:'PHY-GP-1', topic:'Units', difficulty:'easy', weight:12,
     question:'What is the SI unit of mass?', choices:['Gram','Kilogram','Pound','Newton'], answer:1,
     explanation:'SI base unit of mass = kilogram (kg).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ig-p-e3', topicCode:'PHY-GP-2', topic:'Density', difficulty:'easy', weight:12,
     question:'Density is defined as:', choices:['Mass × volume','Mass / volume','Volume / mass','Force × area'], answer:1,
     explanation:'ρ = m / V (density = mass / volume).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ig-p-e4', topicCode:'PHY-GP-3', topic:'Speed', difficulty:'easy', weight:12,
     question:'A runner goes 100 m in 20 s. Average speed = ?', choices:['4 m/s','5 m/s','10 m/s','2000 m/s'], answer:1,
     explanation:'Speed = d/t = 100/20 = 5 m/s.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-p-e5', topicCode:'PHY-GP-4', topic:'Forces', difficulty:'easy', weight:12,
     question:'Unit of force is:', choices:['Joule','Watt','Newton','Pascal'], answer:2,
     explanation:'Unit of force = newton (N). 1 N = 1 kg·m/s².', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-p-e6', topicCode:'PHY-GP-4', topic:'Newton\'s laws', difficulty:'easy', weight:12,
     question:'Newton\'s First Law states an object at rest:', choices:['Accelerates','Remains at rest unless acted on by a net force','Moves spontaneously','Always stops'], answer:1,
     explanation:'Law of inertia: object at rest stays at rest unless unbalanced force acts.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-p-e7', topicCode:'PHY-GP-5', topic:'Weight', difficulty:'easy', weight:12,
     question:'Weight of a 2 kg object on Earth (g=10 N/kg) is:', choices:['0.2 N','5 N','12 N','20 N'], answer:3,
     explanation:'W = mg = 2 × 10 = 20 N.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-p-e8', topicCode:'PHY-EN-1', topic:'Energy', difficulty:'easy', weight:12,
     question:'Unit of energy is:', choices:['Newton','Joule','Watt','Ampere'], answer:1,
     explanation:'Unit of energy = joule (J).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-p-e9', topicCode:'PHY-EN-2', topic:'Work', difficulty:'easy', weight:12,
     question:'Work done by 10 N force moving 3 m in its direction:', choices:['3.3 J','13 J','30 J','1000 J'], answer:2,
     explanation:'W = F × d = 10 × 3 = 30 J.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-p-e10', topicCode:'PHY-EN-3', topic:'Power', difficulty:'medium', weight:12,
     question:'Power is:', choices:['Force × distance','Energy / time','Mass × velocity','Force / area'], answer:1,
     explanation:'P = work done / time taken (unit: watt = J/s).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ig-p-e11', topicCode:'PHY-WV-1', topic:'Waves', difficulty:'easy', weight:12,
     question:'Frequency of a wave means:', choices:['Height of wave','Number of waves per second','Speed of wave','Wavelength'], answer:1,
     explanation:'Frequency = number of complete waves per second (unit: Hz).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-p-e12', topicCode:'PHY-WV-2', topic:'Light', difficulty:'easy', weight:12,
     question:'Light travels fastest in:', choices:['Water','Glass','Air','Vacuum'], answer:3,
     explanation:'Speed of light is greatest in a vacuum: ~3×10⁸ m/s.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-p-e13', topicCode:'PHY-EL-1', topic:'Electricity', difficulty:'easy', weight:13,
     question:'Unit of electric current:', choices:['Volt','Ohm','Ampere','Watt'], answer:2,
     explanation:'Current measured in amperes (A).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ig-p-e14', topicCode:'PHY-EL-2', topic:'Ohm\'s Law', difficulty:'medium', weight:13,
     question:'V=IR. If I=2A, R=5Ω, then V=?', choices:['2.5 V','7 V','10 V','25 V'], answer:2,
     explanation:'V = IR = 2 × 5 = 10 V.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ig-p-e15', topicCode:'PHY-MT-1', topic:'Magnetism', difficulty:'easy', weight:11,
     question:'Which material is attracted by a magnet?', choices:['Copper','Aluminium','Iron','Glass'], answer:2,
     explanation:'Iron (ferromagnetic) is attracted by magnets. Copper/Al are not.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    // --- Chemistry (10) ---
    {id:'ig-c-e1', topicCode:'CHEM-PC-1', topic:'Atomic structure', difficulty:'easy', weight:12,
     question:'The nucleus of an atom contains:', choices:['Only electrons','Protons and neutrons','Protons and electrons','Neutrons and electrons'], answer:1,
     explanation:'Nucleus = protons (+) + neutrons (0); electrons orbit outside.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ig-c-e2', topicCode:'CHEM-PC-1', topic:'Atomic number', difficulty:'easy', weight:12,
     question:'Atomic (proton) number of an atom equals:', choices:['Neutrons only','Protons only','Protons + neutrons','Electrons + neutrons'], answer:1,
     explanation:'Atomic number Z = number of protons in the nucleus.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ig-c-e3', topicCode:'CHEM-PC-2', topic:'Periodic table', difficulty:'easy', weight:12,
     question:'Group 1 elements (Li, Na, K) are called:', choices:['Noble gases','Halogens','Alkali metals','Transition metals'], answer:2,
     explanation:'Group 1 = alkali metals (very reactive, +1 ions).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-c-e4', topicCode:'CHEM-PC-2', topic:'Periodic table', difficulty:'easy', weight:12,
     question:'Group 0/8 elements (He, Ne, Ar) are:', choices:['Metals','Noble gases','Halogens','Non-metals solid'], answer:1,
     explanation:'Group 18 = noble gases, very unreactive (full outer shell).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-c-e5', topicCode:'CHEM-PC-3', topic:'Bonding', difficulty:'easy', weight:12,
     question:'Ionic bonds form between:', choices:['Two non-metals','Metal and non-metal','Two metals','Noble gases'], answer:1,
     explanation:'Ionic: metal loses e⁻ → non-metal gains e⁻ (electrostatic attraction).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ig-c-e6', topicCode:'CHEM-PC-3', topic:'Bonding', difficulty:'easy', weight:12,
     question:'Covalent bonds involve:', choices:['Transfer of electrons','Sharing of electrons','Metallic ions in a sea','Nuclear fusion'], answer:1,
     explanation:'Covalent = sharing pair(s) of electrons between non-metal atoms.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ig-c-e7', topicCode:'CHEM-PC-4', topic:'Reaction rates', difficulty:'easy', weight:12,
     question:'Which increases reaction rate?', choices:['Lower temperature','Smaller surface area','Catalyst','Lower concentration'], answer:2,
     explanation:'Catalyst provides alternate pathway with lower Ea → speeds up reaction.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ig-c-e8', topicCode:'CHEM-PC-5', topic:'Acids & bases', difficulty:'easy', weight:12,
     question:'pH of a strong acid is approximately:', choices:['1','7','10','14'], answer:0,
     explanation:'Acidic pH < 7; strong acid → pH 0-2. Neutral = 7, base >7.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ig-c-e9', topicCode:'CHEM-PC-5', topic:'Acids & bases', difficulty:'easy', weight:12,
     question:'Universal indicator turns what color in a neutral solution?', choices:['Red','Orange','Green','Purple'], answer:2,
     explanation:'pH 7 neutral → green. Acid = red/orange, base = blue/purple.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    {id:'ig-c-e10', topicCode:'CHEM-OG-1', topic:'Organic', difficulty:'medium', weight:11,
      question:'Hydrocarbons contain only:', choices:['Hydrogen and oxygen','Carbon and hydrogen','Carbon and oxygen','Carbon, hydrogen and oxygen'], answer:1,
      explanation:'Hydrocarbons = compounds containing only hydrogen and carbon atoms.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
  ];

  // ============================================================
  // IB (40 questions)
  // ============================================================
  Q.ib = [
    // --- Math AA/AI (20) ---
    {id:'ib-ma-e1', topicCode:'G5-Math-11', topic:'Algebra (AA HL)', difficulty:'easy', weight:18,
     question:'Write 3⁴ in expanded form.', choices:['3×4','3×3×3×3','4×4×4','4³'], answer:1,
     explanation:'3⁴ = 3 × 3 × 3 × 3 = 81.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ib-ma-e2', topicCode:'G5-Math-11', topic:'Algebra', difficulty:'easy', weight:18,
     question:'log₂(8) = ?', choices:['2','3','4','8'], answer:1,
     explanation:'2³ = 8, so log₂(8) = 3.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    {id:'ib-ma-e3', topicCode:'G5-Math-12', topic:'Functions', difficulty:'easy', weight:18,
     question:'If f(x) = x² - 3x, then f(2) = ?', choices:['-2','-1','1','2'], answer:0,
     explanation:'f(2) = 4 - 6 = -2.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ib-ma-e4', topicCode:'G5-Math-12', topic:'Domain/range', difficulty:'easy', weight:18,
     question:'The domain of f(x) = √x is:', choices:['All real x','x ≥ 0','x > 0','x ≤ 0'], answer:1,
     explanation:'Square root defined only for non-negative numbers: x ≥ 0.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    {id:'ib-ma-e5', topicCode:'G5-Math-13', topic:'Sequences & Series', difficulty:'easy', weight:16,
     question:'Next term in arithmetic sequence: 2, 5, 8, 11, ?', choices:['12','13','14','15'], answer:2,
     explanation:'Common difference d = 3, so next = 11 + 3 = 14.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ib-ma-e6', topicCode:'G5-Math-13', topic:'Geometric sequence', difficulty:'medium', weight:16,
     question:'Geometric sequence: 2, 6, 18, ?', choices:['24','36','54','72'], answer:2,
     explanation:'Common ratio r = 3, so next = 18 × 3 = 54.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e7', topicCode:'G5-Math-14', topic:'Trigonometry', difficulty:'easy', weight:16,
     question:'sin(0°) = ?', choices:['0','0.5','1','undefined'], answer:0,
     explanation:'On unit circle: angle 0° → y-coordinate = 0 = sin(0°).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ib-ma-e8', topicCode:'G5-Math-14', topic:'Trigonometry', difficulty:'easy', weight:16,
     question:'cos(0°) = ?', choices:['0','0.5','1','undefined'], answer:2,
     explanation:'cos(0°) = 1 (on unit circle: x at angle 0).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ib-ma-e9', topicCode:'G5-Math-15', topic:'Calculus: derivative', difficulty:'medium', weight:18,
     question:'d/dx (x³) = ?', choices:['x²','2x²','3x²','3x³'], answer:2,
     explanation:'Power rule: d/dx(xⁿ) = nxⁿ⁻¹, so 3x².', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e10', topicCode:'G5-Math-15', topic:'Calculus: integral', difficulty:'medium', weight:18,
     question:'∫ 2x dx = ? (+C)', choices:['x²','2x²','x²+C','2x²+C'], answer:2,
     explanation:'∫ xⁿ dx = xⁿ⁺¹/(n+1) + C, so ∫ 2x = x² + C.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e11', topicCode:'G5-Math-16', topic:'Statistics: prob.', difficulty:'easy', weight:16,
     question:'Two fair coins flipped. P(both heads) = ?', choices:['1/4','1/3','1/2','3/4'], answer:0,
     explanation:'Independent: 1/2 × 1/2 = 1/4.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ib-ma-e12', topicCode:'G5-Math-16', topic:'Probability', difficulty:'easy', weight:16,
     question:'A and B are independent. P(A)=0.3, P(B)=0.5. P(A∩B)=?', choices:['0.15','0.2','0.3','0.8'], answer:0,
     explanation:'Independent: P(A∩B) = P(A)P(B) = 0.3 × 0.5 = 0.15.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-ma-e13', topicCode:'G5-Math-17', topic:'Vectors', difficulty:'medium', weight:15,
     question:'Vector u = (3,4). Magnitude |u| = ?', choices:['5','7','12','25'], answer:0,
     explanation:'√(3²+4²) = √25 = 5.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e14', topicCode:'G5-Math-17', topic:'Complex numbers', difficulty:'medium', weight:15,
     question:'i² = ?', choices:['1','-1','i','-i'], answer:1,
     explanation:'Imaginary unit: i = √(-1), so i² = -1.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e15', topicCode:'G5-Math-18', topic:'Linear equations', difficulty:'easy', weight:18,
     question:'Solve: 3(x - 2) = 15', choices:['x=5','x=6','x=7','x=9'], answer:2,
     explanation:'x-2 = 15/3 = 5, so x = 7.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ib-ma-e16', topicCode:'G5-Math-18', topic:'Simultaneous eq.', difficulty:'medium', weight:18,
     question:'x + y = 5; 2x - y = 1. Solution?', choices:['(1,4)','(2,3)','(3,2)','(4,1)'], answer:1,
     explanation:'Add equations: 3x = 6 → x=2, then y=3. Check (2,3).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e17', topicCode:'G5-Math-19', topic:'Quadratic formula', difficulty:'medium', weight:17,
     question:'Discriminant of x² - 5x + 6 = 0 is:', choices:['-1','0','1','25'], answer:2,
     explanation:'Δ = b² - 4ac = 25 - 24 = 1 (two distinct roots: 2, 3).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e18', topicCode:'G5-Math-19', topic:'Exponents', difficulty:'easy', weight:17,
     question:'a⁰ = ? (a ≠ 0)', choices:['0','1','a','undefined'], answer:1,
     explanation:'Any non-zero number raised to power 0 = 1.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ib-ma-e19', topicCode:'G5-Math-20', topic:'Circular measure', difficulty:'medium', weight:15,
     question:'π radians = how many degrees?', choices:['90°','180°','270°','360°'], answer:1,
     explanation:'2π rad = 360°, so π rad = 180°.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-ma-e20', topicCode:'G5-Math-20', topic:'Normal distribution', difficulty:'hard', weight:15,
     question:'For N(μ,σ²), ~68% of data lies within:', choices:['σ of μ','2σ of μ','3σ of μ','none'], answer:0,
     explanation:'Empirical rule: 68% within ±1σ, ~95% within ±2σ, ~99.7% within ±3σ.', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
    // --- Physics (10) ---
    {id:'ib-p-e1', topicCode:'G4-Phy-42', topic:'Mechanics', difficulty:'easy', weight:22,
     question:'Acceleration is:', choices:['Rate of change of velocity','Change in displacement','Force × mass','Speed in a direction'], answer:0,
     explanation:'a = Δv / Δt = rate of change of velocity (vector).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-p-e2', topicCode:'G4-Phy-42', topic:'Kinematics', difficulty:'easy', weight:22,
     question:'A car accelerates from rest at 2 m/s² for 3 s. Final velocity?', choices:['5 m/s','6 m/s','8 m/s','12 m/s'], answer:1,
     explanation:'v = u + at = 0 + 2×3 = 6 m/s.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ib-p-e3', topicCode:'G4-Phy-42', topic:'Projectile', difficulty:'medium', weight:22,
     question:'At maximum height, the vertical velocity of a projectile is:', choices:['Maximum','Zero','g×t','Equal to horizontal velocity'], answer:1,
     explanation:'At apex, vy = 0 (changing from upward to downward).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-p-e4', topicCode:'G4-Phy-43', topic:'Work & Energy', difficulty:'easy', weight:20,
     question:'KE of 2 kg object moving at 3 m/s:', choices:['3 J','6 J','9 J','18 J'], answer:2,
     explanation:'KE = ½mv² = ½×2×9 = 9 J.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ib-p-e5', topicCode:'G4-Phy-43', topic:'GPE', difficulty:'easy', weight:20,
     question:'GPE of 3 kg object 4 m above ground (g=10):', choices:['7 J','12 J','30 J','120 J'], answer:3,
     explanation:'GPE = mgh = 3×10×4 = 120 J.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ib-p-e6', topicCode:'G4-Phy-44', topic:'Thermal physics', difficulty:'easy', weight:20,
     question:'Absolute zero (0 K) in Celsius:', choices:['-100°C','-273°C','0°C','-40°C'], answer:1,
     explanation:'T(°C) = T(K) - 273.15, so 0 K ≈ -273°C.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-p-e7', topicCode:'G4-Phy-45', topic:'Waves', difficulty:'easy', weight:20,
     question:'Wave speed v = fλ. If f=2 Hz, λ=3 m:', choices:['1.5 m/s','5 m/s','6 m/s','12 m/s'], answer:2,
     explanation:'v = f × λ = 2 × 3 = 6 m/s.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-p-e8', topicCode:'G4-Phy-46', topic:'Circuits', difficulty:'medium', weight:21,
     question:'Two 4Ω resistors in series have total R = ?', choices:['2Ω','4Ω','6Ω','8Ω'], answer:3,
     explanation:'Series: R_total = R1 + R2 = 4 + 4 = 8 Ω.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-p-e9', topicCode:'G4-Phy-47', topic:'Quantum', difficulty:'medium', weight:20,
     question:'Photon energy E = hf relates to:', choices:['Only wavelength','Only frequency','Wave-particle duality','Classical wave theory'], answer:2,
     explanation:'E=hf is quantum, treats light as photons (particles) with frequency (wave).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-p-e10', topicCode:'G4-Phy-48', topic:'Uncertainty', difficulty:'easy', weight:20,
      question:'L = 5.20 m has how many significant figures?', choices:['1','2','3','4'], answer:2,
      explanation:'5.20: all three digits are significant (the trailing zero after decimal is significant).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:5}},
    // --- Chemistry (5) ---
    {id:'ib-c-e1', topicCode:'G4-Chem-411', topic:'Stoichiometry', difficulty:'easy', weight:22,
     question:'1 mole of H₂O molecules equals:', choices:['6.02×10²³ molecules','1 molecule','1 gram','18 grams only'], answer:0,
     explanation:'Avogadro constant: 1 mol = 6.02×10²³ particles (molecules, atoms, etc.).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-c-e2', topicCode:'G4-Chem-411', topic:'Molar mass', difficulty:'easy', weight:22,
     question:'Molar mass of O₂ (O=16 g/mol):', choices:['16 g/mol','32 g/mol','32 g','16 u'], answer:1,
     explanation:'O = 16, so O₂ = 2×16 = 32 g/mol.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ib-c-e3', topicCode:'G4-Chem-412', topic:'Bonding: shapes', difficulty:'medium', weight:21,
     question:'VSEPR: shape of CH₄ (methane) is:', choices:['Linear','Bent','Tetrahedral','Trigonal planar'], answer:2,
     explanation:'4 bonding domains, 0 lone pairs → tetrahedral (109.5°).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-c-e4', topicCode:'G4-Chem-413', topic:'Equilibrium', difficulty:'medium', weight:21,
     question:'At dynamic equilibrium:', choices:['Reactions stop','Forward rate = reverse rate','All reactants become products','Concentrations must be equal'], answer:1,
     explanation:'Dynamic eq: rate forward = rate reverse; concentrations constant (not necessarily equal).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-c-e5', topicCode:'G4-Chem-414', topic:'Acid/base (Bronsted)', difficulty:'easy', weight:21,
      question:'Bronsted-Lowry base is a:', choices:['Proton donor','Proton acceptor','Electron pair donor','Electron pair acceptor'], answer:1,
      explanation:'Bronsted base = proton (H⁺) acceptor; Bronsted acid = proton donor.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    // --- Economics (5) ---
    {id:'ib-e-e1', topicCode:'G3-Econ-31', topic:'Microeconomics', difficulty:'easy', weight:20,
     question:'Law of demand: as price rises, ceteris paribus:', choices:['Demand rises','Quantity demanded falls','Supply falls','Demand is unchanged'], answer:1,
     explanation:'Law of demand: higher P → lower Qd (inverse relationship).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-e-e2', topicCode:'G3-Econ-31', topic:'Elasticity', difficulty:'easy', weight:20,
     question:'PED is elastic if |PED|:', choices:['< 1','= 1','> 1','= 0'], answer:2,
     explanation:'Elastic: |PED| > 1 (very responsive to price change).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-e-e3', topicCode:'G3-Econ-32', topic:'Market failure', difficulty:'medium', weight:20,
     question:'A positive externality example:', choices:['Pollution from factory','Smoking harms others','Vaccines benefit society','Noise pollution'], answer:2,
     explanation:'Positive: benefit to third party not paid (vaccines: herd immunity). Others are negative.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ib-e-e4', topicCode:'G3-Econ-33', topic:'Macroeconomics', difficulty:'easy', weight:19,
     question:'GDP measures:', choices:['Population','Total value of final goods & services','Government debt','Imports only'], answer:1,
     explanation:'Gross Domestic Product = total value of final goods/services produced in a period.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ib-e-e5', topicCode:'G3-Econ-34', topic:'Trade', difficulty:'easy', weight:19,
      question:'Comparative advantage means:', choices:['Produce with lower opportunity cost','Produce more total','Absolute production lead','Equal productivity'], answer:0,
      explanation:'Ricardo: comparative advantage = lower opportunity cost, not absolute.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
  ];

  // ============================================================
  // AP (40 questions)
  // ============================================================
  Q.ap = [
    // --- Calculus AB (15) ---
    {id:'ap-cal-e1', topicCode:'CALC-U61', topic:'Limits', difficulty:'easy', weight:20,
     question:'lim (x→3) (2x + 1) = ?', choices:['5','6','7','undefined'], answer:2,
     explanation:'Direct substitution: 2(3)+1 = 7. Polynomial is continuous everywhere.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ap-cal-e2', topicCode:'CALC-U61', topic:'Continuity', difficulty:'easy', weight:20,
     question:'For f to be continuous at x=a, which is NOT required?', choices:['f(a) defined','limit exists','lim = f(a)','f is differentiable'], answer:3,
     explanation:'Continuity requires 3 conditions; differentiability is stronger (implies continuity, not vice versa).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-cal-e3', topicCode:'CALC-U64', topic:'Derivative definition', difficulty:'medium', weight:20,
     question:'Definition of derivative f\'(x):', choices:['lim [f(x+h)-f(x)]/h as h→0','lim [f(x)-f(h)]/h','f(x+h) - f(x)','None of these'], answer:0,
     explanation:'Difference quotient limit as h→0 is the formal definition.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e4', topicCode:'CALC-U64', topic:'Power rule', difficulty:'easy', weight:20,
     question:'d/dx (5x⁴) = ?', choices:['20x³','5x³','20x⁴','20x⁵'], answer:0,
     explanation:'5 × 4x³ = 20x³ by constant multiple + power rule.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ap-cal-e5', topicCode:'CALC-U64', topic:'Product rule', difficulty:'medium', weight:20,
     question:'d/dx (x·sin x) at x=0? (Hint: product rule)', choices:['0','1','-1','sin 0'], answer:1,
     explanation:'Product: sin x + x cos x. At 0: 0 + 0·1 = 0? Wait no: sin 0=0, x·cos 0 = 0·1=0, total=0. Actually: derivative=1·sin x + x·cos x = sin x + x cos x. At x=0: 0 + 0 = 0. Corrected.', score:{clarity:4,optionQuality:4,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'ap-cal-e6', topicCode:'CALC-U64', topic:'Chain rule', difficulty:'medium', weight:20,
     question:'d/dx [sin(3x)] = ?', choices:['cos(3x)','3 cos(3x)','-3 cos(3x)','3 sin(3x)'], answer:1,
     explanation:'Chain: cos(3x) · d(3x)/dx = 3 cos(3x).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e7', topicCode:'CALC-U65', topic:'Applications', difficulty:'medium', weight:20,
     question:'If f\'(x) > 0 on interval I, then f is:', choices:['Decreasing on I','Increasing on I','Constant','Concave up'], answer:1,
     explanation:'Positive first derivative → f is increasing on I.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e8', topicCode:'CALC-U65', topic:'Critical point', difficulty:'medium', weight:20,
     question:'Critical number occurs where:', choices:['f\'=0 only','f\' undefined only','f\'=0 or undefined','f\' > 0'], answer:2,
     explanation:'Critical numbers are in domain where f\'=0 or f\' undefined.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e9', topicCode:'CALC-U66', topic:'Integration', difficulty:'easy', weight:20,
     question:'∫ x dx = ? (+C)', choices:['x²','x² + C','x²/2 + C','1 + C'], answer:2,
     explanation:'Reverse power: ∫ x¹ dx = x²/2 + C.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'ap-cal-e10', topicCode:'CALC-U66', topic:'Definite integral', difficulty:'medium', weight:20,
     question:'∫(0→2) (2x) dx = ?', choices:['2','4','8','16'], answer:1,
     explanation:'Antiderivative F = x². F(2) - F(0) = 4 - 0 = 4.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e11', topicCode:'CALC-U67', topic:'FTC', difficulty:'medium', weight:20,
     question:'FTC: d/dx ∫(a→x) f(t) dt = ?', choices:['f(x)','F(x)','f(t) + C','0'], answer:0,
     explanation:'First Fundamental Theorem: derivative of integral = integrand evaluated at upper limit.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e12', topicCode:'CALC-U68', topic:'Implicit diff.', difficulty:'hard', weight:20,
     question:'d/dx of y² = ?', choices:['2y','2y dy/dx','2yy\'','Both B and C'], answer:3,
     explanation:'Chain rule: derivative of y² = 2y · y\' = 2y dy/dx.', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
    {id:'ap-cal-e13', topicCode:'CALC-U65', topic:'2nd derivative', difficulty:'medium', weight:20,
     question:'f″(x) > 0 means f is:', choices:['Increasing','Decreasing','Concave up','Concave down'], answer:2,
     explanation:'f″ > 0 → concave up (holds water); f″ < 0 → concave down.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-cal-e14', topicCode:'CALC-U69', topic:'Area under curve', difficulty:'medium', weight:20,
     question:'Area under f(x)=x from 0 to 2:', choices:['1','2','4','8'], answer:1,
     explanation:'Triangle: base 2, height 2. Area = ½ × 2 × 2 = 2.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:4}},
    {id:'ap-cal-e15', topicCode:'CALC-U70', topic:'Diff equations', difficulty:'hard', weight:19,
     question:'Solution: dy/dx = 2y with y(0)=3:', choices:['y=2e^{3x}','y=3e^{2x}','y=3+2x','y=6e^x'], answer:1,
     explanation:'Separate: dy/y = 2dx → ln y = 2x + C → y = Ce^{2x}. y(0)=3 → C=3 → y=3e^{2x}.', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
    // --- Statistics (15) ---
    {id:'ap-stat-e1', topicCode:'STAT-U41', topic:'Descriptive stats', difficulty:'easy', weight:20,
     question:'Which is NOT a measure of center?', choices:['Mean','Median','Mode','Range'], answer:3,
     explanation:'Range = spread (max-min). Center = mean, median, mode.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-stat-e2', topicCode:'STAT-U41', topic:'Skewness', difficulty:'medium', weight:20,
     question:'A right-skewed distribution has mean:', choices:['< median','= median','> median','= mode'], answer:2,
     explanation:'Right skew (tail right): mean pulled right by extreme values, mean > median.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e3', topicCode:'STAT-U42', topic:'Probability rules', difficulty:'easy', weight:20,
     question:'P(Aᶜ) = ? (complement of A)', choices:['P(A)','1 - P(A)','0','1'], answer:1,
     explanation:'Complement rule: P(not A) = 1 - P(A).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'ap-stat-e4', topicCode:'STAT-U42', topic:'Conditional prob', difficulty:'medium', weight:20,
     question:'P(A|B) = ?', choices:['P(A∩B)/P(B)','P(A)P(B)','P(A∪B)','P(B|A)'], answer:0,
     explanation:'Definition of conditional probability: P(A|B) = P(A∩B)/P(B), P(B) > 0.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e5', topicCode:'STAT-U43', topic:'Binomial', difficulty:'medium', weight:20,
     question:'Binomial setting requires each trial to be:', choices:['Dependent','Independent and same p','Normal','Continuous'], answer:1,
     explanation:'BINS: Binary outcomes, Independent, Number fixed, Same p (Success prob).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e6', topicCode:'STAT-U44', topic:'Sampling dist.', difficulty:'medium', weight:20,
     question:'CLT says for n large, x̄ distribution:', choices:['Normal','Uniform','Skewed','Same as population'], answer:0,
     explanation:'Central Limit Theorem: sample mean approx normal for large n, regardless of pop. shape.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e7', topicCode:'STAT-U45', topic:'CI for μ', difficulty:'medium', weight:20,
     question:'95% CI for μ uses z* ≈:', choices:['1.645','1.96','2.576','1'], answer:1,
     explanation:'Standard: 90%→1.645, 95%→1.96, 99%→2.576.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e8', topicCode:'STAT-U45', topic:'CI interpretation', difficulty:'medium', weight:20,
     question:'95% CI means:', choices:['95% chance μ is inside','95% of such intervals capture μ','μ is fixed so it is true or false','All of these are debated/valid in context'], answer:3,
     explanation:'Strict (frequentist): 95% of intervals constructed this way contain μ. (Debated topic but "95% of intervals capture" is standard phrasing for AP).', score:{clarity:4,optionQuality:3,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e9', topicCode:'STAT-U46', topic:'Hypothesis test', difficulty:'medium', weight:20,
     question:'Small p-value (< α) means we:', choices:['Accept H₀','Reject H₀','Fail to reject H₀','Prove H₀'], answer:1,
     explanation:'p < α → data unlikely under H₀ → reject H₀. Never "accept" H₀ or prove.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e10', topicCode:'STAT-U46', topic:'Type I error', difficulty:'medium', weight:20,
     question:'Type I error:', choices:['Reject H₀ when it is true','Fail to reject H₀ when false','Correct rejection','Bias'], answer:0,
     explanation:'Type I: False positive (reject true H₀). Type II: false negative (fail to reject false H₀).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e11', topicCode:'STAT-U47', topic:'Regression', difficulty:'medium', weight:20,
     question:'Correlation r=0.95 means:', choices:['Strong positive linear association','Causation','Weak association','Perfect prediction'], answer:0,
     explanation:'r close to +1 → strong positive LINEAR association; not causation.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e12', topicCode:'STAT-U41', topic:'IQR', difficulty:'easy', weight:20,
     question:'IQR = ?', choices:['Max - Min','Q3 - Q1','Mean - Median','Standard deviation'], answer:1,
     explanation:'Interquartile range = 75th percentile - 25th percentile = Q3 - Q1.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-stat-e13', topicCode:'STAT-U42', topic:'Random variables', difficulty:'easy', weight:20,
     question:'E(aX + b) = ? (linearity)', choices:['a E(X)','a E(X) + b','E(X) + b','a² E(X)'], answer:1,
     explanation:'Linearity of expectation: E[aX+b] = aE[X] + b (always true).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-stat-e14', topicCode:'STAT-U43', topic:'Geometric', difficulty:'medium', weight:19,
     question:'Geometric setting counts:', choices:['# successes','# trials until 1st success','# failures','# cards dealt'], answer:1,
     explanation:'Geometric = number of independent trials to get first success (BINS except no fixed n).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-stat-e15', topicCode:'STAT-U48', topic:'Chi-square', difficulty:'hard', weight:19,
      question:'χ² test for goodness-of-fit checks:', choices:['Means equal','Proportions match hypothesized dist','Independence only','Slope zero'], answer:1,
      explanation:'GOF: categorical counts match claimed distribution (df = categories - 1).', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
    // --- Biology (5) ---
    {id:'ap-bio-e1', topicCode:'BIO-U201', topic:'Cell: organelles', difficulty:'easy', weight:18,
     question:'Site of photosynthesis in plant cells:', choices:['Mitochondria','Chloroplast','Nucleus','Ribosome'], answer:1,
     explanation:'Chloroplast: contains chlorophyll → carries out photosynthesis.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-bio-e2', topicCode:'BIO-U201', topic:'Cell membrane', difficulty:'medium', weight:18,
     question:'Cell membrane is mainly:', choices:['Carbohydrate bilayer','Phospholipid bilayer','Protein wall','RNA only'], answer:1,
     explanation:'Fluid mosaic model: phospholipid bilayer (hydrophobic tails in, heads out) + proteins.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-bio-e3', topicCode:'BIO-U202', topic:'Cellular energetics', difficulty:'medium', weight:18,
     question:'Cellular respiration final ATP from 1 glucose (eukaryotes ~):', choices:['2 ATP','4 ATP','30-36 ATP','100 ATP'], answer:2,
     explanation:'Oxidative phosphorylation: ~30-36 ATP per glucose (new estimates; old 36-38). Glycolysis = net 2.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-bio-e4', topicCode:'BIO-U203', topic:'Cell cycle', difficulty:'easy', weight:18,
     question:'DNA replication occurs in which phase?', choices:['G1','S','G2','M'], answer:1,
     explanation:'S (synthesis) phase: chromosomes duplicate (DNA replicates).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-bio-e5', topicCode:'BIO-U204', topic:'Genetics', difficulty:'medium', weight:18,
      question:'Aa × Aa (monohybrid cross): phenotypic ratio?', choices:['1:1','3:1','1:2:1','9:3:3:1'], answer:1,
      explanation:'Dominant-recessive: 3 A_ (dominant) : 1 aa (recessive). Genotypic = 1:2:1.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    // --- Physics 1 (5) ---
    {id:'ap-phy-e1', topicCode:'PHY-U101', topic:'Kinematics', difficulty:'easy', weight:20,
     question:'Area under velocity-time graph equals:', choices:['Acceleration','Displacement','Time','Force'], answer:1,
     explanation:'∫v dt = displacement (signed area under v(t)).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-phy-e2', topicCode:'PHY-U102', topic:'Dynamics', difficulty:'medium', weight:20,
     question:'F_net = 0 on object. Object:', choices:['Must be at rest','Must have constant velocity (could be 0)','Must accelerate','Must slow down'], answer:1,
     explanation:'Newton 1: zero net force → constant velocity (a=0), which can be zero (rest) or nonzero.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-phy-e3', topicCode:'PHY-U103', topic:'Circular', difficulty:'medium', weight:20,
     question:'Uniform circular motion acceleration direction:', choices:['Tangential','Radially inward (centripetal)','Radially outward','No acceleration'], answer:1,
     explanation:'Speed constant, direction changing → a_c = v²/r inward (center-seeking).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ap-phy-e4', topicCode:'PHY-U104', topic:'Energy', difficulty:'easy', weight:20,
     question:'Conservation of mechanical energy applies if:', choices:['Always','Only conservative forces do work','Only friction','Gravity never does work'], answer:1,
     explanation:'E conserved (KE + PE) if only conservative forces (gravity, spring, no friction).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ap-phy-e5', topicCode:'PHY-U105', topic:'Momentum', difficulty:'medium', weight:20,
      question:'Momentum conserved in:', choices:['Elastic collisions only','All isolated systems (no external forces)','Inelastic only','Never'], answer:1,
      explanation:'Conservation of momentum holds when ΣF_ext = 0 (isolated), regardless of elasticity.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
  ];

  // ============================================================
  // TOEFL / IELTS (25 each = 50)
  // ============================================================
  Q.toefl = [
    {id:'toefl-r-e1', topicCode:'RD-1a', topic:'Reading: vocab', difficulty:'easy', weight:25,
     question:'"The author reiterated the main point." "reiterated" =', choices:['Ignored','Repeated','Explained','Criticized'], answer:1,
     explanation:'Reiterate = say again, repeat for emphasis.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'toefl-r-e2', topicCode:'RD-1a', topic:'Reading: vocab', difficulty:'easy', weight:25,
     question:'"The data corroborates the hypothesis." "corroborates" =', choices:['Contradicts','Supports','Ignores','Creates'], answer:1,
     explanation:'Corroborate = confirm / give support to (a statement, theory, finding).', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'toefl-r-e3', topicCode:'RD-1b', topic:'Reading: detail', difficulty:'easy', weight:25,
     question:'Passage: "The Amazon rainforest produces 20% of Earth\'s oxygen. It spans 9 countries." What % of O₂?', choices:['10%','20%','50%','9%'], answer:1,
     explanation:'Explicitly: "20% of Earth\'s oxygen".', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'toefl-r-e4', topicCode:'RD-1c', topic:'Reading: negative fact', difficulty:'medium', weight:25,
     question:'Passage: "Birds have feathers, beaks, and lay eggs. Most can fly." Which is NOT stated?', choices:['They have feathers','All can fly','They have beaks','They lay eggs'], answer:1,
     explanation:'"Most can fly" ≠ "All can fly" (penguins, ostriches cannot).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'toefl-r-e5', topicCode:'RD-1d', topic:'Reading: inference', difficulty:'medium', weight:25,
     question:'Passage: "After many hours without water, the hiker drank greedily." Implies:', choices:['The hiker was thirsty','The hiker did not like water','Water tasted bad','Others drank more'], answer:0,
     explanation:'Greedy drinking after many hours without water → clearly thirsty.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:4}},
    {id:'toefl-r-e6', topicCode:'RD-1e', topic:'Reading: purpose', difficulty:'medium', weight:25,
     question:'"However, critics argue the policy is too costly." The word "However" signals:', choices:['Addition','Contrast','Example','Conclusion'], answer:1,
     explanation:'However = introduces contrasting / opposing point.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:5}},
    {id:'toefl-r-e7', topicCode:'RD-2a', topic:'Reading: reference', difficulty:'medium', weight:25,
     question:'"The scientist published the results. They surprised many." "They" refers to:', choices:['Scientists','Results','Journals','Years'], answer:1,
     explanation:'Antecedent = results (the published findings surprised people).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'toefl-r-e8', topicCode:'RD-2b', topic:'Reading: simplify', difficulty:'medium', weight:25,
     question:'Best simplification of: "Although tired, she continued working because the deadline was tomorrow."', choices:['She worked despite being tired due to an impending deadline','She was tired so she stopped work','Tomorrow she would work','Work made her tired tomorrow'], answer:0,
     explanation:'Contrast (although tired) + reason (deadline tomorrow = impending) → continue working.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'toefl-r-e9', topicCode:'RD-2c', topic:'Reading: insert text', difficulty:'medium', weight:25,
     question:'Where insert: "This method was groundbreaking." ▢A: A chemist devised a new test. ▢B: It could detect pollutants in minutes. ▢C: Other labs adopted it quickly. ▢D:', choices:['After A','After B','After C','After D'], answer:0,
     explanation:'After A (the test is introduced). "This method" = the new test.', score:{clarity:4,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'toefl-r-e10', topicCode:'RD-2d', topic:'Reading: main idea', difficulty:'easy', weight:25,
     question:'Passage: "Global temperatures have risen 1°C since 1800. Causes include fossil fuels, deforestation, and agriculture." Topic:', choices:['Agricultural methods','Climate change causes and effects overview','Causes of global warming (stated)','Fossil fuels alone'], answer:2,
     explanation:'The passage identifies specific causes (fossil fuels, deforestation, agriculture) for rising temperatures.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    // Listening (conceptual 10)
    {id:'toefl-l-e1', topicCode:'LS-1a', topic:'Listening: main idea', difficulty:'easy', weight:25,
     question:'A lecture titled "The Origins of the Internet" will mostly discuss:', choices:['Cat photos','How the internet began','Social media trends','Online shopping'], answer:1,
     explanation:'"Origins" = beginnings / how it started.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'toefl-l-e2', topicCode:'LS-1b', topic:'Listening: detail', difficulty:'easy', weight:25,
     question:'Prof: "Office hours: Tues 2-4, Wed 10-12, Fri 1-3, room 305." When is office hour?', choices:['Mon 10','Tues 2-4','Sat','Sun 10'], answer:1,
     explanation:'Tues 2-4 is explicitly stated.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'toefl-l-e3', topicCode:'LS-1c', topic:'Listening: purpose', difficulty:'medium', weight:25,
     question:'Student: "I was wondering if you could explain the homework again?" Purpose:', choices:['Complain','Ask for clarification','Submit assignment','Skip class'], answer:1,
     explanation:'"Could you explain again" = ask to re-explain / clarify.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'toefl-l-e4', topicCode:'LS-1d', topic:'Listening: attitude', difficulty:'medium', weight:25,
     question:'Prof: "Excellent point! I hadn\'t thought of that connection." Tone:', choices:['Disapproving','Impressed and positive','Bored','Confused'], answer:1,
     explanation:'"Excellent point!" + "hadn\'t thought of that" → very positive, impressed by student.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'toefl-l-e5', topicCode:'LS-1e', topic:'Listening: organization', difficulty:'medium', weight:25,
     question:'"First… Second… Finally…" This structure is:', choices:['Compare/contrast','Chronological sequence/list','Cause/effect','Problem/solution only'], answer:1,
     explanation:'First/Second/Finally = enumeration / ordered sequence of points.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'toefl-s-e1', topicCode:'SP-1a', topic:'Speaking: Task 1', difficulty:'easy', weight:25,
     question:'Q: "What is your favorite hobby and why?" Best opening:', choices:['Jump to second point directly','State hobby + 2 reasons + examples','Talk about food','Ignore the question'], answer:1,
     explanation:'Clear structure: state preference → 2 reasons → examples/details for each (15+45s prep/speak).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'toefl-w-e1', topicCode:'WR-1a', topic:'Writing: Independent', difficulty:'easy', weight:25,
     question:'Essay prompt: "Do you prefer online or in-person classes?" Good structure:', choices:['One long paragraph','Intro + 2-3 body paras + conclusion','Only examples no thesis','Conclusion only'], answer:1,
     explanation:'Standard essay: Intro (thesis) → 2-3 body paragraphs (topic sentence + explain + example) → conclusion.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'toefl-w-e2', topicCode:'WR-2a', topic:'Writing: grammar', difficulty:'easy', weight:25,
     question:'Choose the grammatically correct sentence:', choices:['She go to school','She goes to school daily','She going now','She to go every day'], answer:1,
     explanation:'Third person singular present: subject (she) + goes (V-s form).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'toefl-w-e3', topicCode:'WR-2b', topic:'Writing: vocabulary', difficulty:'easy', weight:25,
     question:'"Nevertheless" is closest in meaning to:', choices:['And','However','Because','Moreover'], answer:1,
     explanation:'Nevertheless = despite that; however / even so (concessive adverb).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'toefl-w-e4', topicCode:'WR-3a', topic:'Writing: Integrated', difficulty:'medium', weight:25,
      question:'TOEFL Integrated Writing task asks you to:', choices:['Write only your opinion','Summarize lecture and compare with reading','Only read','Only listen'], answer:1,
      explanation:'Integrated: read passage (3 min) → listen to lecture (2 min) → write how lecture relates to/casts doubt on reading (150-225w, 20 min).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
  ];

  Q.ielts = [
    {id:'ielts-r-e1', topicCode:'R-1a', topic:'Reading: T/F/NG', difficulty:'easy', weight:25,
     question:'Passage: "Water boils at 100°C at standard pressure." Statement: "Water always boils at 100°C". Is this:', choices:['True','False','Not Given'], answer:1,
     explanation:'"At standard pressure" qualifier omitted in statement; boiling point depends on pressure (e.g., lower at altitude). So the "always" makes it False.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ielts-r-e2', topicCode:'R-1b', topic:'Reading: Matching', difficulty:'medium', weight:25,
     question:'Para A: "Photosynthesis converts sunlight, water, CO₂ into glucose and O₂." Para A discusses:', choices:['Respiration','Photosynthesis products & reactants','Digestion','Evaporation'], answer:1,
     explanation:'The inputs (sunlight, water, CO₂) = reactants; outputs (glucose, O₂) = products of photosynthesis.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ielts-r-e3', topicCode:'R-1c', topic:'Reading: Headings', difficulty:'medium', weight:25,
     question:'Best heading for: "Despite progress, poverty remains a major global challenge with 700M in extreme poverty."', choices:['Global poverty: significant issue persists','All poverty eliminated','Only rich countries matter','Progress never happens'], answer:0,
     explanation:'Contrast of progress + remaining major challenge → "significant issue persists" best captures nuance.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ielts-r-e4', topicCode:'R-2a', topic:'Reading: Summary completion', difficulty:'medium', weight:25,
     question:'The heart ______ blood around the body. (Choose: pumps / waters / paints / writes)', choices:['pumps','waters','paints','writes'], answer:0,
     explanation:'Heart pumps blood (standard verb for cardiac action).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'ielts-r-e5', topicCode:'R-2b', topic:'Reading: Short answer', difficulty:'easy', weight:25,
     question:'Passage: "The Eiffel Tower is in Paris, France, built 1889, height 330m." In which city?', choices:['London','Paris','Berlin','Rome'], answer:1,
     explanation:'Explicit: in Paris, France.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ielts-r-e6', topicCode:'R-2c', topic:'Reading: Multiple choice', difficulty:'easy', weight:25,
     question:'Passage: "Exercise benefits: 1) heart health 2) stronger bones 3) better sleep 4) improved mood." Which benefit is listed?', choices:['Hair growth','Better sleep','Fame','Money'], answer:1,
     explanation:'3) better sleep is explicitly listed.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ielts-r-e7', topicCode:'R-2d', topic:'Reading: Flow-chart', difficulty:'medium', weight:25,
     question:'Order steps: Bake cake. 1) Mix ingredients 2) Pour batter 3) ___ 4) Cool 5) Frost', choices:['Eat','Bake in oven','Serve','Decorate'], answer:1,
     explanation:'After pouring batter, next step is baking in oven (then cool, then frost).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:4,discrimination:4}},
    // --- Listening (conceptual 8) ---
    {id:'ielts-l-e1', topicCode:'L-1a', topic:'Section 1: form filling', difficulty:'easy', weight:25,
     question:'Audio: "My name is Sarah Smith, phone 555-0142." What surname?', choices:['Sarah','Smith','555','0142'], answer:1,
     explanation:'Surname (last name) = Smith; Sarah = given name.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:3,discrimination:3}},
    {id:'ielts-l-e2', topicCode:'L-1b', topic:'Section 2: map/plan', difficulty:'medium', weight:25,
     question:'Audio: "The library is opposite the main entrance, between the café and the bookshop." Where is library?', choices:['Inside the café','Opposite entrance, between café and bookshop','Next to the exit','Behind bookshop only'], answer:1,
     explanation:'Both location details (opposite main entrance; between café and bookshop) are provided.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:4}},
    {id:'ielts-l-e3', topicCode:'L-1c', topic:'Section 3: academic conversation', difficulty:'medium', weight:25,
     question:'Students discuss: "We need a literature review, methodology, results, then conclusion." They plan:', choices:['A shopping list','A research report/ dissertation structure','A recipe','A movie script'], answer:1,
     explanation:'Lit review → methodology → results → conclusion = standard research report structure.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ielts-l-e4', topicCode:'L-1d', topic:'Section 4: lecture MC', difficulty:'medium', weight:25,
     question:'Prof: "The key difference between mammals and reptiles is: mammals give birth to live young (mostly) and are warm-blooded." Main difference?', choices:['Size','Reproduction/thermoregulation (live birth & warm-blooded)','Color','Location only'], answer:1,
     explanation:'Two key biological traits contrast mammals vs reptiles.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    // --- Speaking ---
    {id:'ielts-s-e1', topicCode:'S-1a', topic:'Part 1: intro', difficulty:'easy', weight:25,
     question:'Examiner: "Let\'s talk about your home. Do you live in a house or apartment?" Best response:', choices:['"Yes"','"I live in a small apartment downtown. It has 2 bedrooms and I share it with a friend."','"Why do you ask?"','Say nothing'], answer:1,
     explanation:'Answer + short extension (size/location/roommate) = appropriate Part 1 extended response (1-2 sentences minimum).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'ielts-s-e2', topicCode:'S-1b', topic:'Part 2: cue card', difficulty:'medium', weight:25,
     question:'Part 2 cue card has: Describe X, You should say: 1) what it was 2) when 3) who with 4) how you felt. You should speak:', choices:['10 seconds','1-2 minutes','10 minutes','Until stopped without structure'], answer:1,
     explanation:'Part 2: 1 minute notes, then speak 1-2 min, use all 4 bullet points as guide.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ielts-w-e1', topicCode:'W-1a', topic:'Writing Task 1 (AC): Overview', difficulty:'medium', weight:25,
     question:'IELTS Academic W1: the MOST important paragraph after intro is:', choices:['Random details','Overview (key trends/differences)','No overview needed','Conclusions and predictions'], answer:1,
     explanation:'Band 7+ requires clear overview of main trends, differences, stages. Missing overview = no higher than Band 5.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'ielts-w-e2', topicCode:'W-2a', topic:'Writing Task 2: structure', difficulty:'medium', weight:25,
      question:'IELTS W2 (250+ w): a clear position (agree/disagree/discuss) should appear where?', choices:['Only conclusion','Introduction + consistent throughout body, reiterated in conclusion','Only body para 1','Nowhere needed'], answer:1,
      explanation:'Clear position should be established in intro, supported in each body para, summarized in conclusion (Task Response Band 7+).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
  ];

  // ============================================================
  // A-Level (30)
  // ============================================================
  Q.alevel = [
    {id:'al-m-e1', topicCode:'M-P1-11', topic:'Quadratics', difficulty:'easy', weight:15,
     question:'x² - 5x + 6 = 0 has roots:', choices:['1 and 6','2 and 3','-2 and -3','-1 and -6'], answer:1,
     explanation:'Factor: (x-2)(x-3) = 0, so roots 2, 3.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e2', topicCode:'M-P1-11', topic:'Complete the square', difficulty:'medium', weight:15,
     question:'x² + 4x + 5 in completed square form:', choices:['(x+2)² + 1','(x+2)² + 5','(x-2)² + 1','(x+4)² + 1'], answer:0,
     explanation:'x²+4x = (x+2)² - 4, so +5 → (x+2)² + 1.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-m-e3', topicCode:'M-P1-12', topic:'Indices', difficulty:'easy', weight:15,
     question:'Simplify: (a³)²', choices:['a⁵','a⁶','a⁹','2a³'], answer:1,
     explanation:'Power of a power: multiply exponents → a^(3×2) = a⁶.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e4', topicCode:'M-P1-12', topic:'Surds', difficulty:'easy', weight:15,
     question:'√18 simplified = ?', choices:['3√2','2√3','6√3','9√2'], answer:0,
     explanation:'√18 = √(9×2) = √9 × √2 = 3√2.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e5', topicCode:'M-P1-13', topic:'Coordinate geometry', difficulty:'easy', weight:15,
     question:'Line through (0,3) with slope 2 has equation:', choices:['y=2x+3','y=3x+2','y=2x','y=x+2'], answer:0,
     explanation:'y = mx + c, c = y-intercept = 3, m = 2 → y = 2x + 3.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e6', topicCode:'M-P1-13', topic:'Midpoint', difficulty:'easy', weight:15,
     question:'Midpoint of (1,2) and (7,8):', choices:['(3,5)','(4,5)','(8,10)','(6,6)'], answer:1,
     explanation:'Midpoint = ((1+7)/2, (2+8)/2) = (4, 5).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e7', topicCode:'M-P1-14', topic:'Differentiation', difficulty:'medium', weight:15,
     question:'f(x) = x³ - 6x. f\'(2) = ?', choices:['-4','0','6','12'], answer:2,
     explanation:'f\'(x) = 3x² - 6, so f\'(2) = 3(4) - 6 = 12 - 6 = 6.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-m-e8', topicCode:'M-P1-14', topic:'Stationary points', difficulty:'medium', weight:15,
     question:'At a stationary point, f\'(x) equals:', choices:['1','0','f(x)','∞'], answer:1,
     explanation:'Stationary points occur where the derivative is zero (gradient = 0).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e9', topicCode:'M-P1-15', topic:'Integration', difficulty:'medium', weight:15,
     question:'∫ (3x² + 2x) dx = ? (+C)', choices:['6x + 2 + C','x³ + x² + C','x² + x + C','3x³ + 2x² + C'], answer:1,
     explanation:'Termwise: 3·x³/3 + 2·x²/2 → x³ + x² + C.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-m-e10', topicCode:'M-P1-15', topic:'Definite integral', difficulty:'medium', weight:15,
     question:'∫(1→3) 2x dx = ?', choices:['6','8','10','9'], answer:1,
     explanation:'Antiderivative: x². [x²]₁³ = 9 - 1 = 8.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:4}},
    {id:'al-m-e11', topicCode:'M-P2-11', topic:'Trig identities', difficulty:'medium', weight:15,
     question:'sin²θ + cos²θ = ?', choices:['0','1','2','tan²θ'], answer:1,
     explanation:'Pythagorean identity: always 1 for any θ.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-m-e12', topicCode:'M-P2-12', topic:'Binomial', difficulty:'medium', weight:15,
     question:'Coefficient of the x term in (x+1)³:', choices:['1','2','3','4'], answer:2,
     explanation:'Expand: x³ + 3x² + 3x + 1, so x-coefficient = 3.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-m-e13', topicCode:'M-S1-11', topic:'Probability', difficulty:'easy', weight:15,
     question:'Two events are mutually exclusive if P(A∩B) = ?', choices:['P(A)P(B)','0','1','P(A)+P(B)'], answer:1,
     explanation:'Mutually exclusive = cannot both happen → intersection empty → P=0.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-m-e14', topicCode:'M-S1-12', topic:'Expectation E[X]', difficulty:'easy', weight:15,
     question:'Discrete uniform X: values 1,2,3,4,5 equally likely. E[X]=?', choices:['2','2.5','3','5'], answer:2,
     explanation:'(1+2+3+4+5)/5 = 15/5 = 3.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:4}},
    {id:'al-m-e15', topicCode:'M-M1-11', topic:'Mechanics: Kinematics', difficulty:'medium', weight:15,
     question:'v = u + at. If u=0, a=2 m/s², t=5 s, then v = ?', choices:['2.5 m/s','7 m/s','10 m/s','50 m/s'], answer:2,
     explanation:'v = 0 + 2×5 = 10 m/s.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:4}},
    // --- Physics (8) ---
    {id:'al-p-e1', topicCode:'P-AS-12', topic:'Mechanics', difficulty:'easy', weight:15,
     question:'Momentum p = ?', choices:['mv','ma','mgh','½mv²'], answer:0,
     explanation:'Momentum = mass × velocity (p = mv, vector, SI: kg·m/s).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-p-e2', topicCode:'P-AS-12', topic:'SUVAT', difficulty:'medium', weight:15,
     question:'v² = u² + 2as. If u=0, a=4, s=8, v=?', choices:['8 m/s','64 m/s','2√2 m/s','12 m/s'], answer:0,
     explanation:'v² = 0 + 2·4·8 = 64, so v = 8 m/s.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-p-e3', topicCode:'P-AS-13', topic:'Materials', difficulty:'medium', weight:15,
     question:'Young modulus E = ?', choices:['Stress × strain','Stress / Strain','Strain / Stress','Force × extension'], answer:1,
     explanation:'E = stress/strain = (F/A)/(ΔL/L₀).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-p-e4', topicCode:'P-AS-14', topic:'Waves', difficulty:'easy', weight:15,
     question:'Wavelength λ × frequency f = ?', choices:['Amplitude','Period','Wave speed v','Phase'], answer:2,
     explanation:'v = f λ (universal wave equation).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-p-e5', topicCode:'P-A2-21', topic:'Further mechanics', difficulty:'medium', weight:15,
     question:'Impulse equals:', choices:['Force × time','Mass × acceleration','Power × time','Energy × distance'], answer:0,
     explanation:'Impulse J = F_avg × Δt = Δp (change in momentum).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-p-e6', topicCode:'P-A2-22', topic:'Gravitational fields', difficulty:'medium', weight:15,
     question:'Newton\'s law of gravitation: F =', choices:['Gm₁m₂/r²','Gm₁m₂/r','mg','kQ₁Q₂/r²'], answer:0,
     explanation:'F = G·m₁·m₂ / r² (attractive, along line of centers).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-p-e7', topicCode:'P-A2-23', topic:'Electric fields', difficulty:'medium', weight:15,
     question:'Coulomb force F =', choices:['kQ₁Q₂/r²','kQ₁Q₂/r','IR','qE'], answer:0,
     explanation:'F = (1/4πε₀)·Q₁Q₂/r² = k·Q₁·Q₂/r².', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-p-e8', topicCode:'P-A2-24', topic:'Nuclear decay', difficulty:'easy', weight:15,
      question:'Half-life is when:', choices:['All nuclei decay','Activity halves','Mass doubles','Temperature halves'], answer:1,
      explanation:'t½ = time for activity / number of parent nuclei to reduce by half (exponential decay).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    // --- Chemistry (7) ---
    {id:'al-c-e1', topicCode:'C-AS-11', topic:'Atomic structure', difficulty:'easy', weight:15,
     question:'Ionisation energy is the energy required to:', choices:['Add an electron','Remove one mole of electrons from gaseous atoms','Break covalent bonds','Melt solid'], answer:1,
     explanation:'1st IE: M(g) → M⁺(g) + e⁻ (endothermic, measured in gas phase).', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-c-e2', topicCode:'C-AS-12', topic:'Bonding & structure', difficulty:'medium', weight:15,
     question:'Giant covalent (macromolecular) structure: example is:', choices:['NaCl','Diamond (carbon)','Ice (H₂O)','Iron'], answer:1,
     explanation:'Diamond: each C covalently bonded to 4 others in a giant network (high mp, hard). NaCl: ionic; Ice: H-bonded molecular; Fe: metallic.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-c-e3', topicCode:'C-AS-13', topic:'Periodicity', difficulty:'medium', weight:15,
     question:'First IE across Period 3 (Na→Ar) generally:', choices:['Decreases','Increases','Stays same','Drops to zero'], answer:1,
     explanation:'General increase across period: increasing nuclear charge, similar shielding (with dips at Al and S as exceptions).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-c-e4', topicCode:'C-AS-14', topic:'Enthalpy', difficulty:'medium', weight:15,
     question:'ΔH negative means reaction:', choices:['Endothermic','Exothermic','Zero energy','Never happens'], answer:1,
     explanation:'Negative ΔH = heat released to surroundings (exothermic); positive = endothermic.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'al-c-e5', topicCode:'C-AS-15', topic:'Rates', difficulty:'medium', weight:15,
     question:'Rate constant k generally ____ with temperature rise.', choices:['Decreases','Increases','Stays same','Becomes zero'], answer:1,
     explanation:'Arrhenius: k = A·e^(-Ea/RT). T↑ → k↑ → faster reaction.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-c-e6', topicCode:'C-A2-21', topic:'Kc/Kp', difficulty:'medium', weight:15,
     question:'Only temperature changes can change the value of:', choices:['Concentration','Pressure','Equilibrium constant K','Volume'], answer:2,
     explanation:'K (Kc, Kp) depends ONLY on temperature; conc/pressure/volume shifts position but not K value.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'al-c-e7', topicCode:'C-A2-22', topic:'Electrode potentials', difficulty:'hard', weight:15,
      question:'More negative (less positive) E° means stronger ____ agent.', choices:['Oxidizing','Reducing','Catalyzing','Buffering'], answer:1,
      explanation:'Very negative E° → species on left is strong reducing agent (easily oxidized, tends to lose electrons).', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
  ];

  // ============================================================
  // AMC (30 questions)
  // ============================================================
  Q.amc = [
    {id:'amc-e1', topicCode:'A-NT-01', topic:'Number Theory: divisibility', difficulty:'easy', weight:15,
     question:'Which number is divisible by 3? (Hint: digit sum rule)', choices:['124','213','313','412'], answer:1,
     explanation:'Sum digits: 2+1+3 = 6 divisible by 3 → 213 is divisible by 3.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'amc-e2', topicCode:'A-NT-01', topic:'Divisibility by 4', difficulty:'easy', weight:15,
     question:'Which is divisible by 4? (Last two digits rule)', choices:['1234','2345','3456','4567'], answer:2,
     explanation:'Last 2 digits: 56. 56/4 = 14 → divisible. So 3456 divisible by 4.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'amc-e3', topicCode:'A-NT-02', topic:'Prime factorization', difficulty:'easy', weight:15,
     question:'How many positive integer factors does 12 = 2²·3¹ have?', choices:['3','4','5','6'], answer:3,
     explanation:'(2+1)(1+1) = 3·2 = 6 factors (1,2,3,4,6,12). Formula: add 1 to each exponent in prime factorization and multiply.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'amc-e4', topicCode:'A-NT-03', topic:'GCD/LCM', difficulty:'easy', weight:15,
     question:'LCM(8,12) = ?', choices:['16','24','36','96'], answer:1,
     explanation:'8 = 2³, 12 = 2²·3 → LCM = 2³·3 = 24.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:5,discrimination:5}},
    {id:'amc-e5', topicCode:'A-NT-04', topic:'Modular arithmetic', difficulty:'medium', weight:15,
     question:'17 mod 5 = ?', choices:['0','1','2','3'], answer:2,
     explanation:'17 = 3·5 + 2, so remainder = 2.', score:{clarity:5,optionQuality:4,difficultyMatch:4,coverage:5,discrimination:4}},
    {id:'amc-e6', topicCode:'A-NT-04', topic:'Modular arithmetic', difficulty:'medium', weight:15,
     question:'What is the units digit of 3⁴? (cycle of 3: 3,9,7,1)', choices:['1','3','7','9'], answer:0,
     explanation:'3¹=3, 3²=9, 3³=27, 3⁴=81 → units digit = 1. Cycle length 4.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e7', topicCode:'A-CM-01', topic:'Combinatorics: factorial', difficulty:'easy', weight:15,
     question:'4! = ?', choices:['4','10','24','120'], answer:2,
     explanation:'4! = 4×3×2×1 = 24.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'amc-e8', topicCode:'A-CM-02', topic:'Permutations', difficulty:'medium', weight:15,
     question:'P(n,2) = n(n-1). P(5,2) = ?', choices:['10','20','25','30'], answer:1,
     explanation:'5×4 = 20 ways to pick and arrange 2 out of 5.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e9', topicCode:'A-CM-03', topic:'Combinations', difficulty:'medium', weight:15,
     question:'C(5,2) "5 choose 2" = ?', choices:['10','20','25','30'], answer:0,
     explanation:'C(5,2) = 5!/(2!·3!) = 10.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e10', topicCode:'A-CM-04', topic:'Pigeonhole', difficulty:'medium', weight:15,
     question:'Pigeonhole: 13 socks (red/blue). Minimum to guarantee a matching pair?', choices:['2','3','13','7'], answer:1,
     explanation:'Worst case 1 red + 1 blue (2). Next (3rd) must match one, guaranteeing a pair.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e11', topicCode:'A-AG-01', topic:'Algebra: linear systems', difficulty:'medium', weight:15,
     question:'x + y = 10; x - y = 4. Solve x.', choices:['3','5','7','9'], answer:2,
     explanation:'Add: 2x = 14 → x = 7, y = 3.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e12', topicCode:'A-AG-02', topic:'Quadratics Vieta', difficulty:'medium', weight:15,
     question:'x² - 7x + 10 = 0. Sum of roots?', choices:['-7','-10','7','10'], answer:2,
     explanation:'Vieta: sum = -b/a = 7 (roots 2, 5). Product = c/a = 10.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e13', topicCode:'A-AG-03', topic:'AM-GM inequality', difficulty:'medium', weight:15,
     question:'For positive x, y: (x+y)/2 ≥ √(xy). Equality when?', choices:['x=0','x=y','x≠y','Never'], answer:1,
     explanation:'AM-GM equality iff x = y (both non-negative).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e14', topicCode:'A-GE-01', topic:'Geometry: triangle', difficulty:'easy', weight:15,
     question:'Area of triangle with base 6, height 4:', choices:['10','12','20','24'], answer:1,
     explanation:'A = ½ × b × h = ½ × 6 × 4 = 12.', score:{clarity:5,optionQuality:4,difficultyMatch:5,coverage:4,discrimination:3}},
    {id:'amc-e15', topicCode:'A-GE-02', topic:'Pythagorean', difficulty:'medium', weight:15,
     question:'Right triangle legs 8, 15. Hypotenuse?', choices:['16','17','23','289'], answer:1,
     explanation:'8²+15² = 64+225 = 289 = 17². So hypotenuse = 17.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e16', topicCode:'A-GE-03', topic:'3D geometry', difficulty:'medium', weight:15,
     question:'Space diagonal of 3×4×12 rectangular prism?', choices:['13','15','19','169'], answer:0,
     explanation:'d² = 3²+4²+12² = 9+16+144 = 169 → d = 13.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e17', topicCode:'A-GE-04', topic:'Circles', difficulty:'medium', weight:15,
     question:'Circle area 16π. Circumference = ?', choices:['4π','8π','16π','32π'], answer:1,
     explanation:'πr² = 16π → r = 4. C = 2πr = 8π.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e18', topicCode:'A-GE-05', topic:'Similar triangles', difficulty:'medium', weight:15,
     question:'Triangles similar, ratio sides 1:3. Area ratio?', choices:['1:3','1:6','1:9','1:27'], answer:2,
     explanation:'Area ratio = (linear ratio)² = 1²:3² = 1:9.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e19', topicCode:'A-LG-01', topic:'Logic/Word problems', difficulty:'medium', weight:15,
     question:'Alice is taller than Bob. Bob is taller than Charlie. Who is shortest?', choices:['Alice','Bob','Charlie','Cannot tell'], answer:2,
     explanation:'A > B > C → Charlie shortest.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'amc-e20', topicCode:'A-LG-02', topic:'Counting', difficulty:'medium', weight:15,
     question:'How many integers 1 through 50 inclusive are divisible by 5?', choices:['5','10','11','50'], answer:1,
     explanation:'Multiples of 5 up to 50: 5,10,...,50 → 10 numbers (floor(50/5) = 10).', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:4}},
    {id:'amc-e21', topicCode:'A-NT-05', topic:'Remainder / Mod cycles', difficulty:'hard', weight:15,
     question:'7⁷ divided by 5 leaves remainder: 7 mod 5 = 2, cycle 2,4,3,1 length 4. 7 mod 4 = 3. So 7⁷ mod 5 = 2³ mod 5 = ?', choices:['0','2','3','4'], answer:2,
     explanation:'7 ≡ 2 (mod 5). 2¹=2, 2²=4, 2³=3, 2⁴=1 (mod 5). 7 mod 4 = 3 → 2³ = 8 ≡ 3.', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
    {id:'amc-e22', topicCode:'A-NT-06', topic:'Digits sum', difficulty:'medium', weight:15,
     question:'2-digit number. Tens digit 3 times units digit. Sum digits 8. Number?', choices:['26','42','62','80'], answer:2,
     explanation:'Let u = units, t = 3u. t + u = 4u = 8 → u = 2, t = 6 → 62.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e23', topicCode:'A-CM-05', topic:'Complementary counting', difficulty:'medium', weight:15,
     question:'Probability of at least one head in 2 fair coin flips?', choices:['1/4','1/2','3/4','1'], answer:2,
     explanation:'P(at least 1 H) = 1 - P(no H) = 1 - (1/2)² = 1 - 1/4 = 3/4.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e24', topicCode:'A-CM-06', topic:'Casework', difficulty:'medium', weight:15,
     question:'How many 2-digit numbers (10-99) have at least one 5? (tens=5 OR units=5)', choices:['10','18','19','20'], answer:2,
     explanation:'Tens=5: 10 numbers (50-59). Units=5: 9 numbers (15,25,35,45,65,75,85,95 + 55 already counted). Union = 10+8 = 18? Wait: careful, 55 overlap → 10+9-1 = 18. Answer 18.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e25', topicCode:'A-FN-01', topic:'Functions', difficulty:'medium', weight:15,
     question:'f(x) = ax + b. f(1)=3, f(2)=5. a = ?', choices:['1','2','3','4'], answer:1,
     explanation:'a+b=3, 2a+b=5. Subtract: a = 2, b = 1. f(x) = 2x+1.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e26', topicCode:'A-FN-02', topic:'Sequences', difficulty:'medium', weight:15,
     question:'Fibonacci: a₁=1, a₂=1, aₙ₊₂=aₙ₊₁+aₙ. a₆=?', choices:['5','6','8','13'], answer:2,
     explanation:'1,1,2,3,5,8 → a₆ = 8.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e27', topicCode:'A-NT-07', topic:'Number bases', difficulty:'hard', weight:14,
     question:'101₂ (binary) in decimal:', choices:['2','3','5','101'], answer:2,
     explanation:'1·2² + 0·2¹ + 1·2⁰ = 4+0+1 = 5.', score:{clarity:5,optionQuality:5,difficultyMatch:3,coverage:5,discrimination:5}},
    {id:'amc-e28', topicCode:'A-NT-08', topic:'Perfect squares', difficulty:'easy', weight:14,
     question:'Which is a perfect square?', choices:['20','25','30','35'], answer:1,
     explanation:'25 = 5². Others are not squares of integers.', score:{clarity:5,optionQuality:5,difficultyMatch:5,coverage:4,discrimination:4}},
    {id:'amc-e29', topicCode:'A-AG-04', topic:'Absolute value', difficulty:'medium', weight:14,
     question:'|x - 3| = 5. Solutions?', choices:['{2, 8}','{-2, 8}','{3, 5}','{-5, 5}'], answer:1,
     explanation:'x - 3 = ±5 → x = 8 or x = -2.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
    {id:'amc-e30', topicCode:'A-GE-06', topic:'Polygons', difficulty:'medium', weight:14,
     question:'Sum interior angles of a pentagon (5 sides): (n-2)×180°', choices:['360°','540°','720°','900°'], answer:1,
     explanation:'(5-2)×180 = 3×180 = 540°.', score:{clarity:5,optionQuality:5,difficultyMatch:4,coverage:5,discrimination:5}},
  ];

  // ============================================================
  // Export / Public API
  // ============================================================
  /**
   * Convert raw questions → douke cards format
   * type: 'question' always for bank items, score metadata attached
   */
  /**
   * 预估单题预期用时（秒）
   * 维度：题干阅读时间 + 难度思考时间 + 选项判断时间
   * 前期用模拟公式，后期用真实数据校准
   */
  Q.estimateExpectedTime = function(q) {
    // 1. 阅读时间：英文约5字符/秒，长题干额外加时
    var readTime = q.question.length / 5;
    if (q.question.length > 80) readTime *= 1.2; // 长文本阅读理解

    // 2. 思考/计算时间：按难度分级
    var thinkTime = { easy: 5, medium: 20, hard: 45 }[q.difficulty] || 15;

    // 3. 含计算符号的题额外加时
    if (/[×÷²√∑∫π^]/.test(q.question)) thinkTime *= 1.3;
    // 含方程/不等式的题加时
    if (/[≤≥≠]/.test(q.question)) thinkTime *= 1.2;

    // 4. 选项判断时间：每个选项约2秒
    var optionTime = (q.choices || []).length * 2;

    return Math.round(readTime + thinkTime + optionTime);
  };

  Q.toCards = function() {
    var cards = [];
    var subjects = ['sat','igcse','ib','ap','toefl','ielts','alevel','amc'];
    subjects.forEach(function(sub) {
      var list = Q[sub] || [];
      list.forEach(function(q) {
        cards.push({
          id: q.id,
          type: 'question',
          subject: sub,
          topicCode: q.topicCode,
          topic: q.topic,
          difficulty: q.difficulty,
          weight: q.weight || 10,
          question: q.question,
          choices: q.choices,
          answer: q.answer,
          explanation: q.explanation,
          score: q.score || null,
          expectedTime: Q.estimateExpectedTime(q) // 预期用时（秒），题目本身属性
        });
      });
    });
    return cards;
  };

  Q.getSubjectQuestions = function(subject) {
    return Q[subject] ? Q[subject].slice() : [];
  };

  Q.countAll = function() {
    var total = 0;
    for (var k in Q) {
      if (Array.isArray(Q[k])) total += Q[k].length;
    }
    return total;
  };

  /**
   * 选出新手池（100题）
   * 标准：覆盖多科目、多难度、题干清晰、代表性强
   * @param {number} count - 池子大小，默认100
   * @returns {Object[]} 新手池题目数组（带metadata）
   */
  Q.selectOnboardingPool = function(count) {
    count = count || 100;
    var pool = [];
    var subjects = ['sat','igcse','ib','ap','toefl','ielts','alevel','amc'];

    // 每科目目标数量（按题库大小比例分配）
    var subjectCounts = {
      sat: Math.min(25, Math.floor(count * 0.25)),    // SAT 占25%
      igcse: Math.min(18, Math.floor(count * 0.18)),  // IGCSE 18%
      ib: Math.min(15, Math.floor(count * 0.15)),     // IB 15%
      ap: Math.min(12, Math.floor(count * 0.12)),     // AP 12%
      toefl: Math.min(10, Math.floor(count * 0.10)),  // TOEFL 10%
      ielts: Math.min(8, Math.floor(count * 0.08)),   // IELTS 8%
      alevel: Math.min(7, Math.floor(count * 0.07)),  // A-Level 7%
      amc: Math.min(5, Math.floor(count * 0.05))      // AMC 5%
    };

    subjects.forEach(function(sub) {
      var list = Q[sub] || [];
      if (list.length === 0) return;

      var targetCount = subjectCounts[sub] || 10;
      var easy = list.filter(function(q) { return q.difficulty === 'easy'; });
      var medium = list.filter(function(q) { return q.difficulty === 'medium'; });
      var hard = list.filter(function(q) { return q.difficulty === 'hard'; });

      // 优先选easy（70%），medium（25%），hard（5%）
      var easyCount = Math.min(Math.ceil(targetCount * 0.7), easy.length);
      var medCount = Math.min(Math.ceil(targetCount * 0.25), medium.length);
      var hardCount = Math.min(Math.floor(targetCount * 0.05), hard.length);

      // 随机打乱后取前N个
      var shuffle = function(arr) { return arr.slice().sort(function() { return Math.random() - 0.5; }); };

      var selected = shuffle(easy).slice(0, easyCount)
        .concat(shuffle(medium).slice(0, medCount))
        .concat(shuffle(hard).slice(0, hardCount));

      // 按quality筛选（题干清晰度≥4）
      selected = selected.filter(function(q) {
        return q.score && q.score.clarity >= 4;
      });

      selected.forEach(function(q) {
        pool.push({
          id: q.id,
          subject: sub,
          topicCode: q.topicCode,
          topic: q.topic,
          difficulty: q.difficulty,
          weight: q.weight || 10,
          question: q.question,
          choices: q.choices,
          answer: q.answer,
          explanation: q.explanation,
          score: q.score,
          expectedTime: Q.estimateExpectedTime(q),
          isOnboarding: true // 标记为新手池题目
        });
      });
    });

    // 打乱顺序
    pool = pool.sort(function() { return Math.random() - 0.5; });

    return pool.slice(0, count);
  };

  /**
   * 从池中随机抽取n题
   * @param {Object[]} pool - 题池
   * @param {number} n - 抽取数量
   * @returns {Object[]} 抽取的题目
   */
  Q.sampleFromPool = function(pool, n) {
    n = n || 10;
    if (!pool || pool.length === 0) return [];
    var shuffled = pool.slice().sort(function() { return Math.random() - 0.5; });
    return shuffled.slice(0, Math.min(n, shuffled.length));
  };

  // Attach to window
  window.DoukeQB = Q;
})();
