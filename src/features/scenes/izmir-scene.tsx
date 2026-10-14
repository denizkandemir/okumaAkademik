import { memo } from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { SceneCanvas, type SceneDefinition, type SceneProps } from './scene-kit';

const defs = (
  <Defs>
    <LinearGradient id="izmSky" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#5CC4FF" />
      <Stop offset={1} stopColor="#DDF5FF" />
    </LinearGradient>
    <LinearGradient id="izmSea" x1={0} y1={0} x2={0} y2={1}>
      <Stop offset={0} stopColor="#3DBBEB" />
      <Stop offset={1} stopColor="#1584C6" />
    </LinearGradient>
    <LinearGradient id="izmStone" x1={0} y1={0} x2={1} y2={0}>
      <Stop offset={0} stopColor="#FBEBD0" />
      <Stop offset={0.7} stopColor="#F0D7AE" />
      <Stop offset={1} stopColor="#D6B07F" />
    </LinearGradient>
  </Defs>
);

const layer0 = (
  <>
    <Rect x={0} y={0} width={390} height={340} fill="url(#izmSky)" />
    <Circle cx={56} cy={50} r={20} fill="#FFF6C8" />
    <Circle cx={56} cy={50} r={34} fill="#FFF6C8" opacity={0.35} />
    <G fill="#FFFFFF">
      <G>
        <Ellipse cx={300} cy={50} rx={40} ry={12} />
        <Ellipse cx={280} cy={44} rx={22} ry={12} />
        <Ellipse cx={320} cy={44} rx={18} ry={10} />
      </G>
      <G opacity={0.85}>
        <Ellipse cx={150} cy={84} rx={30} ry={9} />
        <Ellipse cx={136} cy={79} rx={16} ry={9} />
      </G>
    </G>
    <Path d="M0 196 Q60 166 120 182 T240 170 T390 182 L390 214 L0 214 Z" fill="#8DB7D8" />
    <Path d="M0 206 Q80 190 160 200 T390 198 L390 216 L0 216 Z" fill="#A9CBE4" />
    <Rect x={0} y={212} width={390} height={54} fill="url(#izmSea)" />
    <G fill="#FFFFFF">
      <Circle cx={40} cy={230} r={1.5} />
      <Circle cx={130} cy={246} r={1.5} />
      <Circle cx={300} cy={238} r={1.5} />
    </G>
  </>
);

const layer1 = (
  <>
    <Rect x={0} y={264} width={390} height={76} fill="#F4E4C6" />
    <Rect x={0} y={262} width={390} height={5} fill="#C99E6A" />
    <G stroke="#E3CDA6" strokeWidth={1.2}>
      <Path d="M0 290 L390 290 M0 318 L390 318" />
      <Path d="M30 267 L20 340 M90 267 L84 340 M150 267 L148 340 M210 267 L212 340 M270 267 L276 340 M330 267 L340 340" />
    </G>
    <G fill="#A9BBC9">
      <Rect x={100} y={222} width={40} height={42} />
      <Path d="M100 223 A20 16 0 0 1 140 223 Z" />
      <Rect x={142} y={172} width={5} height={92} />
      <Rect x={139.5} y={196} width={10} height={3} />
      <Path d="M141 172 L144.5 154 L148 172 Z" />
    </G>
    <Rect x={100} y={236} width={40} height={5} fill="#2A7FC9" />
    <Rect x={108} y={246} width={6} height={12} rx={3} fill="#6E8597" />
    <Rect x={126} y={246} width={6} height={12} rx={3} fill="#6E8597" />
    <G>
      <Rect x={150} y={246} width={92} height={18} fill="url(#izmStone)" />
      <Rect x={146} y={258} width={100} height={6} fill="#E2C493" />
      <Rect x={168} y={196} width={56} height={50} fill="url(#izmStone)" />
      <Path d="M176 246 V224 A9 9 0 0 1 194 224 V246 Z" fill="#B18758" />
      <Path d="M198 246 V224 A9 9 0 0 1 216 224 V246 Z" fill="#B18758" />
      <Rect x={163} y={190} width={66} height={7} fill="#E6CB9C" />
      <Rect x={174} y={150} width={44} height={40} fill="url(#izmStone)" />
      <Path d="M182 186 V166 A5 5 0 0 1 192 166 V186 Z" fill="#B18758" />
      <Path d="M200 186 V166 A5 5 0 0 1 210 166 V186 Z" fill="#B18758" />
      <Rect x={169} y={144} width={54} height={7} fill="#E6CB9C" />
      <Rect x={180} y={108} width={32} height={37} fill="url(#izmStone)" />
      <Circle cx={196} cy={125} r={11} fill="#FFFFFF" stroke="#9C7547" strokeWidth={2} />
      <Path d="M196 125 L196 118" stroke="#3A2A1A" strokeWidth={2} strokeLinecap="round" />
      <Rect x={176} y={102} width={40} height={7} fill="#E6CB9C" />
      <Path d="M182 102 Q196 76 210 102 Z" fill="#C7D3DC" />
      <Rect x={195} y={66} width={2} height={14} fill="#9C7547" />
      <Circle cx={196} cy={64} r={3} fill="#E8B13A" />
    </G>
    <G>
      <Path
        d="M22 300 Q18 250 28 210"
        stroke="#9A6B3F"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M28 210 Q6 200 -8 216 M28 210 Q48 196 66 212 M28 210 Q20 186 2 184 M28 210 Q40 186 60 188"
        stroke="#2FA36B"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
    </G>
    <G>
      <Path
        d="M300 300 Q306 250 298 212"
        stroke="#9A6B3F"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M298 212 Q276 202 262 218 M298 212 Q318 198 336 214 M298 212 Q290 188 272 186 M298 212 Q310 188 330 190"
        stroke="#2FA36B"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
    </G>
    <G>
      <Path
        d="M370 300 Q364 256 372 222"
        stroke="#9A6B3F"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M372 222 Q352 214 340 228 M372 222 Q390 210 404 224 M372 222 Q364 200 348 198"
        stroke="#2FA36B"
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
      />
    </G>
    <G fill="none" stroke="#2F6B8F" strokeWidth={2} strokeLinecap="round">
      <Path d="M250 70 q6 -6 12 0 q6 -6 12 0" />
      <Path d="M330 110 q5 -5 10 0 q5 -5 10 0" />
    </G>
  </>
);

