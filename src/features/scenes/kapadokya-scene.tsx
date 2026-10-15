import { memo } from 'react';
import {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import { SceneCanvas, type SceneDefinition, type SceneProps } from './scene-kit';

const defs = (
  <Defs>
    <LinearGradient id="kapSky" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#7CC8F5" />
      <Stop offset={0.55} stopColor="#FFD7AE" />
      <Stop offset={1} stopColor="#FFB27A" />
    </LinearGradient>
    <LinearGradient id="kapRock" x1={0} y1={0} x2={1} y2={0}>
      <Stop offset={0} stopColor="#FBDDB6" />
      <Stop offset={0.65} stopColor="#EDBF8C" />
      <Stop offset={1} stopColor="#D49A62" />
    </LinearGradient>
    <RadialGradient id="kapSun" cx={0.5} cy={0.5} r={0.5}>
      <Stop offset={0} stopColor="#FFF4CF" />
      <Stop offset={0.4} stopColor="#FFD08A" stopOpacity={0.8} />
      <Stop offset={1} stopColor="#FFB27A" stopOpacity={0} />
    </RadialGradient>
  </Defs>
);

const layer0 = (
  <>
    <Rect x={0} y={0} width={390} height={340} fill="url(#kapSky)" />
    <Circle cx={200} cy={226} r={90} fill="url(#kapSun)" />
    <Circle cx={200} cy={230} r={28} fill="#FFF0C4" />
    <Path d="M0 230 Q60 210 120 222 T240 214 T390 224 L390 260 L0 260 Z" fill="#EDB98C" />
    <Path d="M0 250 Q80 236 160 248 T320 242 T390 248 L390 280 L0 280 Z" fill="#DFA270" />
    <G>
      <Path d="M18 300 C20 250, 30 214, 40 204 C50 214, 60 250, 62 300 Z" fill="url(#kapRock)" />
      <Path d="M26 206 Q40 190 54 206 Q40 214 26 206 Z" fill="#9C5E3A" />
      <Path
        d="M36 236 A4 4 0 0 1 44 236 V246 H36 Z M30 262 A3 3 0 0 1 36 262 V270 H30 Z"
        fill="#7A4A2E"
      />
      <Path d="M58 300 C60 262, 68 240, 78 232 C88 240, 96 262, 98 300 Z" fill="url(#kapRock)" />
      <Path d="M66 234 Q78 220 90 234 Q78 240 66 234 Z" fill="#9C5E3A" />
      <Path d="M74 256 A4 4 0 0 1 82 256 V266 H74 Z" fill="#7A4A2E" />
      <Path
        d="M96 300 C98 276, 104 262, 112 256 C120 262, 126 276, 128 300 Z"
        fill="url(#kapRock)"
      />
      <Path d="M102 258 Q112 248 122 258 Q112 262 102 258 Z" fill="#9C5E3A" />
    </G>
    <G>
      <Path
        d="M276 300 C278 256, 288 222, 300 210 C312 222, 322 256, 324 300 Z"
        fill="url(#kapRock)"
      />
      <Path d="M284 212 Q300 194 316 212 Q300 220 284 212 Z" fill="#9C5E3A" />
      <Path
        d="M296 240 A4 4 0 0 1 304 240 V250 H296 Z M290 266 A3 3 0 0 1 296 266 V274 H290 Z M306 266 A3 3 0 0 1 312 266 V274 H306 Z"
        fill="#7A4A2E"
      />
      <Path
        d="M318 300 C320 264, 330 238, 342 228 C354 238, 364 264, 366 300 Z"
        fill="url(#kapRock)"
      />
      <Path d="M328 230 Q342 214 356 230 Q342 238 328 230 Z" fill="#9C5E3A" />
      <Path d="M338 254 A4 4 0 0 1 346 254 V264 H338 Z" fill="#7A4A2E" />
      <Path
        d="M356 300 C358 278, 366 266, 376 260 C386 266, 394 278, 396 300 Z"
        fill="url(#kapRock)"
      />
      <Path d="M364 262 Q376 252 388 262 Q376 266 364 262 Z" fill="#9C5E3A" />
    </G>
    <Rect x={0} y={296} width={390} height={44} fill="#E2A672" />
    <Path d="M0 296 Q100 288 200 296 T390 294 L390 300 L0 300 Z" fill="#D69660" />
    <G fill="#7FAE4C">
      <Circle cx={150} cy={310} r={6} />
      <Circle cx={160} cy={306} r={7} />
      <Circle cx={232} cy={314} r={6} />
      <Circle cx={242} cy={310} r={5} />
    </G>
  </>
);

const smallBalloons = (
  <>
    <G transform="translate(150 118) scale(0.4)">
      <G>
        <Ellipse cx={0} cy={0} rx={20} ry={23} fill="#9B6BFF" />
        <Ellipse cx={0} cy={0} rx={8} ry={23} fill="#FF9CCB" />
        <Path d="M-12 18 L-5 34 M12 18 L5 34" stroke="#6B4A2E" strokeWidth={1.5} />
        <Rect x={-6} y={34} width={12} height={9} rx={2} fill="#8A5A32" />
      </G>
    </G>
    <G transform="translate(300 132) scale(0.45)">
      <G>
        <Ellipse cx={0} cy={0} rx={20} ry={23} fill="#2EC4B6" />
        <Ellipse cx={0} cy={0} rx={8} ry={23} fill="#FFE07A" />
        <Path d="M-12 18 L-5 34 M12 18 L5 34" stroke="#6B4A2E" strokeWidth={1.5} />
        <Rect x={-6} y={34} width={12} height={9} rx={2} fill="#8A5A32" />
      </G>
    </G>
  </>
);

const redBalloon = (
  <G transform="translate(64 66) scale(1.2)">
    <G>
      <Ellipse cx={0} cy={0} rx={20} ry={23} fill="#FF5A4E" />
      <Ellipse cx={0} cy={0} rx={12} ry={23} fill="#FFD23F" />
      <Ellipse cx={0} cy={0} rx={4} ry={23} fill="#FF5A4E" />
      <Ellipse cx={-8} cy={-10} rx={3} ry={6} fill="#FFFFFF" opacity={0.4} />
      <Path d="M-12 18 L-5 34 M12 18 L5 34" stroke="#6B4A2E" strokeWidth={1.5} />
      <Rect x={-6} y={34} width={12} height={9} rx={2} fill="#8A5A32" />
    </G>
  </G>
);

const blueBalloon = (
  <G transform="translate(170 44) scale(0.8)">
    <G>
      <Ellipse cx={0} cy={0} rx={20} ry={23} fill="#2F7DE1" />
      <Ellipse cx={0} cy={0} rx={10} ry={23} fill="#FFFFFF" />
      <Ellipse cx={0} cy={0} rx={3} ry={23} fill="#2F7DE1" />
      <Path d="M-12 18 L-5 34 M12 18 L5 34" stroke="#6B4A2E" strokeWidth={1.5} />
      <Rect x={-6} y={34} width={12} height={9} rx={2} fill="#8A5A32" />
    </G>
  </G>
);

const orangeBalloon = (
  <G transform="translate(270 70) scale(1.4)">
    <G>
      <Ellipse cx={0} cy={0} rx={20} ry={23} fill="#FF8A1F" />
      <Ellipse cx={0} cy={0} rx={12} ry={23} fill="#16B39A" />
      <Ellipse cx={0} cy={0} rx={5} ry={23} fill="#FF8A1F" />
      <Ellipse cx={-8} cy={-10} rx={3} ry={6} fill="#FFFFFF" opacity={0.4} />
      <Path d="M-12 18 L-5 34 M12 18 L5 34" stroke="#6B4A2E" strokeWidth={1.5} />
      <Rect x={-6} y={34} width={12} height={9} rx={2} fill="#8A5A32" />
    </G>
  </G>
);

const greenBalloon = (
  <G transform="translate(350 30) scale(0.7)">
    <G>
      <Ellipse cx={0} cy={0} rx={20} ry={23} fill="#7BD148" />
      <Ellipse cx={0} cy={0} rx={9} ry={23} fill="#FFE07A" />
      <Path d="M-12 18 L-5 34 M12 18 L5 34" stroke="#6B4A2E" strokeWidth={1.5} />
      <Rect x={-6} y={34} width={12} height={9} rx={2} fill="#8A5A32" />
    </G>
  </G>
);

const KAPADOKYA: SceneDefinition = {
  defs,
  layers: [layer0],
  sprites: [
    {
      box: [140, 106, 171, 48],
      after: 0,
      content: smallBalloons,
      motion: { translate: { x: [0, 0, 0], y: [0, -5.5, 0], dur: 7500 } },
    },
    {
      box: [38, 36, 52, 84],
      after: 0,
      content: redBalloon,
      motion: { translate: { x: [0, 0, 0], y: [0, -12, 0], dur: 5000, ease: true } },
    },
    {
      box: [152, 23, 36, 58],
      after: 0,
      content: blueBalloon,
      motion: { translate: { x: [0, 0, 0], y: [0, -9.6, 0], dur: 6000, ease: true } },
    },
    {
      box: [240, 35, 60, 98],
      after: 0,
      content: orangeBalloon,
      motion: { translate: { x: [0, 0, 0], y: [0, -12.6, 0], dur: 5500, ease: true, delay: 1000 } },
    },
    {
      box: [334, 11, 32, 52],
      after: 0,
      content: greenBalloon,
      motion: { translate: { x: [0, 0, 0], y: [0, -7, 0], dur: 6500 } },
    },
  ],
};

/**
 * Kapadokya sahnesi: `docs/tasarim/kaynak/Sahne.dc.html` içindeki `is.kapadokya` bloğunun
 * react-native-svg karşılığı. Şekiller, renkler, gradyanlar ve katman sırası kaynaktakiyle aynı;
 * hareketli parçalar (smallBalloons, redBalloon, blueBalloon, orangeBalloon, greenBalloon) ayrı sprite'lardır.
 * İki küçük uzak balon 5 sprite sınırı için birlikte süzülür (tasarımda 7 ve 8 sn).
 */
export const KapadokyaScene = memo(function KapadokyaScene(props: SceneProps) {
  return <SceneCanvas scene={KAPADOKYA} {...props} />;
});
