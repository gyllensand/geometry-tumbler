export interface Theme {
  theme: "light" | "dark";
  colors: string[];
}

export const DEFAULT_BPM = 110;

export const RING_SEGMENTS = 80;

export const EFFECTS = [0, 1];

export const SHAPES = new Array(31).fill(null).map((o, i) => (i < 30 ? 0 : 1));
export const SHAPE_COUNT = [20, 25, 30, 35, 40];
export const SHAPE_METALNESS = [0.5, 0.75];
export const SHAPE_ROUGHNESS = [0.75, 1];

export const AMBIENT_LIGHT_INTENSITY = [1.5, 2];
export const POINT_LIGHT_INTENSITY = [0.5, 0.7, 0.9];
export const SPOT_LIGHT_INTENSITY = [0.4, 0.6];

export const BG_COLORS = [
  "#A2CCB6",
  "#FCEEB5",
  "#EE786E",
  "#e0feff",
  "lightpink",
  "lightblue",
];

export const COLORS = [
  "#ffffff",
  "#e0feff",
  "#cccccc",
  "#FCEEB5",
  "#ffce00",
  "#eb3434",
  "#30f8a0",
  "#A2CCB6",
  "lightpink",
  "#f97b9c",
  "#EE786E",
  "#fe7418",
  "lightblue",
  "#00f7fb",
  "#497fff",
  "#344df2",
  "#dc0fc0",
  "#75007e",
  "#aa4807",
  "#800b0b",
  "#1b4225",
  "#1b3342",
  "#0b0b4b",
  "#000000",
];

export const LIGHT_THEMES = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffce00",
  "#eb3434",
  "#fe7418",
  "#f97b9c",
  "#497fff",
  "#1b4225",
  "#1b3342",
];