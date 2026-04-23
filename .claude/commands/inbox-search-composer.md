# InboxSearchComposer Expert

You are helping with the DRISTI court case management frontend. The user has a question specifically about **InboxSearchComposer** from the Digit-Frontend platform.

## User's Question / Context
$ARGUMENTS

---

## What You Already Know

InboxSearchComposer is used primarily in the **home** and **hearings** modules for search interfaces with result tables backed by API calls.

### Props
```jsx
<InboxSearchComposer
  configs={ConfigFromConfigsFolder}
  defaultValues={{ fieldName: value }}
  customStyle={sectionsParentStyle}
/>
```

### Config Shape
Config always lives in a **separate file** under `configs/`:
```js
export const MySearchConfig = {
  label: "TAB_LABEL_TRANSLATION_KEY",
  type: "search",
  apiDetails: {
    serviceName: "/service/v1/_search",
    requestParam: { /* query params */ },
    requestBody: {
      RequestInfo: {},
      criteria: { /* search criteria */ }
    },
    minParametersForSearchForm: 0,
    masterName: "commonUiConfig",
    moduleName: "commonUiConfig",
    tableFormKey: "searchForm",
  },
  sections: {
    search: {
      uiConfig: {
        formClassName: "custom-both-clear-search",
        primaryLabel: "ES_COMMON_SEARCH",
        secondaryLabel: "ES_COMMON_CLEAR_SEARCH",
        fields: [
          {
            label: "FIELD_LABEL",
            type: "text" | "dropdown" | "date",
            isMandatory: false,
            key: "fieldKey",
            populators: { name: "fieldName" }
          }
        ]
      },
      show: true,
    },
    searchResult: {
      uiConfig: {
        columns: [
          {
            label: "COLUMN_HEADER",
            jsonPath: "path.to.value",
            additionalCustomization: true,  // enables custom cell rendering
          }
        ],
        resultsJsonPath: "responseKey",     // key in API response that holds the array
        enableColumnSort: true,
        showPagination: true,
      },
      show: true,
    },
  },
  additionalDetails: { /* any extra data passed through to hooks/components */ },
};
```

### Config as a Function (when dynamic params needed)
```js
export const myConfig = ({ filingNumber, orderId, orderType }) => ({
  label: `Label`,
  type: "search",
  apiDetails: { /* ... */ },
  sections: { /* ... */ },
  additionalDetails: { filingNumber, orderId, orderType },
});
// Usage: <InboxSearchComposer configs={myConfig({ filingNumber, orderId })} />
```

---

## Step 1 — Find Relevant Examples

```bash
grep -r "InboxSearchComposer" oncourts-ui/micro-ui/web/micro-ui-internals/packages/ --include="*.js" --include="*.jsx" -l
```

Key example files:
- `packages/modules/home/src/pages/employee/HomeScheduleHearing.js` — simple usage with separate config
- `packages/modules/hearings/src/pages/employee/SummonsAndWarrantsModal.js` — usage with defaultValues
- `packages/modules/home/src/pages/employee/ViewHearing.js` — usage with dynamic defaultValues
- `packages/modules/home/src/configs/ScheduleHearingHomeConfig.js` — full config file example
- `packages/modules/hearings/src/configs/SummonsNWarrantConfig.js` — config as a function example

## Step 2 — Check the Component Source

If you need to understand internal behavior:
```
oncourts-ui/micro-ui/web/micro-ui-internals/node_modules/@egovernments/digit-ui-react-components/dist/index.js
```

## Step 3 — Answer

Provide:
- The config file structure for the user's use case
- Where to place the config file (follow the `configs/` convention)
- How to wire the API (`serviceName`, `requestBody`, `resultsJsonPath`)
- Column definitions with `jsonPath` and custom rendering if needed
- The JSX usage with correct props
