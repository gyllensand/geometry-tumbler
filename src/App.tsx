import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";
import { Sampler } from "tone";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 16px; background-color: #000000;"
);

const baseUrl = `${process.env.PUBLIC_URL}/audio/`;

export interface Sample {
  index: number;
  sampler: Sampler;
}

export const BASS = [
  {
    index: 0,
    sampler: new Sampler({
      urls: {
        1: "piano-a2sB.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: "piano-c3B.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: "piano-d3sB.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: "piano-g2sB.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: "piano-g3B.mp3",
      },
      baseUrl,
    }),
  },
];

export const HITS = [
  {
    index: 0,
    sampler: new Sampler({
      urls: {
        1: "piano-d6s.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 1,
    sampler: new Sampler({
      urls: {
        1: "piano-d7s.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 2,
    sampler: new Sampler({
      urls: {
        1: "piano-d6.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 3,
    sampler: new Sampler({
      urls: {
        1: "piano-a5s.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 4,
    sampler: new Sampler({
      urls: {
        1: "piano-a6s.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 5,
    sampler: new Sampler({
      urls: {
        1: "piano-g5.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 6,
    sampler: new Sampler({
      urls: {
        1: "piano-g6.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 7,
    sampler: new Sampler({
      urls: {
        1: "piano-c6.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 8,
    sampler: new Sampler({
      urls: {
        1: "piano-g7.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 9,
    sampler: new Sampler({
      urls: {
        1: "piano-d5s.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 10,
    sampler: new Sampler({
      urls: {
        1: "piano-f5.mp3",
      },
      baseUrl,
    }),
  },
  {
    index: 11,
    sampler: new Sampler({
      urls: {
        1: "piano-g5s.mp3",
      },
      baseUrl,
    }),
  },
];

const App = () => {
  return (
    <>
      <Canvas linear flat shadows camera={{ position: [0, 0, 200], fov: 100 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
