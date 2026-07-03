(function () {
  "use strict";

  function initMeenTest() {
    const root = document.getElementById("meen-test-root");
    if (!root) return;
    if (root.dataset.meenInitialized === "true") return;
    root.dataset.meenInitialized = "true";

    root.innerHTML = `
      <div class="meen-test">
        <section class="meen-test-hero">
          <h1>弥恩诸世政治立场测试</h1>
          <p>
            本测试用于判断答题者在弥恩世界中的政治倾向。题目不对应任何特定地点、政权、组织、人物或历史事件，
            而是围绕制度、权力、经济、知识、灾厄、信仰、安全、地方关系与文明未来等问题展开。
          </p>

          <div class="meen-scale-box">
            <b>答题说明：</b>
            <span>1 = 非常不同意</span>
            <span>2 = 比较不同意</span>
            <span>3 = 中立 / 说不清 / 视情况而定</span>
            <span>4 = 比较同意</span>
            <span>5 = 非常同意</span>
          </div>
        </section>

        <div class="meen-progress">
          <div id="meenProgressBar"></div>
        </div>
        <div id="meenProgressText" class="meen-progress-text">已完成 0 / 80</div>

        <form id="meenQuestionForm" class="meen-question-list"></form>

        <div class="meen-submit-area">
          <button type="button" id="meenSubmitBtn">查看测试结果</button>
        </div>

        <section id="meenResult" class="meen-result" style="display:none;"></section>
      </div>
    `;

    runMeenTest();
  }

  function runMeenTest() {
    const DIMENSIONS = {
      A: {
        name: "历史与合法性",
        high: "变革 / 现实合法性",
        low: "法统 / 天命合法性"
      },
      B: {
        name: "国家形态",
        high: "公民宪政",
        low: "世袭 / 监护政体"
      },
      C: {
        name: "权力分配",
        high: "分权参与",
        low: "集权监护"
      },
      D: {
        name: "经济秩序",
        high: "市场财产",
        low: "公共保障 / 再分配"
      },
      E: {
        name: "奥秘与知识治理",
        high: "开放研究",
        low: "封存垄断"
      },
      F: {
        name: "灾厄与边疆",
        high: "开发拓进",
        low: "管制适应"
      },
      G: {
        name: "信仰与传统",
        high: "世俗多元",
        low: "传统神圣"
      },
      H: {
        name: "安全与战争",
        high: "军事优先",
        low: "文人克制"
      },
      I: {
        name: "地方与区域关系",
        high: "自治多样",
        low: "统一整合"
      },
      J: {
        name: "文明未来",
        high: "现代改造",
        low: "存续平衡"
      }
    };

    const QUESTIONS = [
      { id: 1, dim: "A", reverse: false, text: "社会制度的变化主要来自生产、利益和群体关系的变化。" },
      { id: 2, dim: "A", reverse: false, text: "正当统治首先应证明自己能解决现实问题，而不是证明自己继承了古老权利。" },
      { id: 3, dim: "A", reverse: true, text: "一个社会的痛苦主要源于少数坏人，而不是结构性的制度安排。" },
      { id: 4, dim: "A", reverse: true, text: "维持法统延续往往比重新分配权力更重要。" },
      { id: 5, dim: "A", reverse: false, text: "若旧制度持续制造贫困与压迫，根本改制就是正当的。" },
      { id: 6, dim: "A", reverse: true, text: "只要传统名义仍在，再糟的制度也比断裂更可取。" },
      { id: 7, dim: "A", reverse: false, text: "大多数政治冲突最终都与资源、阶层和生产方式有关。" },
      { id: 8, dim: "A", reverse: true, text: "历史主要由天命、英雄或圣者推动，普通人只能跟随。" },

      { id: 9, dim: "B", reverse: false, text: "国家权力应来自成文规则与公共授权。" },
      { id: 10, dim: "B", reverse: true, text: "社会需要一个高于党派和任期的最终监护者。" },
      { id: 11, dim: "B", reverse: false, text: "世袭或神授的统治形式不应天然享有更高正当性。" },
      { id: 12, dim: "B", reverse: true, text: "即使制度运转良好，最高权位最好仍由血统或神圣资格承担。" },
      { id: 13, dim: "B", reverse: false, text: "最高公权的更替应当可经制度程序完成。" },
      { id: 14, dim: "B", reverse: true, text: "只要秩序稳定，政体是否可被公众追责并不重要。" },
      { id: 15, dim: "B", reverse: false, text: "国家应被视为公民共同体的政治工具，而不是某家族或圣职集团的产业。" },
      { id: 16, dim: "B", reverse: true, text: "有些人天生比大众更应长期替全体作决定。" },

      { id: 17, dim: "C", reverse: false, text: "地方共同体应有实质性自治权。" },
      { id: 18, dim: "C", reverse: true, text: "危机时期应尽量把决定权集中到少数核心机关。" },
      { id: 19, dim: "C", reverse: false, text: "被授权者应当能够被公开质询、监督和罢免。" },
      { id: 20, dim: "C", reverse: true, text: "统一命令比公开审议更值得长期优先。" },
      { id: 21, dim: "C", reverse: false, text: "基层组织直接参与决策，通常比完全自上而下更可靠。" },
      { id: 22, dim: "C", reverse: true, text: "分散权力会天然削弱国家，因此应尽量避免。" },
      { id: 23, dim: "C", reverse: false, text: "在同一国家内允许多层级协商，比单一指挥更能减少权力异化。" },
      { id: 24, dim: "C", reverse: true, text: "民众最好只负责服从与执行，而不负责审议与纠错。" },

      { id: 25, dim: "D", reverse: false, text: "私有财产和契约自由是社会繁荣的首要基础。" },
      { id: 26, dim: "D", reverse: true, text: "关键基础设施应优先置于公共控制之下。" },
      { id: 27, dim: "D", reverse: true, text: "即使效率下降，也应确保最低生活保障与基本服务。" },
      { id: 28, dim: "D", reverse: false, text: "市场竞争通常比行政指令更能配置资源。" },
      { id: 29, dim: "D", reverse: true, text: "工会和行业组织应能迫使资本与政府让步。" },
      { id: 30, dim: "D", reverse: false, text: "政府的主要经济职责是维持规则，而不是直接经营。" },
      { id: 31, dim: "D", reverse: true, text: "在严重不平等面前，再分配比产权完整更重要。" },
      { id: 32, dim: "D", reverse: false, text: "长期繁荣更依赖开放交易和投资，而不是配给与征用。" },

      { id: 33, dim: "E", reverse: false, text: "对未知力量的研究应尽量公开、可复核、可批评。" },
      { id: 34, dim: "E", reverse: true, text: "高危知识最好长期由少数被认可的机构垄断。" },
      { id: 35, dim: "E", reverse: false, text: "只要风险可控，实验和试错应被视为必要成本。" },
      { id: 36, dim: "E", reverse: true, text: "某些知识因其神圣或危险，本就不适合被普遍传播。" },
      { id: 37, dim: "E", reverse: false, text: "学院、工坊与民间研究者都应有参与知识生产的机会。" },
      { id: 38, dim: "E", reverse: true, text: "面对未知现象，启示与传承通常比实验更可靠。" },
      { id: 39, dim: "E", reverse: false, text: "对高风险技术的治理应以规则、记录和审计为主。" },
      { id: 40, dim: "E", reverse: true, text: "只有极少数天赋者才真正有资格处理高深知识。" },

      { id: 41, dim: "F", reverse: false, text: "面对危险边地，应优先建立长期开发与重建能力。" },
      { id: 42, dim: "F", reverse: true, text: "接近高风险区域时，保命与封控应压倒发展目标。" },
      { id: 43, dim: "F", reverse: false, text: "夺回失地和恢复生产，值得承担较高风险。" },
      { id: 44, dim: "F", reverse: true, text: "对长期失稳区域，撤离与隔绝通常优于再投入。" },
      { id: 45, dim: "F", reverse: false, text: "人类应主动改造不稳定环境，而不是只学会躲避它。" },
      { id: 46, dim: "F", reverse: true, text: "维持最小生存秩序比追求扩张和繁荣更重要。" },
      { id: 47, dim: "F", reverse: false, text: "对边远地区的投资不应只限于防守，也应面向未来整合。" },
      { id: 48, dim: "F", reverse: true, text: "未被充分理解的危险区域最好长期封存。" },

      { id: 49, dim: "G", reverse: false, text: "公共政策应主要依赖可检验的理由。" },
      { id: 50, dim: "G", reverse: true, text: "祖训、祭仪和圣言应优先于新的公共论证。" },
      { id: 51, dim: "G", reverse: false, text: "国家可以尊重信仰，但不应把任何信条定为唯一真理。" },
      { id: 52, dim: "G", reverse: true, text: "维系共同体最可靠的方式，仍是让传统权威主导公共生活。" },
      { id: 53, dim: "G", reverse: false, text: "即使神秘力量真实存在，公共制度也应允许不同解释并存。" },
      { id: 54, dim: "G", reverse: true, text: "教育首先应教会人服从传统，而不是鼓励质疑传统。" },
      { id: 55, dim: "G", reverse: false, text: "信仰团体可以参与社会救济，但不应垄断公共决策。" },
      { id: 56, dim: "G", reverse: true, text: "当理性与神圣传统冲突时，理性通常应让位。" },

      { id: 57, dim: "H", reverse: false, text: "没有持续备战能力的国家，终将失去自主。" },
      { id: 58, dim: "H", reverse: true, text: "军事需求不应长期凌驾于民生与法治之上。" },
      { id: 59, dim: "H", reverse: false, text: "面对严重威胁，压缩程序与自由是可接受的代价。" },
      { id: 60, dim: "H", reverse: true, text: "社会不应按军营逻辑长期组织自己。" },
      { id: 61, dim: "H", reverse: false, text: "安全机关应拥有广泛权限，以防止秩序突然崩解。" },
      { id: 62, dim: "H", reverse: true, text: "即便处于危险环境，军队也必须严格受文官与法律约束。" },
      { id: 63, dim: "H", reverse: false, text: "集中动员比地方协商更适合应对外部威胁。" },
      { id: 64, dim: "H", reverse: true, text: "长期把世界理解为战场，会反过来制造新的灾难。" },

      { id: 65, dim: "I", reverse: false, text: "大范围政治共同体不应强迫所有地区采用同一制度。" },
      { id: 66, dim: "I", reverse: true, text: "中央有权为整体利益压倒地方长期习惯。" },
      { id: 67, dim: "I", reverse: false, text: "地区差异应通过协商性制度被承认，而不是被消除。" },
      { id: 68, dim: "I", reverse: true, text: "地方拥有独立政治空间，通常会削弱整体秩序。" },
      { id: 69, dim: "I", reverse: false, text: "统一规则若无视地方现实，往往会制造更大冲突。" },
      { id: 70, dim: "I", reverse: true, text: "边远地区最好直接接受中心设计的治理模式。" },
      { id: 71, dim: "I", reverse: false, text: "一个共同体可以在共享框架下容纳多种地方安排。" },
      { id: 72, dim: "I", reverse: true, text: "地方传统与地方利益不应成为中心整合的障碍。" },

      { id: 73, dim: "J", reverse: false, text: "文明应主动追求更理性、更公平、更可规划的未来。" },
      { id: 74, dim: "J", reverse: true, text: "在动荡世界中，延续现有生活方式比大胆变革更重要。" },
      { id: 75, dim: "J", reverse: false, text: "技术、工业和公共规划是摆脱长期危机的关键。" },
      { id: 76, dim: "J", reverse: true, text: "过度追求进步，往往比落后更危险。" },
      { id: 77, dim: "J", reverse: false, text: "即使代价高昂，也应争取把更多人纳入现代公共制度。" },
      { id: 78, dim: "J", reverse: true, text: "稳定、节制与边界感比不断扩张的理想更值得珍惜。" },
      { id: 79, dim: "J", reverse: false, text: "社会不应只求活下去，还应追求结构性的改善。" },
      { id: 80, dim: "J", reverse: true, text: "一个能维持秩序但不追求改变的文明，已经足够成功。" }
    ];

    const IDEOLOGIES = [
      {
        name: "市场自由主义",
        desc: "你更相信产权、契约、法治与开放交换能够带来秩序与繁荣，同时倾向限制国家、军队、圣职集团或技术机关对经济与知识的垄断。",
        target: { A: 60, B: 75, C: 75, D: 90, E: 80, F: 65, G: 70, H: 30, I: 65, J: 65 },
        thresholds: { B: [65, 100], C: [60, 100], D: [75, 100], E: [65, 100], H: [0, 45] }
      },
      {
        name: "社会自由主义",
        desc: "你认同宪政、个人自由与公共理性，但认为没有现实条件保障，自由会沦为空名，因此接受以公共服务和社会政策修正市场。",
        target: { A: 70, B: 80, C: 75, D: 45, E: 80, F: 65, G: 75, H: 30, I: 60, J: 75 },
        thresholds: { B: [70, 100], C: [65, 100], D: [35, 70], E: [70, 100], H: [0, 45], J: [70, 100] }
      },
      {
        name: "议会君主主义",
        desc: "你希望保留历史连续性与象征性法统，但要求它被议会、法律和地区协商严格约束。你不是纯复古派，而是传统法统与现代制度的调和派。",
        target: { A: 45, B: 35, C: 70, D: 65, E: 65, F: 45, G: 45, H: 30, I: 70, J: 50 },
        thresholds: { A: [30, 60], B: [20, 50], C: [55, 100], D: [50, 100], I: [55, 100] }
      },
      {
        name: "指导民主主义",
        desc: "你认可民主目标，但不相信其会自然成熟，因此倾向由国家在过渡期内对政治参与进行训练、筛选与监护。",
        target: { A: 70, B: 65, C: 35, D: 45, E: 75, F: 70, G: 65, H: 55, I: 45, J: 80 },
        thresholds: { B: [50, 80], C: [0, 50], E: [60, 100], H: [40, 75], J: [65, 100] }
      },
      {
        name: "保守进步主义",
        desc: "你接受有限改革，但更重视传统共同体、地方经验与社会连续性，反对以抽象理性强拆既有秩序。",
        target: { A: 40, B: 45, C: 65, D: 60, E: 45, F: 35, G: 35, H: 35, I: 70, J: 45 },
        thresholds: { A: [0, 55], C: [55, 100], F: [0, 50], G: [0, 45], I: [55, 100], J: [30, 65] }
      },
      {
        name: "守望主义",
        desc: "你更容易接受由强人、军政与法团结构主导的危机国家，强调效率、纪律、安全和资本秩序。",
        target: { A: 35, B: 35, C: 25, D: 75, E: 70, F: 55, G: 40, H: 75, I: 35, J: 50 },
        thresholds: { B: [0, 45], C: [0, 35], D: [55, 100], E: [55, 100], H: [65, 100] }
      },
      {
        name: "军国主义",
        desc: "你把安全、备战和统一动员看得极重，愿意让社会与制度为长期军事准备让位。",
        target: { A: 30, B: 30, C: 25, D: 55, E: 45, F: 55, G: 40, H: 90, I: 25, J: 45 },
        thresholds: { C: [0, 40], H: [75, 100], I: [0, 45] }
      },
      {
        name: "社会主义",
        desc: "你倾向于把压迫与贫困理解为结构性问题，支持以群众政治和公共控制重组资源与权力。",
        target: { A: 85, B: 80, C: 75, D: 20, E: 75, F: 70, G: 75, H: 35, I: 60, J: 85 },
        thresholds: { A: [70, 100], C: [65, 100], D: [0, 35], E: [65, 100], J: [70, 100] }
      },
      {
        name: "先锋队主义",
        desc: "你不只支持深刻改造，也认为没有集中组织和计划动员，就无法真正打碎旧秩序并重组社会。",
        target: { A: 90, B: 55, C: 25, D: 15, E: 80, F: 80, G: 65, H: 65, I: 30, J: 90 },
        thresholds: { A: [75, 100], C: [0, 45], D: [0, 30], E: [65, 100], F: [60, 100], J: [80, 100] }
      },
      {
        name: "灾厄管制主义",
        desc: "你更重视在高风险世界中维持最低生存秩序，强调预警、封控、配给、防务和共同体续存。",
        target: { A: 40, B: 45, C: 35, D: 35, E: 45, F: 20, G: 45, H: 60, I: 55, J: 25 },
        thresholds: { E: [40, 70], F: [0, 35], H: [40, 75], I: [45, 75], J: [0, 45] }
      },
      {
        name: "神权邦联主义",
        desc: "你倾向于把信仰共同体视为合法政治单元，支持在共同盟约下维持地方宗教自治与协商秩序。",
        target: { A: 30, B: 25, C: 70, D: 50, E: 30, F: 30, G: 15, H: 45, I: 80, J: 35 },
        thresholds: { B: [0, 40], C: [55, 100], G: [0, 30], I: [65, 100], E: [0, 50] }
      },
      {
        name: "奥法官僚主义",
        desc: "你倾向于相信专业知识、技术机关和规则化治理，认为复杂世界需要由训练有素的专家系统来管理。",
        target: { A: 60, B: 55, C: 30, D: 55, E: 60, F: 55, G: 65, H: 45, I: 35, J: 75 },
        thresholds: { C: [0, 45], E: [45, 75], G: [55, 100], J: [60, 100] }
      },
      {
        name: "地方自治主义",
        desc: "你最重视地方共同体的自我治理，倾向于让不同地区依据自身历史、风险和生活方式形成多样制度。",
        target: { A: 55, B: 65, C: 90, D: 55, E: 65, F: 50, G: 55, H: 25, I: 90, J: 55 },
        thresholds: { C: [75, 100], I: [75, 100], H: [0, 45] }
      }
    ];

    const CONSISTENCY_PAIRS = [
      [2, 6],
      [11, 12],
      [17, 22],
      [25, 31],
      [33, 38],
      [41, 44],
      [49, 56],
      [57, 60],
      [65, 68],
      [73, 80]
    ];

    function renderQuestions() {
      const form = document.getElementById("meenQuestionForm");
      if (!form) return;

      form.innerHTML = "";

      QUESTIONS.forEach(q => {
        const card = document.createElement("div");
        card.className = "meen-question-card";

        card.innerHTML = `
          <div class="meen-question-dim">${DIMENSIONS[q.dim].name}</div>
          <div class="meen-question-title">${q.id}. ${q.text}</div>
          <div class="meen-options">
            ${[1, 2, 3, 4, 5].map(v => `
              <label>
                <input type="radio" name="q${q.id}" value="${v}">
                ${v}
              </label>
            `).join("")}
          </div>
        `;

        form.appendChild(card);
      });

      form.addEventListener("change", function (e) {
        if (e.target && e.target.matches("input[type='radio']")) {
          const labels = e.target.closest(".meen-options").querySelectorAll("label");
          labels.forEach(label => label.classList.remove("meen-selected"));
          e.target.closest("label").classList.add("meen-selected");
          updateProgress();
        }
      });
    }

    function updateProgress() {
      const answered = QUESTIONS.filter(q => {
        return document.querySelector(`input[name="q${q.id}"]:checked`);
      }).length;

      const percent = answered / QUESTIONS.length * 100;
      const progressBar = document.getElementById("meenProgressBar");
      const progressText = document.getElementById("meenProgressText");

      if (progressBar) progressBar.style.width = percent + "%";
      if (progressText) progressText.textContent = `已完成 ${answered} / ${QUESTIONS.length}`;
    }

    function getRawAnswers() {
      const answers = {};

      QUESTIONS.forEach(q => {
        const input = document.querySelector(`input[name="q${q.id}"]:checked`);
        if (!input) {
          throw new Error("not_complete");
        }
        answers[q.id] = Number(input.value);
      });

      return answers;
    }

    function scoreAnswer(raw, reverse) {
      return reverse ? 6 - raw : raw;
    }

    function normalize(avg) {
      return ((avg - 1) / 4) * 100;
    }

    function calculateScores(answers) {
      const grouped = {};

      QUESTIONS.forEach(q => {
        if (!grouped[q.dim]) grouped[q.dim] = [];
        grouped[q.dim].push(scoreAnswer(answers[q.id], q.reverse));
      });

      const scores = {};

      Object.keys(DIMENSIONS).forEach(dim => {
        const arr = grouped[dim] || [];
        if (arr.length === 0) {
          scores[dim] = 50;
          return;
        }

        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        scores[dim] = Math.round(normalize(avg));
      });

      return scores;
    }

    function thresholdPenalty(scores, thresholds) {
      let penalty = 0;

      Object.keys(thresholds || {}).forEach(dim => {
        const [min, max] = thresholds[dim];

        if (scores[dim] < min) {
          penalty += (min - scores[dim]) * 0.6;
        }

        if (scores[dim] > max) {
          penalty += (scores[dim] - max) * 0.6;
        }
      });

      return penalty;
    }

    function fitScore(scores, target, thresholds) {
      let total = 0;
      let count = 0;

      Object.keys(target).forEach(dim => {
        total += Math.abs(scores[dim] - target[dim]);
        count++;
      });

      const rawFit = 100 - total / count;
      const penalty = thresholdPenalty(scores, thresholds);

      return Math.max(0, Math.round(rawFit - penalty));
    }

    function calculateIdeology(scores) {
      return IDEOLOGIES
        .map(i => ({
          ...i,
          fit: fitScore(scores, i.target, i.thresholds)
        }))
        .sort((a, b) => b.fit - a.fit);
    }

    function calculateAcquiescenceIndex(answers) {
      const values = Object.values(answers);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      return Math.round(Math.abs(avg - 3) / 2 * 100);
    }

    function calculateConsistencyIndex(answers) {
      let total = 0;

      CONSISTENCY_PAIRS.forEach(([a, b]) => {
        total += Math.abs(answers[a] + answers[b] - 6) / 4;
      });

      return Math.round(total / CONSISTENCY_PAIRS.length * 100);
    }

    function confidenceText(acquiescenceIndex, consistencyIndex, topFit) {
      if (topFit < 62) return "低";
      if (acquiescenceIndex > 22 || consistencyIndex > 35) return "偏低";
      if (acquiescenceIndex > 12 || consistencyIndex > 20) return "中";
      return "高";
    }

    function resultType(first, second) {
      if (!first) return "未定型";
      if (first.fit >= 74 && (!second || first.fit - second.fit >= 6)) return "单一主导";
      if (second && first.fit >= 70 && second.fit >= 70 && first.fit - second.fit < 6) return "双主导";
      if (first.fit >= 62) return "混合型";
      return "未定型";
    }

    function fourAxisResult(scores) {
      const socialScore = Math.round((scores.A + scores.J) / 2);
      const politicalScore = scores.C;
      const natureScore = Math.round((scores.E + scores.G) / 2);
      const practiceScore = Math.round((scores.F + scores.J) / 2);

      return {
        social: socialScore >= 55 ? "进步" : "反动",
        political: politicalScore >= 55 ? "分权" : "集权",
        nature: natureScore >= 55 ? "科学" : "神秘",
        practice: practiceScore >= 55 ? "改造" : "适应",
        code: `${socialScore >= 55 ? "进步" : "反动"}-${politicalScore >= 55 ? "分权" : "集权"}-${natureScore >= 55 ? "科学" : "神秘"}-${practiceScore >= 55 ? "改造" : "适应"}`,
        raw: {
          social: socialScore,
          political: politicalScore,
          nature: natureScore,
          practice: practiceScore
        }
      };
    }

    function renderResult(scores, ideologies, answers) {
      const first = ideologies[0];
      const second = ideologies[1];
      const ai = calculateAcquiescenceIndex(answers);
      const ci = calculateConsistencyIndex(answers);
      const confidence = confidenceText(ai, ci, first.fit);
      const type = resultType(first, second);
      const axis = fourAxisResult(scores);

      const resultBox = document.getElementById("meenResult");
      if (!resultBox) return;

      resultBox.style.display = "block";

      resultBox.innerHTML = `
        <h2>测试结果</h2>

        <div class="meen-result-main">
          <h3>你的主导意识形态：${first.name}</h3>
          <p><b>四维基础：</b>${axis.code}</p>
          <p><b>结果类型：</b>${type}</p>
          <p><b>匹配度：</b>${first.fit}%</p>
          <p><b>结果置信度：</b>${confidence}</p>
          <p>${first.desc}</p>
          ${second ? `<p><b>次接近结果：</b>${second.name}，匹配度 ${second.fit}%</p>` : ""}
        </div>

        <div class="meen-result-grid">
          <div class="meen-result-card">
            <b>顺从性指数</b>
            <p>${ai} / 100</p>
            <p>${ai > 22 ? '<span class="meen-warn">你的同意或反对倾向较强，结果需要谨慎理解。</span>' : '未发现明显单向同意或单向反对倾向。'}</p>
          </div>

          <div class="meen-result-card">
            <b>矛盾指数</b>
            <p>${ci} / 100</p>
            <p>${ci > 35 ? '<span class="meen-warn">部分语义相反题目的回答差异较大，结果可能偏混合。</span>' : '回答内部一致性基本正常。'}</p>
          </div>
        </div>

        <h3>四维分数</h3>
        <div class="meen-dim-row">
          <div class="meen-dim-label">
            <span>社会哲学观：反动 ← → 进步</span>
            <b>${axis.raw.social}</b>
          </div>
          <div class="meen-dim-bar">
            <div class="meen-dim-fill" style="width:${axis.raw.social}%"></div>
          </div>
        </div>

        <div class="meen-dim-row">
          <div class="meen-dim-label">
            <span>政治架构方式：集权 ← → 分权</span>
            <b>${axis.raw.political}</b>
          </div>
          <div class="meen-dim-bar">
            <div class="meen-dim-fill" style="width:${axis.raw.political}%"></div>
          </div>
        </div>

        <div class="meen-dim-row">
          <div class="meen-dim-label">
            <span>自然哲学观：神秘 ← → 科学</span>
            <b>${axis.raw.nature}</b>
          </div>
          <div class="meen-dim-bar">
            <div class="meen-dim-fill" style="width:${axis.raw.nature}%"></div>
          </div>
        </div>

        <div class="meen-dim-row">
          <div class="meen-dim-label">
            <span>自然实践方式：适应 ← → 改造</span>
            <b>${axis.raw.practice}</b>
          </div>
          <div class="meen-dim-bar">
            <div class="meen-dim-fill" style="width:${axis.raw.practice}%"></div>
          </div>
        </div>

        <h3>十维分数</h3>
        ${Object.keys(DIMENSIONS).map(dim => {
          const d = DIMENSIONS[dim];
          const value = scores[dim];

          return `
            <div class="meen-dim-row">
              <div class="meen-dim-label">
                <span>${d.name}：${d.low} ← → ${d.high}</span>
                <b>${value}</b>
              </div>
              <div class="meen-dim-bar">
                <div class="meen-dim-fill" style="width:${value}%"></div>
              </div>
            </div>
          `;
        }).join("")}

        <h3>候选意识形态排序</h3>
        ${ideologies.slice(0, 5).map((i, index) => `
          <p>${index + 1}. <b>${i.name}</b>：${i.fit}%</p>
        `).join("")}
      `;

      resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    const submitBtn = document.getElementById("meenSubmitBtn");

    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        try {
          const answers = getRawAnswers();
          const scores = calculateScores(answers);
          const ideologies = calculateIdeology(scores);
          renderResult(scores, ideologies, answers);
        } catch (e) {
          alert("还有题目没有作答，请完成全部题目后再查看结果。");
        }
      });
    }

    renderQuestions();
    updateProgress();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMeenTest);
  } else {
    initMeenTest();
  }
})();