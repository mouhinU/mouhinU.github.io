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
      .map((project) => {
        //  不显示这块内容了，感觉没什么意义，毕竟项目目标和背景有点重复了
        // let targetHtml = project.target
        //   ? `<p><strong>项目目标:</strong> ${project.target}</p>`
        //   : "";
        let targetHtml = "";
        let achievementsHtml =
          project.achievements && project.achievements.length > 0
            ? `<p><strong>项目成果:</strong></p>
            <ul class="project-achievements">
              ${project.achievements
                .map(
                  (achievement) =>
                    `<li><i class="fas fa-check"></i>${achievement}</li>`,
                )
                .join("")}
            </ul>`
            : "";

        return `
        <div class="project-section">
          <div class="project-header" onclick="toggleProject(this)">
            <div class="project-title-container">
              <h4>${project.name}</h4>
              <span class="project-lifecycle">${project.lifecycle}</span>
            </div>
            <i class="fas fa-chevron-down toggle-icon"></i>
          </div>
          <div class="project-content">
            ${targetHtml}
            <p><strong>项目背景:</strong> ${project.background}</p>
            <p><strong>工作职责:</strong> ${project.duty}</p>
            ${achievementsHtml}
          </div>
        </div>
      `;
      })
      .join("");
  }

  // 技术栈信息
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
    <div class="phase-header" onclick="togglePhase(this)">
      <div class="phase-title-container">
        <div>
          <div class="item-title">${cleanTitle}</div>
          <div class="item-subtitle">${phase.job}</div>
        </div>
        <div style="display: flex; align-items: center; gap: 15px;">
          ${date ? `<div class="item-date">${date}</div>` : ""}
          <i class="fas fa-chevron-down phase-toggle-icon"></i>
        </div>
      </div>
    </div>
    ${phase.description ? `<div class="phase-summary"><p> <strong> 阶段性总结:</strong> ${phase.description}</p></div>` : ""}
    <div class="phase-content">
      ${hasProjects ? phaseHtml : ""}
      ${stacksHtml}
    </div>
  `;

  return div;
}

/**
 * 切换项目内容的显示/隐藏状态
 * @param {HTMLElement} header - 项目标题元素
 */
function toggleProject(header) {
  const projectSection = header.closest(".project-section");
  const content = projectSection.querySelector(".project-content");
  const icon = header.querySelector(".toggle-icon");

  if (content.classList.contains("collapsed")) {
    // 展开内容
    content.classList.remove("collapsed");
    content.style.maxHeight = content.scrollHeight + "px";
    icon.classList.remove("fa-chevron-right");
    icon.classList.add("fa-chevron-down");
  } else {
    // 收缩内容
    content.classList.add("collapsed");
    content.style.maxHeight = "0";
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-right");
  }
}

/**
 * 切换 phase（项目阶段）内容的显示/隐藏状态
 * @param {HTMLElement} header - phase 标题元素
 */
function togglePhase(header) {
  const phaseElement = header.closest(".item");
  const content = phaseElement.querySelector(".phase-content");
  const icon = header.querySelector(".phase-toggle-icon");

  if (content.classList.contains("collapsed")) {
    // 展开内容
    content.classList.remove("collapsed");
    content.style.maxHeight = content.scrollHeight + "px";
    icon.classList.remove("fa-chevron-right");
    icon.classList.add("fa-chevron-down");
  } else {
    // 收缩内容
    content.classList.add("collapsed");
    content.style.maxHeight = "0";
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-right");
  }
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
