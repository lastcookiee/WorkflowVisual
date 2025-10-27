"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springConfig = { stiffness: 900, damping: 32, mass: 0.2, restDelta: 0.0008 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      x.set(event.clientX - 150);
      y.set(event.clientY - 150);
    };

    window.addEventListener("pointermove", handlePointer);
    return () => window.removeEventListener("pointermove", handlePointer);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 hidden lg:block"
    >
      <motion.div
        className="absolute h-60 w-60 rounded-full bg-white/5 blur-3xl"
        style={{ translateX: springX, translateY: springY }}
      />
    </motion.div>
  );
}
