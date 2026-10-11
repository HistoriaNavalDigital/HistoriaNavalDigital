/** Technical chapters with continuous prose and visible documentary references. */
const TechnologyPage = {
  async init() {
    Components.mountLayout('tecnologia');
    document.getElementById('breadcrumbs').innerHTML=Components.renderBreadcrumbs([{label:'Inicio',href:'index.html'},{label:'Tecnología y construcción'}]);
    Features.loading(document.getElementById('technology-sections'));
    try {
      const [items,ships,media]=await Promise.all([DataLoader.getTechnology(),DataLoader.getShips(),DataLoader.getMultimedia()]);
      this.media=media;
      this.renderTechnology(items,ships);
      window.addEventListener('hashchange',()=>this.openTarget());
      this.openTarget();
    } catch {Features.error(document.getElementById('technology-sections'));}
  },
  renderTechnology(items,ships) {
    document.getElementById('technology-sections').innerHTML=items.map((item,index)=>{
      const expanded=location.hash?'#tech-'+item.id===location.hash:index===0;
      const examples=(item.shipIds||[]).map(id=>ships.find(s=>s.id===id)).filter(Boolean);
      return `<article class="tech-section" id="topic-${item.id}">
        <div class="tech-header" role="button" tabindex="0" aria-expanded="${expanded}" aria-controls="tech-${item.id}" data-tech-id="${item.id}">
          <div class="tech-title-group"><span class="tech-number">${String(index+1).padStart(2,'0')}</span><div><span class="tech-category">${Utils.escapeHtml(item.category)}</span><h2>${Utils.escapeHtml(item.name)}</h2></div></div>
          <span class="tech-toggle" aria-hidden="true">${expanded?'−':'+'}</span>
        </div>
        <div id="tech-${item.id}" class="tech-body" style="display:${expanded?'block':'none'}">
          <p class="tech-intro">${Utils.escapeHtml(item.description)}</p>
          <div class="tech-explainer tech-document">${(item.sections||[]).map(section=>`<section class="tech-document-section" id="${Utils.escapeHtml(section.id)}"><h3>${Utils.escapeHtml(section.title)}</h3>${section.paragraphs.map(text=>`<p>${Utils.escapeHtml(text)}</p>`).join('')}</section>`).join('')}</div>
          ${this.visuals(item)}<p class="tech-scope">${Utils.escapeHtml(item.scopeNote)}</p>
          ${examples.length?`<section class="tech-examples"><h3>Buques relacionados</h3><div>${examples.map(ship=>`<a class="example-ship" href="buques/${encodeURIComponent(ship.id)}.html">${Features.image(ship.image,ship.name)}<span>${Utils.escapeHtml(ship.name)}<small>${Utils.escapeHtml(ship.className||ship.typeName)}</small></span><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`:''}
          <section class="tech-references"><h3>Fuentes y bibliografía</h3>${Features.reference('tecnologia-'+item.id)}<p><a href="glosario.html">Glosario de términos navales →</a></p></section>
        </div>
      </article>`;
    }).join('');
    document.querySelectorAll('.tech-header').forEach(header=>{
      header.addEventListener('click',()=>this.toggleSection(header));
      header.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();this.toggleSection(header);}});
    });
  },
  visuals(item) {
    const ids={propulsion:['uss-fletcher-archive-4'],armamento:['belfast-archive-3'],blindaje:['monitor-archive-4'],'aviacion-naval':['uss-enterprise-archive-1'],radar:['uss-fletcher-archive-3']};
    const images=(this.media||[]).filter(m=>(ids[item.id]||[]).includes(m.id));
    return images.length?`<section class="content-section"><h3>Documentación visual</h3><div class="gallery-grid">${Features.gallery(images)}</div></section>`:'';
  },
  openTarget() {
    const body=document.getElementById(location.hash.slice(1));
    if(body?.classList.contains('tech-body')) {
      const header=body.previousElementSibling;
      if(header.getAttribute('aria-expanded')!=='true')this.toggleSection(header);
      header.scrollIntoView?.({block:'start'});
    }
  },
  toggleSection(header) {
    const expanded=header.getAttribute('aria-expanded')==='true';
    header.setAttribute('aria-expanded',String(!expanded));
    header.nextElementSibling.style.display=expanded?'none':'block';
    header.querySelector('.tech-toggle').textContent=expanded?'＋':'−';
  }
};
document.addEventListener('DOMContentLoaded',()=>TechnologyPage.init());
