import { state } from "./state.js";
import { drawToCanvas } from "./ui.js";

export function initExport() {
  const exportBtn = document.getElementById("exportBtn");
  const batchExportBtn = document.getElementById("batchExportBtn");
  const copyBtn = document.getElementById("copyToClipboard");

  exportBtn.addEventListener("click", async () => {
    if (!state.icon.svgText) {
      alert("Please select an icon first!");
      return;
    }
    
    const size = state.export.size;
    try {
      drawToCanvas(size);
      await exportImage(size);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  });
  
  if (batchExportBtn) {
    batchExportBtn.addEventListener("click", async () => {
      if (!state.icon.svgText) {
        alert("Please select an icon first!");
        return;
      }
      
      const sizes = [72, 144, 256];
      const iconName = state.icon.exportName || state.icon.name || "streamdeck-icon";
      
      batchExportBtn.disabled = true;
      batchExportBtn.textContent = "Exporting...";
      
      try {
        for (const size of sizes) {
          drawToCanvas(size);
          await exportImage(size);
          // Small delay between exports
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        alert(`Exported ${sizes.length} sizes successfully!`);
      } catch (err) {
        console.error("Batch export failed:", err);
        alert("Batch export failed. Some files may not have been exported.");
      } finally {
        batchExportBtn.disabled = false;
        batchExportBtn.textContent = "Export All Sizes";
        // Restore original size
        drawToCanvas(state.export.size);
      }
    });
  }
  
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      if (!state.icon.svgText) {
        alert("Please select an icon first!");
        return;
      }
      
      try {
        const canvas = document.getElementById("canvas");
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, "image/png");
        });
        
        if (!blob) throw new Error("Failed to create blob");
        
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob })
        ]);
        
        // Visual feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✓ Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error("Copy failed:", err);
        alert("Failed to copy to clipboard. Your browser may not support this feature.");
      }
    });
  }
}

async function exportImage(size) {
  const canvas = document.getElementById("canvas");
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to create image blob"));
        return;
      }
      resolve(blob);
    }, "image/png");
  });

  const iconName = (state.icon.exportName && state.icon.exportName.trim()) || 
                   state.icon.name || 
                   "streamdeck-icon";
  const fileName = `streamdeck-${iconName}-${size}.png`;

  // Try using File System Access API for save location picker
  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'PNG Image',
          accept: { 'image/png': ['.png'] }
        }]
      });
      
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return;
    } catch (err) {
      // User cancelled - don't download
      if (err.name === 'AbortError') {
        return;
      }
      // API error - fall back to regular download
      console.warn('File System Access API failed:', err);
    }
  }
  
  // Fallback: regular download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
