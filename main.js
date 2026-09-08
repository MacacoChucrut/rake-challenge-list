import { renderList } from "./pages/list.js";
import { renderLevel } from "./pages/level.js";
import { renderStatsViewer } from "./pages/stats_viewer.js";

const statsViewerBtn = document.getElementById("nav-stats-viewer");
const content = document.getElementById("content");
const DEFAULT_LIST = "demonlist";

function router() {
    const path = location.hash.replace(/^#\/?/, ""); 
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
        location.hash = `#/${DEFAULT_LIST}`;
        return;
    }

    const listName = segments[0];
    const view = segments[1] || "list";
    const param = segments[2];

    if (statsViewerBtn) {
        statsViewerBtn.href = `#/${listName}/stats_viewer`;
    }

    switch (view) {
        case "list":
            renderList(content, listName);
            break;

        case "stats_viewer":
            renderStatsViewer(content, listName);
            break;

        case "level":
            if (param) {
                renderLevel(content, listName, param);
            } else {
                renderList(content, listName);
            }
            break;

        default:
            renderList(content, listName);
            break;
    }
}

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

const STORAGE_KEY = "theme-preference";
const root = document.documentElement;

const themes = ["light", "dark"];

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getSavedTheme() {
    try {
        return localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function applyTheme(theme, save = true) {
    if (!themes.includes(theme)) {
        theme = "light";
    }

    root.setAttribute("data-theme", theme);

    if (save) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {}
    }
}

function getNextTheme() {
    const current = root.getAttribute("data-theme") || "light";
    const currentIndex = themes.indexOf(current);

    return themes[(currentIndex + 1) % themes.length];
}

const savedTheme = getSavedTheme();

applyTheme(savedTheme || getSystemTheme(), false);

document.getElementById("theme-toggle")?.addEventListener("click", () => {
    applyTheme(getNextTheme());
});