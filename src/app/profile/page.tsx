"use client";

import { motion } from "framer-motion";

const preferences = [
  { label: "Default traversal", value: "Breadth-first" },
  { label: "Autosave", value: "Enabled" },
  { label: "Theme", value: "Noir" }
];

export default function ProfilePage() {
  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-24 pt-12">
      <motion.h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Profile</motion.h1>
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div className="rounded-3xl border border-black/10 bg-white/80 p-6 text-slate-700 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-ambient">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Account</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-white/60">Use cookies to keep you signed in on this device.</p>
        </motion.div>
        <motion.div className="rounded-3xl border border-black/10 bg-white/80 p-6 text-slate-700 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-ambient">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Preferences</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-white/60">
            {preferences.map((item) => (
              <li key={item.label} className="flex items-center justify-between">
                <span>{item.label}</span>
                <span className="text-slate-500 dark:text-white/40">{item.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
