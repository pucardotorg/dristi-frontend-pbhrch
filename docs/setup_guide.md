# Setup Guide

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | 14.15.3 | Defined in `.tool-versions`. Use `asdf` or `nvm` to manage versions |
| **Yarn** | 1.x (Classic) | Required for Yarn Workspaces |
| **npm** | (bundled with Node) | Required for `pdf-service` only |
| **Docker** | Any recent version | For running containerized services |
| **Git** | Any | |

> **Tip:** If you use `asdf` version manager, running `asdf install` at the root of `oncourts-ui/` or `workbench-ui/` will automatically install Node 14.15.3 from the `.tool-versions` file.

---

## Project Structure Quick Reference

```
dristi-frontend-pbhrch/
├── oncourts-landing-page/   ← Next.js public website
├── oncourts-ui/             ← Main court management app (React SPA)
├── workbench-ui/            ← Admin workbench app (React SPA)
└── ui-integration-services/ ← PDF generation BFF services
    ├── dristi-pdf/
    ├── dristi-case-pdf/
    └── pdf-service/
```

---

## 1. oncourts-ui (Main React App)

This is the primary application for court management. It uses a Yarn Workspaces monorepo.

### Install dependencies

```bash
cd oncourts-ui/micro-ui/web/micro-ui-internals
yarn install
```

### Configure environment

Create a `.env` file at `oncourts-ui/micro-ui/web/micro-ui-internals/example/.env`:

```env
REACT_APP_PROXY_API=https://<your-digit-backend-server>
REACT_APP_GLOBAL=https://<your-digit-backend-server>/globalconfig/globalconfig.js
REACT_APP_PROXY_ASSETS=https://<your-digit-backend-server>
REACT_APP_USER_TYPE=EMPLOYEE
SKIP_PREFLIGHT_CHECK=true
```

| Variable | Description |
|---|---|
| `REACT_APP_PROXY_API` | Base URL of the DIGIT backend server |
| `REACT_APP_GLOBAL` | URL to the global config JS file |
| `REACT_APP_PROXY_ASSETS` | Base URL for static assets |
| `REACT_APP_USER_TYPE` | `EMPLOYEE` for court staff, `CITIZEN` for citizens |
| `SKIP_PREFLIGHT_CHECK` | Required to bypass CRA conflicting deps warning |

For demo/dev, the production endpoint is `https://demo.pucar.org`.

### Start dev server

```bash
cd oncourts-ui/micro-ui/web/micro-ui-internals
yarn start
```

The app starts on `http://localhost:3000` (or next available port).

### Alternative: Start from web root (implementation teams)

```bash
cd oncourts-ui/micro-ui/web
yarn install

# Create .env at oncourts-ui/micro-ui/web/.env (same variables as above)

yarn start
```

### Build for production

```bash
# Build all workspace library packages
cd oncourts-ui/micro-ui/web/micro-ui-internals
yarn build:libraries

# Build the app bundle with Webpack
cd oncourts-ui/micro-ui/web
yarn build:webpack
```

Output: `oncourts-ui/micro-ui/web/build/`

---

## 2. oncourts-landing-page (Public Next.js Website)

### Install dependencies

```bash
cd oncourts-landing-page
yarn install
```

### Configure environment

Create `.env.local` at `oncourts-landing-page/.env.local`:

```env
NEXT_PUBLIC_ONCOURTS_API_ENDPOINT=https://demo.pucar.org
NEXT_PUBLIC_GLOBAL=/globalconfig/globalconfig.js
NEXT_PUBLIC_ENV=local
```

The following variables are auto-derived from `NEXT_PUBLIC_ONCOURTS_API_ENDPOINT` in `next.config.js`:
- `NEXT_PUBLIC_ONCOURTS_CITIZEN_APP_ENDPOINT` → `<API_ENDPOINT>/ui/citizen/login`
- `NEXT_PUBLIC_ONCOURTS_EMPLOYEE_APP_ENDPOINT` → `<API_ENDPOINT>/ui/employee/login`
- `NEXT_PUBLIC_ONCOURTS_CITIZEN_DRISTI_ENDPOINT` → `<API_ENDPOINT>/ui/citizen/dristi/home/login`
- `NEXT_PUBLIC_ONCOURTS_EMPLOYEE_USER_ENDPOINT` → `<API_ENDPOINT>/ui/employee/user/login`

### Start dev server

```bash
cd oncourts-landing-page
yarn dev
```

### Format code

