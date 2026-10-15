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
    <LinearGradient id="antSky" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#5CC8F2" />
      <Stop offset={1} stopColor="#EAF9FF" />
    </LinearGradient>
    <LinearGradient id="antSea" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#1FC0E3" />
      <Stop offset={1} stopColor="#0B86BE" />
    </LinearGradient>
    <LinearGradient id="antSand" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#FFE6AE" />
      <Stop offset={1} stopColor="#F6C878" />
    </LinearGradient>
    <RadialGradient id="antSun" cx={0.5} cy={0.5} r={0.5}>
      <Stop offset={0} stopColor="#FFF6C2" />
      <Stop offset={1} stopColor="#FFC233" />
    </RadialGradient>
  </Defs>
);

const layer0 = (
  <>
    <Rect x={0} y={0} width={390} height={340} fill="url(#antSky)" />
  </>
);

const layer1 = (
  <>
    <Circle cx={340} cy={52} r={24} fill="url(#antSun)" />
    <Path
      d="M0 182 L36 128 L62 146 L108 96 L150 140 L188 112 L236 166 L236 196 L0 196 Z"
      fill="#7FA4CF"
    />
    <Path
      d="M92 112 L108 96 L124 114 L116 110 L108 118 L100 110 Z M26 140 L36 128 L46 138 L36 136 Z M178 122 L188 112 L198 124 L188 120 Z"
      fill="#FFFFFF"
    />
    <Path d="M0 190 L60 168 L120 186 L180 170 L236 190 L236 200 L0 200 Z" fill="#95B7DA" />
    <Rect x={0} y={194} width={390} height={74} fill="url(#antSea)" />
    <G fill="#FFFFFF">
      <Circle cx={30} cy={214} r={1.6} />
      <Circle cx={96} cy={240} r={1.6} />
      <Circle cx={170} cy={222} r={1.6} />
      <Circle cx={220} cy={250} r={1.6} />
    </G>
    <Path d="M248 268 L258 210 L296 198 L390 202 L390 268 Z" fill="#D9A36B" />
    <Path d="M258 210 L296 198 L390 202 L390 212 L300 208 L262 220 Z" fill="#C48A52" />
    <G>
      <Rect x={266} y={160} width={34} height={44} fill="#E7C18E" />
      <Rect x={290} y={160} width={10} height={44} fill="#CDA16B" />
      <Rect x={262} y={154} width={42} height={8} fill="#E7C18E" />
      <Rect x={262} y={146} width={7} height={8} fill="#E7C18E" />
      <Rect x={275} y={146} width={7} height={8} fill="#E7C18E" />
      <Rect x={288} y={146} width={7} height={8} fill="#E7C18E" />
      <Rect x={297} y={146} width={7} height={8} fill="#CDA16B" />
      <Path d="M278 204 V188 A5 5 0 0 1 288 188 V204 Z" fill="#7A5230" />
    </G>
    <G>
      <Rect x={322} y={182} width={22} height={18} fill="#FFF3DE" />
      <Path d="M319 182 L333 172 L347 182 Z" fill="#D9542C" />
      <Rect x={364} y={184} width={22} height={16} fill="#FFF3DE" />
      <Path d="M361 184 L375 175 L389 184 Z" fill="#D9542C" />
      <Rect x={348} y={190} width={18} height={12} fill="#FDE8C8" />
      <Path d="M346 190 L357 182 L368 190 Z" fill="#C2462A" />
    </G>
    <G>
      <Rect x={346} y={96} width={16} height={96} fill="#C9663D" />
      <G fill="#A94E2C">
        <Rect x={348} y={98} width={2} height={92} />
        <Rect x={352.5} y={98} width={2} height={92} />
        <Rect x={357} y={98} width={2} height={92} />
      </G>
      <Rect x={342} y={128} width={24} height={5} fill="#E7C18E" />
      <Rect x={348} y={84} width={12} height={12} fill="#C9663D" />
      <Path d="M346 84 L354 66 L362 84 Z" fill="#7FA9B8" />
      <Rect x={353} y={58} width={2} height={9} fill="#8A6A3A" />
    </G>
    <Rect x={0} y={266} width={390} height={74} fill="url(#antSand)" />
    <G>
      <Path d="M206 300 L206 334" stroke="#7A5230" strokeWidth={3} />
      <Path d="M172 304 Q206 270 240 304 Z" fill="#FF6A2A" />
      <Path d="M190 304 Q206 272 206 272 Q206 272 222 304 Z" fill="#FFFFFF" />
      <Rect
        x={216}
        y={320}
        width={40}
        height={10}
        rx={3}
        fill="#2EC4E6"
        transform="rotate(-4 236 325)"
      />
    </G>
    <G>
      <Circle cx={112} cy={300} r={20} fill="#2F9A55" />
      <Circle cx={96} cy={306} r={14} fill="#2F9A55" />
      <Circle cx={128} cy={306} r={14} fill="#2F9A55" />
      <Rect x={109} y={318} width={6} height={18} fill="#8A5A32" />
      <G fill="#FF8A1F">
        <Circle cx={104} cy={296} r={4} />
        <Circle cx={118} cy={290} r={4} />
        <Circle cx={124} cy={304} r={4} />
        <Circle cx={98} cy={310} r={4} />
        <Circle cx={112} cy={306} r={4} />
      </G>
    </G>
  </>
);

