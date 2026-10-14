import { memo } from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { SceneCanvas, type SceneDefinition, type SceneProps } from './scene-kit';

const defs = (
  <Defs>
    <LinearGradient id="vanSky" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#7CC4FF" />
      <Stop offset={1} stopColor="#E8F7FF" />
    </LinearGradient>
    <LinearGradient id="vanLake" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#4BA8EE" />
      <Stop offset={1} stopColor="#1C5DB8" />
    </LinearGradient>
  </Defs>
);

const layer0 = (
  <>
    <Rect x={0} y={0} width={390} height={340} fill="url(#vanSky)" />
    <Path d="M0 190 L70 112 L96 128 L140 68 L192 140 L236 190 Z" fill="#93A9D2" />
    <Path d="M116 102 L140 68 L166 106 L152 98 L144 110 L132 98 Z" fill="#FFFFFF" />
    <Path d="M56 128 L70 112 L84 128 L72 124 Z" fill="#FFFFFF" />
    <Path d="M196 190 L268 120 L298 140 L330 110 L390 170 L390 190 Z" fill="#A7B8DC" />
    <Path
      d="M314 126 L330 110 L346 128 L334 122 L326 130 Z M256 132 L268 120 L280 132 L268 128 Z"
      fill="#FFFFFF"
    />
    <G fill="#E2453C">
      <Path d="M0 20 Q100 46 200 22 Q300 0 390 26" stroke="#8A6A3A" strokeWidth={1.5} fill="none" />
    </G>
    <Rect x={0} y={186} width={390} height={100} fill="url(#vanLake)" />
    <G stroke="#FFFFFF" strokeLinecap="round" strokeWidth={2}>
      <Path d="M30 206 L52 206" />
      <Path d="M240 214 L268 214" />
      <Path d="M300 250 L322 250" />
      <Path d="M60 262 L80 262" />
    </G>
    <Path d="M100 244 Q126 222 160 220 Q196 222 222 244 Z" fill="#7DA36B" />
    <Path d="M110 244 Q160 236 214 244 Z" fill="#5E8A50" />
    <Rect x={150} y={204} width={20} height={18} fill="#D8B48A" />
    <Rect x={154} y={194} width={12} height={10} fill="#D8B48A" />
    <Path d="M152 194 L160 180 L168 194 Z" fill="#B88A5C" />
    <Path d="M156 222 V212 A4 4 0 0 1 164 212 V222 Z" fill="#8A6A3A" />
    <G fill="#FFC9DE">
      <Circle cx={128} cy={230} r={6} />
      <Circle cx={136} cy={226} r={5} />
      <Circle cx={190} cy={228} r={6} />
      <Circle cx={198} cy={232} r={5} />
    </G>
    <Path d="M232 300 L254 262 L292 250 L336 256 L390 244 L390 300 Z" fill="#B88A5C" />
    <Path
      d="M254 262 L292 250 L336 256 L390 244 L390 252 L336 262 L292 258 L258 270 Z"
      fill="#9C7046"
    />
    <G fill="#D9B07C">
      <Rect x={270} y={236} width={80} height={18} />
      <Rect x={270} y={230} width={8} height={7} />
      <Rect x={284} y={230} width={8} height={7} />
      <Rect x={298} y={230} width={8} height={7} />
      <Rect x={312} y={230} width={8} height={7} />
      <Rect x={326} y={230} width={8} height={7} />
      <Rect x={340} y={230} width={8} height={7} />
      <Rect x={352} y={214} width={22} height={34} />
      <Rect x={352} y={208} width={6} height={7} />
      <Rect x={368} y={208} width={6} height={7} />
    </G>
    <Rect x={362} y={180} width={2} height={30} fill="#6B4A2E" />
    <Rect x={0} y={282} width={390} height={58} fill="#9ED07A" />
    <Path d="M0 282 Q100 274 200 282 T390 280 L390 288 L0 288 Z" fill="#86BE63" />
    <G fill="#FFFFFF">
      <Circle cx={30} cy={312} r={3} />
      <Circle cx={70} cy={324} r={3} />
      <Circle cx={210} cy={318} r={3} />
      <Circle cx={250} cy={330} r={3} />
    </G>
    <G fill="#FFD23F">
      <Circle cx={30} cy={312} r={1.2} />
      <Circle cx={70} cy={324} r={1.2} />
      <Circle cx={210} cy={318} r={1.2} />
      <Circle cx={250} cy={330} r={1.2} />
    </G>
  </>
);

