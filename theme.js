const modeToggle = document.getElementById("modeToggle");

function initDarkMode() {
  if (!modeToggle) return;
  const isDark = localStorage.getItem("darkMode") === "true" ||
                 (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (isDark) {
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☾";
  }
}

if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark);
    modeToggle.textContent = isDark ? "☾" : "☀";
  });
}

initDarkMode();
