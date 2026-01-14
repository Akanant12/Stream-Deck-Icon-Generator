import { state } from "./state.js";
import { initIconPicker } from "./icons.js";
import { initGradientControls } from "./gradient.js";
import { initUiBindings, renderAll, setSelectedIcon } from "./ui.js";
import { initExport } from "./export.js";
import { initPresets } from "./presets.js";
import { initKeyboardShortcuts } from "./keyboard.js";
import { loadState, saveState } from "./storage.js";

// Load saved state
const savedState = loadState();
if (savedState) {
  Object.assign(state.background, savedState.background);
  Object.assign(state.iconStyle, savedState.iconStyle);
  Object.assign(state.export, savedState.export);
  Object.assign(state.ui, savedState.ui);
  if (savedState.icon.name) {
    state.icon.name = savedState.icon.name;
    state.icon.exportName = savedState.icon.exportName;
  }
}

// bootstrap
initUiBindings();
initIconPicker();
initGradientControls();
initExport();
initPresets();
initKeyboardShortcuts();

// Auto-save state on changes (debounced)
let saveTimeout;
const originalRenderAll = renderAll;
window.addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => saveState(state), 500);
});

// if icon is already set (from localStorage), reload it
if (state.icon.name) {
  // Icon will be loaded from cache when picker opens
  const iconNameInput = document.getElementById("iconNameInput");
  const selectedIconName = document.getElementById("selectedIconName");
  const selectedIconHint = document.getElementById("selectedIconHint");
  
  if (iconNameInput) iconNameInput.value = state.icon.exportName || state.icon.name;
  if (selectedIconName) selectedIconName.textContent = state.icon.name;
  if (selectedIconHint) selectedIconHint.textContent = "Cached";
}

renderAll(true);

