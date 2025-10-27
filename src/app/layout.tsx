import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CursorGlow } from "@/components/ui/cursor-glow";
import { TopNav } from "@/components/navigation/top-nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Workflow Visual Builder",
  description: "Design and run automated workflows visually with an animated Next.js builder."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} bg-slate-100 text-slate-700 transition-colors duration-500 ease-out dark:bg-ink-900 dark:text-ink-100`}
      >
        <ThemeProvider>
          <CursorGlow />
          <TopNav />
          <main className="min-h-screen pt-20">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
