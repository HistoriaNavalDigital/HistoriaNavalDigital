/**
 * HistoriaNavalDigital — Data loading utilities
 */
const DataLoader = {
  _cache: {},
  _pending: {},

  async load(filename) {
    if (this._cache[filename]) {
      return this._cache[filename];
    }

    if (this._pending[filename]) return this._pending[filename];
    this._pending[filename] = this._fetch(filename);
    try { return await this._pending[filename]; } finally { delete this._pending[filename]; }
  },
  async _fetch(filename) {
    const path = HND.getAssetPath(`assets/data/${filename}`);
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`Error al cargar ${filename}: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data)) throw new Error(`Formato inválido: ${filename}`);
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
    return ships.filter((s) => (s.eraIds||[s.era]).includes(eraId));
  },

  async getShipsByConflict(conflictId) {
    const ships = await this.getShips();
    return ships.filter((s) => s.conflicts.includes(conflictId));
  },
};

window.DataLoader = DataLoader;
