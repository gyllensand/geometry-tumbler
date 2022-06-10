import { OrbitControls } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { a, easings, SpringValue, useSprings } from "@react-spring/three";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MathUtils, Vector2 } from "three";
import {
  AMBIENT_LIGHT_INTENSITY,
  BG_COLORS,
  COLORS,
  POINT_LIGHT_INTENSITY,
  SHAPES,
  SHAPE_COUNT,
  SHAPE_METALNESS,
  SHAPE_ROUGHNESS,
  SPOT_LIGHT_INTENSITY,
  LIGHT_THEMES,
  EFFECTS,
  SCALES,
} from "./constants";
import {
  pickRandomHash,
  getRandomNumber,
  pickRandomColorWithTheme,
  sortRandom,
  easeInOutSine,
  pickRandom,
} from "./utils";
import {
  EffectComposer,
  Sepia,
  Vignette,
  HueSaturation,
  BrightnessContrast,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction, KernelSize } from "postprocessing";
import { BASS, HITS } from "./App";
import { start } from "tone";

const bgColor = pickRandomHash(BG_COLORS);
const mainTheme = pickRandomHash(LIGHT_THEMES);
const themeColor = pickRandomHash(COLORS);
const themeColor2 = pickRandomHash(COLORS);
const themeColor3 = pickRandomHash(COLORS);
const themeColor4 = pickRandomHash(COLORS);
const shapes = pickRandomHash(SHAPE_COUNT);
const effectFilter = pickRandomHash(EFFECTS);
const pointIntensity = pickRandomHash(POINT_LIGHT_INTENSITY);
const spotIntensity = pickRandomHash(SPOT_LIGHT_INTENSITY);
const ambientIntensity = pickRandomHash(AMBIENT_LIGHT_INTENSITY);

// @ts-ignore
// window.$fxhashFeatures = {
//   bgColor,
//   discColor,
//   centerColor1: centerColor,
//   centerColor2,
//   needleColor,
//   ringCount,
// };

interface SpringValues {
  position: SpringValue<number[]>;
  scale: SpringValue<number[]>;
  rotation: SpringValue<number[]>;
}

const isPosNr = (value: number) => value > 0;
const minMaxNumber = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const random = (i: number, rand: () => number) => {
  const r1 = rand();
  const r2 = rand();
  const r3 = rand();
  const r4 = rand();

  return {
    position: [100 - r1 * 200, 100 - r2 * 200, i * 2],
    scale: [1 + r3 * 14, 1 + r3 * 14, 1],
    rotation: [0, 0, MathUtils.degToRad(Math.round(r4) * 45)],
  };
};

const randomRetract = (
  i: number,
  rand: () => number,
  prevValues: SpringValues
) => {
  const posX = prevValues.position.get()[0];
  const posY = prevValues.position.get()[1];

  return {
    position: [isPosNr(posX) ? -20 : 20, isPosNr(posY) ? -20 : 20, 0],
    rotation: [0, 0, rand() * 0.5],
  };
};

const randomIdle = (i: number, rand: () => number) => {
  return {
    from: {
      position: [0, 0, 0],
    },
    to: {
      position: [2.5 - rand() * 5, 2.5 - rand() * 5, 0],
    },
  };
};

const objects = new Array(shapes).fill(null).map((o, i) => {
  const shape = pickRandomHash(SHAPES);
  const metalness = pickRandomHash(SHAPE_METALNESS);
  const roughness = pickRandomHash(SHAPE_ROUGHNESS);
  const color1 = pickRandomColorWithTheme(themeColor, shapes);
  const color2 = pickRandomColorWithTheme(themeColor2, shapes);
  const color3 = pickRandomColorWithTheme(themeColor3, shapes);
  const color4 = pickRandomColorWithTheme(themeColor4, shapes);
  const currentColor =
    i < shapes / 4
      ? color1
      : i < shapes / 2
      ? color2
      : i < shapes / 1.5
      ? color3
      : color4;

  return {
    color: currentColor,
    metalness,
    roughness,
    shape,
    args: getShapeArgs(shape),
  };
});

