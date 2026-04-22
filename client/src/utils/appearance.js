export function applyAppearance({ theme = "light", persist = true }) {
  const normalizedTheme = theme === "dark" ? "dark" : "light";

  document.documentElement.dataset.theme = normalizedTheme;
  document.documentElement.classList.toggle("dark", normalizedTheme === "dark");
  document.documentElement.lang = "en";

  if (persist) {
    localStorage.setItem("venusflow_theme", normalizedTheme);
  }
}
