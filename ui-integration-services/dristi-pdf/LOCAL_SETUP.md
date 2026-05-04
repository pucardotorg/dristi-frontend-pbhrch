# dristi-pdf — Local Setup Guide

## Prerequisites

- Node.js 14.x (see `.tool-versions`)
- Access to the demo server (`https://demo.pucar.org`) **or** a configured `kubectl` context pointing to the cluster

---

## Step 1: Install dependencies

```bash
cd ui-integration-services/dristi-pdf
npm install
```

---

## Step 2: Configure environment

Create a `.env` file in the `dristi-pdf` directory. The quickest approach is to point all services at the demo server (no port-forwarding needed):

```env
EGOV_HOST=https://demo.pucar.org

EGOV_MDMS_HOST=https://demo.pucar.org
EGOV_PDF_HOST=https://demo.pucar.org
DRISTI_CASE_HOST=https://demo.pucar.org
DRISTI_ORDER_HOST=https://demo.pucar.org
EGOV_HRMS_HOST=https://demo.pucar.org
EGOV_INDIVIDUAL_HOST=https://demo.pucar.org
DRISTI_ADVOCATE_HOST=https://demo.pucar.org
DRISTI_HEARING_HOST=https://demo.pucar.org
EGOV_SUNBIRDRC_CREDENTIAL_HOST=https://demo.pucar.org
DRISTI_APPLICATION_HOST=https://demo.pucar.org
EGOV_LOCALIZATION_HOST=https://demo.pucar.org
EGOV_FILESTORE_SERVICE_HOST=https://demo.pucar.org
DRISTI_EVIDENCE_HOST=https://demo.pucar.org
DRISTI_BAIL_BOND_HOST=https://demo.pucar.org
DRISTI_TASK_HOST=https://demo.pucar.org
DRISTI_TASK_MANAGEMENT_HOST=https://demo.pucar.org
DRISTI_DIGITALIZED_DOCUMENTS_HOST=https://demo.pucar.org
DRISTI_CTC_APPLICATIONS_HOST=https://demo.pucar.org

AUTH_TOKEN=<your-auth-token>
APP_PORT=8080
```

**Alternative: kubectl port-forwards**

If you prefer to run services locally via port-forwarding, set up the following forwards (all services used by the case bundle flow):

```bash
kubectl port-forward svc/egov-mdms-service     -n egov 8081:8080 &
kubectl port-forward svc/egov-localization     -n egov 8083:8080 &
kubectl port-forward svc/egov-filestore        -n egov 8084:8080 &
kubectl port-forward svc/pdf-service           -n egov 8070:8080 &
kubectl port-forward svc/case                  -n egov 8091:8080 &
kubectl port-forward svc/order                 -n egov 8092:8080 &
kubectl port-forward svc/application           -n egov 8094:8080 &
kubectl port-forward svc/evidence              -n egov 8090:8080 &
kubectl port-forward svc/task                  -n egov 8096:8080 &
kubectl port-forward svc/task-management       -n egov 8087:8080 &
kubectl port-forward svc/bail-bond             -n egov 8097:8080 &
kubectl port-forward svc/digitalized-documents -n egov 8333:8080 &
```

---

## Step 3: Start the service

```bash
# Load .env and start
set -a && source .env && set +a && npm run dev-start
```

The service starts on `http://localhost:8080`.

---

## Step 4: Test with a working cURL

### Get a valid auth token

Log in to `https://demo.pucar.org`, open DevTools → Network, and copy the `authToken` from any API request.

### Get userInfo for your token

```bash
curl -X POST 'https://demo.pucar.org/user/_search' \
  -H 'Content-Type: application/json' \
  -d '{
    "RequestInfo": {
      "apiId": "Rainmaker",
      "authToken": "<your-auth-token>"
    },
    "tenantId": "pb"
  }' | jq '.user[0]'
```

### Test the case bundle endpoint

```bash
curl --location 'http://localhost:8080/egov-pdf/dristi-pdf/process-case-bundle' \
--header 'Content-Type: application/json' \
--data-raw '{
    "tenantId": "pb",
    "caseId": "<caseId>",
    "state": "PENDING_ADMISSION",
    "isRebuild": false,
    "index": {
        "sections": [
            { "name": "titlepage",            "lineItems": [] },
            { "name": "complaint",            "lineItems": [] },
            { "name": "filings",              "lineItems": [] },
            { "name": "affidavit",            "lineItems": [] },
            { "name": "vakalat",              "lineItems": [] },
            { "name": "pendingapplications",  "lineItems": [] },
            { "name": "mandatorysubmissions", "lineItems": [] },
            { "name": "additionalfilings",    "lineItems": [] },
            { "name": "complainantevidence",  "lineItems": [] },
            { "name": "accusedevidence",      "lineItems": [] },
            { "name": "courtevidence",        "lineItems": [] },
            { "name": "applications",         "lineItems": [] },
            { "name": "baildocument",         "lineItems": [] },
            { "name": "processes",            "lineItems": [] },
            { "name": "paymentreceipts",      "lineItems": [] },
            { "name": "orders",               "lineItems": [] },
            { "name": "digitalizedDocuments", "lineItems": [] },
            { "name": "others",               "lineItems": [] }
        ]
    },
    "requestInfo": {
        "apiId": "Rainmaker",
        "authToken": "<your-auth-token>",
        "msgId": "<timestamp>|en_IN",
        "plainAccessRequest": {},
        "userInfo": <paste userInfo object from above>
    }
}'
```

> **Note:** Section names in `index.sections` must match exactly (all lowercase, except `digitalizedDocuments`). The API gateway normally enriches `RequestInfo` with `userInfo` automatically — when calling dristi-pdf directly, you must include it manually.

A successful response returns HTTP 200 with the updated `index` containing `fileStoreId`s per section.

---

## Common issues

| Error | Cause | Fix |
|---|---|---|
| `CASE_NOT_FOUND / userInfo is null` | `userInfo` missing from `requestInfo` | Fetch userInfo via `user/_search` and include it |
| `ECONNREFUSED 127.0.0.1:<port>` | Service not port-forwarded | Run the port-forward for that service |
| `Cannot set properties of undefined (lineItems)` | Section name mismatch in request | Use the exact lowercase names listed above |
| `API Error 400` with no detail | Logger not printing metadata | Check `logger.js` — `myFormat` must spread `...meta` |