function getShapeArgs(shape: number) {
  switch (shape) {
    case 0:
      return [0.1 + getRandomNumber() * 9, 0.1 + getRandomNumber() * 9, 10];
    case 1:
      return [0.2 + getRandomNumber() * 3, 128, 128];
  }
}

function getShape(shape: number, args: any) {
  switch (shape) {
    case 0:
      return <boxBufferGeometry attach="geometry" args={args} />;
    case 1:
      return <sphereBufferGeometry attach="geometry" args={args} />;
  }
}

function Shapes({
  retractSprings,
  expandSprings,
  idleSprings,
}: {
  retractSprings: SpringValues[];
  expandSprings: SpringValues[];
  idleSprings: SpringValues[];
}) {
  return (
    <group>
      {objects.map((o, i) => {
        const shape = getShape(o.shape, o.args);

        return (
          <a.group key={i} {...(idleSprings[i] as any)}>
            <a.group {...(retractSprings[i] as any)}>
              <a.mesh {...(expandSprings[i] as any)} castShadow receiveShadow>
                {shape}

                {/*
                // @ts-ignore */}
                <a.meshStandardMaterial
                  attach="material"
                  color={o.color}
                  roughness={o.roughness}
                  metalness={o.metalness}
                />
              </a.mesh>
            </a.group>
          </a.group>
        );
      })}
    </group>
  );
}

