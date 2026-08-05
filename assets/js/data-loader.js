/**
 * HistoriaNavalDigital — Data loading utilities
 */
const DataLoader = {
  _cache: {},

  async load(filename) {
    if (this._cache[filename]) {
      return this._cache[filename];
    }

    const path = HND.getAssetPath(`assets/data/${filename}`);
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Error al cargar ${filename}: ${response.status}`);
    }

    const data = await response.json();
    this._cache[filename] = data;
    return data;
  },

  async getShips() {
    return this.load("ships.json");
  },

  async getShip(id) {
    const ships = await this.getShips();
    return ships.find((s) => s.id === id) || null;
  },

  async getNations() {
    return this.load("nations.json");
  },

  async getEras() {
    return this.load("eras.json");
  },

  async getConflicts() {
    return this.load("conflicts.json");
  },

  async getTechnology() {
    return this.load("technology.json");
  },

  async getMultimedia() {
    return this.load("multimedia.json");
  },

  async getEphemerides() {
    return this.load("ephemerides.json");
  },

  async getFeaturedShips() {
    const ships = await this.getShips();
    return ships.filter((s) => s.featured);
  },

  async getShipsByNation(nationId) {
    const ships = await this.getShips();
    return ships.filter((s) => s.nation === nationId);
  },

  async getShipsByEra(eraId) {
    const ships = await this.getShips();
    return ships.filter((s) => s.era === eraId);
  },

  async getShipsByConflict(conflictId) {
    const ships = await this.getShips();
    return ships.filter((s) => s.conflicts.includes(conflictId));
  },
};

window.DataLoader = DataLoader;
