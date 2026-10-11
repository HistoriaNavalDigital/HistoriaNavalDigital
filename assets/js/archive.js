/** Connections between records, editorial collections and reading aids. */
const Archive = {
  escape: value => Utils.escapeHtml(value || ''),
  eraMatches: (ship,id) => (ship.eraIds || [ship.era]).includes(id),
  specGroups: ship => ship.specGroups || [{title:'Características',keys:Object.keys(ship.specs)}],
  specs(ship) {
    return this.specGroups(ship).filter(g=>g.keys.length).map(g=>`<tbody><tr class="spec-group"><th colspan="2" scope="colgroup">${this.escape(g.title)}</th></tr>${g.keys.map(k=>`<tr><th scope="row">${this.escape(k.charAt(0).toUpperCase()+k.slice(1))}</th><td>${this.escape(ship.specs[k])}</td></tr>`).join('')}</tbody>`).join('');
  },
  collectionCard(c) { return `<a class="collection-card" href="${HND.getAssetPath('coleccion.html')}?id=${encodeURIComponent(c.id)}">${Features.image(c.image,c.name)}<div><span class="eyebrow">Recorrido temático</span><h3>${this.escape(c.name)}</h3><p>${this.escape(c.summary)}</p><span class="card-read">Explorar la colección →</span></div></a>`; },
  battleCards(items) {return items.map(b=>`<article class="battle-card"><span class="eyebrow">${this.escape(b.kind||'Acontecimiento')} · ${Utils.formatDate(b.date)}</span><h3><a href="${HND.getAssetPath('batalla.html')}?id=${encodeURIComponent(b.id)}">${this.escape(b.name)}</a></h3><p>${this.escape(b.summary)}</p><a href="${HND.getAssetPath('batalla.html')}?id=${encodeURIComponent(b.id)}">Seguir la historia →</a><button class="text-button" data-favorite="battle:${b.id}" aria-pressed="${Features.isFavorite('battle:'+b.id)}">${Features.isFavorite('battle:'+b.id)?'♥ Guardado':'♡ Guardar'}</button></article>`).join('');},
  glossary(term,label=term) {return `<a class="glossary-link" href="${HND.getAssetPath('glosario.html')}#${encodeURIComponent(term)}">${this.escape(label)}</a>`;},
  related(ship,battles,technology,collections) {
    const events=battles.filter(b=>b.shipIds.includes(ship.id));
    const tech=technology.filter(t=>(t.shipIds||[]).includes(ship.id));
    const routes=collections.filter(c=>c.shipIds.includes(ship.id));
    return `<section class="content-section" id="conexiones"><h2>Continúa explorando</h2>${events.length?`<h3>Su contexto operativo</h3><div class="battle-grid">${this.battleCards(events)}</div>`:''}<h3>Comprender su tecnología</h3><div class="related-links">${tech.map(t=>`<a href="${HND.getAssetPath('tecnologia.html')}#tech-${t.id}">${this.escape(t.name)} →</a>`).join('')}<a href="${HND.getAssetPath('glosario.html')}">Glosario naval →</a></div>${routes.length?`<h3>Recorridos relacionados</h3><div class="collection-grid">${routes.map(c=>this.collectionCard(c)).join('')}</div>`:''}</section>`;
  }
};
window.Archive=Archive;
