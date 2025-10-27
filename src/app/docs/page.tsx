"use client";

import { motion } from "framer-motion";

const sections = [
  {
    title: "Getting started",
    description: "Connect your database, run prisma migrations, and generate your first workflow sketch."
  },
  {
    title: "Node presets",
    description: "Explore triggers, actions, and logic nodes that accelerate automation development."
  },
  {
    title: "Execution model",
    description: "Understand BFS and DFS traversal paths, preview animations, and error handling hooks."
  }
];

export default function DocsPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-24 pt-12">
      <div className="max-w-2xl space-y-4 text-slate-700 transition-colors dark:text-white">
        <motion.h1 className="text-4xl font-semibold text-slate-900 dark:text-white">Documentation</motion.h1>
        <p className="text-slate-600 dark:text-white/60">
          Learn how the workflow builder stores data, traverses nodes, and integrates with your automation stack.
          Detailed guides cover schema design, API usage, and advanced animation hooks.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((section) => (
          <motion.article
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-black/10 bg-white/80 p-6 text-slate-700 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-ambient"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{section.title}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-white/60">{section.description}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
