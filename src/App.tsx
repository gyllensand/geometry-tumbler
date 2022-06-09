import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import Scene from "./Scene";

console.log(
  "%c * Computer Emotions * ",
  "color: #d80fe7; font-size: 16px; background-color: #000000;"
);

const baseUrl = `${process.env.PUBLIC_URL}/audio/`;

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