const sailboat = (
  <G>
    <Path d="M300 226 L318 226 L314 231 L304 231 Z" fill="#FFFFFF" />
    <Path d="M309 224 L309 206 L318 224 Z" fill="#FFFFFF" />
  </G>
);

const ferry = (
  <G>
    <Path d="M0 248 L50 248 L45 256 L5 256 Z" fill="#FFFFFF" />
    <Rect x={8} y={240} width={34} height={8} rx={2} fill="#FFFFFF" />
    <Rect x={11} y={243} width={28} height={2} fill="#2A5F8F" />
    <Rect x={24} y={232} width={5} height={8} fill="#E8622A" />
  </G>
);

const clockHand = (
  <Path d="M196 125 L201 125" stroke="#3A2A1A" strokeWidth={1.6} strokeLinecap="round" />
);

const tram = (
  <G>
    <Rect
      x={0}
      y={300}
      width={120}
      height={26}
      rx={8}
      fill="#FFFFFF"
      stroke="#1584C6"
      strokeWidth={2}
    />
    <Rect x={0} y={318} width={120} height={5} fill="#1584C6" />
    <Rect x={8} y={305} width={14} height={9} rx={2} fill="#9FD8F5" />
    <Rect x={28} y={305} width={14} height={9} rx={2} fill="#9FD8F5" />
    <Rect x={48} y={305} width={14} height={9} rx={2} fill="#9FD8F5" />
    <Rect x={68} y={305} width={14} height={9} rx={2} fill="#9FD8F5" />
    <Rect x={88} y={305} width={14} height={9} rx={2} fill="#9FD8F5" />
    <Path d="M56 300 L64 290 L72 300" stroke="#3A3A3A" strokeWidth={1.5} fill="none" />
  </G>
);

const IZMIR: SceneDefinition = {
  defs,
  layers: [layer0, layer1],
  sprites: [
    {
      box: [299, 205, 20, 27],
      after: 0,
      content: sailboat,
      motion: { translate: { x: [0, -50, 0], y: [0, 0, 0], dur: 20000 } },
    },
    {
      box: [-1, 231, 52, 26],
      after: 0,
      content: ferry,
      motion: { translate: { x: [-80, 420], y: [0, 0], dur: 30000 } },
    },
    {
      box: [194, 123, 9, 4],
      origin: [196, 125],
      after: 1,
      content: clockHand,
      motion: { rotate: { values: [0, 360], dur: 12000 } },
    },
    {
      box: [-2, 288, 124, 40],
      after: 1,
      content: tram,
      motion: { translate: { x: [-140, 420], y: [0, 0], dur: 16000 } },
    },
  ],
};

/**
 * İzmir sahnesi: `docs/tasarim/kaynak/Sahne.dc.html` içindeki `is.izmir` bloğunun
 * react-native-svg karşılığı. Şekiller, renkler, gradyanlar ve katman sırası kaynaktakiyle aynı;
 * hareketli parçalar (sailboat, ferry, clockHand, tram) ayrı sprite'lardır.
 */
export const IzmirScene = memo(function IzmirScene(props: SceneProps) {
  return <SceneCanvas scene={IZMIR} {...props} />;
});
