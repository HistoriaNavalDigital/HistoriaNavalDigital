/**
 * HistoriaNavalDigital — Home page
 */
const HomePage = {
  async init() {
    Components.mountLayout("inicio");

    Features.loading(document.getElementById("featured-ships"));
    try {
      const [allShips, featured, ephemerides, nations, eras, conflicts] = await Promise.all([
        DataLoader.getShips(),
        DataLoader.getFeaturedShips(),
        DataLoader.getEphemerides(),
        DataLoader.getNations(),
        DataLoader.getEras(),
        DataLoader.getConflicts(),
      ]);

      this.renderStats(allShips, nations, eras, conflicts);
      const collections=await DataLoader.load("collections.json");
      document.getElementById("home-collections").innerHTML=collections.map(c=>Archive.collectionCard(c)).join("");
      document.getElementById("recent-content").innerHTML=allShips.filter(s=>s.editorialUpdated).slice(0,3).map(s=>`<a href="buque.html?id=${s.id}"><span class="eyebrow">Ficha ampliada · ${Utils.formatDate(s.editorialUpdated)}</span><strong>${Utils.escapeHtml(s.name)}</strong><span>${Utils.escapeHtml(s.role)} →</span></a>`).join("");
      this.renderFeaturedShips(featured);
      this.renderEphemerides(ephemerides);
    } catch (err) {
      Features.error(document.getElementById("featured-ships"), "No se pudo cargar la portada.");
    }
  },

  renderStats(allShips, nations, eras, conflicts) {
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
        <div class="stat-number">${eras.filter(e=>allShips.some(s=>Archive.eraMatches(s,e.id))).length}</div>
        <div class="stat-label">Eras con buques</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">${conflicts.filter(c=>allShips.some(s=>s.conflicts.includes(c.id))).length}</div>
        <div class="stat-label">Conflictos con buques</div>
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

    const today=new Date();const month=String(today.getMonth()+1).padStart(2,'0'),day=String(today.getDate()).padStart(2,'0');
    const daily=items.filter(i=>i.date.slice(5)===`${month}-${day}`),monthly=items.filter(i=>i.date.slice(5,7)===month);
    const chosen=daily.length?daily:monthly.length?monthly:[];
    if(!chosen.length){container.innerHTML='<li class="ephemeris-item"><p>No hay efemérides registradas para este mes. <a href="batallas.html">Explorar los acontecimientos navales →</a></p></li>';return;}
    container.innerHTML = chosen
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
