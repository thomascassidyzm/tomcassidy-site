// THE CHINESE SETS (job #690·AH, 2026-11-13). Loaded after content.js; adds four sets to window.NOTEMAP_CONTENT.sets.
// Simplified Chinese, mainland usage. In a Chinese label a SPACE separates the arches (one unit per arch, written as given);
// a no-break space ( ) is a space inside one arch. Latin capitals, digits and formulae stay in the stroke-drawn hand;
// Chinese is set in the bundled face (designs/best/fonts/, SIL OFL 1.1). After editing any text here, re-run
// tools/zh-font-subset.sh so the bundled subset holds every character used.
(function () {
  const NC = window.NOTEMAP_CONTENT, build = NC.build;
  const C = (...w) => w.reduceRight((k, t) => Array.isArray(t) ? t : [t, null, k ? [k] : []], null);   // a chain of arches; a last argument that is itself a node ends the chain
  const N = (t, ...kids) => [t, null, kids];                                      // a word with several lines leaving it

  // 1. history-zh: A TRANSCRIPTION of the hand-written Chinese map on the student deck's slide 70 ("How to read a SmartWisdom
  // in Chinese", uploads/tom/03d9547b, the only Chinese in the deck). Its subject is "A Global History" (the reader's note of
  // Stavrianos), NOT Jonathan's Story. Read from an 897 x 1315 JPEG; simplified as written. Clockwise from 1 o'clock.
  // DOUBTFUL READINGS (the picture wins; each is the best reading, not a certainty):
  //   团结 (before 扭转 危机) · 敌人 and 对付 (in the 例子 chain) · 不能 (the 能) · 杞人忧天 (the 杞) · 变为 (before 明智)
  //   不断革新 (the first two characters) · 广度 (beside 重要性) · 未考虑 · 致力
  // UNREADABLE: the two-character word between 培根 and 知识技能 is written □□. The second margin box and the date box
  //   could not be read and are left empty. The circled mark before 与人类 / 与人 is read as a circled E and written (E).
  // LEFT OUT (marginal notes and marks, not arches): START, the arrows and brackets, "or", "Negative Cycle", the ticks and
  //   crosses, the circled 1 and 2 with their “经济动物” labels, and the three-line note bottom left
  //   (此处为培根和库斯托所提出的两大基本观点).
  // Which line leaves which word is read by eye; where it is not clear the nearest reading is taken.
  const history = ["A GLOBAL HISTORY", [
    N("每个", C("时代", "新的", "历史"), C("新的", "全球", "视角"), C("需要", "理解", "新的", "变化")),
    C("新世界", "需要", N("新史学", ["新全球史"], ["新史学方法"])),
    N("时代问题", C("20C 60S", "殖民地革命"), C("20C 90S", "科技的影响"),
      N("当今", N("环境问题", C("团结", "扭转", "危机"), C("环境", "恶化", "社会", "解体")))),
    N("(E)与人类", N("人", C("适应", "环境", "变化"), C("首要", "地位", "(威胁)")),
      N("例子", C("人", "消灭", "天花"), C("敌人", "对付", "决定性", "差异"))),
    N("(E)与人", C("人", "没有", "新对手"), C("人", "面对的", "只有自己")),
    C("人人关系", "培根(英)", "科学、努力", "带来危险"),
    N("人", N("培根", C("□□", "知识技能"), C("以", "人性、慈善", "引导"))),
    N("人人关系", N("培根", C("不为", "卑微目的"), C("而为", "改善生活")),
      N("库斯托", N("责任", N("维系", ["社会机制"], ["个人美德"])), C("个人经历", "社会意义"))),
    C("面对", "基本原则"),
    C("首先", "基本要求", "得到满足"),
    N("然后", N("不顾", N("代价", ["生态"], ["社会"], ["个人"])), N("成为", N("膨胀的", ["银行"], ["胃"]))),
    N("现状", C("未考虑", "基本问题", "以下"), C("消费主义", "物质主义", "全球", "泛滥")),
    N("致力", C("寻找", "“伦理罗盘”", "引导", "技术发展"), C("避免", "成为", "“经济动物”")),
    N("21世纪", N("聪明", C("变为", "明智"), C("不断革新", "重要性", "广度"))),
    N("我们", N("拥有", N("巨大", C("各种", "可能性"), ["危险"], ["可能性"])),
      N("不能", C("自我欺骗", "杞人忧天"), C("冷静地", "再评价"))),
  ]];

  // 2. story-zh: Jonathan's Story, TRANSLATED from the English slides 19-36 of the same deck. No Chinese version of
  // Jonathan's Story is held anywhere on watson-1; this is a translation, not his own Chinese text.
  const story = ["JONATHAN 的故事", [
    N("朋克摇滚", C("难以", "专注"), C("学习", "效率低"), C("考试", "成绩差"), C("拒绝", "上大学")),
    N("澳大利亚", N("牛仔", C("有了动力", "就能专注"), C("改进", "工作流程", "凭直觉"))),
    N("伦敦", N("警察厅 警长", C("万事万物", "相互关联", "的系统"), C("天生擅长", "处理", "复杂信息"), C("乐于", "通过培训", "帮助他人"))),
    N("理学硕士", N("伦敦 城市大学 商学院", C("开发", "检验", "完善"), C("高效", "学习方法", "管理信息"), C("创立", "SMARTWISDOM"))),
    N("1998", N("SMARTWISDOM 咨询公司", C("培训", "伦敦金融城", "资深", "专业人士"), C("研发", "更多", "SMARTWISDOM", "技法"), C("24年", "经验"))),
  ]];

  // 3. intro-zh: the Kemp intro map (set "kemp" in content.js), translated arch for arch, same shape.
  const intro = ["SMARTWISDOM", [
    N("SMART", N("WISDOM",
        N("记笔记", ["加强版"], C("看着", "很酷")),
        N("工具", C("记录", "知识"), C("分析", "信息"))),
      N("技能", C("提升", "思维"), C("新的", "洞见"))),
    N("求学", C("中学", "大脑", "吃力"), C("大学", "信息", "过载")),
    C("寻找", "更好的", N("方法", C("记", "笔记"), C("让大脑", "理清", "头绪"))),
    N("为什么",
      N("笔记", C("(管用)", "(变了)", N("2000年", ["列表"], ["要点"])), C("(怎样)", "大脑", N("运作", ["存储"], ["处理"]))),
      N("电脑", ["更糟"], C("打字", N("记录", ["(思考)"], ["(理解)"])))),
    N("容易", C("学会", "2个", "小时", "练习"), C("人人", "能学", "能用", "很快")),
    N("模板",
      C("三个", "圆环", "想法", "向外", "展开"),
      C("连接线", N("连起", ["信息"], ["细节"])),
      C("大写", "字母", "容易", "读")),
    N("用处",
      C("会议", "讲座", "上课", "网课"),
      N("构思", C("故事", "文章"), ["演讲"]),
      C("记", "笔记", "复习", "考试")),
    C("好处", "提升", "回忆", "更快", "细节"),
    N("引发", C("更深的", "提问"), C("得出", "意外的", "结论")),
    C("改变了", "人生", N("成功的", ["事业"], C("学位", "优等"))),
    N("开始", C("今天", "就用", "SMARTWISDOM"), C("让你的", "人生", "成功")),
  ]];

  // 4. physics-zh: the GCSE physics subject map (set "physics120" in content.js), translated node for node with the same
  // competence levels. Terms are the mainland school-physics ones; formulae are left as the English map writes them.
  const L = (t, lvl, ...kids) => [t, lvl, kids];
  const physics = ["GCSE 物理", [
    L("能量", 3,
      L("能量储存", 4, ["动能 ½mv²", 4], ["重力势能 mgh", 3], ["弹性势能 ½ke²", 2]),
      L("能量转移", 3, ["功=力×距离", 3], ["功率 =能量÷时间", 4]),
      L("能量守恒", 3, ["不会凭空 产生或消失", 4], ["以热 耗散", 3]),
      L("效率", 2, ["有用输出 ÷总输入", 2], ["润滑 减少损耗", 1]),
      L("能源", 1, ["可再生 与不可再生", 2], ["供应 可靠性", 0])),
    L("电学", 2,
      L("电路", 3, ["电流 是电荷流动", 3], ["电势差", 2], ["电阻 V = IR", 3]),
      L("串联与并联", 2, ["串联 电流相等", 3], ["串联 电压分配", 1]),
      L("元件", 2, ["灯丝灯泡 曲线", 2], ["二极管 单向导电", 2], ["热敏电阻 光敏电阻", 1]),
      L("市电", 1, ["230伏 50赫兹", 2], ["火线 零线 地线", 1]),
      L("电功率", 2, ["P = IV", 3], ["国家电网 变压器", 1])),
    L("粒子模型", 3,
      L("密度", 4, ["质量÷体积", 4], ["测量 不规则固体", 3]),
      L("物态", 4, ["固态 液态 气态", 4], ["物态变化", 3]),
      L("内能", 2, ["比热容", 2], ["比潜热", 1], ["加热曲线", 2]),
      L("气体压强", 2, ["粒子 撞击器壁", 3], ["越热 越快", 3], ["pV 为常量", 1])),
    L("原子结构", 1,
      L("原子", 3, ["质子 中子 电子", 4], ["同位素", 2], ["枣糕模型 到核式模型", 2]),
      L("辐射", 1, ["α β γ", 2], ["电离能力", 1], ["穿透能力", 1]),
      L("半衰期", 1, ["随机衰变", 2], ["读衰变曲线", 0]),
      L("危害", 1, ["放射性污染 与辐照", 0], ["本底辐射", 1]),
      L("裂变与聚变", 0, ["链式反应", 0], ["恒星中的 聚变", 0])),
    L("力", 3,
      L("标量与矢量", 4, ["合力", 3], ["受力分析图", 3]),
      L("运动", 3, ["速率 与速度", 4], ["加速度", 3], ["路程-时间 图像", 4], ["速度-时间 图像", 2]),
      L("牛顿定律", 3, ["惯性", 3], ["F = ma", 4], ["大小相等 方向相反", 2]),
      L("动量", 1, ["p = mv", 2], ["碰撞中 守恒", 1]),
      L("停车距离", 2, ["反应距离", 3], ["制动距离", 2])),
    L("波", 2,
      L("波的性质", 3, ["横波 与纵波", 3], ["v = fλ", 3], ["振幅 与周期", 2]),
      L("反射与折射", 2, ["光路图", 2], ["界面处 波速改变", 1]),
      L("电磁波谱", 2, ["无线电波 到γ射线", 3], ["各波段 的用途", 2], ["高频 的危害", 2]),
      L("声", 1, ["需要介质", 2], ["超声波 回声", 0])),
    L("磁", 1,
      L("磁体", 3, ["同极相斥 异极相吸", 4], ["磁感线 分布", 2]),
      L("电磁铁", 1, ["导线周围 的磁场", 2], ["螺线管", 1]),
      L("电动机效应", 0, ["弗莱明 左手定则", 1], ["F = BIL", 0], ["电动机", 0]),
      L("电磁感应", 0, ["发电机效应", 0], ["变压器", 0], ["交流发电机 与直流发电机", 0])),
    L("太空", 0,
      L("太阳系", 2, ["行星 与卫星", 3], ["轨道运行 靠引力", 1]),
      L("恒星的一生", 0, ["星云 到主序星", 1], ["红巨星", 0], ["超新星 与黑洞", 0]),
      L("宇宙", 0, ["红移", 0], ["大爆炸 的证据", 0]),
      L("卫星", 1, ["天然 与人造", 1], ["轨道速度 变化", 0])),
  ]];

  NC.sets["history-zh"] = build(history, "", "");
  NC.sets["story-zh"] = build(story, "SMARTWISDOM 创始人", "译自英文");
  NC.sets["intro-zh"] = build(intro, "JONATHAN KEMP 介绍 SMARTWISDOM", "中文译本");
  NC.sets["physics-zh"] = build(physics, "GCSE 物理 学科图", "中文译本");
  NC.zh = ["history-zh", "story-zh", "intro-zh", "physics-zh"];
})();