const sunRays = (
  <G>
    <G stroke="#FFC233" strokeWidth={4} strokeLinecap="round">
      <Path d="M340 12 L340 22 M340 82 L340 92 M300 52 L310 52 M370 52 L380 52 M312 24 L319 31 M361 73 L368 80 M368 24 L361 31 M319 73 L312 80" />
    </G>
  </G>
);

const gulet = (
  <G>
    <Path d="M120 236 Q150 246 184 236 L178 246 Q150 252 126 246 Z" fill="#9A5A2E" />
    <Rect x={144} y={206} width={2} height={32} fill="#6B3E1E" />
    <Rect x={162} y={212} width={2} height={26} fill="#6B3E1E" />
    <Path d="M146 208 L146 234 L160 234 Z" fill="#FFFFFF" />
    <Path d="M164 214 L164 234 L176 234 Z" fill="#FFFFFF" />
  </G>
);

const waves = (
  <G>
    <Path
      d="M0 268 Q20 260 40 268 T80 268 T120 268 T160 268 T200 268 T240 268 T280 268 T320 268 T360 268 T400 268 T440 268 L440 274 L0 274 Z"
      fill="#FFFFFF"
      opacity={0.85}
    />
  </G>
);

const palm = (
  <G>
    <Path
      d="M30 340 Q24 290 34 236"
      stroke="#9A6B3F"
      strokeWidth={7}
      fill="none"
      strokeLinecap="round"
    />
    <Path
      d="M34 236 Q10 226 -6 242 M34 236 Q56 222 74 238 M34 236 Q24 210 4 208 M34 236 Q46 210 68 212"
      stroke="#22A35F"
      strokeWidth={9}
      fill="none"
      strokeLinecap="round"
    />
  </G>
);

const beachBall = (
  <G>
    <Circle cx={300} cy={318} r={10} fill="#FFFFFF" />
    <Path d="M300 308 A10 10 0 0 1 310 318 L300 318 Z" fill="#FF5F1F" />
    <Path d="M300 328 A10 10 0 0 1 290 318 L300 318 Z" fill="#22D3EE" />
  </G>
);

const ANTALYA: SceneDefinition = {
  defs,
  layers: [layer0, layer1],
  sprites: [
    {
      box: [297, 9, 86, 86],
      origin: [340, 52],
      after: 0,
      content: sunRays,
      motion: { rotate: { values: [0, 360], dur: 30000 } },
    },
    {
      box: [119, 205, 66, 45],
      after: 1,
      content: gulet,
      motion: { translate: { x: [0, -60, 0], y: [0, 0, 0], dur: 22000 } },
    },
    {
      box: [-1, 263, 442, 12],
      after: 1,
      content: waves,
      motion: { translate: { x: [0, -40], y: [0, 0], dur: 4000 } },
    },
    {
      box: [-12, 202, 92, 144],
      origin: [30, 340],
      after: 1,
      content: palm,
      motion: { rotate: { values: [-4, 4, -4], dur: 3400 } },
    },
    {
      box: [289, 307, 22, 22],
      after: 1,
      content: beachBall,
      motion: { translate: { x: [0, 0, 0], y: [0, -8, 0], dur: 1200 } },
    },
  ],
};

/**
 * Antalya sahnesi: `docs/tasarim/kaynak/Sahne.dc.html` içindeki `is.antalya` bloğunun
 * react-native-svg karşılığı. Şekiller, renkler, gradyanlar ve katman sırası kaynaktakiyle aynı;
 * hareketli parçalar (sunRays, gulet, waves, palm, beachBall) ayrı sprite'lardır.
 */
export const AntalyaScene = memo(function AntalyaScene(props: SceneProps) {
  return <SceneCanvas scene={ANTALYA} {...props} />;
});
