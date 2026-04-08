# Coding Guidelines

These guidelines are inferred from the actual code patterns observed in the repository. They describe how this codebase is structured and how new code should be written to stay consistent.

---

## Language

- **JavaScript only** — There is no TypeScript in `oncourts-ui` or `workbench-ui`. All module files use `.js`.
- The landing page (`oncourts-landing-page`) uses **TypeScript** for its API route handlers (`.ts` files in `pages/api/`).
- Do not introduce TypeScript into the module packages unless it becomes a project-wide decision.

---

## File & Folder Naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `ActionEdit.js`, `MultiSelectDropdown.js` |
| Custom hooks | camelCase with `use` prefix | `useSearchCaseService.js`, `useBillSearch.js` |
| Service files | `index.js` or lowercase | `index.js`, `Urls.js` |
| Utility files | camelCase | `errorUtil.js`, `authenticatedLink.js` |
| Module entry files | `Module.js` | `Module.js` |
| Init/barrel exports | `index.js` | `hooks/index.js`, `services/index.js` |

---

## Component Structure

All components are **function components** with hooks. No class components.

```javascript
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

const ComponentName = ({ prop1, prop2 = defaultValue, onAction }) => {
  const { t } = useTranslation();
  const history = useHistory();

  // local state
  const [isOpen, setIsOpen] = useState(false);

  // derived values / memos
  const items = useMemo(() => computeItems(prop1), [prop1]);

  return (
    <div style={{ ... }}>
      {t("LABEL_KEY")}
    </div>
  );
};

export default ComponentName;
```

### Key conventions:
- Props are **destructured** in the function signature with explicit defaults
- `t()` from `useTranslation()` is used for **all** user-visible strings — never hardcode display text
- `useHistory()` from react-router-dom is used for navigation (not `useNavigate` — this project uses React Router v5)
- Local state uses `useState`, derived values use `useMemo`

---

## Styling

**Inline styles only** — CSS modules, styled-components, and class-based external stylesheets are not used in module components.

```javascript
// Correct
<div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>

// Also acceptable — extract to a const above the return
const styles = {
  container: { display: "flex", height: "100vh", width: "100vw" },
};
<div style={styles.container}>
```

Dynamic styling is passed as a prop:
```javascript
const MultiSelectDropdown = ({ ServerStyle = {}, ... }) => (
  <div style={{ ...baseStyle, ...ServerStyle }}>
);
```

> Exception: The `css` package uses SCSS/Tailwind and outputs a compiled stylesheet. Do not add SCSS to module packages.

---

## Internationalization (i18n)

Every user-visible string must use the `t()` function. Never render raw string literals in JSX.

```javascript
const { t } = useTranslation();

// Correct
<button>{t("CS_SUBMIT_BUTTON")}</button>

// Wrong
<button>Submit</button>
```

Translation keys follow `UPPER_SNAKE_CASE` with a module prefix:
- `CS_` — Common/shared strings
- `DRISTI_` — DRISTI module strings
- `HRG_` — Hearings module strings
- `ORDER_` — Orders module strings

---

## Custom Hooks

Each API call is wrapped in a React Query hook. The hook name mirrors the service method it calls.

```javascript
// Pattern: use[Verb][Entity]Service
function useSearchCaseService(reqData, params, moduleCode, caseId, enabled, isCacheTimeEnabled = true, cacheTime = 0) {
  const client = useQueryClient();

  const { isLoading, data, isFetching, refetch, error } = useQuery(
    `GET_CASE_DETAILS_${moduleCode}_${caseId}`,   // unique query key
    () =>
      DRISTIService.searchCaseService(reqData, params)
        .then((data) => data)
        .catch(() => ({})),                         // return empty object on error
    {
      ...(isCacheTimeEnabled && { cacheTime }),
      enabled: Boolean(enabled),
    }
  );

  return {
    isLoading,
    isFetching,
    data,
    refetch,
    revalidate: () => {
      data && client.invalidateQueries({ queryKey: `GET_CASE_DETAILS_${moduleCode}_${caseId}` });
    },
    error,
  };
}
```

### Hook conventions:
- Query keys are **deterministic strings** built from entity type + module + id
- Always expose a `revalidate()` function using `client.invalidateQueries`
- Wrap the service call in `.then(d => d).catch(() => ({}))` — never let a hook crash the UI
- Pass `enabled: Boolean(enabled)` to prevent calls before data is ready

---

## Service Layer

Each module's services live in `src/hooks/services/index.js` and URL constants in `src/hooks/services/Urls.js`.

