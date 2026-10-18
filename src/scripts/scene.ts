/**
 * Illustrated scene generator.
 *
 * Draws soft, layered "paper-cut" landscapes as inline SVG. These stand in for
 * photography until real images are added via `cover.image` in the content files.
 * Everything is deterministic, so a scene looks the same on every build.
 */

export type SceneName =
  | 'himalaya'
  | 'ghats'
  | 'golden'
  | 'ruins'
  | 'riverhills'
  | 'bodhi'
  | 'gopuram'
  | 'valley'
  | 'island'
  | 'backwater'
  | 'lamp'
  | 'path'
  | 'stillness'
  | 'monastery'
  | 'yamuna'
  | 'journey';

type Palette = {
  sky: [string, string, string];
  sun: string;
  ridges: [string, string, string, string];
  water: [string, string];
  accent: string;
};

const palettes: Record<string, Palette> = {
  dawn: {
    sky: ['#E7B49B', '#F2D3B6', '#FAEBD9'],
    sun: '#F8D29A',
    ridges: ['#DDB29C', '#C08E7B', '#91665D', '#5C4044'],
    water: ['#EBC8AE', '#C9988A'],
    accent: '#F3A65A',
  },
  dusk: {
    sky: ['#3C4166', '#9C6C80', '#EBA67F'],
    sun: '#F7C47A',
    ridges: ['#94708A', '#6A5370', '#47395B', '#2A2540'],
    water: ['#B9808A', '#3F3858'],
    accent: '#FFB65C',
  },
  day: {
    sky: ['#B9D0D4', '#D9E4DF', '#F1F1E7'],
    sun: '#FFF6DC',
    ridges: ['#B2C6BE', '#8BA799', '#638371', '#3F5C4E'],
    water: ['#BFD5D2', '#7E9F9A'],
    accent: '#E9A94B',
  },
  night: {
    sky: ['#161A36', '#2A2F57', '#4A4F7D'],
    sun: '#F3E9CC',
    ridges: ['#3C4170', '#2E335A', '#232745', '#161930'],
    water: ['#2E335A', '#12152A'],
    accent: '#FFB24D',
  },
  mist: {
    sky: ['#D3DBD0', '#E6E8DE', '#F5F1E8'],
    sun: '#FBF5E8',
    ridges: ['#C1CABB', '#9EAB98', '#778772', '#4E5D4B'],
    water: ['#D4DCD3', '#93A69A'],
    accent: '#D99A52',
  },
  gold: {
    sky: ['#EBBE7E', '#F4D9A9', '#FBF0DB'],
    sun: '#FFE7AA',
    ridges: ['#DDB680', '#BD8F5E', '#8E6544', '#5B3F2C'],
    water: ['#EED3A0', '#B8894F'],
    accent: '#E2A23B',
  },
};

const sceneConfig: Record<SceneName, { palette: keyof typeof palettes; seed: number }> = {
  himalaya: { palette: 'dawn', seed: 3 },
  ghats: { palette: 'dusk', seed: 7 },
  golden: { palette: 'gold', seed: 11 },
  ruins: { palette: 'gold', seed: 5 },
  riverhills: { palette: 'mist', seed: 9 },
  bodhi: { palette: 'dawn', seed: 13 },
  gopuram: { palette: 'dusk', seed: 17 },
  valley: { palette: 'day', seed: 19 },
  island: { palette: 'mist', seed: 23 },
  backwater: { palette: 'day', seed: 29 },
  lamp: { palette: 'night', seed: 31 },
  path: { palette: 'dawn', seed: 37 },
  stillness: { palette: 'mist', seed: 41 },
  monastery: { palette: 'day', seed: 43 },
  yamuna: { palette: 'dawn', seed: 47 },
  journey: { palette: 'dusk', seed: 53 },
};

const W = 1600;
const H = 1000;

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Smooth ridge line across the canvas, closed to the bottom edge. */
function ridge(seed: number, baseY: number, amp: number, opts: { peaky?: boolean; freq?: number } = {}) {
  const r = rng(seed);
  const freq = opts.freq ?? 1;
  const phases = [r() * 6.28, r() * 6.28, r() * 6.28];
  const pts: [number, number][] = [];
  for (let x = -60; x <= W + 60; x += 40) {
    const t = x / W;
    let n =
      Math.sin(t * 6.28 * 1.1 * freq + phases[0]) * 0.55 +
      Math.sin(t * 6.28 * 2.7 * freq + phases[1]) * 0.3 +
      Math.sin(t * 6.28 * 5.3 * freq + phases[2]) * 0.15;
    if (opts.peaky) n = 1 - Math.abs(n) * 1.6;
    pts.push([x, baseY - n * amp]);
  }
  let d = `M${pts[0][0]},${H + 10} L${pts[0][0]},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${x},${y.toFixed(1)} ${((x + nx) / 2).toFixed(1)},${((y + ny) / 2).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L${last[0]},${last[1].toFixed(1)} L${last[0]},${H + 10} Z`;
  return d;
}

