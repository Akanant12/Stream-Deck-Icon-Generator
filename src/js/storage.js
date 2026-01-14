// LocalStorage state persistence

const STORAGE_KEY = "streamdeck-icon-gen-state";

export function saveState(state) {
  try {
    const toSave = {
      icon: {
        name: state.icon.name,
        exportName: state.icon.exportName,
        // Don't save svgText, reload from cache
      },
      background: state.background,
      iconStyle: state.iconStyle,
      export: state.export,
      ui: {
        zoom: state.ui.zoom,
        activeStopId: state.ui.activeStopId
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn("Failed to save state:", err);
  }
}

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved);
  } catch (err) {
    console.warn("Failed to load state:", err);
    return null;
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Failed to clear state:", err);
  }
}

// Preset management
const PRESETS_KEY = "streamdeck-icon-gen-presets";

export function savePreset(name, gradient) {
  try {
    const presets = loadPresets();
    presets[name] = {
      type: gradient.type,
      angle: gradient.angle,
      stops: JSON.parse(JSON.stringify(gradient.stops)) // deep clone
    };
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    return true;
  } catch (err) {
    console.warn("Failed to save preset:", err);
    return false;
  }
}

export function loadPresets() {
  try {
    const saved = localStorage.getItem(PRESETS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (err) {
    console.warn("Failed to load presets:", err);
    return {};
  }
}

export function deletePreset(name) {
  try {
    const presets = loadPresets();
    delete presets[name];
    localStorage.setItem(PRESETS_KEY, JSON.stringify(presets));
    return true;
  } catch (err) {
    console.warn("Failed to delete preset:", err);
    return false;
  }
}
