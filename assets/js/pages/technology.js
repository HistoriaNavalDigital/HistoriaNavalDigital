const TechnologyPage = {
  async init() {
    Components.mountLayout('tecnologia');
    document.getElementById('breadcrumbs').innerHTML=Components.renderBreadcrumbs([{label:'Inicio',href:'index.html'},{label:'Tecnología y construcción'}]);
    Features.loading(document.getElementById('technology-sections'));
    try { const [items,ships]=await Promise.all([DataLoader.getTechnology(),DataLoader.getShips()]);this.renderTechnology(items,ships);window.addEventListener('hashchange',()=>this.openTarget());this.openTarget(); }
    catch { Features.error(document.getElementById('technology-sections')); }
  },
  renderTechnology(items,ships) {
    const explanations={
      propulsion:{title:'Cómo se convierte el calor en movimiento',steps:[['Caldera','Genera vapor.'],['Turbina','El vapor hace girar el rotor.'],['Eje','Transmite el giro.'],['Hélice','Impulsa el buque en el agua.']],flow:true},
      armamento:{title:'Sistemas que cumplen funciones distintas',steps:[['Artillería principal','Combate contra objetivos de superficie.'],['Batería secundaria','Complementa el armamento principal.'],['Defensa antiaérea','Responde a amenazas aéreas.'],['Control de tiro','Ayuda a dirigir el fuego.']]},
      blindaje:{title:'Protección de las zonas vitales',steps:[['Cinturón','Protege los costados.'],['Cubierta','Protege desde arriba.'],['Compartimentos','Limitan la extensión de inundaciones.'],['Zonas vitales','Máquinas y depósitos de munición.']]},
      'aviacion-naval':{title:'Operaciones desde un portaviones',steps:[['Despegue','Salida de las aeronaves.'],['Misión','Reconocimiento o combate.'],['Regreso','Aproximación al buque.'],['Recuperación','Aterrizaje en cubierta.']],flow:true}
    };
    document.getElementById('technology-sections').innerHTML=items.map((item,index)=>{
      const explain=explanations[item.id]||item.explainer;
      return `<article class="tech-section" id="topic-${item.id}"><div class="tech-header" role="button" tabindex="0" aria-expanded="${location.hash?'#tech-'+item.id===location.hash:index===0}" aria-controls="tech-${item.id}" data-tech-id="${item.id}"><div class="tech-title-group"><span class="tech-number">0${index+1}</span><div><span class="tech-category">${Utils.escapeHtml(item.category)}</span><h2>${Utils.escapeHtml(item.name)}</h2></div></div><span class="tech-toggle" aria-hidden="true">${(location.hash?'#tech-'+item.id===location.hash:index===0)?'−':'+'}</span></div>
      <div id="tech-${item.id}" class="tech-body" style="display:${(location.hash?'#tech-'+item.id===location.hash:index===0)?'block':'none'}"><p class="tech-intro">${Utils.escapeHtml(item.description)}</p><section class="tech-explainer" aria-label="${Utils.escapeHtml(explain.title)}"><h3>${Utils.escapeHtml(explain.title)}</h3><ol class="tech-steps ${explain.flow?'is-flow':''}">${explain.steps.map(([title,text],n)=>`<li><span class="step-number">${String(n+1).padStart(2,'0')}</span><strong>${Utils.escapeHtml(title)}</strong><p>${Utils.escapeHtml(text)}</p></li>`).join('')}</ol></section>
      <div class="tech-topics">${item.topics.map(t=>`<section class="tech-topic"><span class="tech-topic-period">${Utils.escapeHtml(t.period)}</span><h3>${Utils.escapeHtml(t.title)}</h3><p>${Utils.escapeHtml(t.detail)}</p></section>`).join('')}</div>
      <div class="tech-examples"><span class="eyebrow">${item.shipIds?.length?'Explorar en el archivo':'Comprender los términos'}</span><div>${(item.shipIds||[]).map(id=>{const ship=ships.find(s=>s.id===id);return ship?`<a class="example-ship" href="buque.html?id=${encodeURIComponent(id)}">${Features.image(ship.image,ship.name)}<span>${Utils.escapeHtml(ship.name)}<small>${Utils.escapeHtml(ship.className||ship.typeName)}</small></span><span aria-hidden="true">↗</span></a>`:'';}).join('')}${!item.shipIds?.length?'<a href="glosario.html">Abrir el glosario naval →</a>':''}</div></div>${item.sources?.length?`<details class="tech-sources"><summary>Documentación y lectura adicional</summary>${Features.sources(item.sources)}</details>`:''}</div></article>`;
    }).join('');
    document.querySelectorAll('.tech-header').forEach(header=>{header.addEventListener('click',()=>this.toggleSection(header));header.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();this.toggleSection(header);}});});
  },
  openTarget(){const id=location.hash.slice(1);const body=document.getElementById(id);if(body?.classList.contains('tech-body')){const header=body.previousElementSibling;if(header.getAttribute('aria-expanded')!=='true')this.toggleSection(header);body.scrollIntoView?.({block:'start'});}},
  toggleSection(header) { const open=header.getAttribute('aria-expanded')==='true';header.setAttribute('aria-expanded',String(!open));header.nextElementSibling.style.display=open?'none':'block';header.querySelector('.tech-toggle').textContent=open?'+':'−'; }
};
document.addEventListener('DOMContentLoaded',()=>TechnologyPage.init());
