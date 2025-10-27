"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/builder", label: "Workflows" },
  { href: "/templates", label: "Templates" },
  { href: "/docs", label: "Docs" },
  { href: "/profile", label: "Profile" }
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
  className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between border-b border-black/10 bg-white/80 text-slate-900 backdrop-blur-xl transition-colors duration-500 dark:border-white/5 dark:bg-ink-900/80 dark:text-white"
    >
      <div className="flex items-center gap-6 px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-slate-900 transition-colors dark:text-white">
          KunalCreation
        </Link>
        <nav className="hidden gap-2 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <motion.div key={link.href} whileHover={{ y: -2 }}>
                <Link
                  href={link.href}
                  className="relative rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-white/70 dark:hover:text-white"
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-slate-900/10 dark:bg-white/10"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  {pathname === link.href && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-1 bottom-0 h-[2px] rounded-full bg-slate-900/70 dark:bg-white/70"
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4 px-6">
        <ThemeToggle />
        <motion.div
          className="hidden rounded-full border border-black/10 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-ambient transition-colors dark:border-white/10 dark:bg-white/5 dark:text-white/70 md:block"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Beta Access
        </motion.div>
      </div>
    </motion.header>
  );
}
