# Digit-Frontend Context Builder

You are helping with the DRISTI court case management frontend, which is built on top of the **DIGIT eGovernance Platform**. Before answering the user's question, build context about the relevant Digit-Frontend code by following the steps below.

## User's Question / Context
$ARGUMENTS

---

## Step 1 — Identify Relevant Packages

The upstream Digit-UI packages are compiled-only (no source) and live at:
```
oncourts-ui/micro-ui/web/micro-ui-internals/node_modules/@egovernments/
```

Available packages:
- `digit-ui-react-components` — core React components (FormComposer, Table, Header, etc.)
- `digit-ui-components` — newer component library
- `digit-ui-libraries` — shared utilities including `Request()` API client, hooks, services
- `digit-ui-module-core` — Redux store, routing, auth, layout
- `digit-ui-module-dristi` — DRISTI-specific compiled module
- `digit-ui-svg-components` — SVG icons

Based on the user's question, decide which packages are most relevant and read their `dist/index.js` to understand their exports and APIs.

## Step 2 — Check How This Project Uses Digit

Search for actual usage patterns in the project source:

- **Imports**: `grep -r "from \"@egovernments" oncourts-ui/micro-ui/web/micro-ui-internals/packages/ --include="*.js" --include="*.jsx" -l`
- **Digit global object**: `grep -r "Digit\." oncourts-ui/micro-ui/web/micro-ui-internals/packages/ --include="*.js" --include="*.jsx" -l`
- For a specific component or hook, grep its name across the packages source to find real usage examples.

## Step 3 — Explore Local Workspace Source

The project's own module source lives at:
```
oncourts-ui/micro-ui/web/micro-ui-internals/packages/modules/
  core/        — Redux, routing, auth, TopBar/Sidebar
  dristi/      — Case lifecycle, 80+ shared components
  home/        — Dashboard, pending tasks
  cases/       — Case joining
  hearings/    — Hearing calendar
  orders/      — Order creation
  submissions/ — Applications, bail bonds
```

And shared libraries:
```
oncourts-ui/micro-ui/web/micro-ui-internals/packages/libraries/
```

Read the relevant source files based on the user's question.

## Step 4 — Answer the Question

With the context gathered above, answer the user's question precisely. Include:
- Which Digit component/hook/utility to use
- The exact import path
- A usage example matching the patterns already used in this codebase
- Any caveats or known overrides this project applies on top of the Digit defaults
