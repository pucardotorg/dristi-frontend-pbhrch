# API Documentation

This document describes the API endpoints consumed by the DRISTI frontend, the BFF (Backend For Frontend) services it exposes, and the conventions used for all API communication.

---

## Request/Response Convention

### Every POST request is wrapped with `RequestInfo`

All calls made via the `Request()` utility automatically inject a `RequestInfo` block:

```json
{
  "RequestInfo": {
    "apiId": "Dristi",
    "authToken": "<user-access-token>",
    "userInfo": { "...user object from Digit.UserService..." },
    "msgId": "<timestamp>|<locale>",
    "ts": 1712345678000
  },
  "...actual request body..."
}
```

- `authToken` is included when the user is logged in
- `userInfo` is included when `userService: true` is set in the service method
- `msgId` includes current timestamp and locale for traceability

### Authentication Header

For file downloads, an explicit auth-token header is used:
```
auth-token: <access_token>
```

### Response Structure

DIGIT platform responses follow this pattern:
```json
{
  "ResponseInfo": { "status": "successful" },
  "<entity>": [ ... ]
}
```

Errors are returned as:
```json
{
  "Errors": [
    { "code": "...", "message": "...", "description": "..." }
  ]
}
```

---

## Authentication

| Endpoint | Method | Purpose |
|---|---|---|
| `/user/oauth/token` | POST | Login — obtain access token |

**Token flow:**
1. Login → receive `access_token` → store in `localStorage` and `window.Digit.UserService`
2. All subsequent requests include `authToken` in `RequestInfo`
3. On `InvalidAccessTokenException` → auto-redirect to login page, localStorage + sessionStorage cleared

---

## Global Error Handling (Axios Interceptor)

| Error Condition | Behavior |
|---|---|
| `InvalidAccessTokenException` | Clear storage, redirect to `/login?from=<current-path>` |
| `Internal Server Error` / `some error occured` | Redirect to `/error?type=maintenance` |
| `ZuulRuntimeException` | Redirect to `/error?type=notfound` |

---

## Core Module — Utilities

| Method | Endpoint | Notes |
|---|---|---|
| `initStore` | `/egov-mdms-service/v1/_search` | Load MDMS config on startup |
| File fetch | `/filestore/v1/files/id` | GET — fetch document by fileStoreId |

---

## DRISTI Module Endpoints

The `DRISTIService` object exposes 60+ methods. Key groups:

### Individual / Advocate / Clerk

| Method | Endpoint | Notes |
|---|---|---|
| `postIndividualService` | `POST /individual/v1/_create` | Create individual profile |
| `updateIndividualService` | `POST /individual/v1/_update` | |
| `searchIndividualService` | `POST /individual/v1/_search` | |
| `deleteIndividualService` | `POST /individual/v1/_delete` | |
| `searchIndividualAdvocate` | `POST /advocate/v1/_search` | Search advocate by individual |
| `searchIndividualClerk` | `POST /advocate/clerk/v1/_search` | |
| `updateAdvocateDetails` | `POST /advocate/v1/_update` | |
| `searchAllAdvocates` | `POST /advocate/v1/status/_search` | Status-based advocate search |
| `searchEmployee` | `POST /egov-hrms/employees/_search` | Court staff lookup |

### Case Management

| Method | Endpoint | Notes |
|---|---|---|
| `caseCreateService` | `POST /case/v1/_create` | Create new case |
| `caseUpdateService` | `POST /case/v1/_update` | |
| `searchCaseService` | `POST /case/v1/_search` | Search cases |
| `caseDetailSearchService` | `POST /case/v2/search/details` | Full case detail |
| `summaryCaseSearchService` | `POST /case/v2/search/summary` | Summary view |
| `caseListSearchService` | `POST /case/v2/search/list` | List view |
| `casePfGenerationService` | `POST /case/v1/_generatePdf` | Trigger case PDF |
| `addWitness` | `POST /case/v1/add/witness` | Add witness to case |
| `addNewWitness` | `POST /case/v2/add/witness` | |
| `addAddress` | `POST /case/v1/address/_add` | |
| `createProfileRequest` | `POST /case/v2/profilerequest/create` | |
| `processProfileRequest` | `POST /case/v2/profilerequest/process` | |

### Evidence

