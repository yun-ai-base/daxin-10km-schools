/* ===========================================================
   公开师资信息索引（只收录官方公示 / 学校官网发布的具名信息）
   -----------------------------------------------------------
   收录原则：
     1. 只收办学单位主动公开发布的具名信息（省教育厅公示、市/区教育局
        公示、学校官网教师专栏、权威媒体报道）。
     2. 不收任课班级对应关系——这类信息不公开，且每学期变动。
     3. 不收联系方式。
   字段：
     n    姓名
     unit 单位（原文口径）
     subj 学科（"待核" = 来源未标明）
     role 角色
     title 公开头衔 / 荣誉
     src  来源
     y    信息年份
     url  来源链接
     note 备注
   =========================================================== */

const TEACHERS = [
  /* ---------- 数学学科（对补课老师最相关）---------- */
  { n:"方亚斌", unit:"深圳市南头中学", subj:"数学", role:"教师（长期任教高三）",
    title:"正高级教师 · 广东省名师工作室主持人 · 南山区高三数学名师工作室主持人 · 广东省数学奥林匹克优秀教练员 · 深圳市地方级领军人才",
    src:"百度百科 / 公开报道", y:2017, url:"https://baike.baidu.com/item/%E6%96%B9%E4%BA%9A%E6%96%8C",
    note:"曾辅导学生获广东省高考文科状元，发表论文 200 余篇，出版专著 10 余部；常受邀到各地讲学" },
  { n:"李忠来", unit:"深圳市蛇口育才教育集团育才中学", subj:"数学", role:"数学教研组组长",
    title:"中学高级教师 · 全国数学联赛省一级教练员 · 南山区高三名师工作室主持人 · 首届南山区名师工作室主持人",
    src:"深圳南山网", y:2018, url:"https://inanshan.sznews.com/content/2018-04/24/content_18954876.htm",
    note:"长期担任超常班数学教学；曾带出高考数学深圳市平均分第三、理科第四" },
  { n:"钱江", unit:"深圳市宝安中学（集团）", subj:"数学", role:"教师（长期任教高三）",
    title:"高中数学正高级教师 · 广东省特级教师 · 广东省名师工作室主持人 · 华中师范大学兼职硕士导师 · 深圳市数学学会常务理事",
    src:"南方+ / 搜狐教育", y:2023, url:"https://static.nfapp.southcn.com/content/202303/05/c7422098.html",
    note:"培养多名广东省、深圳市数学单科状元及二十位北大清华学生" },
  { n:"罗朗馥", unit:"深圳市宝安中学（集团）", subj:"数学", role:"原副校长（主管教学）",
    title:"中学数学特级教师 · 宝安区数学首席教师 · 宝安区罗朗馥名师工作室主持人 · 深圳市十佳师德标兵",
    src:"宝安中学官网", y:2017, url:"https://bazx.baoan.edu.cn/index.php?id=11809&r=space%2Fschool%2Fcontent%2Fview",
    note:"曾任数学科组长、教导处主任；现为桃源居中澳实验学校、滨海高级中学顾问" },
  { n:"王刚才", unit:"深圳市宝安中学（集团）高中部", subj:"待核", role:"教师",
    title:"中学特级教师 · 中学高级教师 · 基础教育新课程国家级骨干",
    src:"宝安中学官网", y:2017, url:"https://bazx.baoan.edu.cn/index.php?id=11810&r=space%2Fschool%2Fcontent%2Fview",
    note:"官网原文未标注学科，需核实是否为数学" },

  /* ---------- 广东省「四名」工程（2027–2029 拟定，2026-09 公示）---------- */
  { n:"孙立春", unit:"深圳市南山外国语学校（集团）", subj:"—", role:"集团层面",
    title:"广东省中小学名校长工作室主持人（2027–2029 拟定）", src:"广东省教育厅公示", y:2026,
    url:"https://www.nfnews.com/content/W3YbmaLB6A.html", note:"" },
  { n:"申文兵", unit:"深圳市南山实验教育集团园丁学校", subj:"—", role:"班主任",
    title:"广东省中小学名班主任工作室主持人（2027–2029 拟定）", src:"广东省教育厅公示", y:2026,
    url:"https://www.nfnews.com/content/W3YbmaLB6A.html", note:"" },
  { n:"杨柳", unit:"深圳市蛇口育才教育集团山海学校", subj:"—", role:"班主任",
    title:"广东省中小学名班主任工作室主持人（2027–2029 拟定）", src:"广东省教育厅公示", y:2026,
    url:"https://www.nfnews.com/content/W3YbmaLB6A.html", note:"" },
  { n:"荆文华", unit:"深圳市蛇口育才教育集团（原文：育才一中）", subj:"—", role:"教师",
    title:"广东省中小学名教师工作室主持人（2027–2029 拟定）", src:"广东省教育厅公示", y:2026,
    url:"https://www.nfnews.com/content/W3YbmaLB6A.html", note:"公示原文写「育才一中」，现有校区为育才二中 / 三中，需核实对应校区" },
  { n:"王贤灿", unit:"深圳市南山区教科院附属学校教育集团松坪学校", subj:"—", role:"教师",
    title:"广东省中小学名教师工作室主持人（2027–2029 拟定）", src:"广东省教育厅公示", y:2026,
    url:"https://www.nfnews.com/content/W3YbmaLB6A.html", note:"" },

  /* ---------- 深圳市「我最喜爱的班主任」（第四届，2025）---------- */
  { n:"万显军", unit:"深圳市南头中学", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"徐莹", unit:"深圳市蛇口育才教育集团育才中学", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"杨伟", unit:"深圳市蛇口育才教育集团育才二中", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"杨雁玲", unit:"深圳市蛇口育才教育集团育才三中", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"朱冬莲", unit:"深圳市南山区第二外国语学校（集团）海德学校", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"林冰云", unit:"深圳市蛇口育才教育集团育才实验学校", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"李思玫", unit:"深圳市南山实验教育集团南海中学", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"刘容君", unit:"深圳市南山实验教育集团园丁学校", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"李孟珂", unit:"深圳市南山区深中南山创新学校", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },
  { n:"孙思佳", unit:"深圳市南山实验教育集团前海港湾学校", subj:"—", role:"班主任",
    title:"第四届深圳市「我最喜爱的班主任」", src:"深圳市教育局 / 深圳政府在线", y:2025,
    url:"https://www.sz.gov.cn/cn/xxgk/zfxxgj/gqdt/content/post_11988848.html", note:"" },

  /* ---------- 其他官方公示 ---------- */
  { n:"刘万讲", unit:"深圳市南山区学府中学", subj:"—", role:"家庭教育",
    title:"首批广东省中小学家庭教育名师工作室主持人培养对象", src:"广东省教育厅公示", y:2025,
    url:"https://static.nfnews.com/content/202504/08/c11164381.html", note:"" }
];

/* 官网可达性实测结果（2026-10-23） */
const SITE_STATUS = [
  { zone:"南山区（46 所公办初中 + 全部区属高中）", domain:"*.szns.edu.cn", ok:false,
    detail:"DNS 无 A 记录，整片域名已下线（含 hqczx / bsdxx 等子域与 www.szns.edu.cn）" },
  { zone:"宝安中学（集团）高中部", domain:"bazx.baoan.edu.cn", ok:true,
    detail:"在线；有教师文字简介，但均为 2017 年发布，id 序列约 11790–11824" },
  { zone:"西乡中学", domain:"xxzx.baoan.edu.cn", ok:true,
    detail:"在线；有「师资队伍」栏目（教师团队 / 省市级名师 / 名师工作室主持人），但内容为纯图片，无文字可提取；站点部分页面提示已被锁定" },
  { zone:"海滨中学", domain:"hbzx.baoan.edu.cn", ok:true,
    detail:"域名可解析，首页返回空内容" }
];
