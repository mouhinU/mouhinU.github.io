// 项目数据加载和渲染模块 负责从JSON文件加载项目数据并动态渲染到页面

/**
 * 异步加载项目数据
 * 从projects.json文件获取数据并渲染到页面
 */
async function loadProjects() {
  try {
    // 加载项目数据
    const response = await fetch("projects/project.json");
    // 获取每个阶段的数据
    const phases = await response.json();

    const container = document.getElementById("projects-container");
    // 清空加载提示
    container.innerHTML = "";

    // 遍历每个阶段数据，创建并添加项目元素
    phases.forEach((phase, index) => {
      const projectElement = createProjectElement(phase, index);
      container.appendChild(projectElement);
    });
    console.log(`成功加载 ${phases.length} 个阶段项目经历`);
  } catch (error) {
    console.error("加载项目数据失败:", error);
    const container = document.getElementById("projects-container");
    container.innerHTML =
      '<div class="error"><p>项目数据加载失败，请刷新页面重试。</p></div>';
  }
}

/**
 * 创建项目元素
 * 根据项目数据生成对应的HTML结构
 * @param {Object} phase - 项目数据对象
 * @param {number} index - 项目索引
 * @returns {HTMLElement} - 项目DOM元素
 */
function createProjectElement(phase, index) {
  const div = document.createElement("div");
  div.className = "item";

  // 提取日期信息（如果标题中包含）
  const dateMatch = phase.title.match(/\d{4}\.\d{2}\s*-\s*\d{4}\.\d{2}/);
  const date = dateMatch ? dateMatch[0] : "";

  // 清理标题（移除日期）
  const cleanTitle = phase.title
    .replace(/\d{4}\.\d{2}\s*-\s*\d{4}\.\d{2}/g, "")
    .trim();

  let phaseHtml = "";
  if (phase.projects && phase.projects.length > 0) {
    phaseHtml = phase.projects
      .map((proj) => {
        // let targetHtml = proj.target
        //   ? `<p><strong>项目目标:</strong> ${proj.target}</p>`
        //   : "";
        let targetHtml = "";
        let achievementsHtml =
          proj.achievement && proj.achievement.length > 0
            ? `<p><strong>项目成果:</strong></p>
            <ul class="project-achievements">
              ${proj.achievement
                .map((ach) => `<li><i class="fas fa-check"></i>${ach}</li>`)
                .join("")}
            </ul>`
            : "";

        return `
        <div class="project-section">
          <h4>${proj.name}</h4>
          ${targetHtml}
          <p><strong>项目背景:</strong> ${proj.background}</p>
          <p><strong>工作职责:</strong> ${proj.duty}</p>
          ${achievementsHtml}
        </div>
      `;
      })
      .join("");
  }

  let stacksHtml = "";
  if (phase.stacks && phase.stacks.length > 0) {
    stacksHtml = `
      <div class="tech-stack">
        ${phase.stacks
          .map((stack) => {
            let className = "tech-tag";
            if (stack.toLowerCase().includes("java")) className += " java-tag";
            if (stack.toLowerCase().includes("spring"))
              className += " spring-tag";
            return `<span class="${className}">${stack}</span>`;
          })
          .join("")}
      </div>
    `;
  }

  // 检查是否有项目内容
  const hasProjects = phase.projects && phase.projects.length > 0;

  div.innerHTML = `
    <div class="item-header">
      <div>
        <div class="item-title">${cleanTitle}</div>
        <div class="item-subtitle">${phase.job}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 15px;">
        ${date ? `<div class="item-date">${date}</div>` : ""}
      </div>
    </div>
    <div class="item-description">
      ${phase.description ? `<p> <strong> 阶段性总结:</strong> ${phase.description}</p>` : ""}
      ${hasProjects ? phaseHtml : ""}
    </div>
    ${stacksHtml}
  `;

  return div;
}

/**
 * 初始化项目数据加载
 * 在DOM加载完成后自动执行
 */
function initProjects() {
  if (document.getElementById("projects-container")) {
    loadProjects();
  }
}

// 导出函数供外部使用
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    loadProjects,
    createProjectElement,
    initProjects,
  };
} else {
  // 浏览器环境：自动初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjects);
  } else {
    initProjects();
  }
}
