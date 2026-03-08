import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";

/* ── Star data ──────────────────────────────────────────────── */

interface Star {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  layer: number;
  twinklePhase: number;
  twinkleSpeed: number;
  color: [number, number, number];
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  length: number;
  opacity: number;
  progress: number;
  active: boolean;
  cooldown: number;
}

interface Nebula {
  x: number; // 0-1 normalized
  y: number; // 0-1 normalized
  radius: number;
  color: [number, number, number];
  opacity: number;
  driftSpeed: number;
  driftPhase: number;
  parallaxSpeed: number;
}

/* ── Colour palette ─────────────────────────────────────────── */

const COLORS: [number, number, number][] = [
  [255, 255, 255], // pure white
  [215, 230, 255], // blue-white
  [255, 246, 235], // warm white
  [185, 210, 255], // cool blue
  [255, 225, 210], // soft peach
];

const NEBULA_COLORS: [number, number, number][] = [
  [100, 120, 200], // deep blue
  [140, 90, 180],  // violet
  [70, 140, 180],  // teal
  [120, 80, 160],  // purple
  [80, 110, 190],  // steel blue
];

/* ── Layer definitions ──────────────────────────────────────── */

interface LayerCfg {
  count: number;
  sizeMin: number;
  sizeMax: number;
  opMin: number;
  opMax: number;
  speed: number;       // scroll parallax multiplier
  streak: number;      // max motion-blur elongation in px
  mouseInfluence: number; // how much mouse shifts this layer (px)
}

const LAYERS: LayerCfg[] = [
  // L0 — deep space: tiny, almost static — visible dust
  { count: 250, sizeMin: 0.4, sizeMax: 1.0, opMin: 0.2, opMax: 0.5, speed: 0.012, streak: 0, mouseInfluence: 3 },
  // L1 — mid-far — clearly visible small stars
  { count: 120, sizeMin: 0.8, sizeMax: 1.6, opMin: 0.3, opMax: 0.65, speed: 0.05, streak: 0, mouseInfluence: 8 },
  // L2 — mid-near — prominent stars
  { count: 50, sizeMin: 1.2, sizeMax: 2.4, opMin: 0.45, opMax: 0.8, speed: 0.14, streak: 3, mouseInfluence: 16 },
  // L3 — near field: bright, fast, streak on scroll
  { count: 15, sizeMin: 1.6, sizeMax: 3.2, opMin: 0.6, opMax: 0.95, speed: 0.32, streak: 6, mouseInfluence: 28 },
];

/* ── Helpers ─────────────────────────────────────────────────── */

const rand = (lo: number, hi: number) => Math.random() * (hi - lo) + lo;

