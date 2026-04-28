import React from "react";
import { ctcStyles, ctcText } from "../../styles/certifiedCopyStyles";
import type { CaseResult } from "../../types/case/models";
import { formatDate } from "../../utils/formatDate";

interface CaseSummaryRowProps {
  t: (key: string) => string;
  caseResult?: CaseResult | null;
}

const CaseSummaryRow: React.FC<CaseSummaryRowProps> = ({ t, caseResult }) => {
  const cells = [
    {
      label: ctcText.caseSummary.caseNameLabel,
      value: caseResult?.caseTitle || "—",
    },
    {
      label: ctcText.caseSummary.caseNumberLabel,
      value:
        caseResult?.stNumber ||
        caseResult?.cmpNumber ||
        caseResult?.filingNumber ||
        "—",
    },
    {
      label: ctcText.caseSummary.cnrNumberLabel,
      value: caseResult?.cnrNumber || "—",
    },
    {
      label: ctcText.caseSummary.filingDateLabel,
      value: formatDate(caseResult?.filingDate, "dd-MM-yyyy") || "—",
    },
    {
      label: ctcText.caseSummary.caseTypeLabel,
      value: t(ctcText.viewStatus.niaS138) || "—",
    },
  ];

  return (
    <div className={ctcStyles.caseRow}>
      <div className={ctcStyles.caseRowInner}>
        {cells.map((cell, i) => (
          <React.Fragment key={cell.label}>
            {i > 0 && <div className={ctcStyles.caseDivider} />}
            <div
              className={`flex flex-col gap-1 w-full sm:flex-1 ${
                i === 0
                  ? "sm:pr-4"
                  : i === cells.length - 1
                    ? "sm:pl-4"
                    : "sm:px-4"
              }`}
            >
              <span className={ctcStyles.caseCellLabel}>{t(cell.label)}</span>
              <span className={ctcStyles.caseCellValue}>{cell.value}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CaseSummaryRow;