const layer1 = (
  <>
    <G>
      <Ellipse cx={104} cy={306} rx={14} ry={11} fill="#FFFFFF" />
      <Circle cx={96} cy={292} r={9} fill="#FFFFFF" />
      <Path d="M89 287 L90 278 L96 284 Z M103 287 L102 278 L96 284 Z" fill="#F08A2E" />
      <Circle cx={93} cy={292} r={1.6} fill="#2F7DE1" />
      <Circle cx={99} cy={292} r={1.6} fill="#E3A21A" />
    </G>
    <G>
      <Ellipse cx={172} cy={312} rx={11} ry={9} fill="#FFFFFF" />
      <Circle cx={180} cy={300} r={7} fill="#FFFFFF" />
      <Path d="M175 296 L176 289 L180 294 Z M185 296 L184 289 L180 294 Z" fill="#F08A2E" />
    </G>
    <G fill="none" stroke="#3A5A8F" strokeWidth={2} strokeLinecap="round">
      <Path d="M200 90 q6 -6 12 0 q6 -6 12 0" />
    </G>
  </>
);

const tailLeft = (
  <Path
    d="M112 312 Q130 300 136 284"
    stroke="#F08A2E"
    strokeWidth={6}
    fill="none"
    strokeLinecap="round"
  />
);

const tailRight = (
  <Path
    d="M164 316 Q146 306 142 292"
    stroke="#F08A2E"
    strokeWidth={5}
    fill="none"
    strokeLinecap="round"
  />
);

const cloud = (
  <G fill="#FFFFFF">
    <G>
      <Ellipse cx={280} cy={70} rx={34} ry={10} />
      <Ellipse cx={262} cy={64} rx={18} ry={10} />
    </G>
  </G>
);

const bunting = (
  <G fill="#E2453C">
    <G>
      <Path d="M30 28 L40 28 L35 42 Z" fill="#E2453C" />
      <Path d="M62 34 L72 35 L66 48 Z" fill="#FFD23F" />
      <Path d="M96 38 L106 38 L101 52 Z" fill="#2F7DE1" />
      <Path d="M130 36 L140 35 L135 49 Z" fill="#2FB89A" />
      <Path d="M164 28 L174 27 L169 41 Z" fill="#FF8FC4" />
      <Path d="M220 20 L230 18 L226 32 Z" fill="#E2453C" />
      <Path d="M256 14 L266 12 L262 26 Z" fill="#FFD23F" />
      <Path d="M292 10 L302 10 L298 24 Z" fill="#2F7DE1" />
      <Path d="M328 14 L338 16 L332 29 Z" fill="#2FB89A" />
      <Path d="M362 22 L372 23 L366 36 Z" fill="#FF8FC4" />
    </G>
  </G>
);

const flag = (
  <G>
    <Rect x={364} y={180} width={22} height={14} fill="#E30A17" />
    <Circle cx={372} cy={187} r={4} fill="#FFFFFF" />
    <Circle cx={373.3} cy={187} r={3.2} fill="#E30A17" />
    <Path
      d="M377.5 184.6 L378.2 186.4 L380.1 186.4 L378.6 187.6 L379.2 189.4 L377.5 188.3 L375.9 189.4 L376.5 187.6 L375 186.4 L376.9 186.4 Z"
      fill="#FFFFFF"
    />
  </G>
);

const VAN: SceneDefinition = {
  defs,
  layers: [layer0, layer1],
  sprites: [
    {
      box: [108, 280, 32, 36],
      origin: [112, 312],
      after: 0,
      content: tailLeft,
      motion: { rotate: { values: [-6, 6, -6], dur: 1600 } },
    },
    {
      box: [138, 288, 30, 32],
      origin: [164, 316],
      after: 0,
      content: tailRight,
      motion: { rotate: { values: [5, -5, 5], dur: 1900 } },
    },
    {
      box: [243, 53, 72, 28],
      after: 1,
      content: cloud,
      motion: { translate: { x: [0, -30, 0], y: [0, 0, 0], dur: 26000 } },
    },
    {
      box: [29, 9, 344, 44],
      origin: [200, 22],
      after: 1,
      content: bunting,
      motion: { rotate: { values: [-3, 3, -3], dur: 3000 } },
    },
    {
      box: [363, 179, 24, 16],
      origin: [364, 187],
      after: 1,
      content: flag,
      motion: { skewY: { values: [0, -4, 0], dur: 1600 } },
    },
  ],
};

/**
 * Van sahnesi: `docs/tasarim/kaynak/Sahne.dc.html` içindeki `is.van` bloğunun
 * react-native-svg karşılığı. Şekiller, renkler, gradyanlar ve katman sırası kaynaktakiyle aynı;
 * hareketli parçalar (tailLeft, tailRight, cloud, bunting, flag) ayrı sprite'lardır.
 * Bayrak: tasarımdaki skewY(0;-4) orijine göredir ve bayrağı direkten ~25 birim yukarı kaydırır;
 * burada direğe bağlı kenarı sabit kalarak eğilir.
 */
export const VanScene = memo(function VanScene(props: SceneProps) {
  return <SceneCanvas scene={VAN} {...props} />;
});
