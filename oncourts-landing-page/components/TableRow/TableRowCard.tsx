import React from "react";

interface TableRowCardProps {
  t: (key: string) => string;
  caseIndex: number;
  data: Record<string, string | JSX.Element>;
  onActionClick?: () => void;
}

const TableRowCard: React.FC<TableRowCardProps> = ({
  t,
  caseIndex,
  data,
  onActionClick,
}) => {
  const entries = Object.entries(data);

  const caseTitle = entries.find(([key]) => key === "CASE_TITLE");

  return (
    <div className="font-libre rounded-md border border-slate-200 bg-white p-5 mb-6 shadow-sm w-full">
      {caseTitle && (
        <div
          key={"CASE_TITLE"}
          className="pb-2 mb-4 flex gap-2 font-semibold text-[18px] text-[#0F172A] italic text-left border-b"
        >
          <span>{`${caseIndex + 1}.`}</span>
          <span>{caseTitle[1]}</span>
        </div>
      )}

      <div className="grid gap-4">
        {entries
          .filter(([key]) => key !== "CASE_TITLE")
          .map(([key, value]) => (
            <div key={key} className="grid grid-cols-2">
              <div className="font-semibold text-[16px] text-left text-[#0F172A]">
                {t(key)}
              </div>
              <div className="font-roboto bg-white text-right text-[14px] text-[#334155] break-words">
                {key === "ACTION" ? (
                  <button
                    className="p-2 font-[Inter] font-medium rounded-md border-2 hover:text-teal-900"
                    onClick={() => {
                      if (onActionClick) {
                        onActionClick();
                      }
                    }}
                  >
                    {typeof value === "string" ? t(value) : value}
                  </button>
                ) : typeof value === "string" ? (
                  <span className="font-base">{t(value)}</span>
                ) : (
                  value
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default TableRowCard;
