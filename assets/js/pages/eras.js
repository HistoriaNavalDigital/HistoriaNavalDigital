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

    Features.loading(document.getElementById("eras-grid"));
    try {
      const [eras, conflicts, ships] = await Promise.all([
        DataLoader.getEras(),
        DataLoader.getConflicts(),
        DataLoader.getShips(),
      ]);

      this.renderEras(eras, ships);
      this.battles=await DataLoader.load("battles.json");
      this.renderConflicts(conflicts, ships);
    } catch (err) {
      Features.error(document.getElementById("eras-grid"));
    }
  },

  renderEras(eras, ships) {
    const container = document.getElementById("eras-grid");
    if (!container) return;

    container.innerHTML = eras
      .map((era) => {
        const eraShips = ships.filter((s) => Archive.eraMatches(s,era.id));
        const shipLinks = eraShips
          .slice(0, 3)
          .map(
            (s) =>
              `<a href="buque.html?id=${s.id}" style="font-size: var(--text-sm);">${Utils.escapeHtml(s.name)}</a>`
          )
          .join(" · ");

        return `
          <article class="info-card" id="${era.id}">
           <div class="era-card-image">
  <img
    src="${HND.getAssetPath(era.image)}" loading="lazy" decoding="async" data-image
    alt="${Utils.escapeHtml(era.name)}"
  >
</div>
            <p class="image-credit">${Utils.escapeHtml(era.imageCaption||era.name)}</p>${Features.credit(era.credit)}
            <h3>${Utils.escapeHtml(era.name)}</h3>
            <p><strong>${Utils.escapeHtml(era.period)}</strong></p>
            <p>${Utils.escapeHtml(era.description)}</p><a class="documentation-link" href="periodo.html?id=${era.id}">Leer el periodo histórico →</a>
            <p style="font-size: var(--text-sm);"><strong>${eraShips.length}</strong> buque(s) en el registro</p>
            ${!eraShips.length?'<p class="pending-note">Esta era está pendiente de incorporar buques documentados.</p>':""}
            ${shipLinks ? `<p style="margin-top: var(--space-3);">${shipLinks}</p>` : ""}
            ${eraShips.length?`<a href="buques.html?era=${era.id}" class="btn btn-outline" style="margin-top: var(--space-4);">Ver buques</a>`:`<a href="tecnologia.html">Comprender la evolución naval →</a>`}
          </article>
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
          <article class="info-card" id="${conflict.id}">
            <div class="info-card-icon"><img src="assets/images/icons/eras.svg" width="40" height="40" alt=""></div>
            <h3>${Utils.escapeHtml(conflict.name)}</h3>
            <p><strong>${Utils.escapeHtml(conflict.period)}</strong> · Teatros: ${conflict.theaters.map(Utils.escapeHtml).join(", ")}</p>
            <p>${Utils.escapeHtml(conflict.description)}</p><a class="documentation-link" href="conflicto.html?id=${conflict.id}">Leer el conflicto →</a>
            <p style="font-size: var(--text-sm); margin-top: var(--space-3);"><strong>Batallas clave:</strong> ${this.battles.filter(b=>b.conflict===conflict.id).map(b=>`<a href="batalla.html?id=${b.id}">${Utils.escapeHtml(b.name)}</a>`).join(", ")||"Todavía no hay acontecimientos incorporados"}</p>
            <p style="font-size: var(--text-sm);"><strong>${conflictShips.length}</strong> buque(s) registrado(s)</p>
            <a href="batallas.html?conflicto=${conflict.id}" class="btn btn-outline">Explorar batallas →</a>
          </article>
        `;
      })
      .join("");
  },
};

document.addEventListener("DOMContentLoaded", () => ErasPage.init());
