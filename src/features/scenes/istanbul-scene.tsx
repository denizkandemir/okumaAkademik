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
    <LinearGradient id="istSky" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#5B4BC9" />
      <Stop offset={0.45} stopColor="#D97BB4" />
      <Stop offset={0.72} stopColor="#FFB38A" />
      <Stop offset={1} stopColor="#FFD9A6" />
    </LinearGradient>
    <LinearGradient id="istSea" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#8E6BD3" />
      <Stop offset={1} stopColor="#3A2B8F" />
    </LinearGradient>
    <RadialGradient id="istSun" cx={0.5} cy={0.5} r={0.5}>
      <Stop offset={0} stopColor="#FFF4C8" />
      <Stop offset={0.35} stopColor="#FFC46B" stopOpacity={0.8} />
      <Stop offset={1} stopColor="#FFB38A" stopOpacity={0} />
    </RadialGradient>
  </Defs>
);

const layer0 = (
  <>
    <Rect x={0} y={0} width={390} height={340} fill="url(#istSky)" />
    <Circle cx={300} cy={205} r={80} fill="url(#istSun)" />
    <Circle cx={300} cy={208} r={26} fill="#FFE9B0" />
    <Path
      d="M170 240 Q230 222 290 230 T390 226 L390 242 L170 242 Z"
      fill="#9B6FB8"
      opacity={0.75}
    />
    <G stroke="#5A3E9A" fill="none" strokeLinecap="round">
      <Path d="M180 212 Q205 152 233 150 Q302 205 371 150 Q384 162 390 172" strokeWidth={2.2} />
      <Path d="M176 210 L390 210" strokeWidth={4} />
      <Path
        d="M254 164 L254 210 M274 173 L274 210 M302 178 L302 210 M330 173 L330 210 M350 164 L350 210 M214 168 L214 210"
        strokeWidth={1}
      />
    </G>
    <Rect x={230} y={146} width={7} height={96} fill="#5A3E9A" />
    <Rect x={368} y={146} width={7} height={96} fill="#5A3E9A" />
    <Rect x={226} y={176} width={15} height={4} fill="#5A3E9A" />
    <Rect x={364} y={176} width={15} height={4} fill="#5A3E9A" />
    <G fill="#FFE07A">
      <Circle cx={250} cy={210} r={1.6} />
      <Circle cx={290} cy={210} r={1.6} />
      <Circle cx={330} cy={210} r={1.6} />
    </G>
    <G fill="#4D3591">
      <Rect x={22} y={206} width={132} height={36} />
      <Path d="M50 207 A35 32 0 0 1 120 207 Z" />
      <Path d="M30 214 A18 14 0 0 1 64 214 Z" />
      <Path d="M106 214 A18 14 0 0 1 140 214 Z" />
      <Rect x={84} y={166} width={2} height={10} />
      <Rect x={16} y={142} width={5} height={70} />
      <Path d="M15 142 L18.5 120 L22 142 Z" />
      <Rect x={13.5} y={166} width={10} height={3} />
      <Rect x={13.5} y={186} width={10} height={3} />
      <Rect x={36} y={150} width={5} height={62} />
      <Path d="M35 150 L38.5 130 L42 150 Z" />
      <Rect x={33.5} y={172} width={10} height={3} />
      <Rect x={133} y={150} width={5} height={62} />
      <Path d="M132 150 L135.5 130 L139 150 Z" />
      <Rect x={130.5} y={172} width={10} height={3} />
      <Rect x={152} y={142} width={5} height={70} />
      <Path d="M151 142 L154.5 120 L158 142 Z" />
      <Rect x={149.5} y={166} width={10} height={3} />
      <Rect x={149.5} y={186} width={10} height={3} />
    </G>
    <Path d="M85 160 A4 4 0 1 0 89 166 A3 3 0 1 1 85 160 Z" fill="#4D3591" />
    <G fill="#FFC98A">
      <Rect x={70} y={222} width={4} height={6} rx={2} />
      <Rect x={82} y={222} width={4} height={6} rx={2} />
      <Rect x={94} y={222} width={4} height={6} rx={2} />
      <Rect x={40} y={226} width={3} height={5} rx={1.5} />
      <Rect x={132} y={226} width={3} height={5} rx={1.5} />
    </G>
    <G fill="#43307F">
      <Rect x={160} y={220} width={22} height={22} />
      <Rect x={200} y={214} width={18} height={28} />
      <Rect x={170} y={150} width={18} height={92} />
      <Rect x={167} y={146} width={24} height={8} />
      <Path d="M166 146 L179 110 L192 146 Z" />
    </G>
    <G fill="#FFD27F">
      <Rect x={174} y={160} width={3} height={6} rx={1.5} />
      <Rect x={181} y={160} width={3} height={6} rx={1.5} />
      <Rect x={174} y={176} width={3} height={6} rx={1.5} />
      <Rect x={181} y={176} width={3} height={6} rx={1.5} />
      <Rect x={164} y={226} width={3} height={4} />
      <Rect x={205} y={222} width={3} height={4} />
      <Rect x={211} y={230} width={3} height={4} />
    </G>
    <Rect x={0} y={240} width={390} height={100} fill="url(#istSea)" />
    <G stroke="#FFD9A0" strokeLinecap="round">
      <Path d="M282 252 L318 252" strokeWidth={3} />
      <Path d="M276 264 L326 264" strokeWidth={3} />
      <Path d="M286 278 L316 278" strokeWidth={2.5} />
      <Path d="M290 296 L312 296" strokeWidth={2} />
    </G>
    <Ellipse cx={230} cy={298} rx={36} ry={7} fill="#2E2272" />
    <Rect x={210} y={276} width={40} height={22} fill="#6A4FB3" />
    <Rect x={224} y={250} width={12} height={28} fill="#6A4FB3" />
    <Path d="M222 252 L230 236 L238 252 Z" fill="#6A4FB3" />
    <Rect x={228} y={258} width={4} height={6} rx={2} fill="#FFE07A" />
  </>
);