```bash
cd oncourts-landing-page
yarn format
```

### Build for production

```bash
cd oncourts-landing-page
yarn build
yarn start   # Start production server
```

---

## 3. workbench-ui (Admin Workbench)

### Install dependencies

```bash
cd workbench-ui/micro-ui/web
yarn install
```

### Configure environment

Create `.env` at `workbench-ui/micro-ui/web/.env` (same variables as oncourts-ui):

```env
REACT_APP_PROXY_API=https://<your-digit-backend-server>
REACT_APP_GLOBAL=https://<your-digit-backend-server>/globalconfig/globalconfig.js
REACT_APP_PROXY_ASSETS=https://<your-digit-backend-server>
REACT_APP_USER_TYPE=EMPLOYEE
SKIP_PREFLIGHT_CHECK=true
```

### Start dev server

```bash
cd workbench-ui/micro-ui/web
yarn start
```

---

## 4. PDF Services (BFF — ui-integration-services)

These are standalone Node.js/Express services. Each must be started separately.

### dristi-pdf

```bash
cd ui-integration-services/dristi-pdf
yarn install
yarn dev-start        # Development (with auto-reload)
# or
yarn start            # Production
```

### dristi-case-pdf

Runs on port **8090**.

```bash
cd ui-integration-services/dristi-case-pdf
yarn install
yarn dev              # Development with nodemon
# or
yarn start            # Production
```

### pdf-service

Uses Babel for ES6 transpilation.

```bash
cd ui-integration-services/pdf-service
npm install
npm run dev           # Development (nodemon + babel-node)
# or
npm run build && npm start   # Production
```

> **Note:** `pdf-service` requires Kafka and PostgreSQL to be running for full functionality. Kafka is used for async bulk PDF jobs; PostgreSQL tracks PDF generation records.

---

## 5. Running with Docker

Each service has a `Dockerfile`. The base image is `egovio/alpine-node-builder-14:yarn`.

### Build any service image

```bash
# Example: dristi-pdf
cd ui-integration-services/dristi-pdf
docker build -t dristi-pdf .

# Example: oncourts-landing-page
cd oncourts-landing-page
docker build \
  --build-arg NEXT_PUBLIC_ONCOURTS_API_ENDPOINT=https://demo.pucar.org \
  --build-arg NEXT_PUBLIC_GLOBAL=/globalconfig/globalconfig.js \
  --build-arg NEXT_PUBLIC_ENV=local \
  -t oncourts-website .
```

### Published Docker images (CI/CD)

- Landing page: `docker.io/venkatramireddyb/oncourts-website:<version>-<commit>`
- Workbench: `docker.io/venkatramireddyb/workbench-ui:<version>-<commit>`

---

## 6. Linting

```bash
# Landing page — ESLint (via Next.js)
cd oncourts-landing-page
yarn lint

# pdf-service — ESLint on src/
cd ui-integration-services/pdf-service
npm test
```

> There is no Jest/Vitest unit test suite. The `npm test` script in `pdf-service` runs ESLint, not tests.

---

## 7. CI/CD Pipeline Summary

| App | Tool | Triggers | Output |
|---|---|---|---|
| `oncourts-ui` | Jenkins | Jenkinsfile in `micro-ui/` | Docker image via shared library |
| `oncourts-landing-page` | GitHub Actions | Push to `develop`, `main`, `release/**`, tags | `venkatramireddyb/oncourts-website` |
| `workbench-ui` | GitHub Actions | Push to `develop`, `court-room-hrms`, `master` | `venkatramireddyb/workbench-ui` |

Downstream deployments are triggered automatically based on branch:
- `develop` → `solutions-dev`
- `release/**` → `solutions-qa`
- `main` → `solutions-uat` and `solutions-dpg-dev`

---

## Common Issues

| Issue | Fix |
|---|---|
| `SKIP_PREFLIGHT_CHECK` not set | Add `SKIP_PREFLIGHT_CHECK=true` to `.env` |
| Yarn workspaces not linking | Run `yarn install` from `micro-ui-internals/`, not a nested package |
| Node version mismatch | Use `asdf install` or `nvm use 14.15.3` |
| API calls failing with 401 | Check `REACT_APP_PROXY_API` points to a reachable DIGIT backend |
| PDF service Kafka errors | Kafka and Zookeeper must be running; check `pdf-service` config |
| Port conflicts | React apps try port 3000 by default; set `PORT=3001` in `.env` if needed |
