import { memo } from 'react';
import {
  Circle,
  Defs,
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
    <LinearGradient id="efeSky" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#0E0B33" />
      <Stop offset={0.6} stopColor="#2B1F6E" />
      <Stop offset={1} stopColor="#5A3A9A" />
    </LinearGradient>
    <LinearGradient id="efeStone" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#F6E3BC" />
      <Stop offset={1} stopColor="#D2AE78" />
    </LinearGradient>
    <RadialGradient id="efeGlow" cx={0.5} cy={0.5} r={0.5}>
      <Stop offset={0} stopColor="#FFD98A" stopOpacity={0.7} />
      <Stop offset={1} stopColor="#FFD98A" stopOpacity={0} />
    </RadialGradient>
    <RadialGradient id="efeMoon" cx={0.5} cy={0.5} r={0.5}>
      <Stop offset={0} stopColor="#FFF2C2" stopOpacity={0.6} />
      <Stop offset={1} stopColor="#FFF2C2" stopOpacity={0} />
    </RadialGradient>
  </Defs>
);

const layer0 = (
  <>
    <Rect x={0} y={0} width={390} height={340} fill="url(#efeSky)" />
    <Path d="M338 26 a26 26 0 1 0 0 52 a20 20 0 1 1 0 -52 Z" fill="#FFF2C2" />
    <Path d="M0 214 Q70 186 140 204 T280 196 T390 206 L390 262 L0 262 Z" fill="#241A5C" />
    <G fill="none" stroke="#4A3C9A" strokeWidth={3}>
      <Path d="M292 212 A62 40 0 0 1 392 212" />
      <Path d="M300 218 A54 32 0 0 1 392 218" />
      <Path d="M308 224 A46 24 0 0 1 392 224" />
      <Path d="M316 230 A38 16 0 0 1 392 230" />
    </G>
    <Circle cx={195} cy={200} r={110} fill="url(#efeGlow)" />
    <Rect x={96} y={246} width={198} height={8} fill="#BFA06E" />
    <Rect x={88} y={254} width={214} height={8} fill="#A98C5E" />
    <Rect x={114} y={166} width={162} height={80} fill="#CDAE7E" />
    <Path d="M150 246 V214 A10 10 0 0 1 170 214 V246 Z" fill="#3A2A5E" />
    <Path d="M181 246 V208 A14 14 0 0 1 209 208 V246 Z" fill="#3A2A5E" />
    <Path d="M220 246 V214 A10 10 0 0 1 240 214 V246 Z" fill="#3A2A5E" />
    <G fill="url(#efeStone)">
      <Rect x={118} y={172} width={7} height={74} />
      <Rect x={132} y={172} width={7} height={74} />
      <Rect x={172} y={172} width={7} height={74} />
      <Rect x={211} y={172} width={7} height={74} />
      <Rect x={251} y={172} width={7} height={74} />
      <Rect x={265} y={172} width={7} height={74} />
    </G>
    <G fill="#F6E3BC">
      <Rect x={116} y={168} width={25} height={5} />
      <Rect x={169} y={168} width={13} height={5} />
      <Rect x={208} y={168} width={13} height={5} />
      <Rect x={249} y={168} width={25} height={5} />
    </G>
    <Rect x={108} y={160} width={174} height={9} fill="#E9D1A2" />
    <G fill="#8E6D45">
      <Path d="M144 196 A4 4 0 0 1 152 196 V212 H144 Z" />
      <Path d="M238 196 A4 4 0 0 1 246 196 V212 H238 Z" />
    </G>
    <Rect x={122} y={100} width={146} height={60} fill="#C9A874" />
    <G fill="url(#efeStone)">
      <Rect x={128} y={104} width={6} height={56} />
      <Rect x={150} y={104} width={6} height={56} />
      <Rect x={179} y={104} width={6} height={56} />
      <Rect x={205} y={104} width={6} height={56} />
      <Rect x={234} y={104} width={6} height={56} />
      <Rect x={256} y={104} width={6} height={56} />
    </G>
    <Rect x={116} y={93} width={158} height={8} fill="#E9D1A2" />
    <Path d="M124 93 L142 80 L160 93 Z" fill="#E9D1A2" />
    <Path d="M176 93 Q195 74 214 93 Z" fill="#E9D1A2" />
    <Path d="M230 93 L248 80 L266 93 Z" fill="#E9D1A2" />
    <G fill="#3A2A5E" opacity={0.55}>
      <Path d="M137 128 A3 3 0 0 1 143 128 V156 H137 Z" />
      <Path d="M247 128 A3 3 0 0 1 253 128 V156 H247 Z" />
      <Path d="M192 120 A3 3 0 0 1 198 120 V156 H192 Z" />
    </G>
    <G fill="#E0C79A">
      <Rect x={30} y={196} width={10} height={66} />
      <Rect x={28} y={192} width={14} height={5} />
      <Rect x={56} y={214} width={10} height={48} />
      <Path d="M56 214 L60 208 L66 214 Z" />
      <Rect x={340} y={206} width={10} height={56} />
      <Rect x={338} y={202} width={14} height={5} />
      <Rect x={66} y={252} width={26} height={10} rx={5} transform="rotate(-8 79 257)" />
    </G>
    <Rect x={0} y={262} width={390} height={78} fill="#2E2468" />
    <G stroke="#4A3E95" strokeWidth={1.2}>
      <Path d="M0 286 L390 286 M0 314 L390 314" />
      <Path d="M60 262 L30 340 M130 262 L118 340 M195 262 L195 340 M260 262 L272 340 M330 262 L360 340" />
    </G>
    <G>
      <Rect x={82} y={226} width={3} height={36} fill="#6B5B9E" />
      <Circle cx={83.5} cy={224} r={5} fill="#FFD98A" />
      <Circle cx={83.5} cy={224} r={14} fill="#FFD98A" opacity={0.25} />
      <Rect x={306} y={226} width={3} height={36} fill="#6B5B9E" />
      <Circle cx={307.5} cy={224} r={5} fill="#FFD98A" />
      <Circle cx={307.5} cy={224} r={14} fill="#FFD98A" opacity={0.25} />
    </G>
  </>
);

