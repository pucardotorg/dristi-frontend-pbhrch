# Project Context

## Project Overview

**DRISTI** (Digital Revolution for Integrated and Seamless Transformation of Justice) is a digital court case management platform built for the state of Kerala, India. It is part of the **DIGIT eGovernance Platform** — India's largest open-source platform for government services.

The platform digitizes the entire lifecycle of a court case — from initial filing by a citizen/advocate, through scrutiny by court staff, admission hearings, evidence management, order creation, and summons/warrant delivery — replacing paper-based processes with a fully online workflow.

---

## Problem Being Solved

Traditional court systems in India rely heavily on paper documents, manual processes, and physical appearances. DRISTI addresses:

- **Case Filing Delays** — Citizens and advocates can file cases online without visiting the court
- **Hearing Management** — Judges, staff, and lawyers get a unified digital interface for scheduling and conducting hearings
- **Order/Judgment Workflow** — Court orders are drafted, digitally signed (e-Sign), and published through the system
- **Summons & Warrants** — Automated dispatch via e-Post, SMS, and WhatsApp
- **Document Management** — Evidence, bail bonds, witness depositions, and case bundles are managed and stored digitally
- **Payment Integration** — Court fees are calculated, collected, and receipted through integrated treasury/SBI payment gateways

---

## Target Users

| User Type | Description |
|---|---|
| **Citizens** | Parties in a case — complainants, accused, witnesses — who file cases and track progress |
| **Advocates** | Legal professionals who file and manage cases on behalf of clients |
| **Court Staff (Employees)** | Judges, clerks, and bench staff who scrutinize, admit, schedule, and manage cases |
| **Admin / Workbench Users** | Government administrators managing master data, localization, and HRMS |

---

## Key Features

### For Citizens / Advocates
- Online case registration and filing
- Access code-based case joining for parties
- Payment of court fees through e-treasury / SBI
- E-sign for bail bonds, applications, and vakalath
- SMS-based unauthenticated signing flows (bail bond, witness deposition, digitized documents)
- Cause list and hearing schedule visibility

### For Court Employees (Judges / Staff)
- Case scrutiny and admission workflow
- Hearing calendar with bulk reschedule and adjournment
- In-hearing management with transcription support
- Order creation, drafting, and digital signing
- Summons and warrant generation with e-Post tracking
- Pending task dashboard with bulk document signing
- CTC (Certified True Copy) application processing
- Advocate diary and office management

### For System / Operations
- PDF generation for all court documents (orders, applications, bail bonds, cause lists, etc.)
- OCR-based document digitization
- API monitoring with performance tracking
- Kafka-based async PDF processing
- Multi-language support (i18n)

---

## High-Level Architecture Summary

The system is a **multi-workspace micro-frontend monorepo** composed of four top-level sub-projects:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DRISTI Frontend Monorepo                      │
├──────────────────────┬──────────────────────┬───────────────────┤
│  oncourts-landing-   │    oncourts-ui        │   workbench-ui    │
│  page (Next.js 15)   │  (React SPA, 7 modules│  (React SPA,      │
│  Public website      │   Yarn Workspaces)    │   Admin tools)    │
├──────────────────────┴──────────────────────┴───────────────────┤
│              ui-integration-services (Node.js BFF)              │
│    dristi-pdf  |  dristi-case-pdf  |  pdf-service               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                 DIGIT Platform Backend APIs
         (Case, Hearing, Order, Payment, Evidence,
          Advocate, Individual, Scheduler, e-Sign, OCR…)
```

The `oncourts-ui` is the primary application — a modular React SPA where each court function (hearings, orders, submissions, etc.) is an independently packaged Yarn workspace module that self-registers into a shared DIGIT runtime (`window.Digit`).

---

## Business Context

- Built on the **DIGIT open-source platform** by eGovernments Foundation
- Deployed for **Kerala state courts** (iCOPS integration for jurisdiction lookup)
- Integrates with:
  - **e-Treasury** (Kerala state treasury payment gateway)
  - **SBI Payment Gateway**
  - **e-Post** (India Post for physical delivery of summons/warrants)
  - **e-Sign** (Aadhaar-based digital signing)
  - **OCR Service** for document digitization
  - **Kafka** for async event processing
  - **PostgreSQL** for persistence in PDF services
- Production endpoint: `demo.pucar.org`
- Docker images published to Docker Hub (`venkatramireddyb/oncourts-website`, `venkatramireddyb/workbench-ui`)
