/**
 * HistoriaNavalDigital — Technology page
 */
const TechnologyPage = {
  async init() {
    Components.mountLayout("tecnologia");

    const breadcrumbsEl = document.getElementById("breadcrumbs");
    if (breadcrumbsEl) {
      breadcrumbsEl.innerHTML = Components.renderBreadcrumbs([
        { label: "Inicio", href: "index.html" },
        { label: "Tecnología y Construcción", href: "tecnologia.html" },
      ]);
    }

    try {
      const tech = await DataLoader.getTechnology();
      this.renderTechnology(tech);
    } catch (err) {
      console.error("Error cargando tecnología:", err);
    }
  },

  renderTechnology(items) {
    const container = document.getElementById("technology-sections");
    if (!container) return;

    container.innerHTML = items
      .map(
        (item, index) => `
        <div class="tech-section">
          <div class="tech-header" role="button" tabindex="0" aria-expanded="${index === 0}" data-tech-id="${item.id}">
            <div>
              <div class="tech-category">${Utils.escapeHtml(item.category)}</div>
              <h3>${Utils.escapeHtml(item.name)}</h3>
            </div>
            <span aria-hidden="true">${index === 0 ? "▼" : "▶"}</span>
          </div>
          <div class="tech-body" style="display: ${index === 0 ? "block" : "none"};">
            <p style="margin-bottom: var(--space-4);">${Utils.escapeHtml(item.description)}</p>
            ${item.topics
              .map(
                (topic) => `
              <div class="tech-topic">
                <h4>${Utils.escapeHtml(topic.title)}</h4>
                <div class="tech-topic-period">${Utils.escapeHtml(topic.period)}</div>
                <p>${Utils.escapeHtml(topic.detail)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
      )
      .join("");

    container.querySelectorAll(".tech-header").forEach((header) => {
      header.addEventListener("click", () => this.toggleSection(header));
      header.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.toggleSection(header);
        }
      });
    });
  },

  toggleSection(header) {
    const body = header.nextElementSibling;
    const arrow = header.querySelector("span");
    const isOpen = body.style.display !== "none";

    body.style.display = isOpen ? "none" : "block";
    arrow.textContent = isOpen ? "▶" : "▼";
    header.setAttribute("aria-expanded", !isOpen);
  },
};

document.addEventListener("DOMContentLoaded", () => TechnologyPage.init());
