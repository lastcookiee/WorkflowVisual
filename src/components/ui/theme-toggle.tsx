"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
  className="rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm font-medium text-slate-800 shadow-ambient transition-colors hover:border-black/20 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:hover:border-white/40 dark:hover:text-white"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"} Mode
    </motion.button>
  );
}