function birds(seed: number, color: string, count = 5, area = { x: 300, y: 180, w: 500, h: 160 }) {
  const r = rng(seed + 100);
  let out = '';
  for (let i = 0; i < count; i++) {
    const x = area.x + r() * area.w;
    const y = area.y + r() * area.h;
    const s = 8 + r() * 10;
    out += `<path d="M${x - s},${y - s * 0.35} Q${x - s * 0.45},${y - s * 0.55} ${x},${y} Q${x + s * 0.45},${y - s * 0.55} ${x + s},${y - s * 0.35}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>`;
  }
  return out;
}

/** Doves in flight: soft, light silhouettes. */
function doves(color: string) {
  const flock: [number, number, number, number][] = [
    [780, 250, 1.6, -8],
    [1010, 150, 1.05, -4],
    [660, 360, 0.85, -10],
    [1200, 270, 0.7, -6],
  ];
  return flock
    .map(
      ([x, y, k, rot]) =>
        `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${k})" fill="${color}" opacity="0.92"><path d="M0,0 C-10,-14 -28,-20 -46,-13 C-32,-9 -20,-3 -9,6 C-2,11 7,10 13,6 C24,-1 38,-12 50,-21 C35,-22 19,-15 8,-4 C4,-2 2,-1 0,0 Z"/><path d="M12,5 C18,3 24,5 29,9 C23,10 17,9 12,5 Z"/></g>`
    )
    .join('');
}

function shikhara(x: number, base: number, h: number, w: number, c: string) {
  const top = base - h;
  return `<path d="M${x - w / 2},${base} L${x - w / 2},${base - h * 0.3} C${x - w / 2},${base - h * 0.78} ${x - w * 0.16},${top + h * 0.06} ${x},${top + h * 0.04} C${x + w * 0.16},${top + h * 0.06} ${x + w / 2},${base - h * 0.78} ${x + w / 2},${base - h * 0.3} L${x + w / 2},${base} Z" fill="${c}"/>
  <ellipse cx="${x}" cy="${top + h * 0.03}" rx="${w * 0.2}" ry="${h * 0.035}" fill="${c}"/>
  <path d="M${x},${top} L${x},${top - h * 0.12}" stroke="${c}" stroke-width="${Math.max(2, w * 0.03)}"/>
  <path d="M${x},${top - h * 0.12} L${x + w * 0.32},${top - h * 0.08} L${x},${top - h * 0.04} Z" fill="${c}"/>`;
}

function reflection(content: string, axisY: number, id: string, opacity = 0.28) {
  return `<g opacity="${opacity}" filter="url(#blur-${id})" transform="translate(0 ${axisY * 2}) scale(1 -1)">${content}</g>`;
}

function water(id: string, y: number, p: Palette) {
  let lines = '';
  const r = rng(y);
  for (let i = 0; i < 18; i++) {
    const ly = y + 20 + i * ((H - y) / 18);
    const lx = r() * W;
    const lw = 60 + r() * 220;
    lines += `<path d="M${lx},${ly.toFixed(0)} h${lw.toFixed(0)}" stroke="#fff" stroke-opacity="${(0.12 + r() * 0.18).toFixed(2)}" stroke-width="2" stroke-linecap="round"/>`;
  }
  return `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="url(#water-${id})"/>${lines}`;
}

