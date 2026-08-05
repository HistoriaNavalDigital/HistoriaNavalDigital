/**
 * HistoriaNavalDigital — Nations page
 */
const NationsPage = {
  async init() {
    Components.mountLayout("naciones");

    const breadcrumbsEl = document.getElementById("breadcrumbs");
    if (breadcrumbsEl) {
      breadcrumbsEl.innerHTML = Components.renderBreadcrumbs([
        { label: "Inicio", href: "index.html" },
        { label: "Naciones y Facciones", href: "naciones.html" },
      ]);
    }

    try {
      const [nations, ships] = await Promise.all([DataLoader.getNations(), DataLoader.getShips()]);
      this.renderNations(nations, ships);
    } catch (err) {
      console.error("Error cargando naciones:", err);
    }
  },

  renderNations(nations, ships) {
    const container = document.getElementById("nations-grid");
    if (!container) return;

    container.innerHTML = nations
      .map((nation) => {
        const nationShips = ships.filter((s) => s.nation === nation.id);
        const shipList = nationShips
          .map(
            (s) =>
              `<li><a href="buque.html?id=${s.id}">${Utils.escapeHtml(s.name)}</a> <span style="color: var(--color-text-muted); font-size: var(--text-sm);">(${Utils.escapeHtml(s.typeName)})</span></li>`
          )
          .join("");

        return `
          <div class="info-card">
            <div class="info-card-icon">${nation.flag}</div>
            <h3>${Utils.escapeHtml(nation.name)}</h3>
            <p><strong>${Utils.escapeHtml(nation.period)}</strong></p>
            <p>${Utils.escapeHtml(nation.description)}</p>
            <p style="font-size: var(--text-sm); margin-top: var(--space-3);"><strong>Doctrina naval:</strong> ${Utils.escapeHtml(nation.navalDoctrine)}</p>
            <p style="font-size: var(--text-sm);"><strong>Tipos principales:</strong> ${nation.keyShipTypes.map(Utils.escapeHtml).join(", ")}</p>
            ${shipList ? `<ul style="margin-top: var(--space-4); padding-left: var(--space-5);">${shipList}</ul>` : ""}
            <a href="buques.html?nacion=${nation.id}" class="btn btn-outline" style="margin-top: var(--space-4);">Ver todos los buques</a>
          </div>
        `;
      })
      .join("");
  },
};

document.addEventListener("DOMContentLoaded", () => NationsPage.init());
