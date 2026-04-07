/**
 * Style constants for the Certified True Copies apply flow.
 * Centralizes all Tailwind class strings to avoid repetition and make
 * global styling changes easy.
 */

import type { CSSProperties } from "react";

export const ctcStyles = {
  // ─── Layout ──────────────────────────────────────────────────────────────
  card: "w-full bg-white border border-[#E2E8F0] shadow-sm rounded-lg p-3 md:p-6 mt-6 lg:mx-auto",
  divider: "w-full h-[1px] bg-[#E2E8F0] mt-2",

  // ─── Info banner ─────────────────────────────────────────────────────────
  infoBox:
    "flex p-3 rounded-xl border-2 border-[#E2E8F0] bg-white gap-3 items-center w-full mb-2",
  infoText: "text-[#334155] font-roboto text-[20px]",

  // ─── Fields ──────────────────────────────────────────────────────────────
  fieldRow: "flex flex-col md:flex-row gap-6 lg:gap-8 w-full",
  fieldHalf: "flex flex-col w-full md:w-1/2 min-w-0",
  fieldFlex1: "flex flex-col flex-1",

  /** Applied to CustomDropdown / TextField `className` when disabled */
  fieldDisabled: "bg-[#D9D9D9] !text-[#3D3C3C] cursor-not-allowed border-[#3D3C3C]",
  fieldEnabled: "bg-white",

  fieldInputHeight: "!h-[52px]",

  // ─── Labels ──────────────────────────────────────────────────────────────
  label: "text-[#0A0A0A] text-lg",

  // ─── Upload / Select field ────────────────────────────────────────────────
  fileDisplayBox:
    "flex-1 border border-[#3D3C3C] rounded-md px-4 py-3.5 bg-white overflow-hidden text-lg whitespace-nowrap text-ellipsis flex items-center h-[50px]",
  fileButton:
    "flex items-center justify-center gap-2 px-8 py-3.5 border rounded-md font-semibold text-lg whitespace-nowrap transition-colors min-w-[130px] h-[50px] border-[#007E7E] text-[#007E7E] hover:bg-[#F0FDFA]",
  fileHint: "text-[16px] text-[#3D3C3C] mt-1",

  // ─── Document tags grid ───────────────────────────────────────────────────
  docTagGrid: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3",
  docTag:
    "flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-[#F8FAFC]",
  docTagText: "text-lg text-[#334155] font-medium truncate",
  docTagRemove:
    "flex-shrink-0 text-[#64748B] hover:text-[#334155] transition-colors",

  // ─── Page wrapper ─────────────────────────────────────────────────────────
  page: "min-h-screen bg-white py-12 px-6 sm:px-10 lg:px-16 font-roboto",

  // ─── Page heading (Libre Baskerville, responsive clamp) ──────────────────
  pageHeadingMobile: "text-4xl text-center text-gray-800 font-libre mb-12",
  pageHeadingDesktop:
    "text-[clamp(38.68px,calc(38.68px+((60-38.68)*((100vw-1200px)/662))),60px)] leading-[1] text-center text-gray-800 font-libre mb-8",
  /** Inline style applied to the heading (cannot be a Tailwind class) */
  pageHeadingStyle: {
    color: "#3A3A3A",
    fontFamily: "Libre Baskerville",
    WebkitTextStrokeWidth: "0.5px",
  } as CSSProperties,

  // ─── Back button ─────────────────────────────────────────────────────────
  backButton:
    "flex items-center justify-center min-w-[50px] min-h-[50px] w-[50px] h-[50px] rounded-full border border-[#CBD5E1] text-[#F8FAFC] hover:bg-gray-100 absolute left-0 sm:left-4",

  // ─── Action-card row (landing page) ──────────────────────────────────────
  actionCardRow: "flex flex-col sm:flex-row gap-6 justify-center items-stretch",

  // ─── Action buttons row ───────────────────────────────────────────────────
  actionRow: "flex flex-col sm:flex-row justify-end items-center gap-4 mb-2",
  btnSecondary:
    "w-full md:w-auto px-16 py-3 border border-[#CBD5E1] rounded-md text-[#334155] font-medium bg-white hover:bg-gray-50 text-lg transition-colors",
  btnSecondaryDisabled: "bg-[#EEF2F6] text-[#94A3B8] cursor-not-allowed", 
  btnPrimary:
    "w-full md:w-auto px-20 py-3 rounded-md font-medium text-lg transition-colors text-white",
  btnPrimaryActive: "bg-[#007E7E] hover:bg-[#0e5d55]",
  btnPrimaryDisabled: "bg-[#969696] cursor-not-allowed",
  btnNextActive: "bg-[#0F766E] hover:bg-[#0e5d55]",
  btnNextDisabled: "bg-[#969696] cursor-not-allowed",

  // Mobile-specific button overrides (pre-search row only)
  btnMobileGrid: "grid grid-cols-2 gap-2 mb-2",
  btnDesktopRow: "flex justify-end gap-4 mb-2",
  btnMobileInner: "px-3 py-2 rounded-lg font-roboto font-medium",
  btnDesktopInner: "px-16 py-2 text-lg rounded-md font-roboto font-medium",

  // ─── SelectDocumentsModal ─────────────────────────────────────────────────
  modalOverlay:
    "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
  modalContainer:
    "bg-white rounded-lg w-full max-w-[80%] h-[85vh] max-h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-fadeIn",
  modalHeader:
    "flex justify-between items-center p-4 sm:p-6 border-b border-[#E8E8E8]",
  modalHeaderTitle: "text-2xl font-bold text-[#0A0A0A] font-roboto",
  modalCloseBtn: "text-gray-400 hover:text-gray-600 transition-colors p-1",
  modalBody: "flex flex-1 overflow-hidden flex-col md:flex-row",
  modalSidebar:
    "w-full md:w-[30%] lg:w-[30%] border-r border-[#E8E8E8] flex flex-col h-full bg-white",
  modalSidebarHeader: "p-4 border-b border-gray-50 flex-shrink-0",
  modalSidebarTitle: "text-lg font-bold text-[#0A0A0A] mb-3",
  modalSearchInput:
    "w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-[16px] focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 bg-gray-50/50",
  modalDocList: "flex-1 overflow-y-auto px-5 py-3 custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#f9fafb] [&::-webkit-scrollbar-thumb]:bg-[#c5c5c5] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#a8a8a8]",
  modalSection: "mb-3 border-b border-[#E8E8E8] pb-3 last:border-b-0",
  modalSectionBtn: "w-full flex justify-between items-center py-2 text-left hover:bg-gray-50 rounded-md transition-colors",
  modalSectionTitle: "text-lg font-bold text-[#0A0A0A]",
  modalDocItems: "flex flex-col gap-2 ml-2 mt-2 mb-2",
  modalDocLabel: "flex items-center gap-3 py-2 px-2 rounded-md transition-colors",
  modalDocLabelEnabled: "cursor-pointer group hover:bg-gray-50",
  modalDocLabelDisabled: "cursor-default",
  modalDocCheckbox:
    "w-4 h-4 rounded-sm border-[#CBD5E1] text-teal-600 focus:ring-teal-600 focus:ring-offset-0 cursor-pointer flex-shrink-0",
  modalDocText:
    "text-[17px] text-[#3D3C3C] group-hover:text-gray-900 transition-colors pt-[1px] leading-snug",
  modalPreviewArea:
    "flex-1 bg-[#FAFAFA] flex items-center justify-center p-6 m-4 md:m-0 h-full",
  modalPreviewText: "text-[#64748B] text-xl leading-relaxed text-center max-w-[80%]",
  modalFooter:
    "p-4 sm:p-5 border-t border-[#E8E8E8] flex justify-end gap-3 bg-white flex-shrink-0",
  modalBtnSecondary:
    "px-6 py-2 border border-gray-200 hover:border-gray-300 rounded text-gray-700 hover:bg-gray-50 text-lg font-semibold transition-colors min-w-[120px]",
  modalBtnPrimary:
    "px-6 py-2 rounded text-white text-lg font-semibold transition-colors min-w-[120px]",
  modalBtnPrimaryActive: "bg-[#0F766E] hover:bg-[#0e5d55]",
  modalBtnPrimaryDisabled: "bg-[#94A3B8] cursor-not-allowed",

  // ─── CaseSummaryRow ───────────────────────────────────────────────────────
  caseRow:
    "w-full bg-[#F7F5F3] rounded-xl border border-[#F7F5F3] mt-2 p-4 sm:p-6 sm:px-8",
  caseRowInner:
    "flex flex-col sm:flex-row w-full gap-4 sm:gap-0 sm:justify-between items-start sm:items-stretch",
  caseCellLabel: "text-[#94A3B8] text-[16px] tracking-wide",
  caseCellValue: "text-[#0F172A] font-semibold text-[22px]",
  caseDivider: "hidden sm:block w-[2px] self-stretch bg-[#E2E8F0]",

  // ─── OTPModal ─────────────────────────────────────────────────────────────
  otpOverlay:
    "fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm",
  otpContainer:
    "bg-white rounded-xl w-full max-w-[500px] shadow-2xl relative animate-fadeIn",
  otpHeader:
    "flex justify-between items-center px-6 py-4 mb-6 border-b border-[#E2E8F0]",
  otpTitle: "text-2xl font-bold text-[#0F172A] font-roboto",
  otpCloseBtn: "text-gray-400 hover:text-gray-600 transition-colors",
  otpBody: "pt-6 pb-8 font-roboto px-6",
  otpLabel: "block text-xl font-medium text-[#334155] mb-2",
  otpInput:
    "w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-md p-3 text-xl focus:outline-none focus:ring-1 focus:ring-teal-600 focus:border-teal-600 text-[#64748B]",
  otpFooter: "flex justify-end gap-3 font-roboto px-6 pb-6",
  otpBtnBack:
    "px-6 py-2.5 border border-[#CBD5E1] rounded-md text-[#334155] hover:bg-gray-50 text-lg font-bold transition-colors",
  otpBtnSubmit:
    "px-8 py-2.5 text-white rounded-md text-lg font-bold transition-colors",
  otpBtnSubmitActive: "bg-[#0F766E] hover:bg-teal-800",
  otpBtnSubmitDisabled: "bg-[#8E8E8E] cursor-not-allowed",

  // ─── AddSignatureModal ────────────────────────────────────────────────────
  sigModalBody: "px-6 py-4 font-roboto",
  sigModalLabel: "block text-[22px] font-bold text-[#3D3C3C]",
  sigActionRow: "flex flex-wrap items-center gap-8 mt-2",
  sigEsignBtn:
    "px-5 py-2.5 border border-[#007E7E] text-[#007E7E] bg-white rounded flex items-center justify-center font-bold text-lg hover:bg-teal-50 transition-colors",
  sigUploadLink:
    "flex items-center gap-2 text-[#007E7E] font-bold text-lg hover:underline hover:text-[#0d5d56] transition-colors",
  sigDownloadHint: "text-lg mt-2",
  sigDownloadLink: "text-[#007E7E] underline hover:text-[#0d5d56]",
  sigBadgeSigned:
    "bg-[#D1FAE5] text-[#00703C] px-3 py-1 rounded-full text-lg inline-flex items-center w-max",
  sigFooterBtnBack:
    "px-6 py-2.5 border border-[#007E7E] rounded-md text-[#007E7E] hover:bg-teal-50 text-lg font-bold transition-colors",
  sigFooterBtnProceed: "px-6 py-2.5 rounded-md text-white text-lg font-bold transition-colors",
  sigFooterBtnProceedActive: "bg-[#0F766E] hover:bg-[#0e5d55]",
  sigFooterBtnProceedDisabled: "bg-[#9CA3AF] cursor-not-allowed",

  // ─── PaymentModal ─────────────────────────────────────────────────────────
  payBody: "p-6 font-roboto flex flex-col gap-6",
  payInfoBanner: "bg-[#E0F2FE] border border-[#E2E8F0] rounded-md p-2 flex items-start gap-3",
  payInfoIconWrap: "mt-0.5 text-[#3B82F6]",
  payInfoText: "text-[#334155] text-[15px] leading-relaxed",
  payFeeList: "flex flex-col gap-3 text-lg",
  payFeeRow: "flex justify-between text-[#77787B]",
  payFeeValue: "text-[#0A0A0A]",
  payDivider: "w-full h-[1px] bg-[#BBBBBD] my-1",
  payTotalRow: "flex justify-between font-bold text-[#0A0A0A]",
  payBtnSkip:
    "px-6 py-2 border border-[#007E7E] rounded text-[#007E7E] hover:bg-[#F0FDFA] text-lg font-bold transition-colors",
  payBtnPay:
    "px-6 py-2 bg-[#007E7E] rounded text-white text-lg font-bold hover:bg-[#0e5d55] transition-colors",

  // ─── SuccessModal ─────────────────────────────────────────────────────────
  successOverlay:
    "fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
  successModalCard:
    "bg-white rounded-xl w-full max-w-[50%] shadow-2xl flex flex-col p-8 sm:p-10 animate-fadeIn",
  successBanner:
    "bg-[#00703C] px-6 sm:px-8 py-10 flex flex-col items-center justify-center text-white text-center",
  successBannerTitle: "text-3xl sm:text-4xl font-bold mb-5",
  successCheckCircle:
    "w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#047857]",
  successBody: "font-roboto flex flex-col mb-12 gap-8",
  successDetailCard: "bg-[#F7F5F3] rounded-lg p-6 lg:px-8 flex flex-col gap-3",
  successDetailRow: "flex justify-between items-center text-lg",
  successDetailLabel: "text-[#3D3C3C]",
  successDetailValue: "font-bold text-[#0A0A0A] flex items-center gap-2",
  successCopyBtn:
    "flex items-center gap-1 text-[#007E7E] font-normal hover:text-[#0d5d56] transition-colors ml-4",
  successBtnRow: "grid grid-cols-1 sm:grid-cols-2 gap-6 w-full",
  successBtnOutline:
    "flex items-center justify-center gap-2 px-4 py-3 border border-[#007E7E] rounded-md text-[#007E7E] hover:bg-[#F0FDFA] text-lg font-bold transition-colors w-full text-center",
  successBtnFill:
    "flex items-center justify-center px-4 py-3 bg-[#007E7E] rounded-md text-white hover:bg-[#0e5d55] text-lg font-bold transition-colors w-full text-center",

  // ─── Stepper ──────────────────────────────────────────────────────────────
  stepperWrap: "flex items-center justify-center w-full my-6 sm:my-8 flex-wrap gap-y-3",
  stepperCircleBase: "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-lg sm:text-2xl font-medium shrink-0",
  stepperCircleCompleted: "bg-[#16A34A] text-white",
  stepperCircleActive: "bg-[#2563EB] text-white",
  stepperCircleDefault: "bg-[#E2E8F0] text-[#334155]",
  stepperLabelBase: "text-base sm:text-2xl font-medium",
  stepperLabelCompleted: "text-[#16A34A]",
  stepperLabelActive: "text-[#2563EB]",
  stepperLabelDefault: "text-[#334155]",
  stepperConnector: "w-6 sm:w-16 h-[2px] bg-[#E2E8F0] mx-1 sm:mx-3 shrink-0",
  stepperItem: "flex items-center gap-2 sm:gap-4",

  // ─── VerifyMobileNumber ───────────────────────────────────────────────────
  verifyWrap: "flex flex-col gap-1 flex-1",
  verifyLabel: "text-[#0A0A0A] text-lg flex items-center",
  verifyInputWrap: "relative",
  verifyPrefix:
    "absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-[#3D3C3C] pointer-events-none select-none",
  verifyDivider:
    "absolute left-[52px] top-1/2 -translate-y-1/2 h-5 w-[1px] bg-[#CBD5E1] pointer-events-none",
  verifyInput:
    "w-full pl-[62px] pr-32 py-3.5 border border-[#3D3C3C] placeholder:!text-xl rounded-md focus:outline-none text-[16px]",
  verifyInputActive: "text-[#3D3C3C] bg-white",
  verifyInputDisabled: "bg-[#F8FAFC] text-gray-500",
  verifyBtnWrap: "absolute right-1.5 top-1.5 bottom-1.5 flex items-center",
  verifyBadge:
    "flex items-center gap-1.5 px-4 h-full text-[#16A34A] text-[16px] font-medium bg-green-50 rounded border border-green-200",
  verifyBtn:
    "px-12 h-full text-[16px] font-medium rounded transition-colors",
  verifyBtnActive:
    "bg-[#EFF6FF] text-[#334155] border border-[#CBD5E1] hover:bg-[#DBEAFE]",
  verifyBtnDisabled: "bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed",
};

