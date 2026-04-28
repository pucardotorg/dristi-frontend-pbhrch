# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the **DRISTI** court case management frontend, built on the **DIGIT eGovernance Platform**. It is a multi-workspace monorepo containing:

- **`oncourts-landing-page/`** — Public-facing Next.js 15 site
- **`oncourts-ui/`** — Main React UI for OnCourts (Yarn Workspaces monorepo)
- **`workbench-ui/`** — Separate DIGIT UI for admin/workbench tasks
- **`ui-integration-services/`** — Node.js/Express BFF services for PDF generation

Node.js version: **14.15.3** (defined in `.tool-versions` files).

---

## Commands

### oncourts-landing-page (Next.js)
```bash
cd oncourts-landing-page
yarn dev          # Dev server
yarn build        # Production build
yarn format       # Prettier formatting
```

### oncourts-ui (Main React App)
```bash
# From oncourts-ui/micro-ui/web/
yarn install
yarn start        # Dev server (requires .env)

# From oncourts-ui/micro-ui/web/micro-ui-internals/
yarn install
yarn start        # Dev server using example app
yarn build:libraries  # Build all workspace packages with microbundle
```

### workbench-ui
```bash
# From workbench-ui/micro-ui/web/
yarn install
yarn start
```

### PDF Services (ui-integration-services)
```bash
cd ui-integration-services/dristi-pdf && yarn dev-start
cd ui-integration-services/dristi-case-pdf && yarn dev
cd ui-integration-services/pdf-service && npm run dev
```

### Linting
```bash
cd ui-integration-services/pdf-service && npm test  # ESLint only — no unit test suite exists
```

There is no Jest/Vitest test suite. Pre-commit hooks (Husky + lint-staged) run Prettier on staged files.

---

## Environment Setup

Create `.env` files before starting dev servers:

- `oncourts-ui/micro-ui/web/.env` or `oncourts-ui/micro-ui/web/micro-ui-internals/example/.env`

Required variables:
```
REACT_APP_PROXY_API=<server url>
REACT_APP_GLOBAL=<server url>
REACT_APP_PROXY_ASSETS=<server url>
REACT_APP_USER_TYPE=EMPLOYEE   # or CITIZEN
SKIP_PREFLIGHT_CHECK=true
```

---

## Architecture

### Yarn Workspaces (oncourts-ui)

`oncourts-ui/micro-ui/web/micro-ui-internals/` is the workspace root with packages:
- `packages/libraries` — `@egovernments/digit-ui-libraries` (shared `Request()` utility, API client)
- `packages/css` — Sass/Tailwind CSS (`dristi-ui-css`)
- `packages/modules/*` — Feature modules (each is an independent package)

### Feature Modules

| Module | Responsibility |
|---|---|
| `core` | Redux store, React Query client, auth (`PrivateRoute`), routing shell, TopBar/Sidebar layout, context providers |
| `dristi` | Case lifecycle (registration → filing → scrutiny → admission), 80+ shared components, e-sign, OCR, payments |
| `home` | Dashboard, pending tasks, bulk signing, analytics, e-post tracking |
| `cases` | Case joining — search, access code verification, vakalath, payment |
| `hearings` | Hearing calendar, in-hearing management, transcription, adjournment, bulk reschedule |
| `orders` | Order creation, e-sign, publishing, summons/warrant delivery, SBI payments |
| `submissions` | Applications, bail bonds, plea, unauthenticated e-sign SMS flows |

### Module Self-Registration Pattern

Every feature module exports an `init[Module]Components()` function called at app startup that:
1. Registers components via `Digit.ComponentRegistryService.setComponent()`
2. Injects custom hooks via `overrideHooks()` → `Digit.Hooks[module]`
3. Extends configuration via `updateCustomConfigs()` → `Digit.Customizations`

### Cross-Module Dependencies

```
dristi ──(80+ shared components)──▶ orders, submissions, hearings, home, cases
home ────(direct import)──────────▶ orders (PaymentStatus)
home, orders ──(direct import)────▶ dristi (MediationFormSignaturePage)
submissions ──(component registry)▶ dristi (hosts citizen open pages)
hearings ──(component registry)───▶ home (SummonsAndWarrantsModal, Calendar)
```

### Shared Infrastructure

| Concern | Implementation |
|---|---|
| Redux Store | `getStore()` with `combineReducers` + `redux-thunk` (Core module) |
| React Query | `QueryClient` — stale: 15min, cache: 50min, no retry |
| Authentication | `PrivateRoute`, `Digit.UserService`, `localStorage` token |
| API calls | `Request()` from `@egovernments/digit-ui-libraries` |
| i18n | `react-i18next` with `useTranslation()` across all modules |
| E-Sign callbacks | `sessionStorage.eSignWindowObject` stores pre-sign state for post-callback restoration |
| Open/unauthenticated routes | Mounted under `/openapi/*` for SMS-based external access |

### Service Layer Convention

Each module defines its API services in `hooks/services/index.js` (wrapping `Request()`) and its URL constants in `hooks/services/Urls.js`. State is managed with React Query or `Digit.Services.useStore`; no module-specific Redux slices outside of `core`.
