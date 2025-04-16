const body = document.body;
const button = document.querySelector(".theme-button");

function setTheme(theme) {
    body.className = theme;
}

button.addEventListener("click", () => {
    const currentTheme = body.classList.contains("dark-theme") ? "light-theme" : "dark-theme";
    setTheme(currentTheme);
});
