import React from "react";
import BaseModal from "./BaseModal";
import { CtcApplication } from "../../types";
import DocViewWrapper from "./DocViewWrapper";
import { ctcText } from "../../styles/certifiedCopyStyles";

export interface TopInfoItem {
  label: string;
  value: React.ReactNode;
}

export interface FooterButton {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

interface ViewApplicationModalProps {
  t: (key: string) => string;
  isOpen: boolean;
  onClose: () => void;
  application: CtcApplication | null;
  topInfoColumns?: TopInfoItem[][];
  footerButtons?: FooterButton[];
  modalTitle: string;
  fileStoreId?: string;
  tenantId?: string;
  authToken?: string;
}

const ViewApplicationModal: React.FC<ViewApplicationModalProps> = ({
  t,
  isOpen,
  onClose,
  application,
  topInfoColumns,
  footerButtons,
  modalTitle,
  fileStoreId,
  tenantId,
  authToken,
}) => {
  if (!isOpen || !application) return null;

  const footer =
    footerButtons && footerButtons.length > 0 ? (
      <>
        {footerButtons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.onClick}
            disabled={btn.disabled}
            className={`px-6 py-2 rounded text-lg font-medium ${
              btn.variant === "primary"
                ? "bg-[#0F766E] text-white hover:bg-teal-700"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            } ${btn.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {btn.label}
          </button>
        ))}
      </>
    ) : null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      maxWidth="max-w-[70%]"
      footer={footer}
    >
      <div
        className="flex flex-col gap-4 p-6 bg-white overflow-y-auto"
        style={{ maxHeight: "70vh" }}
      >
        {/* Top Info Cards */}
        {topInfoColumns && topInfoColumns?.length > 0 && (
          <div className="bg-[#FAFAFA] border border-[#EEEEEE] rounded-lg p-5">
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${Math.min(topInfoColumns.length, 4)}, 1fr)`,
              }}
            >
              {topInfoColumns.map((col, colIdx) => (
                <div
                  key={colIdx}
                  /* h-full and flex-1 ensure all columns stretch to the height of the tallest one */
                  className={`flex flex-col justify-between min-w-0 ${
                    colIdx < topInfoColumns.length - 1
                      ? "border-r border-[#E0E0E0] pr-4"
                      : ""
                  }`}
                >
                  {col.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      /* This ensures that if Case Name is long, it doesn't overlap the bottom item */
                      className={itemIdx === 0 ? "mb-4" : ""}
                    >
                      <div className="flex flex-col min-w-0">
                        <span className="text-[#64748B] text-lg mb-1 truncate">
                          {item.label}
                        </span>
                        <span className="text-[#0F172A] text-xl font-semibold break-words whitespace-normal leading-tight">
                          {item.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rejection Reason */}
        {application.status === "REJECTED" && application.judgeComments && (
          <div className="p-4 rounded-md border border-red-200 bg-red-50">
            <h3 className="text-red-800 text-lg font-semibold mb-1">
              {t(ctcText.viewStatus.rejectionReason)}
            </h3>
            <p className="text-red-700 text-lg whitespace-pre-wrap">
              {application.judgeComments}
            </p>
          </div>
        )}

        {/* Handle Document Viewing */}
        {fileStoreId && (
          <div className="rounded-md border border-[#E0E0E0] w-full">
            <DocViewWrapper
              fileStoreId={fileStoreId}
              tenantId={tenantId}
              authToken={authToken}
              isView={true}
            />
          </div>
        )}
      </div>
    </BaseModal>
  );
};

export default ViewApplicationModal;