| Method | Endpoint | Notes |
|---|---|---|
| `evidenceSearch` | `POST /evidence/v1/_search` | |
| `evidenceCreate` | `POST /evidence/v1/_create` | |
| `evidenceUpdate` | `POST /evidence/v1/_update` | |
| `addEvidenceComment` | `POST /evidence/v1/addcomment` | |
| `getEvidencesToSign` | `POST /evidence/v1/_getArtifactsToSign` | Bulk signing queue |
| `updateSignedEvidences` | `POST /evidence/v1/_updateSignedArtifacts` | |
| `getMarkAsEvidencePdf` | `POST /egov-pdf/evidence` | Generate evidence PDF |

### Hearings (DRISTI module)

| Method | Endpoint | Notes |
|---|---|---|
| `searchHearings` | `POST /hearing/v1/search` | |
| `createHearings` | `POST /hearing/v1/create` | Auto-injects `presidedBy` (judgeId, benchId, courtId) |
| `updateHearings` | `POST /hearing/v1/update` | |
| `hearingUpdateTranscript` | `POST /hearing/v1/update_transcript_additional_attendees` | |
| `uploadWitnesspdf` | `POST /hearing/witnessDeposition/v1/uploadPdf` | |

### Orders (DRISTI module)

| Method | Endpoint | Notes |
|---|---|---|
| `ordersSearch` | `POST /order/v1/search` | |
| `ordersCreate` | `POST /order/v1/create` | |
| `getDraftOrder` | `POST /order-management/v1/getDraftOrder` | |
| `botdOrdersSearch` | `POST /order-management/v1/getBotdOrders` | |

### Submissions / Applications

| Method | Endpoint | Notes |
|---|---|---|
| `submissionsSearch` | `POST /application/v1/search` | |
| `submissionsUpdate` | `POST /application/v1/update` | |
| `applicationCreate` | `POST /application/v1/create` | |
| `addSubmissionComment` | `POST /application/v1/addcomment` | |

### Digitalized Documents

| Method | Endpoint | Notes |
|---|---|---|
| `searchDigitizedDocument` | `POST /digitalized-documents/v1/_search` | |
| `createDigitizedDocument` | `POST /digitalized-documents/v1/_create` | |
| `updateDigitizedDocument` | `POST /digitalized-documents/v1/_update` | |

### Payments

| Method | Endpoint | Notes |
|---|---|---|
| `paymentCalculator` | `POST /payment-calculator/v1/case/fees/_calculate` | Case fee calculation |
| `summonsPayment` | `POST /payment-calculator/v1/_calculate` | Summons/warrant fee |
| `getTreasuryPaymentBreakup` | `POST /etreasury/payment/v1/_getHeadBreakDown` | |
| `fetchBill` | `POST /billing-service/bill/v2/_fetchbill` | |
| `searchBill` | `POST /billing-service/bill/v2/_search` | |
| `eTreasury` | `POST /etreasury/payment/v1/_processChallan` | Initiate treasury payment |
| `etreasuryCreateDemand` | `POST /etreasury/payment/v1/_createDemand` | |
| `billFileStoreId` | `POST /etreasury/payment/v1/_getPaymentReceipt` | Get receipt PDF |
| `demandCreate` | `POST /billing-service/demand/_create` | |

### E-Sign

| Method | Endpoint | Notes |
|---|---|---|
| `eSign` | `POST /e-sign-svc/v1/_esign` | Initiate Aadhaar e-sign |

### OCR

| Method | Endpoint | Notes |
|---|---|---|
| `sendOCR` | `POST /ocr-service/verify` | Send document for OCR |
| `receiveOCR` | `POST /ocr-service/data` | Retrieve OCR results |

### Scheduling

| Method | Endpoint | Notes |
|---|---|---|
| `judgeAvailabilityDates` | `POST /scheduler/judge/v1/_availability` | |

### Lock Management

| Method | Endpoint | Notes |
|---|---|---|
| `setCaseLock` | `POST /lock-svc/v1/_set` | Prevent concurrent edits |
| `getCaseLockStatus` | `POST /lock-svc/v1/_get` | |
| `setCaseUnlock` | `POST /lock-svc/v1/_release` | |

### Advocate Office Management

