/**
 * HistoriaNavalDigital — Home page
 */
const HomePage = {
  async init() {
    Components.mountLayout("inicio");

    try {
      const [allShips, featured, ephemerides, nations, eras] = await Promise.all([
        DataLoader.getShips(),
        DataLoader.getFeaturedShips(),
        DataLoader.getEphemerides(),
        DataLoader.getNations(),
        DataLoader.getEras(),
      ]);

      this.renderStats(allShips, nations, eras);
      this.renderFeaturedShips(featured);
      this.renderEphemerides(ephemerides);
    } catch (err) {
      console.error("Error cargando datos de inicio:", err);
    }
  },

  renderStats(allShips, nations, eras) {
    const statsEl = document.getElementById("stats-bar");
    if (!statsEl) return;

    statsEl.innerHTML = `
      <div class="stat-item">
        <div class="stat-number">${allShips.length}</div>
        <div class="stat-label">Buques registrados</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${nations.length}</div>
        <div class="stat-label">Naciones</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${eras.length}</div>
        <div class="stat-label">Eras históricas</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">1</div>
        <div class="stat-label">Conflicto principal</div>
      </div>
    `;
  },

  renderFeaturedShips(ships) {
    const container = document.getElementById("featured-ships");
    if (!container) return;

    container.innerHTML = ships.map((ship) => Utils.renderShipCard(ship)).join("");
  },

  renderEphemerides(items) {
    const container = document.getElementById("ephemerides");
    if (!container) return;

    container.innerHTML = items
      .map(
        (item) => `
        <li class="ephemeris-item">
          <span class="ephemeris-date">${Utils.formatDate(item.date)}</span>
          <div>
            <strong>${Utils.escapeHtml(item.title)}</strong>
            <p style="font-size: var(--text-sm); color: var(--color-text-muted); margin-top: var(--space-1);">${Utils.escapeHtml(item.description)}</p>
          </div>
        </li>
      `
      )
      .join("");
  },
};

document.addEventListener("DOMContentLoaded", () => HomePage.init());
