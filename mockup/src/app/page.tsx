"use client";

import { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariantsCva = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "h-8 rounded-md px-3 text-xs",
        default: "h-10 rounded-md px-4 py-2 text-sm",
        lg: "h-12 rounded-md px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const semanticColors = [
  { name: "background", token: "--background" },
  { name: "foreground", token: "--foreground" },
  { name: "primary", token: "--primary" },
  { name: "primary-fg", token: "--primary-foreground" },
  { name: "secondary", token: "--secondary" },
  { name: "secondary-fg", token: "--secondary-foreground" },
  { name: "accent", token: "--accent" },
  { name: "accent-fg", token: "--accent-foreground" },
  { name: "muted", token: "--muted" },
  { name: "muted-fg", token: "--muted-foreground" },
  { name: "destructive", token: "--destructive" },
  { name: "success", token: "--success" },
  { name: "warning", token: "--warning" },
  { name: "info", token: "--info" },
  { name: "border", token: "--border" },
  { name: "card", token: "--card" },
  { name: "popover", token: "--popover" },
  { name: "ring", token: "--ring" },
];

const textSizes = [
  { name: "text-xs", class: "text-xs", size: "12px" },
  { name: "text-sm", class: "text-sm", size: "14px" },
  { name: "text-base", class: "text-base", size: "16px" },
  { name: "text-lg", class: "text-lg", size: "18px" },
  { name: "text-xl", class: "text-xl", size: "20px" },
  { name: "text-2xl", class: "text-2xl", size: "24px" },
  { name: "text-3xl", class: "text-3xl", size: "30px" },
  { name: "text-4xl", class: "text-4xl", size: "36px" },
  { name: "text-5xl", class: "text-5xl", size: "48px" },
];

const spacingScale = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16];

const radiusTokens = [
  { name: "sm", class: "rounded-sm" },
  { name: "md", class: "rounded-md" },
  { name: "lg", class: "rounded-lg" },
  { name: "xl", class: "rounded-xl" },
  { name: "2xl", class: "rounded-2xl" },
  { name: "full", class: "rounded-full" },
];

const shadowTokens = [
  { name: "shadow-sm", class: "shadow-sm" },
  { name: "shadow-md", class: "shadow-md" },
  { name: "shadow-lg", class: "shadow-lg" },
  { name: "shadow-xl", class: "shadow-xl" },
  { name: "shadow-2xl", class: "shadow-2xl" },
];

const buttonVariantNames = ["default", "secondary", "outline", "ghost", "destructive"] as const;
const buttonSizes = ["sm", "default", "lg"] as const;

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16">
      <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">{title}</h2>
      {children}
    </section>
  );
}

