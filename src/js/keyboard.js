// Keyboard shortcuts

import { state } from "./state.js";
import { renderAll } from "./ui.js";

export function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Ignore if typing in input
    if (e.target.matches("input, textarea, select")) return;
    
    const modal = document.getElementById("iconModal");
    const isModalOpen = modal?.dataset.open === "true";
    
    // Ctrl/Cmd + E - Export
    if ((e.ctrlKey || e.metaKey) && e.key === "e") {
      e.preventDefault();
      document.getElementById("exportBtn")?.click();
      return;
    }
    
    // Ctrl/Cmd + I - Open icon picker
    if ((e.ctrlKey || e.metaKey) && e.key === "i") {
      e.preventDefault();
      if (!isModalOpen) {
        document.getElementById("openIconPicker")?.click();
      }
      return;
    }
    
    // Ctrl/Cmd + R - Reset
    if ((e.ctrlKey || e.metaKey) && e.key === "r") {
      e.preventDefault();
      document.getElementById("resetAll")?.click();
      return;
    }
    
    // Arrow keys to adjust active gradient stop position
    if (!isModalOpen && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      const activeStop = state.background.stops.find(s => s.id === state.ui.activeStopId);
      if (activeStop) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        const change = e.key === "ArrowRight" ? delta : -delta;
        activeStop.pos = Math.max(0, Math.min(100, activeStop.pos + change));
        
        // Update UI
        const stopPos = document.getElementById("stopPos");
        if (stopPos) stopPos.value = String(activeStop.pos);
        
        renderAll(true);
        
        // Update gradient bar
        const event = new CustomEvent("gradient-updated");
        document.dispatchEvent(event);
      }
    }
    
    // Plus/Minus to adjust icon size
    if (!isModalOpen && (e.key === "+" || e.key === "=")) {
      e.preventDefault();
      state.iconStyle.sizePct = Math.min(80, state.iconStyle.sizePct + 1);
      const iconSize = document.getElementById("iconSize");
      if (iconSize) iconSize.value = String(state.iconStyle.sizePct);
      renderAll();
    }
    
    if (!isModalOpen && (e.key === "-" || e.key === "_")) {
      e.preventDefault();
      state.iconStyle.sizePct = Math.max(20, state.iconStyle.sizePct - 1);
      const iconSize = document.getElementById("iconSize");
      if (iconSize) iconSize.value = String(state.iconStyle.sizePct);
      renderAll();
    }
    
    // Up/Down to adjust icon offset
    if (!isModalOpen && e.key === "ArrowUp") {
      e.preventDefault();
      state.iconStyle.yOffsetPct = Math.max(-30, state.iconStyle.yOffsetPct - 1);
      const iconOffset = document.getElementById("iconOffset");
      if (iconOffset) iconOffset.value = String(state.iconStyle.yOffsetPct);
      renderAll();
    }
    
    if (!isModalOpen && e.key === "ArrowDown") {
      e.preventDefault();
      state.iconStyle.yOffsetPct = Math.min(30, state.iconStyle.yOffsetPct + 1);
      const iconOffset = document.getElementById("iconOffset");
      if (iconOffset) iconOffset.value = String(state.iconStyle.yOffsetPct);
      renderAll();
    }
  });
  
  // Update gradient bar when stops change via keyboard
  document.addEventListener("gradient-updated", () => {
    const gradBar = document.getElementById("gradBar");
    if (!gradBar) return;
    
    const active = state.ui.activeStopId;
    for (const s of state.background.stops) {
      const el = gradBar.querySelector(`.stop[data-id="${s.id}"]`);
      if (!el) continue;
      el.style.left = `${s.pos}%`;
      el.title = `${s.color} @ ${s.pos}%`;
    }
  });
}
