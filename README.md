# Design System

A token-based, multi-project design system for building consistent, themeable websites with Tailwind CSS v4, shadcn/ui, and W3C Design Tokens.

## Quick Start

1. Copy `tokens/` to your project
2. Copy `templates/globals.css` to `src/app/globals.css`
3. Copy `scripts/cn-utility.ts` to `src/lib/utils.ts`
4. Choose a theme from `themes/` and apply it
5. Install shadcn: `npx shadcn@latest init`

## Folder Structure

```
design-system/
├── tokens/
│   ├── base.css                    # Spacing, radii, shadows (SHARED - do not change per site)
│   ├── colors.css                  # Color palette (SITE-SPECIFIC - customize per project)
│   ├── typography.css              # Fonts and text (SITE-SPECIFIC - customize per project)
│   └── design-tokens.tokens.json   # W3C Design Tokens format for tooling
├── templates/
│   ├── globals.css                 # Tailwind v4 @theme integration template
│   └── starter-theme.json          # Base theme JSON for new sites
├── themes/
│   ├── acg-theme.json              # Agile Commerce AI theme
│   ├── gwth-ocean-tech.json        # GWTH.ai Ocean Tech theme
│   ├── gwth-student.json           # GWTH Student Backend theme
│   ├── gwth-student-colors.css     # Student backend color tokens
│   ├── gwth-student-globals.css    # Student backend ready-to-use globals
│   └── gwth-student-components.md  # Student backend component guide
├── examples/
│   ├── agilecommerce-theme.json    # ACG example theme
│   └── agilecommerce/              # ACG site content example
├── scripts/
│   └── cn-utility.ts               # className utility (clsx + tailwind-merge)
├── skills/
│   ├── design-system/SKILL.md      # Design system reference skill
│   └── new-site/SKILL.md           # New site creation skill
├── commands/
│   ├── extract-colors.md           # Extract colors from inspiration site
│   └── apply-theme.md              # Apply theme to project tokens
├── agents/
│   ├── design-generator.md         # UI generation sub-agent
│   └── design-reviewer.md          # Design review sub-agent
├── mockup/                         # Visual verification app
│   ├── src/app/                    # Next.js showcase pages
│   └── playwright/                 # Playwright visual tests
├── README.md                       # This file
└── DESIGN_SYSTEM_WORKFLOW.md       # Complete workflow guide
```

## Multi-Project Usage

This design system is project-agnostic. The canonical copy lives at `C:\Projects\design-system\`.

### Using in a New Project

1. **Copy token files**: Copy `tokens/` to your project's design-system directory
2. **Choose a theme**: Select from `themes/` or create with `/new-site`
3. **Apply the theme**: Run `/apply-theme path/to/theme.json` or manually update `colors.css`
4. **Set up globals**: Copy `templates/globals.css` to `src/app/globals.css`, update import paths
5. **Install utilities**: Copy `scripts/cn-utility.ts` to `src/lib/utils.ts`

### For Dashboard Projects (GWTH Student Backend)

Use the dashboard-specific files:
- `themes/gwth-student-globals.css` - Drop-in globals.css with sidebar, lesson cards, grade badges
- `themes/gwth-student-colors.css` - Extended color tokens with status, grade, and chart colors
- `themes/gwth-student-components.md` - Full component implementation guide

## Token Architecture

### Shared Tokens (base.css) - DO NOT CHANGE PER SITE
- Spacing scale (0 to 96)
- Border radius (none to full)
- Box shadows (xs to 2xl)
- Animation durations and easing functions
- Z-index scale
- Breakpoints and container widths

### Site-Specific Tokens - CUSTOMIZE PER PROJECT
- **colors.css**: Semantic colors (primary, secondary, accent, etc.) in HSL format
- **typography.css**: Font families, sizes, weights, line heights

### Color Formats

| Format | Used In | Purpose |
|--------|---------|---------|
| HSL `H S% L%` | Theme JSONs, colors.css | Easy manipulation, Tailwind opacity |
| OKLCH `oklch(L C H)` | globals.css, runtime CSS | Perceptually uniform, modern |
| W3C `$value` | design-tokens.tokens.json | Tooling interop (Style Dictionary, Figma) |

## Creating a New Theme

### Option 1: Claude Skill
```
/new-site https://inspiration-site.com
```

### Option 2: Manual
1. Copy `templates/starter-theme.json`
2. Update colors using [Realtime Colors](https://www.realtimecolors.com/)
3. Run `/apply-theme path/to/theme.json`

## W3C Design Tokens

The `tokens/design-tokens.tokens.json` file follows the [W3C Design Tokens Community Group spec (2025.10)](https://www.designtokens.org/TR/2025.10/format/). It maps all CSS custom properties for use with:
- [Style Dictionary v4](https://styledictionary.com/)
- [Tokens Studio](https://tokens.studio/)
- Figma token plugins
- Any DTCG-compatible tool

## Visual Verification

The `mockup/` directory contains a Next.js app that showcases all design tokens:

```bash
cd mockup
npm install
npm run dev -- --port 3099
# Visit http://localhost:3099

# Run visual regression tests
npx playwright test

# Run accessibility tests
npx playwright test --grep @a11y
```

## Sub-Agent Review

Use the agents for automated design review:
- **design-generator** (`agents/design-generator.md`): Generates components following the design system
- **design-reviewer** (`agents/design-reviewer.md`): Reviews code for token compliance, accessibility, and visual consistency

## Available Skills

| Skill | Command | Purpose |
|-------|---------|---------|
| Design System | `/design-system` | Reference for building components |
| New Site | `/new-site [urls]` | Create theme from inspiration |
| Extract Colors | `/extract-colors [url]` | Get color palette from site |
| Apply Theme | `/apply-theme [path]` | Apply theme to tokens |

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 16 | React app foundation |
| Styling | Tailwind CSS v4 | Utility-first CSS with @theme |
| Components | shadcn/ui | Accessible, unstyled primitives |
| Tokens | CSS Variables (OKLCH/HSL) | Design token management |
| Variants | CVA | Component variant management |
| W3C Tokens | .tokens.json | Tooling interoperability |
| Testing | Playwright + axe-core | Visual regression + accessibility |

## Resources

- [DESIGN_SYSTEM_WORKFLOW.md](./DESIGN_SYSTEM_WORKFLOW.md) - Complete workflow guide
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [W3C Design Tokens Spec](https://www.designtokens.org/TR/2025.10/format/)
- [Realtime Colors](https://www.realtimecolors.com/)
- [OKLCH Color Picker](https://oklch.com/)