const cloudLeft = (
  <G fill="#FFFFFF" opacity={0.45}>
    <G>
      <Ellipse cx={80} cy={60} rx={38} ry={9} />
      <Ellipse cx={102} cy={54} rx={22} ry={9} />
    </G>
  </G>
);

const cloudRight = (
  <G fill="#FFFFFF" opacity={0.45}>
    <G>
      <Ellipse cx={250} cy={90} rx={30} ry={7} />
      <Ellipse cx={236} cy={85} rx={16} ry={7} />
    </G>
  </G>
);

const ferry = (
  <G>
    <Path d="M0 318 L70 318 L63 330 L7 330 Z" fill="#FFFFFF" />
    <Rect x={12} y={306} width={46} height={12} rx={2} fill="#FFFFFF" />
    <Rect x={16} y={310} width={38} height={3} fill="#2A2140" />
    <Rect x={32} y={294} width={7} height={12} fill="#FFFFFF" />
    <Rect x={32} y={294} width={7} height={5} fill="#2A2140" />
    <Path d="M-24 331 L0 331 M-40 334 L-6 334" stroke="#C9B8FF" strokeWidth={1.5} opacity={0.7} />
  </G>
);

const gullLeft = (
  <G fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round">
    <Path d="M40 110 q6 -6 12 0 q6 -6 12 0" />
  </G>
);

const gullRight = (
  <G fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round">
    <Path d="M120 130 q5 -5 10 0 q5 -5 10 0" />
  </G>
);

const ISTANBUL: SceneDefinition = {
  defs,
  layers: [layer0],
  sprites: [
    {
      box: [41, 44, 84, 26],
      after: 0,
      content: cloudLeft,
      motion: { translate: { x: [0, -30, 0], y: [0, 0, 0], dur: 30000 } },
    },
    {
      box: [219, 77, 62, 21],
      after: 0,
      content: cloudRight,
      motion: { translate: { x: [0, 26, 0], y: [0, 0, 0], dur: 26000 } },
    },
    {
      box: [-42, 292, 114, 44],
      after: 0,
      content: ferry,
      motion: { translate: { x: [-90, 420], y: [0, 0], dur: 24000 } },
    },
    {
      box: [38, 105, 28, 7],
      after: 0,
      content: gullLeft,
      motion: { translate: { x: [0, 40, 0], y: [0, -10, 0], dur: 12000 } },
    },
    {
      box: [118, 125, 24, 7],
      after: 0,
      content: gullRight,
      motion: { translate: { x: [0, 30, 0], y: [0, 6, 0], dur: 9000 } },
    },
  ],
};

/**
 * İstanbul sahnesi: `docs/tasarim/kaynak/Sahne.dc.html` içindeki `is.istanbul` bloğunun
 * react-native-svg karşılığı. Şekiller, renkler, gradyanlar ve katman sırası kaynaktakiyle aynı;
 * hareketli parçalar (cloudLeft, cloudRight, ferry, gullLeft, gullRight) ayrı sprite'lardır.
 */
export const IstanbulScene = memo(function IstanbulScene(props: SceneProps) {
  return <SceneCanvas scene={ISTANBUL} {...props} />;
});
