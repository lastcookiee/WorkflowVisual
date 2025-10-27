"use client";

import { motion } from "framer-motion";

const templates = [
  {
    title: "Welcome series",
    description: "Send email, wait for trigger, branch with decision logic, and notify via webhook.",
    nodes: 8,
    edges: 9
  },
  {
    title: "Scrape then sync",
    description: "Fetch data from API, merge results, and store in Postgres with tail-recursive logic.",
    nodes: 6,
    edges: 7
  },
  {
    title: "Incident pager",
    description: "Trigger on uptime alerts, fan out to responders, and escalate if unacknowledged.",
    nodes: 7,
    edges: 8
  }
];

export default function TemplatesPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 pb-24 pt-12">
      <div className="space-y-4 text-slate-700 transition-colors dark:text-white">
        <motion.h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Templates</motion.h1>
        <p className="text-sm text-slate-600 dark:text-white/60">
          Jumpstart a new workflow with curated patterns for automation, ops, and growth teams.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((template) => (
          <motion.article
            key={template.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-black/10 bg-white/80 p-6 text-slate-700 shadow-lg transition-colors dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:shadow-ambient"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{template.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-white/60">{template.description}</p>
            <div className="mt-4 text-xs text-slate-500 dark:text-white/40">
              {template.nodes} nodes · {template.edges} edges
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
