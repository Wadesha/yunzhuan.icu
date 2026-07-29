(function() {
  'use strict';

  var STORAGE_KEY = 'vocab_progress';

  var WORD_LISTS = {
    toefl: [
      { word: 'abundant', pos: 'adj', def: '丰富的；充裕的', ex: 'The region has abundant natural resources.' },
      { word: 'accommodate', pos: 'v', def: '容纳；适应', ex: 'The hotel can accommodate 500 guests.' },
      { word: 'advocate', pos: 'v/n', def: '提倡；拥护者', ex: 'She advocates for equal education rights.' },
      { word: 'ambiguous', pos: 'adj', def: '模棱两可的；含糊的', ex: 'His response was ambiguous.' },
      { word: 'analyze', pos: 'v', def: '分析；解析', ex: 'We need to analyze the data carefully.' },
      { word: 'anticipate', pos: 'v', def: '预期；期望', ex: 'We anticipate a rise in sales.' },
      { word: 'arbitrary', pos: 'adj', def: '任意的；武断的', ex: 'The decision seemed arbitrary.' },
      { word: 'assumption', pos: 'n', def: '假设；前提', ex: 'The assumption is that prices will stay stable.' },
      { word: 'bias', pos: 'n', def: '偏见；偏心', ex: 'The study showed a clear bias.' },
      { word: 'collaborate', pos: 'v', def: '合作；协作', ex: 'We collaborated on the project.' },
      { word: 'comprehensive', pos: 'adj', def: '全面的；综合的', ex: 'The report was comprehensive.' },
      { word: 'conform', pos: 'v', def: '遵守；符合', ex: 'All buildings must conform to safety codes.' },
      { word: 'controversial', pos: 'adj', def: '有争议的', ex: 'The new policy is highly controversial.' },
      { word: 'demonstrate', pos: 'v', def: '证明；演示', ex: 'The experiment demonstrates the principle.' },
      { word: 'discrepancy', pos: 'n', def: '差异；不一致', ex: 'There is a discrepancy in the numbers.' },
      { word: 'elaborate', pos: 'adj/v', def: '精心制作的；详细阐述', ex: 'Could you elaborate on your plan?' },
      { word: 'emerge', pos: 'v', def: '出现；浮现', ex: 'New evidence has emerged.' },
      { word: 'exceed', pos: 'v', def: '超过；超越', ex: 'Sales exceeded expectations.' },
      { word: 'facilitate', pos: 'v', def: '促进；使便利', ex: 'The new software facilitates collaboration.' },
      { word: 'fluctuate', pos: 'v', def: '波动；起伏', ex: 'Stock prices fluctuate daily.' },
      { word: 'fundamental', pos: 'adj', def: '基本的；根本的', ex: 'Freedom is a fundamental right.' },
      { word: 'generate', pos: 'v', def: '产生；生成', ex: 'Solar panels generate electricity.' },
      { word: 'hypothesis', pos: 'n', def: '假设', ex: 'The scientist tested her hypothesis.' },
      { word: 'implement', pos: 'v', def: '实施；执行', ex: 'The company will implement new rules.' },
      { word: 'indicate', pos: 'v', def: '表明；指示', ex: 'The data indicates a positive trend.' },
      { word: 'inevitable', pos: 'adj', def: '不可避免的', ex: 'Change is inevitable.' },
      { word: 'manipulate', pos: 'v', def: '操纵；操作', ex: 'He can manipulate the data.' },
      { word: 'notion', pos: 'n', def: '概念；观念', ex: 'The notion of equality is fundamental.' },
      { word: 'phenomenon', pos: 'n', def: '现象', ex: 'Climate change is a global phenomenon.' },
      { word: 'plausible', pos: 'adj', def: '合理的；似真的', ex: 'That is a plausible explanation.' },
      { word: 'prevalent', pos: 'adj', def: '普遍的；盛行的', ex: 'This disease is prevalent in tropical areas.' },
      { word: 'proliferate', pos: 'v', def: '激增；扩散', ex: 'Smartphones have proliferated rapidly.' },
      { word: 'reluctant', pos: 'adj', def: '不情愿的', ex: 'She was reluctant to change her plan.' },
      { word: 'significant', pos: 'adj', def: '重要的；显著的', ex: 'The results are statistically significant.' },
      { word: 'sustainable', pos: 'adj', def: '可持续的', ex: 'We need sustainable development.' },
      { word: 'tentative', pos: 'adj', def: '暂定的；试探性的', ex: 'We have a tentative agreement.' },
      { word: 'vague', pos: 'adj', def: '模糊的；含糊的', ex: 'His answer was vague.' },
      { word: 'virtually', pos: 'adv', def: '几乎；实际上', ex: 'The project is virtually complete.' },
      { word: 'warrant', pos: 'v/n', def: '证明正当；授权', ex: 'The evidence warrants further investigation.' },
      { word: 'yield', pos: 'v/n', def: '产生；屈服', ex: 'The investment yielded high returns.' },
      { word: 'aggravate', pos: 'v', def: '加重；恶化', ex: 'Stress can aggravate the condition.' },
      { word: 'approximate', pos: 'adj/v', def: '近似的；估计', ex: 'The cost was approximately $500.' },
      { word: 'articulate', pos: 'adj/v', def: '善于表达的；明确表达', ex: 'She articulated her ideas clearly.' },
      { word: 'cater', pos: 'v', def: '迎合；承办酒席', ex: 'The service caters to all needs.' },
      { word: 'compatible', pos: 'adj', def: '兼容的；和谐的', ex: 'The software is compatible with all devices.' },
      { word: 'compulsory', pos: 'adj', def: '强制的；义务的', ex: 'Education is compulsory until age 16.' },
      { word: 'conceive', pos: 'v', def: '构思；想象', ex: 'I cannot conceive of a reason to do this.' },
      { word: 'constitute', pos: 'v', def: '构成；组成', ex: 'These elements constitute a new compound.' },
      { word: 'deteriorate', pos: 'v', def: '恶化；变坏', ex: 'His health deteriorated rapidly.' },
      { word: 'eliminate', pos: 'v', def: '消除；淘汰', ex: 'We must eliminate all errors.' },
      { word: 'embark', pos: 'v', def: '开始；登船', ex: 'We are embarking on a new project.' },
      { word: 'encompass', pos: 'v', def: '包含；围绕', ex: 'The course encompasses many topics.' },
      { word: 'exploit', pos: 'v', def: '利用；开发', ex: 'We should exploit renewable energy.' },
      { word: 'hierarchy', pos: 'n', def: '等级；层次', ex: 'There is a clear hierarchy in the company.' },
      { word: 'integrate', pos: 'v', def: '整合；融入', ex: 'We need to integrate the systems.' },
      { word: 'legitimate', pos: 'adj', def: '合法的；正当的', ex: 'That is a legitimate concern.' },
      { word: 'mitigate', pos: 'v', def: '减轻；缓和', ex: 'We need to mitigate the risks.' },
      { word: 'overlook', pos: 'v', def: '忽视；俯视', ex: 'Do not overlook the details.' },
      { word: 'perceive', pos: 'v', def: '感知；察觉', ex: 'We perceive the world through our senses.' },
      { word: 'prominent', pos: 'adj', def: '突出的；著名的', ex: 'She is a prominent scientist.' },
      { word: 'reconcile', pos: 'v', def: '调和；和解', ex: 'They reconciled their differences.' },
      { word: 'sophisticated', pos: 'adj', def: '复杂的；精密的', ex: 'The equipment is highly sophisticated.' },
      { word: 'substantial', pos: 'adj', def: '大量的；实质的', ex: 'There has been substantial growth.' },
      { word: 'transcend', pos: 'v', def: '超越', ex: 'Great art can transcend cultural barriers.' },
      { word: 'undermine', pos: 'v', def: '削弱；破坏', ex: 'This could undermine trust.' },
      { word: 'versatile', pos: 'adj', def: '多才多艺的；通用的', ex: 'He is a versatile performer.' },
      { word: 'vulnerable', pos: 'adj', def: '脆弱的；易受攻击的', ex: 'Children are particularly vulnerable.' },
      { word: 'advocate', pos: 'v/n', def: '提倡；拥护者', ex: 'She advocates for change.' },
      { word: 'ambivalent', pos: 'adj', def: '矛盾的；摇摆不定的', ex: 'He felt ambivalent about the decision.' },
      { word: 'bolster', pos: 'v', def: '支持；增强', ex: 'We need to bolster our defenses.' },
      { word: 'compatible', pos: 'adj', def: '兼容的', ex: 'The parts are compatible.' },
      { word: 'diligent', pos: 'adj', def: '勤勉的；勤奋的', ex: 'She is a diligent student.' },
      { word: 'endeavor', pos: 'n/v', def: '努力；尝试', ex: 'We will endeavor to succeed.' },
      { word: 'inevitable', pos: 'adj', def: '不可避免的', ex: 'Death is inevitable.' },
      { word: 'meticulous', pos: 'adj', def: '一丝不苟的', ex: 'She is meticulous about details.' },
      { word: 'profound', pos: 'adj', def: '深远的；深刻的', ex: 'The impact was profound.' },
      { word: 'resilient', pos: 'adj', def: '有韧性的；能恢复的', ex: 'Children are generally resilient.' },
      { word: 'ubiquitous', pos: 'adj', def: '无处不在的', ex: 'Smartphones are ubiquitous today.' },
      { word: 'acquire', pos: 'v', def: '获得；取得', ex: 'She acquired a new skill.' },
      { word: 'appreciate', pos: 'v', def: '欣赏；感激', ex: 'I appreciate your help.' },
      { word: 'contemplate', pos: 'v', def: '沉思；考虑', ex: 'He contemplated the offer.' },
      { word: 'deliberate', pos: 'adj/v', def: '故意的；深思熟虑', ex: 'It was a deliberate choice.' },
      { word: 'elicit', pos: 'v', def: '引出；诱出', ex: 'The question elicited a strong response.' },
      { word: 'foster', pos: 'v', def: '促进；培养', ex: 'We should foster creativity.' },
      { word: 'grasp', pos: 'v', def: '抓住；领会', ex: 'I cannot grasp the concept.' },
      { word: 'hinder', pos: 'v', def: '阻碍；妨碍', ex: 'The rain hindered the work.' },
      { word: 'initiate', pos: 'v', def: '发起；开始', ex: 'She initiated the project.' },
      { word: 'justify', pos: 'v', def: '证明...正当', ex: 'You must justify your decision.' },
      { word: 'linger', pos: 'v', def: '徘徊；逗留', ex: 'The smell lingered in the room.' },
      { word: 'magnify', pos: 'v', def: '放大；夸大', ex: 'The lens magnified the image.' },
      { word: 'negotiate', pos: 'v', def: '谈判；协商', ex: 'They negotiated a deal.' },
      { word: 'obstacle', pos: 'n', def: '障碍；阻碍', ex: 'There are many obstacles to overcome.' },
      { word: 'persist', pos: 'v', def: '坚持；持续', ex: 'She persisted despite difficulties.' },
      { word: 'remedy', pos: 'n/v', def: '补救；治疗', ex: 'We need a remedy for the problem.' },
      { word: 'vigilant', pos: 'adj', def: '警惕的', ex: 'We must remain vigilant.' }
    ],
    ielts: [
      { word: 'adhere', pos: 'v', def: '坚持；黏附', ex: 'We must adhere to the rules.' },
      { word: 'ambiguous', pos: 'adj', def: '模糊的；不明确的', ex: 'The instructions were ambiguous.' },
      { word: 'assess', pos: 'v', def: '评估；评定', ex: 'We need to assess the risks.' },
      { word: 'beneficial', pos: 'adj', def: '有益的', ex: 'Exercise is beneficial for health.' },
      { word: 'coherent', pos: 'adj', def: '连贯的；一致的', ex: 'She gave a coherent explanation.' },
      { word: 'comprise', pos: 'v', def: '包含；由...组成', ex: 'The team comprises five members.' },
      { word: 'conceive', pos: 'v', def: '构思；设想', ex: 'I cannot conceive of a reason.' },
      { word: 'conform', pos: 'v', def: '遵守；符合', ex: 'All students must conform to rules.' },
      { word: 'consequence', pos: 'n', def: '后果；结果', ex: 'The consequences were severe.' },
      { word: 'crucial', pos: 'adj', def: '关键的；决定性的', ex: 'This is a crucial moment.' },
      { word: 'demolish', pos: 'v', def: '拆除；毁坏', ex: 'They demolished the old building.' },
      { word: 'displace', pos: 'v', def: '取代；移置', ex: 'Machines have displaced workers.' },
      { word: 'dwindle', pos: 'v', def: '减少；缩小', ex: 'The population has dwindled.' },
      { word: 'emerge', pos: 'v', def: '出现；发展', ex: 'New patterns have emerged.' },
      { word: 'enhance', pos: 'v', def: '提高；增强', ex: 'The software enhances productivity.' },
      { word: 'equivalent', pos: 'adj/n', def: '等同的；等价物', ex: 'One mile is equivalent to 1.6 km.' },
      { word: 'evident', pos: 'adj', def: '明显的；明白的', ex: 'The evidence is evident.' },
      { word: 'fluctuation', pos: 'n', def: '波动；起伏', ex: 'There are price fluctuations.' },
      { word: 'implement', pos: 'v', def: '实施；执行', ex: 'The plan was implemented in 2023.' },
      { word: 'inevitable', pos: 'adj', def: '不可避免的', ex: 'Change is inevitable.' },
      { word: 'integrate', pos: 'v', def: '整合；融入', ex: 'We need to integrate the systems.' },
      { word: 'legitimate', pos: 'adj', def: '合法的；正当的', ex: 'That is a legitimate claim.' },
      { word: 'manipulate', pos: 'v', def: '操纵；控制', ex: 'He manipulated the data.' },
      { word: 'notion', pos: 'n', def: '概念；观点', ex: 'The notion is widely accepted.' },
      { word: 'obstacle', pos: 'n', def: '障碍', ex: 'There are many obstacles.' },
      { word: 'participate', pos: 'v', def: '参与；参加', ex: 'All students should participate.' },
      { word: 'perceive', pos: 'v', def: '感知；察觉', ex: 'We perceive through senses.' },
      { word: 'phenomenon', pos: 'n', def: '现象', ex: 'It is a natural phenomenon.' },
      { word: 'prevalent', pos: 'adj', def: '普遍的；流行的', ex: 'Smoking is less prevalent now.' },
      { word: 'prominent', pos: 'adj', def: '著名的；突出的', ex: 'She is a prominent figure.' },
      { word: 'reluctant', pos: 'adj', def: '不情愿的', ex: 'He was reluctant to agree.' },
      { word: 'significant', pos: 'adj', def: '重要的；显著的', ex: 'There is a significant difference.' },
      { word: 'sustainable', pos: 'adj', def: '可持续的', ex: 'We need sustainable energy.' },
      { word: 'transcend', pos: 'v', def: '超越', ex: 'Art can transcend culture.' },
      { word: 'undermine', pos: 'v', def: '削弱；破坏', ex: 'This undermines trust.' },
      { word: 'vulnerable', pos: 'adj', def: '脆弱的', ex: 'Elderly people are vulnerable.' },
      { word: 'acquire', pos: 'v', def: '获得；学会', ex: 'She acquired new skills.' },
      { word: 'advocate', pos: 'v', def: '提倡；支持', ex: 'She advocates equality.' },
      { word: 'benefit', pos: 'n/v', def: '利益；受益', ex: 'We all benefit from this.' },
      { word: 'collapse', pos: 'v/n', def: '倒塌；崩溃', ex: 'The building collapsed.' },
      { word: 'compatible', pos: 'adj', def: '兼容的', ex: 'They are compatible.' },
      { word: 'complement', pos: 'v/n', def: '补充', ex: 'The sauce complements the dish.' },
      { word: 'consequence', pos: 'n', def: '后果', ex: 'Consider the consequences.' },
      { word: 'contaminate', pos: 'v', def: '污染', ex: 'The water was contaminated.' },
      { word: 'convince', pos: 'v', def: '说服', ex: 'He convinced me to go.' },
      { word: 'deliberate', pos: 'adj', def: '故意的；审慎的', ex: 'It was a deliberate decision.' },
      { word: 'deteriorate', pos: 'v', def: '恶化', ex: 'His health deteriorated.' },
      { word: 'eliminate', pos: 'v', def: '消除', ex: 'Eliminate the errors.' },
      { word: 'emphasize', pos: 'v', def: '强调', ex: 'She emphasized the importance.' },
      { word: 'enhance', pos: 'v', def: '增强', ex: 'Enhance the image.' },
      { word: 'exploit', pos: 'v', def: '开发；利用', ex: 'Exploit natural resources.' },
      { word: 'facilitate', pos: 'v', def: '促进；使便利', ex: 'Technology facilitates work.' },
      { word: 'fundamental', pos: 'adj', def: '基本的', ex: 'A fundamental right.' },
      { word: 'generate', pos: 'v', def: '产生；生成', ex: 'Generate power.' },
      { word: 'gradual', pos: 'adj', def: '逐渐的', ex: 'A gradual increase.' },
      { word: 'implement', pos: 'v', def: '实施', ex: 'Implement the changes.' },
      { word: 'incentive', pos: 'n', def: '激励；动机', ex: 'There is no incentive to work.' },
      { word: 'initiate', pos: 'v', def: '发起', ex: 'Initiate the process.' },
      { word: 'integrate', pos: 'v', def: '整合', ex: 'Integrate into society.' },
      { word: 'justify', pos: 'v', def: '证明...合理', ex: 'Justify the decision.' },
      { word: 'legitimate', pos: 'adj', def: '合法的', ex: 'A legitimate business.' },
      { word: 'manipulate', pos: 'v', def: '操纵', ex: 'Manipulate the data.' },
      { word: 'maximize', pos: 'v', def: '最大化', ex: 'Maximize efficiency.' },
      { word: 'minimize', pos: 'v', def: '最小化', ex: 'Minimize the risk.' },
      { word: 'negotiate', pos: 'v', def: '谈判；协商', ex: 'Negotiate a contract.' },
      { word: 'notion', pos: 'n', def: '概念；观念', ex: 'The notion of freedom.' },
      { word: 'obstacle', pos: 'n', def: '障碍', ex: 'Overcome obstacles.' },
      { word: 'optimize', pos: 'v', def: '优化', ex: 'Optimize performance.' },
      { word: 'participate', pos: 'v', def: '参与', ex: 'Participate actively.' },
      { word: 'perceive', pos: 'v', def: '感知；认为', ex: 'Perceive a difference.' },
      { word: 'phenomenon', pos: 'n', def: '现象', ex: 'A natural phenomenon.' },
      { word: 'plausible', pos: 'adj', def: '合理的', ex: 'A plausible reason.' },
      { word: 'prevalent', pos: 'adj', def: '普遍的', ex: 'A prevalent problem.' },
      { word: 'prioritize', pos: 'v', def: '优先处理', ex: 'Prioritize the tasks.' },
      { word: 'prominent', pos: 'adj', def: '突出的；著名的', ex: 'A prominent feature.' },
      { word: 'reluctant', pos: 'adj', def: '不情愿的', ex: 'Reluctant to change.' },
      { word: 'significant', pos: 'adj', def: '重要的', ex: 'A significant amount.' },
      { word: 'sophisticated', pos: 'adj', def: '复杂的；精密的', ex: 'A sophisticated system.' },
      { word: 'substantial', pos: 'adj', def: '大量的', ex: 'Substantial growth.' },
      { word: 'sustainable', pos: 'adj', def: '可持续的', ex: 'Sustainable development.' },
      { word: 'tentative', pos: 'adj', def: '暂定的；试探性的', ex: 'A tentative plan.' },
      { word: 'transcend', pos: 'v', def: '超越', ex: 'Transcend boundaries.' },
      { word: 'undermine', pos: 'v', def: '削弱', ex: 'Undermine authority.' },
      { word: 'utilize', pos: 'v', def: '利用', ex: 'Utilize resources.' },
      { word: 'vulnerable', pos: 'adj', def: '脆弱的', ex: 'Vulnerable groups.' },
      { word: 'aggregate', pos: 'n/adj', def: '总计；总数的', ex: 'The aggregate cost was high.' },
      { word: 'biased', pos: 'adj', def: '有偏见的', ex: 'A biased report.' },
      { word: 'coherent', pos: 'adj', def: '连贯的', ex: 'A coherent argument.' },
      { word: 'endeavor', pos: 'n/v', def: '努力；尝试', ex: 'Make every endeavor.' },
      { word: 'fluctuate', pos: 'v', def: '波动', ex: 'Prices fluctuate.' },
      { word: 'inevitable', pos: 'adj', def: '不可避免的', ex: 'Inevitable changes.' },
      { word: 'meticulous', pos: 'adj', def: '一丝不苟的', ex: 'Meticulous research.' },
      { word: 'profound', pos: 'adj', def: '深远的', ex: 'A profound impact.' },
      { word: 'resilient', pos: 'adj', def: '有韧性的', ex: 'A resilient material.' },
      { word: 'ubiquitous', pos: 'adj', def: '无处不在的', ex: 'Smartphones are ubiquitous.' }
    ],
    sat: [
      { word: 'aberration', pos: 'n', def: '异常；偏差', ex: 'This behavior is an aberration.' },
      { word: 'abstruse', pos: 'adj', def: '深奥的；难解的', ex: 'The theory is abstruse.' },
      { word: 'acclaim', pos: 'n/v', def: '称赞；喝彩', ex: 'The play received critical acclaim.' },
      { word: 'admonish', pos: 'v', def: '告诫；警告', ex: 'She admonished the child.' },
      { word: 'affinity', pos: 'n', def: '亲近；密切关系', ex: 'He has an affinity for music.' },
      { word: 'alleviate', pos: 'v', def: '减轻；缓和', ex: 'The medicine alleviated pain.' },
      { word: 'ambivalent', pos: 'adj', def: '矛盾的', ex: 'He felt ambivalent about it.' },
      { word: 'anachronism', pos: 'n', def: '时代错误；不合时宜', ex: 'Swords in modern warfare are an anachronism.' },
      { word: 'analogous', pos: 'adj', def: '类似的；相似的', ex: 'The two cases are analogous.' },
      { word: 'anticipate', pos: 'v', def: '预期；预料', ex: 'We anticipate success.' },
      { word: 'apathy', pos: 'n', def: '冷漠；无兴趣', ex: 'Voter apathy is a problem.' },
      { word: 'arbitrary', pos: 'adj', def: '任意的；独断的', ex: 'The choice was arbitrary.' },
      { word: 'arcane', pos: 'adj', def: '神秘的；晦涩的', ex: 'The ritual was arcane.' },
      { word: 'articulate', pos: 'adj/v', def: '雄辩的；明确表达', ex: 'She is articulate.' },
      { word: 'ascertain', pos: 'v', def: '确定；查明', ex: 'We must ascertain the facts.' },
      { word: 'assuage', pos: 'v', def: '缓和；平息', ex: 'He assuaged her fears.' },
      { word: 'austere', pos: 'adj', def: '严厉的；简朴的', ex: 'Austere living conditions.' },
      { word: 'belligerent', pos: 'adj', def: '好战的；挑衅的', ex: 'A belligerent attitude.' },
      { word: 'bolster', pos: 'v', def: '支持；增强', ex: 'Bolster the argument.' },
      { word: 'candid', pos: 'adj', def: '坦率的；直言的', ex: 'A candid account.' },
      { word: 'capricious', pos: 'adj', def: '反复无常的', ex: 'A capricious decision.' },
      { word: 'ceremonious', pos: 'adj', def: '仪式隆重的', ex: 'A ceremonious event.' },
      { word: 'circumscribe', pos: 'v', def: '限制；限定', ex: 'Circumscribe the power.' },
      { word: 'coherent', pos: 'adj', def: '连贯的；一致的', ex: 'A coherent theory.' },
      { word: 'compassion', pos: 'n', def: '同情；怜悯', ex: 'Show compassion.' },
      { word: 'comprehensive', pos: 'adj', def: '全面的；综合的', ex: 'A comprehensive report.' },
      { word: 'concede', pos: 'v', def: '承认；让步', ex: 'He conceded the point.' },
      { word: 'conciliatory', pos: 'adj', def: '调和的；安抚的', ex: 'A conciliatory gesture.' },
      { word: 'conundrum', pos: 'n', def: '难题；谜', ex: 'A moral conundrum.' },
      { word: 'corroborate', pos: 'v', def: '证实；支持', ex: 'Witnesses corroborated the story.' },
      { word: 'credulous', pos: 'adj', def: '轻信的', ex: 'A credulous person.' },
      { word: 'culminate', pos: 'v', def: '达到顶峰', ex: 'The career culminated in success.' },
      { word: 'deference', pos: 'n', def: '敬意；顺从', ex: 'Show deference to elders.' },
      { word: 'delineate', pos: 'v', def: '描绘；描述', ex: 'Delineate the boundaries.' },
      { word: 'didactic', pos: 'adj', def: '说教的；教诲的', ex: 'A didactic novel.' },
      { word: 'disseminate', pos: 'v', def: '散布；传播', ex: 'Disseminate information.' },
      { word: 'divergent', pos: 'adj', def: '分歧的；不同的', ex: 'Divergent opinions.' },
      { word: 'emulate', pos: 'v', def: '仿效；努力赶上', ex: 'Emulate a role model.' },
      { word: 'enigma', pos: 'n', def: '谜；难解之物', ex: 'She is an enigma.' },
      { word: 'ephemeral', pos: 'adj', def: '短暂的', ex: 'An ephemeral beauty.' },
      { word: 'equivocate', pos: 'v', def: '含糊其辞', ex: 'Don\'t equivocate.' },
      { word: 'exacerbate', pos: 'v', def: '使恶化', ex: 'The policy exacerbated the crisis.' },
      { word: 'facilitate', pos: 'v', def: '促进；使容易', ex: 'Facilitate the process.' },
      { word: 'facetious', pos: 'adj', def: '爱开玩笑的', ex: 'A facetious remark.' },
      { word: 'fastidious', pos: 'adj', def: '苛求的；挑剔的', ex: 'A fastidious editor.' },
      { word: 'fervent', pos: 'adj', def: '热切的；热烈的', ex: 'Fervent supporters.' },
      { word: 'foster', pos: 'v', def: '培养；促进', ex: 'Foster creativity.' },
      { word: 'gregarious', pos: 'adj', def: '爱交际的', ex: 'A gregarious person.' },
      { word: 'harbinger', pos: 'n', def: '先驱；预兆', ex: 'A harbinger of spring.' },
      { word: 'hypothetical', pos: 'adj', def: '假设的', ex: 'A hypothetical case.' },
      { word: 'iconoclastic', pos: 'adj', def: '打破传统的', ex: 'An iconoclastic view.' },
      { word: 'impervious', pos: 'adj', def: '不透水的；不受影响的', ex: 'Impervious to water.' },
      { word: 'impugn', pos: 'v', def: '指责；怀疑', ex: 'Impugn the character.' },
      { word: 'incumbent', pos: 'adj/n', def: '现任的；有责任的', ex: 'The incumbent president.' },
      { word: 'ineffable', pos: 'adj', def: '无法言喻的', ex: 'Ineffable joy.' },
      { word: 'ingenuous', pos: 'adj', def: '天真的；直率的', ex: 'An ingenuous smile.' },
      { word: 'innocuous', pos: 'adj', def: '无害的', ex: 'An innocuous substance.' },
      { word: 'inherent', pos: 'adj', def: '固有的；内在的', ex: 'Inherent danger.' },
      { word: 'intractable', pos: 'adj', def: '难对付的', ex: 'An intractable problem.' },
      { word: 'intrepid', pos: 'adj', def: '勇敢的', ex: 'An intrepid explorer.' },
      { word: 'invective', pos: 'n', def: '恶言；辱骂', ex: 'Hurls invective.' },
      { word: 'laconic', pos: 'adj', def: '简洁的', ex: 'A laconic reply.' },
      { word: 'magnanimous', pos: 'adj', def: '宽宏大量的', ex: 'A magnanimous gesture.' },
      { word: 'meticulous', pos: 'adj', def: '一丝不苟的', ex: 'Meticulous attention to detail.' },
      { word: 'militant', pos: 'adj', def: '好战的；激进的', ex: 'A militant group.' },
      { word: 'nefarious', pos: 'adj', def: '邪恶的', ex: 'Nefarious activities.' },
      { word: 'nostalgia', pos: 'n', def: '怀旧；乡愁', ex: 'A wave of nostalgia.' },
      { word: 'obviate', pos: 'v', def: '排除；使不必要', ex: 'Obviate the need.' },
      { word: 'palliate', pos: 'v', def: '缓和；减轻', ex: 'Palliate the suffering.' },
      { word: 'pragmatic', pos: 'adj', def: '务实的', ex: 'A pragmatic approach.' },
      { word: 'quixotic', pos: 'adj', def: '不切实际的', ex: 'A quixotic plan.' },
      { word: 'recalcitrant', pos: 'adj', def: '顽固的；不服从的', ex: 'A recalcitrant child.' },
      { word: 'reconcile', pos: 'v', def: '调和；和解', ex: 'Reconcile differences.' },
      { word: 'reverent', pos: 'adj', def: '虔诚的；恭敬的', ex: 'A reverent attitude.' },
      { word: 'scrutinize', pos: 'v', def: '仔细检查', ex: 'Scrutinize the evidence.' },
      { word: 'sanguine', pos: 'adj', def: '乐观的；红润的', ex: 'Sanguine about the future.' },
      { word: 'sardonic', pos: 'adj', def: '讽刺的', ex: 'A sardonic smile.' },
      { word: 'simulate', pos: 'v', def: '模拟；假装', ex: 'Simulate flight conditions.' },
      { word: 'spontaneous', pos: 'adj', def: '自发的', ex: 'A spontaneous decision.' },
      { word: 'sycophant', pos: 'n', def: '谄媚者', ex: 'He is a sycophant.' },
      { word: 'taciturn', pos: 'adj', def: '沉默寡言的', ex: 'A taciturn man.' },
      { word: 'ubiquitous', pos: 'adj', def: '无处不在的', ex: 'Smartphones are ubiquitous.' },
      { word: 'unprecedented', pos: 'adj', def: '史无前例的', ex: 'An unprecedented event.' },
      { word: 'veracious', pos: 'adj', def: '真实的；诚实的', ex: 'A veracious witness.' },
      { word: 'vicissitude', pos: 'n', def: '变迁；兴衰', ex: 'Life\'s vicissitudes.' },
      { word: 'winsome', pos: 'adj', def: '迷人的；可爱的', ex: 'A winsome smile.' },
      { word: 'zenith', pos: 'n', def: '顶峰；最高点', ex: 'The zenith of his career.' },
      { word: 'alacrity', pos: 'n', def: '敏捷；欣然', ex: 'Accepted with alacrity.' },
      { word: 'amalgamate', pos: 'v', def: '合并；混合', ex: 'Amalgamate the groups.' },
      { word: 'anathema', pos: 'n', def: '被诅咒的人；憎恶', ex: 'Violence is anathema to her.' },
      { word: 'bellicose', pos: 'adj', def: '好战的', ex: 'A bellicose nation.' },
      { word: 'cacophony', pos: 'n', def: '刺耳的声音', ex: 'A cacophony of noise.' },
      { word: 'diatribe', pos: 'n', def: '抨击；谩骂', ex: 'A political diatribe.' },
      { word: 'epiphany', pos: 'n', def: '顿悟；显现', ex: 'A moment of epiphany.' },
      { word: 'equivocal', pos: 'adj', def: '模棱两可的', ex: 'An equivocal answer.' },
      { word: 'exculpate', pos: 'v', def: '开脱；证明无罪', ex: 'Exculpate the defendant.' },
      { word: 'halcyon', pos: 'adj', def: '平静的；幸福的', ex: 'Halcyon days.' },
      { word: 'impecunious', pos: 'adj', def: '贫穷的', ex: 'An impecunious artist.' },
      { word: 'mellifluous', pos: 'adj', def: '流畅的；甜美的', ex: 'A mellifluous voice.' },
      { word: 'obfuscate', pos: 'v', def: '使混乱；使困惑', ex: 'Obfuscate the truth.' },
      { word: 'ostentatious', pos: 'adj', def: '卖弄的；铺张的', ex: 'An ostentatious display.' },
      { word: 'perfunctory', pos: 'adj', def: '敷衍的', ex: 'A perfunctory nod.' },
      { word: 'propitious', pos: 'adj', def: '有利的；吉祥的', ex: 'A propitious moment.' },
      { word: 'sagacious', pos: 'adj', def: '睿智的', ex: 'A sagacious leader.' },
      { word: 'ubiquitous', pos: 'adj', def: '无处不在的', ex: ' ubiquitous presence.' },
      { word: 'vituperative', pos: 'adj', def: '责骂的', ex: 'A vituperative attack.' }
    ]
  };

  function getProgress() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {}
  }

  window.Vocab = {
    loadList: function(type) {
      var list = WORD_LISTS[type];
      if (!list) return [];
      var progress = getProgress();
      var userProgress = progress[type] || {};
      return list.map(function(item) {
        return {
          word: item.word,
          pos: item.pos,
          def: item.def,
          ex: item.ex,
          known: userProgress[item.word] || 'unknown'
        };
      });
    },
    startStudy: function(type) {
      var list = this.loadList(type);
      if (!list.length) return null;
      var shuffled = list.slice();
      for (var i = shuffled.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = shuffled[i];
        shuffled[i] = shuffled[j];
        shuffled[j] = tmp;
      }
      var idx = 0;
      return {
        list: shuffled,
        index: 0,
        current: function() {
          return this.list[this.index];
        },
        next: function() {
          if (this.index < this.list.length - 1) {
            this.index++;
            return true;
          }
          return false;
        },
        prev: function() {
          if (this.index > 0) {
            this.index--;
            return true;
          }
          return false;
        },
        total: function() {
          return this.list.length;
        },
        remaining: function() {
          return this.list.length - this.index - 1;
        },
        mark: function(known) {
          var word = this.current();
          if (!word) return;
          this.updateProgress(word.word, known ? 'known' : 'unknown', type);
          word.known = known ? 'known' : 'unknown';
        },
        updateProgress: function(word, status, type) {
          this.updateProgressStatic(word, status, type);
        },
        complete: function() {
          return this.index >= this.list.length - 1;
        }
      };
    },
    updateProgress: function(word, known, type) {
      var progress = getProgress();
      if (!progress[type]) progress[type] = {};
      progress[type][word] = known ? 'known' : 'unknown';
      saveProgress(progress);
    },
    updateProgressStatic: function(word, known, type) {
      var progress = getProgress();
      if (!progress[type]) progress[type] = {};
      progress[type][word] = known ? 'known' : 'unknown';
      saveProgress(progress);
    },
    getStats: function(type) {
      var list = WORD_LISTS[type] || [];
      var progress = getProgress();
      var userProgress = progress[type] || {};
      var known = 0;
      var unknown = 0;
      list.forEach(function(item) {
        if (userProgress[item.word] === 'known') known++;
        else unknown++;
      });
      return { total: list.length, known: known, unknown: unknown };
    },
    getTypes: function() {
      return Object.keys(WORD_LISTS);
    },
    getTypeName: function(type) {
      var names = { toefl: 'TOEFL', ielts: 'IELTS', sat: 'SAT' };
      return names[type] || type;
    },
    getReviewList: function() {
      var progress = getProgress();
      var reviewWords = [];
      Object.keys(progress).forEach(function(type) {
        var words = progress[type];
        Object.keys(words).forEach(function(word) {
          if (words[word] === 'unknown') {
            reviewWords.push({ word: word, type: type });
          }
        });
      });
      return reviewWords;
    }
  };

})();