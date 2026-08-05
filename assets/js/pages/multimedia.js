/**
 * HistoriaNavalDigital — Multimedia archive page
 */
const MultimediaPage = {
  async init() {
    Components.mountLayout("multimedia");

    const breadcrumbsEl = document.getElementById("breadcrumbs");
    if (breadcrumbsEl) {
      breadcrumbsEl.innerHTML = Components.renderBreadcrumbs([
        { label: "Inicio", href: "index.html" },
        { label: "Archivo Multimedia", href: "multimedia.html" },
      ]);
    }

    try {
      const [items, ships] = await Promise.all([DataLoader.getMultimedia(), DataLoader.getShips()]);
      this.setupFilters(items, ships);
      this.allItems = items;
      this.ships = ships;
      this.renderGallery(items, ships);
    } catch (err) {
      console.error("Error cargando multimedia:", err);
    }
  },

  setupFilters(items) {
    const typeFilter = document.getElementById("filter-media-type");
    typeFilter.addEventListener("change", () => {
      const type = typeFilter.value;
      const filtered = type ? items.filter((i) => i.type === type) : items;
      this.renderGallery(filtered, this.ships);
    });
  },

  renderGallery(items, ships) {
    const container = document.getElementById("gallery-grid");
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">🖼️</div><p>No hay recursos multimedia con los filtros seleccionados.</p></div>';
      return;
    }

    container.innerHTML = items
      .map((item) => {
        const ship = item.shipId ? ships.find((s) => s.id === item.shipId) : null;
        const icon = Utils.getMultimediaIcon(item.type);
        const typeName = HND.multimediaTypes[item.type] || item.type;

        return `
          <div class="gallery-item">
            <div class="gallery-thumb" style="background: linear-gradient(135deg, var(--color-navy-700) 0%, var(--color-navy-500) 100%);">
              ${icon}
            </div>
            <div class="gallery-info">
              <span class="badge badge-type" style="margin-bottom: var(--space-2);">${Utils.escapeHtml(typeName)}</span>
              <h4>${Utils.escapeHtml(item.title)}</h4>
              <p>${Utils.escapeHtml(item.description)}</p>
              ${ship ? `<p style="margin-top: var(--space-2);"><a href="buque.html?id=${ship.id}">${Utils.escapeHtml(ship.name)}</a></p>` : ""}
              <p style="margin-top: var(--space-1); opacity: 0.7;">${item.year || ""}</p>
            </div>
          </div>
        `;
      })
      .join("");
  },
};

document.addEventListener("DOMContentLoaded", () => MultimediaPage.init());
