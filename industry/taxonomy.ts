// 这个行业的分类体系：类别、标签词表、机构（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉结构抽取模型这一类收什么、
 * 和相邻类别的边界在哪（总的归类原则写在 prompts/structure.md 里）。
 * commentary 标出评论类（教程、观点）：日报写过的事又有评论类的后续报道，只占一行快讯（报道它的信源够多时除外）。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 * feedLabel 是分类 RSS 标题里的名字（不写就用 label）。公开接口、RSS 和 MCP 里要把一类并进另一类发布，写在站点设置里（site/site.ts 的 PUBLIC_CATEGORIES）。
 */
export const CATEGORIES = [
  { key: "ai-frontier", label: "AI 前沿", feedLabel: "AI 前沿", section: "AI 与计算", guide: "人工智能的模型与算法突破（新架构、训练与推理方法、基准结果、能力与评测）、算力与系统（芯片、集群、训练基础设施）、AI for Science（用模型做蛋白质结构、材料、天气、数学等科学发现），以及大模型的能力边界与安全对齐研究。把 AI 用在某个具体学科问题上的成果，若重心在科学发现本身，归对应的学科类别；机器人、自动驾驶等具身系统的工程与产品进展归产业事件。" },
  { key: "life-science", label: "生命科学", feedLabel: "生命科学", section: "生命与医学", guide: "分子与细胞生物学、遗传与基因组学、生态与演化、微生物与免疫的基础研究，以及合成生物学（基因线路、人工细胞、生物制造）和作物与农业生物技术。不做人体试验的基础机制发现归这里；以患者和疗效为中心的试验结果归临床医学，直接改造人类基因或细胞的疗法归基因与细胞。" },
  { key: "neuroscience", label: "神经科学", feedLabel: "神经科学", section: "生命与医学", guide: "脑与认知的基础研究：神经环路与突触机制、感知与记忆、认知与行为实验、神经退行性疾病的机制研究、脑成像与神经调控方法，以及脑机接口与神经假体（电极、解码算法、植入试验）。疾病机制归这里，患者队列与疗效终点归临床医学，以基因或细胞为手段的治疗归基因与细胞。" },
  { key: "clinical", label: "临床医学", feedLabel: "临床医学", section: "生命与医学", guide: "以患者为中心的结果：临床试验的设计与结果（含阴性结果与提前终止）、诊断与影像、医疗器械与手术术式、指南与专家共识，以及公共卫生与流行病学（疾病监测、暴发调查、疫苗效力、健康政策）。药物本身的获批与监管决定归药物与疗法；机制的实验室发现归生命科学或神经科学。" },
  { key: "drug-therapy", label: "药物与疗法", feedLabel: "药物与疗法", section: "生命与医学", guide: "药物从研发到上市的监管与开发环节：监管机构的批准、拒绝、附条件批准与撤回，临床前研究，I/II/III 期试验及其设计读出，疫苗研发，给药方式与递送技术，以及药企的管线与合作交易。以药物为手段的试验结果也归这里；器械与术式的临床结果归临床医学；把基因或细胞本身作为药物的疗法归基因与细胞。" },
  { key: "gene-cell", label: "基因与细胞", feedLabel: "基因与细胞", section: "生命与医学", guide: "以基因或细胞为手段的技术与疗法：基因编辑（CRISPR 等工具的机制、脱靶与递送改进）、基因治疗、CAR-T 等细胞治疗、干细胞与再生医学，以及表观遗传编辑与调控。作为研究工具的基础发现归生命科学；这些疗法的监管批准与试验读出归药物与疗法。" },
  { key: "quantum-physics", label: "量子与物理", feedLabel: "量子与物理", section: "物质与量子", guide: "物理学的基础与前沿：量子计算、量子通信与量子精密测量（比特与纠错、算法、硬件路线），凝聚态与超导，粒子物理与核物理，天体物理与宇宙学，以及光学与激光。成果落到具体器件材料（半导体工艺、电池、催化）时归材料与能源；把量子方法用来解决化学或生物问题的成果，按其学科重心归类。" },
  { key: "materials-energy", label: "材料与能源", feedLabel: "材料与能源", section: "物质与量子", guide: "材料与能源的研发与工程：新材料的设计与表征（金属、陶瓷、二维材料、超导材料），电池与储能，半导体材料与器件工艺，催化与化工，光伏、风电、核能与核聚变。纯物理机制或量子现象归量子与物理；纯化学与生物的机制发现归生命科学。" },
] as const satisfies ReadonlyArray<{ key: string; label: string; feedLabel?: string; section: string; guide: string; commentary?: true }>;

