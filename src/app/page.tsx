"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
};

const heroItem = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 160,
      damping: 24,
      mass: 0.8
    }
  }
};

const features = [
  {
    title: "Visual-first logic",
    description: "Compose automations by connecting modular nodes with precision and clarity."
  },
  {
    title: "Realtime preview",
    description: "Animate workflow execution with BFS or DFS traversal to validate behavior instantly."
  },
  {
    title: "Persistent storage",
    description: "Save drafts locally and sync to PostgreSQL to collaborate across sessions."
  }
];

export default function Page() {
  return (
    <section className="relative mx-auto mt-10 max-w-6xl px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroContainer}
        className="flex flex-col gap-10 rounded-3xl border border-black/10 bg-white/80 p-12 text-slate-700 shadow-xl backdrop-blur transition-colors duration-500 dark:border-white/10 dark:bg-white/[0.02] dark:text-white dark:shadow-ambient"
      >
        <motion.span
          variants={heroItem}
          className="w-fit rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1 text-xs uppercase tracking-[0.3em] text-indigo-700 shadow-sm transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white/60"
        >
          Hyper-visual automation studio
        </motion.span>
        <motion.h1
          variants={heroItem}
          className="text-4xl font-semibold leading-tight text-slate-900 dark:text-white sm:text-5xl"
        >
          Design and Run Automated Workflows Visually
        </motion.h1>
        <motion.p
          variants={heroItem}
          className="max-w-3xl text-lg text-slate-600 dark:text-white/70"
        >
          Build complex logic with a canvas built for flow. Drag nodes, connect edges, and execute with animated
          confidence.
        </motion.p>
        <motion.div variants={heroItem} className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/builder"
            className="group relative inline-flex w-fit items-center gap-3 overflow-hidden rounded-full border border-indigo-300 bg-indigo-600 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-indigo-500 hover:shadow-lg dark:border-white/20 dark:bg-white dark:text-black dark:hover:bg-white"
          >
            <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-white via-white to-transparent opacity-60 transition group-hover:translate-y-0" />
            <span className="relative z-10 px-6 py-3">Start Building</span>
          </Link>
          <Link
            href="/docs"
            className="inline-flex w-fit items-center rounded-full border border-black/10 px-6 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/15 dark:text-white/70 dark:hover:border-white/40 dark:hover:text-white"
          >
            Explore Docs
          </Link>
        </motion.div>
        <motion.div
          className="grid gap-6 pt-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15 }
            }
          }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="rounded-2xl border border-black/10 bg-white/80 p-6 text-slate-700 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:shadow-ambient"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-white/60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