| Method | Endpoint | Notes |
|---|---|---|
| `addOfficeMember` | `POST /advocate-office-management/v1/_addMember` | |
| `searchOfficeMember` | `POST /advocate-office-management/v1/_searchMember` | |
| `searchCaseMember` | `POST /advocate-office-management/v1/_searchCaseMember` | |
| `leaveOffice` | `POST /advocate-office-management/v1/_leaveOffice` | |

### Miscellaneous

| Method | Endpoint | Notes |
|---|---|---|
| `pendingTask` | `POST /analytics/pending_task/v1/create` | Track workflow task state |
| `getPendingTaskFields` | `POST /inbox/v2/_getFields` | |
| `inboxSearch` | `POST /inbox/v2/index/_search` | |
| `CombineDocuments` | `POST /egov-pdf/dristi-pdf/combine-documents` | Merge PDFs |
| `downloadCaseBundle` | `POST /casemanagement/casemanager/case/v1/_buildcasebundle` | |
| `repondentPincodeSearch` | `POST /payment-calculator/hub/v1/_search` | |
| `getLocationBasedJurisdiction` | `POST /kerala-icops/v1/integrations/iCops/_getLocationBasedJurisdiction` | |
| `bankDetails` | `POST /bank-details/v1/_search` | |
| `eligibility` | `POST /inportal-survey/v1/eligibility` | |
| `feedback` | `POST /inportal-survey/v1/feedback` | |

---

## Hearings Module Endpoints

| Method | Endpoint |
|---|---|
| `updateHearingTranscript` | `POST /hearing/v1/update_transcript_additional_attendees` |
| `searchHearings` | `POST /hearing/v1/search` |
| `updateHearings` | `POST /hearing/v1/update` |
| `searchTasks` | `POST /task/v1/search` |
| `downloadWitnesspdf` | `POST /hearing/witnessDeposition/v1/downloadPdf` |
| `uploadWitnesspdf` | `POST /hearing/witnessDeposition/v1/uploadPdf` |
| `causeList` | `POST /scheduler/causelist/v1/_download` |
| `bulkReschedule` | `POST /hearing/v1/bulk/_reschedule` |
| `createNotificationPdf` | `POST /egov-pdf/hearing` |
| `bulkHearingsUpdate` | `POST /hearing/v1/bulk/_update` |
| `addBulkDiaryEntries` | `POST /ab-diary/case/diary/v1/bulkEntry` |
| `createNotification` | `POST /notification/v1/_create` |
| `updateNotification` | `POST /notification/v1/_update` |
| `searchNotification` | `POST /notification/v1/_search` |
| `searchHearingCount` | `POST /hearing-management/hearing/v1/search` |

---

## Orders Module Endpoints

### Core Orders

| Method | Endpoint |
|---|---|
| `createOrder` | `POST /order-management/v1/_createOrder` |
| `updateOrder` | `POST /order-management/v1/_updateOrder` |
| `searchOrder` | `POST /order/v1/search` |
| `addItem` | `POST /order/v2/add-item` |
| `removeItem` | `POST /order/v2/remove-item` |
| `orderPreviewPdf` | `POST /egov-pdf/order` |

### Bulk Signing

| Method | Endpoint |
|---|---|
| `getOrdersToSign` | `POST /order-management/v1/_getOrdersToSign` |
| `updateSignedOrders` | `POST /order-management/v1/_updateSignedOrders` |
| `getDigitalizedDocumentsToSign` | `POST /digitalized-documents/v1/_getDigitalizedDocumentsToSign` |
| `updateSignedDigitalizedDocuments` | `POST /digitalized-documents/v1/_updateSignedDigitalizedDocuments` |
| `getProcessToSign` | `POST /task/v1/_getTasksToSign` |
| `updateSignedProcess` | `POST /task/v1/_updateSignedTasks` |

### Task / Summons / Warrants

| Method | Endpoint |
|---|---|
| `taskCreate` | `POST /task/v1/create` |
| `updateTask` | `POST /task/v1/update` |
| `searchTask` | `POST /task/v1/search` |
| `uploadTaskDoc` | `POST /task/v1/uploadDocument` |
| `bulkSend` | `POST /task/v1/bulk-send` |

### E-Post Tracker

| Method | Endpoint |
|---|---|
| `EpostUpdate` | `POST /epost-tracker/epost/v1/_updateEPost` |
| `EpostReportDownload` | `POST /epost-tracker/epost/v1/download/excel` |

