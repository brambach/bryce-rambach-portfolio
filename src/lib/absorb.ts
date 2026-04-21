export type AbsorbOptions = {
  source: HTMLInputElement;
  text: string;
  target: { x: number; y: number };
  onLand?: (charIndex: number, total: number) => void;
  onComplete?: () => void;
  reducedMotion?: boolean;
};

const STEPS = 28;
const BASE_DURATION = 1500;
const DURATION_JITTER = 250;
const STAGGER = 28;

const INK: RGB = [31, 29, 26];
const ACCENT: RGB = [200, 112, 74];
const WARM_HI: RGB = [255, 228, 196];

type RGB = [number, number, number];

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

function rgb([r, g, b]: RGB): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

/**
 * Lift each non-space character from the input's rendered position
 * and spiral it into the orb, warming from ink → accent → warm-hi as
 * it falls inward. Triggers onLand per character so the orb can heat up.
 */
export function absorbLetters(opts: AbsorbOptions): void {
  const { source, text, target, onLand, onComplete, reducedMotion } = opts;

  if (!text) {
    onComplete?.();
    return;
  }

  if (reducedMotion) {
    setTimeout(() => {
      onLand?.(0, 1);
      onComplete?.();
    }, 150);
    return;
  }

  const inputRect = source.getBoundingClientRect();
  const cs = getComputedStyle(source);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    onComplete?.();
    return;
  }
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;

  const paddingLeft = parseFloat(cs.paddingLeft) || 0;
  const fontSizePx = parseFloat(cs.fontSize) || 14;
  let xCursor = inputRect.left + paddingLeft;
  const y = inputRect.top + inputRect.height / 2 - fontSizePx / 2;

  type Letter = { ch: string; x: number; y: number };
  const letters: Letter[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const w = ctx.measureText(ch).width;
    if (ch.trim().length > 0) letters.push({ ch, x: xCursor, y });
    xCursor += w;
  }

  if (letters.length === 0) {
    onComplete?.();
    return;
  }

  let landed = 0;
  const total = letters.length;

  letters.forEach((L, i) => {
    const el = document.createElement('span');
    el.textContent = L.ch;
    el.style.cssText = [
      'position:fixed',
      `left:${L.x}px`,
      `top:${L.y}px`,
      'pointer-events:none',
      'z-index:100',
      `font-family:${cs.fontFamily}`,
      `font-size:${cs.fontSize}`,
      `color:${rgb(INK)}`,
      'line-height:1',
      'will-change:transform,opacity,color',
    ].join(';');
    document.body.appendChild(el);

    const dx = target.x - L.x;
    const dy = target.y - L.y;
    const startAngle = Math.atan2(dy, dx);
    const startDist = Math.hypot(dx, dy);

    // Randomize turns (0.8–1.4 full rotations) and direction so the
    // letter stream feels organic rather than mechanical.
    const turns = 0.8 + Math.random() * 0.6;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const spinDeg = (Math.random() - 0.5) * 240;

    const keyframes: Keyframe[] = [];
    for (let s = 0; s <= STEPS; s++) {
      const t = s / STEPS;

      // Radius ease-in: the letter dawdles early, then rushes into the
      // orb. Pow 1.8 concentrates the inward motion at the end.
      const radius = startDist * Math.pow(1 - t, 1.8);
      const angle = startAngle + dir * turns * Math.PI * 2 * t;
      const x = target.x + Math.cos(angle) * radius;
      const y2 = target.y + Math.sin(angle) * radius;

      // Color: ink → accent across the outer 70%, accent → warm-hi
      // across the final 30% as the letter approaches the ember core.
      const color =
        t < 0.7
          ? lerpColor(INK, ACCENT, t / 0.7)
          : lerpColor(ACCENT, WARM_HI, (t - 0.7) / 0.3);

      // Scale bulges at midpoint then collapses into the orb.
      const scale =
        t < 0.5 ? 1 + t * 0.3 : Math.max(0.12, 1.15 - (t - 0.5) * 2.0);

      // Hold opacity until the last ~12% so the letter is clearly
      // visible as it enters the orb before fading.
      const opacity = t < 0.88 ? 1 : Math.max(0, 1 - (t - 0.88) / 0.12);

      // Glow ramps up as the letter heats; peaks near the core.
      const glowAlpha = t < 0.6 ? 0 : (t - 0.6) / 0.4;
      const shadow =
        glowAlpha > 0
          ? `0 0 ${Math.round(12 * glowAlpha)}px rgba(244,201,163,${glowAlpha.toFixed(2)})`
          : 'none';

      keyframes.push({
        left: `${x}px`,
        top: `${y2}px`,
        transform: `scale(${scale}) rotate(${spinDeg * t}deg)`,
        opacity,
        color: rgb(color),
        textShadow: shadow,
        offset: t,
      });
    }

    const duration = BASE_DURATION + Math.random() * DURATION_JITTER;
    const delay = i * STAGGER;

    const anim = el.animate(keyframes, {
      duration,
      delay,
      easing: 'cubic-bezier(0.68, 0, 0.9, 0.2)',
      fill: 'forwards',
    });

    // Fire onLand slightly before the keyframe finishes so the orb's
    // heat-up pulse feels synced with the letter's arrival rather than
    // trailing the final fade-out.
    const landAt = duration + delay - duration * 0.12;
    const landTimer = window.setTimeout(() => {
      onLand?.(i, total);
    }, landAt);

    anim.onfinish = () => {
      el.remove();
      landed++;
      if (landed === total) onComplete?.();
    };
    anim.oncancel = () => {
      window.clearTimeout(landTimer);
      el.remove();
    };
  });
}
