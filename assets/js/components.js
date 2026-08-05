/**
 * HistoriaNavalDigital — Shared UI components
 */
const Components = {
  renderHeader(activePage = "") {
    const base = document.querySelector('meta[name="base-path"]')?.content || "";
    const navLinks = HND.navItems
      .map(
        (item) =>
          `<li><a href="${base}${item.href}" class="${item.id === activePage ? "active" : ""}">${item.label}</a></li>`
      )
      .join("");

    return `
      <header class="site-header" role="banner">
        <div class="header-inner">
          <a href="${base}index.html" class="site-logo">
            <span class="logo-icon" aria-hidden="true">⚓</span>
            <span class="logo-text">
              HistoriaNavalDigital
              <span>Historia naval al alcance de todos</span>
            </span>
          </a>
          <nav class="main-nav" role="navigation" aria-label="Navegación principal">
            <ul>${navLinks}</ul>
          </nav>
          <div class="header-actions">
            <button class="theme-toggle" aria-label="Cambiar tema">🌙</button>
            <button class="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    `;
  },

  renderFooter() {
    const base = document.querySelector('meta[name="base-path"]')?.content || "";
    const year = new Date().getFullYear();

    const exploreLinks = HND.footerLinks.explore
      .map((l) => `<li><a href="${base}${l.href}">${l.label}</a></li>`)
      .join("");

    const infoLinks = HND.footerLinks.info
      .map((l) => `<li><a href="${base}${l.href}">${l.label}</a></li>`)
      .join("");

    return `
      <footer class="site-footer" role="contentinfo">
        <div class="footer-inner">
          <div class="footer-brand">
            <h3>HistoriaNavalDigital</h3>
            <p>Plataforma digital dedicada a la recopilación, organización y divulgación de la historia naval mediante información de buques, conflictos, naciones y evolución tecnológica.</p>
          </div>
          <div class="footer-section">
            <h4>Explorar</h4>
            <ul>${exploreLinks}</ul>
          </div>
          <div class="footer-section">
            <h4>Información</h4>
            <ul>${infoLinks}</ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; ${year} HistoriaNavalDigital — Versión ${HND.version}. Contenido con fines educativos.</p>
        </div>
      </footer>
    `;
  },

  renderBreadcrumbs(items) {
    const base = document.querySelector('meta[name="base-path"]')?.content || "";
    const parts = items.map((item, i) => {
      const isLast = i === items.length - 1;
      if (isLast) {
        return `<span class="breadcrumb-current" aria-current="page">${Utils.escapeHtml(item.label)}</span>`;
      }
      return `<a href="${base}${item.href}">${Utils.escapeHtml(item.label)}</a>`;
    });

    return `
      <nav class="breadcrumbs" aria-label="Ruta de navegación">
        ${parts.join('<span class="breadcrumb-separator" aria-hidden="true">›</span>')}
      </nav>
    `;
  },

  renderSidebar(title, links, activeId = "") {
    const base = document.querySelector('meta[name="base-path"]')?.content || "";
    const linkItems = links
      .map(
        (link) =>
          `<li><a href="${base}${link.href}" class="${link.id === activeId ? "active" : ""}">${Utils.escapeHtml(link.label)}</a></li>`
      )
      .join("");

    return `
      <aside class="sidebar" role="complementary">
        <nav class="sidebar-nav" aria-label="${Utils.escapeHtml(title)}">
          <div class="sidebar-title">${Utils.escapeHtml(title)}</div>
          <ul>${linkItems}</ul>
        </nav>
      </aside>
    `;
  },

  mountLayout(activePage = "") {
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");

    if (headerEl) headerEl.innerHTML = this.renderHeader(activePage);
    if (footerEl) footerEl.innerHTML = this.renderFooter();

    Theme.init();
    Navigation.init();
  },
};

window.Components = Components;