const stars = (
  <G fill="#FFFFFF">
    <Circle cx={30} cy={40} r={1.6} />
    <Circle cx={80} cy={22} r={1.2} />
    <Circle cx={140} cy={54} r={1.8} />
    <Circle cx={200} cy={18} r={1.3} />
    <Circle cx={250} cy={48} r={1.5} />
    <Circle cx={110} cy={96} r={1.2} />
    <Circle cx={60} cy={120} r={1.4} />
    <Circle cx={300} cy={110} r={1.2} />
    <Path d="M176 76 L178 82 L184 84 L178 86 L176 92 L174 86 L168 84 L174 82 Z" fill="#FFE07A" />
  </G>
);

const moonGlow = <Circle cx={330} cy={50} r={46} fill="url(#efeMoon)" />;

const fireflyLeft = (
  <G fill="#FFE98A">
    <Circle cx={40} cy={290} r={2} />
  </G>
);

const fireflyRight = (
  <G fill="#FFE98A">
    <Circle cx={350} cy={296} r={2} />
  </G>
);

const fireflyMiddle = (
  <G fill="#FFE98A">
    <Circle cx={230} cy={300} r={1.6} />
  </G>
);

const EFES: SceneDefinition = {
  defs,
  layers: [layer0],
  sprites: [
    {
      box: [27, 15, 276, 108],
      after: 0,
      content: stars,
      motion: { opacity: { values: [1, 0.35, 1], dur: 2400 } },
    },
    {
      box: [283, 3, 94, 94],
      after: 0,
      usesDefs: true,
      content: moonGlow,
      motion: {
        scale: { values: [1, 1.12, 1], dur: 4000, ease: true },
        opacity: { values: [1, 0.55, 1], dur: 4000, ease: true },
      },
    },
    {
      box: [37, 287, 6, 6],
      after: 0,
      content: fireflyLeft,
      motion: {
        translate: { x: [0, 10, 0], y: [0, -16, 0], dur: 5000 },
        opacity: { values: [0.2, 1, 0.2], dur: 2000 },
      },
    },
    {
      box: [347, 293, 6, 6],
      after: 0,
      content: fireflyRight,
      motion: {
        translate: { x: [0, -12, 0], y: [0, -14, 0], dur: 6000 },
        opacity: { values: [1, 0.2, 1], dur: 2400 },
      },
    },
    {
      box: [227, 297, 6, 6],
      after: 0,
      content: fireflyMiddle,
      motion: {
        translate: { x: [0, 8, 0], y: [0, -18, 0], dur: 5500 },
        opacity: { values: [0.3, 1, 0.3], dur: 1800 },
      },
    },
  ],
};

/**
 * Efes sahnesi: `docs/tasarim/kaynak/Sahne.dc.html` içindeki `is.efes` bloğunun
 * react-native-svg karşılığı. Şekiller, renkler, gradyanlar ve katman sırası kaynaktakiyle aynı;
 * hareketli parçalar (stars, moonGlow, fireflyLeft, fireflyRight, fireflyMiddle) ayrı sprite'lardır.
 * Ay ışığı tasarımda durağandır; görevde istendiği için yavaşça nefes alır (moonGlow).
 */
export const EfesScene = memo(function EfesScene(props: SceneProps) {
  return <SceneCanvas scene={EFES} {...props} />;
});
