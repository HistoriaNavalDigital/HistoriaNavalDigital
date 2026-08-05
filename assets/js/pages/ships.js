/**
 * HistoriaNavalDigital — Ship catalog page
 */
const ShipsPage = {
  allShips: [],
  filteredShips: [],

  async init() {
    Components.mountLayout("buques");

    const sidebarEl = document.getElementById("sidebar");
    if (sidebarEl) {
      sidebarEl.innerHTML = Components.renderSidebar(
        "Categorías",
        [
          { id: "all", label: "Todos los buques", href: "buques.html" },
          { id: "acorazado", label: "Acorazados", href: "buques.html?tipo=acorazado" },
          { id: "portaviones", label: "Portaviones", href: "buques.html?tipo=portaviones" },
          { id: "destructor", label: "Destructores", href: "buques.html?tipo=destructor" },
          { id: "crucero-batalla", label: "Cruceros de batalla", href: "buques.html?tipo=crucero-batalla" },
        ],
        Utils.getQueryParam("tipo") || "all"
      );
    }

    const breadcrumbsEl = document.getElementById("breadcrumbs");
    if (breadcrumbsEl) {
      breadcrumbsEl.innerHTML = Components.renderBreadcrumbs([
        { label: "Inicio", href: "index.html" },
        { label: "Registro de Buques", href: "buques.html" },
      ]);
    }

    try {
      this.allShips = await DataLoader.getShips();
      this.setupFilters();
      this.applyFilters();
    } catch (err) {
      console.error("Error cargando buques:", err);
      document.getElementById("ships-grid").innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">⚠️</div><p>Error al cargar el catálogo de buques.</p></div>';
    }
  },

  setupFilters() {
    const searchInput = document.getElementById("search-input");
    const nationFilter = document.getElementById("filter-nation");
    const typeFilter = document.getElementById("filter-type");
    const statusFilter = document.getElementById("filter-status");

    const nations = [...new Set(this.allShips.map((s) => s.nation))];
    nations.forEach((nation) => {
      const ship = this.allShips.find((s) => s.nation === nation);
      nationFilter.innerHTML += `<option value="${nation}">${ship.nationName}</option>`;
    });

    this.urlEra = Utils.getQueryParam("era");

    const urlType = Utils.getQueryParam("tipo");
    const urlNation = Utils.getQueryParam("nacion");
    if (urlType) typeFilter.value = urlType;
    if (urlNation) nationFilter.value = urlNation;

    const debouncedSearch = Utils.debounce(() => this.applyFilters(), 250);

    searchInput.addEventListener("input", debouncedSearch);
    nationFilter.addEventListener("change", () => this.applyFilters());
    typeFilter.addEventListener("change", () => this.applyFilters());
    statusFilter.addEventListener("change", () => this.applyFilters());
  },

  applyFilters() {
    const query = document.getElementById("search-input").value.toLowerCase().trim();
    const nation = document.getElementById("filter-nation").value;
    const type = document.getElementById("filter-type").value;
    const status = document.getElementById("filter-status").value;

    this.filteredShips = this.allShips.filter((ship) => {
      const matchesQuery =
        !query ||
        ship.name.toLowerCase().includes(query) ||
        ship.summary.toLowerCase().includes(query) ||
        ship.nationName.toLowerCase().includes(query) ||
        ship.tags.some((t) => t.toLowerCase().includes(query));

      const matchesNation = !nation || ship.nation === nation;
      const matchesType = !type || ship.type === type;
      const matchesStatus = !status || ship.status === status;
      const matchesEra = !this.urlEra || ship.era === this.urlEra;

      return matchesQuery && matchesNation && matchesType && matchesStatus && matchesEra;
    });

    this.renderShips();
  },

  renderShips() {
    const grid = document.getElementById("ships-grid");
    const countEl = document.getElementById("results-count");

    countEl.textContent = `${this.filteredShips.length} buque${this.filteredShips.length !== 1 ? "s" : ""} encontrado${this.filteredShips.length !== 1 ? "s" : ""}`;

    if (this.filteredShips.length === 0) {
      grid.innerHTML =
        '<div class="empty-state"><div class="empty-state-icon">🔍</div><p>No se encontraron buques con los filtros seleccionados.</p></div>';
      return;
    }

    grid.innerHTML = this.filteredShips.map((ship) => Utils.renderShipCard(ship)).join("");
  },
};

document.addEventListener("DOMContentLoaded", () => ShipsPage.init());
