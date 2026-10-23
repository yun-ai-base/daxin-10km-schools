/* ==========================================================
   渲染逻辑：KPI / 散点图 / 条形图 / 明细表 / 采集模板
   ========================================================== */
(function () {
  "use strict";

  const S = DATA.SCHOOLS;
  const O = DATA.ORIGIN;
  const KMPERLON = 102.8;   // 22.5°N 处 1 经度 ≈ 102.8 km
  const KMPERLAT = 110.9;
  const fmt = n => n.toLocaleString("zh-CN");
  const streetOf = s => s.street.split("·")[0];
  const segClass = { "初中": "j", "高中": "s", "完中": "b" };
  const segColor = { "初中": "#1f7ae0", "高中": "#7b4ff2", "完中": "#0e9c8a" };

  /* ---------------- 补课需求分层定义 ---------------- */
  const TIERS = {
    S: {
      name: "头部高中", short: "头部高中", color: "#c0392b", order: 0,
      who: "分数线一线，八大 / 十大梯队，家长预期极高",
      need: "拔高压轴 + 升学加分项",
      pain: "导数与解析几何压轴、选择填空压轴题、概率统计证明类新题型、90 分钟内做完 19 题的速度",
      sell: "1v1 压轴专题（10–15 次课）· 强基 / 综评选拔 · 竞赛一试基础",
      tags: ["导数压轴", "圆锥曲线", "强基/综评", "选填速度"]
    },
    A: {
      name: "中游高中 / 民办大校", short: "中游高中", color: "#d68910", order: 1,
      who: "本科率导向，招生量大（单校高一 600–1300 人）",
      need: "把 90–110 分段的中档题全部吃下",
      pain: "立体几何建系、数列求和、三角恒等变换、统计大题格式与书写规范",
      sell: "小班模块化提分（每周 1 次）· 月考后错题诊断 · 考前 4 次急救",
      tags: ["中档题保分", "立体几何", "数列", "月考冲刺"]
    },
    B: {
      name: "国际化 / 民办特色", short: "国际化", color: "#8e44ad", order: 2,
      who: "国际课程与双语方向，付费意愿最高",
      need: "英文学术数学 + 升学考试模块",
      pain: "英文术语与题干理解、证明书写规范、公式表与计算器使用、校内 GPA 压力",
      sell: "AP Calculus AB/BC · A-Level P1–P4 · DSE 数学 · IB AA · 校内同步 + 竞赛",
      tags: ["AP Calculus", "A-Level", "DSE/IB", "英文术语"]
    },
    C: {
      name: "名校初中", short: "名校初中", color: "#1f7ae0", order: 3,
      who: "集团校，生源竞争激烈，家长付费意愿强",
      need: "中考冲刺 + 分班考 + 初高衔接",
      pain: "二次函数与几何综合、圆的证明、动点压轴、90 分钟 100 分的答题节奏",
      sell: "中考专题班（几何 / 函数 / 压轴）· 新高一衔接（集合 → 函数 → 三角）· 期中期末冲刺",
      tags: ["二次函数", "几何压轴", "分班考", "初高衔接"]
    },
    D: {
      name: "普通 / 民办初中", short: "基础校", color: "#5d6d7e", order: 4,
      who: "基础相对薄弱，非深户比例高，单科提分空间大",
      need: "保合格、抢基础分、稳住计算",
      pain: "有理数与整式运算、一元一次 / 二次方程、几何入门证明、审题与书写丢分",
      sell: "基础保分班（大班 / 小班）· 作业陪跑 · 期末急救 · 家长会一对一诊断",
      tags: ["计算能力", "基础保分", "方程与不等式", "审题习惯"]
    }
  };
  const tierOf = s => TIERS[s.tier] || TIERS.C;
  const linkOf = s => s.web || ("https://www.baidu.com/s?wd=" + encodeURIComponent(s.short + " " + s.d + " 官网"));

  /* ---------------- Hero 数字 ---------------- */
  const inRange = S.filter(s => s.dist <= 10);
  const enrollSum = S.reduce((a, s) => a + (s.enroll || 0), 0);
  const streets = new Set(S.map(streetOf));
  document.getElementById("h-total").innerHTML = S.length + '<i>所</i>';
  document.getElementById("h-street").innerHTML = streets.size + '<i>个</i>';
  document.getElementById("h-enroll").innerHTML = fmt(enrollSum) + '<i>人</i>';
  document.getElementById("h-near").innerHTML = S.filter(s => s.dist <= 1).length + '<i>所</i>';

  /* ---------------- KPI ---------------- */
  const med = (() => {
    const d = S.map(s => s.dist).sort((a, b) => a - b);
    return d[Math.floor(d.length / 2)];
  })();
  const pub = S.filter(s => s.type === "公办").length;
  const priv = S.length - pub;
  const cJ = S.filter(s => s.seg === "初中").length;
  const cS = S.filter(s => s.seg === "高中").length;
  const cB = S.filter(s => s.seg === "完中").length;
  const edge = S.filter(s => s.dist > 9.5).length;

  const kpis = [
    { v: S.length, u: "所", t: "纳入统计学校", p: "初高中 / 完中，含九年一贯制初中部", c: "#1f7ae0" },
    { v: pub, u: "所", t: "公办学校", p: `占比 ${Math.round(pub / S.length * 100)}%`, c: "#0e9c8a" },
    { v: priv, u: "所", t: "民办学校", p: `占比 ${Math.round(priv / S.length * 100)}%`, c: "#e8873a" },
    { v: cJ, u: "所", t: "纯初中 / 九年一贯制", p: `完中 ${cB} 所 · 纯高中 ${cS} 所`, c: "#7b4ff2" },
    { v: med.toFixed(1), u: "km", t: "距离中位数", p: `9.5km 外边缘带 ${edge} 所`, c: "#2b8a9e" },
    { v: inRange.length, u: "所", t: "严格落在 10km 内", p: `${S.length - inRange.length} 所已在圈外`, c: "#c2554d" }
  ];
  document.getElementById("kpi").innerHTML = kpis.map(k => `
    <div class="k" style="--c:${k.c}">
      <span>${k.t}</span>
      <b class="num">${k.v}<i>${k.u}</i></b>
      <p>${k.p}</p>
    </div>`).join("");

  /* ---------------- 散点图 ---------------- */
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.getElementById("radar");
  const CX = 380, CY = 380, PX = 34; // 34px = 1km

  function el(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  const proj = s => ({
    x: CX + (s.lon - O.lon) * KMPERLON * PX,
    y: CY - (s.lat - O.lat) * KMPERLAT * PX
  });

  // 底纹网格
  const defs = el("defs", {}, svg);
  const rg = el("radialGradient", { id: "glow", cx: "50%", cy: "50%", r: "50%" }, defs);
  el("stop", { offset: "0%", "stop-color": "#dceef8" }, rg);
  el("stop", { offset: "100%", "stop-color": "#ffffff", "stop-opacity": "0" }, rg);
  el("circle", { cx: CX, cy: CY, r: 340, fill: "url(#glow)" }, svg);

  [2, 4, 6, 8, 10].forEach(r => {
    el("circle", {
      cx: CX, cy: CY, r: r * PX, fill: "none",
      stroke: r === 10 ? "#8fb2c9" : "#dbe4ec",
      "stroke-width": r === 10 ? 1.6 : 1,
      "stroke-dasharray": r === 10 ? "0" : "3 5"
    }, svg);
    el("text", {
      x: CX + 6, y: CY - r * PX + 15, fill: r === 10 ? "#5c7f95" : "#a9b8c6",
      "font-size": r === 10 ? 12 : 11, "font-weight": r === 10 ? 600 : 400
    }, svg).textContent = r + "km";
  });
  el("line", { x1: CX - 348, y1: CY, x2: CX + 348, y2: CY, stroke: "#e4ebf2" }, svg);
  el("line", { x1: CX, y1: CY - 348, x2: CX, y2: CY + 348, stroke: "#e4ebf2" }, svg);
  const dirs = [["正北", CX, CY - 352], ["正东", CX + 352, CY + 4], ["正南", CX, CY + 364], ["正西", CX - 352, CY + 4]];
  dirs.forEach(([t, x, y]) => {
    el("text", { x, y, "text-anchor": "middle", fill: "#7d8fa0", "font-size": 12, "font-weight": 600 }, svg).textContent = t;
  });

  // 站点
  el("circle", { cx: CX, cy: CY, r: 9, fill: "#0b3a53" }, svg);
  el("circle", { cx: CX, cy: CY, r: 15, fill: "none", stroke: "#0b3a53", "stroke-opacity": ".28", "stroke-width": 2 }, svg);
  el("text", { x: CX, y: CY + 30, "text-anchor": "middle", fill: "#0b3a53", "font-size": 11.5, "font-weight": 700 }, svg)
    .textContent = "大新站";

  // 学校点
  const tip = document.getElementById("tip");
  S.forEach(s => {
    const p = proj(s);
    const out = s.dist > 10;
    const g = el("g", { style: "cursor:pointer" }, svg);
    const c = segColor[s.seg];
    el("circle", {
      cx: p.x, cy: p.y, r: 6.2,
      fill: s.type === "民办" ? "#fff" : c,
      stroke: out ? "#b9c6d2" : c,
      "stroke-width": out ? 1.2 : 1,
      "stroke-dasharray": out ? "2 2" : "0",
      "fill-opacity": s.type === "民办" ? 1 : .92
    }, g);
    g.addEventListener("mouseenter", e => {
      tip.innerHTML = `<b>${s.short}</b><br><span>${s.seg} · ${s.type} · ≈${s.dist.toFixed(1)}km ${s.dir}</span>`;
      const box = svg.getBoundingClientRect();
      tip.style.left = (p.x / 760 * box.width) + "px";
      tip.style.top = (p.y / 760 * box.height) + "px";
      tip.style.opacity = 1;
    });
    g.addEventListener("mouseleave", () => { tip.style.opacity = 0; });
    g.addEventListener("click", () => focusSchool(s.id));
  });

  /* ---------------- 条形图通用 ---------------- */
  function bars(container, rows, opts) {
    const o = Object.assign({ lw: 150, color: "#1f7ae0", grad: null, unit: "", fmtVal: v => v }, opts);
    const max = Math.max(...rows.map(r => r.v), 1);
    container.innerHTML = rows.map(r => `
      <div class="bar-row" style="--lw:${o.lw}px">
        <div class="lab" title="${r.label}">${r.label}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${(r.v / max * 100).toFixed(1)}%;background:${r.color || o.color}"></div>
        </div>
        <div class="val num">${o.fmtVal(r.v)}<i>${o.unit}</i></div>
      </div>`).join("");
  }

  // 圈层
  const rings = [
    { label: "0 – 2 km", min: 0, max: 2, color: "#0b3a53" },
    { label: "2 – 4 km", min: 2, max: 4, color: "#1f6a8a" },
    { label: "4 – 6 km", min: 4, max: 6, color: "#1f7ae0" },
    { label: "6 – 8 km", min: 6, max: 8, color: "#4a9fe0" },
    { label: "8 – 10 km", min: 8, max: 10, color: "#8fc0e4" },
    { label: "> 10 km（圈外）", min: 10, max: 99, color: "#c2554d" }
  ].map(r => ({ label: r.label, v: S.filter(s => s.dist >= r.min && s.dist < r.max).length, color: r.color }));
  bars(document.getElementById("ring-bars"), rings, { lw: 118, unit: " 所", fmtVal: v => v });

  // 街道
  const stMap = {};
  S.forEach(s => { const k = streetOf(s); stMap[k] = (stMap[k] || 0) + 1; });
  const stRows = Object.entries(stMap).sort((a, b) => b[1] - a[1]).slice(0, 10)
    .map(([k, v]) => ({ label: k, v }));
  bars(document.getElementById("street-bars"), stRows, { lw: 108, color: "#0e9c8a", unit: " 所" });

  // 集团
  const gname = g => {
    if (g === "民办") return "民办·独立办学";
    if (g === "宝安区教育局" || g.indexOf("南山区教育局") === 0) return "区教育局直属";
    return g.replace("深圳市", "").replace("（集团）", "").replace("集团", "");
  };
  const gMap = {};
  S.forEach(s => { const k = gname(s.group); gMap[k] = (gMap[k] || 0) + 1; });
  const gRows = Object.entries(gMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([k, v]) => ({ label: k, v }));
  bars(document.getElementById("group-bars"), gRows, { lw: 118, color: "#7b4ff2", unit: " 所" });

  // 性质 × 学段
  const typeRows = [
    { label: "公办 · 初中", v: S.filter(s => s.type === "公办" && s.seg === "初中").length, color: "#1f7ae0" },
    { label: "公办 · 完中", v: S.filter(s => s.type === "公办" && s.seg === "完中").length, color: "#0e9c8a" },
    { label: "公办 · 高中", v: S.filter(s => s.type === "公办" && s.seg === "高中").length, color: "#7b4ff2" },
    { label: "民办 · 初中", v: S.filter(s => s.type === "民办" && s.seg === "初中").length, color: "#f0b27a" },
    { label: "民办 · 完中", v: S.filter(s => s.type === "民办" && s.seg === "完中").length, color: "#e8873a" },
    { label: "民办 · 高中", v: S.filter(s => s.type === "民办" && s.seg === "高中").length, color: "#c96a1e" }
  ];
  bars(document.getElementById("type-bars"), typeRows, { lw: 96, unit: " 所" });

  // 高中招生规模
  const enrollRows = S.filter(s => s.enroll)
    .sort((a, b) => b.enroll - a.enroll)
    .map(s => ({ label: s.short, v: s.enroll, color: s.d === "南山区" ? "#1f7ae0" : "#e8873a" }));
  bars(document.getElementById("enroll-bars"), enrollRows, { lw: 230, unit: "", fmtVal: v => fmt(v) });

  /* ---------------- 明细表 ---------------- */
  const state = { seg: "all", type: "all", d: "all", tier: "all", q: "", sort: "dist", asc: true, open: null };
  const tbody = document.getElementById("tbody");

  function rows() {
    let r = S.slice();
    if (state.seg !== "all") r = r.filter(s => s.seg === state.seg);
    if (state.type !== "all") r = r.filter(s => s.type === state.type);
    if (state.d !== "all") r = r.filter(s => s.d === state.d);
    if (state.tier !== "all") r = r.filter(s => s.tier === state.tier);
    if (state.q) {
      const q = state.q.toLowerCase();
      r = r.filter(s => (s.name + s.short + s.group + s.street + s.d + s.type + s.seg).toLowerCase().includes(q));
    }
    const dir = state.asc ? 1 : -1;
    r.sort((a, b) => {
      const k = state.sort;
      if (k === "name") return a.short.localeCompare(b.short, "zh") * dir;
      if (k === "enroll") return ((a.enroll || -1) - (b.enroll || -1)) * dir;
      if (k === "dist") return (a.dist - b.dist) * dir;
      return String(a[k]).localeCompare(String(b[k]), "zh") * dir;
    });
    return r;
  }

  function classEst(s) {
    if (s.seg === "高中" && s.enroll) {
      return `高一约 ${Math.round(s.enroll / 50)}–${Math.round(s.enroll / 45)} 个班（${s.enroll} 人 ÷ 45–50 人/班），三个年级合计约 ${Math.round(s.enroll * 3 / 50)}–${Math.round(s.enroll * 3 / 45)} 个班`;
    }
    if (s.seg === "完中" && s.enroll) {
      return `高中部按 ${s.enroll} 人计，高一约 ${Math.round(s.enroll / 50)}–${Math.round(s.enroll / 45)} 个班；初中部班数未公开`;
    }
    if (s.cls) {
      return `2025 年初一招 ${s.cls} 个班，按 3 个年级推算在校约 ${s.cls * 3} 个班`;
    }
    return "官方招生计划未公开到「班」，需查区教育局当年招生计划表或学校招生简章";
  }

  function render() {
    const r = rows();
    document.getElementById("row-count").textContent = r.length;
    if (!r.length) {
      tbody.innerHTML = `<tr><td colspan="7"><div class="empty">没有匹配的学校，换个筛选条件试试</div></td></tr>`;
      return;
    }
    tbody.innerHTML = r.map(s => {
      const open = state.open === s.id;
      const t = tierOf(s);
      const main = `
        <tr data-id="${s.id}" class="${open ? "open" : ""}">
          <td><div class="sname"><span class="dot" style="background:${segColor[s.seg]}"></span>${s.short}
            <a class="ext" href="${linkOf(s)}" target="_blank" rel="noopener" onclick="event.stopPropagation()"
               title="${s.web ? "打开官网" : "搜索该校官网 / 招生信息（多数区属官网域名已下线）"}">↗</a>
            <small>${s.group.replace("深圳市", "").replace("（集团）", "")}</small></div></td>
          <td><span class="pill ${segClass[s.seg]}">${s.seg}</span></td>
          <td><span class="pill tb" style="background:${t.color}1a;color:${t.color}">${s.tier} ${t.short}</span></td>
          <td><span class="pill ${s.type === "公办" ? "pub" : "priv"}">${s.type}</span></td>
          <td><span class="pill ${s.d === "南山区" ? "ns" : "ba"}">${s.d.replace("区", "")}</span></td>
          <td class="muted">${s.street}</td>
          <td class="dist-cell num">≈${s.dist.toFixed(1)}<i>km ${s.dir}</i></td>
          <td class="num ${s.enroll ? "" : "muted"}">${s.enroll ? fmt(s.enroll) : "—"}</td>
        </tr>`;
      const detail = open ? `
        <tr class="detail-row"><td colspan="8"><div class="detail-inner">
          <div><b>全称</b><br>${s.name}</div>
          <div><b>学段 / 性质</b><br>${s.seg} · ${s.type}</div>
          <div><b>集团 / 主管</b><br>${s.group}</div>
          <div><b>片区</b><br>${s.street} · ${s.d}</div>
          <div><b>方位距离</b><br>站点${s.dir}方 约 ${s.dist.toFixed(1)} km（直线）</div>
          <div><b>2025 招生</b><br>${s.enroll ? `高一计划 ${fmt(s.enroll)} 人` : (s.cls ? `初一 ${s.cls} 个班` : "未公开到人数/班数")}</div>
          <div><b>学校等级</b><br>${s.lvl || '<span class="muted">未取得公开等级信息</span>'}</div>
          <div><b>招生 / 校办电话</b><br>${s.phone ? `<a class="tel" href="tel:${s.phone}">${s.phone}</a>` : '<span class="muted">未收录（见官网）</span>'}</div>
          <div><b>官网 / 资料页</b><br>${s.web
            ? `<a class="wx" href="${s.web}" target="_blank" rel="noopener">${s.web.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a>`
            : `<a class="wx" href="${linkOf(s)}" target="_blank" rel="noopener">搜索直达 ↗</a> <span class="muted">（${s.d === "南山区" ? "南山 *.szns.edu.cn 域名已整体下线，无可用官网" : "官网未提供或栏目为空，建议搜索"}）</span>`}</div>
          <div class="full" style="background:${t.color}0d;border-left:3px solid ${t.color};padding:10px 14px;border-radius:8px;margin-top:4px">
            <b style="color:${t.color}">${s.tier} · ${t.name}</b> —— ${t.who}
            <div style="margin-top:6px"><b>数学需求：</b>${t.need}</div>
            <div style="margin-top:4px"><b>常见丢分点：</b>${t.pain}</div>
            <div style="margin-top:4px"><b>可对接产品：</b>${t.sell}</div>
          </div>
          <div class="full" style="margin-top:2px;padding-top:10px;border-top:1px dashed #dbe7f2">
            <b>班额结构推算（估算，非官方）：</b>${classEst(s)}
          </div>
          ${s.note ? `<div class="full"><b>备注：</b>${s.note}</div>` : ""}
          ${s.dist > 10 ? `<div class="full" style="color:#b23b3b"><b>注意：</b>该校直线距离已超过 10km，仅作边缘参考。</div>` : ""}
        </div></td></tr>` : "";
      return main + detail;
    }).join("");

    tbody.querySelectorAll("tr[data-id]").forEach(tr => {
      tr.addEventListener("click", () => {
        const id = +tr.dataset.id;
        state.open = state.open === id ? null : id;
        render();
      });
    });
  }

  document.getElementById("export-schools").addEventListener("click", () => {
    const head = ["学校全称","层级","层级说明","学段","性质","行政区","街道片区","直线距离km","方位",
      "2025高一招生","学校等级","电话","官网","集团","备注"];
    const lines = [head.join(",")];
    rows().forEach(s => {
      const t = tierOf(s);
      const cells = [s.name, s.tier, t.name, s.seg, s.type, s.d, s.street, s.dist.toFixed(1), s.dir,
        s.enroll || "", s.lvl || "", s.phone || "", s.web || "", s.group, s.note || ""];
      lines.push(cells.map(v => {
        const x = String(v);
        return /[",\n]/.test(x) ? '"' + x.replace(/"/g, '""') + '"' : x;
      }).join(","));
    });
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "大新站10km学校清单.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.querySelectorAll(".fgroup").forEach(g => {
    g.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      g.querySelectorAll("button").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
      state[g.dataset.f] = b.dataset.v;
      render();
    });
  });
  document.getElementById("q").addEventListener("input", e => { state.q = e.target.value.trim(); render(); });
  document.querySelectorAll("thead th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const k = th.dataset.sort;
      if (state.sort === k) state.asc = !state.asc;
      else { state.sort = k; state.asc = (k === "dist" || k === "name"); }
      document.querySelectorAll("thead th[data-sort]").forEach(x => {
        x.classList.remove("sorted");
        const a = x.querySelector(".arrow"); if (a) a.textContent = "";
      });
      th.classList.add("sorted");
      th.querySelector(".arrow").textContent = state.asc ? "↑" : "↓";
      render();
    });
  });

  function focusSchool(id) {    state.open = id;
    state.seg = "all"; state.type = "all"; state.d = "all"; state.q = "";
    document.getElementById("q").value = "";
    document.querySelectorAll(".fgroup").forEach(g => {
      g.querySelectorAll("button").forEach((b, i) => b.classList.toggle("on", i === 0));
    });
    render();
    const row = tbody.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      row.style.transition = "background .3s";
      row.style.background = "#e7f3ff";
      setTimeout(() => { row.style.background = ""; }, 1400);
    }
  }

  render();

  /* ---------------- 圈层速览 ---------------- */
  const bandDefs = [
    { t: "0 – 2 km", s: "骑行 8 分钟 / 步行 25 分钟可达", min: 0, max: 2, c: "#0b3a53" },
    { t: "2 – 4 km", s: "地铁 1–2 站", min: 2, max: 4, c: "#1f6a8a" },
    { t: "4 – 6 km", s: "地铁 2–4 站", min: 4, max: 6, c: "#1f7ae0" },
    { t: "6 – 8 km", s: "跨街道通学", min: 6, max: 8, c: "#4a9fe0" },
    { t: "8 – 10 km", s: "西丽 / 大学城 / 蛇口南端", min: 8, max: 10, c: "#7fb6dd" },
    { t: "> 10 km", s: "圈外 · 仅作边缘参考", min: 10, max: 999, c: "#c2554d" }
  ];
  document.getElementById("band-grid").innerHTML = bandDefs.map(b => {
    const list = S.filter(s => s.dist >= b.min && s.dist < b.max).sort((x, y) => x.dist - y.dist);
    const chips = list.map(s => `<button class="chip" data-goto="${s.id}" title="${s.name} · ${s.street} · ${s.type}">
        <i style="background:${segColor[s.seg]}"></i>${s.short}<em>${s.dist.toFixed(1)}</em></button>`).join("");
    return `<div class="band">
      <div class="band-h"><b style="color:${b.c}">${b.t}</b><span class="num">${list.length} 所</span></div>
      <div class="band-sub">${b.s}</div>
      <div class="chips">${chips || '<span class="muted" style="font-size:12px">该圈层无学校</span>'}</div>
    </div>`;
  }).join("");
  document.querySelectorAll("[data-goto]").forEach(b => {
    b.addEventListener("click", () => focusSchool(+b.dataset.goto));
  });

  /* ---------------- 数学补课市场分层 ---------------- */
  const EXAMS = [
    { k: "深圳中考 · 数学", v: "100", u: "分", p: "90 分钟闭卷 · 深圳自主命题<br><b>每分钟要拿 1.11 分</b>，速度就是分数" },
    { k: "深圳中考 · 总分", v: "630", u: "分", p: "2026 年起新方案（物化实验操作单独计 20 分）<br>数学占 <b>15.9%</b>，与语文、英语同为三大主科" },
    { k: "广东高考 · 数学", v: "150", u: "分", p: "120 分钟 · 新高考 I 卷 · 19 题制<br><b>每分钟要拿 1.25 分</b>，比中考更吃思维速度" },
    { k: "高考卷结构", v: "8+3+3+5", u: "", p: "单选 40 + 多选 18 + 填空 15 + <b>解答 77</b><br>解答题占 51%，压轴固定在导数与圆锥曲线" }
  ];
  document.getElementById("exam-cards").innerHTML = EXAMS.map(e => `
    <div class="exam">
      <div class="k">${e.k}</div>
      <div class="v num">${e.v}<i>${e.u}</i></div>
      <p>${e.p}</p>
    </div>`).join("");

  const tierOrder = ["S", "A", "B", "C", "D"];
  document.getElementById("tier-grid").innerHTML = tierOrder.map(key => {
    const t = TIERS[key];
    const list = S.filter(s => s.tier === key).sort((a, b) => a.dist - b.dist);
    const chips = list.slice(0, 12).map(s =>
      `<button class="chip" data-goto="${s.id}" title="${s.name} · ${s.street}">
         <i style="background:${t.color}"></i>${s.short}</button>`).join("");
    const more = list.length > 12 ? `<span class="chip-more">共 ${list.length} 所</span>` : "";
    return `<div class="tier" style="--tc:${t.color}">
      <div class="tier-left">
        <div class="tier-badge">${key}</div>
        <div class="tier-lv">${key === "S" ? "第一梯队" : key === "A" ? "第二梯队" : key === "B" ? "国际赛道" : key === "C" ? "名校初中" : "基础补差"}</div>
        <div class="tier-count num">${list.length}<i>所</i></div>
      </div>
      <div class="tier-body">
        <h4>${t.name}</h4>
        <p class="tier-who">${t.who}</p>
        <div class="tier-fields">
          <div><b>数学需求</b><span>${t.need}</span></div>
          <div><b>常见丢分点</b><span>${t.pain}</span></div>
          <div><b>可对接产品</b><span>${t.sell}</span></div>
        </div>
        <div class="chips">${chips}${more}</div>
        <button class="btn sm" data-tier="${key}">在总表中只看这 ${list.length} 所 →</button>
      </div>
    </div>`;
  }).join("");

  document.querySelectorAll("[data-tier]").forEach(b => {
    b.addEventListener("click", () => {
      state.tier = b.dataset.tier;
      document.querySelectorAll('[data-f="tier"] button').forEach(x =>
        x.classList.toggle("on", x.dataset.v === b.dataset.tier));
      render();
      document.getElementById("tbl").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
  document.querySelectorAll("#tier-grid [data-goto]").forEach(b => {
    b.addEventListener("click", () => focusSchool(+b.dataset.goto));
  });

  // 学生池
  const enrollTotal = S.reduce((a, s) => a + (s.enroll || 0), 0);
  const pool = [
    { v: fmt(enrollTotal * 3), u: "人", t: "圈内高中在读规模（估算）", p: "按年招生 14,816 人 × 3 个年级推算" },
    { v: fmt(enrollTotal), u: "人", t: "每年新增高中生源", p: "2025 年高一招生计划合计，每年换一届" },
    { v: "66", u: "所", t: "初中 / 九年一贯制学校", p: "逐校在校生规模未公开，池子远大于高中" },
    { v: "17", u: "所", t: "民办学校（付费敏感度低）", p: "西乡 4 · 新安 4 · 西丽 3，另有国际课程校 6 所" }
  ];
  document.getElementById("pool-row").innerHTML = pool.map(p => `
    <div class="pool">
      <div class="pool-v num">${p.v}<i>${p.u}</i></div>
      <div class="pool-t">${p.t}</div>
      <div class="pool-p">${p.p}</div>
    </div>`).join("");

  // 触达日历
  const CAL = [
    { m: "9 月", t: "开学衔接", d: "新初一 / 新高一衔接班，全年最强需求窗口", c: "#c0392b" },
    { m: "10–11 月", t: "首次月考", d: "家长焦虑第一次峰值，适合开诊断课", c: "#d68910" },
    { m: "1 月", t: "期末考", d: "期末急救班，短周期高转化", c: "#1f7ae0" },
    { m: "2 月", t: "寒假集训", d: "专题突破（几何 / 函数），可做集中班", c: "#0e9c8a" },
    { m: "3–4 月", t: "一模 · 二模", d: "中考冲刺决策期，家长最愿意付费", c: "#7b4ff2" },
    { m: "6 月下旬", t: "深圳中考", d: "2026 年 6/26–28 开考，数学在 6/27 上午 9:00–10:30", c: "#c0392b" }
  ];
  document.getElementById("calendar").innerHTML = CAL.map(c => `
    <div class="cal" style="--cc:${c.c}">
      <div class="cal-m">${c.m}</div>
      <div class="cal-t">${c.t}</div>
      <div class="cal-d">${c.d}</div>
    </div>`).join("");

  /* ---------------- 师资公开信息索引 ---------------- */
  const SITES = (typeof SITE_STATUS !== "undefined") ? SITE_STATUS : [];
  const sBox = document.getElementById("site-status");
  if (sBox) {
    sBox.innerHTML = SITES.map(r => `
      <div class="site-row">
        <span class="site-dot" style="background:${r.ok ? "#1f9d55" : "#c0392b"}"></span>
        <div><b>${r.zone}</b> · <code>${r.domain}</code> ${r.ok ? "在线" : "已下线"} —— ${r.detail}</div>
      </div>`).join("");
  }

  const TS = (typeof TEACHERS !== "undefined") ? TEACHERS : [];
  const tCount = document.getElementById("t-count");
  if (tCount) tCount.textContent = TS.length;
  const tGrid = document.getElementById("fac-grid");
  if (tGrid) {
    const rank = t => t.subj === "数学" ? 0 : (t.subj === "待核" ? 1 : 2);
    const sorted = TS.slice().sort((a, b) => rank(a) - rank(b) || b.y - a.y);
    tGrid.innerHTML = sorted.map(t => {
      const isMath = t.subj === "数学";
      const tagCls = isMath ? "math" : (t.subj === "待核" ? "pending" : "");
      return `<div class="fac ${isMath ? "math" : ""}">
        <div class="fac-h">
          <span class="fac-name">${t.n}</span>
          <span class="fac-tag ${tagCls}">${t.subj}</span>
          <span class="fac-tag">${t.role}</span>
        </div>
        <div class="fac-unit">${t.unit}</div>
        <div class="fac-title">${t.title}</div>
        ${t.note ? `<div class="fac-title" style="color:#8593a3;margin-top:5px">· ${t.note}</div>` : ""}
        <div class="fac-foot">
          <span>${t.src} · ${t.y}</span>
          <a href="${t.url}" target="_blank" rel="noopener">查看来源 ↗</a>
        </div>
      </div>`;
    }).join("");
  }

  /* ---------------- 采集模板 ---------------- */
  const tmpl = document.getElementById("tmpl-body");
  const grades = ["", "一年级", "二年级", "三年级", "四年级", "五年级", "六年级", "初一", "初二", "初三", "高一", "高二", "高三"];
  const sources = ["", "班级群", "家长会", "学校官网", "开放日", "招生办"];

  function addRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input list="sch-list" placeholder="输入校名…"></td>
      <td><select>${grades.map(g => `<option>${g}</option>`).join("")}</select></td>
      <td><input placeholder="如 3班"></td>
      <td><input placeholder="姓名"></td>
      <td><input placeholder="姓名"></td>
      <td><input placeholder="如 48"></td>
      <td><input placeholder="2026-09" ></td>
      <td><select>${sources.map(s => `<option>${s}</option>`).join("")}</select></td>`;
    tmpl.appendChild(tr);
  }
  for (let i = 0; i < 6; i++) addRow();
  document.getElementById("add-row").addEventListener("click", addRow);

  const dl = document.createElement("datalist");
  dl.id = "sch-list";
  dl.innerHTML = S.map(s => `<option value="${s.short}">`).join("");
  document.body.appendChild(dl);

  document.getElementById("export-csv").addEventListener("click", () => {
    const head = ["学校", "年级", "班级", "班主任", "数学老师", "班额", "信息日期", "来源"];
    const lines = [head.join(",")];
    tmpl.querySelectorAll("tr").forEach(tr => {
      const cells = [...tr.querySelectorAll("input,select")].map(c => {
        const v = (c.value || "").trim();
        return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
      });
      if (cells.some(v => v)) lines.push(cells.join(","));
    });
    if (lines.length === 1) { alert("模板还是空的，先填几行再导出。"); return; }
    const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "班级-班主任-数学老师_采集表.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });
})();
