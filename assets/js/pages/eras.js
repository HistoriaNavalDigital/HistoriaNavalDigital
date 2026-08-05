/**
 * HistoriaNavalDigital — Eras and Conflicts page
 */
const ErasPage = {
  async init() {
    Components.mountLayout("eras");

    const breadcrumbsEl = document.getElementById("breadcrumbs");
    if (breadcrumbsEl) {
      breadcrumbsEl.innerHTML = Components.renderBreadcrumbs([
        { label: "Inicio", href: "index.html" },
        { label: "Eras y Conflictos", href: "eras.html" },
      ]);
    }

    try {
      const [eras, conflicts, ships] = await Promise.all([
        DataLoader.getEras(),
        DataLoader.getConflicts(),
        DataLoader.getShips(),
      ]);

      this.renderEras(eras, ships);
      this.renderConflicts(conflicts, ships);
    } catch (err) {
      console.error("Error cargando eras:", err);
    }
  },

  renderEras(eras, ships) {
    const container = document.getElementById("eras-grid");
    if (!container) return;

    container.innerHTML = eras
      .map((era) => {
        const eraShips = ships.filter((s) => s.era === era.id);
        const shipLinks = eraShips
          .slice(0, 3)
          .map(
            (s) =>
              `<a href="buque.html?id=${s.id}" style="font-size: var(--text-sm);">${Utils.escapeHtml(s.name)}</a>`
          )
          .join(" · ");

        return `
          <div class="info-card">
            <div class="info-card-icon">🕰️</div>
            <h3>${Utils.escapeHtml(era.name)}</h3>
            <p><strong>${Utils.escapeHtml(era.period)}</strong></p>
            <p>${Utils.escapeHtml(era.description)}</p>
            <p style="font-size: var(--text-sm);"><strong>${eraShips.length}</strong> buque(s) en el registro</p>
            ${shipLinks ? `<p style="margin-top: var(--space-3);">${shipLinks}</p>` : ""}
            <a href="buques.html?era=${era.id}" class="btn btn-outline" style="margin-top: var(--space-4);">Ver buques</a>
          </div>
        `;
      })
      .join("");
  },

  renderConflicts(conflicts, ships) {
    const container = document.getElementById("conflicts-grid");
    if (!container) return;

    container.innerHTML = conflicts
      .map((conflict) => {
        const conflictShips = ships.filter((s) => s.conflicts.includes(conflict.id));

        return `
          <div class="info-card">
            <div class="info-card-icon">⚔️</div>
            <h3>${Utils.escapeHtml(conflict.name)}</h3>
            <p><strong>${Utils.escapeHtml(conflict.period)}</strong> · Teatros: ${conflict.theaters.map(Utils.escapeHtml).join(", ")}</p>
            <p>${Utils.escapeHtml(conflict.description)}</p>
            <p style="font-size: var(--text-sm); margin-top: var(--space-3);"><strong>Batallas clave:</strong> ${conflict.keyBattles.map(Utils.escapeHtml).join(", ")}</p>
            <p style="font-size: var(--text-sm);"><strong>${conflictShips.length}</strong> buque(s) registrado(s)</p>
          </div>
        `;
      })
      .join("");
  },
};

document.addEventListener("DOMContentLoaded", () => ErasPage.init());
