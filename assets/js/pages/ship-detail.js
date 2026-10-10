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

    Features.loading(document.getElementById("ship-content"));
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
      document.querySelector('meta[name="description"]').content=ship.summary;
      document.querySelector('meta[property="og:title"]').content=document.title;
      document.querySelector('meta[property="og:description"]').content=ship.summary;

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
      Features.error(document.getElementById("ship-content"), "No se pudo cargar la ficha del buque.");
    }
  },

  renderShip(ship, multimedia, allShips) { 
    const container = document.getElementById("ship-content");
    const statusClass = Utils.getStatusClass(ship.status);
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
          `<tr><th scope="row">${Utils.escapeHtml(key.charAt(0).toUpperCase() + key.slice(1))}</th><td>${Utils.escapeHtml(value)}</td></tr>`
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

    const locationText = ship.location.description || "Ubicación no disponible";
const gallery=shipMedia.length?`<section class="content-section" id="galeria"><h2>Galería multimedia</h2><div class="gallery-grid">${Features.gallery(shipMedia)}</div></section>`:"";
    container.innerHTML = `
      <nav class="section-index" aria-label="Secciones de la ficha"><a href="#descripcion">Historia</a><a href="#especificaciones">Especificaciones</a><a href="#historial">Servicio</a><a href="#ubicacion">Localización</a>${shipMedia.length?'<a href="#galeria">Galería</a>':''}<a href="#fuentes">Fuentes</a></nav>
      <div class="ship-hero">
        <div class="ship-hero-image">
  ${Features.image(ship.imageDetail || ship.image,ship.name,ship.imageCredit,true)}

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
              <div class="meta-label">Fin del servicio</div>
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
          <p><strong>Clase:</strong> ${Utils.escapeHtml(ship.className||'Pendiente de documentar')} · <a href="buques.html?era=${encodeURIComponent(ship.era)}">Explorar su era</a></p>
          <p><strong>Conflictos:</strong> ${ship.conflicts.map(c=>`<a href="batallas.html?conflicto=${encodeURIComponent(c)}">${Utils.escapeHtml(c.replaceAll('-',' '))}</a>`).join(' · ')}</p>
          <ul class="tags-list">${tags}</ul><div class="hero-actions"><button class="btn btn-outline" data-favorite="${ship.id}" aria-pressed="${Features.isFavorite(ship.id)}">${Features.isFavorite(ship.id)?'♥ Guardado':'♡ Guardar'}</button><a class="btn btn-outline" href="comparar.html?ids=${ship.id}">Comparar buque</a></div>
          ${Features.credit(ship.imageCredit)}
        </div>
      </div>

      <section class="content-section" id="descripcion">
        <h2>Descripción</h2>
        <p>${Utils.escapeHtml(ship.description)}</p>
      </section>

      <section class="content-section" id="especificaciones">
        <h2>Especificaciones técnicas</h2>
        <p class="editor-note">${Utils.escapeHtml(ship.specsNote||"Las dimensiones y el armamento pueden variar según la fecha y la configuración. Los datos pendientes se indican expresamente.")}</p><div class="specs-scroll"><table class="specs-table">
          <tbody>${specsRows}</tbody>
        </table></div>
      </section>

      <section class="content-section" id="historial">
        <h2>Historial de servicio</h2>
        <div class="timeline">${timeline}</div>
      </section>

      <section class="content-section" id="ubicacion">
        <h2>Localización</h2>
        <p>${Utils.escapeHtml(locationText)}</p>
      </section>
${gallery}
<section class="content-section" id="fuentes"><h2>Fuentes y documentación</h2>${Features.sources(ship.sources)}<p class="editor-note">${Utils.escapeHtml(ship.reviewNote||"Revisión documental parcial. Consulta las referencias y la fecha de configuración de cada dato técnico.")}</p></section>

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