/**
 * 这个行业最受关注的一类发布（如 AI 行业的新模型）：日报报头的“N 个新模型”、改分类后修订已出的报告都按它数。
 * category 是类别，tag 是标签，两者都对上才算；unit 接在数字后面。
 * 没有这样一类的行业设成 null，报头就不显示这个数。
 * 学术站没有单一“发布”形态：论文、预印本、试验读出、监管批准分散在八个类别里，没有一个既定的类别与标签组合可以代表“本期新发布”。
 */
export const RELEASE: { category: string; tag: string; unit: string } | null = null;

/** 周报月报的总述可以直接写、不必在报道里找到出处的行业通用词（小写）。站名会自动算进去。 */
export const PLAIN_TERMS: readonly string[] = ["ai", "dna", "rna", "fda", "nmpa", "cdc", "who", "nih", "arxiv", "llm", "gpu", "crispr", "mrna", "pd-1", "alzheimer", "covid"];

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["research_paper", "clinical_trial", "regulatory_decision", "research_policy", "industry_event", "opinion_analysis", "tutorial_explainer"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/**
 * 每篇资料的第一个标签必须是这些“分类标签”之一。
 * 顺序不是随意的：模型没给出可用的分类标签时，normalizeTags 会回落到最后一项，
 * 所以最通用的「研究成果」放在末尾（未归类的学术资料标成“研究成果”比标成别的内容形态更合理）。
 */
export const CATEGORY_TAGS = [
  "论文发表", "临床试验", "监管批准", "撤稿更正", "奖项荣誉", "政策发布", "经费与资助",
  "会议与顶会", "合作与转让", "数据发布", "安全事件", "人物变动", "研究成果",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "大模型", "蛋白质结构", "脑机接口", "阿尔茨海默", "帕金森", "癌症免疫", "mRNA", "CRISPR",
  "基因治疗", "细胞治疗", "干细胞", "肠道菌群", "衰老", "量子计算", "超导", "核聚变",
  "固态电池", "光伏", "半导体材料", "催化",
] as const;

/** 可选的实体标签（机构、期刊、公司）。 */
export const ENTITY_TAGS = ["Nature", "Science", "Cell", "NEJM", "The Lancet", "arXiv", "bioRxiv", "NIH", "FDA", "NMPA", "WHO", "DeepMind", "OpenAI", "NVIDIA"] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  论文: "论文发表", 预印本: "论文发表", 发表: "论文发表", 顶刊: "论文发表", 期刊: "论文发表", paper: "论文发表",
  研究: "研究成果", 发现: "研究成果", 突破: "研究成果", 实验结果: "研究成果", research: "研究成果",
  试验: "临床试验", 临床: "临床试验", 三期: "临床试验", 试验结果: "临床试验", 临床试验结果: "临床试验", 阴性结果: "临床试验",
  获批: "监管批准", 批准: "监管批准", 上市许可: "监管批准", 药监: "监管批准", 审批: "监管批准", 适应症: "监管批准",
  撤稿: "撤稿更正", 更正: "撤稿更正", 勘误: "撤稿更正", 学术不端: "撤稿更正", 造假: "撤稿更正", 打假: "撤稿更正",
  奖项: "奖项荣誉", 获奖: "奖项荣誉", 诺贝尔奖: "奖项荣誉", 荣誉: "奖项荣誉", 院士: "奖项荣誉",
  政策: "政策发布", 法规: "政策发布", 指南: "政策发布", 资助政策: "政策发布", 管制: "政策发布",
  经费: "经费与资助", 资助: "经费与资助", 基金: "经费与资助", 拨款: "经费与资助", 科研投入: "经费与资助", 预算: "经费与资助",
  会议: "会议与顶会", 顶会: "会议与顶会", 学术会议: "会议与顶会", 投稿: "会议与顶会", 接收: "会议与顶会", 大会: "会议与顶会",
  合作: "合作与转让", 战略合作: "合作与转让", 专利: "合作与转让", 技术转让: "合作与转让", 授权: "合作与转让", 孵化: "合作与转让",
  数据: "数据发布", 数据集: "数据发布", 数据库: "数据发布", 公开数据: "数据发布", 基准: "数据发布",
  安全: "安全事件", 实验室事故: "安全事件", 生物安全: "安全事件", 数据泄露: "安全事件", 伦理争议: "安全事件",
  人事: "人物变动", 任免: "人物变动", 履新: "人物变动", 离职: "人物变动", 校长: "人物变动", 所长: "人物变动",
  llm: "大模型", 大语言模型: "大模型", 语言模型: "大模型", 基础模型: "大模型", gpt: "大模型", 生成式ai: "大模型",
  alphafold: "蛋白质结构", 蛋白质折叠: "蛋白质结构", "蛋白结构": "蛋白质结构",
  bci: "脑机接口", 神经接口: "脑机接口", 脑机: "脑机接口",
  老年痴呆: "阿尔茨海默", 阿兹海默: "阿尔茨海默", 阿尔茨海默病: "阿尔茨海默",
  帕金森病: "帕金森",
  免疫治疗: "癌症免疫", 肿瘤免疫: "癌症免疫", "car-t": "细胞治疗", cart: "细胞治疗",
  "crispr-cas9": "CRISPR", 基因编辑: "CRISPR",
  基因疗法: "基因治疗",
  细胞疗法: "细胞治疗",
  再生医学: "干细胞", ips: "干细胞", 诱导多能干细胞: "干细胞",
  微生物组: "肠道菌群", 菌群: "肠道菌群", 微生物群: "肠道菌群",
  抗衰老: "衰老", 长寿: "衰老", 衰老研究: "衰老",
  量子: "量子计算", 量子信息: "量子计算", 量子比特: "量子计算", 量子霸权: "量子计算",
  室温超导: "超导", 超导体: "超导",
  可控核聚变: "核聚变", 聚变: "核聚变", 托卡马克: "核聚变",
  锂电: "固态电池", 全固态电池: "固态电池", 电池: "固态电池", 储能: "固态电池",
  太阳能: "光伏", 钙钛矿: "光伏", 太阳能电池: "光伏",
  芯片: "半导体材料", 芯片材料: "半导体材料", 光刻: "半导体材料",
  nature: "Nature", science: "Science", cell: "Cell", nejm: "NEJM", lancet: "The Lancet",
  arxiv: "arXiv", biorxiv: "bioRxiv", medrxiv: "bioRxiv", nih: "NIH", fda: "FDA", nmpa: "NMPA", who: "WHO",
  deepmind: "DeepMind", "google deepmind": "DeepMind", openai: "OpenAI", nvidia: "NVIDIA", 英伟达: "NVIDIA",
};

