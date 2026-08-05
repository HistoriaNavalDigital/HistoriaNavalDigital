/**
 * HistoriaNavalDigital — Site configuration
 */
const HND = {
  siteName: "HistoriaNavalDigital",
  siteTagline: "Historia naval al alcance de todos",
  version: "0.1",

  navItems: [
    { id: "inicio", label: "Inicio", href: "index.html", icon: "🏠" },
    { id: "buques", label: "Registro de Buques", href: "buques.html", icon: "🚢" },
    { id: "eras", label: "Eras y Conflictos", href: "eras.html", icon: "⚔️" },
    { id: "naciones", label: "Naciones y Facciones", href: "naciones.html", icon: "🌍" },
    { id: "tecnologia", label: "Tecnología", href: "tecnologia.html", icon: "⚙️" },
    { id: "multimedia", label: "Archivo Multimedia", href: "multimedia.html", icon: "🖼️" },
  ],

  footerLinks: {
    explore: [
      { label: "Registro de Buques", href: "buques.html" },
      { label: "Eras y Conflictos", href: "eras.html" },
      { label: "Naciones", href: "naciones.html" },
      { label: "Tecnología", href: "tecnologia.html" },
    ],
    info: [
      { label: "Fuentes y Bibliografía", href: "fuentes.html" },
      { label: "Acerca del Proyecto", href: "acerca.html" },
    ],
  },

  shipTypes: {
    acorazado: "Acorazado",
    "crucero-batalla": "Crucero de batalla",
    portaviones: "Portaviones",
    destructor: "Destructor",
    submarino: "Submarino",
    crucero: "Crucero",
  },

  shipStatuses: {
    hundido: "Hundido",
    activo: "Activo",
    retirado: "Retirado",
    desguazado: "Desguazado",
    museo: "Buque museo",
  },

  multimediaTypes: {
    fotografia: "Fotografía",
    plano: "Plano técnico",
    mapa: "Mapa",
    ilustracion: "Ilustración",
    modelo3d: "Modelo 3D",
  },

  getAssetPath(relativePath) {
    const base = document.querySelector('meta[name="base-path"]')?.content || "";
    return `${base}${relativePath}`;
  },
};

window.HND = HND;
