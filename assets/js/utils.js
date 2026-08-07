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
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

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
  const icon = this.getShipIcon(ship.type);

  const imageContent = ship.image
  ? `<img src="${base}${ship.image}" alt="${this.escapeHtml(ship.name)}">`
  : icon;

  return `
    <article class="card">
      <a href="${base}buque.html?id=${ship.id}" class="card-link">
        <div class="card-image">
         <div class="card-image-placeholder" style="background: linear-gradient(135deg, ${ship.imageColor || "#1a3a5c"} 0%, ${ship.imageColor || "#1a3a5c"}99 100%);">
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
          <p class="card-text">${this.escapeHtml(ship.summary)}</p>
        </div>
      </a>
    </article>
  `;
},
};

window.Utils = Utils;
