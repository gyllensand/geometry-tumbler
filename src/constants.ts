export interface Theme {
  theme: "light" | "dark";
  colors: string[];
}

export const DEFAULT_BPM = 110;

export const RING_SEGMENTS = 80;

export const EFFECTS = [
  ...new Array(16).fill(null).map(() => 0),
  ...new Array(16).fill(null).map(() => 1),
  2,
];

export const INSTRUMENTS = [0, 1]

export const SHAPES = new Array(31).fill(null).map((o, i) => (i < 30 ? 0 : 1));
export const SHAPE_COUNT = [20, 25, 30, 35, 40];
export const SHAPE_METALNESS = [0.5, 0.75];
export const SHAPE_ROUGHNESS = [0.75, 1];

export const AMBIENT_LIGHT_INTENSITY = [1.5, 2];
export const POINT_LIGHT_INTENSITY = [0.5, 0.7, 0.9];
export const SPOT_LIGHT_INTENSITY = [0.5, 0.7];

export const SCALES = [
  {
    index: 0,
    bass: 2,
    sequence: [3, 0, 1, 4, 6, 0, 3, 5],
  },
  {
    index: 1,
    bass: 4,
    sequence: [9, 2, 6, 4, 2, 3, 5, 10],
  },
  {
    index: 2,
    bass: 1,
    sequence: [7, 4, 8, 1, 6, 7, 5, 9],
  },
  {
    index: 3,
    bass: 3,
    sequence: [11, 0, 1, 4, 6, 0, 3, 10],
  },
  {
    index: 4,
    bass: 0,
    sequence: [3, 0, 1, 4, 6, 0, 2, 3],
  },
  {
    index: 5,
    bass: 5,
    sequence: [11, 0, 1, 4, 6, 0, 3, 11],
  },
  {
    index: 6,
    bass: 6,
    sequence: [3, 0, 4, 1, 4, 6, 0, 3],
  },
];

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
