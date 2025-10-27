"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (value: Theme) => void;
  toggleTheme: (origin?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "workflow-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [isTransitioning, setTransitioning] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [transitionOrigin, setTransitionOrigin] = useState("50% 50%");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored) {
      setThemeState(stored);
      applyThemeClass(stored);
    } else {
      applyThemeClass("dark");
    }
  }, []);

  const setThemeValue = useCallback((value: Theme) => {
    startTransition(() => {
      setThemeState(value);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, value);
        applyThemeClass(value);
      }
    });
  }, []);

  const toggleTheme = useCallback((origin?: { x: number; y: number }) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    if (origin && typeof window !== "undefined") {
      const xPercent = Math.round((origin.x / window.innerWidth) * 100);
      const yPercent = Math.round((origin.y / window.innerHeight) * 100);
      setTransitionOrigin(`${xPercent}% ${yPercent}%`);
    } else {
      setTransitionOrigin("50% 50%");
    }
    setTransitionKey((key) => key + 1);
    setTransitioning(true);

    // Apply palette immediately within a transition to minimise blocking work.
    setThemeValue(nextTheme);
  }, [setThemeValue, theme]);

  const value = useMemo(
    () => ({ theme, setTheme: setThemeValue, toggleTheme }),
    [setThemeValue, theme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key={transitionKey}
            initial={{ scale: 0.2, opacity: 0.28 }}
            animate={{ scale: 1.05, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: transitionOrigin }}
            className="pointer-events-none fixed inset-0 z-[999] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.65)_0%,_rgba(255,255,255,0.15)_55%,_transparent_85%)] dark:bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.75)_0%,_rgba(0,0,0,0.4)_55%,_transparent_85%)]"
            onAnimationComplete={() => setTransitioning(false)}
          />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
