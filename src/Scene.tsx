import { OrbitControls, Text } from "@react-three/drei";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
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
  INSTRUMENTS,
} from "./constants";
import {
  pickRandomHash,
  getRandomNumber,
  pickRandomColorWithTheme,
  sortRandom,
  easeInOutSine,
  pickRandom,
  getSizeByAspect,
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
import { Destination, Filter, start } from "tone";
import { useGesture } from "react-use-gesture";

export const instrument = pickRandomHash(INSTRUMENTS);
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
window.$fxhashFeatures = {
  instrument,
  bgColor,
  lightingTheme: mainTheme,
  themeColor,
  themeColor2,
  themeColor3,
  themeColor4,
  shapesCount: shapes,
};

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
    case 1:
      return [0.2 + getRandomNumber() * 3, 128, 128];
    default:
      return [0.1 + getRandomNumber() * 9, 0.1 + getRandomNumber() * 9, 10];
  }
}

function getShape(shape: number, args: any) {
  switch (shape) {
    case 1:
      return <sphereBufferGeometry attach="geometry" args={args} />;
    default:
      return <boxBufferGeometry attach="geometry" args={args} />;
  }
}

function Shapes({
  aspect,
  retractSprings,
  expandSprings,
  idleSprings,
}: {
  aspect: number;
  retractSprings: SpringValues[];
  expandSprings: SpringValues[];
  idleSprings: SpringValues[];
}) {
  return (
    <group
      scale={[
        getSizeByAspect(1, aspect),
        getSizeByAspect(1, aspect),
        getSizeByAspect(1, aspect),
      ]}
    >
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

function Lights({ aspect }: { aspect: number }) {
  // console.log("pointIntensity", pointIntensity);
  // console.log("spotIntensity", spotIntensity);
  // console.log("ambientIntensity", ambientIntensity);
  // console.log("mainTheme", mainTheme);

  return (
    <group
      scale={[
        getSizeByAspect(1, aspect),
        getSizeByAspect(1, aspect),
        getSizeByAspect(1, aspect),
      ]}
    >
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
  const { viewport, aspect } = useThree((state) => ({
    viewport: state.viewport,
    aspect: state.viewport.aspect,
  }));

  const status = useRef("");
  const timer = useRef(0);
  const timerInterval = useRef<NodeJS.Timer>();
  const [timerState, setTimerState] = useState(0);
  const [toneInitialized, setToneInitialized] = useState(false);
  const [lastPlayedScale, setLastPlayedScale] = useState<number>();
  const availableScales = useMemo(
    () => SCALES.filter(({ index }) => index !== lastPlayedScale),
    [lastPlayedScale]
  );

  const randomInitialSprings = useMemo(
    () =>
      new Array(shapes).fill(null).map((o, i) => ({
        ...random(i, getRandomNumber),
      })),
    []
  );

  const [audioSprings, setAudio] = useSprings(shapes, (i) => ({
    ...randomInitialSprings[i],
  }));

  const [expandSprings, setExpand] = useSprings(shapes, (i) => ({
    ...randomInitialSprings[i],
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
    const filter = new Filter(4000, "lowpass");

    BASS.forEach((bass) => bass.sampler.toDestination());
    HITS.forEach((hit) => {
      if (instrument === 0) {
        hit.sampler.chain(filter, Destination);
      } else {
        hit.sampler.toDestination();
      }
    });
  }, []);

  useEffect(() => {
    setIdle.start((i) => ({
      ...randomIdle(i, getRandomNumber),
      loop: { reverse: true },
      config: { mass: 10, tension: 50, friction: 25 },
    }));
  }, [setIdle]);

  const initializeTone = useCallback(async () => {
    await start();
    setToneInitialized(true);
  }, []);

  // useFrame(() => {
  //   status.current = `${ Math.round(timer.current)}`;
  // });

  const onPointerDown = useCallback(
    async ({ event }) => {
      event.stopPropagation();
      // status.current = "pointerdown";
      if (!toneInitialized) {
        await initializeTone();
      }

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = undefined;
      }

      timerInterval.current = setInterval(() => {
        status.current = `down ${Math.round(timer.current)}`;
        if (timer.current < 60) {
          timer.current += 0.25;
          setTimerState(timer.current);
        }
      }, 10);

      setAudio.stop();
      setIdle.pause();
      setRetract.start((i) => ({
        ...randomRetract(i, Math.random, expandSprings[i]),
        config: { mass: 20, tension: 50, friction: 50 },
      }));
    },
    [
      setRetract,
      expandSprings,
      setIdle,
      setAudio,
      toneInitialized,
      initializeTone,
    ]
  );

  const onPointerUp = useCallback(
    ({ event }) => {
      event.stopPropagation();

      const randomSprings = new Array(shapes).fill(null).map((o, i) => ({
        ...random(i, Math.random),
      }));
      // status.current = "pointerup";
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
        ...randomSprings[i],
        delay: shuffledIndexes[i] * delay,
        config: {
          mass: 4,
          tension,
          friction,
        },
      }));

      setAudio.start((i) => ({
        ...randomSprings[i],
        delay: shuffledIndexes[i] * delay + 5,
        config: {
          mass: 4,
          tension,
          friction,
        },
        onStart: () => {
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
        },
      }));

      if (timerInterval.current) {
        clearInterval(timerInterval.current);
        timerInterval.current = undefined;
      }

      timerInterval.current = setInterval(() => {
        status.current = `up ${Math.round(timer.current)}`;
        if (timer.current <= 0) {
          clearInterval(timerInterval.current);
          timerInterval.current = undefined;
        }

        timer.current -= tension / 500;
        setTimerState(timer.current);
      }, 10);
    },
    [setExpand, setRetract, setIdle, availableScales, setAudio]
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

  const bind = useGesture({
    onPointerDown,
    onPointerUp,
    // onDragEnd: () => {
    //   if (timerInterval.current) {
    //     clearInterval(timerInterval.current);
    //     timerInterval.current = undefined;
    //   }
    // },
  });

  const renderTouchArea = useCallback(() => {
    return (
      // @ts-ignore
      <mesh {...bind()} visible={false}>
        <planeBufferGeometry args={[viewport.width, viewport.height]} />
        <meshStandardMaterial attach="material" />
      </mesh>
    );
  }, [viewport, bind]);

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <OrbitControls
        enablePan={false}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      />
      <Lights aspect={aspect} />
      {renderTouchArea()}
      {renderEffectComposer(effectFilter)}
      <Text fontSize={100} color="black">
        {status.current}
      </Text>
      <Shapes
        aspect={aspect}
        retractSprings={retractSprings}
        expandSprings={expandSprings}
        idleSprings={idleSprings}
      />
    </>
  );
};

export default Scene;
