/**
 * HistoriaNavalDigital — Ship detail page
 */
const ShipDetailPage = {
  async init() {
    Components.mountLayout("buques");

    const shipId = Utils.getQueryParam("id");
    if (!shipId) {
      window.location.href = "buques.html";
      return;
    }

    try {
      const [ship, multimedia, allShips] = await Promise.all([
  DataLoader.getShip(shipId),
  DataLoader.getMultimedia(),
  DataLoader.getShips(),
]);
      if (!ship) {
        document.getElementById("ship-content").innerHTML =
          '<div class="empty-state"><div class="empty-state-icon">🚢</div><p>Buque no encontrado.</p><a href="buques.html" class="btn btn-primary" style="margin-top: var(--space-4);">Volver al catálogo</a></div>';
        return;
      }

      document.title = `${ship.name} — HistoriaNavalDigital`;

      const breadcrumbsEl = document.getElementById("breadcrumbs");
      if (breadcrumbsEl) {
        breadcrumbsEl.innerHTML = Components.renderBreadcrumbs([
          { label: "Inicio", href: "index.html" },
          { label: "Registro de Buques", href: "buques.html" },
          { label: ship.name, href: `buque.html?id=${ship.id}` },
        ]);
      }

      this.renderShip(ship, multimedia, allShips);
    } catch (err) {
      console.error("Error cargando buque:", err);
    }
  },

  renderShip(ship, multimedia, allShips) { 
    const container = document.getElementById("ship-content");
    const statusClass = Utils.getStatusClass(ship.status);
    const icon = Utils.getShipIcon(ship.type);
const shipMedia = multimedia.filter(
  (item) => item.shipId === ship.id
);
const sisterShips = ship.class
  ? allShips.filter(
      (s) => s.class === ship.class && s.id !== ship.id
    )
  : [];
    const specsRows = Object.entries(ship.specs)
      .map(
        ([key, value]) =>
          `<tr><th>${Utils.escapeHtml(key.charAt(0).toUpperCase() + key.slice(1))}</th><td>${Utils.escapeHtml(value)}</td></tr>`
      )
      .join("");

    const timeline = ship.serviceHistory
      .map(
        (entry) => `
        <div class="timeline-item">
          <div class="timeline-date">${Utils.formatDate(entry.date)}</div>
          <div class="timeline-event">${Utils.escapeHtml(entry.event)}</div>
        </div>
      `
      )
      .join("");

    const tags = ship.tags.map((tag) => `<li><span class="tag">${Utils.escapeHtml(tag)}</span></li>`).join("");

    const sources = ship.sources
      .map(
        (source) => `
        <li class="source-item">
          <div class="source-title">${Utils.escapeHtml(source.title)}</div>
          <div class="source-meta">${Utils.escapeHtml(source.author)} · ${source.year} · ${Utils.escapeHtml(source.type)}</div>
        </li>
      `
      )
      .join("");

    const locationText = ship.location.description || "Ubicación no disponible";
const gallery = shipMedia.length
  ? `
    <section class="content-section">
      <h2>Galería multimedia</h2>

      <div class="gallery-grid">
        ${shipMedia
          .map(
            (item) => `
            <div class="gallery-item">
              <div class="gallery-thumb">
                <img src="${HND.getAssetPath(item.image)}" alt="${Utils.escapeHtml(item.title)}">
              </div>
              <div class="gallery-info">
                <span class="badge badge-type">
                  ${Utils.escapeHtml(HND.multimediaTypes[item.type] || item.type)}
                </span>

                <h4>${Utils.escapeHtml(item.title)}</h4>

                <p>${Utils.escapeHtml(item.description)}</p>

                <p style="margin-top: var(--space-2); opacity: .7;">
                  ${item.year || ""}
                </p>
              </div>
            </div>
          `
          )
          .join("")}
      </div>
    </section>
  `
  : "";
    container.innerHTML = `
      <div class="ship-hero">
        <div class="ship-hero-image">
  ${
    ship.imageDetail
      ? `<img src="${HND.getAssetPath(ship.imageDetail)}" alt="${Utils.escapeHtml(ship.name)}">`
      : ship.image
        ? `<img src="${HND.getAssetPath(ship.image)}" alt="${Utils.escapeHtml(ship.name)}">`
        : icon
  }
</div>
        <div class="ship-hero-info">
          <div class="card-meta" style="margin-bottom: var(--space-4);">
            <span class="badge badge-nation">${Utils.escapeHtml(ship.nationName)}</span>
            <span class="badge badge-type">${Utils.escapeHtml(ship.typeName)}</span>
            <span class="badge badge-status ${statusClass}">${Utils.escapeHtml(ship.statusName)}</span>
          </div>
          <h1>${Utils.escapeHtml(ship.name)}</h1>
          <p class="ship-summary">${Utils.escapeHtml(ship.summary)}</p>
          <div class="ship-meta-grid">
            <div class="meta-item">
              <div class="meta-label">En servicio desde</div>
              <div class="meta-value">${Utils.formatDate(ship.commissioned)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Retirado / Finalizado</div>
              <div class="meta-value">${Utils.formatDate(ship.decommissioned)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Nación</div>
              <div class="meta-value">${Utils.escapeHtml(ship.nationName)}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">Estado</div>
              <div class="meta-value">${Utils.escapeHtml(ship.statusName)}</div>
            </div>
          </div>
          <ul class="tags-list">${tags}</ul>
        </div>
      </div>

      <section class="content-section">
        <h2>Descripción</h2>
        <p>${Utils.escapeHtml(ship.description)}</p>
      </section>

      <section class="content-section">
        <h2>Especificaciones técnicas</h2>
        <table class="specs-table">
          <tbody>${specsRows}</tbody>
        </table>
      </section>

      <section class="content-section">
        <h2>Historial de servicio</h2>
        <div class="timeline">${timeline}</div>
      </section>

      <section class="content-section">
        <h2>Localización</h2>
        <p>${Utils.escapeHtml(locationText)}</p>
      </section>
${gallery}

${
  sisterShips.length
    ? `
<section class="content-section">
  <h2>Buques de la misma clase</h2>

  <div class="grid grid-3">
    ${sisterShips
      .map((s) => Utils.renderShipCard(s))
      .join("")}
  </div>
</section>
`
    : ""
}

<div style="margin-top: var(--space-8);">
  <a href="buques.html" class="btn btn-outline">← Volver al catálogo</a>
</div>
`;
  },
};
document.addEventListener("DOMContentLoaded", () => ShipDetailPage.init());
