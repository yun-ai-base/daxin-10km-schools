/* ===========================================================
   大新地铁站 10km 半径 · 初高中学校数据集
   -----------------------------------------------------------
   原点：深圳地铁1号线 大新站  22.5352389N  113.9103806E
   -----------------------------------------------------------
   字段说明：
     name    学校名称（以官方学区图/招生计划表用名为准）
     short   简称
     seg     学段：初中 / 高中 / 完中（初中+高中同址）
     type    办学性质：公办 / 民办
     group   所属教育集团 / 主管方
     street  所在街道或片区
     d       行政区
     lon/lat 校区近似坐标（片区级精度，±0.8km）
     cls     2025年秋季初一招生班数（null = 官方未公开到班）
     enroll  2025年高一招生计划人数（null = 未取得公开数据）
     edge    true = 落在 10km 边缘带（9.5km 以外）
     src     数据来源等级 A/B/C
   =========================================================== */

const ORIGIN = { lon: 113.9103806, lat: 22.5352389, name: "大新站（地铁1号线）" };

const SCHOOLS = [
  /* ---------- 南山区 · 公办初中 / 九年一贯制（官方学区图名录）---------- */
  { name:"深圳市南山区教育科学研究院附属学校教育集团南头城学校", short:"南头城学校", phone:"0755-26610216", tier:"D", seg:"初中", type:"公办", group:"南山区教科院附属学校教育集团", street:"南头街道", d:"南山区", lon:113.9120, lat:22.5420, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山实验教育集团麒麟二中", short:"麒麟二中", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"南头街道", d:"南山区", lon:113.9060, lat:22.5320, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山实验教育集团麒麟中学", short:"麒麟中学", phone:"0755-26707525", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"南头街道", d:"南山区", lon:113.9180, lat:22.5395, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山实验教育集团南海中学", short:"南海中学", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"南头街道", d:"南山区", lon:113.9140, lat:22.5280, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山实验教育集团园丁学校（初中部）", short:"园丁学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"南头街道", d:"南山区", lon:113.9080, lat:22.5420, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山实验教育集团明远学校（初中部）", short:"明远学校", phone:"0755-26659690", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"南头街道", d:"南山区", lon:113.9150, lat:22.5400, cls:null, enroll:null, src:"A", note:"2025年9月新开办，校址为原南山中加学校（南光路166号）" },
  { name:"深圳市南山区教育科学研究院附属学校教育集团荔香学校（初中部）", short:"荔香学校", phone:"0755-26560629", tier:"C", seg:"初中", type:"公办", group:"南山区教科院附属学校教育集团", street:"南头街道", d:"南山区", lon:113.9210, lat:22.5370, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区第二外国语学校（集团）同泽学校（初中部）", short:"同泽学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山区第二外国语学校（集团）", street:"南头街道", d:"南山区", lon:113.9220, lat:22.5450, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区第二外国语学校（集团）前海学校（初中部）", short:"前海学校", phone:"0755-26472772", tier:"C", seg:"初中", type:"公办", group:"深圳市南山区第二外国语学校（集团）", street:"南头街道·前海", d:"南山区", lon:113.9020, lat:22.5280, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区教育科学研究院附属学校教育集团同乐实验学校（初中部）", short:"同乐实验学校", phone:"0755-86021622", tier:"D", seg:"初中", type:"公办", group:"南山区教科院附属学校教育集团", street:"南头街道·同乐", d:"南山区", lon:113.9280, lat:22.5480, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区第二外国语学校（集团）学府中学", short:"学府中学", phone:"0755-26484300", tier:"C", seg:"初中", type:"公办", group:"深圳市南山区第二外国语学校（集团）", street:"粤海街道·后海", d:"南山区", lon:113.9250, lat:22.5170, cls:null, enroll:null, src:"A", note:"海德一道113号；与明远学校初中部、荔香学校初中部组成大学区" },
  { name:"深圳市南山区第二外国语学校（集团）海德学校（初中部）", short:"海德学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山区第二外国语学校（集团）", street:"粤海街道·后海", d:"南山区", lon:113.9330, lat:22.5080, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区北京师范大学南山附属学校（初中部）", short:"北师大南山附校", phone:"0755-26061871", tier:"S", seg:"完中", type:"公办", group:"北京师范大学·南山区", street:"粤海街道·后海", d:"南山区", lon:113.9280, lat:22.5150, cls:null, enroll:420, lvl:"省一级", src:"A", note:"东滨路3002号；初高中同址，2025年高一招9个班（1超强班+6理科班+2文科班）" },
  { name:"深圳市南山外国语学校（集团）文华学校（初中部）", short:"文华学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"粤海街道·科技园南", d:"南山区", lon:113.9330, lat:22.5330, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）高新中学", short:"高新中学", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"粤海街道·高新南", d:"南山区", lon:113.9420, lat:22.5390, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）滨海学校", short:"滨海学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"粤海街道·后海", d:"南山区", lon:113.9350, lat:22.5150, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）大冲学校（初中部）", short:"大冲学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"粤海街道·大冲", d:"南山区", lon:113.9550, lat:22.5400, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）科华学校（初中部）", short:"科华学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"粤海街道·科技园", d:"南山区", lon:113.9450, lat:22.5420, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区深圳湾学校（初中部）", short:"深圳湾学校", tier:"C", seg:"初中", type:"公办", group:"南山区教育局", street:"粤海街道·深圳湾", d:"南山区", lon:113.9450, lat:22.5050, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区深中南山创新学校（初中部）", short:"深中南山创新", tier:"C", seg:"初中", type:"公办", group:"深圳中学·南山区", street:"粤海街道·后海", d:"南山区", lon:113.9420, lat:22.5120, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区深圳大学附属外国语中学", short:"深大附属外国语", tier:"C", seg:"初中", type:"公办", group:"深圳大学附属教育集团", street:"粤海街道", d:"南山区", lon:113.9350, lat:22.5250, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区哈尔滨工业大学（深圳）实验学校（初中部）", short:"哈工大（深圳）实验", tier:"C", seg:"初中", type:"公办", group:"哈工大（深圳）·南山区", street:"桃源街道·大学城", d:"南山区", lon:113.9700, lat:22.5900, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区中国科学院深圳先进技术研究院实验学校（初中部）", short:"中科院先进院实验", tier:"C", seg:"初中", type:"公办", group:"中科院深圳先进院·南山区", street:"西丽街道·大学城", d:"南山区", lon:113.9680, lat:22.5880, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区南方科技大学教育集团（南山）附属实验学校（初中部）", short:"南科大附属实验", tier:"C", seg:"初中", type:"公办", group:"南方科技大学教育集团（南山）", street:"桃源街道·大学城", d:"南山区", lon:113.9720, lat:22.5920, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区深圳大学城丽湖实验学校（初中部）", short:"丽湖实验学校", phone:"0755-86579714", tier:"D", seg:"初中", type:"公办", group:"南山区教育局", street:"西丽街道·大学城", d:"南山区", lon:113.9600, lat:22.5860, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山实验教育集团西丽湖学校（初中部）", short:"西丽湖学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"西丽街道·西丽湖", d:"南山区", lon:113.9600, lat:22.5900, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区教育科学研究院附属学校教育集团松坪学校（初中部）", short:"松坪学校", phone:"0755-26630076", tier:"D", seg:"初中", type:"公办", group:"南山区教科院附属学校教育集团", street:"西丽街道·松坪山", d:"南山区", lon:113.9420, lat:22.5560, cls:null, enroll:null, src:"A", note:"松坪山路13号" },
  { name:"深圳市南山区文理实验学校（集团）科创学校（初中部）", short:"科创学校", tier:"D", seg:"初中", type:"公办", group:"深圳市南山区文理实验学校（集团）", street:"西丽街道", d:"南山区", lon:113.9480, lat:22.5470, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区文理实验学校（集团）文理学校（初中部）", short:"文理学校", tier:"D", seg:"初中", type:"公办", group:"深圳市南山区文理实验学校（集团）", street:"西丽街道", d:"南山区", lon:113.9400, lat:22.5650, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）桃源中学", short:"桃源中学", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"桃源街道", d:"南山区", lon:113.9800, lat:22.5700, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区第二外国语学校（集团）平山学校（初中部）", short:"平山学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山区第二外国语学校（集团）", street:"桃源街道·平山", d:"南山区", lon:113.9450, lat:22.5950, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区蛇口育才教育集团龙珠学校（初中部）", short:"龙珠学校", phone:"0755-26791193", tier:"C", seg:"初中", type:"公办", group:"深圳市蛇口育才教育集团", street:"桃源街道·龙珠", d:"南山区", lon:113.9760, lat:22.5560, cls:null, enroll:null, src:"A" },
  { name:"深圳市蛇口育才教育集团育才二中", short:"育才二中", tier:"C", seg:"初中", type:"公办", group:"深圳市蛇口育才教育集团", street:"招商街道·蛇口", d:"南山区", lon:113.9205, lat:22.4875, cls:null, enroll:null, src:"A" },
  { name:"深圳市蛇口育才教育集团育才三中", short:"育才三中", tier:"C", seg:"初中", type:"公办", group:"深圳市蛇口育才教育集团", street:"招商街道·蛇口", d:"南山区", lon:113.9250, lat:22.4955, cls:null, enroll:null, src:"A" },
  { name:"深圳市蛇口育才教育集团育才实验学校（初中部）", short:"育才实验学校", phone:"0755-26922507", tier:"C", seg:"初中", type:"公办", group:"深圳市蛇口育才教育集团", street:"沙河街道·建安路", d:"南山区", lon:113.9750, lat:22.5300, cls:null, enroll:null, src:"A" },
  { name:"深圳市蛇口育才教育集团太子湾学校（初中部）", short:"太子湾学校", tier:"C", seg:"初中", type:"公办", group:"深圳市蛇口育才教育集团", street:"招商街道·太子湾", d:"南山区", lon:113.9130, lat:22.4800, cls:null, enroll:null, src:"A" },
  { name:"深圳市蛇口育才教育集团山海学校（初中部）", short:"山海学校", phone:"0755-26664384", tier:"C", seg:"初中", type:"公办", group:"深圳市蛇口育才教育集团", street:"招商街道·太子湾", d:"南山区", lon:113.9080, lat:22.4830, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山区蛇口学校（初中部）", short:"蛇口学校", phone:"0755-26695265", tier:"D", seg:"初中", type:"公办", group:"南山区教育局", street:"招商街道·蛇口", d:"南山区", lon:113.9150, lat:22.4930, cls:null, enroll:null, src:"A", note:"花果路2号" },
  { name:"深圳市南山区第二外国语学校（集团）赤湾学校（初中部）", short:"赤湾学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山区第二外国语学校（集团）", street:"招商街道·赤湾", d:"南山区", lon:113.9050, lat:22.4750, cls:null, enroll:null, src:"A" },
  { name:"南二外前海创新教育集团桂湾学校（初中部）", short:"桂湾学校", tier:"C", seg:"初中", type:"公办", group:"南二外前海创新教育集团", street:"前海·桂湾", d:"南山区", lon:113.8880, lat:22.5200, cls:null, enroll:null, src:"A" },
  { name:"南二外前海创新教育集团前湾学校（初中部）", short:"前湾学校", tier:"C", seg:"初中", type:"公办", group:"南二外前海创新教育集团", street:"前海·前湾", d:"南山区", lon:113.8820, lat:22.5150, cls:null, enroll:null, src:"A", note:"2025年新开办，前湾四路与梦海大道交会处" },
  { name:"南二外前海创新教育集团妈湾学校（初中部）", short:"妈湾学校", tier:"C", seg:"初中", type:"公办", group:"南二外前海创新教育集团", street:"前海·妈湾", d:"南山区", lon:113.8900, lat:22.5050, cls:null, enroll:null, src:"A", note:"2025年新开办，港城路57号" },
  { name:"深圳市南山实验教育集团前海港湾学校（初中部）", short:"前海港湾学校", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"前海·妈湾", d:"南山区", lon:113.8950, lat:22.5100, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）华侨城中学", short:"华侨城中学", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"沙河街道·华侨城", d:"南山区", lon:113.9830, lat:22.5380, cls:null, enroll:null, src:"A" },
  { name:"深圳市南山外国语学校（集团）第二实验学校（初中部）", short:"南外第二实验", phone:"0755-26003138", tier:"C", seg:"初中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"沙河街道·华侨城", d:"南山区", lon:113.9720, lat:22.5480, cls:null, enroll:null, src:"A", note:"香山西街6号" },
  { name:"深圳市南山实验教育集团白石洲学校（初中部）", short:"白石洲学校", phone:"0755-66691808", tier:"C", seg:"初中", type:"公办", group:"深圳市南山实验教育集团", street:"沙河街道·白石洲", d:"南山区", lon:113.9700, lat:22.5380, cls:null, enroll:null, src:"A", note:"石洲中路33号" },

  /* ---------- 南山区 · 民办 ---------- */
  { name:"深圳市南山中英文学校", short:"南山中英文", phone:"0755-26939877", tier:"B", seg:"初中", type:"民办", group:"民办", street:"招商街道·赤湾", d:"南山区", lon:113.9050, lat:22.4780, cls:null, enroll:null, src:"B", note:"赤湾五路55号，九年一贯制" },
  { name:"深圳市南山区荟同学校", short:"荟同学校", phone:"0755-87857626", tier:"B", seg:"初中", type:"民办", group:"民办", street:"前海·妈湾", d:"南山区", lon:113.8800, lat:22.5050, cls:null, enroll:null, src:"B", note:"海城街8号，九年一贯制" },
  { name:"深圳市南山区丽林维育学校", short:"丽林维育", phone:"0755-61100001", tier:"B", seg:"初中", type:"民办", group:"民办", street:"粤海街道·南油", d:"南山区", lon:113.9350, lat:22.5050, cls:null, enroll:null, src:"B", note:"东滨路龙船塘街8号" },
  { name:"深圳市南山区道新学校", short:"道新学校", phone:"0755-29980199", tier:"B", seg:"初中", type:"民办", group:"民办", street:"桃源街道·长岭陂", d:"南山区", lon:113.9900, lat:22.5900, cls:null, enroll:null, src:"B", edge:true, note:"留仙大道3001号，全校36个班（小初），25人/班小班制；位于10km边缘带" },
  { name:"深圳市南山区百旺学校", short:"百旺学校", phone:"0755-26625187", tier:"D", seg:"初中", type:"民办", group:"民办", street:"西丽街道·白芒", d:"南山区", lon:113.9350, lat:22.6100, cls:2, enroll:null, src:"B", note:"2025年秋初一招2个班（官方招生说明）" },
  { name:"深圳市南山区福华学校", short:"福华学校", phone:"0755-26622529", tier:"D", seg:"初中", type:"民办", group:"民办", street:"西丽街道", d:"南山区", lon:113.9450, lat:22.5800, cls:null, enroll:null, src:"B", note:"西丽沿河路10号" },

  /* ---------- 南山区 · 公办高中 / 完中（2025招生计划表）---------- */
  { name:"深圳市南头中学", short:"南头中学", tier:"S", seg:"高中", type:"公办", group:"南山区教育局", street:"南头街道", d:"南山区", lon:113.9180, lat:22.5450, cls:null, enroll:924, lvl:"省一级", src:"A", note:"省一级；2025年计划924人（住宿880/走读44），D类217人" },
  { name:"深圳市蛇口育才教育集团育才中学", short:"育才中学", tier:"S", seg:"高中", type:"公办", group:"深圳市蛇口育才教育集团", street:"桃源街道·峰景", d:"南山区", lon:113.9850, lat:22.5750, cls:null, enroll:735, lvl:"省一级", src:"A", note:"省一级；2025年计划735人（住宿700/走读35）" },
  { name:"育才中学蛇口校区", short:"育才蛇口校区", tier:"S", seg:"高中", type:"公办", group:"深圳市蛇口育才教育集团", street:"招商街道·花果山", d:"南山区", lon:113.9150, lat:22.4900, cls:null, enroll:840, src:"A", note:"2025年计划840人（住宿800/走读40）" },
  { name:"深圳市南山外国语学校（集团）华侨城高级中学", short:"华侨城高级中学", phone:"0755-26008921", tier:"S", seg:"高中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"沙河街道·白石", d:"南山区", lon:113.9780, lat:22.5400, cls:null, enroll:840, lvl:"省一级", src:"A", note:"省一级；2025年高一17个班（科技班4/数理实验1/科创实验1/实验4/超越6/艺术1）" },
  { name:"深圳市南山外国语学校（集团）高级中学", short:"南外高级中学", tier:"S", seg:"高中", type:"公办", group:"深圳市南山外国语学校（集团）", street:"粤海街道·科技园北", d:"南山区", lon:113.9500, lat:22.5480, cls:null, enroll:630, lvl:"省一级", src:"A", note:"省一级；2025年计划630人（住宿600/走读30）" },
  { name:"深圳大学附属中学（深大附中）", short:"深大附中", tier:"S", seg:"完中", type:"公办", group:"深圳大学附属教育集团", street:"南头街道·前海路", d:"南山区", lon:113.8980, lat:22.5240, cls:null, enroll:660, lvl:"省一级", src:"A", note:"省一级；2025年高中计划660人（住宿630/走读30）" },
  { name:"深圳市第二高级中学", short:"深圳二高", tier:"S", seg:"高中", type:"公办", group:"深圳市教育局", street:"西丽街道·茶光", d:"南山区", lon:113.9470, lat:22.5580, cls:null, enroll:1100, lvl:"省一级", src:"A", note:"省一级；2025年计划1100人（住宿1050/走读50），全市规模最大公办高中之一" },
  { name:"南方科技大学附属中学", short:"南科大附中", tier:"A", seg:"高中", type:"公办", group:"南方科技大学", street:"桃源街道·大学城", d:"南山区", lon:113.9780, lat:22.5930, cls:null, enroll:null, src:"A", note:"2025年招生计划未取得官方公开数据，需查南科大附中官网" },
  { name:"深圳（南山）中加学校", short:"南山中加", tier:"B", seg:"高中", type:"民办", group:"民办·中外合作", street:"南头街道", d:"南山区", lon:113.9200, lat:22.5450, cls:null, enroll:220, lvl:"省一级（中外合作）", src:"A", note:"省一级（中外合作）；2025年计划220人（市内160+市外60），全住宿" },

  /* ---------- 宝安区 · 新安 / 西乡 / 宝安中心 ---------- */
  { name:"深圳市宝安中学（集团）初中部", short:"宝中初中部", tier:"C", seg:"初中", type:"公办", group:"宝安中学集团", street:"新安街道", d:"宝安区", lon:113.9100, lat:22.5700, cls:null, enroll:null, src:"A" },
  { name:"深圳市宝安中学（集团）外国语学校", short:"宝中外国语", tier:"C", seg:"初中", type:"公办", group:"宝安中学集团", street:"新安街道", d:"宝安区", lon:113.9000, lat:22.5650, cls:null, enroll:null, src:"A" },
  { name:"深圳市新安中学（集团）初中部", short:"新中初中部", tier:"C", seg:"初中", type:"公办", group:"新安中学集团", street:"新安街道", d:"宝安区", lon:113.9080, lat:22.5620, cls:null, enroll:null, src:"A", note:"新安二路" },
  { name:"深圳市新安中学（集团）第一实验学校", short:"新中一实", tier:"D", seg:"初中", type:"公办", group:"新安中学集团", street:"新安街道·宝安中心", d:"宝安区", lon:113.8950, lat:22.5580, cls:null, enroll:null, src:"A" },
  { name:"深圳市宝安区实验学校", short:"宝安实验学校", phone:"0755-29637686", tier:"C", seg:"初中", type:"公办", group:"宝安实验学校集团", street:"新安街道·宝安中心", d:"宝安区", lon:113.8850, lat:22.5560, cls:null, enroll:null, src:"A", note:"湖滨西路180号" },
  { name:"深圳市海滨中学", short:"海滨中学", phone:"0755-27837561", tier:"D", seg:"初中", type:"公办", group:"宝安区教育局", street:"新安街道·41区", d:"宝安区", lon:113.8850, lat:22.5650, cls:null, enroll:null, src:"A", note:"兴华一路106号" },
  { name:"深圳市宝安区文汇学校", short:"文汇学校", phone:"0755-27852185", tier:"D", seg:"初中", type:"公办", group:"宝安区教育局", street:"新安街道·34区", d:"宝安区", lon:113.8950, lat:22.5680, cls:null, enroll:null, src:"A", note:"前进一路297号，九年一贯制" },
  { name:"深圳市宝安区海旺学校", short:"海旺学校", tier:"D", seg:"初中", type:"公办", group:"宝安区教育局", street:"新安街道·宝安中心", d:"宝安区", lon:113.8820, lat:22.5520, cls:null, enroll:null, src:"B" },
  { name:"深圳市宝安区清平实验学校", short:"清平实验", tier:"D", seg:"初中", type:"公办", group:"宝安区教育局", street:"西乡街道", d:"宝安区", lon:113.8700, lat:22.5750, cls:null, enroll:null, src:"B" },
  { name:"深圳市海湾中学", short:"海湾中学", phone:"0755-27905167", tier:"D", seg:"初中", type:"公办", group:"宝安区教育局", street:"西乡街道", d:"宝安区", lon:113.8600, lat:22.5780, cls:null, enroll:null, src:"A", note:"金海路16号" },
  { name:"深圳市宝安区航城学校", short:"航城学校", tier:"D", seg:"初中", type:"公办", group:"宝安区教育局", street:"航城街道", d:"宝安区", lon:113.8300, lat:22.5900, cls:null, enroll:null, src:"B", note:"位于10km边缘带" },
  { name:"深圳市西乡中学", short:"西乡中学", tier:"A", seg:"完中", type:"公办", group:"宝安区教育局", street:"西乡街道", d:"宝安区", lon:113.8550, lat:22.5700, cls:null, enroll:1050, lvl:"省一级", src:"A", note:"省一级；2025年高中计划1050人（住宿1000/走读50）" },
  { name:"深圳市宝安第一外国语学校", short:"宝一外", tier:"S", seg:"完中", type:"公办", group:"宝安第一外国语学校集团", street:"新安街道·宝安中心", d:"宝安区", lon:113.8800, lat:22.5600, cls:null, enroll:800, lvl:"省一级", src:"A", note:"省一级；2025年高中计划800人（住宿750/走读50）" },
  { name:"深圳市宝安中学（集团）高中部", short:"宝中高中部", tier:"S", seg:"高中", type:"公办", group:"宝安中学集团", street:"新安街道", d:"宝安区", lon:113.9120, lat:22.5720, cls:null, enroll:1050, lvl:"省一级", src:"A", note:"省一级；2025年计划1050人（住宿1000/走读50）" },
  { name:"深圳市新安中学（集团）高中部", short:"新中高中部", tier:"A", seg:"高中", type:"公办", group:"新安中学集团", street:"新安街道·宝安中心", d:"宝安区", lon:113.8880, lat:22.5580, cls:null, enroll:840, lvl:"省一级", src:"A", note:"省一级；2025年计划840人（住宿760/走读80）" },
  { name:"深圳市石岩外国语学校", short:"石岩外国语", tier:"A", seg:"高中", type:"公办", group:"宝安区教育局", street:"石岩街道", d:"宝安区", lon:113.9050, lat:22.6300, cls:null, enroll:567, lvl:"省一级", src:"A", edge:true, note:"省一级；2025年计划567人；已超出10km（约10.6km）" },
  { name:"深圳市崛起诚信实验学校", short:"崛起诚信", phone:"0755-85249879", tier:"D", seg:"初中", type:"民办", group:"民办", street:"新安街道", d:"宝安区", lon:113.9060, lat:22.5620, cls:null, enroll:null, src:"B", note:"新安二路98号" },
  { name:"深圳市宝安区宝龙学校", short:"宝龙学校", phone:"0755-29631998", tier:"D", seg:"初中", type:"民办", group:"民办", street:"新安街道", d:"宝安区", lon:113.9020, lat:22.5680, cls:null, enroll:null, src:"B" },
  { name:"深圳市宝安区振华学校", short:"振华学校", phone:"0755-28233380", tier:"D", seg:"初中", type:"民办", group:"民办", street:"新安街道·31区", d:"宝安区", lon:113.9000, lat:22.5720, cls:null, enroll:null, src:"B" },
  { name:"深圳市宝安区东山书院", short:"东山书院", phone:"0755-27922769", tier:"D", seg:"初中", type:"民办", group:"民办", street:"新安街道·50区", d:"宝安区", lon:113.8750, lat:22.5650, cls:null, enroll:null, src:"B", note:"海汇路57号" },
  { name:"深圳市桃源居中澳实验学校", short:"中澳实验", tier:"A", seg:"完中", type:"民办", group:"民办", street:"西乡街道·桃源居", d:"宝安区", lon:113.8500, lat:22.6000, cls:null, enroll:1300, lvl:"省一级", src:"A", note:"省一级；2025年高中计划1300人（全市规模最大民办高中之一）" },
  { name:"深圳市宝安区中英公学", short:"中英公学", tier:"B", seg:"完中", type:"民办", group:"民办", street:"西乡街道", d:"宝安区", lon:113.8700, lat:22.5900, cls:null, enroll:80, lvl:"市一级", src:"A", note:"市一级；2025年高中计划80人，全住宿" },
  { name:"深圳市华胜实验学校", short:"华胜实验", tier:"A", seg:"完中", type:"民办", group:"民办", street:"西乡街道", d:"宝安区", lon:113.8650, lat:22.5850, cls:null, enroll:600, lvl:"市一级", src:"A", note:"市一级；2025年高中计划600人" },
  { name:"深圳市富源学校", short:"富源学校", tier:"A", seg:"完中", type:"民办", group:"民办", street:"航城街道·九围", d:"宝安区", lon:113.8400, lat:22.6100, cls:null, enroll:1000, lvl:"省一级", src:"A", edge:true, note:"省一级；2025年高中计划1000人，全住宿；位于10km边缘带" },
  { name:"深圳市华侨（康桥）书院", short:"康桥书院", tier:"A", seg:"完中", type:"民办", group:"民办", street:"西乡街道", d:"宝安区", lon:113.8750, lat:22.5950, cls:null, enroll:600, lvl:"市一级", src:"A", note:"市一级；2025年高中计划600人（提供400床位）" },
  { name:"深圳市崛起实验中学", short:"崛起实验", tier:"A", seg:"高中", type:"民办", group:"民办", street:"新安街道", d:"宝安区", lon:113.8800, lat:22.5700, cls:null, enroll:560, lvl:"市一级", src:"A", note:"市一级；2025年计划560人（提供450床位）" }
];

/* 距离与方位计算（球面大圆距离） */
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371.0088;
  const toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
function bearing(lat1, lon1, lat2, lon2) {
  const toRad = d => d * Math.PI / 180;
  const y = Math.sin(toRad(lon2-lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1))*Math.sin(toRad(lat2)) - Math.sin(toRad(lat1))*Math.cos(toRad(lat2))*Math.cos(toRad(lon2-lon1));
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}
function compass(deg) {
  const dirs = ["正北","东北","正东","东南","正南","西南","正西","西北"];
  return dirs[Math.round(deg / 45) % 8];
}

SCHOOLS.forEach((s, i) => {
  s.id = i + 1;
  s.dist = haversine(ORIGIN.lat, ORIGIN.lon, s.lat, s.lon);
  s.brg = bearing(ORIGIN.lat, ORIGIN.lon, s.lat, s.lon);
  s.dir = compass(s.brg);
});

const DATA = { ORIGIN, SCHOOLS, haversine, bearing, compass };
if (typeof module !== "undefined") module.exports = DATA;
