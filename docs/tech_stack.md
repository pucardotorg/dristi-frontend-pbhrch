# Tech Stack

## Frontend — oncourts-ui (Main App)

| Technology | Version | Purpose |
|---|---|---|
| **React** | 17.0.2 | UI component library |
| **React Router DOM** | 5.3.0 | Client-side routing |
| **Redux** | 4.1.2 | Global state management (core module only) |
| **React Redux** | 7.2.8 | Redux bindings for React |
| **Redux Thunk** | — | Async action middleware for Redux |
| **React Query** | 3.6.1 | Server state management / data fetching |
| **React Hook Form** | 6.15.8 | Form state management and validation |
| **react-i18next** | 11.16.2 | Internationalization (i18n) |
| **Axios** | (via libraries package) | HTTP client |
| **Lodash** | 4.17.21 | Utility functions |
| **DOMPurify** | 3.3.1 | XSS sanitization for user content |

> Why React 17 (not 18)? The DIGIT platform dependency chain and microbundle tooling were pinned to React 17 at the time of development.

---

## Frontend — oncourts-landing-page

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15.0.3 | SSR/SSG public-facing website |
| **React** | 18.2.0 | UI components |
| **React Query** | 3.39.3 | Data fetching hooks |
| **TypeScript** | — | Type safety (landing page only) |
| **Tailwind CSS** | — | Utility-first styling |
| **Emotion** | — | CSS-in-JS (MUI compatibility) |

---

## Backend For Frontend (BFF) — ui-integration-services

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 14.15.3 | Runtime for all BFF services |
| **Express.js** | ~4.16.x – 4.19.x | HTTP server framework |
| **Axios** | 1.7.x | Upstream API calls to DIGIT backend |
| **pdf-lib** | 1.17.1 | PDF manipulation (merge, combine) |
| **pdfmake** | 0.2.4 | PDF document generation from templates |
| **sharp** | 0.32.6 | Image processing for PDF embedding |
| **html-to-pdfmake** | 2.5.32 | HTML → pdfmake format conversion |
| **kafka-node** | 5.0.0 | Kafka consumer/producer for async PDF jobs |
| **pg** | 8.7.x | PostgreSQL client for PDF record tracking |
| **qrcode** | 1.4.1 | QR code generation in PDFs |
| **pdf-merger-js** | 3.2.1 | Merging multiple PDFs |
| **node-cache** | 5.1.2 | In-memory caching |
| **nodemon** | — | Dev server hot-reload |
| **Babel** | — | ES6 transpilation (pdf-service) |

---

## Build Tools

| Tool | Used In | Purpose |
|---|---|---|
| **Yarn Workspaces** | oncourts-ui, workbench-ui | Monorepo package management |
| **microbundle-crl** | Module packages | Bundles each workspace package as a library (ESM/CJS) |
| **Webpack** | oncourts-ui, workbench-ui | Production app bundler (chunks: 20–50 KB) |
| **Babel** | All React apps | JS transpilation (`@babel/preset-env`, `@babel/preset-react`) |
| **react-scripts** | — | CRA-based dev scripts |
| **Gulp** | css package | SCSS compilation pipeline |
| **PostCSS / Tailwind** | — | CSS processing |
| **sass** | — | SCSS to CSS |

### Webpack Output Strategy
- `oncourts-ui`: publicPath `/ui/`, source maps `cheap-module-source-map`, chunks split at 20–50 KB
- `workbench-ui`: publicPath `/workbench-ui/`, source maps disabled (`none`), same chunk split strategy

---

## Dev Tools

| Tool | Purpose |
|---|---|
| **Husky** | Git pre-commit hooks |
| **lint-staged** | Run Prettier on staged files before commit |
| **Prettier** | Code formatting |
| **ESLint** | Linting (Next.js config for landing page; custom for pdf-service) |
| **nodemon** | Auto-restart BFF services during development |

---

## Infrastructure / CI-CD

| Tool | Purpose |
|---|---|
| **Docker** | Containerization for all services |
| **GitHub Actions** | CI/CD for landing page and workbench-ui |
| **Jenkins** | CI/CD for oncourts-ui (shared library pipeline) |
| **Docker Hub** | Image registry (`venkatramireddyb/` namespace) |
| **Kafka** | Async event bus for PDF generation jobs |
| **PostgreSQL** | Persistence for PDF record tracking |
| **Alpine Node Builder** (`egovio/alpine-node-builder-14:yarn`) | Base Docker image for services |

---

## Third-Party Integrations

| Integration | Purpose |
|---|---|
| **e-Sign Service** (`/e-sign-svc/v1/_esign`) | Aadhaar-based digital signing for court documents |
| **e-Treasury** | Kerala state treasury payment gateway |
| **SBI Payment Gateway** | Alternative payment via `sbi-backend` |
| **e-Post Tracker** | India Post physical dispatch of summons/warrants |
| **OCR Service** | Document digitization / text extraction |
| **Kerala iCOPS** | Location-based jurisdiction lookup |
| **DIGIT MDMS** | Master Data Management Service (configuration/lookup data) |
| **DIGIT Filestore** | Centralized document storage |
| **DIGIT Localization** | String translations / i18n data source |
| **DIGIT HRMS** | Human Resource Management for court staff lookup |

---

## Why This Stack?

- **DIGIT Platform**: The project is built on eGovernments Foundation's open-source DIGIT platform, which prescribes React + Redux + React Query + Yarn Workspaces as the standard frontend stack
- **Modular Workspaces**: Yarn Workspaces + microbundle allows each court function (hearings, orders, etc.) to be developed and released independently while sharing common libraries
- **React Query over Redux for server state**: React Query handles all API data fetching/caching, leaving Redux only for global UI state in the core module
- **React Hook Form**: Lightweight form library that avoids re-renders on every keystroke — critical for complex multi-step court filing forms
- **Node.js BFF**: Thin Express services act as PDF orchestrators, combining data from multiple DIGIT backend APIs and generating structured court documents
- **Kafka**: Enables async, fault-tolerant PDF generation for bulk operations (e.g., bulk cause lists) without blocking HTTP response cycles
