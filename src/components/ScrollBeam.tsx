import { useScroll, useTransform, useSpring, motion, useReducedMotion, useMotionValueEvent } from "motion/react";
import { useRef, useState } from "react";

/**
 * A cosmic energy beam along the right edge that charges as you scroll.
 * Bright leading node, soft glow trail, and a pulse at 100%.
 */
export function ScrollBeam() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [atBottom, setAtBottom] = useState(false);
  const prevProgress = useRef(0);

  // Smooth the scroll progress with a spring for fluid motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Track when we hit 100%
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const wasAtBottom = prevProgress.current > 0.98;
    const isAtBottom = v > 0.98;
    if (isAtBottom && !wasAtBottom) setAtBottom(true);
    if (!isAtBottom && wasAtBottom) setAtBottom(false);
    prevProgress.current = v;
  });

  // The beam height as a percentage string
  const beamHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  // Glow intensity increases as you scroll — brighter near the end
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.6, 1]);

  // Node brightness pulses slightly
  const nodeScale = useTransform(smoothProgress, [0, 0.5, 1], [0.6, 0.85, 1]);

  if (reducedMotion) return null;

  return (
    <div
      className="fixed top-0 right-0 bottom-0 z-40 pointer-events-none hidden md:block"
      style={{ width: 20 }}
      aria-hidden="true"
    >
      {/* Track — the dim unfilled path */}
      <div
        className="absolute right-[7px] top-0 bottom-0"
        style={{
          width: 1,
          background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.04) 10%, rgba(255,255,255,0.04) 90%, transparent 100%)",
        }}
      />

      {/* Beam — the filled luminous trail */}
      <motion.div
        className="absolute right-[6px] top-0 origin-top"
        style={{
          width: 3,
          height: beamHeight,
          borderRadius: 2,
        }}
      >
        {/* Core beam — bright white center */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: glowOpacity,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(200,220,255,0.6) 30%, rgba(255,255,255,0.9) 100%)",
            borderRadius: 2,
          }}
        />

        {/* Soft bloom around the beam */}
        <motion.div
          className="absolute top-0 bottom-0"
          style={{
            left: -4,
            right: -4,
            opacity: glowOpacity,
            background: "linear-gradient(to bottom, transparent 0%, rgba(180,210,255,0.15) 40%, rgba(255,255,255,0.25) 100%)",
            borderRadius: 4,
            filter: "blur(3px)",
          }}
        />

        {/* Leading node — the bright point at the scroll edge */}
        <motion.div
          className="absolute left-1/2"
          style={{
            bottom: -2,
            translateX: "-50%",
            scale: nodeScale,
          }}
        >
          {/* Outer glow */}
          <motion.div
            style={{ opacity: glowOpacity }}
            className="absolute"
          >
            <div
              style={{
                width: 20,
                height: 20,
                marginLeft: -10,
                marginTop: -10,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(200,220,255,0.4) 0%, rgba(200,220,255,0) 70%)",
              }}
            />
          </motion.div>

          {/* Inner bright core */}
          <div
            style={{
              width: 5,
              height: 5,
              marginLeft: -2.5,
              marginTop: -2.5,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(200,220,255,0.6) 50%, transparent 100%)",
              boxShadow: "0 0 6px 2px rgba(200,220,255,0.4), 0 0 12px 4px rgba(200,220,255,0.15)",
            }}
          />
        </motion.div>
      </motion.div>

      {/* Arrival pulse — flash when reaching the bottom */}
      {atBottom && (
        <motion.div
          className="absolute right-[3px] bottom-0"
          initial={{ opacity: 0.8, scaleY: 0 }}
          animate={{ opacity: 0, scaleY: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            width: 9,
            height: "100%",
            originY: 1,
            background: "linear-gradient(to top, rgba(200,220,255,0.2) 0%, transparent 100%)",
            borderRadius: 4,
            filter: "blur(4px)",
          }}
        />
      )}
    </div>
  );
}
