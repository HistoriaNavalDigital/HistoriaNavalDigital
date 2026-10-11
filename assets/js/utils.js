/**
 * HistoriaNavalDigital — Utility functions
 */
const Utils = {
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  },

  formatDate(dateStr) {
    if (!dateStr) return "—";
    if (/^\d{4}-\d{4}$/.test(dateStr)) return dateStr.replace('-', '–');
    if (/^\d{4}$/.test(dateStr)) return dateStr;
    const partial = /^\d{4}-\d{2}$/.test(dateStr);
    const date = new Date((partial ? dateStr + '-01' : dateStr) + 'T12:00:00Z');
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: partial ? undefined : "numeric",
      timeZone: "UTC",
    });
  },

  normalize(text) { return String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); },

  formatYear(dateStr) {
    if (!dateStr) return "—";
    return dateStr.substring(0, 4);
  },

  getShipIcon(type) {
    const icons = {
      acorazado: "🛳️",
      "crucero-batalla": "⚓",
      portaviones: "✈️",
      destructor: "🚤",
      submarino: "🔱",
      crucero: "⛵",
    };
    return icons[type] || "🚢";
  },

  getMultimediaIcon(type) {
    const icons = {
      fotografia: "📷",
      plano: "📐",
      mapa: "🗺️",
      ilustracion: "🎨",
      modelo3d: "🧊",
    };
    return icons[type] || "🖼️";
  },

  getStatusClass(status) {
    const classes = {
      hundido: "badge-status--hundido",
      desguazado: "badge-status--desguazado",
      retirado: "badge-status--retirado",
      activo: "badge-status--activo",
      museo: "badge-status--museo",
    };
    return classes[status] || "";
  },

  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  },

  slugify(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  },

  renderShipCard(ship) {
  const base = document.querySelector('meta[name="base-path"]')?.content || "";
  const statusClass = this.getStatusClass(ship.status);

  const imageContent = Features.image(ship.image, ship.name);

  return `
    <article class="card ship-card">
      <a href="${base}buque.html?id=${ship.id}" class="card-link">
        <div class="card-image">
         <div class="card-image-placeholder has-photo" style="background: linear-gradient(135deg, ${ship.imageColor || "#1a3a5c"} 0%, ${ship.imageColor || "#1a3a5c"}99 100%);">
         ${imageContent}
         </div>
        </div>
        <div class="card-body">
          <div class="card-meta">
            <span class="badge badge-nation">${this.escapeHtml(ship.nationName)}</span>
            <span class="badge badge-type">${this.escapeHtml(ship.typeName)}</span>
            <span class="badge badge-status ${statusClass}">${this.escapeHtml(ship.statusName)}</span>
          </div>
          <h3 class="card-title">${this.escapeHtml(ship.name)}</h3>
          <p class="card-class">${this.escapeHtml(ship.className || 'Clase pendiente de documentar')}</p>
          <p class="card-text">${this.escapeHtml(ship.summary)}</p>
          <dl class="card-facts"><div><dt>Servicio</dt><dd>${this.formatYear(ship.commissioned)}–${this.formatYear(ship.decommissioned)||'actualidad'}</dd></div><div><dt>Velocidad</dt><dd>${this.escapeHtml(ship.specs.velocidad||'Sin dato')}</dd></div></dl>
          <span class="card-read">Explorar ficha <span aria-hidden="true">↗</span></span>
        </div>
      </a>
      <div class="card-actions"><button class="btn btn-outline" data-favorite="${ship.id}" aria-pressed="${Features.isFavorite(ship.id)}">${Features.isFavorite(ship.id)?"♥ Guardado":"♡ Guardar"}</button><a href="${base}comparar.html?ids=${encodeURIComponent(ship.id)}">Comparar →</a></div>
    </article>
  `;
},
};

window.Utils = Utils;
