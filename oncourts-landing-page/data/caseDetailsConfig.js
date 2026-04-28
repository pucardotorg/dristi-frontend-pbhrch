export const caseDetailsConfig = [
  { label: "CNR", key: "cnrNumber" },
  { label: "Petitioner", key: "complainant" },
  { label: "Petitioner Advocate", key: "advocateComplainant" },
  { label: "Filing Number", key: "filingNumber" },
  { label: "Registration No.", key: "registrationNumber" },
  { label: "Case Type", key: "caseType" },
  { label: "Status", key: "status" },
  { label: "Stage / Type of Disp.", key: "subStage" },
  { label: "Judge", key: "judgeName" },
  { label: "Respondent", key: "respondent" },
  { label: "Respondent Advocate", key: "advocateRespondent" },
  { label: "Filing Date", key: "filingDate", isDate: true },
  { label: "Registration Date", key: "registrationDate", isDate: true },
  { label: "Next Hearing Date", key: "nextHearingDate", isDate: true },
  {
    label: "Act",
    customRender: (data) => {
      const sections = data.statutesAndSections?.[0]?.sections ?? [];
      return sections.length ? sections.join(", ") : "-";
    },
  },
];
