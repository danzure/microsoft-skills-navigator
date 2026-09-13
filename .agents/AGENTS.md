# Antigravity Agent Guidelines & Rules

This document governs the architecture, design standards, data structures, credential lifecycle management, state persistence, interactive engines, and development workflows for the **Microsoft Certification Tracker & Career Roadmap Tool** (`atozazure-mscertification-tool`). All automated agents and contributors must strictly adhere to these instructions.

---

## Table of Contents
1. [Core Architecture, Technology Stack & Build Pipeline](#1-core-architecture-technology-stack--build-pipeline)
   - 1.1 [Technology Ecosystem](#11-technology-ecosystem)
   - 1.2 [Domain Directory Map & Code Structure](#12-domain-directory-map--code-structure)
   - 1.3 [Vite ESM Bundler & Manual Chunking Strategy](#13-vite-esm-bundler--manual-chunking-strategy)
   - 1.4 [Single-Page Routing & Static Web App Config](#14-single-page-routing--static-web-app-config)
2. [Fluent 2 Design System & Presentation Architecture](#2-fluent-2-design-system--presentation-architecture)
   - 2.1 [Strict Styling Architecture (Vanilla CSS & BEM)](#21-strict-styling-architecture-vanilla-css--bem)
   - 2.2 [Design Tokens & Dual Theme Symmetry](#22-design-tokens--dual-theme-symmetry)
   - 2.3 [Typography Ramp, Shape System & Geometry Standards](#23-typography-ramp-shape-system--geometry-standards)
   - 2.4 [Badge System, Focus Tags & Card Placement Hierarchy](#24-badge-system-focus-tags--card-placement-hierarchy)
   - 2.5 [Foundation Components & Fluent 2 UI Patterns](#25-foundation-components--fluent-2-ui-patterns)
   - 2.6 [Iconography System: IconMap vs ProductIcons](#26-iconography-system-iconmap-vs-producticons)
   - 2.7 [Micro-interactions, Motion, Focus & Accessibility](#27-micro-interactions-motion-focus--accessibility)
3. [Domain Data Models & Credential Lifecycle Governance](#3-domain-data-models--credential-lifecycle-governance)
   - 3.1 [Pillars Enum (`PILLARS`) & Active Track Catalog (11 Tracks)](#31-pillars-enum-pillars--active-track-catalog-11-tracks)
   - 3.2 [Track & Branch Object Schemas](#32-track--branch-object-schemas)
   - 3.3 [Certification Credential Schema & Prerequisites Engine](#33-certification-credential-schema--prerequisites-engine)
   - 3.4 [Applied Skills Credential Schema & Zero-Retired Governance](#34-applied-skills-credential-schema--zero-retired-governance)
   - 3.5 [Career Roles Schema (`careerRoles.js`)](#35-career-roles-schema-careerrolesjs)
   - 3.6 [Central Data Helper APIs](#36-central-data-helper-apis)
   - 3.7 [Primary Sources of Truth & Lifecycle State Machine](#37-primary-sources-of-truth--lifecycle-state-machine)
   - 3.8 [Rule of Recency, Renewal & 12-Month Pruning Standards](#38-rule-of-recency-renewal--12-month-pruning-standards)
   - 3.9 [Verification Quality Gates (URLs & Badges)](#39-verification-quality-gates-urls--badges)
4. [State Management, Persistence & Multi-Currency Engine](#4-state-management-persistence--multi-currency-engine)
   - 4.1 [LocalStorage Inventory & Key Registry (9 Keys)](#41-localstorage-inventory--key-registry-9-keys)
   - 4.2 [Backup, Restore & Reset Parity (JSON Schema)](#42-backup-restore--reset-parity-json-schema)
   - 4.3 [Auto-Tracking & Prerequisite Unlock Celebrations](#43-auto-tracking--prerequisite-unlock-celebrations)
   - 4.4 [Multi-Currency Pricing Engine (`pricing.js`)](#44-multi-currency-pricing-engine-pricingjs)
5. [Interactive Experiences & Engine Implementations](#5-interactive-experiences--engine-implementations)
   - 5.1 [Dashboard Overview & Action Center (`Dashboard.jsx`)](#51-dashboard-overview--action-center-dashboardjsx)
   - 5.2 [Path Map: React Flow + Dagre Graph Engine (`PathMap.jsx` & `CertNode.jsx`)](#52-path-map-react-flow--dagre-graph-engine-pathmapjsx--certnodejsx)
   - 5.3 [Dual Path Map Views: Metro Graph vs Linear List View (`PathMapListView.jsx`)](#53-dual-path-map-views-metro-graph-vs-linear-list-view-pathmaplistviewjsx)
   - 5.4 [Career Path Builder & Sequential Learning Flow (`CareerPathBuilder.jsx`)](#54-career-path-builder--sequential-learning-flow-careerpathbuilderjsx)
   - 5.5 [Applied Skills Hub: Poster Board & Directory Grid (`AppliedSkills.jsx`)](#55-applied-skills-hub-poster-board--directory-grid-appliedskillsjsx)
   - 5.6 [Global Search, Hotkeys, Deep Linking & SEO Parity](#56-global-search-hotkeys-deep-linking--seo-parity)
6. [Developer Workflows, Quality Gates & Git Standards](#6-developer-workflows-quality-gates--git-standards)
   - 6.1 [Pre-Commit Quality Gate Sequence](#61-pre-commit-quality-gate-sequence)
   - 6.2 [Semantic Version Bumping Rules (`package.json`)](#62-semantic-version-bumping-rules-packagejson)
   - 6.3 [Conventional Commit Standards](#63-conventional-commit-standards)

---

## 1. Core Architecture, Technology Stack & Build Pipeline

### 1.1 Technology Ecosystem
- **Framework Core**: React 19 (`react 19.2+`, `react-dom 19.2+`) for concurrent UI rendering.
- **Client Routing**: React Router v7 (`react-router-dom 7.15+`).
- **Build Core**: Vite 8 (`vite 8.0+`) with `@vitejs/plugin-react 6.0+` for ESM development and Rollup production bundling.
- **UI Component System**: Microsoft Fluent UI v9 (`@fluentui/react-components 9.74+`) with `makeStyles()`, `tokens`, and `FluentProvider` aligned with `atozazure-portfolio-site`.
- **Styling Methodology**: Fluent UI v9 components with `makeStyles()` for UI controls, alongside Vanilla CSS with strict BEM naming (`.block__element--modifier`) for domain canvases. Strictly **no Tailwind CSS**.
- **Design Language**: Microsoft Fluent 2 Design System tokens, typography ramps, and dual light/dark themes.
- **Interactive Graph Engine**: React Flow v12 (`@xyflow/react 12.11+`) paired with Dagre (`dagre 0.8+`) layout computation.
- **Drag-and-Drop Reordering**: `@dnd-kit/core 6.3+`, `@dnd-kit/sortable 10.0+`, and `@dnd-kit/utilities 3.2+`.
- **Iconography System**: Abstraction layer via `@fluentui/react-icons 2.0+` and custom SVG product icons via `@iconify/react 6.0+`.

### 1.2 Domain Directory Map & Code Structure
The repository is strictly partitioned by functional domain under `src/`:
- `src/data/`: Static sources of truth (`certificationPaths.js`, `careerRoles.js`, `appliedSkills.js`).
- `src/components/`: Modular feature components organized by domain:
  - `Dashboard/`: Overview stats hero, Action Center queues, tracked learning grid, and exploration catalog (`Dashboard.jsx`, `Dashboard.css`).
  - `PathMap/`: Interactive React Flow canvas, Dagre layout engine, custom certification nodes, and linear list view (`PathMap.jsx`, `CertNode.jsx`, `PathMapListView.jsx`, `CertNode.css`, `PathMap.css`).
  - `CareerPathBuilder/`: Guided career role roadmaps, drag-and-drop custom playlist timeline, and aligned applied skills integration (`CareerPathBuilder.jsx`, `CareerPathCertCard.jsx`, `SortableCertItem.jsx`, `AlignedAppliedSkills.jsx`, `CareerPathBuilder.css`, `CareerPathCertCard.css`, `AlignedAppliedSkills.css`).
  - `CertDetail/`: Slide-over drawer and comprehensive certification details modal (`CertDetail.jsx`, `CertDetail.css`).
  - `AppliedSkills/`: Interactive poster board view, searchable lab directory grid, and detail drawer (`AppliedSkills.jsx`, `AppliedSkillCard.jsx`, `AppliedSkillDetail.jsx`, `AppliedSkills.css`).
  - `Layout/`: Top brand header, collapsible navigation sidebar, and theme switcher (`Header.jsx`, `Sidebar.jsx`, `ThemeToggle.jsx`, `Header.css`, `Sidebar.css`, `ThemeToggle.css`).
  - `common/`: Foundation components (`Badge.jsx`, `DataModal.jsx`, `IconMap.jsx`, `ProductIcons.jsx`, `ProgressRing.jsx`, `SearchBar.jsx`, `SEO.jsx`, `Toast.jsx`, `index.js`).
- `src/context/`: React Context providers (`ProgressContext.jsx`, `ThemeContext.jsx`, `CurrencyContext.jsx`, `ToastContext.jsx`).
- `src/hooks/`: State orchestration and persistence hooks (`useProgress.js`).
- `src/utils/`: Helpers, SVG badge resolvers, date formatters, and pricing engines (`helpers.js`, `pricing.js`).
- `src/assets/`: Static SVGs for Microsoft products, pillars, and badges (`assets/icons/`).

### 1.3 Vite ESM Bundler & Manual Chunking Strategy
To guarantee fast page loads and deterministic client-side caching, `vite.config.js` enforces Rollup chunk splitting across third-party dependencies:
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React Core runtime
          if (
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/') ||
            id.includes('/node_modules/react-router/') ||
            id.includes('/node_modules/react-router-dom/') ||
            id.includes('\\node_modules\\react\\') ||
            id.includes('\\node_modules\\react-dom\\') ||
            id.includes('\\node_modules\\react-router\\') ||
            id.includes('\\node_modules\\react-router-dom\\')
          ) {
            return 'vendor-core';
          }

          // React Flow and graph layout engine (used on /path/:pathId)
          if (id.includes('@xyflow') || id.includes('dagre')) {
            return 'vendor-flow';
          }

          // Drag and drop sorting kit (used on /career-paths)
          if (id.includes('@dnd-kit')) {
            return 'vendor-dnd';
          }

          // Fluent UI components
          if (id.includes('@fluentui/react-components') || id.includes('@griffel')) {
            return 'vendor-fluent';
          }

          // Fluent UI icons and product icons
          if (id.includes('@fluentui') || id.includes('@iconify')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
});
```

### 1.4 Single-Page Routing & Static Web App Config
Client-side HTML5 deep routing across all subpaths (`/path/:pathId`, `/career-paths`, `/applied-skills`) is governed by Azure Static Web Apps rewrite configuration in `staticwebapp.config.json`:
```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  },
  "trailingSlash": "never"
}
```

---

## 2. Fluent 2 Design System & Presentation Architecture

### 2.1 Component Styling Architecture (@fluentui/react-components & makeStyles)
- **Component UI Controls**: Use official Microsoft **`@fluentui/react-components`** (Fluent UI v9) with `makeStyles()`, `shorthands`, and `tokens` (matching the architecture of `atozazure-portfolio-site`).
- **NO Tailwind CSS**: Do not use Tailwind CSS or ad-hoc utility classes (`flex`, `bg-white`, `p-4`, etc.).
- **Foundation Components & Primitives**: UI surfaces, dialogs, inputs, buttons, badges, and modals (`CommandPalette`, `DataModal`, header search triggers, etc.) are built with `@fluentui/react-components` (`Dialog`, `DialogSurface`, `Input`, `Button`, `Badge`, `Text`).
- **Graph & Domain Canvas Hybrid**: Domain canvases (React Flow metro maps in `PathMap.jsx`, DnD timeline items in `CareerPathBuilder.jsx`) may utilize Vanilla CSS with BEM methodology alongside native Fluent 2 CSS custom properties (`var(--colorNeutralBackground1)`, `var(--shadow-28)`, etc.) defined in `src/index.css`.
- **NO Hardcoded Colors or Arbitrary Metrics**: Raw hex, rgb, or arbitrary pixel values in component styling are strictly forbidden. Always use Fluent UI tokens (`tokens.*`) in `makeStyles()` or CSS variables defined in `src/index.css`.
- **Token Precedence & Canonical Hierarchy**:
  - *Fluent UI v9 Tokens*: Official tokens (`tokens.colorNeutralBackground1`, `tokens.shadow28`, `tokens.borderRadiusLarge`, etc.) are the primary source of truth in React components.
  - *Canonical CSS Tokens*: The official Fluent 2 tokens (`--colorNeutralBackground1`, `--colorNeutralForeground1`, `--colorNeutralStroke1`, `--colorBrandBackground`, etc.) serve as the source of truth for global canvas styles.
- **Dynamic Theming Variables**: Dynamic CSS variables passed via inline styles are strictly restricted to path/role accent colors (e.g. `style={{ '--card-color': path.color, '--detail-color': path.color }}`). Never pass inline hex strings for opacity concatenation (e.g., avoid `${color}22`); use `color-mix(in srgb, var(--card-color) 12%, transparent)` or tokenized badge backgrounds.

### 2.2 Design Tokens & Dual Theme Symmetry
Every CSS variable in `src/index.css` must have symmetric, contrast-compliant definitions in `:root` (light) and `[data-theme="dark"]` (dark):
- **Surfaces**:
  - Canvas: `--colorNeutralBackground2` (`#fafafa` light / `#1f1f1f` dark) / alias `--bg-app`.
  - Primary Cards & Surfaces: `--colorNeutralBackground1` (`#ffffff` light / `#292929` dark) / alias `--bg-surface-1`, `--bg-card`.
  - Secondary/Sidebar Containers: `--colorNeutralBackground3` (`#f5f5f5` light / `#141414` dark) / alias `--bg-surface-2`.
  - Subtle/Tertiary Surfaces: `--colorNeutralBackground4` (`#f0f0f0` light / `#0a0a0a` dark), `--colorNeutralBackground5`.
  - Interactive States: `--colorNeutralBackground1Hover`, `--colorNeutralBackground1Pressed`, `--colorNeutralBackground1Selected`, `--colorSubtleBackgroundHover` (`rgba(0, 0, 0, 0.04)` light / `rgba(255, 255, 255, 0.06)` dark), `--colorSubtleBackgroundActive`, `--colorSubtleBackgroundPressed`.
  - Glass & Overlay: `--bg-glass` (`rgba(255, 255, 255, 0.78)` light / `rgba(31, 31, 31, 0.82)` dark), `--bg-overlay` (`rgba(0, 0, 0, 0.4)` light / `rgba(0, 0, 0, 0.6)` dark).
- **Typography & Foreground**:
  - Primary text: `--colorNeutralForeground1` (`#242424` light / `#ffffff` dark) / alias `--text-primary`.
  - Secondary text: `--colorNeutralForeground2` (`#424242` light / `#d6d6d6` dark) / alias `--text-secondary`.
  - Tertiary/Muted text: `--colorNeutralForeground3` (`#616161` light / `#adadad` dark) / alias `--text-tertiary`.
  - Subtle/Placeholder text: `--colorNeutralForeground4` (`#707070` light / `#8a8a8a` dark).
  - Disabled text: `--colorNeutralForegroundDisabled` (`#bdbdbd` light / `#5c5c5c` dark).
  - Inverted text: `--colorNeutralForegroundInverted` / alias `--text-inverse`.
- **Borders & Strokes**:
  - Strong border: `--colorNeutralStroke1` (`#d1d1d1` light / `#5c5c5c` dark) / alias `--border-strong`.
  - Default border: `--colorNeutralStroke2` (`#e0e0e0` light / `#404040` dark) / alias `--border-default`, `--border-color`.
  - Subtle border/divider: `--colorNeutralStroke3` (`#f0f0f0` light / `#333333` dark) / alias `--border-subtle`.
  - Accessible border (3:1 contrast for inputs & active boundaries): `--colorNeutralStrokeAccessible` (`#616161` light / `#adadad` dark).
  - Focus border: `--border-focus` (`#0f6cbd` light / `#479ef5` dark).
- **Brand Tokens**:
  - Brand fill: `--colorBrandBackground` (`#0f6cbd` light / `#479ef5` dark), hover `--colorBrandBackgroundHover`, pressed `--colorBrandBackgroundPressed`.
  - Tinted brand surface: `--colorBrandBackground2` (`#ebf3fc` light / `#082338` dark), hover `--colorBrandBackground2Hover`.
  - Brand text: `--colorBrandForeground1` (`#0f6cbd` light / `#479ef5` dark), secondary `--colorBrandForeground2`.
  - Brand stroke: `--colorBrandStroke1` (`#0f6cbd` light / `#479ef5` dark), `--colorBrandStroke2`.
- **Theme Accents & Glows**:
  - Track lines: `--line-<track>` (e.g. `--line-azure`, `--line-ai`, `--line-data`, `--line-security`, `--line-m365`, `--line-power`, `--line-dynamics`, `--line-devops`, `--line-github`, `--line-agentic`, `--line-retired`).
  - Track glows: `--glow-<track>` generated via `color-mix(in srgb, var(--line-<track>) 12-15%, transparent)`.
- **Elevation Scale & Component Mappings**:
  - `--shadow-2`: Resting cards, subtle controls, list view items.
  - `--shadow-4`: Hover cards, popovers, floating touch hints.
  - `--shadow-8`: Dropdown menus, autocomplete search flyouts, tooltips.
  - `--shadow-16`: Toasts, compact dialogs.
  - `--shadow-28`: Standard modals (e.g. `DataModal.jsx`).
  - `--shadow-64`: Heavy slide-over drawers (e.g. `CertDetail.jsx`, `AppliedSkillDetail.jsx`).
- **Standard Layout Metrics**: `--header-height: 48px`, `--sidebar-width: 280px`, `--sidebar-collapsed: 64px`, `--content-max-width: 1400px`.
- **Standard Z-Index Scale**: `--z-base: 0`, `--z-dropdown: 100`, `--z-sidebar: 200`, `--z-header: 300`, `--z-overlay: 400`, `--z-modal: 500` (modals & slide-over drawers), `--z-toast: 600`. Never use arbitrary values like `9999` or undeclared steps.

### 2.3 Typography Ramp, Shape System & Geometry Standards
- **Typography**:
  - Primary font family: `'Segoe UI Variable'`, `'Segoe UI'`, -apple-system, BlinkMacSystemFont, system-ui, sans-serif.
  - Monospace font family: `'Cascadia Code'`, `'Cascadia Mono'`, Consolas, monospace.
  - Font weights: `--fw-regular: 400`, `--fw-medium: 500`, `--fw-semibold: 600`, `--fw-bold: 700`.
  - Full Fluent 2 Typography Ramp:
    | Token | Rem | Px | Line Height | Typical Usage |
    |---|---|---|---|---|
    | `--fs-caption2` | `0.625rem` | 10px | 1.2 | Badges, small counters, timestamps, shortcut keys. |
    | `--fs-caption1` | `0.75rem` | 12px | 1.33 | Secondary card metadata, level tags, small buttons. |
    | `--fs-body1` | `0.875rem` | 14px | 1.5 | Standard body copy, inputs, table cells, drawer descriptions. |
    | `--fs-body2` | `1rem` | 16px | 1.5 | Prominent body text, card titles in compact lists. |
    | `--fs-subtitle2` | `1.125rem` | 18px | 1.4 | Section headers, card group headings, modal headers. |
    | `--fs-subtitle1` | `1.25rem` | 20px | 1.4 | Drawer main titles, panel section headings. |
    | `--fs-title3` | `1.5rem` | 24px | 1.3 | Page section titles, hero card headers. |
    | `--fs-title2` | `1.75rem` | 28px | 1.25 | Major dashboard headings. |
    | `--fs-title1` | `2rem` | 32px | 1.2 | Main route display titles. |
    | `--fs-hero` | `2.5rem` | 40px | 1.1 | Numeric hero statistics. |
    | `--fs-display` | `3rem` | 48px | 1.1 | Display branding. |
- **Spacing Scale (Fluent 2 Base-4)**:
  `--space-1` (4px), `--space-2` (8px), `--space-3` (12px), `--space-4` (16px), `--space-5` (20px), `--space-6` (24px), `--space-8` (32px), `--space-10` (40px), `--space-12` (48px), `--space-16` (64px).
- **Standard 3-Tier Element Control Heights**:
  - **Small (`24px`)**: Compact actions, badge buttons, inline table toggles (`padding: 0 var(--space-2)`, font `--fs-caption1`).
  - **Medium / Standard (`32px`)**: Default interactive height for buttons, search inputs, dropdowns, segmented toggle buttons (`padding: 0 var(--space-3)`, font `--fs-body1`).
  - **Large (`40px`)**: Prominent call-to-actions, hero buttons, drawer dismiss buttons (`padding: 0 var(--space-4)`, font `--fs-body2`).
- **Corner Radii Hierarchy & Shape System**:
  - `--radius-sm` (2px): Small nested badges, code chips, progress tick marks.
  - `--radius-md` (4px): Standard interactive controls (buttons, inputs, dropdowns, segmented items, focus rings).
  - `--radius-lg` (8px): Standard containers (certification cards, skill cards, toolbars, popovers).
  - `--radius-xl` (12px): Large dialogs and modals (`DataModal.jsx`).
  - `--radius-2xl` (16px): Extra-large hero panels.
  - `--radius-full` (9999px): Strictly reserved for circular status dots, numeric counter badges, avatar/icon circles, scrollbar thumbs, and progress bar tracks/fills.
- **Anti-Pill Rule for Structural & Segmented Controls**:
  - Segmented controls, filter tags, interactive buttons, and certification cards must use standard rounded corners (`--radius-md` or `--radius-lg`).
  - Never apply `--radius-full` to text buttons or rectangular cards to produce stadium/pill buttons. Pills are reserved strictly for progress tracks, circular status indicators, and numeric icon badges.

### 2.4 Badge System, Focus Tags & Card Placement Hierarchy
#### Supported Badge Variants (`src/components/common/Badge.jsx`):
| Variant | Color Token | Usage |
|---|---|---|
| `variant="default"` | `--badge-default-*` | Neutral secondary info, prerequisites, optional tags. |
| `variant="fundamentals"` | `--badge-fundamentals-*` | Fundamentals level credentials. |
| `variant="associate"` | `--badge-associate-*` | Associate level credentials. |
| `variant="expert"` | `--badge-expert-*` | Expert level credentials. |
| `variant="retiring"` | `--badge-retiring-*` | Retiring / Retired exam warnings. |
| `variant="completed"` | `--badge-completed-*` | Completed certs. |
| `variant="in-progress"` | `--badge-inprogress-*` | Currently studying certs. |
| `variant="new"` | `--badge-new-*` | Newly added certifications & skills. |
| `variant="updated"` | `--badge-updated-*` | Recently updated certifications. |
| `variant="beta"` | `--badge-beta-*` | Beta exams. |
| `variant="technical"` | `--badge-technical-*` | Applied Skills technical focus. |
| `variant="business"` | `--badge-business-*` | Applied Skills business focus. |

#### Card Placement Hierarchy:
1. **Certification Cards (`CertNode.jsx`, `PathMapListView.jsx`, `CareerPathCertCard.jsx`)**:
   - **Card Header**: Only place state-based informational badges (`Beta`, `Retiring`, `Retired`, `Optional`, `New`, `Updated`, `Coming soon`).
   - **Card Footer**: Only place structural badges (`Level` e.g. "Associate", and prerequisite requirements e.g. "Prereq: AZ-104", "1 of 3").
2. **Applied Skills Cards (`AppliedSkillCard.jsx`)**:
   - **Card Header**: State badge (`New`) and Focus badge (`Technical` or `Business`).
   - **Card Footer**: Level badge (`Beginner` or `Intermediate`) and Duration (`~2 hours`).
3. **Career Path Sequential Learning Cards**:
   - **Step 1 Header**: Preparatory lab indicator (`Step 1 • Hands-on Lab Preparation`).
   - **Step 2 Header**: Target certification indicator (`Step 2 • Target Certification Exam`).

### 2.5 Foundation Components & Fluent 2 UI Patterns
Shared components reside in `src/components/common/` with centralized barrel export in `index.js`:
- **Fluent 2 Button Appearances**:
  - *Primary Button*: Filled brand surface (`background: var(--colorBrandBackground)`, text `var(--colorBrandForegroundInverted)`, border `none`, hover `var(--colorBrandBackgroundHover)`).
  - *Secondary / Standard Button*: Neutral surface (`background: var(--colorNeutralBackground1)`, border `1px solid var(--colorNeutralStroke1)`, text `var(--colorNeutralForeground1)`, hover `var(--colorNeutralBackground1Hover)`).
  - *Subtle Button*: Transparent background, borderless, text `var(--colorNeutralForeground1)`; hover `background: var(--colorSubtleBackgroundHover)`.
  - *Outline Button*: Transparent background, border `1px solid var(--colorNeutralStroke1)`, text `var(--colorNeutralForeground1)`.
  - *Icon-only Button*: Square bounding box (`24x24px`, `32x32px`, or `40x40px`), centered icon, `border-radius: var(--radius-md)`.
- **Form Controls & SearchBar (`SearchBar.jsx`)**:
  - Input field: Standard height `32px`, `background: var(--colorNeutralBackground1)`, border `1px solid var(--colorNeutralStroke1)`, `border-radius: var(--radius-md)`, font `--fs-body1`.
  - Focus state: `outline: 2px solid var(--border-focus); outline-offset: 0;`.
  - Placeholder: `color: var(--colorNeutralForeground4)`.
  - Keyboard shortcut chip: Monospace, `font-size: var(--fs-caption2)`, `background: var(--colorNeutralBackground3)`, border `1px solid var(--colorNeutralStroke2)`, `border-radius: var(--radius-sm)`.
- **Segmented Controls & View Switchers (`PathMapListView.jsx`, `AppliedSkills.jsx`)**:
  - Track container: `background: var(--colorNeutralBackground2)`, border `1px solid var(--colorNeutralStroke2)`, `border-radius: var(--radius-md)`, padding `2px` or `4px`.
  - Segments: Height `26px` or `32px`, `border-radius: var(--radius-sm)`, text `--colorNeutralForeground2`. Active segment receives `background: var(--colorNeutralBackground1)`, `color: var(--colorNeutralForeground1)`, and `box-shadow: var(--shadow-2)`.
- **Slide-Over Drawers (`CertDetail.jsx`, `AppliedSkillDetail.jsx`)**:
  - Fixed right slide-over panel: Desktop width `480px` (`max-width: 100vw`), mobile width `100vw`.
  - Scrim backdrop: `background: var(--bg-overlay)`, `backdrop-filter: blur(4px)`.
  - Elevation: `box-shadow: var(--shadow-64)`.
  - Header: Padding `var(--space-6)`, top accent color strip (4px), title `--fs-subtitle1`, close button `32px` or `40px` Subtle button in top-right corner.
  - Body: Padding `var(--space-6)`, scrollable (`overflow-y: auto`, `-webkit-overflow-scrolling: touch`).
- **Modal Dialogs (`DataModal.jsx`)**: Max width `520px`, centered flex overlay, `border-radius: var(--radius-xl)`, `box-shadow: var(--shadow-28)`.
- **Progress Ring (`ProgressRing.jsx`)**: Custom SVG circular progress indicator with customizable `percent`, `size`, `strokeWidth`, `color`, and `showPercent`.
- **SEO Sync (`SEO.jsx`)**: Dynamically synchronizes document `<title>`, description, canonical links, Open Graph tags, Twitter cards, and JSON-LD schema (`#route-structured-data`). **Every primary route must include `<SEO />`**.
- **Theme Toggle (`ThemeToggle.jsx`)**: Accessible 3-way theme toggle (`light`, `dark`, `system`) synchronizing with `data-theme` attribute on `<html>`, system color scheme media queries, and storage key `ms-cert-tracker-theme`.
- **Global Toast (`Toast.jsx` & `ToastContext.jsx`)**: Global toast notification system (`success`, `error`, `info`, `warning`) with elevation `--shadow-16`, interactive action buttons, and automatic dismissal.

### 2.6 Iconography System: IconMap vs ProductIcons
- **Central Icon Abstraction (`IconMap.jsx`)**: Do not import `@fluentui/react-icons` directly into feature components. Import the `...Regular` variant into `IconMap.jsx`, wrap with `withSize(...)`, and export as a named key.
- **Product Icons (`ProductIcons.jsx`)**: Full-color product/service SVGs (Azure, Copilot, GitHub, Power Platform, Fabric, Dynamics) are maintained in `ProductIcons.jsx`. Their container background must be set to `transparent`. Always provide fallback to `IconMap.Award` if an icon fails to load.

### 2.7 Micro-interactions, Motion, Focus & Accessibility
- **Differentiated Push Micro-Animations**:
  - *Buttons & Compact Interactive Controls*: Active micro-animation: `:active { transform: scale(0.96); }`.
  - *Large Cards & Containers (e.g. Cert Cards, Path Cards)*: Active micro-animation: `:active { transform: scale(0.99); }` or border-color highlight (avoid heavy 4% scale jumps on 400px containers).
- **Fluent Motion Tokens & Transitions**:
  - Durations: `--duration-ultra-fast` (50ms), `--duration-faster` (100ms), `--duration-fast` (150ms), `--duration-normal` (200ms), `--duration-gentle` (250ms), `--duration-slow` (300ms), `--duration-slower` (400ms).
  - Curves:
    - Entrances / Drawers: `--curve-decelerate` (`cubic-bezier(0, 0, 0, 1)`).
    - Exits: `--curve-accelerate` (`cubic-bezier(1, 0, 1, 1)`).
    - State Transitions / Hover: `--curve-easy-ease` (`cubic-bezier(0.33, 0, 0.67, 1)`).
- **Accessibility & Focus Indicators (Fluent 2 Focus Pattern)**:
  - Strict `:focus-visible` rule:
    ```css
    :focus-visible {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
      border-radius: var(--radius-md);
    }
    ```
  - Keyboard navigation only: Mouse pointer interactions must never produce focus outlines (`:focus:not(:focus-visible)`).
  - High Contrast & Accessible Strokes: Form input borders and active interactive boundaries must use `--colorNeutralStrokeAccessible` (3:1 contrast against surface).
- **Reduced Motion Support**:
  - All transitions, transforms, and animations must be disabled when the user prefers reduced motion:
    ```css
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
        transform: none !important;
      }
    }
    ```
- **Modal & Drawer Accessibility**: All modals/drawers (`DataModal.jsx`, `CertDetail.jsx`, `AppliedSkillDetail.jsx`) must support `Escape` key dismissal, backdrop click dismissal, and background scroll locking (`document.body.style.overflow = 'hidden'`).
- **Toast Notifications**: Always invoke `addToast(message, type)` when users perform actions (exporting/importing data, resetting progress, toggling tracks, cycling status, copying links). Ensure toasts carry `role="alert"` or `aria-live="polite"`.

---

## 3. Domain Data Models & Credential Lifecycle Governance

### 3.1 Pillars Enum (`PILLARS`) & Active Track Catalog (11 Tracks)
All certification paths and applied skills belong to one of four core pillars defined in `src/data/certificationPaths.js`:
```javascript
export const PILLARS = {
  CLOUD_AI: 'Cloud & AI Platforms',
  BIZ_SOLUTIONS: 'AI Business Solutions',
  SECURITY: 'Security',
  RETIRED: 'Retired & Archived',
};
```

The catalog manages **11 distinct technology tracks** across the 4 pillars:
| Track ID | Track Name | Short Name | Code | Pillar | Color Variable | Glow Variable |
|---|---|---|---|---|---|---|
| `azure-infrastructure` | Azure Apps & Infrastructure | Azure Infrastructure | `AZ` | `PILLARS.CLOUD_AI` | `var(--line-azure)` | `var(--glow-azure)` |
| `ai-machine-learning` | Artificial Intelligence | Azure AI | `AI` | `PILLARS.CLOUD_AI` | `var(--line-ai)` | `var(--glow-ai)` |
| `data-engineering` | Data Platform | Data & Analytics | `DP` | `PILLARS.CLOUD_AI` | `var(--line-data)` | `var(--glow-data)` |
| `security` | Security, Compliance, and Identity | Security & Identity | `SC` | `PILLARS.SECURITY` | `var(--line-security)` | `var(--glow-security)` |
| `microsoft-365` | Modern Workplace | Microsoft 365 | `MS` | `PILLARS.BIZ_SOLUTIONS` | `var(--line-m365)` | `var(--glow-m365)` |
| `power-platform` | Business Applications | Power Platform | `PL` | `PILLARS.BIZ_SOLUTIONS` | `var(--line-power)` | `var(--glow-power)` |
| `agentic-ai` | AI Business Solutions | Agentic AI | `AB` | `PILLARS.BIZ_SOLUTIONS` | `var(--line-agentic)` | `var(--glow-agentic)` |
| `dynamics-365` | Microsoft Dynamics 365 | Dynamics 365 | `MB` | `PILLARS.BIZ_SOLUTIONS` | `var(--line-dynamics)` | `var(--glow-dynamics)` |
| `azure-devops` | Azure DevOps | DevOps | `AZ` | `PILLARS.CLOUD_AI` | `var(--line-devops)` | `var(--glow-devops)` |
| `github` | GitHub | GitHub | `GH` | `PILLARS.CLOUD_AI` | `var(--line-github)` | `var(--glow-github)` |
| `retired-exams` | Retired Certifications | Archived Exams | `ARCHIVE` | `PILLARS.RETIRED` | `var(--line-retired)` | `var(--glow-retired)` |

### 3.2 Track & Branch Object Schemas
Each track object in `src/data/certificationPaths.js` adheres to this schema:
| Field | Type | Description |
|---|---|---|
| `id` | `string` (kebab-case) | Unique track identifier (e.g. `'azure-infrastructure'`, `'retired-exams'`). |
| `name` | `string` | Full path track title. |
| `shortName` | `string` | Compact title used in navigation cards, sidebar links, and badges. |
| `code` | `string` | Uppercase prefix code (e.g. `'AZ'`, `'SC'`, `'AI'`, `'ARCHIVE'`). |
| `pillar` | `PILLARS.*` | Pillar category mapping. |
| `color` | `string` | CSS variable for path line (e.g. `'var(--line-azure)'`). |
| `glowColor` | `string` | CSS variable for path glow highlight. |
| `cssVar` | `string` | Raw CSS variable name without `var()` (e.g. `'--line-azure'`). |
| `icon` | `string` | Key mapped in `src/components/common/IconMap.jsx`. |
| `description` | `string` | Concise overview of the track scope. |
| `branches` | `Array<Branch>` | Branch definitions: `[{ id: 'admin', name: 'Admin', description: '...' }]`. |
| `certifications`| `Array<Cert>` | Array of certification objects belonging to this path track. |

### 3.3 Certification Credential Schema & Prerequisites Engine
#### Levels (`CERT_LEVELS`):
```javascript
export const CERT_LEVELS = {
  FUNDAMENTALS: 'Fundamentals',
  ASSOCIATE: 'Associate',
  EXPERT: 'Expert',
  SPECIALTY: 'Specialty',
};
```

#### Statuses (`CERT_STATUS`):
```javascript
export const CERT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  NEEDS_RENEWAL: 'needs_renewal',
};
```

#### Certification Object Schema:
- **Mandatory Fields**:
  - `id`: Lowercase kebab-case string matching the exam ID (e.g. `'az-104'`, `'ai-102'`).
  - `examCode`: Uppercase official exam code string (e.g. `'AZ-104'`, `'AI-102'`).
  - `name`: Full certification credential title (e.g. `'Azure Administrator Associate'`).
  - `level`: One of `CERT_LEVELS` (`'Fundamentals'`, `'Associate'`, `'Expert'`, `'Specialty'`).
  - `description`: Comprehensive summary of the certification scope and target persona.
  - `prerequisites`: Evaluation requirements:
    - **Single/All Required**: Array of cert IDs e.g. `['az-104']` (all must be completed).
    - **Choice Groups ("1 of N")**: Nested arrays e.g. `[['az-104', 'az-204']]` or `[['sc-200', 'sc-300', 'sc-500']]` (satisfying any one unlocks the prerequisite).
    - **None**: Empty array `[]`.
  - `learnUrl`: Verified, active Microsoft Learn exam page URL.
  - `retirementDate`: `'YYYY-MM-DD'` string if announced, otherwise `null`.
  - `skillsMeasured`: Array of strings detailing objective domains and percentage weightings.
- **Optional Fields**:
  - `recommendedPrereqs`: Array of cert IDs (e.g. `['az-900']`) recommended for foundational learning but not strictly required.
  - `branch`: Lowercase string matching one of the parent path's `branches[].id` values.
  - `isBeta`: `true` or `'Beta from <Month> <Year>'` (e.g. `'Beta from July 2026'`).
  - `isNew`: `true` (renders `<Badge variant="new">New</Badge>`). Governed by Rule of Recency.
  - `isUpdated`: `true` (renders `<Badge variant="updated">Updated</Badge>`). Governed by Rule of Recency.
  - `isComingSoon`: `true` (renders `<Badge variant="default">Coming soon</Badge>`).
  - `isIndependent`: `true` (marks standalone, disconnected, or retired certs in layout engines).
  - `isShared`: `true` (set when a certification is shared across multiple tracks, e.g. `az-900` in `azure-devops`).
  - `sharedWith`: Track ID of the primary owning path (e.g. `'azure-infrastructure'`).
- **Runtime Computed Properties**:
  - `role`: Primary matched role title string.
  - `roles`: Array of matched role titles.
  - `roleData`: Array of matched role objects from `careerRoles.js` (with title, color, and icon).

> [!IMPORTANT]
> **No Hardcoded Roles on Certs**: Do **NOT** hardcode `role`, `roles`, or `roleData` on certification objects in `certificationPaths.js`. These are computed dynamically at runtime on module initialization by matching against `src/data/careerRoles.js`.

### 3.4 Applied Skills Credential Schema & Zero-Retired Governance
Applied skills represent scenario-based, interactive lab assessments.

#### Enums:
```javascript
export const APPLIED_SKILL_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
};

export const APPLIED_SKILL_FOCUS = {
  TECHNICAL: 'Technical',
  BUSINESS: 'Business',
};

export const APPLIED_SKILL_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};
```

#### Applied Skill Object Schema:
| Field | Type | Description |
|---|---|---|
| `id` | `string` (kebab-case) | Unique slug identifier (e.g. `'accelerate-app-development-by-using-github-copilot'`). |
| `uid` | `string` | Unique namespace ID prefixed with `applied-skill.` (e.g. `'applied-skill.accelerate-app-development-by-using-github-copilot'`). |
| `title` | `string` | Official credential title as listed on Microsoft Learn. |
| `pillar` | `PILLARS.*` | Pillar category mapping (`CLOUD_AI`, `BIZ_SOLUTIONS`, `SECURITY`). |
| `level` | `APPLIED_SKILL_LEVELS.*` | Difficulty tier (`'Beginner'`, `'Intermediate'`). |
| `focus` | `APPLIED_SKILL_FOCUS.*` | Focus area (`'Technical'`, `'Business'`). |
| `isNew` | `boolean` | `true` renders `<Badge variant="new">New</Badge>`. Governed by Rule of Recency. |
| `duration` | `string` | Estimated completion time (e.g. `'~2 hours'`). |
| `cost` | `string` | Cost indicator (e.g. `'Free'`). |
| `learnUrl` | `string` | Verified, active Microsoft Learn assessment lab page URL. |
| `summary` | `string` | Comprehensive summary of the lab assessment scenario and target persona. |
| `roles` | `Array<string>` | Target job roles (e.g. `['developer', 'ai-engineer']`). |
| `products` | `Array<string>` | Associated Microsoft product slugs (e.g. `['github', 'vs-code']`). |
| `subjects` | `Array<string>` | Subject domain tags (e.g. `['artificial-intelligence', 'app-development']`). |
| `relatedCerts` | `Array<string>` | Exam IDs reinforced by this lab (e.g. `['ai-102', 'ai-500']`). Must reference active exam IDs. |

#### Zero-Retired Policy:
Because Microsoft Applied Skills interactive assessment labs become completely unavailable once retired:
- **Zero Retired Skills**: Retired Applied Skills must **never** be added to `src/data/appliedSkills.js`.
- **Immediate Pruning**: When an Applied Skill is announced as retired or decommissioned on Microsoft Learn, it must be **immediately removed and pruned** from `src/data/appliedSkills.js`. They are never archived under `PILLARS.RETIRED`.

### 3.5 Career Roles Schema (`src/data/careerRoles.js`)
Each role profile defines a career pathway:
- `id`: Lowercase kebab-case string (e.g. `'ai-engineer'`, `'solutions-architect'`).
- `title`: Display name of the career role.
- `description`: Role responsibilities summary.
- `icon`: Key mapped in `IconMap.jsx`.
- `color`: CSS variable for role theme accent.
- `certs`: Array of valid certification IDs mapped to this career role.

> [!WARNING]
> **Cross-Reference Integrity**: Whenever a certification ID is added, renamed, or retired in `certificationPaths.js`, you **must** audit `src/data/careerRoles.js` to ensure the `certs: [...]` arrays contain no dangling or broken IDs.

### 3.6 Central Data Helper APIs
Always leverage existing central helper functions:
- **`src/data/certificationPaths.js`**:
  - `getCertById(id)`: Returns `{ cert, path }` or `null`.
  - `getAllCertifications()`: Returns flattened array of all certifications with path metadata (`pathId`, `pathName`, `pathColor`).
  - `getPathById(pathId)`: Returns the track object or `undefined`.
  - `getCertificationsRequiring(certId)`: Returns array of certifications listing `certId` as a prerequisite.
  - `doesCertExpire(level)`: Returns boolean indicating if the level requires annual renewal (`Associate`, `Expert`, `Specialty`).
- **`src/data/appliedSkills.js`**:
  - `getAllAppliedSkills()`: Returns all active Applied Skills credentials (35 active credentials).
  - `getAppliedSkillById(id)`: Returns the Applied Skill object or `null`.
  - `getAppliedSkillsByPillar(pillar)`: Returns Applied Skills filtered by pillar.
  - `getAppliedSkillsForCert(certId)`: Returns all Applied Skills that reinforce a specific certification ID.
- **`src/utils/helpers.js`**:
  - `isRetiring(cert)`: Returns `true` if `retirementDate` is in the future.
  - `isRetired(cert)`: Returns `true` if `retirementDate` is in the past.
  - `formatDate(dateStr)`: Localized human-readable date formatter (e.g. `'January 1, 2025'`).
  - `getBadgeUrl(level, certId)`: Resolves official Microsoft Learn SVG credential badge (including overrides for `ab-700`, `ab-701`, `ab-730`, `ab-731`).
  - `getAppliedSkillBadgeUrl()`: Returns official Applied Skills badge SVG URL.

### 3.7 Primary Sources of Truth & Lifecycle State Machine
Official Sources of Truth:
1. **Microsoft Tech Community Skills Hub**:
   **https://techcommunity.microsoft.com/category/skills-hub/blog/skills-hub-blog**
2. **Official Credential Retirement Registry**:
   **https://learn.microsoft.com/en-us/credentials/support/credential-retirement**
3. **Microsoft Learn Live Examination & Assessment Directory**:
   **https://learn.microsoft.com/en-us/credentials/**

```mermaid
graph TD
  ComingSoon["Coming Soon (isComingSoon: true)"] -->|"Registration Opens"| Beta["Beta (isBeta: true)"]
  Beta -->|"GA Launch"| NewCert["Active GA (isNew: true)"]
  NewCert -->|"Subsequent Updates"| UpdatedCert["Active GA (isUpdated: true)"]
  ActiveGA["Active GA"] -->|"Retirement Announced"| Retiring["Retiring (retirementDate: YYYY-MM-DD)"]
  Retiring -->|"Retirement Date Reached"| Retired["Retired (Moved to PILLARS.RETIRED under 'retired-exams')"]
  Retired -->|"> 12 Months Retired"| Pruned["Permanently Removed / Pruned"]
```

1. **Coming Soon**: Announced credentials prior to registration or beta availability carry `isComingSoon: true`.
2. **Transition to Beta**: When registration opens, remove `isComingSoon` and set `isBeta: true` or `isBeta: 'Beta from Month YYYY'`.
3. **Transition from Beta to GA**: When the exam reaches General Availability, remove `isBeta` and add `isNew: true`.
4. **Retiring State**: When retirement is announced, set `retirementDate: 'YYYY-MM-DD'` and display the `"Retiring"` badge while keeping the credential in its active path.

### 3.8 Rule of Recency, Renewal & 12-Month Pruning Standards
- **Rule of Recency (New & Updated Credentials)**:
  - Newly added exams receive `isNew: true`.
  - Modified exams receive `isUpdated: true`.
  - Whenever additions or updates are made, actively scan `src/data/certificationPaths.js` and `src/data/appliedSkills.js` to remove stale `isNew: true` and `isUpdated: true` flags from older entries. Only the most recent cohort of updates should carry badges.
- **1-Year Expiration & Renewal Lifecycle**:
  - Exams at `Associate`, `Expert`, and `Specialty` levels require annual renewal (`doesCertExpire(level) === true`). `Fundamentals` exams do not expire.
  - If a completed certification's completion timestamp recorded in `completionDates[certId]` is older than 365 days, `getStatus(certId)` automatically returns `CERT_STATUS.NEEDS_RENEWAL`.
  - Completing or renewing a certification resets the status to `CERT_STATUS.COMPLETED` and updates the completion timestamp in `completionDates`.
- **Retirement Succession & 12-Month Automated Pruning**:
  - When an exam passes its retirement date, move it to `PILLARS.RETIRED` under track `id: 'retired-exams'`. Set `branch: 'retired'` and `isIndependent: true`.
  - Audit all active exams that listed the retired exam as a prerequisite and update them to point to the official successor credential (e.g. updating `dp-203` to `dp-700`).
  - When a certification has been retired for **more than 12 months** (i.e. `retirementDate` is more than 1 year in the past), permanently delete the certification entry from `src/data/certificationPaths.js` and clean up any residual references in `src/data/careerRoles.js`.

### 3.9 Verification Quality Gates (URLs & Badges)
- **Link Verification**: Every Microsoft Learn link must resolve to an active, HTTP 200 page without 404s or retirement notices.
- **Badge URL Resolution**:
  - `getBadgeUrl(level, certId)` maps credentials to official SVGs.
  - Special badge filenames (e.g. `ab-730`, `ab-731`, `ab-700`, `ab-701`) must have explicit mappings.
  - Applied Skills resolve via `getAppliedSkillBadgeUrl()`.
  - Always use `loading="lazy"` on badge `<img>` elements with fallback to `IconMap.Award`.

---

## 4. State Management, Persistence & Multi-Currency Engine

### 4.1 LocalStorage Inventory & Key Registry (9 Keys)
State is persisted to `localStorage` with safe `try/catch` fallbacks across `useProgress.js`, `ThemeContext.jsx`, and `CurrencyContext.jsx`:
1. `ms-cert-tracker-progress`: Object mapping `{ [certId]: CERT_STATUS }`.
2. `ms-cert-tracker-tracked-paths`: Array of active path IDs. (Migrates automatically from legacy `ms-cert-tracker-ignored`).
3. `ms-cert-tracker-tracked-certs`: Array of active cert IDs.
4. `ms-cert-tracker-dismissed-certs`: Array of dismissed cert IDs.
5. `ms-cert-tracker-dates`: Object mapping `{ [certId]: ISOString }` completion timestamps.
6. `ms-cert-tracker-custom-playlist`: Array of ordered cert IDs representing the custom career timeline.
7. `ms-cert-tracker-applied-skills`: Object mapping `{ [skillId]: APPLIED_SKILL_STATUS }`.
8. `ms-cert-tracker-theme`: Selected theme preference (`'light'`, `'dark'`, `'system'`).
9. `atozazure_currency`: Selected currency code (`'GBP'`, `'USD'`, `'EUR'`).

### 4.2 Backup, Restore & Reset Parity (JSON Schema)
Any new persistent property added to state **must** be wired into:
1. `exportProgressJSON()` — included in the backup JSON schema:
   ```json
   {
     "app": "ms-skills-navigator",
     "version": "1.11.0",
     "exportedAt": "ISOString",
     "progress": {},
     "trackedPaths": [],
     "trackedCerts": [],
     "dismissedCerts": [],
     "completionDates": {},
     "customPlaylist": [],
     "appliedSkills": {}
   }
   ```
2. `importProgressJSON()` — validated, safely parsed, and merged.
3. `resetAll()` — completely cleared from state and `localStorage`.

### 4.3 Auto-Tracking & Prerequisite Unlock Celebrations
- **Auto-Tracking**: Marking a certification as `in_progress` or `completed` automatically appends its ID to `trackedCerts`.
- **Prerequisite Unlock Celebrations**: Marking an exam as `COMPLETED` evaluates `getCertificationsRequiring(cert.id)`. If dependent certifications are unstarted, a celebration toast triggers with an interactive action button to mark the unlocked credential as `in_progress`.

### 4.4 Multi-Currency Pricing Engine (`pricing.js`)
- Supported currencies: `GBP` (£, default), `USD` ($), `EUR` (€).
- Pricing Tiers:
  - `Fundamentals`: £69 / $99 / €99.
  - `Associate` / `Expert` / `Specialty`: £132 / $165 / €165.
- Helper functions: `getCostsForLevel(level)`, `getExamCost(level, currency)` for calculations and `getFormattedExamCost(level, currency)` (e.g. `"£132"`) for UI presentation. Never hardcode currency symbols.

---

## 5. Interactive Experiences & Engine Implementations

### 5.1 Dashboard Overview & Action Center (`Dashboard.jsx`)
- **Hero Overview Panel**: Global stats (Completed, In Progress, Needs Renewal, Applied Skills count, Total Paths) with SVG Progress Ring.
- **Action Center**: Focused queues for In Progress exams and certs requiring annual renewal.
- **Tracked Learning vs Explore Catalog**: Separate panels for tracked paths, individually tracked certifications from untracked paths, and catalog exploration for untracked paths.

### 5.2 Path Map: React Flow + Dagre Graph Engine (`PathMap.jsx` & `CertNode.jsx`)
- **Standard Active Tracks (Dagre Engine)**:
  - Coordinates generated via Dagre (`rankdir: 'TB'`, `nodesep: 40`, `ranksep: 80`).
  - Edges rendered as `smoothstep` paths between connected stations.
  - Target handle on Top and Source handle on Bottom with `opacity: 0`.
- **Retired Certifications Track (`retired-exams`)**:
  - Because retired exams are independent with no sequential graph hierarchy, the path utilizes a **3-column responsive grid layout** (`cols: 3`, `colWidth: 440`, `rowHeight: 270`) without dependency edges.
- **Node Dimensions & Caching**:
  - Node dimensions are fixed at `400px` width x `230px` height. Custom nodes (`CertNode.jsx`) must fit within these dimensions without overflow or clipping.
  - Layout positions and edges are cached per path in `layoutPositionsCache = new Map()` to eliminate redundant Dagre re-computations.
  - Viewport preservation: Uses the `lastFittedPath` pattern to prevent unwanted canvas re-centering when updating node statuses within the active path.

### 5.3 Dual Path Map Views: Metro Graph vs Linear List View (`PathMapListView.jsx`)
- **Metro Graph View (`PathMapFlow`)**: Visual interactive canvas for exploring prerequisites and certification branch hierarchies.
- **List View (`PathMapListView`)**: Linear, accessible directory view grouped into:
  1. *Foundational Credentials* (trunk fundamentals).
  2. *Pathway Branches* (grouped by defined branches).
  3. *Advanced Credentials* (trunk associate/expert/specialty).
- Features inline status selectors (`Not Started`, `In Progress`, `Passed`) and filter segmented controls for branch and status.

### 5.4 Career Path Builder & Sequential Learning Flow (`CareerPathBuilder.jsx`)
- **Interactive Role Pathways**: Guided career roadmaps aligned with official Microsoft job roles, featuring dual progress metrics (Certifications passed and Aligned Applied Skills earned) in the role pathway overview banner.
- **Sequential Learning Flow (Step 1 Prep Labs $\rightarrow$ Step 2 Target Exam)**:
  - Inside `CareerPathCertCard.jsx`, milestone stages with aligned Applied Skills present a clear sequential learning journey:
    1. **Step 1 • Hands-on Lab Preparation**: Practical scenario-based lab credentials positioned first to build practical skills before taking the exam.
    2. **Directional Flow Connector**: Visual directional connector (`↓ Hands-on prep leads to target certification`) linking Step 1 into Step 2.
    3. **Step 2 • Target Certification Exam**: Proctored certification exam capstone containing exam badge, title, code, level, prerequisites, Learn link, Add to Custom, and Passed status toggle.
  - Certifications without aligned skills cleanly omit Step 1 and render the standalone exam card directly.
- **Aligned Applied Skills Component (`AlignedAppliedSkills.jsx`)**:
  - Queries `getAppliedSkillsForCert(cert.id)` to display hands-on scenario labs validating that specific exam.
  - Interactive 3-state progress control (`Not Started`, `In Progress`, `Earned`) directly updating `appliedSkillsProgress` with real-time progress bar and milestone toasts (`🎉 All N Applied Skills for EXAM earned!`).
  - Quick actions to launch sandbox labs on Microsoft Learn or open the full scenario modal drawer (`AppliedSkillDetail.jsx`).
- **Custom Career Playlist (`SortableCertItem.jsx`)**:
  - Drag-and-drop reordering utilizing `@dnd-kit/core` and `@dnd-kit/sortable` with `verticalListSortingStrategy`.
  - Binds both `PointerSensor` (with `activationConstraint: { distance: 8 }` to prevent dragging on click) and `KeyboardSensor` (`sortableKeyboardCoordinates`).
  - Custom timeline cards also position aligned Applied Skills as preparatory milestones before the exam description.
- **Timeline Export & Dynamic SEO**:
  - Supports Markdown timeline export (`custom-career.md` with `# My Custom Career`).
  - Dynamically updates `<SEO />` title and description based on the active role selection.

### 5.5 Applied Skills Hub: Poster Board & Directory Grid (`AppliedSkills.jsx`)
- **Poster Board View**: 3-column layout matching Microsoft's official Applied Skills poster (`Cloud & AI Platforms`, `AI Business Solutions`, `Security`).
- **Directory Grid View**: Searchable catalog with multi-facet filtering (Pillar, Level, Focus, Progress Status, and Search query).
- **Detail Drawer (`AppliedSkillDetail.jsx`)**: Accessible slide-over drawer with scenario summary, related role-based exams (with deep links to `/path/:pathId?cert=:certId`), status switcher, and direct Microsoft Learn assessment lab launcher.

### 5.6 Global Search, Hotkeys, Deep Linking & SEO Parity
- **Global Hotkeys**:
  - `Ctrl+K` / `Cmd+K`: Focus search bar.
  - `Ctrl+B` / `Cmd+B`: Toggle sidebar navigation.
- **Deep Linking Query Params**: `?cert=<certId>` on `/path/:pathId` and `?role=<roleId>` on `/career-paths`.
- **Keyboard Shortcut Guard**: Always check `if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName) || e.target.isContentEditable) return;` before processing single-key shortcuts.
- **In `CertDetail`**:
  - `Escape`: Close drawer/modal.
  - `S`: Cycle status (`not_started` $\rightarrow$ `in_progress` $\rightarrow$ `completed`).
  - `E`: Toggle tracking / exclusion.
  - `Enter`: Open Microsoft Learn link.
- **Routes**:
  - `/`: Dashboard (`Dashboard.jsx`)
  - `/career-paths`: Career Path Builder (`CareerPathBuilder.jsx`)
  - `/path/:pathId`: Interactive Path Map (`PathMap.jsx`)
  - `/applied-skills`: Applied Skills Hub (`AppliedSkills.jsx`)
  - `*`: Redirect to `/`
- **Code Splitting**: Lazy-loaded routes must render Fluent shimmer loading skeletons (`.loading-skeleton`).
- **SEO Parity**: All 4 primary routes must invoke `<SEO title="..." description="..." canonical="..." />` to keep head metadata synchronized.

---

## 6. Developer Workflows, Quality Gates & Git Standards

Whenever you are asked to commit and synchronize changes, you **must** follow this strict quality gate sequence:

```mermaid
graph LR
  A["1. Code & Data Changes"] --> B["2. Version Bump (package.json)"]
  B --> C["3. npm run lint"]
  C --> D["4. npm run build"]
  D --> E["5. git add & git commit"]
  E --> F["6. git push / sync"]
```

### 6.1 Pre-Commit Quality Gate Sequence
1. **Apply & Verify Changes**: Ensure all data schemas, component logic, styles, and unit features are complete and error-free.
2. **Version Bump**: Increment `package.json` according to semantic impact.
3. **Lint**: Run `npm run lint` and resolve any ESLint errors or warnings.
4. **Build**: Run `npm run build` to verify Vite compiles and bundles with zero errors.
5. **Stage & Commit**: Write commits adhering to Conventional Commits.
6. **Push / Sync**: Synchronize commits to remote repository.

### 6.2 Semantic Version Bumping Rules (`package.json`)
Increment the version in `package.json` according to semantic change impact:
- **Patch** (e.g. `1.13.10` $\rightarrow$ `1.13.11`): Bug fixes, minor tweaks, routine data/lifecycle updates, exam retirement dates, metadata additions.
- **Minor** (e.g. `1.13.0` $\rightarrow$ `1.14.0`): Substantial UI additions, builder features, new tracks, export tools, currency additions.
- **Major** (e.g. `1.0.0` $\rightarrow$ `2.0.0`): Architectural overhauls or major breaking changes.

> [!NOTE]
> **Documentation Exception**: Do **not** bump `package.json` if only updating non-application documentation files (e.g. `README.md`, `.agents/AGENTS.md`).

### 6.3 Conventional Commit Standards
Write clear, descriptive commit messages following the Conventional Commits specification:
- `feat: add custom playlist export`
- `fix: correct prerequisite id in az-305`
- `data: update dp-700 retirement date and remove retired applied skills`
- `style: refine badge variant colors in dark mode`
- `docs: reorganize AGENTS.md guidelines and document architectural standards`
- `chore: bump version to 1.13.11`