function landmark(scene: SceneName, p: Palette, id: string, seed: number): { back?: string; front: string } {
  const [r1, r2, r3, r4] = p.ridges;
  const r = rng(seed + 7);
  switch (scene) {
    case 'himalaya': {
      const hill = `<path d="M-20,${H} L-20,820 C200,770 420,800 640,760 C820,728 980,690 1120,700 C1300,712 1460,770 1620,760 L1620,${H} Z" fill="${r4}"/>`;
      const shrine = `<g>${shikhara(1110, 704, 120, 70, r4)}<rect x="1060" y="690" width="100" height="18" fill="${r4}"/></g>`;
      const flags = `<path d="M1180,700 L1180,600" stroke="${r4}" stroke-width="3"/><path d="M1180,602 Q1240,620 1300,640" stroke="${r4}" stroke-width="1.5" fill="none"/>${[0, 1, 2, 3, 4]
        .map((i) => {
          const fx = 1192 + i * 22;
          const fy = 607 + i * 7.2;
          const col = ['#C2493D', '#E6B54A', '#F4EEE2', '#3E7C6B', '#3C5C9E'][i];
          return `<path d="M${fx},${fy} l12,4 l-2,14 l-12,-4 Z" fill="${col}" opacity="0.85"/>`;
        })
        .join('')}`;
      return { front: hill + shrine + flags };
    }
    case 'yamuna':
    case 'ghats': {
      const shore = 640;
      let city = `<rect x="0" y="${shore - 60}" width="${W}" height="${H}" fill="${r3}"/>`;
      let x = -20;
      while (x < W + 40) {
        const bw = 60 + r() * 110;
        const bh = 40 + r() * 120;
        city += `<rect x="${x.toFixed(0)}" y="${(shore - 60 - bh).toFixed(0)}" width="${bw.toFixed(0)}" height="${(bh + 2).toFixed(0)}" fill="${r3}"/>`;
        if (r() > 0.55) city += shikhara(x + bw / 2, shore - 60 - bh + 2, 70 + r() * 90, 34 + r() * 26, r3);
        if (r() > 0.6) {
          const wy = shore - 60 - bh + 20;
          city += `<rect x="${(x + bw * 0.3).toFixed(0)}" y="${wy.toFixed(0)}" width="8" height="12" fill="${p.accent}" opacity="0.7"/>`;
        }
        x += bw - 4;
      }
      let steps = '';
      for (let i = 0; i < 6; i++) {
        steps += `<rect x="0" y="${shore - 60 + i * 12}" width="${W}" height="6" fill="${r2}" opacity="${0.18 + i * 0.05}"/>`;
      }
      const boats = [
        [380, 800, 1],
        [1050, 860, 1.3],
        [1380, 760, 0.8],
      ]
        .map(([bx, by, s]) => `<g transform="translate(${bx} ${by}) scale(${s})"><path d="M-70,0 Q0,26 70,0 L60,-8 L-60,-8 Z" fill="${r4}"/><circle cx="-10" cy="-30" r="7" fill="${r4}"/><path d="M-18,-8 L-10,-24 L-2,-8 Z" fill="${r4}"/><path d="M10,-8 L40,-60" stroke="${r4}" stroke-width="3"/></g>`)
        .join('');
      let diyas = '';
      for (let i = 0; i < 14; i++) {
        const dx = 100 + r() * 1400;
        const dy = 700 + r() * 260;
        diyas += `<circle cx="${dx.toFixed(0)}" cy="${dy.toFixed(0)}" r="16" fill="${p.accent}" opacity="0.18"/><circle cx="${dx.toFixed(0)}" cy="${dy.toFixed(0)}" r="4" fill="${p.accent}"/>`;
      }
      return {
        front: `${city}${steps}${reflection(city, shore, id, 0.22)}${water(id, shore, p).replace('<rect', '<rect opacity="0.92"')}${boats}${diyas}`,
      };
    }
    case 'golden': {
      const shore = 640;
      const gold = `url(#gold-${id})`;
      const back = `<rect x="0" y="${shore - 120}" width="${W}" height="140" fill="#F6EEDF"/>${Array.from({ length: 30 })
        .map((_, i) => `<rect x="${i * 56 + 14}" y="${shore - 92}" width="22" height="34" rx="11" fill="${r2}" opacity="0.35"/>`)
        .join('')}<rect x="0" y="${shore - 126}" width="${W}" height="10" fill="${r2}" opacity="0.4"/>`;
      const cx = 800;
      const temple = `<g>
        <rect x="${cx - 150}" y="${shore - 150}" width="300" height="150" fill="${gold}"/>
        <rect x="${cx - 110}" y="${shore - 230}" width="220" height="82" fill="${gold}"/>
        <path d="M${cx - 95},${shore - 230} C${cx - 110},${shore - 330} ${cx - 30},${shore - 360} ${cx},${shore - 400} C${cx + 30},${shore - 360} ${cx + 110},${shore - 330} ${cx + 95},${shore - 230} Z" fill="${gold}"/>
        <path d="M${cx},${shore - 400} L${cx},${shore - 440}" stroke="${p.ridges[2]}" stroke-width="4"/>
        ${[-150, 150, -110, 110]
          .map((dx, i) => {
            const by = i < 2 ? shore - 150 : shore - 230;
            return `<path d="M${cx + dx - 16},${by} C${cx + dx - 18},${by - 34} ${cx + dx},${by - 46} ${cx + dx},${by - 54} C${cx + dx},${by - 46} ${cx + dx + 18},${by - 34} ${cx + dx + 16},${by} Z" fill="${gold}"/>`;
          })
          .join('')}
        ${Array.from({ length: 6 })
          .map((_, i) => `<rect x="${cx - 130 + i * 46}" y="${shore - 120}" width="20" height="50" rx="10" fill="${r3}" opacity="0.45"/>`)
          .join('')}
        <rect x="${cx - 150}" y="${shore - 16}" width="300" height="16" fill="${r3}" opacity="0.35"/>
      </g>`;
      const causeway = `<rect x="0" y="${shore - 8}" width="${cx - 150}" height="14" fill="#F4E9D6"/>`;
      const all = back + temple + causeway;
      return {
        front: `${back}${water(id, shore, p)}${reflection(all, shore, id, 0.45)}${temple}${causeway}`,
      };
    }
    case 'ruins': {
      let boulders = '';
      for (let i = 0; i < 22; i++) {
        const bx = r() * W;
        const by = 640 + r() * 80;
        const br = 40 + r() * 90;
        boulders += `<ellipse cx="${bx.toFixed(0)}" cy="${by.toFixed(0)}" rx="${br.toFixed(0)}" ry="${(br * 0.8).toFixed(0)}" fill="${i % 2 ? r3 : r2}"/>`;
      }
      const ground = `<path d="M-20,${H} L-20,760 C300,740 700,770 1000,750 C1250,735 1450,760 1620,750 L1620,${H} Z" fill="${r4}"/>`;
      const px = 980;
      const gy = 752;
      let cols = '';
      for (let i = 0; i < 7; i++) cols += `<rect x="${px - 200 + i * 62}" y="${gy - 150}" width="22" height="150" fill="${r4}"/>`;
      const pavilion = `<rect x="${px - 230}" y="${gy - 172}" width="440" height="24" fill="${r4}"/><rect x="${px - 210}" y="${gy - 190}" width="400" height="20" fill="${r4}"/>${cols}<rect x="${px - 240}" y="${gy - 6}" width="460" height="10" fill="${r4}"/>`;
      const tower = `<path d="M${px - 140},${gy - 190} L${px - 120},${gy - 260} L${px - 100},${gy - 260} L${px - 85},${gy - 320} L${px - 55},${gy - 320} L${px - 40},${gy - 260} L${px - 20},${gy - 260} L${px},${gy - 190} Z" fill="${r4}"/>`;
      return { front: boulders + ground + pavilion + tower };
    }
    case 'riverhills': {
      const riverY = 720;
      const towerL = 420;
      const towerR = 1180;
      const deck = 640;
      const bridge = `<rect x="${towerL - 14}" y="${deck - 190}" width="28" height="200" fill="${r4}"/><rect x="${towerR - 14}" y="${deck - 190}" width="28" height="200" fill="${r4}"/>
        <path d="M-40,${deck - 120} Q${towerL - 200},${deck - 60} ${towerL},${deck - 186} Q800,${deck + 10} ${towerR},${deck - 186} Q${towerR + 200},${deck - 60} 1640,${deck - 120}" fill="none" stroke="${r4}" stroke-width="5"/>
        <rect x="-20" y="${deck}" width="1640" height="10" fill="${r4}"/>
        ${Array.from({ length: 30 })
          .map((_, i) => {
            const x = towerL + 20 + i * ((towerR - towerL - 40) / 29);
            const t = (x - towerL) / (towerR - towerL);
            const cy = deck - 186 + 4 * t * (1 - t) * 186 * 0.98;
            return `<path d="M${x.toFixed(0)},${cy.toFixed(0)} L${x.toFixed(0)},${deck}" stroke="${r4}" stroke-width="1.5"/>`;
          })
          .join('')}`;
      const banks = `<path d="M-20,${H} L-20,700 C150,690 260,740 300,${riverY + 40} L240,${H} Z" fill="${r4}"/><path d="M1620,${H} L1620,690 C1420,700 1330,740 1300,${riverY + 40} L1380,${H} Z" fill="${r4}"/>`;
      return { front: water(id, riverY, p) + bridge + banks };
    }
    case 'bodhi': {
      const gy = 780;
      const ground = `<path d="M-20,${H} L-20,${gy} L1620,${gy} L1620,${H} Z" fill="${r4}"/>`;
      const tx = 920;
      const tower = `<path d="M${tx - 90},${gy} L${tx - 50},${gy - 420} L${tx + 50},${gy - 420} L${tx + 90},${gy} Z" fill="${r4}"/>
        <path d="M${tx - 50},${gy - 420} Q${tx},${gy - 470} ${tx + 50},${gy - 420} Z" fill="${r4}"/>
        <path d="M${tx},${gy - 460} L${tx},${gy - 520}" stroke="${r4}" stroke-width="5"/>
        <ellipse cx="${tx}" cy="${gy - 500}" rx="12" ry="5" fill="${r4}"/>
        ${[-1, 1]
          .map((s) => `<path d="M${tx + s * 150 - 30},${gy} L${tx + s * 150 - 18},${gy - 150} L${tx + s * 150 + 18},${gy - 150} L${tx + s * 150 + 30},${gy} Z" fill="${r4}"/><path d="M${tx + s * 150},${gy - 150} L${tx + s * 150},${gy - 180}" stroke="${r4}" stroke-width="3"/>`)
          .join('')}
        <rect x="${tx - 210}" y="${gy - 60}" width="420" height="60" fill="${r4}"/>
        ${Array.from({ length: 9 }).map((_, i) => `<rect x="${tx - 30}" y="${gy - 400 + i * 40}" width="60" height="4" fill="${r3}" opacity="0.6"/>`).join('')}`;
      let canopy = '';
      for (let i = 0; i < 26; i++) {
        const cx = 360 + (r() - 0.5) * 420;
        const cy = 480 + (r() - 0.5) * 220;
        canopy += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${(60 + r() * 70).toFixed(0)}" fill="${r4}"/>`;
      }
      const tree = `<path d="M330,${gy} C340,680 320,620 300,560 L330,560 C350,600 370,640 380,600 L400,600 C390,660 400,720 420,${gy} Z" fill="${r4}"/>${canopy}`;
      return { front: ground + tree + tower };
    }
    case 'gopuram': {
      const gy = 820;
      const tiers = (cx: number, w0: number, tierH: number, n: number, c: string) => {
        let s = '';
        for (let i = 0; i < n; i++) {
          const w = w0 * (1 - i * 0.085);
          const wn = w0 * (1 - (i + 1) * 0.085);
          const y = gy - 120 - i * tierH;
          s += `<path d="M${cx - w / 2},${y} L${cx - wn / 2},${y - tierH} L${cx + wn / 2},${y - tierH} L${cx + w / 2},${y} Z" fill="${c}"/>`;
          s += `<rect x="${cx - w / 2 - 6}" y="${y - 6}" width="${w + 12}" height="6" fill="${c}"/>`;
          for (let k = 0; k < 5; k++) s += `<rect x="${cx - w / 2 + 12 + k * ((w - 30) / 4)}" y="${y - tierH + 12}" width="6" height="${tierH - 22}" fill="${p.ridges[1]}" opacity="0.35"/>`;
        }
        const wt = w0 * (1 - n * 0.085);
        const ty = gy - 120 - n * tierH;
        s += `<path d="M${cx - wt / 2},${ty} L${cx - wt / 2},${ty - 26} Q${cx},${ty - 70} ${cx + wt / 2},${ty - 26} L${cx + wt / 2},${ty} Z" fill="${c}"/>`;
        for (let k = 0; k < 5; k++) {
          const fx = cx - wt / 2 + 14 + k * ((wt - 28) / 4);
          s += `<path d="M${fx},${ty - 40 - (k === 2 ? 14 : 0)} l0,-24" stroke="${c}" stroke-width="5" stroke-linecap="round"/>`;
        }
        s += `<rect x="${cx - w0 / 2}" y="${gy - 120}" width="${w0}" height="120" fill="${c}"/><path d="M${cx - 34},${gy} L${cx - 34},${gy - 70} Q${cx},${gy - 108} ${cx + 34},${gy - 70} L${cx + 34},${gy} Z" fill="${p.accent}" opacity="0.55"/>`;
        return s;
      };
      const ground = `<rect x="-20" y="${gy}" width="1640" height="${H - gy}" fill="${r4}"/>`;
      return { front: tiers(380, 200, 46, 6, r3) + tiers(1250, 180, 40, 5, r3) + tiers(820, 320, 56, 8, r4) + ground };
    }
    case 'valley': {
      const meadow = `<path d="M-20,${H} L-20,690 C300,630 600,670 900,650 C1150,635 1400,670 1620,650 L1620,${H} Z" fill="#6E8B5E"/><path d="M-20,${H} L-20,800 C400,760 900,790 1620,770 L1620,${H} Z" fill="#587A4E"/>`;
      let flowers = '';
      const cols = ['#E7A1B6', '#F3D36B', '#B79AD8', '#F8F3E8', '#E98D7A'];
      for (let i = 0; i < 340; i++) {
        const fx = r() * W;
        const fy = 670 + Math.pow(r(), 0.8) * 330;
        const fr = 2 + ((fy - 670) / 330) * 7;
        flowers += `<circle cx="${fx.toFixed(0)}" cy="${fy.toFixed(0)}" r="${fr.toFixed(1)}" fill="${cols[i % cols.length]}" opacity="0.9"/>`;
      }
      return { front: meadow + flowers };
    }
    case 'island': {
      const wy = 660;
      const land = `<path d="M180,${wy + 10} C400,${wy - 30} 1100,${wy - 34} 1440,${wy + 8} Z" fill="${r3}"/>`;
      let huts = '';
      [440, 560, 960, 1080].forEach((hx, i) => {
        const s = i % 2 ? 0.85 : 1;
        huts += `<g transform="translate(${hx} ${wy - 22}) scale(${s})"><path d="M-50,-40 L0,-80 L50,-40 Z" fill="${r4}"/><rect x="-40" y="-40" width="80" height="34" fill="${r4}"/>${[-34, -12, 12, 34].map((lx) => `<rect x="${lx - 2}" y="-6" width="4" height="26" fill="${r4}"/>`).join('')}</g>`;
      });
      let trees = '';
      for (let i = 0; i < 9; i++) {
        const tx = 300 + i * 120 + r() * 40;
        if (Math.abs(tx - 500) < 70 || Math.abs(tx - 1020) < 70) continue;
        trees += `<path d="M${tx},${wy - 10} L${tx - 4},${wy - 120}" stroke="${r4}" stroke-width="5"/><ellipse cx="${tx - 4}" cy="${wy - 130}" rx="${30 + r() * 20}" ry="22" fill="${r4}"/>`;
      }
      const boat = `<g transform="translate(1180 840)"><path d="M-110,0 Q0,22 110,0 L96,-10 L-96,-10 Z" fill="${r4}"/><path d="M40,-10 L-20,-90" stroke="${r4}" stroke-width="3"/><circle cx="50" cy="-34" r="8" fill="${r4}"/><path d="M42,-10 L50,-28 L58,-10 Z" fill="${r4}"/></g>`;
      const scene = land + huts + trees;
      return { front: water(id, wy, p) + reflection(scene, wy + 8, id, 0.3) + scene + boat };
    }
    case 'backwater': {
      const wy = 640;
      const bank = `<path d="M-20,${wy + 4} L-20,${wy - 30} C400,${wy - 40} 1200,${wy - 40} 1620,${wy - 30} L1620,${wy + 4} Z" fill="${r4}"/>`;
      const palm = (x: number, y: number, h: number, lean: number) => {
        const topx = x + lean;
        const topy = y - h;
        let fr = '';
        for (let a = 0; a < 9; a++) {
          const ang = (a / 9) * Math.PI * 2;
          const ex = topx + Math.cos(ang) * 110;
          const ey = topy + Math.sin(ang) * 40 + 40;
          fr += `<path d="M${topx},${topy} Q${(topx + ex) / 2},${topy - 40} ${ex.toFixed(0)},${ey.toFixed(0)}" fill="none" stroke="${r4}" stroke-width="10" stroke-linecap="round"/>`;
        }
        return `<path d="M${x},${y} Q${x + lean * 0.2},${y - h * 0.6} ${topx},${topy}" fill="none" stroke="${r4}" stroke-width="12" stroke-linecap="round"/>${fr}`;
      };
      const palms = palm(160, wy - 20, 330, 60) + palm(330, wy - 20, 260, -40) + palm(1260, wy - 20, 300, -70) + palm(1460, wy - 20, 360, 30) + palm(1080, wy - 20, 200, 30);
      const boat = `<g transform="translate(720 ${wy + 140})"><path d="M-260,0 Q-200,40 0,44 Q200,40 270,-10 L250,-10 Q0,6 -240,-6 Z" fill="${r4}"/><path d="M-170,-6 L-170,-60 Q-40,-120 120,-60 L120,-6 Z" fill="#C59A6B"/><path d="M-170,-60 Q-40,-120 120,-60" fill="none" stroke="${r4}" stroke-width="5"/>${[-130, -80, -30, 20, 70].map((wx) => `<rect x="${wx}" y="-46" width="26" height="24" rx="4" fill="${r4}" opacity="0.65"/>`).join('')}</g>`;
      const top = bank + palms;
      return { front: water(id, wy, p) + reflection(top, wy, id, 0.3) + top + boat };
    }
    case 'lamp': {
      const wy = 700;
      const lx = 800;
      const ly = 660;
      const lampSvg = `<circle cx="${lx}" cy="${ly - 60}" r="260" fill="url(#glow-${id})"/>
        <path d="M${lx - 120},${ly} Q${lx},${ly + 90} ${lx + 120},${ly} Q${lx},${ly + 26} ${lx - 120},${ly} Z" fill="#8A4B2E"/>
        <path d="M${lx - 120},${ly} Q${lx},${ly + 26} ${lx + 120},${ly}" fill="none" stroke="#C0784A" stroke-width="4"/>
        <path d="M${lx},${ly - 4} C${lx - 30},${ly - 40} ${lx - 8},${ly - 90} ${lx},${ly - 130} C${lx + 8},${ly - 90} ${lx + 30},${ly - 40} ${lx},${ly - 4} Z" fill="#FFC861"/>
        <path d="M${lx},${ly - 10} C${lx - 12},${ly - 34} ${lx - 4},${ly - 64} ${lx},${ly - 86} C${lx + 4},${ly - 64} ${lx + 12},${ly - 34} ${lx},${ly - 10} Z" fill="#FFF3CF"/>`;
      let stars = '';
      for (let i = 0; i < 80; i++) stars += `<circle cx="${(r() * W).toFixed(0)}" cy="${(r() * 480).toFixed(0)}" r="${(0.8 + r() * 1.8).toFixed(1)}" fill="#fff" opacity="${(0.3 + r() * 0.6).toFixed(2)}"/>`;
      const big = `<g transform="translate(${lx} ${ly}) scale(1.7) translate(${-lx} ${-ly})">${lampSvg}</g>`;
      return { back: stars, front: water(id, wy, p) + reflection(big, wy, id, 0.35) + big };
    }
    case 'journey':
    case 'path': {
      const hills = `<path d="M-20,${H} L-20,760 C300,720 600,780 900,740 C1200,700 1400,760 1620,730 L1620,${H} Z" fill="${r4}"/>`;
      const trail = `<path d="M560,${H} C620,920 1000,900 940,840 C890,790 760,800 820,770 C860,752 930,752 960,742 L972,744 C950,756 880,762 850,776 C800,800 980,808 1010,850 C1060,920 760,950 760,${H} Z" fill="${p.sky[2]}" opacity="0.75"/>`;
      const walker = `<g transform="translate(964 728)"><circle cx="0" cy="-26" r="5" fill="${r4}"/><path d="M-5,-20 L5,-20 L7,0 L-7,0 Z" fill="${r4}"/><path d="M8,-22 L12,2" stroke="${r4}" stroke-width="1.8"/></g>`;
      return { front: hills + trail + walker };
    }
    case 'stillness': {
      const wy = 640;
      const rock = `<path d="M560,${H} L600,820 C640,770 760,760 840,770 C920,780 980,800 1020,850 L1060,${H} Z" fill="${r4}"/>`;
      const fig = `<g transform="translate(800 768)"><circle cx="0" cy="-74" r="14" fill="${r4}"/><path d="M-16,-58 Q0,-64 16,-58 L22,-24 L-22,-24 Z" fill="${r4}"/><path d="M-44,-4 Q-30,-28 0,-26 Q30,-28 44,-4 Z" fill="${r4}"/></g>`;
      return { front: water(id, wy, p) + rock + fig };
    }
    case 'monastery': {
      const hill = `<path d="M-20,${H} L-20,800 C200,760 420,640 700,600 C900,572 1100,600 1300,680 C1450,740 1550,760 1620,770 L1620,${H} Z" fill="${r4}"/>`;
      const bx = 820;
      const by = 600;
      let blocks = `<rect x="${bx - 220}" y="${by - 90}" width="440" height="100" fill="#EFE9DC"/><rect x="${bx - 120}" y="${by - 170}" width="240" height="90" fill="#EFE9DC"/><rect x="${bx - 60}" y="${by - 220}" width="120" height="56" fill="#9E3B2F"/><path d="M${bx - 80},${by - 220} L${bx},${by - 260} L${bx + 80},${by - 220} Z" fill="#C8973E"/><rect x="${bx - 230}" y="${by - 96}" width="460" height="10" fill="#9E3B2F"/><rect x="${bx - 130}" y="${by - 176}" width="260" height="10" fill="#9E3B2F"/>`;
      for (let i = 0; i < 9; i++) blocks += `<rect x="${bx - 200 + i * 48}" y="${by - 66}" width="16" height="24" fill="${r4}" opacity="0.75"/>`;
      for (let i = 0; i < 5; i++) blocks += `<rect x="${bx - 100 + i * 48}" y="${by - 150}" width="16" height="22" fill="${r4}" opacity="0.75"/>`;
      let flags = `<path d="M240,760 Q500,560 700,540" stroke="${r4}" stroke-width="1.5" fill="none"/>`;
      for (let i = 0; i < 18; i++) {
        const t = i / 18;
        const fx = 240 + t * 460;
        const fy = 760 * (1 - t) * (1 - t) + 2 * (1 - t) * t * 560 + t * t * 540;
        const col = ['#3C5C9E', '#F4EEE2', '#C2493D', '#3E7C6B', '#E6B54A'][i % 5];
        flags += `<path d="M${fx.toFixed(0)},${fy.toFixed(0)} l14,2 l-2,18 l-14,-2 Z" fill="${col}"/>`;
      }
      return { front: hill + blocks + flags };
    }
  }
}

