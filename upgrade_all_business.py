#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
批量升级business/courses下所有课程页面的实施步骤为极致版
完整版本 - 包含所有42个课程
"""

import os
import re
import json


# ========== 课程步骤数据定义 ==========
# 每个课程包含: cn_title(5), en_title(5), cn_desc(5), en_desc(5), cn_output(5), en_output(5), cn_quality(5), en_quality(5)

COURSE_DATA = {}


def add_course(key, cn_titles, en_titles, cn_descs, en_descs, cn_outputs, en_outputs, cn_qualities, en_qualities):
    COURSE_DATA[key] = {
        'cn_title': cn_titles, 'en_title': en_titles,
        'cn_desc': cn_descs, 'en_desc': en_descs,
        'cn_output': cn_outputs, 'en_output': en_outputs,
        'cn_quality': cn_qualities, 'en_quality': en_qualities,
    }


# ==================== 会计类 7个 ====================

add_course('acct-advanced',
    ['合并范围确定与股权结构分析','内部交易与往来余额梳理','合并抵销分录编制','合并工作底稿编制','合并财务报表编制与披露'],
    ['Consolidation Scope & Equity Analysis','Internal Transaction Reconciliation','Elimination Entries','Consolidation Worksheet','Consolidated Statements & Disclosure'],
    [
        '本步骤的核心任务是确定合并财务报表的合并范围，分析企业集团的股权结构和关联方关系。根据企业会计准则第33号，以控制为基础判断是否纳入合并范围，梳理直接持股、间接持股和交叉持股的股权架构，为后续合并抵销分录编制奠定基础。<br><br>• 查阅上市公司年报、股权结构公告和工商登记信息，绘制集团股权架构图，标注持股比例和表决权比例<br>• 运用控制三要素（权力、可变回报、权力影响回报）评估每个被投资单位是否纳入合并范围，编制合并范围判断表<br>• 识别集团内部关联方关系，包括母子公司、子子公司、联营企业、合营企业，编制关联方清单',
        '本步骤的核心任务是全面梳理集团内部的各类交易和往来余额，包括内部商品销售、内部固定资产转让、内部无形资产转让、内部债权债务、内部租赁、内部现金流等。识别所有内部交易的类型、金额、交易时间和未实现损益。<br><br>• 从母子公司账套中导出内部往来明细账（应收应付、预收预付、其他应收应付），逐笔核对并编制内部往来余额调节表<br>• 梳理内部商品交易，按顺销和逆销分类，计算期末存货中包含的未实现内部销售利润，编制未实现损益计算表<br>• 盘点内部固定资产和无形资产交易，计算截至合并日的累计折旧和摊销中包含的未实现损益',
        '本步骤的核心任务是根据企业会计准则编制各类合并抵销分录，包括长期股权投资与所有者权益的抵销、内部投资收益与利润分配的抵销、内部债权债务的抵销、内部存货交易的抵销、内部固定资产交易的抵销等。<br><br>• 编制母公司长期股权投资与子公司所有者权益的抵销分录，确认少数股东权益，区分同一控制和非同一控制下企业合并的不同处理<br>• 编制内部投资收益与子公司利润分配的抵销分录，确认少数股东损益，处理期初未分配利润的调整<br>• 编制各类内部交易的抵销分录，包括存货、固定资产、无形资产、债权债务、现金流量，按交易类型分类编制工作底稿',
        '本步骤的核心任务是将母子公司的个别财务报表数据过入合并工作底稿，加总各报表项目金额，过入调整分录和抵销分录，计算合并财务报表各项目的合并金额。采用多列式工作底稿格式。<br><br>• 使用Excel建立合并工作底稿，设置资产负债表、利润表、现金流量表、所有者权益变动表四个工作表，建立表间勾稽关系公式<br>• 将母子公司个别报表数据过入工作底稿，使用SUMIF或数据透视表汇总合计数，确保数据准确无误<br>• 过入调整分录和抵销分录，使用借贷方向标识，计算各项目合并金额，验证资产=负债+所有者权益、净利润勾稽关系',
        '本步骤的核心任务是根据合并工作底稿的结果编制正式的合并财务报表及附注。按照上市公司信息披露要求完善附注信息，包括合并范围变更说明、重要会计政策和会计估计、关联方及关联交易、或有事项等。<br><br>• 根据工作底稿合并数编制四张合并主表，按照上市公司年报格式排版，确保报表项目列示规范、数字准确<br>• 撰写合并财务报表附注，包括合并范围变更说明、重要会计政策和会计估计、关联方及关联交易、或有事项等披露内容<br>• 进行合并报表整体复核，验证期初数与上年期末数衔接、净利润与未分配利润勾稽、现金流量表附表与主表匹配'
    ],
    [
        'The core task of this step is to determine consolidation scope and analyze group equity structure and related party relationships. Based on CAS 33, consolidation is judged on a control basis, sorting out direct, indirect, and cross-holding equity structures.<br><br>• Review annual reports, equity announcements, and business registration records to draw group equity structure diagrams with ownership and voting percentages<br>• Apply the three control elements (power, variable returns, power affecting returns) to assess each investee for consolidation, prepare scope judgment worksheet<br>• Identify intra-group related party relationships including parent-subsidiary, subsidiary-subsidiary, associates, joint ventures',
        'The core task of this step is to comprehensively sort out all intra-group transactions and balances, including internal goods sales, fixed asset transfers, intangible asset transfers, receivables and payables, leases, and cash flows.<br><br>• Export intra-group current account details from parent and subsidiary ledgers, reconcile item by item and prepare balance reconciliation table<br>• Sort out internal goods transactions, classify as downstream and upstream sales, calculate unrealized profit in ending inventory<br>• Inventory internal fixed asset and intangible asset transactions, calculate unrealized profit in accumulated depreciation and amortization',
        'The core task of this step is to prepare consolidation elimination entries including elimination of long-term equity investment, internal investment income, internal receivables and payables, inventory and asset transactions, and internal cash flows.<br><br>• Prepare elimination entries for parent long-term investment against subsidiary owners equity, recognize non-controlling interest, distinguish between same-control and different-control combinations<br>• Prepare elimination entries for internal investment income against subsidiary profit distribution, recognize non-controlling interest, handle opening retained earnings adjustments<br>• Prepare elimination entries for all internal transaction types including inventory, fixed assets, intangibles, receivables/payables, cash flows',
        'The core task of this step is to post individual financial statement data into the consolidation worksheet, sum all line items, post adjusting and eliminating entries, and calculate consolidated amounts.<br><br>• Build consolidation workbook in Excel with four worksheets for balance sheet, income statement, cash flow, and changes in equity, set up inter-sheet formula links<br>• Post individual statement data into worksheet, use SUMIF or pivot tables for totals, ensure data accuracy<br>• Post adjusting and eliminating entries with debit/credit indicators, calculate consolidated amounts, verify accounting equation and net income articulation',
        'The core task of this step is to prepare formal consolidated financial statements and notes based on worksheet results, with full disclosures per listed company requirements including scope changes, significant policies, related party transactions, and contingencies.<br><br>• Prepare four main consolidated statements from worksheet totals, format according to listed company annual report standards<br>• Draft consolidated financial statement notes including scope changes, significant policies and estimates, related parties and transactions, contingencies<br>• Conduct overall consolidated statement review, verify opening balance consistency, retained earnings articulation, cash flow supplementary schedule matching'
    ],
    ['合并范围判断文档（含股权架构图、控制评估表、关联方清单）','内部交易梳理工作底稿（含内部往来调节表、未实现损益计算表、资产类交易抵销明细表）','合并抵销分录工作底稿（含调整分录、抵销分录、少数股东权益/损益计算表）','合并财务报表工作簿（含四张主表工作底稿、调整抵销分录汇总表、勾稽关系验证表）','正式合并财务报表（含四张主表、报表附注、复核记录）'],
    ['Consolidation scope document (equity structure diagram, control assessment table, related party list)','Internal transaction working papers (balance reconciliation, unrealized profit calculation, asset elimination schedule)','Elimination entry working papers (adjusting entries, eliminating entries, NCI/NIS calculation table)','Consolidation workbook (4 main statement worksheets, adjustment/elimination summary, articulation verification)','Formal consolidated financial statements (4 main statements, notes, review records)'],
    ['合并范围判断依据充分，股权结构清晰无遗漏，关联方识别完整','内部交易识别完整，未实现损益计算准确，往来余额核对一致','抵销分录借贷平衡，分类清晰，覆盖所有内部交易类型，符合准则规定','合并计算准确，表间勾稽关系平衡，调整抵销轨迹清晰可追溯','报表格式规范，附注披露完整，勾稽关系全部通过，符合准则和监管要求'],
    ['Scope judgment well-supported, equity structure complete, related parties fully identified','Complete transaction identification, accurate unrealized profit, reconciled balances','Debits equal credits, clear classification, covers all transaction types, compliant with standards','Accurate calculations, balanced articulations, clear audit trail','Proper format, complete disclosures, all articulations pass, compliant with standards and regulations']
)

add_course('acct-audit',
    ['审计计划与风险评估','内部控制了解与测试','实质性程序—资产负债表审计','实质性程序—利润表审计','审计完成与报告出具'],
    ['Audit Planning & Risk Assessment','Internal Control Testing','Balance Sheet Audit','Income Statement Audit','Audit Completion & Reporting'],
    [
        '本步骤的核心任务是了解被审计单位及其环境，识别和评估财务报表重大错报风险，制定总体审计策略和具体审计计划。通过查阅公司年报、行业研究报告和监管文件，运用风险评估程序识别财务报表层次和认定层次的重大错报风险。<br><br>• 查阅公司近三年年报、行业研究报告和监管文件，使用PEST框架分析宏观环境，用波特五力模型分析行业竞争格局<br>• 执行风险评估程序，包括询问管理层、分析程序、观察和检查，识别财务报表层次和认定层次的重大错报风险<br>• 确定财务报表整体重要性水平（通常为总资产的0.5%-1%或税前利润的5%-10%）和实际执行的重要性，编制审计计划',
        '本步骤的核心任务是了解和测试被审计单位与财务报告相关的内部控制，评估控制设计的合理性和运行的有效性。根据COSO内部控制五要素框架，对销售与收款、采购与付款、生产与存货等关键业务循环进行控制测试。<br><br>• 采用穿行测试法了解关键业务流程，绘制销售与收款、采购与付款、生产与存货三大循环的流程图，标注关键控制点<br>• 选取拟信赖的关键控制进行测试，使用属性抽样方法确定样本量，通过检查凭证、询问、重新执行等方法测试控制运行有效性<br>• 评价识别出的内部控制缺陷，区分重大缺陷、重要缺陷和一般缺陷，编制内部控制缺陷汇总表',
        '本步骤的核心任务是对资产负债表各项目执行实质性程序，获取充分适当的审计证据验证账户余额的存在性、权利和义务、完整性、计价和分摊认定。重点审计货币资金、应收账款、存货、固定资产等重大科目。<br><br>• 对货币资金执行函证程序（向所有开户银行发函，包括零余额账户和本期注销账户）、监盘库存现金、编制银行存款余额调节表<br>• 对应收账款执行积极式函证（选取大额和异常项目，使用审计抽样方法）、检查期后收款、分析账龄、测试坏账准备计提<br>• 对存货执行监盘程序（制定监盘计划、执行监盘程序、关注存货状况）、计价测试（原材料、在产品、产成品成本核算）、存货跌价准备测试',
        '本步骤的核心任务是对利润表各项目执行实质性程序，验证收入、成本、费用的发生、完整性、准确性、截止和分类认定。重点审计营业收入、营业成本、期间费用等项目，运用实质性分析程序和细节测试相结合的方法。<br><br>• 对营业收入执行实质性分析程序（月度波动分析、毛利率分析、与同行业对比）、细节测试（抽取大额销售合同核对发票和发货单）、截止测试<br>• 对营业成本执行分析程序（单位成本变动分析、毛利率与存货周转分析）、成本结转测试（检查计价方法一致性）、与存货审计结合验证成本完整性<br>• 对期间费用执行分析程序（各月波动、占收入比例）、抽凭测试（大额费用项目检查审批和发票）、截止测试（跨期费用调整）',
        '本步骤的核心任务是完成审计收尾工作，评价审计结果，出具审计报告。包括汇总审计差异、编制调整分录、评价未更正错报的影响、获取管理层声明书、执行期后事项审计、复核或有事项和持续经营假设。<br><br>• 汇总审计过程中发现的所有错报，编制调整分录汇总表和未更正错报汇总表，评价未更正错报单独和汇总的影响是否重大<br>• 执行审计完成程序，包括期后事项复核、或有事项检查、持续经营评估、比较数据核对、获取管理层声明书和律师声明书<br>• 撰写审计报告，包括标准无保留意见、带强调事项段、保留意见、否定意见或无法表示意见等类型，确保审计意见与审计证据一致'
    ],
    [
        'The core task of this step is to understand the audited entity and its environment, identify and assess risks of material misstatement, and develop overall audit strategy and detailed audit plan.<br><br>• Review past three years annual reports, industry research and regulatory filings, use PEST for macro analysis, Porters Five Forces for competitive landscape<br>• Perform risk assessment procedures including management inquiry, analytical procedures, observation and inspection, identify financial statement and assertion level risks<br>• Determine overall materiality (0.5%-1% of total assets or 5%-10% of pre-tax income) and performance materiality, prepare audit plan',
        'The core task of this step is to understand and test internal controls related to financial reporting, assessing design and operating effectiveness following the COSO five-component framework for key business cycles.<br><br>• Use walkthroughs to understand key business processes, draw flowcharts for revenue, procurement, and production cycles, document key controls<br>• Select key controls for testing, use attribute sampling for sample size, test effectiveness through inspection, inquiry, and reperformance<br>• Evaluate control deficiencies, classify as material weakness, significant deficiency, or minor deficiency, prepare deficiency summary',
        'The core task of this step is to perform substantive procedures on balance sheet accounts, obtaining sufficient appropriate audit evidence to verify existence, rights and obligations, completeness, and valuation assertions.<br><br>• Perform cash confirmation (all banks including zero-balance and closed accounts), count cash on hand, prepare bank reconciliation schedules<br>• Perform positive receivables confirmation (select large and unusual items using audit sampling), examine subsequent collections, analyze aging, test bad debt provision<br>• Perform inventory observation (plan, conduct counts, assess condition), valuation testing (raw materials, WIP, finished goods costing), impairment testing',
        'The core task of this step is to perform substantive procedures on income statement accounts, verifying occurrence, completeness, accuracy, cutoff, and classification assertions for revenue, costs, and expenses.<br><br>• Perform revenue substantive analytics (monthly fluctuation, gross margin, industry comparison), tests of details (vouch large contracts to invoices and shipping documents), cutoff testing<br>• Perform COGS analytics (unit cost changes, gross margin and inventory turnover), cost结转 testing (verify consistent costing method), integrate with inventory audit for completeness<br>• Perform period expense analytics (monthly fluctuation, % of revenue), vouching (large expense items with approval and invoice), cutoff testing (cross-period adjustments)',
        'The core task of this step is to complete audit wrap-up procedures, evaluate audit results, and issue the audit report including summarizing differences, evaluating uncorrected misstatements, obtaining management representation letter.<br><br>• Summarize all identified misstatements, prepare adjusting entry summary and uncorrected misstatement summary, evaluate individual and aggregate impact<br>• Perform completion procedures including subsequent events review, contingency review, going concern assessment, comparative data verification, obtain management and attorney letters<br>• Draft audit report including standard unmodified opinion, emphasis of matter, qualified opinion, adverse opinion, or disclaimer of opinion, ensure opinion matches evidence'
    ],
    ['审计计划文档（含风险评估矩阵、重要性水平计算表、审计程序表、时间预算表、人员分工表）','内部控制工作底稿（含流程图、控制矩阵、控制测试底稿、缺陷汇总表、控制有效性评价报告）','资产负债表项目审计工作底稿（含各科目审定表、明细表、函证汇总表、监盘表、抽凭表、测试表）','利润表项目审计工作底稿（含各科目审定表、分析表、抽凭表、截止测试表、调整分录汇总表）','审计完成阶段工作底稿（含调整分录汇总、未更正错报评价、管理层声明书、审计报告草稿、复核记录）'],
    ['Audit plan document (risk matrix, materiality calculation, audit program, time budget, staffing)','Internal control working papers (flowcharts, control matrix, test workpapers, deficiency summary, effectiveness report)','Balance sheet audit working papers (lead schedules, detailed schedules, confirmation summaries, count sheets, samples, test results)','Income statement audit working papers (lead schedules, analytical tables, voucher samples, cutoff tests, adjustment summary)','Completion phase working papers (adjustment summary, uncorrected misstatement evaluation, management representation letter, draft report, review records)'],
    ['覆盖所有高风险领域，重要性水平合理，审计程序可执行且与风险评估结果对应','关键控制识别完整，测试样本量充分，缺陷评价准确，结论有充分证据支持','重大科目函证/监盘比例达标，审计证据充分适当，审定数有充分依据','分析程序有合理解释，细节测试样本充分，截止测试覆盖期前后','所有重大调整均已记录，审计意见类型恰当，报告格式规范，工作底稿经三级复核'],
    ['Covers all high-risk areas, reasonable materiality, executable procedures mapped to risk assessment','Complete key control identification, adequate sample size, accurate deficiency assessment, well-supported conclusions','Adequate confirmation/observation coverage, sufficient evidence, supported audit values','Analytical procedures explained, adequate detail testing samples, cutoff covers before and after year-end','All material adjustments documented, appropriate opinion type, proper format, three-level review completed']
)

add_course('acct-cost',
    ['成本核算体系设计与生产流程分析','要素费用归集与分配','制造费用归集与分配','生产费用在完工产品与在产品之间分配','作业成本法应用与成本分析'],
    ['Cost System Design & Process Analysis','Element Cost Accumulation & Allocation','Manufacturing Overhead Allocation','Cost Allocation FG vs WIP','Activity-Based Costing & Analysis'],
    [
        '本步骤的核心任务是深入了解制造企业的生产工艺流程和成本核算现状，设计科学合理的成本核算体系。通过实地观察生产车间、访谈生产管理人员和财务人员、查阅生产工艺文件，确定成本核算对象、成本项目、成本计算方法。<br><br>• 实地观察生产车间，绘制生产工艺流程图，标注各工序的物料投入、人工投入、设备使用和产出节点<br>• 分析企业现有成本核算方法，识别成本核算中存在的问题（如间接费用分配不合理、在产品成本计算不准确等）<br>• 根据生产特点确定成本计算方法（品种法、分批法、分步法），设计成本项目（直接材料、直接人工、制造费用）和核算流程',
        '本步骤的核心任务是归集和分配各项生产要素费用，包括材料费用、人工费用、折旧费用、水电动力费用等。根据领料单、工资结算单、折旧计算表等原始凭证，按照谁受益谁负担的原则分配到各成本核算对象。<br><br>• 归集材料费用，根据领料单和退料单编制材料费用分配表，直接材料直接计入产品成本，共同材料按定额消耗量比例或重量比例分配<br>• 归集人工费用，根据工资结算单和工时记录编制工资及福利费分配表，生产工人工资按生产工时比例分配到各产品<br>• 归集折旧费用和其他要素费用（水电费、办公费、差旅费等），编制折旧计算表和其他费用分配表，按使用部门和用途分配',
        '本步骤的核心任务是归集和分配制造费用，包括间接材料、间接人工、车间折旧费、水电费、办公费等各项间接生产费用。设置制造费用明细账，按车间和费用项目归集，月末采用合理方法分配到各产品。<br><br>• 按生产车间设置制造费用明细账，归集各项间接生产费用，包括机物料消耗、车间管理人员薪酬、车间设备折旧、车间水电费、办公费等<br>• 选择合理的制造费用分配方法（生产工人工时比例法、机器工时比例法、按年度计划分配率分配法），编制制造费用分配表<br>• 分析制造费用预算执行情况，计算制造费用差异，对超支或节约进行因素分析，识别成本控制的重点环节',
        '本步骤的核心任务是将累计的生产费用在完工产品和月末在产品之间进行分配，计算完工产品总成本和单位成本。根据企业生产特点和管理要求，选择合理的分配方法（约当产量比例法、定额比例法、在产品按定额成本计价法等）。<br><br>• 盘点月末在产品数量，编制在产品盘点表，确定各工序在产品的完工程度和投料程度，为约当产量计算提供基础数据<br>• 选用约当产量比例法分配生产费用，分别计算直接材料、直接人工、制造费用的约当产量，计算各成本项目的单位成本<br>• 登记产品成本明细账，计算完工产品总成本和单位成本，编制完工产品成本汇总表，结转入库产品成本',
        '本步骤的核心任务是引入作业成本法（ABC），对比传统成本法的差异，分析成本扭曲的原因，提出成本管理改进建议。识别主要作业和作业中心，建立作业成本库，选择成本动因，分配作业成本到产品。<br><br>• 识别生产过程中的主要作业（如设备调整、物料搬运、质量检验、机器加工、产品设计等），建立作业中心，编制作业清单和作业流程图<br>• 确定各作业的成本动因（如调整次数、搬运次数、检验次数、机器工时、设计工时等），计算作业成本分配率，编制作业成本计算表<br>• 对比传统成本法和作业成本法计算的产品成本差异，分析成本扭曲的原因，撰写成本分析报告，提出成本管理和定价策略建议'
    ],
    [
        'The core task of this step is to thoroughly understand the manufacturing enterprise production process and current cost accounting status, and design a scientific cost accounting system through factory observation, interviews, and process document review.<br><br>• Conduct factory floor observation, draw production process flowcharts marking material input, labor input, equipment usage and output at each stage<br>• Analyze current cost accounting methods, identify problems (unreasonable overhead allocation, inaccurate WIP costing, etc.)<br>• Determine costing method based on production characteristics (process, job order, step method), design cost items and accounting workflow',
        'The core task of this step is to accumulate and allocate production element costs including materials, labor, depreciation, utilities and power based on source documents, applying the benefit principle.<br><br>• Accumulate material costs, prepare material cost allocation table from requisitions and returns, direct materials charged directly, common materials allocated by standard consumption or weight ratio<br>• Accumulate labor costs, prepare wage and benefit allocation table from payroll and time records, production worker wages allocated by labor hours<br>• Accumulate depreciation and other element costs (utilities, office supplies, travel), prepare depreciation schedule and other cost allocation tables',
        'The core task of this step is to accumulate and allocate manufacturing overhead including indirect materials, indirect labor, factory depreciation, utilities, office expenses using appropriate allocation methods.<br><br>• Set up manufacturing overhead ledgers by production department, accumulate all indirect production costs including supplies, supervisor salaries, equipment depreciation, utilities, office expenses<br>• Select appropriate overhead allocation method (direct labor hours, machine hours, predetermined annual rate), prepare overhead allocation table<br>• Analyze overhead budget performance, calculate variances, conduct factor analysis for over/under spending, identify cost control priorities',
        'The core task of this step is to allocate accumulated production costs between finished goods and ending work-in-process, calculating total and unit cost using appropriate methods like equivalent units, standard cost ratio, etc.<br><br>• Count ending WIP quantities, prepare WIP count sheet, determine percentage complete for materials and conversion at each process stage<br>• Apply equivalent units method to allocate production costs, calculate equivalent units for direct materials, direct labor, and overhead separately, compute unit costs<br>• Register product cost subsidiary ledgers, calculate total and unit finished goods cost, prepare finished goods cost summary, journal entry for finished goods receipt',
        'The core task of this step is to introduce Activity-Based Costing (ABC), compare with traditional costing, analyze causes of cost distortion, and propose cost management improvement recommendations.<br><br>• Identify major activities in production (machine setup, material handling, quality inspection, machining, product design, etc.), establish activity centers, prepare activity list and process flow diagrams<br>• Determine cost drivers for each activity (setup hours, moves, inspection hours, machine hours, design hours), calculate activity cost rates, prepare ABC calculation table<br>• Compare product costs from traditional and ABC methods, analyze causes of cost distortion, prepare cost analysis report with management and pricing strategy recommendations'
    ],
    ['成本核算体系设计文档（含生产流程图、现状分析报告、成本核算方法选择说明、成本项目设置表）','要素费用分配工作底稿（含材料费用分配表、工资费用分配表、折旧计算表、其他费用分配表、费用归集汇总表）','制造费用核算工作底稿（含制造费用明细账、制造费用分配表、预算执行分析表、差异分析报告）','完工产品成本计算工作底稿（含在产品盘点表、约当产量计算表、费用分配表、产品成本明细账、完工产品成本汇总表）','作业成本法应用报告（含作业清单、作业成本计算表、成本差异对比表、成本扭曲原因分析、管理建议）'],
    ['Cost accounting system design document (process flowcharts, current state analysis, costing method selection, cost item setup)','Element cost allocation working papers (material allocation, labor allocation, depreciation schedule, other cost allocations, cost summary)','Manufacturing overhead working papers (subsidiary ledger, allocation table, budget performance report, variance analysis)','Finished goods costing working papers (WIP count sheet, equivalent units calculation, allocation table, product cost ledger, finished goods summary)','ABC application report (activity list, ABC calculation table, cost variance comparison, distortion cause analysis, management recommendations)'],
    ['成本核算方法与生产特点匹配，成本项目设置合理，核算流程清晰可操作','费用归集完整无遗漏，分配标准合理，计算准确，原始凭证可追溯','制造费用归集完整，分配方法合理且前后期一致，分配计算准确','在产品数量准确，完工程度估计合理，成本计算准确，勾稽关系正确','作业识别完整，成本动因选择合理，成本计算准确，分析有深度和实用价值'],
    ['Method matches production characteristics, reasonable cost items, clear workflow','Complete accumulation, reasonable allocation bases, accurate calculations, traceable to source documents','Complete accumulation, consistent allocation method, accurate calculations','Accurate WIP quantities, reasonable completion estimates, accurate calculations, proper articulation','Complete activity identification, reasonable cost drivers, accurate calculations, insightful and practical analysis']
)

add_course('acct-financial',
    ['经济业务分析与原始凭证审核','记账凭证编制与账簿登记','期末账项调整与对账结账','财务报表编制','财务报表分析与解读'],
    ['Transaction Analysis & Source Document Review','Journal Entry & Ledger Posting','Period-End Adjustments & Closing','Financial Statement Preparation','Financial Statement Analysis'],
    [
        '本步骤的核心任务是对企业日常经济业务进行分析，审核原始凭证的真实性、合法性和完整性。根据企业会计准则判断各项经济业务的性质和类型，确定会计要素的增减变化，为编制记账凭证提供依据。<br><br>• 收集和审核各类原始凭证（发票、收据、入库单、出库单、合同、银行回单等），检查凭证要素是否齐全、审批手续是否完备<br>• 对经济业务进行分类（采购与付款、销售与收款、生产与存货、筹资与投资、费用报销等），编制经济业务分类汇总表<br>• 分析每笔业务对会计要素的影响，确定涉及的会计科目和借贷方向，编制经济业务分析表',
        '本步骤的核心任务是根据审核无误的原始凭证编制记账凭证，并按照会计核算程序登记各类账簿。包括编制专用记账凭证或通用记账凭证，登记现金日记账、银行存款日记账、明细分类账和总分类账。<br><br>• 根据原始凭证编制记账凭证，填写日期、凭证编号、摘要、会计科目、借贷方金额，确保借贷平衡，编制记账凭证汇总表<br>• 登记现金日记账和银行存款日记账，逐日逐笔登记，结出每日余额，做到日清月结，与库存现金和银行对账单核对<br>• 登记明细分类账（三栏式、数量金额式、多栏式）和总分类账，采用科目汇总表或汇总记账凭证账务处理程序，定期进行账账核对',
        '本步骤的核心任务是在会计期末进行账项调整、对账和结账，确保财务报表能够准确反映企业的财务状况和经营成果。包括计提折旧、摊销无形资产、计提减值准备、确认递延所得税、调整预收预付款项等调整事项。<br><br>• 编制期末调整分录，包括固定资产折旧计提（直线法/双倍余额递减法/年数总和法）、无形资产摊销、长期待摊费用摊销、应收款项减值准备等<br>• 进行财产清查和账实核对，包括现金盘点、银行存款余额调节、存货盘点、固定资产盘点，编制财产清查报告和账实差异调节表<br>• 进行结账处理，结转损益类科目到本年利润，计算所得税费用和净利润，结转利润分配，编制结账后试算平衡表',
        '本步骤的核心任务是根据账簿记录和其他会计资料编制财务报表，包括资产负债表、利润表、现金流量表、所有者权益变动表。按照企业会计准则规定的报表格式和填列方法，准确反映企业的财务状况、经营成果、现金流量。<br><br>• 编制资产负债表，根据总账和明细账余额填列，注意重分类调整（应收/预收、应付/预付），计算流动资产/非流动资产、流动负债/非流动负债合计<br>• 编制利润表，采用多步式格式，分步计算营业利润、利润总额、净利润和每股收益，确保与资产负债表未分配利润勾稽<br>• 编制现金流量表，采用直接法列示经营活动现金流量，用间接法补充资料，将净利润调节为经营活动现金流量，分析投资和筹资活动现金流量',
        '本步骤的核心任务是运用财务分析方法对企业的财务状况和经营成果进行综合分析和评价。包括比率分析（偿债能力、营运能力、盈利能力、发展能力）、趋势分析、结构分析、杜邦分析等，识别企业财务优势和劣势。<br><br>• 计算四类财务比率：偿债能力（流动比率、速动比率、资产负债率、利息保障倍数）、营运能力（应收账款周转率、存货周转率、总资产周转率）、盈利能力（毛利率、净利率、ROE、ROA）、发展能力（收入增长率、利润增长率）<br>• 进行杜邦分析，将ROE分解为销售净利率×资产周转率×权益乘数，分析各因素对净资产收益率的影响，找出关键驱动因素<br>• 进行趋势分析和结构分析（环比、同比、共同比报表），撰写财务分析报告，评价企业财务状况，指出问题并提出改进建议'
    ],
    [
        'The core task of this step is to analyze daily business transactions and review source documents for authenticity, legality, and completeness, determining the nature and type of each transaction based on accounting standards.<br><br>• Collect and review various source documents (invoices, receipts, goods received notes, delivery notes, contracts, bank advices), check completeness and approval procedures<br>• Classify business transactions (procurement and payment, sales and collection, production and inventory, financing and investment, expense reimbursement), prepare classification summary<br>• Analyze impact of each transaction on accounting elements, determine accounts and debit/credit directions, prepare transaction analysis table',
        'The core task of this step is to prepare journal entries from reviewed source documents and post to various ledgers including cash journal, bank journal, subsidiary ledgers, and general ledger.<br><br>• Prepare journal vouchers from source documents, fill date, voucher number, description, accounts, debit/credit amounts, ensure balanced entries, prepare voucher summary<br>• Post cash and bank journals daily with running balances, reconcile with physical cash and bank statements<br>• Post subsidiary ledgers (three-column, quantity-value, multi-column) and general ledger using科目汇总表 or summarized voucher method, perform periodic ledger reconciliation',
        'The core task of this step is to perform period-end adjusting entries, reconciliation, and closing to ensure financial statements accurately reflect financial position and operating results, including depreciation, amortization, impairment, deferred taxes.<br><br>• Prepare period-end adjusting entries including fixed asset depreciation (straight-line/DDB/sum-of-years), intangible asset amortization, long-term prepaid expense amortization, receivables impairment<br>• Conduct physical inventory and reconciliation including cash count, bank reconciliation, inventory count, fixed asset count, prepare physical count report and discrepancy reconciliation<br>• Perform closing procedures, close revenue and expense accounts to income summary, calculate income tax and net income, close to retained earnings, prepare post-closing trial balance',
        'The core task of this step is to prepare financial statements from ledger records including balance sheet, income statement, cash flow statement, and statement of changes in equity per accounting standard formats.<br><br>• Prepare balance sheet from general ledger and subsidiary ledger balances, apply reclassification adjustments (receivables/advances), calculate current/non-current totals for assets and liabilities<br>• Prepare multi-step income statement, calculate operating profit, total profit, net income, and EPS step by step, ensure articulation with balance sheet retained earnings<br>• Prepare cash flow statement using direct method for operating activities, use indirect method for supplementary schedule reconciling net income to operating cash flow, analyze investing and financing activities',
        'The core task of this step is to apply financial analysis methods to comprehensively evaluate enterprise financial position and operating results including ratio analysis, trend analysis, structural analysis, DuPont analysis.<br><br>• Calculate four categories of financial ratios: liquidity (current, quick, debt ratio, interest coverage), activity (receivables turnover, inventory turnover, total asset turnover), profitability (gross margin, net margin, ROE, ROA), growth (revenue growth, profit growth)<br>• Perform DuPont analysis, decompose ROE into net margin × asset turnover × equity multiplier, analyze impact of each factor, identify key drivers<br>• Conduct trend and structural analysis (MoM, YoY, common-size statements), write financial analysis report, evaluate financial position, identify issues and propose improvements'
    ],
    ['经济业务分析工作底稿（含原始凭证审核表、业务分类汇总表、会计科目对应表）','会计凭证与账簿（含记账凭证、现金/银行日记账、明细分类账、总分类账、试算平衡表）','期末调整与结账工作底稿（含调整分录、财产清查报告、银行存款余额调节表、结账分录、结账后试算平衡表）','财务报表（资产负债表、利润表、现金流量表、所有者权益变动表、报表附注）','财务分析报告（含比率分析表、杜邦分析图、趋势分析表、结构分析表、综合评价与建议）'],
    ['Transaction analysis working papers (source document review, transaction classification summary, account correspondence table)','Accounting vouchers and ledgers (journal vouchers, cash/bank journals, subsidiary ledgers, general ledger, trial balance)','Period-end adjustment and closing working papers (adjusting entries, physical count report, bank reconciliation, closing entries, post-closing trial balance)','Financial statements (balance sheet, income statement, cash flow statement, changes in equity, notes)','Financial analysis report (ratio analysis table, DuPont chart, trend analysis, structural analysis, comprehensive evaluation and recommendations)'],
    ['原始凭证审核无遗漏，业务分类准确，会计科目运用正确','记账凭证编制准确，账簿登记规范，账证相符、账账相符、试算平衡','调整事项完整准确，账实相符，损益结转正确，结账后试算平衡','报表格式规范，数据准确，表内项目填列正确，表间勾稽关系一致','比率计算准确，分析深入有逻辑，结论有数据支撑，建议切实可行'],
    ['Complete document review, accurate classification, correct account application','Accurate vouchers, proper ledger posting, voucher-ledger and ledger-ledger reconciliation, balanced trial','Complete and accurate adjustments, reconciled counts, correct closing, balanced post-closing trial','Proper format, accurate data, correct line item presentation, consistent inter-statement articulation','Accurate ratio calculations, logical in-depth analysis, data-supported conclusions, practical recommendations']
)


def build_html(course_key):
    if course_key not in COURSE_DATA:
        return None
    d = COURSE_DATA[course_key]
    
    cn_html = ''
    for i in range(5):
        cn_html += f'''
<div class="step-item">
    <div class="step-number">步骤 {i+1}</div>
    <div class="step-title">{d['cn_title'][i]}</div>
    <div class="step-desc">
        {d['cn_desc'][i]}
    </div>
    <div class="step-output">产出：{d['cn_output'][i]}｜ 质量标准：{d['cn_quality'][i]}</div>
</div>
'''
    
    en_html = ''
    for i in range(5):
        en_html += f'''
<div class="step-item">
    <div class="step-number">Step {i+1}</div>
    <div class="step-title">{d['en_title'][i]}</div>
    <div class="step-desc">
        {d['en_desc'][i]}
    </div>
    <div class="step-output">Deliverable: {d['en_output'][i]} | Quality standard: {d['en_quality'][i]}</div>
</div>
'''
    
    return cn_html + '''
<div style="margin-top:14px;padding-top:10px;border-top:1px solid #eee;">
    <h3 style="font-size:0.9rem;color:#667eea;margin-bottom:8px;">Steps</h3>
''' + en_html + '''
            </div>
'''


def process_file(filepath, course_key):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_inner = build_html(course_key)
    if new_inner is None:
        return False
    
    pattern = r'(<h2>实施步骤 <span class="en">Implementation Steps</span></h2>\s*<div>\s*).*?(?=\s*</div>\s*</div>\s*<div class="course-nav)'
    new_content = re.sub(pattern, r'\1' + new_inner, content, flags=re.DOTALL)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True


def main():
    courses_dir = '/workspace/business/courses'
    
    target_files = [
        'acct-advanced.html', 'acct-audit.html', 'acct-cost.html', 'acct-financial.html',
        'acct-intermediate.html', 'acct-managerial.html', 'acct-tax.html',
        'ba-capstone.html', 'ba-database.html', 'ba-optimization.html', 'ba-python.html',
        'ba-statistics.html', 'ba-visualization.html',
        'fin-accounting.html', 'fin-corporate.html', 'fin-derivatives.html', 'fin-markets.html',
        'fin-principles.html', 'fin-risk.html',
        'ib-finance.html', 'ib-intro.html', 'ib-law.html', 'ib-management.html', 'ib-trade.html',
        'mgmt-change.html', 'mgmt-hr.html', 'mgmt-leadership.html', 'mgmt-operations.html',
        'mgmt-organizational.html', 'mgmt-strategy.html',
        'mkt-analytics.html', 'mkt-brand.html', 'mkt-consumer.html', 'mkt-digital.html',
        'mkt-research.html', 'mkt-strategy.html',
        'scm-inventory.html', 'scm-logistics.html', 'scm-operations.html', 'scm-procurement.html',
        'scm-simulation.html', 'scm-strategy.html'
    ]
    
    print(f"目标文件：{len(target_files)} 个\n")
    
    success = 0
    failed = []
    skipped = []
    
    for filename in target_files:
        course_key = filename.replace('.html', '')
        filepath = os.path.join(courses_dir, filename)
        
        if not os.path.exists(filepath):
            print(f"[跳过] 文件不存在: {filename}")
            skipped.append(filename)
            continue
        
        try:
            if process_file(filepath, course_key):
                print(f"  ✓ 已修改: {filename}")
                success += 1
            else:
                print(f"[跳过] 无数据: {filename}")
                skipped.append(filename)
        except Exception as e:
            failed.append(filename)
            print(f"[失败] {filename}: {e}")
            import traceback
            traceback.print_exc()
    
    print(f"\n共修改了 {success} 个文件")
    if skipped:
        print(f"跳过 {len(skipped)} 个: {skipped}")
    if failed:
        print(f"失败 {len(failed)} 个: {failed}")
    return success


if __name__ == '__main__':
    main()