// ── 机构与主体 ──────────────────────────────────────────────────────────────────────────

/**
 * 机构主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。
 * aliases 给结构抽取模型看；otherNames 是机构自己的其他称呼（官方账号名、子品牌、下属实验室），
 * 把事实的主体对到发布方时也认它们。
 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[]; otherNames?: string[] }> = {
  deepmind: { name: "DeepMind", displayTag: "DeepMind", aliases: ["DeepMind", "Google DeepMind", "谷歌 DeepMind"], otherNames: ["AlphaFold", "Isomorphic Labs", "Gemini"] },
  openai: { name: "OpenAI", displayTag: "OpenAI", aliases: ["OpenAI", "开放人工智能"], otherNames: ["ChatGPT", "OpenAI Foundation"] },
  nvidia: { name: "NVIDIA", displayTag: "NVIDIA", aliases: ["NVIDIA", "英伟达", "NVDA"], otherNames: ["NVIDIA Research", "CUDA"] },
  nature: { name: "Nature", displayTag: "Nature", aliases: ["Nature", "自然", "自然杂志"], otherNames: ["Nature Portfolio", "Springer Nature", "Nature Medicine", "Nature Biotechnology"] },
  science: { name: "Science", displayTag: "Science", aliases: ["Science", "科学", "科学杂志"], otherNames: ["AAAS", "Science Advances", "Science Immunology"] },
  cell: { name: "Cell", displayTag: "Cell", aliases: ["Cell", "细胞"], otherNames: ["Cell Press", "Cell Reports", "Cell Metabolism"] },
  nejm: { name: "NEJM", displayTag: "NEJM", aliases: ["NEJM", "The New England Journal of Medicine", "新英格兰医学杂志"] },
  lancet: { name: "The Lancet", displayTag: "The Lancet", aliases: ["The Lancet", "Lancet", "柳叶刀"], otherNames: ["The Lancet Oncology", "The Lancet Infectious Diseases"] },
  arxiv: { name: "arXiv", displayTag: "arXiv", aliases: ["arXiv", "arxiv.org"], otherNames: ["Cornell University"] },
  biorxiv: { name: "bioRxiv", displayTag: "bioRxiv", aliases: ["bioRxiv", "medRxiv"], otherNames: ["Cold Spring Harbor Laboratory"] },
  nih: { name: "NIH", displayTag: "NIH", aliases: ["NIH", "美国国立卫生研究院", "National Institutes of Health"], otherNames: ["NCI", "NIAID", "National Cancer Institute"] },
  fda: { name: "FDA", displayTag: "FDA", aliases: ["FDA", "美国食品药品监督管理局", "U.S. Food and Drug Administration"], otherNames: ["CDER", "CBER", "Vaccines and Related Biological Products Advisory Committee"] },
  nmpa: { name: "NMPA", displayTag: "NMPA", aliases: ["NMPA", "国家药监局", "国家药品监督管理局"], otherNames: ["药品审评中心", "CDE"] },
  who: { name: "WHO", displayTag: "WHO", aliases: ["WHO", "世界卫生组织", "World Health Organization"], otherNames: ["IARC", "国际癌症研究机构"] },
  nsfc: { name: "国家自然科学基金委", displayTag: null, aliases: ["国家自然科学基金委", "国家自然科学基金委员会", "自然科学基金", "NSFC"] },
  cas: { name: "中国科学院", displayTag: null, aliases: ["中国科学院", "中科院", "CAS", "Chinese Academy of Sciences"], otherNames: ["中国科学技术大学", "上海药物研究所", "生物物理研究所"] },
  cdc: { name: "CDC", displayTag: null, aliases: ["CDC", "美国疾控中心", "Centers for Disease Control and Prevention", "中国疾控中心", "中国疾病预防控制中心"], otherNames: ["国家免疫规划"] },
  "nih-cn": { name: "中国医学科学院", displayTag: null, aliases: ["中国医学科学院", "协和医学院", "CAMS", "PUMC"] },
  "broad-institute": { name: "Broad Institute", displayTag: null, aliases: ["Broad Institute", "布罗德研究所"], otherNames: ["Stanley Center"] },
  "crick": { name: "Francis Crick Institute", displayTag: null, aliases: ["Francis Crick Institute", "Crick Institute", "弗朗西斯·克里克研究所"] },
  "max-planck": { name: "马克斯·普朗克学会", displayTag: null, aliases: ["马克斯·普朗克学会", "马克斯·普朗克研究所", "Max Planck", "Max Planck Society", "MPI"] },
  "hhmi": { name: "HHMI", displayTag: null, aliases: ["HHMI", "霍华德·休斯医学研究所", "Howard Hughes Medical Institute"], otherNames: ["Janelia"] },
  "cern": { name: "CERN", displayTag: null, aliases: ["CERN", "欧洲核子研究组织", "欧洲核子研究中心"], otherNames: ["LHC", "大型强子对撞机"] },
  "iter": { name: "ITER", displayTag: null, aliases: ["ITER", "国际热核聚变实验堆"], otherNames: ["EAST", "全超导托卡马克"] },
  "caltech": { name: "加州理工", displayTag: null, aliases: ["加州理工", "California Institute of Technology", "Caltech"], otherNames: ["JPL", "喷气推进实验室"] },
  "mit": { name: "MIT", displayTag: null, aliases: ["MIT", "麻省理工学院", "Massachusetts Institute of Technology"], otherNames: ["MIT Media Lab", "Broad Institute of MIT and Harvard"] },
  "stanford": { name: "斯坦福大学", displayTag: null, aliases: ["斯坦福大学", "Stanford University", "Stanford"], otherNames: ["Stanford Medicine", "SLAC"] },
  "harvard": { name: "哈佛大学", displayTag: null, aliases: ["哈佛大学", "Harvard University", "Harvard"], otherNames: ["Harvard Medical School", "哈佛医学院", "Wyss Institute"] },
  "tsinghua": { name: "清华大学", displayTag: null, aliases: ["清华大学", "清华", "Tsinghua University"], otherNames: ["交叉信息研究院", "AIR"] },
  "peking": { name: "北京大学", displayTag: null, aliases: ["北京大学", "北大", "Peking University"], otherNames: ["北大医学部"] },
  "moderna": { name: "Moderna", displayTag: null, aliases: ["Moderna", "莫德纳", "MRNA"], otherNames: ["Moderna Therapeutics"] },
  "biontech": { name: "BioNTech", displayTag: null, aliases: ["BioNTech", "拜恩泰科", "BNTX"], otherNames: ["复星医药合作项目"] },
  "pfizer": { name: "辉瑞", displayTag: null, aliases: ["辉瑞", "Pfizer", "PFE"] },
  "lilly": { name: "礼来", displayTag: null, aliases: ["礼来", "Eli Lilly", "Lilly", "LLY"], otherNames: ["Lilly Research Laboratories"] },
  "novartis": { name: "诺华", displayTag: null, aliases: ["诺华", "Novartis", "NVS"], otherNames: ["Sandoz"] },
  "roche": { name: "罗氏", displayTag: null, aliases: ["罗氏", "Roche", "Genentech", "基因泰克"], otherNames: ["Roche Diagnostics"] },
  "astrazeneca": { name: "阿斯利康", displayTag: null, aliases: ["阿斯利康", "AstraZeneca", "AZN"] },
  "johnson": { name: "强生", displayTag: null, aliases: ["强生", "Johnson & Johnson", "J&J", "JNJ"], otherNames: ["Janssen", "杨森"] },
  "merck": { name: "默沙东", displayTag: null, aliases: ["默沙东", "Merck", "MSD", "默克"], otherNames: ["Keytruda", "可瑞达"] },
  "biogen": { name: "渤健", displayTag: null, aliases: ["渤健", "Biogen", "BIIB"], otherNames: ["Eisai", "卫材"] },
  "novonordisk": { name: "诺和诺德", displayTag: null, aliases: ["诺和诺德", "Novo Nordisk", "NVO"], otherNames: ["Wegovy", "Ozempic"] },
  "vertex": { name: "Vertex", displayTag: null, aliases: ["Vertex", "Vertex Pharmaceuticals", "福泰制药"], otherNames: ["CRISPR Therapeutics"] },
  "regeneron": { name: "再生元", displayTag: null, aliases: ["再生元", "Regeneron", "REGN"] },
  "gilead": { name: "吉利德", displayTag: null, aliases: ["吉利德", "Gilead", "GILD"], otherNames: ["Kite Pharma"] },
  "wuxi": { name: "药明康德", displayTag: null, aliases: ["药明康德", "WuXi AppTec", "药明生物", "WuXi Biologics"] },
  "hengrui": { name: "恒瑞医药", displayTag: null, aliases: ["恒瑞医药", "恒瑞", "Hengrui Medicine"] },
  "biomarin": { name: "BioMarin", displayTag: null, aliases: ["BioMarin", "拜玛林", "BMRN"] },
  "sangamo": { name: "Sangamo", displayTag: null, aliases: ["Sangamo", "Sangamo Therapeutics", "SGMO"] },
  "editas": { name: "Editas", displayTag: null, aliases: ["Editas", "Editas Medicine", "EDIT"], otherNames: ["Editas Medicine"] },
  "intellia": { name: "Intellia", displayTag: null, aliases: ["Intellia", "Intellia Therapeutics", "NTLA"] },
  "beam": { name: "Beam Therapeutics", displayTag: null, aliases: ["Beam Therapeutics", "Beam", "BEAM"], otherNames: ["碱基编辑"] },
  "crispr-tx": { name: "CRISPR Therapeutics", displayTag: null, aliases: ["CRISPR Therapeutics", "CRSP"], otherNames: ["Casgevy"] },
};

/**
 * 身份词典：摘要和标题里出现的机构，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 学术站的机构名高度重复（多所大学、多家药企、多个期刊同时出现在同一篇报道里），这套守卫误伤远多于收益；
 * 若以后要重新启用，把机构按上面的格式加回来即可。留空数组时守卫自动跳过。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [];

/** 这些域名上的文章，发布方就是对应的机构（托管平台如 arXiv、bioRxiv 不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "deepmind", domains: ["deepmind.com", "deepmind.google"] },
  { entityId: "openai", domains: ["openai.com"] },
  { entityId: "nvidia", domains: ["nvidia.com", "blogs.nvidia.com"] },
  { entityId: "nature", domains: ["nature.com"] },
  { entityId: "science", domains: ["science.org"] },
  { entityId: "cell", domains: ["cell.com"] },
  { entityId: "nejm", domains: ["nejm.org"] },
  { entityId: "lancet", domains: ["thelancet.com"] },
  { entityId: "biorxiv", domains: ["biorxiv.org", "medrxiv.org"] },
  { entityId: "nih", domains: ["nih.gov"] },
  { entityId: "fda", domains: ["fda.gov"] },
  { entityId: "nmpa", domains: ["nmpa.gov.cn"] },
  { entityId: "who", domains: ["who.int"] },
  { entityId: "nsfc", domains: ["nsfc.gov.cn"] },
  { entityId: "cas", domains: ["cas.cn", "cas.ac.cn"] },
  { entityId: "cdc", domains: ["cdc.gov", "chinacdc.cn"] },
  { entityId: "cern", domains: ["home.cern", "cern.ch"] },
  { entityId: "iter", domains: ["iter.org"] },
  { entityId: "broad-institute", domains: ["broadinstitute.org"] },
  { entityId: "crick", domains: ["crick.ac.uk"] },
  { entityId: "max-planck", domains: ["mpg.de"] },
  { entityId: "hhmi", domains: ["hhmi.org", "janelia.org"] },
  { entityId: "caltech", domains: ["caltech.edu"] },
  { entityId: "mit", domains: ["mit.edu", "news.mit.edu"] },
  { entityId: "stanford", domains: ["stanford.edu"] },
  { entityId: "harvard", domains: ["harvard.edu"] },
  { entityId: "tsinghua", domains: ["tsinghua.edu.cn"] },
  { entityId: "peking", domains: ["pku.edu.cn"] },
  { entityId: "moderna", domains: ["modernatx.com"] },
  { entityId: "biontech", domains: ["biontech.com"] },
  { entityId: "pfizer", domains: ["pfizer.com"] },
  { entityId: "lilly", domains: ["lilly.com"] },
  { entityId: "novartis", domains: ["novartis.com"] },
  { entityId: "roche", domains: ["roche.com", "gene.com"] },
  { entityId: "astrazeneca", domains: ["astrazeneca.com"] },
  { entityId: "johnson", domains: ["jnj.com"] },
  { entityId: "merck", domains: ["merck.com", "msd.com"] },
  { entityId: "biogen", domains: ["biogen.com"] },
  { entityId: "novonordisk", domains: ["novonordisk.com"] },
  { entityId: "vertex", domains: ["vrtx.com"] },
  { entityId: "regeneron", domains: ["regeneron.com"] },
  { entityId: "gilead", domains: ["gilead.com"] },
  { entityId: "wuxi", domains: ["wuxiapptec.com"] },
  { entityId: "hengrui", domains: ["hengrui.com"] },
  { entityId: "biomarin", domains: ["biomarin.com"] },
  { entityId: "sangamo", domains: ["sangamo.com"] },
  { entityId: "editas", domains: ["editasmedicine.com"] },
  { entityId: "intellia", domains: ["intelliatx.com"] },
  { entityId: "beam", domains: ["beamtx.com"] },
  { entityId: "crispr-tx", domains: ["crisprtx.com"] },
];

/** 原文里的这些写法也算提到了对应机构。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [
  { entityId: "nature", pattern: /\bnature\s+(?:medicine|biotechnology|methods|genetics|neuroscience|physics|materials)\b/i },
  { entityId: "science", pattern: /\bscience\s+(?:advances|immunology|translational\s+medicine|signaling)\b|\bAAAS\b/ },
  { entityId: "cell", pattern: /\bcell\s+(?:press|reports|metabolism|stem\s+cell|host\s+(?:&|and)\s+microbe)\b/i },
  { entityId: "lancet", pattern: /\blancet\s+(?:oncology|infectious\s+diseases|neurology|public\s+health)\b/i },
  { entityId: "nih", pattern: /\bNCI\b|\bNIAID\b|\bNIMH\b/ },
  { entityId: "fda", pattern: /\bCDER\b|\bCBER\b|\bVRBPAC\b/ },
  { entityId: "nmpa", pattern: /国家药监局|药品审评中心|\bCDE\b/ },
  { entityId: "cdc", pattern: /\b中国疾控中心\b|\b国家免疫规划\b/ },
  { entityId: "moderna", pattern: /\bmRNA-1273\b|\bSpikevax\b/ },
  { entityId: "biontech", pattern: /\bBNT162b2\b|\bComirnaty\b/ },
];
