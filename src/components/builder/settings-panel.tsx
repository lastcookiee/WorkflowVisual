"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/components/providers/theme-provider";

export function SettingsPanel() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-black/10 bg-white/90 p-5 text-sm text-slate-600 shadow-ambient transition-colors dark:border-white/10 dark:bg-white/[0.03] dark:text-white/70"
    >
      <header className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-white/40">Settings</span>
        <button
          type="button"
          onClick={(event) => toggleTheme({ x: event.clientX, y: event.clientY })}
          className="rounded-full border border-black/10 px-3 py-1 text-xs uppercase tracking-wide text-slate-600 transition hover:border-black/20 hover:text-slate-900 dark:border-white/10 dark:text-white/60 dark:hover:border-white/40 dark:hover:text-white"
        >
          {theme === "dark" ? "Light" : "Dark"} mode
        </button>
      </header>
      <div className="mt-4 space-y-4">
  <p className="text-xs text-slate-500 dark:text-white/50">
          Theme toggles ripple across the canvas so you can preview automations in both environments.
        </p>
  <div className="rounded-2xl border border-black/10 bg-white/80 p-3 text-xs text-slate-500 transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-white/60">
          Temporary drafts persist in localStorage and cookies keep your session sticky for 7 days.
        </div>
      </div>
    </motion.aside>
  );
}
