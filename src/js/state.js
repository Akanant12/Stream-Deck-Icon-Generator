export const state = {
  icon: {
    name: null,
    svgText: null,
    exportName: ""
  },

  background: {
    type: "linear", // "linear" | "radial"
    angle: 135,
    stops: [
      { id: "a", color: "#ff7a18", pos: 0 },
      { id: "b", color: "#ffb347", pos: 50 },
      { id: "c", color: "#44B0B9", pos: 100 }
    ]
  },

  iconStyle: {
    color: "#ffffff",
    sizePct: 44,     // percentage of tile (approx)
    yOffsetPct: 0    // percentage of tile
  },

  export: {
    size: 256,
    radius: 18
  },

  ui: {
    activeStopId: "b",
    zoom: 1
  }
};