let counter = 0;

export function renderScene(scene: SceneName, label: string) {
  const cfg = sceneConfig[scene] ?? sceneConfig.himalaya;
  const p = palettes[cfg.palette];
  const id = `s${++counter}`;
  const [r1, r2, r3] = p.ridges;
  const seed = cfg.seed;

  const peaky = scene === 'himalaya' || scene === 'valley' || scene === 'monastery';
  const sunY = scene === 'lamp' ? 170 : scene === 'journey' ? 470 : scene === 'golden' || scene === 'ghats' ? 380 : 330;
  const sunX = scene === 'ghats' || scene === 'yamuna' ? 1180 : scene === 'golden' ? 1260 : scene === 'journey' ? 1010 : 470;
  const sunR = scene === 'lamp' ? 44 : scene === 'journey' ? 110 : 90;

  const lm = landmark(scene, p, id, seed);
  const hasFarRidges = !['golden', 'lamp', 'stillness', 'island'].includes(scene);
  const ridges = hasFarRidges
    ? `<path d="${ridge(seed, 470, peaky ? 210 : 90, { peaky })}" fill="${r1}" opacity="0.85"/>
       <path d="${ridge(seed + 1, 560, peaky ? 170 : 70, { peaky, freq: 1.3 })}" fill="${r2}"/>
       ${['ghats', 'yamuna'].includes(scene) ? '' : `<path d="${ridge(seed + 2, 660, peaky ? 110 : 60, { freq: 1.7 })}" fill="${r3}"/>`}`
    : `<path d="${ridge(seed, 600, 40, { freq: 0.8 })}" fill="${r1}" opacity="0.7"/><path d="${ridge(seed + 1, 630, 24, { freq: 1.2 })}" fill="${r2}" opacity="0.8"/>`;

  return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label.replace(/"/g, '&quot;')}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="0.55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/>
    </linearGradient>
    <linearGradient id="water-${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${p.water[0]}"/><stop offset="1" stop-color="${p.water[1]}"/>
    </linearGradient>
    <linearGradient id="gold-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F7D774"/><stop offset="0.5" stop-color="#D9A33A"/><stop offset="1" stop-color="#B7802A"/>
    </linearGradient>
    <radialGradient id="sun-${id}">
      <stop offset="0" stop-color="${p.sun}" stop-opacity="0.95"/><stop offset="0.35" stop-color="${p.sun}" stop-opacity="0.45"/><stop offset="1" stop-color="${p.sun}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-${id}">
      <stop offset="0" stop-color="#FFC861" stop-opacity="0.55"/><stop offset="1" stop-color="#FFC861" stop-opacity="0"/>
    </radialGradient>
    <filter id="blur-${id}"><feGaussianBlur stdDeviation="4"/></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky-${id})"/>
  ${lm.back ?? ''}
  <circle cx="${sunX}" cy="${sunY}" r="${sunR * 3.4}" fill="url(#sun-${id})"/>
  <circle cx="${sunX}" cy="${sunY}" r="${sunR}" fill="${p.sun}" opacity="0.95"/>
  ${scene === 'journey' ? doves('#F7EBDD') : ''}
  ${scene === 'lamp' || scene === 'journey' ? '' : birds(seed, p.ridges[3], 5, { x: sunX + 120, y: sunY - 160, w: 420, h: 140 })}
  ${ridges}
  ${lm.front}
</svg>`;
}