### SBI Payment

| Method | Endpoint |
|---|---|
| `SBIPayment` | `POST /sbi-backend/payment/v1/_processTransaction` |

### Open API (Unauthenticated)

| Method | Endpoint | Notes |
|---|---|---|
| `searchOrders` | `POST /openapi/v1/getOrderDetails` | SMS-based access |
| `taskManagementCreate` | `POST /openapi/task-management/v1/_create` | |
| `taskManagementUpdate` | `POST /openapi/task-management/v1/_update` | |
| `taskManagementSearch` | `POST /openapi/task-management/v1/_search` | |
| `summonsPayment` | `POST /openapi/payment/v1/_calculate` | |
| `getTreasuryPaymentBreakup` | `POST /openapi/payment/v1/_getHeadBreakDown` | |
| `fetchBill` | `POST /openapi/payment/v1/_fetchbill` | |
| `eTreasury` | `POST /openapi/payment/v1/_processChallan` | |
| `searchBill` | `POST /openapi/payment/v1/_searchbill` | |
| `billFileStoreId` | `POST /openapi/payment/v1/getPaymentReceipt` | |
| `setCaseUnlock` | `POST /openapi/lock/v1/_release` | |
| `getPaymentLockStatus` | `POST /openapi/lock/v1/_get` | |
| `setCaseLock` | `POST /openapi/lock/v1/_set` | |
| `FileFetchByFileStore` | `GET /openapi/v1/landing_page/file` | |
| `addAddress` | `POST /openapi/v1/case/addAddress` | |
| `offlinePayment` | `POST /openapi/offline-payment/_create` | |

---

## Submissions Module Endpoints

### Applications

| Method | Endpoint |
|---|---|
| `createApplication` | `POST /application/v1/create` |
| `updateApplication` | `POST /application/v1/update` |
| `searchApplication` | `POST /application/v1/search` |
| `submissionPreviewPdf` | `POST /egov-pdf/application` |

### Bail Bonds

| Method | Endpoint |
|---|---|
| `bailBondCreate` | `POST /bail-bond/v1/_create` |
| `bailBondUpdate` | `POST /bail-bond/v1/_update` |
| `bailBondSearch` | `POST /bail-bond/v1/_search` |
| `bailBondPreviewPdf` | `POST /egov-pdf/bailBond` |

### Digitalization / Plea

| Method | Endpoint |
|---|---|
| `digitalizationCreate` | `POST /digitalized-documents/v1/_create` |
| `digitalizationUpdate` | `POST /digitalized-documents/v1/_update` |
| `digitalizationSearch` | `POST /digitalized-documents/v1/_search` |
| `pleaPreviewPdf` | `POST /egov-pdf/digitisation` |

### Open API (Unauthenticated SMS flows)

| Method | Endpoint |
|---|---|
| `bailSearch` | `POST /openapi/v1/bail/search` |
| `updateBailBond` | `POST /openapi/v1/updateBailBond` |
| `witnessDepositionSearch` | `POST /openapi/v1/witness_deposition/search` |
| `updateWitnessDeposition` | `POST /openapi/v1/witness_deposition/update` |
| `digitizedDocumentSearch` | `POST /openapi/v1/digitalized_document/search` |
| `updateDigitizedDocument` | `POST /openapi/v1/digitalized_document/update` |
| `fileUpload` | `POST /openapi/v1/file/upload` |
| `FileFetchByFileStore` | `GET /openapi/v1/landing_page/file` |

---

## Cases Module Endpoints

| Method | Endpoint | Notes |
|---|---|---|
| `joinCase` | `POST /case/v1/joincase/_joincase` | Join case as party |
| `verifyAccessCode` | `POST /case/v2/joincase/_verifycode` | Verify case access code |
| `pendingTask` | `POST /analytics/pending_task/v1/create` | |

---

## Home Module Endpoints (selected)

