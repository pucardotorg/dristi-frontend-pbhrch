# FormComposerV2 Expert

You are helping with the DRISTI court case management frontend. The user has a question specifically about **FormComposerV2** from the Digit-Frontend platform.

## User's Question / Context
$ARGUMENTS

---

## What You Already Know

FormComposerV2 is used across all modules (dristi, hearings, home, orders, submissions, cases) in 73+ files.

### Props
```jsx
<FormComposerV2
  config={[{ body: [...fields] }]}
  onFormValueChange={(setValue, formData, formState, reset, setError, clearErrors, trigger, getValues) => {}}
  defaultValues={{ fieldName: value }}
  isDisabled={false}
  inline={false}
  fieldStyle={{ width: "100%" }}
  children={<Button />}
  childrenAtTheBottom={true}
/>
```

### Field Shape
```js
{
  type: "text" | "dropdown" | "component",
  label: "TRANSLATION_KEY",
  key: "fieldKey",
  isMandatory: true,
  populators: {
    name: "fieldName",
    optionsKey: "name",           // for dropdowns
    options: [{ code, name, isEnabled }],  // for dropdowns
    error: "ERROR_TRANSLATION_KEY",
    validation: { pattern, minLength, maxLength }
  }
}
```

### Custom Component Types (type: "component")
- `SelectBulkInputs` — phone numbers, emails
- `SelectComponentsMulti` — address (pincode, state, district, city, locality)
- `SelectCustomTextArea` — multi-line text with additional details
- `OrSeparator` — visual divider between fields

### Config Storage Pattern
- **Inline** (simple/modal forms): config array defined directly in the component
- **Separate file** (complex forms): stored in `configs/` directory, exported as a constant or function

---

## Step 1 — Find Relevant Examples

Search for existing usage similar to what the user needs:
```bash
grep -r "FormComposerV2" oncourts-ui/micro-ui/web/micro-ui-internals/packages/ --include="*.js" --include="*.jsx" -l
```

Then read the most relevant file(s) to see real patterns.

Key example files to reference:
- `packages/modules/hearings/src/pages/employee/AdjournHearing.js` — simple inline config with dropdown
- `packages/modules/hearings/src/pages/employee/AddAttendees.js` — complex form with children button and full onFormValueChange signature
- `packages/modules/dristi/src/` — 25+ examples of complex case lifecycle forms

## Step 2 — Check the Component Source

If you need to understand a specific prop or behavior:
```
oncourts-ui/micro-ui/web/micro-ui-internals/node_modules/@egovernments/digit-ui-react-components/dist/index.js
```

## Step 3 — Answer

Provide:
- The exact config structure for the user's use case
- The correct props to pass
- A real code example matching patterns already used in this project
- Translation key conventions (ALL_CAPS_WITH_UNDERSCORES)
