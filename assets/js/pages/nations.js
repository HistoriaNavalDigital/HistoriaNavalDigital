const NationsPage = {
  async init() {
    Components.mountLayout('naciones');
    document.getElementById('breadcrumbs').innerHTML = Components.renderBreadcrumbs([{label:'Inicio',href:'index.html'},{label:'Naciones y armadas'}]);
    Features.loading(document.getElementById('nations-grid'));
    try { const [nations,ships] = await Promise.all([DataLoader.getNations(),DataLoader.getShips()]); this.renderNations(nations,ships); }
    catch { Features.error(document.getElementById('nations-grid')); }
  },
  renderNations(nations,ships) {
    document.getElementById('nations-grid').innerHTML = nations.map(nation => {
      const records=ships.filter(s=>s.nation===nation.id),photo=records.find(s=>s.image);
      const navy={'alemania':'Kriegsmarine','japon':'Armada Imperial Japonesa','estados-unidos':'United States Navy','reino-unido':'Royal Navy'}[nation.id]||'Armada';
      return `<article class="nation-card">
        <div class="nation-banner">${photo?Features.image(photo.image,photo.name):''}<span class="nation-period">${Utils.escapeHtml(nation.period)}</span></div>
        <div class="nation-body"><header class="nation-heading"><img class="nation-flag" src="${HND.getAssetPath('assets/images/flags/'+nation.id+'.svg')}" width="60" height="36" alt=""><div><h2>${Utils.escapeHtml(nation.name)}</h2><p class="nation-navy">${Utils.escapeHtml(navy)}</p></div><span class="nation-count">${records.length}<small>buques</small></span></header>
        <p class="nation-summary">${Utils.escapeHtml(nation.navalDoctrine)}</p>
        <details class="nation-context"><summary>Contexto histórico</summary><p>${Utils.escapeHtml(nation.description)}</p><p><strong>Tipos principales:</strong> ${nation.keyShipTypes.map(t=>Utils.escapeHtml(t)).join(', ')}.</p></details>
        <div class="nation-ships"><span class="eyebrow">En el archivo</span><div>${records.map(s=>`<a href="${HND.getAssetPath('buque.html')}?id=${encodeURIComponent(s.id)}">${Utils.escapeHtml(s.name)} <span aria-hidden="true">↗</span></a>`).join('')}</div></div>
        <a href="${HND.getAssetPath('buques.html')}?nacion=${encodeURIComponent(nation.id)}" class="btn btn-outline nation-catalog">Explorar ${records.length} buque${records.length===1?'':'s'} →</a></div>
      </article>`;
    }).join('');
  }
};
document.addEventListener('DOMContentLoaded',()=>NationsPage.init());