export default function ShowcasePage() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <h1 className="text-xl font-bold">
            Design System <span className="text-primary">Showcase</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Ocean Tech Theme</span>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* 1. Color Palette */}
        <Section id="colors" title="1. Color Palette">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {semanticColors.map((color) => (
              <div key={color.name} data-testid="color-swatch" className="space-y-2">
                <div
                  className="w-full h-16 rounded-lg border border-border"
                  style={{ backgroundColor: `var(${color.token})` }}
                />
                <p className="text-xs font-medium">{color.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{color.token}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 2. Typography Scale */}
        <Section id="typography" title="2. Typography Scale">
          <div className="space-y-4">
            {textSizes.map((ts) => (
              <div key={ts.name} data-testid="text-sample" className="flex items-baseline gap-4">
                <span className="text-xs text-muted-foreground font-mono w-24 flex-shrink-0">
                  {ts.name} ({ts.size})
                </span>
                <span className={ts.class}>The quick brown fox jumps over the lazy dog</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 3. Font Families */}
        <Section id="fonts" title="3. Font Families">
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-mono">--font-sans (Inter)</p>
              <p className="text-xl font-sans">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 font-mono">--font-mono (JetBrains Mono)</p>
              <p className="text-xl font-mono">ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789</p>
            </div>
          </div>
        </Section>

        {/* 4. Spacing Scale */}
        <Section id="spacing" title="4. Spacing Scale">
          <div className="space-y-3">
            {spacingScale.map((s) => (
              <div key={s} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground font-mono w-24 flex-shrink-0">
                  spacing-{s}
                </span>
                <div
                  className="bg-primary/20 border border-primary/40 rounded"
                  style={{ width: `${s * 0.25}rem`, height: "1.5rem" }}
                />
                <span className="text-xs text-muted-foreground">{s * 4}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 5. Border Radius */}
        <Section id="radius" title="5. Border Radius">
          <div className="flex flex-wrap gap-6">
            {radiusTokens.map((r) => (
              <div key={r.name} className="text-center space-y-2">
                <div className={`w-20 h-20 bg-primary/20 border-2 border-primary ${r.class}`} />
                <p className="text-xs font-mono text-muted-foreground">{r.name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 6. Shadows */}
        <Section id="shadows" title="6. Shadows">
          <div className="flex flex-wrap gap-8">
            {shadowTokens.map((s) => (
              <div key={s.name} className="text-center space-y-2">
                <div className={`w-24 h-24 bg-card rounded-lg border border-border ${s.class}`} />
                <p className="text-xs font-mono text-muted-foreground">{s.name}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* 7. Buttons */}
        <Section id="buttons" title="7. Buttons">
          <div data-testid="button-showcase" className="space-y-8">
            {buttonVariantNames.map((variant) => (
              <div key={variant} className="space-y-3">
                <h3 className="text-sm font-medium capitalize text-muted-foreground">{variant}</h3>
                <div className="flex flex-wrap items-center gap-4">
                  {buttonSizes.map((size) => (
                    <button
                      key={`${variant}-${size}`}
                      className={buttonVariantsCva({ variant, size })}
                    >
                      {variant} {size}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 8. Cards */}
        <Section id="cards" title="8. Cards">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Standard Card</h3>
              <p className="text-sm text-muted-foreground">A basic card with subtle shadow and border.</p>
            </div>
            <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Elevated Card</h3>
              <p className="text-sm text-muted-foreground">A card with larger shadow for emphasis.</p>
            </div>
            <div className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer">
              <h3 className="text-lg font-semibold mb-2">Interactive Card</h3>
              <p className="text-sm text-muted-foreground">Hover to see the elevation change.</p>
            </div>
          </div>
        </Section>

        {/* 9. Form Elements */}
        <Section id="forms" title="9. Form Elements">
          <div className="max-w-md space-y-6">
            <div className="space-y-2">
              <label htmlFor="input-demo" className="text-sm font-medium">
                Text Input
              </label>
              <input
                id="input-demo"
                type="text"
                placeholder="Enter text..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="select-demo" className="text-sm font-medium">
                Select
              </label>
              <select
                id="select-demo"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="checkbox-demo"
                type="checkbox"
                className="h-4 w-4 rounded border border-input accent-primary"
              />
              <label htmlFor="checkbox-demo" className="text-sm font-medium">
                Checkbox option
              </label>
            </div>
          </div>
        </Section>

        {/* 10. Badges */}
        <Section id="badges" title="10. Badges">
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center rounded-md bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
              Primary
            </span>
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
              Secondary
            </span>
            <span className="inline-flex items-center rounded-md bg-accent px-2.5 py-0.5 text-xs font-semibold text-accent-foreground">
              Accent
            </span>
            <span className="inline-flex items-center rounded-md bg-destructive px-2.5 py-0.5 text-xs font-semibold text-destructive-foreground">
              Destructive
            </span>
            <span className="inline-flex items-center rounded-md bg-success px-2.5 py-0.5 text-xs font-semibold text-success-foreground">
              Success
            </span>
            <span className="inline-flex items-center rounded-md bg-warning px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">
              Warning
            </span>
            <span className="inline-flex items-center rounded-md bg-info px-2.5 py-0.5 text-xs font-semibold text-info-foreground">
              Info
            </span>
            <span className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-0.5 text-xs font-semibold text-foreground">
              Outline
            </span>
          </div>
        </Section>

        {/* 11. Dashboard Components */}
        <Section id="dashboard" title="11. Dashboard Components">
          {/* Stats Cards */}
          <h3 className="text-lg font-semibold mb-4">Stats Cards</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card text-card-foreground rounded-xl border border-border p-5 text-center">
              <div className="text-3xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground mt-1">Lessons Completed</div>
            </div>
            <div className="bg-card text-card-foreground rounded-xl border border-border p-5 text-center">
              <div className="text-3xl font-bold text-accent">8</div>
              <div className="text-sm text-muted-foreground mt-1">Labs Passed</div>
            </div>
            <div className="bg-card text-card-foreground rounded-xl border border-border p-5 text-center">
              <div className="text-3xl font-bold text-success">92%</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Score</div>
            </div>
            <div className="bg-card text-card-foreground rounded-xl border border-border p-5 text-center">
              <div className="text-3xl font-bold text-warning">47h</div>
              <div className="text-sm text-muted-foreground mt-1">Hours Studied</div>
            </div>
          </div>

          {/* Progress Ring */}
          <h3 className="text-lg font-semibold mb-4">Progress Ring</h3>
          <div className="flex items-center gap-8 mb-8">
            {[25, 50, 75, 100].map((pct) => (
              <div key={pct} className="relative inline-flex items-center justify-center">
                <svg width="80" height="80" className="-rotate-90">
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    className="stroke-muted" strokeWidth="6"
                  />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    className="stroke-primary" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - pct / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.5s" }}
                  />
                </svg>
                <span className="absolute text-sm font-bold">{pct}%</span>
              </div>
            ))}
          </div>

          {/* Lesson Cards */}
          <h3 className="text-lg font-semibold mb-4">Lesson Cards</h3>
          <div className="space-y-3 mb-8">
            {[
              { title: "Introduction to AI", status: "completed", progress: 100, duration: "45 min" },
              { title: "Prompt Engineering", status: "in-progress", progress: 60, duration: "1h 20min" },
              { title: "Agent Development", status: "not-started", progress: 0, duration: "2h" },
              { title: "Advanced MCP", status: "locked", progress: 0, duration: "1h 30min" },
            ].map((lesson) => (
              <div
                key={lesson.title}
                className="bg-card text-card-foreground rounded-xl border border-border p-5 flex gap-4 items-start hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer"
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0 mt-1.5"
                  style={{
                    backgroundColor: `var(--${
                      lesson.status === "completed" ? "success" :
                      lesson.status === "in-progress" ? "primary" :
                      lesson.status === "locked" ? "muted-foreground" :
                      "muted-foreground"
                    })`,
                    opacity: lesson.status === "not-started" || lesson.status === "locked" ? 0.4 : 1,
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{lesson.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {lesson.status === "completed" ? "Completed" :
                     lesson.status === "in-progress" ? `${lesson.progress}% complete` :
                     lesson.status === "locked" ? "Locked" : "Not started"}
                    {" · "}{lesson.duration}
                  </p>
                  {lesson.progress > 0 && lesson.progress < 100 && (
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Grade Badges */}
          <h3 className="text-lg font-semibold mb-4">Grade Badges</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { grade: "A", bg: "bg-success", fg: "text-success-foreground" },
              { grade: "B", bg: "bg-accent", fg: "text-accent-foreground" },
              { grade: "C", bg: "bg-warning", fg: "text-warning-foreground" },
              { grade: "D", bg: "bg-warning", fg: "text-warning-foreground" },
              { grade: "F", bg: "bg-destructive", fg: "text-destructive-foreground" },
            ].map(({ grade, bg, fg }) => (
              <span
                key={grade}
                className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-sm font-bold min-w-[2rem] ${bg} ${fg}`}
              >
                {grade}
              </span>
            ))}
          </div>

          {/* Sidebar Mockup */}
          <h3 className="text-lg font-semibold mb-4">Sidebar Mockup</h3>
          <div className="w-72 bg-card border border-border rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border">
              <h4 className="font-bold text-primary">GWTH.ai</h4>
              <p className="text-xs text-muted-foreground">Student Dashboard</p>
            </div>
            <nav className="p-2 space-y-1">
              {[
                { name: "Dashboard", active: true },
                { name: "My Courses", active: false },
                { name: "Lessons", active: false },
                { name: "Labs", active: false },
                { name: "Progress", active: false },
                { name: "Settings", active: false },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm font-medium transition-colors cursor-pointer text-left ${
                    item.active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>
        </Section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>GWTH/ACG Design System Mockup — Visual Verification Page</p>
          <p className="mt-1">Tailwind CSS v4 + shadcn/ui patterns + OKLCH colors</p>
        </footer>
      </main>
    </div>
  );
}
