/**
 * HistoriaNavalDigital — Theme (dark/light mode)
 */
const Theme = {
  STORAGE_KEY: "hnd-theme",

  init() {
    let saved; try { saved = localStorage.getItem(this.STORAGE_KEY); } catch {}
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = ["dark", "light"].includes(saved) ? saved : (prefersDark ? "dark" : "light");
    this.setTheme(theme);
    this.bindToggle();
  },

  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(this.STORAGE_KEY, theme); } catch {}
    this.updateToggleIcon(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    this.setTheme(current === "dark" ? "light" : "dark");
  },

  updateToggleIcon(theme) {
    const btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️" : "🌙";
      btn.setAttribute("aria-label", theme === "dark" ? "Activar modo claro" : "Activar modo oscuro");
    }
  },

  bindToggle() {
    document.querySelectorAll(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => this.toggle());
    });
  },
};

window.Theme = Theme;
