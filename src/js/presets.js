import { state } from "./state.js";
import { renderAll } from "./ui.js";
import { savePreset, loadPresets, deletePreset } from "./storage.js";

export function initPresets() {
  const presetSelect = document.getElementById("presetSelect");
  const savePresetBtn = document.getElementById("savePreset");
  const deletePresetBtn = document.getElementById("deletePreset");

  // Load presets into dropdown
  function refreshPresetsList() {
    const presets = loadPresets();
    const currentValue = presetSelect.value;
    
    // Clear existing options except "Custom..."
    presetSelect.innerHTML = '<option value="">Custom...</option>';
    
    // Add preset options
    Object.keys(presets).sort().forEach(name => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      presetSelect.appendChild(option);
    });
    
    // Restore selection if it still exists
    if (currentValue && presets[currentValue]) {
      presetSelect.value = currentValue;
    }
  }

  // Load preset
  presetSelect.addEventListener("change", () => {
    const name = presetSelect.value;
    if (!name) return;
    
    const presets = loadPresets();
    const preset = presets[name];
    if (!preset) return;
    
    state.background.type = preset.type;
    state.background.angle = preset.angle;
    state.background.stops = JSON.parse(JSON.stringify(preset.stops));
    state.ui.activeStopId = preset.stops[0]?.id || "a";
    
    // Update UI
    const angleRange = document.getElementById("angle");
    const typeGroup = document.getElementById("gradientType");
    const angleField = document.getElementById("angleField");
    
    if (angleRange) angleRange.value = String(preset.angle);
    if (angleField) angleField.style.display = preset.type === "linear" ? "" : "none";
    
    if (typeGroup) {
      typeGroup.querySelectorAll(".chip").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.type === preset.type);
      });
    }
    
    // Rebuild gradient controls
    const event = new CustomEvent("preset-loaded");
    document.dispatchEvent(event);
    
    renderAll(true);
  });

  // Save preset
  savePresetBtn.addEventListener("click", () => {
    const name = prompt("Enter a name for this gradient preset:");
    if (!name || !name.trim()) return;
    
    const trimmedName = name.trim();
    if (savePreset(trimmedName, state.background)) {
      refreshPresetsList();
      presetSelect.value = trimmedName;
      alert(`Preset "${trimmedName}" saved!`);
    } else {
      alert("Failed to save preset. Please try again.");
    }
  });

  // Delete preset
  deletePresetBtn.addEventListener("click", () => {
    const name = presetSelect.value;
    if (!name) {
      alert("Please select a preset to delete.");
      return;
    }
    
    if (!confirm(`Delete preset "${name}"?`)) return;
    
    if (deletePreset(name)) {
      refreshPresetsList();
      alert(`Preset "${name}" deleted.`);
    } else {
      alert("Failed to delete preset. Please try again.");
    }
  });

  // Initial load
  refreshPresetsList();
  
  // Add some default presets if none exist
  const presets = loadPresets();
  if (Object.keys(presets).length === 0) {
    savePreset("Sunset", {
      type: "linear",
      angle: 135,
      stops: [
        { id: "a", color: "#ff7a18", pos: 0 },
        { id: "b", color: "#ffb347", pos: 50 },
        { id: "c", color: "#ff4e50", pos: 100 }
      ]
    });
    savePreset("Ocean", {
      type: "linear",
      angle: 180,
      stops: [
        { id: "a", color: "#2193b0", pos: 0 },
        { id: "b", color: "#6dd5ed", pos: 100 }
      ]
    });
    savePreset("Purple Haze", {
      type: "radial",
      angle: 135,
      stops: [
        { id: "a", color: "#6a3093", pos: 0 },
        { id: "b", color: "#a044ff", pos: 100 }
      ]
    });
    refreshPresetsList();
  }
}
