const cloneDeep = require("lodash.clonedeep");
const { search_mdms, search_case_v2, search_message } = require("../../api");
const { logger } = require("../../logger");
const { processTitlePageSection } = require("./processTitlePageSection");
const { processComplaintSection } = require("./processComplaintSection");
const { processFilingsSection } = require("./processFilingsSection");
const { processAffidavitSection } = require("./processAffidavitSection");
const { processVakalatSection } = require("./processVakalatSection");
const {
  processPendingApplicationsSection,
} = require("./processPendingApplicationsSection");
const {
  processMandatorySubmissions,
} = require("./processMandatorySubmissions");
const { processAdditionalFilings } = require("./processAdditionalFilings");
const { processComplainantEvidence } = require("./processComplainantEvidence");
const { processAccusedEvidence } = require("./processAccusedEvidence");
const { processCourtEvidence } = require("./processCourtEvidence");
const {
  processDisposedApplications,
} = require("./processDisposedApplications");
const { processBailDocuments } = require("./processBailDocuments");
const { processTaskProcesses } = require("./processTaskProcesses");
const { processPaymentReceipts } = require("./processPaymentReceipts");
const { processOrders } = require("./processOrders");
const { processExamination } = require("./processExamination");
const { processOthersSection } = require("./processOthersSection");

// Maps backend Java class simple names (used as sectionKey in CaseBundleSectionOrder MDMS)
// to the section name strings used in indexCopy.sections
const SECTION_KEY_MAP = {
  ComplaintSection: "complaint",
  PendingApplicationsSection: "pendingapplications",
  InitialFilingSection: "filings",
  AffidavitSection: "affidavit",
  VakalatnamaSection: "vakalat",
  AdditionalFilingsSection: "additionalfilings",
  MandatorySubmissionsSection: "mandatorysubmissions",
  ComplainantEvidenceSection: "complainantevidence",
  AccusedEvidenceSection: "accusedevidence",
  CourtEvidenceSection: "courtevidence",
  DisposedApplicationsSection: "applications",
  ProcessesSection: "processes",
  PaymentReceiptSection: "paymentreceipts",
  ExaminationAndPleaSection: "digitalizedDocuments",
  OrdersSection: "orders",
  OthersSection: "others",
};

/**
 * Reorders and filters indexCopy.sections based on CaseBundleSectionOrder MDMS config.
 * Titlepage always stays first. Sections not present in MDMS retain their relative order
 * at the end. Sections marked isActive=false in MDMS are removed.
 */
function applyMdmsSectionOrder(indexCopy, sectionOrderConfig) {
  if (!sectionOrderConfig || sectionOrderConfig.length === 0) return;

  const orderMap = {};
  const inactiveSections = new Set();

  for (const entry of sectionOrderConfig) {
    logger.info(`Processing MDMS section order entry: ${JSON.stringify(entry)} , entry.isActive: ${entry.isActive}`);
    const sectionName = SECTION_KEY_MAP[entry.sectionKey];
    if (!sectionName) continue;
    orderMap[sectionName] = parseInt(entry.order, 10);
    if (!entry.isActive) {
      inactiveSections.add(sectionName);
    }
  }

  indexCopy.sections = indexCopy.sections.filter(
    (s) => !inactiveSections.has(s.name)
  );

  // Re-add sections that became active in MDMS but were previously removed from the stored index
  const existingNames = new Set(indexCopy.sections.map((s) => s.name));
  for (const entry of sectionOrderConfig) {
    if (entry.isActive) {
      const sectionName = SECTION_KEY_MAP[entry.sectionKey];
      if (sectionName && !existingNames.has(sectionName)) {
        indexCopy.sections.push({ name: sectionName, lineItems: [] });
        existingNames.add(sectionName);
      }
    }
  }

  const titlepage = indexCopy.sections.find((s) => s.name === "titlepage");
  const rest = indexCopy.sections.filter((s) => s.name !== "titlepage");

  rest.sort((a, b) => {
    const orderA = orderMap[a.name] !== undefined ? orderMap[a.name] : Number.MAX_SAFE_INTEGER;
    const orderB = orderMap[b.name] !== undefined ? orderMap[b.name] : Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });

  indexCopy.sections = titlepage ? [titlepage, ...rest] : rest;
}

async function processPendingAdmissionCase({
  tenantId,
  caseId,
  index,
  requestInfo,
  TEMP_FILES_DIR,
}) {
  const indexCopy = cloneDeep(index);

  const [caseBundleMaster, sectionOrderConfig, caseResponse] = await Promise.all([
    search_mdms(null, "CaseManagement.case_bundle_master", tenantId, requestInfo)
      .then((mdmsRes) => mdmsRes.data.mdms.filter((x) => x.isActive).map((x) => x.data)),
    search_mdms(null, "CaseManagement.CaseBundleSectionOrder", tenantId, requestInfo)
      .then((mdmsRes) => mdmsRes.data.mdms.map((x) => ({ ...x.data })))
      .catch((err) => {
        logger.warn("Failed to fetch CaseBundleSectionOrder from MDMS, using default section order:", err.message);
        return [];
      }),
    search_case_v2([{ caseId }], tenantId, requestInfo),
  ]);

  logger.info("recd case response", JSON.stringify(caseResponse?.data));
  const courtCase = caseResponse?.data?.criteria[0]?.responseList[0];

  applyMdmsSectionOrder(indexCopy, sectionOrderConfig);

  const resMessage = await search_message(
    tenantId,
    "rainmaker-case,rainmaker-orders,rainmaker-submissions,rainmaker-hearings,rainmaker-home,rainmaker-common",
    "en_IN",
    requestInfo
  );

  const messages = resMessage?.data?.messages || [];
  const messagesMap =
    messages?.length > 0
      ? Object.fromEntries(messages.map(({ code, message }) => [code, message]))
      : {};

  // Create an array of promises for all processing functions
  const complaintPromises = [
    processTitlePageSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processComplaintSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processPendingApplicationsSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
  ];

  await Promise.all(complaintPromises);

  const filingPromises = [
    processFilingsSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processAffidavitSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processVakalatSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
    processAdditionalFilings(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
  ];

  await Promise.all(filingPromises);

  const processingPromises = [
    processMandatorySubmissions(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
    processComplainantEvidence(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
    processAccusedEvidence(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
    processCourtEvidence(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processDisposedApplications(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
  ];

  await Promise.all(processingPromises);

  const finalPromises = [
    processBailDocuments(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy,
      messagesMap
    ),
    processTaskProcesses(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
  ];

  await Promise.all(finalPromises);

  const orderPromises = [
    processPaymentReceipts(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processExamination(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
    processOrders(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
  ];

  await Promise.all(orderPromises);

  const othersPromises = [
    processOthersSection(
      courtCase,
      caseBundleMaster,
      tenantId,
      requestInfo,
      TEMP_FILES_DIR,
      indexCopy
    ),
  ];

  await Promise.all(othersPromises);

  indexCopy.isRegistered = true;
  indexCopy.contentLastModified = Date.now();

  return indexCopy;
}

module.exports = { processPendingAdmissionCase };
