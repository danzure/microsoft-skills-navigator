# atozazure | Skills Navigator

**Microsoft Skills Navigator** is an interactive web platform designed to help cloud professionals, developers, and IT architects navigate, plan, and master Microsoft certifications and role-based skilling pathways. Featuring an interactive metro-style line map, a drag-and-drop career timeline builder, 1-year renewal lifecycle tracking, and multi-currency exam fee estimation, it serves as an all-in-one companion for your Microsoft learning journey.

## ✨ Key Capabilities

- **Interactive Metro-Map Visualisation** — Explore all Microsoft credentials rendered as interconnected subway lines with stations, branch transfers, prerequisite junctions, and exam levels.
- **Role-Based Career Path Builder** — Discover curated pathways for official Microsoft roles (Cloud Architect, AI Engineer, Security Admin, DevOps Engineer) or assemble your own custom drag-and-drop learning playlist.
- **Lifecycle & Renewal Tracking** — Monitor study status (*Not Started*, *In Progress*, *Completed*) alongside annual expiration countdowns for Associate, Expert, and Specialty credentials.
- **Multi-Currency Exam Pricing** — Real-time fee estimates across GBP (£), USD ($), and EUR (€) to budget certification investments.
- **Direct Microsoft Learn Integration** — 1-click access to official exam specifications, study guides, free learning paths, and sandbox assessments.
- **Keyboard Shortcuts & Quick Search** — Global hotkeys (`Ctrl+K` search, `Ctrl+B` sidebar) and keyboard accessibility for rapid navigation.
- **Data Privacy & Portability** — Client-side `localStorage` persistence with one-click JSON backup export and import.
- **Fluent 2 Design System** — Built with Microsoft Fluent 2 tokens, accessible dark/light themes, and responsive layouts.

## 🛠️ Tech Stack

- **Framework** — [React 19](https://react.dev/) with [Vite 8](https://vite.dev/)
- **Routing** — [React Router v7](https://reactrouter.com/)
- **Graph Visualisation** — React Flow with Dagre layout engine
- **Drag-and-Drop** — `@dnd-kit/core` & `@dnd-kit/sortable`
- **Design & Icons** — Microsoft Fluent 2 tokens & `@fluentui/react-icons`
- **Styling** — Vanilla CSS with BEM methodology (zero Tailwind)
- **CI/CD** — GitHub Actions → Azure Static Web Apps

## 📁 Project Structure

```
src/
├── components/
│   ├── CareerPathBuilder/ # Custom and role-based certification tracks
│   ├── CertDetail/       # Certification detail panels
│   ├── Dashboard/        # Main dashboard view
│   ├── Layout/           # Header & Sidebar
│   ├── PathMap/          # Certification path & node visualisations
│   └── common/           # Shared UI components (Badge, etc.)
├── context/
│   ├── ProgressContext   # Certification progress state
│   └── ThemeContext      # Dark/light theme state
├── data/
│   └── certificationPaths.js  # All certification path definitions
├── hooks/
│   └── useProgress       # Progress persistence hook
├── utils/                # Utility functions
├── App.jsx               # Root component & routing
├── index.css             # Global styles & design tokens
└── main.jsx              # Entry point
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/danzure/ms-certification-app.git
cd ms-certification-app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Output is written to the `dist/` directory.

## ☁️ Deployment

This project is configured for automatic deployment to **Azure Static Web Apps** via GitHub Actions. Pushes to `main` trigger the CI/CD pipeline defined in:

```
.github/workflows/azure-static-web-apps-brave-tree-034dbef03.yml
```

The workflow builds the Vite project and deploys the `dist/` output to Azure.

## 📄 Licence

This project is not currently published under a specific licence. All rights reserved.