```javascript
// Urls.js
export const Urls = {
  myModule: {
    createFoo: "/foo/v1/create",
    searchFoo: "/foo/v1/search",
  },
};

// index.js / services/index.js
export const myModuleService = {
  createFoo: (data, params) =>
    Request({
      url: Urls.myModule.createFoo,
      useCache: false,
      userService: true,   // include userInfo in RequestInfo
      data,
      params,
    }),

  searchFoo: (data, params) =>
    Request({
      url: Urls.myModule.searchFoo,
      useCache: true,      // enable caching for read-only searches
      userService: true,
      data,
      params,
    }),
};
```

### Rules for `Request()` options:

| Option | When to use |
|---|---|
| `useCache: true` | Search/read endpoints that return stable data |
| `useCache: false` | Mutations (create/update) and time-sensitive reads |
| `userService: true` | When the backend needs `userInfo` in `RequestInfo` |
| `userService: false` | Public/open endpoints, or when userInfo is not needed |

---

## Module Self-Registration

Every new module must export:

```javascript
// 1. The module React component
export const MyModule = ({ stateCode, userType, tenants }) => { ... };

// 2. The init function called at app startup
export const initMyModuleComponents = () => {
  overrideHooks();
  updateCustomConfigs();
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
```

And register it in `example/src/index.js` alongside the other modules.

---

## Component Registry

Use the registry to share components **across module boundaries** rather than direct imports:

```javascript
// Registering (in Module.js):
const componentsToRegister = {
  MySharedComponent: MySharedComponent,
};

// Consuming (in another module):
const MySharedComponent = Digit.ComponentRegistryService.getComponent("MySharedComponent");
```

Direct cross-module imports are acceptable only for:
- Stable, non-circular dependencies (e.g., `dristi` components imported by `home`)
- One-off cases where registry overhead is not justified

---

## Forms

Use **React Hook Form** (v6) for all form components.

```javascript
import { useForm, Controller } from "react-hook-form";

const MyForm = ({ onSubmit }) => {
  const { register, handleSubmit, control, watch, errors } = useForm({
    defaultValues: { fieldName: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        name="fieldName"
        inputRef={register({ required: true })}
        isMandatory={!!errors.fieldName}
      />
      {/* For controlled components (dropdowns, custom inputs): */}
      <Controller
        name="dropdownField"
        control={control}
        render={({ onChange, value }) => (
          <Dropdown value={value} onChange={onChange} />
        )}
      />
    </form>
  );
};
```

---

## Navigation

Use React Router v5 hooks — not v6 APIs:

```javascript
// Correct (v5)
import { useHistory, useLocation, useRouteMatch, useParams } from "react-router-dom";
const history = useHistory();
history.push("/path");

// Wrong (v6 API — not available)
// import { useNavigate } from "react-router-dom";
```

---

## E-Sign Callback Preservation

When a flow redirects to an e-sign service, save all state needed to resume afterward:

```javascript
// Before redirect:
sessionStorage.setItem("eSignWindowObject", JSON.stringify({
  currentRoute: window.location.pathname + window.location.search,
  formData: { ... },
}));

// After callback:
const savedState = JSON.parse(sessionStorage.getItem("eSignWindowObject") || "{}");
sessionStorage.removeItem("eSignWindowObject");
history.replace(savedState.currentRoute);
```

---

## Error Handling in Components

Do not let API errors crash the page. Return empty objects or safe defaults:

```javascript
// Correct
DRISTIService.searchCaseService(data, params)
  .then((data) => data)
  .catch(() => ({}))

// When showing errors to users — use Toast, not console.error
import { Toast } from "@egovernments/digit-ui-react-components";
// Show toast on mutation failure
```

For document upload errors, use the `DocumentUploadError` class from `dristi/src/Utils/errorUtil.js`:
```javascript
throw new DocumentUploadError("Upload failed", "aadhaar-proof", "FILE_TOO_LARGE");
```

---

## Pending Task Tracking

After any significant mutation (create/update order, create application, etc.), create a pending task record:

```javascript
await Request({
  url: Urls.pendingTask,   // /analytics/pending_task/v1/create
  data: {
    pendingTask: {
      name: "...",
      referenceId: caseId,
      entityType: "case",
      status: "...",
      assignedTo: [],
      assignedRole: [],
      cnrNumber: "...",
      filingNumber: "...",
      isCompleted: false,
      stateSla: null,
      additionalDetails: { ... },
      tenantId,
    },
  },
});
```

---

## Folder Structure per Module

Every module follows this internal layout:

```
modules/[module-name]/src/
├── Module.js           ← Main module component + initXxxComponents()
├── components/         ← React components
├── hooks/
│   ├── index.js        ← Barrel export: { Hooks, DRISTIService, Utils }
│   ├── dristi/         ← Custom hooks (useSearchXxx.js, etc.)
│   └── services/
│       ├── index.js    ← Service object definitions
│       └── Urls.js     ← API endpoint URL constants
├── pages/              ← Route-level page components
├── utils/              ← Pure utility functions
└── index.js            ← Package entry point
```
