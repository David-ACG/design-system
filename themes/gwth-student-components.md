# GWTH Student Backend - Dashboard Component Guide

> Comprehensive component reference for the GWTH.ai Student Backend dashboard.
> All components use the **Ocean Tech** design system tokens and are built for
> Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, CVA, clsx, and tailwind-merge.

---

## Table of Contents

1. [Sidebar Navigation](#1-sidebar-navigation)
2. [Dashboard Header](#2-dashboard-header)
3. [Lesson Card](#3-lesson-card)
4. [Lab Card](#4-lab-card)
5. [Progress Ring](#5-progress-ring)
6. [Grade Badge](#6-grade-badge)
7. [Data Table](#7-data-table)
8. [Stats Card](#8-stats-card)
9. [Breadcrumb](#9-breadcrumb)
10. [Toast / Notification](#10-toast--notification)

---

## Design System Summary

| Property | Value |
|---|---|
| **Primary (Aqua)** | `oklch(0.7 0.18 220)` / `#33BBFF` |
| **Accent (Mint)** | `oklch(0.65 0.16 165)` / `#1CBA93` |
| **Body / Heading Font** | Inter |
| **Monospace Font** | JetBrains Mono |
| **Hover Transitions** | `0.2s` (`duration-200`) |
| **Entrance Animations** | `0.3s` (`duration-300`) |
| **Border Radius Base** | `0.625rem` (`--radius`) |
| **Sidebar Expanded** | `280px` |
| **Sidebar Collapsed** | `64px` |
| **Header Height** | `64px` |

---

## 1. Sidebar Navigation

A collapsible sidebar providing lesson and section hierarchy navigation. Expands
to 280 px and collapses to 64 px (icon-only). Active state uses the
`sidebar-primary` token; hover uses `sidebar-accent`.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-sidebar` | Sidebar background |
| `--color-sidebar-foreground` | Default text color |
| `--color-sidebar-primary` | Active item background |
| `--color-sidebar-primary-foreground` | Active item text |
| `--color-sidebar-accent` | Hovered item background |
| `--color-sidebar-accent-foreground` | Hovered item text |
| `--color-sidebar-border` | Right-edge border |
| `--color-sidebar-ring` | Focus ring on items |
| `--color-sidebar-muted` | Muted/secondary text |

### Tailwind Class Patterns

```
/* Sidebar container */
fixed left-0 top-0 z-40 h-full flex flex-col
bg-sidebar border-r border-sidebar-border
transition-all duration-200
w-[280px] data-[collapsed=true]:w-16

/* Sidebar nav item */
flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
text-sidebar-foreground text-sm font-medium
transition-colors duration-150
hover:bg-sidebar-accent hover:text-sidebar-accent-foreground
cursor-pointer

/* Active sidebar nav item */
bg-sidebar-primary text-sidebar-primary-foreground
hover:bg-sidebar-primary/90

/* Section heading */
text-xs font-semibold uppercase tracking-wider
text-sidebar-muted px-4 py-2

/* Collapse toggle */
absolute -right-3 top-20 z-50
h-6 w-6 rounded-full border border-sidebar-border
bg-sidebar flex items-center justify-center
hover:bg-sidebar-accent transition-colors duration-200
```

### Light / Dark Mode Behavior

- **Light**: Sidebar background is a subtle warm tint (`oklch(0.97 0.005 175)`).
  Active items use vibrant aqua primary. Hover items use a faint mint tint.
- **Dark**: Sidebar background deepens to `oklch(0.16 0.04 175)`. Active and
  hover backgrounds shift to brighter, lower-chroma variants for legibility. The
  border switches to a translucent white (`oklch(1 0 0 / 10%)`).

### Responsive Behavior

- **Desktop (>=1024 px)**: Sidebar is always visible, toggling between expanded
  and collapsed.
- **Tablet (768-1023 px)**: Sidebar collapses by default; expand overlays content
  with a backdrop.
- **Mobile (<768 px)**: Sidebar becomes a sheet that slides in from the left over
  a semi-transparent backdrop. Dismiss via backdrop click or swipe.

### Accessibility

- The `<nav>` element must have `aria-label="Main navigation"`.
- Each nav item is a focusable `<button>` or `<a>` with `role="link"`.
- Active item carries `aria-current="page"`.
- Collapse/expand toggle has `aria-expanded` and `aria-controls` pointing to the
  sidebar ID.
- Section groupings use `role="group"` with `aria-labelledby` referencing the
  section heading.
- Full keyboard navigation: `Tab` moves between items, `Enter`/`Space` activates,
  `Escape` closes the mobile sheet.
- Focus ring: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar`.

### Example Code

```tsx
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  FlaskConical,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  BarChart3,
  Settings,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Variants                                                          */
/* ------------------------------------------------------------------ */

const sidebarItemVariants = cva(
  [
    "flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg",
    "text-sidebar-foreground text-sm font-medium",
    "transition-colors duration-150 cursor-pointer",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-sidebar-ring focus-visible:ring-offset-2",
    "focus-visible:ring-offset-sidebar",
  ],
  {
    variants: {
      active: {
        true: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
        false: "",
      },
    },
    defaultVariants: { active: false },
  },
);

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface NavSection {
  title: string;
  items: {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

interface SidebarProps {
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const sections: NavSection[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Progress", href: "/progress", icon: BarChart3 },
    ],
  },
  {
    title: "Learning",
    items: [
      { label: "Lessons", href: "/lessons", icon: BookOpen },
      { label: "Labs", href: "/labs", icon: FlaskConical },
      { label: "Grades", href: "/grades", icon: GraduationCap },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      data-collapsed={collapsed}
      className={cn(
        "fixed left-0 top-0 z-40 h-full flex flex-col",
        "bg-sidebar border-r border-sidebar-border",
        "transition-all duration-200",
        collapsed ? "w-16" : "w-[280px]",
        className,
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-4 border-b border-sidebar-border">
        <GraduationCap className="h-7 w-7 shrink-0 text-sidebar-primary" />
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-foreground truncate">
            GWTH Student
          </span>
        )}
      </div>

      {/* Nav sections */}
      <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        {sections.map((section) => (
          <div key={section.title} role="group" aria-label={section.title}>
            {!collapsed && (
              <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-muted px-4 py-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        sidebarItemVariants({ active: isActive }),
                        collapsed && "justify-center px-0",
                      )}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
        aria-controls="sidebar"
        className={cn(
          "absolute -right-3 top-20 z-50",
          "h-6 w-6 rounded-full border border-sidebar-border",
          "bg-sidebar flex items-center justify-center",
          "hover:bg-sidebar-accent transition-colors duration-200",
          "focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-sidebar-ring focus-visible:ring-offset-2",
          "focus-visible:ring-offset-sidebar",
        )}
      >
        {collapsed ? (
          <ChevronRight className="h-3.5 w-3.5 text-sidebar-foreground" />
        ) : (
          <ChevronLeft className="h-3.5 w-3.5 text-sidebar-foreground" />
        )}
      </button>
    </nav>
  );
}
```

---

## 2. Dashboard Header

A fixed-height header (64 px) providing user information, progress summary,
theme toggling, and breadcrumb navigation.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-background` | Header background |
| `--color-foreground` | Primary text |
| `--color-border` | Bottom border |
| `--color-primary` | Progress pill accent |
| `--color-primary-foreground` | Progress pill text |
| `--color-muted` | Avatar fallback background |
| `--color-muted-foreground` | Secondary text / breadcrumb separators |
| `--color-ring` | Focus ring on interactive elements |

### Tailwind Class Patterns

```
/* Header bar */
sticky top-0 z-30 flex h-16 items-center justify-between
px-6 border-b border-border bg-background/80 backdrop-blur-md

/* Left: breadcrumb area */
flex items-center gap-2 text-sm text-muted-foreground

/* Right: user section */
flex items-center gap-4

/* Avatar */
h-8 w-8 rounded-full bg-muted flex items-center justify-center
overflow-hidden text-xs font-medium text-muted-foreground

/* Progress pill */
inline-flex items-center gap-1.5 rounded-full
bg-primary/10 text-primary px-3 py-1 text-xs font-semibold

/* Theme toggle */
h-9 w-9 rounded-lg flex items-center justify-center
hover:bg-muted transition-colors duration-200
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-offset-2
focus-visible:ring-offset-background
```

### Light / Dark Mode Behavior

- **Light**: Header uses `bg-background/80` with `backdrop-blur-md` for a frosted
  glass effect over the scrollable content area. Text is dark kale foreground.
- **Dark**: Background shifts to the deep kale palette with the same translucency.
  The progress pill glows brighter against the dark surface. Theme toggle icon
  changes from `Sun` to `Moon`.

### Responsive Behavior

- **Desktop**: Full breadcrumb + progress pill + avatar + theme toggle shown.
- **Tablet**: Breadcrumb truncates middle segments with ellipsis.
- **Mobile (<768 px)**: Breadcrumb collapses to show only current page. Progress
  pill hides. A hamburger menu button appears to open the mobile sidebar.

### Accessibility

- Header uses `<header>` with `role="banner"`.
- Theme toggle is a `<button>` with `aria-label="Toggle theme"`.
- Avatar image has a meaningful `alt` attribute (user name).
- Breadcrumb is wrapped in `<nav aria-label="Breadcrumb">`.
- All interactive elements are keyboard focusable with visible focus rings.
- Progress pill is decorative -- uses `aria-hidden="true"` on the icon and
  provides a text label for screen readers.

### Example Code

```tsx
"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Sun, Moon, Menu } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface DashboardHeaderProps {
  breadcrumbs: { label: string; href?: string }[];
  user: {
    name: string;
    avatarUrl?: string;
    initials: string;
  };
  progressPercent: number;
  onMobileMenuToggle?: () => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function DashboardHeader({
  breadcrumbs,
  user,
  progressPercent,
  onMobileMenuToggle,
  className,
}: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <header
      role="banner"
      className={cn(
        "sticky top-0 z-30 flex h-16 items-center justify-between",
        "px-6 border-b border-border bg-background/80 backdrop-blur-md",
        className,
      )}
    >
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={onMobileMenuToggle}
          aria-label="Open navigation menu"
          className={cn(
            "lg:hidden h-9 w-9 rounded-lg flex items-center justify-center",
            "hover:bg-muted transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
          )}
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbItem key={crumb.label}>
                  {isLast ? (
                    <BreadcrumbPage className="font-medium text-foreground">
                      {crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <>
                      <BreadcrumbLink
                        href={crumb.href}
                        className="text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <span className="hidden sm:inline">{crumb.label}</span>
                        <span className="sm:hidden">...</span>
                      </BreadcrumbLink>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </BreadcrumbItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Progress pill */}
        <div
          className={cn(
            "hidden sm:inline-flex items-center gap-1.5 rounded-full",
            "bg-primary/10 text-primary px-3 py-1 text-xs font-semibold",
          )}
        >
          <span>{progressPercent}% Complete</span>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center",
            "hover:bg-muted transition-colors duration-200",
            "focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-ring focus-visible:ring-offset-2",
            "focus-visible:ring-offset-background",
          )}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-3">
          <span className="hidden md:block text-sm font-medium text-foreground">
            {user.name}
          </span>
          <div
            className={cn(
              "h-8 w-8 rounded-full bg-muted flex items-center justify-center",
              "overflow-hidden text-xs font-medium text-muted-foreground",
            )}
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{user.initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
```

---

## 3. Lesson Card

A clickable card representing a single lesson with title, description, status
badge, progress bar, and duration display.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-card` | Card background |
| `--color-card-foreground` | Card text |
| `--color-border` | Card border |
| `--color-primary` | Hover border accent / progress bar fill (in-progress) |
| `--color-muted` | Progress bar track |
| `--color-muted-foreground` | Description text, duration label |
| `--color-status-completed` | Completed badge |
| `--color-status-in-progress` | In-progress badge |
| `--color-status-not-started` | Not-started badge |
| `--color-status-locked` | Locked badge |
| `--color-ring` | Focus ring |

### Tailwind Class Patterns

```
/* Card container */
bg-card text-card-foreground rounded-xl border border-border
p-5 flex flex-col gap-3
transition-all duration-200
hover:shadow-md hover:border-primary/30
cursor-pointer
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-offset-2
focus-visible:ring-offset-background

/* Title */
text-base font-semibold text-card-foreground

/* Description */
text-sm text-muted-foreground line-clamp-2

/* Status badge */
inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5
text-xs font-medium

/* Progress bar track */
h-1.5 w-full rounded-full bg-muted overflow-hidden

/* Progress bar fill */
h-full rounded-full transition-all duration-500

/* Duration */
text-xs text-muted-foreground flex items-center gap-1
```

### Light / Dark Mode Behavior

- **Light**: Card is pure white (`oklch(1 0 0)`) with a subtle border. Status
  badges use vivid status tokens against a white surface. Progress bar track is
  a light muted grey.
- **Dark**: Card shifts to `oklch(0.22 0.04 175)`. Status badge colors brighten
  slightly (tokens auto-adjust). Progress bar track darkens. Hover glow is a
  softer primary/30 border.

### Responsive Behavior

- **Desktop**: Cards display in a 2- or 3-column grid (`grid-cols-2 lg:grid-cols-3`).
- **Tablet**: 2-column grid.
- **Mobile**: Single-column stack.

### Accessibility

- Each card is a focusable `<a>` or `<button>` wrapping the entire card.
- Status badge text is readable by screen readers (avoid icon-only badges).
- Progress bar has `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`,
  and `aria-valuemax="100"`.
- Locked lessons add `aria-disabled="true"` and reduce opacity.

### Example Code

```tsx
"use client";

import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, Circle, Loader2, Lock } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Variants                                                          */
/* ------------------------------------------------------------------ */

type LessonStatus = "completed" | "in-progress" | "not-started" | "locked";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        completed: "bg-[var(--color-status-completed)]/15 text-[var(--color-status-completed)]",
        "in-progress":
          "bg-[var(--color-status-in-progress)]/15 text-[var(--color-status-in-progress)]",
        "not-started":
          "bg-[var(--color-status-not-started)]/15 text-[var(--color-status-not-started)]",
        locked: "bg-[var(--color-status-locked)]/15 text-[var(--color-status-locked)]",
      },
    },
    defaultVariants: { status: "not-started" },
  },
);

const progressFillVariants = cva("h-full rounded-full transition-all duration-500", {
  variants: {
    status: {
      completed: "bg-[var(--color-status-completed)]",
      "in-progress": "bg-[var(--color-status-in-progress)]",
      "not-started": "bg-[var(--color-status-not-started)]",
      locked: "bg-[var(--color-status-locked)]",
    },
  },
  defaultVariants: { status: "not-started" },
});

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

const statusIcons: Record<LessonStatus, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle2,
  "in-progress": Loader2,
  "not-started": Circle,
  locked: Lock,
};

const statusLabels: Record<LessonStatus, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
  locked: "Locked",
};

interface LessonCardProps {
  title: string;
  description: string;
  status: LessonStatus;
  progress: number; // 0-100
  duration: string; // e.g. "15 min"
  href: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function LessonCard({
  title,
  description,
  status,
  progress,
  duration,
  href,
  className,
}: LessonCardProps) {
  const StatusIcon = statusIcons[status];
  const isLocked = status === "locked";

  return (
    <Link
      href={isLocked ? "#" : href}
      aria-disabled={isLocked || undefined}
      tabIndex={isLocked ? -1 : undefined}
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border",
        "p-5 flex flex-col gap-3",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        isLocked
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-md hover:border-primary/30 cursor-pointer",
        className,
      )}
    >
      {/* Top row: status badge + duration */}
      <div className="flex items-center justify-between">
        <span className={statusBadgeVariants({ status })}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusLabels[status]}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {duration}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
      </div>

      {/* Progress bar */}
      <div>
        <div
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Lesson progress: ${progress}%`}
          className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
        >
          <div
            className={progressFillVariants({ status })}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">{progress}%</p>
      </div>
    </Link>
  );
}
```

---

## 4. Lab Card

Similar to the Lesson Card but includes lab-specific fields: difficulty badge,
estimated time, and environment type tag.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-card` | Card background |
| `--color-card-foreground` | Card text |
| `--color-border` | Card border |
| `--color-primary` | Hover border accent |
| `--color-accent` | Environment type tag |
| `--color-muted` | Track and subtle backgrounds |
| `--color-muted-foreground` | Secondary text |
| `--color-status-*` | Status badges (same as Lesson Card) |
| `--color-warning` | Medium difficulty badge |
| `--color-destructive` | Hard difficulty badge |
| `--color-success` | Easy difficulty badge |
| `--color-ring` | Focus ring |

### Tailwind Class Patterns

```
/* Card container - same base as LessonCard */
bg-card text-card-foreground rounded-xl border border-border
p-5 flex flex-col gap-3
transition-all duration-200
hover:shadow-md hover:border-primary/30
cursor-pointer

/* Difficulty badge */
inline-flex items-center rounded-md px-2 py-0.5
text-xs font-semibold

/* Environment tag */
inline-flex items-center gap-1 rounded-md
bg-accent/10 text-accent px-2 py-0.5
text-xs font-medium

/* Footer row */
flex items-center justify-between mt-auto pt-2
border-t border-border
```

### Light / Dark Mode Behavior

- **Light**: Environment tag uses `bg-accent/10` for a subtle mint tint. Difficulty
  badges use semantic color tokens at 15% opacity backgrounds.
- **Dark**: Same token-based approach; colors auto-adjust to brighter variants per
  the dark mode CSS custom properties.

### Responsive Behavior

- Same grid behavior as Lesson Card (3-col / 2-col / 1-col).
- On mobile, the footer wraps difficulty and environment tags into a second line.

### Accessibility

- Same card-level focus and keyboard behavior as Lesson Card.
- Difficulty badge is announced by screen readers via its text content.
- Environment tag uses a visible label (no icon-only).
- `aria-disabled` on locked labs.

### Example Code

```tsx
"use client";

import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  Circle,
  Loader2,
  Lock,
  FlaskConical,
  Terminal,
  Globe,
  Container,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Variants                                                          */
/* ------------------------------------------------------------------ */

type LabStatus = "completed" | "in-progress" | "not-started" | "locked";
type Difficulty = "easy" | "medium" | "hard";
type Environment = "browser" | "terminal" | "container";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        completed: "bg-[var(--color-status-completed)]/15 text-[var(--color-status-completed)]",
        "in-progress":
          "bg-[var(--color-status-in-progress)]/15 text-[var(--color-status-in-progress)]",
        "not-started":
          "bg-[var(--color-status-not-started)]/15 text-[var(--color-status-not-started)]",
        locked: "bg-[var(--color-status-locked)]/15 text-[var(--color-status-locked)]",
      },
    },
    defaultVariants: { status: "not-started" },
  },
);

const difficultyBadgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
  {
    variants: {
      difficulty: {
        easy: "bg-success/15 text-success",
        medium: "bg-warning/15 text-warning",
        hard: "bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { difficulty: "easy" },
  },
);

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const statusIcons: Record<LabStatus, React.ComponentType<{ className?: string }>> = {
  completed: CheckCircle2,
  "in-progress": Loader2,
  "not-started": Circle,
  locked: Lock,
};

const statusLabels: Record<LabStatus, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  "not-started": "Not Started",
  locked: "Locked",
};

const environmentIcons: Record<Environment, React.ComponentType<{ className?: string }>> = {
  browser: Globe,
  terminal: Terminal,
  container: Container,
};

const environmentLabels: Record<Environment, string> = {
  browser: "Browser",
  terminal: "Terminal",
  container: "Container",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface LabCardProps {
  title: string;
  description: string;
  status: LabStatus;
  difficulty: Difficulty;
  estimatedTime: string;
  environment: Environment;
  href: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function LabCard({
  title,
  description,
  status,
  difficulty,
  estimatedTime,
  environment,
  href,
  className,
}: LabCardProps) {
  const StatusIcon = statusIcons[status];
  const EnvIcon = environmentIcons[environment];
  const isLocked = status === "locked";

  return (
    <Link
      href={isLocked ? "#" : href}
      aria-disabled={isLocked || undefined}
      tabIndex={isLocked ? -1 : undefined}
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border",
        "p-5 flex flex-col gap-3",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-ring focus-visible:ring-offset-2",
        "focus-visible:ring-offset-background",
        isLocked
          ? "opacity-60 cursor-not-allowed"
          : "hover:shadow-md hover:border-primary/30 cursor-pointer",
        className,
      )}
    >
      {/* Top row: status badge + estimated time */}
      <div className="flex items-center justify-between">
        <span className={statusBadgeVariants({ status })}>
          <StatusIcon className="h-3.5 w-3.5" />
          {statusLabels[status]}
        </span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {estimatedTime}
        </span>
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-accent shrink-0" aria-hidden="true" />
          <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
      </div>

      {/* Footer: difficulty + environment */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
        <span className={difficultyBadgeVariants({ difficulty })}>
          {difficultyLabels[difficulty]}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md",
            "bg-accent/10 text-accent px-2 py-0.5",
            "text-xs font-medium",
          )}
        >
          <EnvIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {environmentLabels[environment]}
        </span>
      </div>
    </Link>
  );
}
```

---

## 5. Progress Ring

A circular SVG progress indicator ranging from 60 px to 120 px. Uses
stroke-based animation with a percentage display in the center.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-chart-1` | Active stroke color (primary ring fill) |
| `--color-muted` | Background ring stroke |
| `--color-foreground` | Percentage text |
| `--color-muted-foreground` | Optional label below percentage |

### Tailwind Class Patterns

```
/* Container */
relative inline-flex items-center justify-center

/* SVG */
-rotate-90

/* Background circle */
stroke: var(--color-muted)
fill: none
stroke-width: 8

/* Active circle */
stroke: var(--color-chart-1)
fill: none
stroke-width: 8
stroke-linecap: round
transition: stroke-dashoffset 0.5s ease-in-out

/* Center text */
absolute inset-0 flex flex-col items-center justify-center
text-foreground font-bold
```

### Light / Dark Mode Behavior

- **Light**: Background ring is a soft muted grey. Active stroke is vivid aqua
  (`oklch(0.7 0.18 220)`).
- **Dark**: Background ring darkens. Active stroke shifts to the brighter dark
  variant (`oklch(0.75 0.16 220)`). Percentage text renders in the light
  foreground color.

### Responsive Behavior

- Size is controlled via the `size` prop (60-120 px). Use 60 px in condensed
  layouts, 80 px in card widgets, and 120 px for hero/overview sections.
- The component scales proportionally; stroke width and font size adjust based on
  the chosen size.

### Accessibility

- SVG carries `role="img"` and `aria-label` describing the progress (e.g.,
  "Course progress: 72%").
- The percentage text inside is `aria-hidden="true"` since the `aria-label`
  provides the same information.

### Example Code

```tsx
"use client";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface ProgressRingProps {
  /** 0-100 */
  value: number;
  /** Diameter in pixels (60-120) */
  size?: number;
  /** Stroke width in pixels */
  strokeWidth?: number;
  /** Optional label rendered below the percentage */
  label?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // Scale font based on ring size
  const valueFontSize = size >= 100 ? "text-xl" : size >= 80 ? "text-base" : "text-sm";
  const labelFontSize = size >= 100 ? "text-xs" : "text-[10px]";

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Progress: ${value}%${label ? ` - ${label}` : ""}`}
        className="-rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {/* Active ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className="stroke-chart-1 transition-all duration-500 ease-in-out"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      {/* Center label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        aria-hidden="true"
      >
        <span className={cn("font-bold text-foreground", valueFontSize)}>
          {value}%
        </span>
        {label && (
          <span className={cn("text-muted-foreground", labelFontSize)}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Grade Badge

Displays letter grades A through F with color-coded backgrounds using the
grade color tokens. Minimum width of 2 rem, bold centered text, and
`rounded-md` corners.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-grade-a` | Grade A background (green) |
| `--color-grade-b` | Grade B background (mint) |
| `--color-grade-c` | Grade C background (yellow) |
| `--color-grade-d` | Grade D background (orange) |
| `--color-grade-f` | Grade F background (red) |
| `--color-foreground` | Text on lighter badges (C in light mode) |

### Tailwind Class Patterns

```
/* Badge base */
inline-flex items-center justify-center rounded-md
px-2.5 py-1 text-sm font-bold
min-w-[2rem] text-center

/* Per-grade background + foreground */
bg-[var(--color-grade-a)] text-white       /* A */
bg-[var(--color-grade-b)] text-white       /* B */
bg-[var(--color-grade-c)] text-foreground  /* C */
bg-[var(--color-grade-d)] text-white       /* D */
bg-[var(--color-grade-f)] text-white       /* F */
```

### Light / Dark Mode Behavior

- **Light**: Grade colors are vivid with high chroma. Grade C (warning yellow) uses
  dark foreground text for sufficient contrast.
- **Dark**: Grade tokens shift to brighter/lighter variants to maintain contrast
  against the dark card backgrounds. Grade C switches to dark foreground text
  since the yellow brightens.

### Responsive Behavior

- The badge is an inline element that does not change across breakpoints.
- When used inside a table cell, it stays centered with `text-center` on the
  parent `<td>`.

### Accessibility

- Badge text is the grade letter itself, which is readable by screen readers.
- When used alongside a course name, ensure the badge is associated via
  `aria-label` on the row or a visually hidden label such as
  `<span className="sr-only">Grade: </span>`.
- Color is never the sole indicator -- the letter itself conveys the grade.

### Example Code

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Variants                                                          */
/* ------------------------------------------------------------------ */

type Grade = "A" | "B" | "C" | "D" | "F";

const gradeBadgeVariants = cva(
  [
    "inline-flex items-center justify-center rounded-md",
    "px-2.5 py-1 text-sm font-bold",
    "min-w-[2rem] text-center",
  ],
  {
    variants: {
      grade: {
        A: "bg-[var(--color-grade-a)] text-white",
        B: "bg-[var(--color-grade-b)] text-white",
        C: "bg-[var(--color-grade-c)] text-foreground",
        D: "bg-[var(--color-grade-d)] text-white",
        F: "bg-[var(--color-grade-f)] text-white",
      },
    },
    defaultVariants: { grade: "A" },
  },
);

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface GradeBadgeProps extends VariantProps<typeof gradeBadgeVariants> {
  grade: Grade;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function GradeBadge({ grade, className }: GradeBadgeProps) {
  return (
    <span className={cn(gradeBadgeVariants({ grade }), className)}>
      {grade}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Usage example                                                     */
/* ------------------------------------------------------------------ */

// <GradeBadge grade="A" />
// <GradeBadge grade="C" />
// <GradeBadge grade="F" className="text-base" />
```

---

## 7. Data Table

A sortable, responsive data table for listing lessons and labs. Built on
shadcn/ui Table primitives. On mobile, rows transform into card-based layouts.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-card` | Table background |
| `--color-card-foreground` | Table text |
| `--color-border` | Row borders |
| `--color-muted` | Header background, hover row |
| `--color-muted-foreground` | Header text, secondary cell text |
| `--color-primary` | Sort indicator, focused row ring |
| `--color-ring` | Focus ring |

### Tailwind Class Patterns

```
/* Table wrapper */
w-full overflow-auto rounded-xl border border-border bg-card

/* Table */
w-full caption-bottom text-sm

/* Table header */
bg-muted/50

/* Header cell */
h-10 px-4 text-left text-xs font-semibold uppercase
tracking-wider text-muted-foreground
cursor-pointer select-none
hover:text-foreground transition-colors duration-200

/* Body row */
border-b border-border
transition-colors duration-150
hover:bg-muted/50

/* Body cell */
px-4 py-3 text-sm text-card-foreground

/* Sort indicator */
ml-1 inline-block text-primary

/* Mobile card (hidden on desktop) */
md:hidden bg-card rounded-xl border border-border p-4
flex flex-col gap-2 mb-3
```

### Light / Dark Mode Behavior

- **Light**: Table background is white. Header row has a subtle muted tint.
  Hover rows lighten further with `bg-muted/50`. Borders are crisp.
- **Dark**: Table background is `oklch(0.22 0.04 175)`. Header and hover tints
  use the dark `muted` variant. Borders become translucent white.

### Responsive Behavior

- **Desktop (>=768 px)**: Standard table layout with sortable column headers.
- **Mobile (<768 px)**: Table is hidden via `hidden md:table`. A card-based list
  is shown instead, rendering each row as a stacked card with labeled fields.

### Accessibility

- Table has `role="table"` (native `<table>` element).
- Sortable headers use `<button>` elements with `aria-sort` attribute
  (`ascending`, `descending`, `none`).
- `aria-label` on the table describes its purpose.
- Keyboard navigation: `Tab` moves between sortable headers and interactive cells.
- Row hover is visual only -- keyboard focus is indicated by focus ring on
  interactive elements within the row.

### Example Code

```tsx
"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GradeBadge } from "@/components/grade-badge";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type SortDirection = "asc" | "desc" | null;

interface Column<T> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  ariaLabel?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Sort icon helper                                                  */
/* ------------------------------------------------------------------ */

function SortIcon({ direction }: { direction: SortDirection }) {
  if (direction === "asc") return <ChevronUp className="ml-1 inline-block h-3.5 w-3.5 text-primary" />;
  if (direction === "desc") return <ChevronDown className="ml-1 inline-block h-3.5 w-3.5 text-primary" />;
  return <ChevronsUpDown className="ml-1 inline-block h-3.5 w-3.5 text-muted-foreground/50" />;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  ariaLabel = "Data table",
  className,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>(null);

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDir) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null || bVal == null) return 0;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
      if (sortDir === "desc") setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function getAriaSortValue(key: string): "ascending" | "descending" | "none" {
    if (sortKey !== key || !sortDir) return "none";
    return sortDir === "asc" ? "ascending" : "descending";
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop table */}
      <div className="hidden md:block overflow-auto rounded-xl border border-border bg-card">
        <Table aria-label={ariaLabel}>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="h-10 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                  aria-sort={col.sortable ? getAriaSortValue(col.key) : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(col.key)}
                      className={cn(
                        "inline-flex items-center gap-0.5",
                        "hover:text-foreground transition-colors duration-200",
                        "focus-visible:outline-none focus-visible:ring-2",
                        "focus-visible:ring-ring focus-visible:ring-offset-1",
                        "focus-visible:ring-offset-muted/50 rounded",
                      )}
                    >
                      {col.label}
                      <SortIcon
                        direction={sortKey === col.key ? sortDir : null}
                      />
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((row, i) => (
              <TableRow
                key={i}
                className="border-b border-border transition-colors duration-150 hover:bg-muted/50"
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className="px-4 py-3 text-sm text-card-foreground"
                  >
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? "")}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden space-y-3">
        {sortedData.map((row, i) => (
          <div
            key={i}
            className="bg-card rounded-xl border border-border p-4 flex flex-col gap-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-sm text-card-foreground text-right">
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? "")}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Usage example                                                     */
/* ------------------------------------------------------------------ */

/*
import { DataTable } from "@/components/data-table";
import { GradeBadge } from "@/components/grade-badge";

const columns = [
  { key: "title", label: "Lesson", sortable: true },
  { key: "status", label: "Status", sortable: true },
  {
    key: "grade",
    label: "Grade",
    sortable: true,
    render: (value: unknown) =>
      value ? <GradeBadge grade={value as "A" | "B" | "C" | "D" | "F"} /> : "-",
  },
  { key: "duration", label: "Duration", sortable: true },
];

const data = [
  { title: "Intro to React", status: "Completed", grade: "A", duration: "15 min" },
  { title: "State Management", status: "In Progress", grade: null, duration: "25 min" },
];

<DataTable columns={columns} data={data} ariaLabel="Lessons table" />
*/
```

---

## 8. Stats Card

Displays a single metric with a large value, a descriptive label, and an
optional trend indicator. Uses `rounded-xl` and `border`.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-card` | Card background |
| `--color-card-foreground` | Default text |
| `--color-border` | Card border |
| `--color-primary` | Metric value text |
| `--color-muted-foreground` | Label text |
| `--color-success` | Positive trend indicator |
| `--color-destructive` | Negative trend indicator |

### Tailwind Class Patterns

```
/* Card */
bg-card text-card-foreground rounded-xl border border-border
p-5 flex flex-col items-center text-center
transition-shadow duration-200 hover:shadow-md

/* Metric value */
text-3xl font-bold text-primary

/* Label */
text-sm text-muted-foreground mt-1

/* Trend indicator (up) */
inline-flex items-center gap-1 text-xs font-medium text-success mt-2

/* Trend indicator (down) */
inline-flex items-center gap-1 text-xs font-medium text-destructive mt-2

/* Trend neutral */
inline-flex items-center gap-1 text-xs font-medium text-muted-foreground mt-2
```

### Light / Dark Mode Behavior

- **Light**: Card is white with a subtle border. Primary value is vivid aqua.
  Success/destructive trends are bright green/red.
- **Dark**: Card darkens to `oklch(0.22 0.04 175)`. Primary value lightens.
  Trend colors shift to their dark-mode-adjusted variants for readability.

### Responsive Behavior

- Stats cards are arranged in a responsive grid:
  `grid grid-cols-2 lg:grid-cols-4 gap-4`.
- On mobile (single column), cards can be laid out in a 2-column grid to save
  vertical space.

### Accessibility

- Each stats card uses `role="region"` with `aria-label` describing the metric
  (e.g., `aria-label="Lessons completed: 24"`).
- Trend direction is communicated via text ("up", "down"), not solely by color
  or icon.
- The trend value includes a visually hidden directional cue for screen readers
  (e.g., `<span className="sr-only">increased by</span>`).

### Example Code

```tsx
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface StatsCardProps {
  value: string | number;
  label: string;
  trend?: {
    direction: "up" | "down" | "neutral";
    value: string; // e.g. "+12%"
  };
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function StatsCard({ value, label, trend, className }: StatsCardProps) {
  const trendConfig = {
    up: {
      icon: TrendingUp,
      className: "text-success",
      srLabel: "increased by",
    },
    down: {
      icon: TrendingDown,
      className: "text-destructive",
      srLabel: "decreased by",
    },
    neutral: {
      icon: Minus,
      className: "text-muted-foreground",
      srLabel: "unchanged at",
    },
  };

  const TrendIcon = trend ? trendConfig[trend.direction].icon : null;

  return (
    <div
      role="region"
      aria-label={`${label}: ${value}`}
      className={cn(
        "bg-card text-card-foreground rounded-xl border border-border",
        "p-5 flex flex-col items-center text-center",
        "transition-shadow duration-200 hover:shadow-md",
        className,
      )}
    >
      <span className="text-3xl font-bold text-primary">{value}</span>
      <span className="text-sm text-muted-foreground mt-1">{label}</span>

      {trend && TrendIcon && (
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium mt-2",
            trendConfig[trend.direction].className,
          )}
        >
          <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">{trendConfig[trend.direction].srLabel}</span>
          {trend.value}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Usage example                                                     */
/* ------------------------------------------------------------------ */

/*
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <StatsCard value={24} label="Lessons Completed" trend={{ direction: "up", value: "+3 this week" }} />
  <StatsCard value="87%" label="Average Score" trend={{ direction: "up", value: "+5%" }} />
  <StatsCard value={6} label="Labs Remaining" trend={{ direction: "down", value: "-2" }} />
  <StatsCard value="12h" label="Total Study Time" trend={{ direction: "neutral", value: "same as last week" }} />
</div>
*/
```

---

## 9. Breadcrumb

Displays the current navigation path using the shadcn/ui Breadcrumb primitives.
Uses `ChevronRight` as the separator icon. The last item is non-linked (current
page). Truncates on mobile.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-foreground` | Current page text |
| `--color-muted-foreground` | Ancestor links, separator icons |
| `--color-primary` | Hovered link text |
| `--color-ring` | Focus ring on links |

### Tailwind Class Patterns

```
/* Breadcrumb nav */
flex items-center text-sm

/* Breadcrumb list */
flex items-center gap-1.5

/* Breadcrumb link (ancestor) */
text-muted-foreground
hover:text-primary transition-colors duration-200
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring focus-visible:ring-offset-2
focus-visible:ring-offset-background rounded-sm

/* Separator */
text-muted-foreground/50

/* Current page (last item) */
font-medium text-foreground
```

### Light / Dark Mode Behavior

- **Light**: Ancestor links are muted grey. Current page is dark foreground.
  Hover transitions links to aqua primary.
- **Dark**: Same token-driven approach. Links brighten on hover to the lighter
  aqua variant. Separators remain faint translucent text.

### Responsive Behavior

- **Desktop**: All breadcrumb segments are visible.
- **Tablet**: Middle segments are truncated with an ellipsis dropdown
  (`BreadcrumbEllipsis` from shadcn/ui) if more than 3 segments exist.
- **Mobile (<640 px)**: Only the immediate parent and current page are shown.
  All other segments are collapsed into an ellipsis trigger.

### Accessibility

- Wrapped in `<nav aria-label="Breadcrumb">`.
- Uses an `<ol>` element for the ordered list of links.
- Current page uses `aria-current="page"`.
- Separator icons have `aria-hidden="true"`.
- Ellipsis trigger is a `<button>` with `aria-label="Show full breadcrumb path"`.

### Example Code

```tsx
"use client";

import { cn } from "@/lib/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

interface BreadcrumbSegment {
  label: string;
  href?: string;
}

interface DashboardBreadcrumbProps {
  segments: BreadcrumbSegment[];
  /** Max visible items before collapsing middle segments (default: 3) */
  maxVisible?: number;
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function DashboardBreadcrumb({
  segments,
  maxVisible = 3,
  className,
}: DashboardBreadcrumbProps) {
  const shouldCollapse = segments.length > maxVisible;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];
  const middleSegments = segments.slice(1, -1);

  // On mobile, show only parent + current
  // On desktop, show all or collapse middle
  const visibleMiddle = shouldCollapse ? [] : middleSegments;
  const collapsedMiddle = shouldCollapse ? middleSegments : [];

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex items-center gap-1.5 text-sm">
        {/* First segment */}
        {segments.length > 1 && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={firstSegment.href}
                className={cn(
                  "text-muted-foreground",
                  "hover:text-primary transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2",
                  "focus-visible:ring-ring focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-background rounded-sm",
                )}
              >
                {firstSegment.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
            </BreadcrumbSeparator>
          </>
        )}

        {/* Collapsed middle (ellipsis dropdown) */}
        {collapsedMiddle.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "flex items-center gap-1 text-muted-foreground",
                    "hover:text-primary transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2",
                    "focus-visible:ring-ring focus-visible:ring-offset-2",
                    "focus-visible:ring-offset-background rounded-sm",
                  )}
                  aria-label="Show full breadcrumb path"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {collapsedMiddle.map((seg) => (
                    <DropdownMenuItem key={seg.label} asChild>
                      <a href={seg.href}>{seg.label}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
            </BreadcrumbSeparator>
          </>
        )}

        {/* Visible middle segments */}
        {visibleMiddle.map((seg) => (
          <BreadcrumbItem key={seg.label}>
            <BreadcrumbLink
              href={seg.href}
              className={cn(
                "text-muted-foreground hidden sm:inline",
                "hover:text-primary transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-ring focus-visible:ring-offset-2",
                "focus-visible:ring-offset-background rounded-sm",
              )}
            >
              {seg.label}
            </BreadcrumbLink>
            <BreadcrumbSeparator className="hidden sm:flex">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
            </BreadcrumbSeparator>
          </BreadcrumbItem>
        ))}

        {/* Current page (last segment, non-linked) */}
        <BreadcrumbItem>
          <BreadcrumbPage
            className="font-medium text-foreground"
            aria-current="page"
          >
            {lastSegment.label}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

/* ------------------------------------------------------------------ */
/*  Usage example                                                     */
/* ------------------------------------------------------------------ */

/*
<DashboardBreadcrumb
  segments={[
    { label: "Dashboard", href: "/dashboard" },
    { label: "Lessons", href: "/lessons" },
    { label: "Module 3", href: "/lessons/module-3" },
    { label: "React State Management" },
  ]}
/>
*/
```

---

## 10. Toast / Notification

Uses the **Sonner** toast library with semantic color tokens for
success, error, info, and warning variants. Positioned top-right with
auto-dismiss after 5 seconds.

### Token Usage

| Token (CSS Custom Property) | Purpose |
|---|---|
| `--color-success` | Success toast accent/icon |
| `--color-success-foreground` | Success toast text (on filled variant) |
| `--color-destructive` | Error toast accent/icon |
| `--color-destructive-foreground` | Error toast text (on filled variant) |
| `--color-info` | Info toast accent/icon |
| `--color-info-foreground` | Info toast text (on filled variant) |
| `--color-warning` | Warning toast accent/icon |
| `--color-warning-foreground` | Warning toast text (on filled variant) |
| `--color-card` | Toast background |
| `--color-card-foreground` | Toast text |
| `--color-border` | Toast border |

### Tailwind Class Patterns

```
/* Sonner toaster container positioning */
[data-sonner-toaster] {
  --offset: 1rem;
}

/* Toast base */
group rounded-xl border border-border
bg-card text-card-foreground
shadow-lg p-4

/* Toast title */
text-sm font-semibold

/* Toast description */
text-sm text-muted-foreground

/* Success toast */
border-success/30 [&>svg]:text-success

/* Error toast */
border-destructive/30 [&>svg]:text-destructive

/* Warning toast */
border-warning/30 [&>svg]:text-warning

/* Info toast */
border-info/30 [&>svg]:text-info

/* Close button */
text-muted-foreground hover:text-foreground
transition-colors duration-200
focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-ring
```

### Light / Dark Mode Behavior

- **Light**: Toasts have a white card background with a colored left-border accent
  matching the variant. Icons use the full semantic color.
- **Dark**: Background shifts to the dark card token. Borders become translucent
  with the semantic color at 30% opacity. Icon colors brighten per the dark mode
  token adjustments.

### Responsive Behavior

- **Desktop**: Toasts appear in the top-right corner, stacking downward.
- **Mobile (<640 px)**: Toasts appear at the top-center, full-width with padding.
  This prevents them from being cut off on small screens.

### Accessibility

- Sonner uses `role="status"` and `aria-live="polite"` by default.
- Error toasts use `aria-live="assertive"` for immediate announcement.
- Close button has `aria-label="Close notification"`.
- Toasts are focusable and can be dismissed with `Escape`.
- Auto-dismiss pauses on hover/focus for users who need more reading time.

### Example Code

```tsx
// -----------------------------------------------------------------
// 1. Setup: Add the Toaster component to your root layout
// -----------------------------------------------------------------

// app/layout.tsx
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            classNames: {
              toast: cn(
                "group rounded-xl border shadow-lg p-4",
                "bg-card text-card-foreground border-border",
              ),
              title: "text-sm font-semibold",
              description: "text-sm text-muted-foreground",
              closeButton: cn(
                "text-muted-foreground hover:text-foreground",
                "transition-colors duration-200",
              ),
              success: "border-success/30 [&>svg]:text-success",
              error: "border-destructive/30 [&>svg]:text-destructive",
              warning: "border-warning/30 [&>svg]:text-warning",
              info: "border-info/30 [&>svg]:text-info",
            },
          }}
          closeButton
        />
      </body>
    </html>
  );
}

// -----------------------------------------------------------------
// 2. Toast helper: Wraps Sonner's toast() with GWTH styling
// -----------------------------------------------------------------

// lib/toast.ts
import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { createElement } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ShowToastOptions {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

const variantIcons: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

export function showToast({
  title,
  description,
  variant = "info",
  duration = 5000,
}: ShowToastOptions) {
  const icon = createElement(variantIcons[variant], {
    className: "h-5 w-5",
  });

  switch (variant) {
    case "success":
      return sonnerToast.success(title, { description, duration, icon });
    case "error":
      return sonnerToast.error(title, { description, duration, icon });
    case "warning":
      return sonnerToast.warning(title, { description, duration, icon });
    case "info":
    default:
      return sonnerToast.info(title, { description, duration, icon });
  }
}

// -----------------------------------------------------------------
// 3. Usage in components
// -----------------------------------------------------------------

/*
"use client";

import { showToast } from "@/lib/toast";

export function LessonActions() {
  function handleComplete() {
    // ... complete lesson logic
    showToast({
      title: "Lesson Completed",
      description: "Great work! You've finished React State Management.",
      variant: "success",
    });
  }

  function handleError() {
    showToast({
      title: "Submission Failed",
      description: "Could not save your progress. Please try again.",
      variant: "error",
    });
  }

  function handleWarning() {
    showToast({
      title: "Unsaved Changes",
      description: "You have unsaved work in this lab.",
      variant: "warning",
    });
  }

  function handleInfo() {
    showToast({
      title: "New Lab Available",
      description: "Docker Fundamentals lab has been unlocked.",
      variant: "info",
    });
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleComplete}
        className="rounded-lg bg-success px-4 py-2 text-sm font-medium text-success-foreground hover:bg-success/90 transition-colors duration-200"
      >
        Complete
      </button>
      <button
        type="button"
        onClick={handleError}
        className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors duration-200"
      >
        Trigger Error
      </button>
      <button
        type="button"
        onClick={handleWarning}
        className="rounded-lg bg-warning px-4 py-2 text-sm font-medium text-warning-foreground hover:bg-warning/90 transition-colors duration-200"
      >
        Warning
      </button>
      <button
        type="button"
        onClick={handleInfo}
        className="rounded-lg bg-info px-4 py-2 text-sm font-medium text-info-foreground hover:bg-info/90 transition-colors duration-200"
      >
        Info
      </button>
    </div>
  );
}
*/
```

---

## Quick Reference: Token-to-Component Map

| Component | Primary Tokens |
|---|---|
| Sidebar Navigation | `sidebar`, `sidebar-primary`, `sidebar-accent`, `sidebar-border`, `sidebar-ring`, `sidebar-muted` |
| Dashboard Header | `background`, `foreground`, `border`, `primary`, `muted`, `muted-foreground`, `ring` |
| Lesson Card | `card`, `card-foreground`, `border`, `primary`, `muted`, `muted-foreground`, `status-*`, `ring` |
| Lab Card | `card`, `card-foreground`, `border`, `primary`, `accent`, `muted`, `muted-foreground`, `status-*`, `success`, `warning`, `destructive`, `ring` |
| Progress Ring | `chart-1`, `muted`, `foreground`, `muted-foreground` |
| Grade Badge | `grade-a`, `grade-b`, `grade-c`, `grade-d`, `grade-f`, `foreground` |
| Data Table | `card`, `card-foreground`, `border`, `muted`, `muted-foreground`, `primary`, `ring` |
| Stats Card | `card`, `card-foreground`, `border`, `primary`, `muted-foreground`, `success`, `destructive` |
| Breadcrumb | `foreground`, `muted-foreground`, `primary`, `ring` |
| Toast / Notification | `card`, `card-foreground`, `border`, `success`, `destructive`, `warning`, `info`, `muted-foreground` |

---

## Animation Standards

All components follow these animation standards:

| Interaction | Duration | Easing | Tailwind Class |
|---|---|---|---|
| Hover transitions (color, bg, border) | `0.2s` | `ease` | `transition-colors duration-200` |
| Hover transitions (shadow, transform) | `0.2s` | `ease` | `transition-all duration-200` |
| Entrance animations | `0.3s` | `ease-out` | `animate-in` (custom keyframe) |
| Progress bar / ring fill | `0.5s` | `ease-in-out` | `transition-all duration-500 ease-in-out` |
| Sidebar expand/collapse | `0.2s` | `ease` | `transition-all duration-200` |
| Theme icon rotation | default | default | Tailwind `transition-all` with rotate/scale |

---

## Shared Utility: `cn()` Function

All components use the `cn()` utility built from `clsx` and `tailwind-merge`:

```ts
// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## File Dependencies

```
@/lib/utils           -> cn() utility (clsx + tailwind-merge)
@/components/ui/*     -> shadcn/ui primitives (Table, Breadcrumb, DropdownMenu)
lucide-react          -> All icons
class-variance-authority -> CVA variant definitions
next-themes           -> Theme toggle (useTheme hook)
sonner                -> Toast notifications
next/link             -> Client-side navigation
next/image            -> Optimized images (avatar)
```