/* ── Component ──────────────────────────────────────────────── */

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootersRef = useRef<ShootingStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const rafId = useRef(0);
  const scrollY = useRef(0);
  const scrollVel = useRef(0);
  const prevScroll = useRef(0);
  // Mouse position normalized to -1..1 from center (smoothed)
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const targetMouseX = useRef(0);
  const targetMouseY = useRef(0);
  const isTouchDevice = useRef(false);
  const isIdle = useRef(false);
  const idleTimer = useRef(0);
  const reducedMotion = useReducedMotion();

  /* Virtual field height — stars tile over N× the viewport so
     parallax scrolling stays seamless regardless of page length */
  const FIELD_H = 5;

  /* ── Generate stars ───────────────────────────────────────── */

  const seed = useCallback((w: number, h: number) => {
    const mobile = w < 768;
    const stars: Star[] = [];

    for (let li = 0; li < LAYERS.length; li++) {
      const L = LAYERS[li];
      const n = mobile ? Math.floor(L.count * 0.45) : L.count;
      for (let i = 0; i < n; i++) {
        stars.push({
          x: Math.random() * (w + 40) - 20,
          y: Math.random() * (mobile ? h : h * FIELD_H),
          size: rand(L.sizeMin, L.sizeMax),
          baseOpacity: rand(L.opMin, L.opMax),
          layer: li,
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: rand(0.25, 1.1),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }
    starsRef.current = stars;

    // Shooting stars (pool of 3, reused)
    const shooters: ShootingStar[] = [];
    for (let i = 0; i < 3; i++) {
      shooters.push({
        x: rand(0.05, 0.95),
        y: rand(-0.05, 0.35),
        angle: rand(0.25, 0.55),
        speed: rand(0.004, 0.009),
        length: rand(90, 220),
        opacity: 0,
        progress: 0,
        active: false,
        cooldown: rand(4000, 14000) + i * 4500,
      });
    }
    shootersRef.current = shooters;

    // Nebula patches — large soft colored fog
    const nebulae: Nebula[] = [];
    const nebulaCount = mobile ? 3 : 5;
    for (let i = 0; i < nebulaCount; i++) {
      nebulae.push({
        x: rand(0.1, 0.9),
        y: rand(0.05, 0.95),
        radius: rand(0.15, 0.35), // as fraction of viewport
        color: NEBULA_COLORS[i % NEBULA_COLORS.length],
        opacity: rand(0.012, 0.03),
        driftSpeed: rand(0.08, 0.2),
        driftPhase: rand(0, Math.PI * 2),
        parallaxSpeed: rand(0.02, 0.06),
      });
    }
    nebulaeRef.current = nebulae;
  }, []);

  /* ── Draw frame ───────────────────────────────────────────── */

  const paint = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.clearRect(0, 0, w, h);

      const isTouch = isTouchDevice.current;
      // On mobile, skip scroll-driven effects (canvas can't sync with compositor scroll)
      const sY = isTouch ? 0 : scrollY.current;
      const sV = isTouch ? 0 : Math.abs(scrollVel.current);
      const totalH = h * FIELD_H;
      const mX = mouseX.current;
      const mY = mouseY.current;

      // Warp intensity — subtle streak boost only on genuinely fast scrolling (desktop only)
      const warpIntensity = isTouch ? 0 : sV > 25 ? Math.min((sV - 25) / 35, 1) : 0;

      /* ── Nebulae (drawn first, behind everything) ─────────── */
      for (const neb of nebulaeRef.current) {
        const nx = neb.x * w + Math.sin(t * neb.driftSpeed + neb.driftPhase) * 40;
        const ny = ((neb.y * h * 2 - sY * neb.parallaxSpeed) % (h * 2) + h * 2) % (h * 2);
        if (ny > h + neb.radius * w || ny < -neb.radius * w) continue;

        const r = neb.radius * Math.max(w, h);
        const [cr, cg, cb] = neb.color;
        const grd = ctx.createRadialGradient(nx, ny, 0, nx, ny, r);
        grd.addColorStop(0, `rgba(${cr},${cg},${cb},${neb.opacity})`);
        grd.addColorStop(0.5, `rgba(${cr},${cg},${cb},${neb.opacity * 0.4})`);
        grd.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(nx - r, ny - r, r * 2, r * 2);
      }

      /* ── Stars ────────────────────────────────────────────── */
      for (let i = 0; i < starsRef.current.length; i++) {
        const s = starsRef.current[i];
        const L = LAYERS[s.layer];

        // Scroll parallax
        let dy = ((s.y - sY * L.speed) % totalH + totalH) % totalH;
        if (dy > h + 10) continue;

        // Mouse parallax — shift based on cursor offset from center (desktop only)
        const mx = isTouch ? s.x : s.x + mX * L.mouseInfluence;
        const my = isTouch ? dy : dy + mY * L.mouseInfluence * 0.6;

        // Twinkle — brighter stars twinkle more
        const tw = Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const twAmt = s.baseOpacity > 0.4 ? 0.35 : 0.18;
        const op = s.baseOpacity * (1 - twAmt + twAmt * (0.5 + 0.5 * tw));

        // Scroll-driven motion blur
        // Normal streak from layer config + subtle warp boost on fast scroll
        const baseStreak = L.streak > 0 ? Math.min(sV * L.speed * 0.1, L.streak) : 0;
        const warpStreak = warpIntensity * (0.5 + s.layer * 0.6); // very gentle — max ~2.3px on L3
        const elongation = 1 + baseStreak + warpStreak;

        const [r, g, b] = s.color;

        // Glow halo for the brightest stars (skip on mobile for perf)
        if (!isTouch && s.size > 1.4 && s.baseOpacity > 0.3) {
          const gr = s.size * 6;
          const grd = ctx.createRadialGradient(mx, my, 0, mx, my, gr);
          grd.addColorStop(0, `rgba(${r},${g},${b},${op * 0.2})`);
          grd.addColorStop(0.4, `rgba(${r},${g},${b},${op * 0.06})`);
          grd.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = grd;
          ctx.fillRect(mx - gr, my - gr, gr * 2, gr * 2);
        }

        // Star body
        ctx.fillStyle = `rgba(${r},${g},${b},${op})`;
        ctx.beginPath();
        if (elongation > 1.15) {
          ctx.ellipse(mx, my, s.size * 0.75, s.size * elongation, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(mx, my, s.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      /* ── Shooting stars ───────────────────────────────────── */
      for (const sh of shootersRef.current) {
        if (!sh.active || sh.opacity <= 0) continue;
        const hx = sh.x * w + Math.cos(sh.angle) * sh.progress * w;
        const hy = sh.y * h + Math.sin(sh.angle) * sh.progress * h;
        const tx = hx - Math.cos(sh.angle) * sh.length;
        const ty = hy - Math.sin(sh.angle) * sh.length;

        const grad = ctx.createLinearGradient(tx, ty, hx, hy);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(0.6, `rgba(210,225,255,${sh.opacity * 0.25})`);
        grad.addColorStop(1, `rgba(255,255,255,${sh.opacity * 0.9})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();
      }

      /* ── Warp flash — brief brightness spike on fast scroll (desktop only) ─ */
      if (!isTouch && warpIntensity > 0.3) {
        const flashOp = (warpIntensity - 0.3) * 0.04; // very subtle
        ctx.fillStyle = `rgba(200,220,255,${flashOp})`;
        ctx.fillRect(0, 0, w, h);
      }
    },
    [],
  );

  /* ── Lifecycle ────────────────────────────────────────────── */

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed(w, h);
    };

    resize();
    window.addEventListener("resize", resize);

    const onScroll = () => {
      const cur = window.scrollY;
      const delta = cur - prevScroll.current;
      scrollVel.current = Math.max(-60, Math.min(60, delta));
      prevScroll.current = cur;
      scrollY.current = cur;
      // Wake from idle on any scroll
      isIdle.current = false;
      idleTimer.current = 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Detect touch device — disable mouse parallax on touch.
    // Check media query AND listen for first touch event (covers synthetic mousemove).
    isTouchDevice.current = window.matchMedia("(pointer: coarse)").matches
      || navigator.maxTouchPoints > 0;

    const onTouchStart = () => { isTouchDevice.current = true; };
    window.addEventListener("touchstart", onTouchStart, { passive: true, once: true });

    // Mouse tracking — normalize to -1..1 from viewport center
    const onMouse = (e: MouseEvent) => {
      if (isTouchDevice.current) return;
      targetMouseX.current = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY.current = (e.clientY / window.innerHeight - 0.5) * 2;
      isIdle.current = false;
      idleTimer.current = 0;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });

    let last = 0;
    const loop = (ts: number) => {
      const dt = ts - last;
      const t = ts * 0.001;

      // Idle detection — after 2s of no input, drop to ~4fps for twinkle only
      // Skip on touch devices (no mouse to wake, so twinkling would freeze)
      if (!isTouchDevice.current) {
        if (!isIdle.current) {
          idleTimer.current += Math.min(dt, 100);
          if (idleTimer.current > 2000 && Math.abs(scrollVel.current) < 0.5) {
            isIdle.current = true;
          }
        }
        if (isIdle.current && dt < 250) {
          rafId.current = requestAnimationFrame(loop);
          return; // skip this frame, draw ~4fps
        }
      }

      last = ts;

      // Cap dt so animations don't "catch up" after tab throttle / AFK
      const cdt = Math.min(dt, 100);

      // Smooth mouse interpolation (lerp toward target)
      const lerpFactor = 1 - Math.pow(0.05, cdt / 1000);
      mouseX.current += (targetMouseX.current - mouseX.current) * lerpFactor;
      mouseY.current += (targetMouseY.current - mouseY.current) * lerpFactor;

      // Velocity decay
      scrollVel.current *= 0.9;

      // Advance shooting stars
      for (const sh of shootersRef.current) {
        if (!sh.active) {
          sh.cooldown -= cdt;
          if (sh.cooldown <= 0) {
            sh.active = true;
            sh.progress = 0;
            sh.opacity = 1;
            sh.x = rand(0.05, 0.9);
            sh.y = rand(-0.05, 0.3);
            sh.angle = rand(0.25, 0.55);
            sh.length = rand(90, 220);
            sh.speed = rand(0.004, 0.009);
          }
        } else {
          sh.progress += sh.speed * (cdt / 16);
          if (sh.progress > 0.4) sh.opacity = Math.max(0, sh.opacity - 0.025 * (cdt / 16));
          if (sh.opacity <= 0) {
            sh.active = false;
            sh.cooldown = rand(6000, 18000);
          }
        }
      }

      paint(ctx, window.innerWidth, window.innerHeight, t);
      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [reducedMotion, seed, paint]);

  // Skip entirely on touch devices — canvas rAF can't coexist with mobile scroll compositor
  const isTouch = typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches || navigator.maxTouchPoints > 0);

  if (reducedMotion || isTouch) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1 }}
      aria-hidden="true"
    />
  );
}