/** Text labels used in the apply flow */
export const ctcText = {
  step1: {
    infoParty: "CTC_STEP1_INFO_PARTY",
    infoPhone: "CTC_STEP1_INFO_PHONE",
    selectCourt: "CTC_STEP1_SELECT_COURT",
    caseNumber: "CTC_STEP1_CASE_NUMBER",
    caseNumberPlaceholder: "CTC_STEP1_CASE_NUMBER_PLACEHOLDER",
    partyQuestion: "CTC_STEP1_PARTY_QUESTION",
    name: "CTC_STEP1_NAME",
    namePlaceholder: "CTC_STEP1_NAME_PLACEHOLDER",
    party: "CTC_STEP1_PARTY",
    partyPlaceholder: "CTC_STEP1_PARTY_PLACEHOLDER",
    clear: "CTC_STEP1_CLEAR",
    searchCase: "CTC_STEP1_SEARCH_CASE",
    verifyProceed: "CTC_STEP1_VERIFY_PROCEED",
  },
  step2: {
    uploadLabel: "CTC_STEP2_UPLOAD_LABEL",
    noFileSelected: "CTC_STEP2_NO_FILE_SELECTED",
    fileHint: "CTC_STEP2_FILE_HINT",
    upload: "CTC_STEP2_UPLOAD",
    reUpload: "CTC_STEP2_RE_UPLOAD",
    docSelectLabel: "CTC_STEP2_DOC_SELECT_LABEL",
    noDocsSelected: "CTC_STEP2_NO_DOCS_SELECTED",
    select: "CTC_STEP2_SELECT",
    goBack: "CTC_STEP2_GO_BACK",
    next: "CTC_STEP2_NEXT",
    affidavitUploadFailed: "CTC_STEP2_AFFIDAVIT_UPLOAD_FAILED",
    affidavitIdFailed: "CTC_STEP2_AFFIDAVIT_ID_FAILED",
    saveFailed: "CTC_STEP2_SAVE_FAILED",
  },
  // ─── Page-level text ─────────────────────────────────────────────────────
  landing: {
    pageTitle: "CTC_LANDING_PAGE_TITLE",
    applyTitle: "CTC_LANDING_APPLY_TITLE",
    applyDescription: "CTC_LANDING_APPLY_DESCRIPTION",
    applyButton: "CTC_LANDING_APPLY_BUTTON",
    trackTitle: "CTC_LANDING_TRACK_TITLE",
    trackDescription: "CTC_LANDING_TRACK_DESCRIPTION",
    trackButton: "CTC_LANDING_TRACK_BUTTON",
  },
  apply: {
    pageTitle: "CTC_APPLY_PAGE_TITLE",
  },
  viewStatus:{
    pageTitle: "VIEW_STATUS_OF_APPLICATION",
    clearButtonLabel: "CTC_CLEAR_SEARCH",
    searchButtonLabel: "CTC_VIEW_APPLICATION",
    tokenMissing: "CTC_VIEW_STATUS_TOKEN_MISSING",
    fetchFailed: "CTC_VIEW_STATUS_FETCH_FAILED",
    searchPlaceholder: "CTC_VIEW_STATUS_SEARCH_PLACEHOLDER",
    criminal: "CTC_VIEW_STATUS_CRIMINAL",
    niaS138: "CTC_VIEW_STATUS_NIA_S138",
    unknownStatus: "UNKNOWN_STATUS",
    rejectionReason: "CTC_REASON_FOR_REJECTION",
  },
  step3: {
    goBack: "CTC_STEP3_GO_BACK",
    eSign: "CTC_STEP3_ESIGN",
    goBackFailed: "CTC_STEP3_GO_BACK_FAILED",
    saveSignatureFailed: "CTC_STEP3_SAVE_SIGNATURE_FAILED",
    paymentIncomplete: "CTC_STEP3_PAYMENT_INCOMPLETE",
    paymentFlowFailed: "CTC_STEP3_PAYMENT_FLOW_FAILED",
    waitDocumentGeneration: "CTC_STEP3_WAIT_DOCUMENT_GENERATION",
    uploadFailed: "CTC_STEP3_UPLOAD_FAILED",
    missingFileStoreId: "CTC_STEP3_MISSING_FILE_STORE_ID",
    uploadSignDocsFailed: "CTC_STEP3_UPLOAD_SIGN_DOCS_FAILED",
    generatingDocument: "CTC_STEP3_GENERATING_DOCUMENT",
    documentPreviewUnavailable: "CTC_STEP3_DOCUMENT_PREVIEW_UNAVAILABLE",
    loadPreviewFailed: "CTC_STEP3_LOAD_PREVIEW_FAILED",
    uploading: "CTC_STEP3_UPLOADING",
  },
  // ─── SelectDocumentsModal ─────────────────────────────────────────────────
  selectDocModal: {
    title: "CTC_SELECT_DOC_TITLE",
    sidebarTitle: "CTC_SELECT_DOC_SIDEBAR_TITLE",
    searchPlaceholder: "CTC_SELECT_DOC_SEARCH_PLACEHOLDER",
    previewText: "CTC_SELECT_DOC_PREVIEW_TEXT",
    selectADocumentToPreview: "SELECT_A_DOCUMENT_TO_PREVIEW",
    goBack: "CTC_SELECT_DOC_GO_BACK",
    selectDocBtn: "CTC_SELECT_DOC_BTN",
  },
  // ─── CaseSummaryRow ───────────────────────────────────────────────────────
  caseSummary: {
    caseNameLabel: "CTC_CASE_SUMMARY_CASE_NAME",
    caseNumberLabel: "CTC_CASE_SUMMARY_CASE_NUMBER",
    cnrNumberLabel: "CTC_CASE_SUMMARY_CNR_NUMBER",
    filingDateLabel: "CTC_CASE_SUMMARY_FILING_DATE",
    caseTypeLabel: "CTC_CASE_SUMMARY_CASE_TYPE",
  },
  // ─── AddSignatureModal ────────────────────────────────────────────────────
  addSig: {
    title: "CTC_ADD_SIG_TITLE",
    yourSignature: "CTC_ADD_SIG_YOUR_SIGNATURE",
    eSignBtn: "CTC_ADD_SIG_ESIGN_BTN",
    uploadLink: "CTC_ADD_SIG_UPLOAD_LINK",
    downloadHint: "CTC_ADD_SIG_DOWNLOAD_HINT",
    downloadLinkText: "CTC_ADD_SIG_DOWNLOAD_LINK_TEXT",
    signedBadge: "CTC_ADD_SIG_SIGNED_BADGE",
    backBtn: "CTC_ADD_SIG_BACK_BTN",
    proceedBtn: "CTC_ADD_SIG_PROCEED_BTN",
    esignRequestFailed: "CTC_ADD_SIG_ESIGN_REQUEST_FAILED",
    somethingWentWrong: "CTC_ADD_SIG_SOMETHING_WENT_WRONG",
    fileUploadFailed: "CTC_ADD_SIG_FILE_UPLOAD_FAILED",
    missingFileStoreId: "CTC_ADD_SIG_MISSING_FILE_STORE_ID",
    uploadSignedCopyFailed: "CTC_ADD_SIG_UPLOAD_SIGNED_COPY_FAILED",
    loading: "CTC_ADD_SIG_LOADING",
    processing: "CTC_ADD_SIG_PROCESSING",
    uploading: "CTC_ADD_SIG_UPLOADING",
  },
  // ─── PaymentModal ─────────────────────────────────────────────────────────
  payment: {
    title: "CTC_PAYMENT_TITLE",
    infoBanner: "CTC_PAYMENT_INFO_BANNER",
    amountDue: "CTC_PAYMENT_AMOUNT_DUE",
    amountDueValue: "CTC_PAYMENT_AMOUNT_DUE_VALUE",
    courtFees: "CTC_PAYMENT_COURT_FEES",
    courtFeesValue: "CTC_PAYMENT_COURT_FEES_VALUE",
    advocateFees: "CTC_PAYMENT_ADVOCATE_FEES",
    advocateFeesValue: "CTC_PAYMENT_ADVOCATE_FEES_VALUE",
    totalFees: "CTC_PAYMENT_TOTAL_FEES",
    totalFeesValue: "CTC_PAYMENT_TOTAL_FEES_VALUE",
    skip: "CTC_PAYMENT_SKIP",
    makePayment: "CTC_PAYMENT_MAKE_PAYMENT",
    fetchBreakdownFailed: "CTC_PAYMENT_FETCH_BREAKDOWN_FAILED",
    processing: "CTC_PAYMENT_PROCESSING",
    noBreakdown: "CTC_PAYMENT_NO_BREAKDOWN",
  },
  // ─── SuccessModal ─────────────────────────────────────────────────────────
  success: {
    banner: "CTC_SUCCESS_BANNER",
    submissionDate: "CTC_SUCCESS_SUBMISSION_DATE",
    submissionId: "CTC_SUCCESS_SUBMISSION_ID",
    copy: "CTC_SUCCESS_COPY",
    copied: "CTC_SUCCESS_COPIED",
    download: "CTC_SUCCESS_DOWNLOAD",
    close: "CTC_SUCCESS_CLOSE",
    viewStatus: "CTC_SUCCESS_VIEW_STATUS",
  },
  // ─── VerifyMobileNumber ───────────────────────────────────────────────────
  verifyPhone: {
    label: "CTC_VERIFY_PHONE_LABEL",
    verified: "CTC_VERIFY_PHONE_VERIFIED",
    verify: "CTC_VERIFY_PHONE_VERIFY",
    userNotRegistered: "CTC_VERIFY_PHONE_USER_NOT_REGISTERED",
    failedToSendOtp: "CTC_VERIFY_PHONE_FAILED_TO_SEND_OTP",
    inputPlaceholder: "CTC_VERIFY_PHONE_INPUT_PLACEHOLDER",
    sendingOtp: "CTC_VERIFY_PHONE_SENDING_OTP",
  },
  // ─── OTPModal ─────────────────────────────────────────────────────────────
  otpModal: {
    title: "CTC_OTP_TITLE",
    inputLabel: "CTC_OTP_INPUT_LABEL",
    inputPlaceholder: "CTC_OTP_INPUT_PLACEHOLDER",
    goBack: "CTC_OTP_GO_BACK",
    verify: "CTC_OTP_VERIFY",
    verificationFailed: "CTC_OTP_VERIFICATION_FAILED",
    validationFailed: "CTC_OTP_VALIDATION_FAILED",
    verifying: "CTC_OTP_VERIFYING",
  },
  viewCTCStatusTable: {
    header:"MY_APPLICATIONS",
    viewText: "CLICK_TO_VIEW"
  },
  // ─── ViewDocumentsModal (Issue Document column) ───────────────────────────
  viewDocs: {
    title: "CTC_VIEW_DOCS_TITLE",
    downloadSelected: "CTC_VIEW_DOCS_DOWNLOAD_SELECTED",
    statusApproved: "CTC_VIEW_DOCS_STATUS_APPROVED",
    statusRejected: "CTC_VIEW_DOCS_STATUS_REJECTED",
    statusPending: "CTC_VIEW_DOCS_STATUS_PENDING",
    noPreview: "CTC_VIEW_DOCS_NO_PREVIEW",
  },
};