function Lights() {
  // console.log("pointIntensity", pointIntensity);
  // console.log("spotIntensity", spotIntensity);
  // console.log("ambientIntensity", ambientIntensity);
  // console.log("mainTheme", mainTheme);

  return (
    <group>
      <pointLight intensity={pointIntensity} />
      <ambientLight intensity={ambientIntensity} color={mainTheme} />
      <spotLight
        castShadow
        intensity={spotIntensity}
        angle={Math.PI / 7}
        position={[150, 150, 250]}
        penumbra={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
}

const Scene = () => {
  const { viewport } = useThree((state) => ({
    viewport: state.viewport,
  }));

  const timer = useRef(0);
  const timerInterval = useRef<NodeJS.Timer>();
  const [timerState, setTimerState] = useState(0);
  const [toneInitialized, setToneInitialized] = useState(false);
  const [lastPlayedScale, setLastPlayedScale] = useState<number>();
  const availableScales = useMemo(
    () => SCALES.filter(({ index }) => index !== lastPlayedScale),
    [lastPlayedScale]
  );

  const [expandSprings, setExpand] = useSprings(shapes, (i) => ({
    ...random(i, getRandomNumber),
  }));

  const [retractSprings, setRetract] = useSprings(shapes, (i) => ({
    position: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
  }));

  const [idleSprings, setIdle] = useSprings(shapes, (i) => ({
    position: [0, 0, 0],
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
  }));

  useEffect(() => {
    BASS.forEach((bass) => bass.sampler.toDestination());
    HITS.forEach((hit) => hit.sampler.toDestination());
  }, []);

  useEffect(() => {
    const shuffledIndexes = sortRandom(objects.map((o, i) => i));
    setIdle.start((i) => ({
      ...randomIdle(i, getRandomNumber),
      // delay: shuffledIndexes[i] * 20,
      loop: { reverse: true },
      config: { mass: 10, tension: 50, friction: 25 },
    }));
  }, [setIdle]);

  const initializeTone = useCallback(async () => {
    await start();
    setToneInitialized(true);
  }, []);

  const onPointerDown = useCallback(
    async (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();

      if (!toneInitialized) {
        await initializeTone();
      }

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = undefined;
      }

      timerInterval.current = setInterval(() => {
        if (timer.current < 60) {
          timer.current += 0.25;
          setTimerState(timer.current);
        }
      }, 10);

      setIdle.pause();
      setRetract.start((i) => ({
        ...randomRetract(i, Math.random, expandSprings[i]),
        config: { mass: 20, tension: 50, friction: 50 },
      }));
    },
    [setRetract, expandSprings, setIdle, toneInitialized, initializeTone]
  );

  const onPointerUp = useCallback(
    (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();

      const tension = 200 + minMaxNumber(timer.current * 5, 0, 300);
      const friction = 45 - minMaxNumber(timer.current * 0.2, 0, 10);
      const delay = 40 - minMaxNumber(timer.current * 0.6, 0, 40);
      const shuffledIndexes = sortRandom(objects.map((o, i) => i));

      const currentScale = pickRandom(availableScales);
      setLastPlayedScale(currentScale.index);
      BASS[currentScale.bass].sampler.triggerAttack("C#-1");
      let currentShapeIndex = 0;
      let currentScaleIndex = 0;

      setRetract.stop();
      setIdle.resume();
      setExpand.start((i) => ({
        ...random(i, Math.random),
        delay: shuffledIndexes[i] * delay,
        config: {
          mass: 4,
          tension,
          friction,
        },
        onStart: () => {
          if (retractSprings.find((o) => o.position.isAnimating)) {
            return;
          }

          currentShapeIndex++;

          if (currentShapeIndex % 2 === 0) {
            return;
          }

          if (currentScaleIndex > currentScale.sequence.length - 1) {
            currentScaleIndex = 0;
          }

          HITS[currentScale.sequence[currentScaleIndex]].sampler.triggerAttack(
            "C#-1"
          );
          currentScaleIndex++;
          console.log(currentScaleIndex);
          // const currentHit = pickRandom(HITS);

          // const currentHit = pickRandom(
          //   HITS.filter(
          //     (hit, i) => !alreadySelectedHit.find((o) => o === hit.index)
          //   )
          // );

          // alreadySelectedHit.push(currentHit.index);
          // console.log(alreadySelectedHit);
          // shuffledIndexes[i] * delay
          // if (i % 2 === 0) {
          //   currentHit.sampler.triggerAttack("C#-1");
          // }
        },
      }));

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = undefined;
      }

      timerInterval.current = setInterval(() => {
        if (timer.current <= 0) {
          clearInterval(timerInterval.current);
          timerInterval.current = undefined;
        }

        timer.current -= tension / 500;
        setTimerState(timer.current);
      }, 10);
    },
    [setExpand, setRetract, setIdle, availableScales, retractSprings]
  );

  const renderEffectComposer = useCallback((effect: number) => {
    switch (effect) {
      case 0:
        return (
          <EffectComposer autoClear={false}>
            <Vignette
              eskil={false}
              offset={0.1}
              opacity={1}
              darkness={easeInOutSine(
                minMaxNumber(timer.current / 80, 0, 0.7),
                0,
                0.7,
                0.7
              )}
            />
          </EffectComposer>
        );
      case 1:
        return (
          <EffectComposer autoClear={false}>
            <Sepia
              blendFunction={BlendFunction.NORMAL}
              intensity={easeInOutSine(
                minMaxNumber(timer.current / 60, 0, 1),
                0,
                1,
                1
              )}
            />
          </EffectComposer>
        );
      case 2:
        return (
          <EffectComposer autoClear={false}>
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={new Vector2(1, 1)}
            />
          </EffectComposer>
        );
    }
  }, []);

  const renderTouchArea = useCallback(() => {
    return (
      <mesh
        visible={false}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <planeBufferGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial attach="material" />
      </mesh>
    );
  }, [onPointerDown, onPointerUp, viewport]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {/* <OrbitControls
        enablePan={false}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      /> */}
      <Lights />
      {renderTouchArea()}
      {renderEffectComposer(effectFilter)}

      <Shapes
        retractSprings={retractSprings}
        expandSprings={expandSprings}
        idleSprings={idleSprings}
      />
    </>
  );
};

export default Scene;