| Method | Endpoint | Notes |
|---|---|---|
| `caseSearch` | `POST /case/v1/_search` | |
| `inboxSearch` | `POST /inbox/v2/index/_search` | Pending task inbox |
| `generateADiaryPDF` | `POST /ab-diary/case/diary/v1/generate` | Advocate diary |
| `updateADiaryPDF` | `POST /ab-diary/case/diary/v1/update` | |
| `searchADiary` | `POST /ab-diary/case/diary/v1/search` | |
| `getBailBondsToSign` | `POST /bail-bond/v1/_getBailsToSign` | Bulk signing |
| `updateSignedBailBonds` | `POST /bail-bond/v1/_updateSignedBails` | |
| `bulkAcceptCTCApplication` | `POST /ctc/applications/_review` | CTC processing |
| `searchCTCApplication` | `POST /ctc/applications/_search` | |
| `issueDocument` | `POST /ctc/applications/documents/issue-reject` | |
| `getDocForSignCTCApplication` | `POST /ctc/applications/documents/_getDocsToSign` | |
| `updateSignDocsForCTCApplication` | `POST /ctc/applications/documents/_updateSignedDocs` | |
| `submitOptOutDates` | `POST /scheduler/hearing/v1/_opt-out` | Judge opt-out dates |
| `getSearchReschedule` | `POST /scheduler/hearing/v1/reschedule/_search` | |

---

## BFF Services — Exposed Endpoints

### dristi-pdf

| Route | Method | Description |
|---|---|---|
| `{contextPath}/order` | POST | Generate order PDF |
| `{contextPath}/application` | POST | Generate application PDF (query: `applicationType`) |
| `{contextPath}/hearing` | POST | Generate hearing/witness deposition PDF |
| `{contextPath}/bailBond` | POST | Generate bail bond PDF |
| `{contextPath}/evidence` | POST | Generate evidence PDF |
| `{contextPath}/digitisation` | POST | Generate digitization/plea PDF |
| `{contextPath}/template-configuration` | POST | Generate template-based PDF |
| `{contextPath}/ctc-applications` | POST | Generate CTC application PDF |
| `{contextPath}/ctc-certification` | POST | Generate CTC certification PDF |
| `{contextPath}/dristi-pdf` | POST | Case bundle PDF |

**Supported `applicationType` values:** `application-submission-extension`, `application-generic`, `application-production-of-documents`, `application-bail-bond`, `application-case-transfer`, `application-case-withdrawal`, `application-reschedule-request`, `application-reschedule-hearing`, `application-for-checkout-request`, `application-case-settlement`, `application-delay-condonation`, `application-submit-bail-documents`, `application-profile-edit`, `application-witness-deposition`, `poa-claim-application`

### dristi-case-pdf

| Route | Method | Description |
|---|---|---|
| `/dristi-case-pdf/v1/generateCasePdf` | POST | Full case PDF |
| `/dristi-case-pdf/v1/fetchCaseComplaintPdf` | POST | Case complaint section PDF |
| `/dristi-case-pdf/combine-documents` | POST | Merge PDF/image files (multipart) |

### pdf-service

| Route | Method | Description |
|---|---|---|
| `/pdf-service/v1/_create` | POST | Generate PDF and save to filestore |
| `/pdf-service/v1/_createnosave` | POST | Generate PDF without saving |
| `/pdf-service/v1/_search` | POST | Search saved PDFs |
| `/pdf-service/v1/_getUnrigesteredCodes` | POST | Get unregistered i18n codes |
| `/pdf-service/v1/_clearUnrigesteredCodes` | POST | Clear i18n code cache |
| `/pdf-service/v1/_getBulkPdfRecordsDetails` | POST | Get bulk PDF job status |
| `/pdf-service/v1/_deleteBulkPdfRecordsDetails` | POST | Clean up bulk PDF records |

---

## Caching

The `Request()` utility caches GET-like POST responses in `window.Digit.RequestCache`:

- **Cache key**: `METHOD.URL.base64(params).base64(body)`
- **Cache scope**: In-memory, cleared on page reload
- **Endpoints with caching enabled**: `searchApplication`, `searchOrder`, `searchOrderNotifications`, `searchBailBond`, `searchTemplate`, `searchCTCApplication`, `searchTask`, `InboxSearch`, `pendingTaskSearch`, `searchReschedule`, and E-Post related endpoints

---

## API Monitoring

All API calls are tracked by the `apiMonitor` interceptor:

- Stores up to 1000 recent calls in memory
- Tracks timing, payload size, and response size
- Warns on requests > 2000ms or responses > 500 KB
- Redacts sensitive fields: `password`, `token`, `authToken`, `authorization`, `key`, `secret`
- Exportable as CSV or JSON for debugging
