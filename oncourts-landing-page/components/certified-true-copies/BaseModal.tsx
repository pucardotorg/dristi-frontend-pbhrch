import React, { useEffect } from "react";
import { svgIcons } from "../../data/svgIcons";
import { ctcStyles } from "../../styles/certifiedCopyStyles";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  /** Max width of the modal card, default "max-w-[500px]" */
  maxWidth?: string;
  children: React.ReactNode;
  /** Optional footer content (actions row) */
  footer?: React.ReactNode;
}

/**
 * Reusable modal shell.
 * Renders: overlay → centred card → optional header (title + close) → children → optional footer.
 */
const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  maxWidth = "max-w-[500px]",
  children,
  footer,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={ctcStyles.modalOverlay}>
      <div
        className={`bg-white rounded-xl w-full ${maxWidth} shadow-2xl relative animate-fadeIn mx-4 flex flex-col overflow-hidden`}
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-2xl font-bold text-[#0A0A0A] font-roboto">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-[#334155] hover:text-gray-600 transition-colors p-1"
            >
              {svgIcons.OtpCloseIcon()}
            </button>
          </div>
        )}

        {/* No title — close button floats top-right */}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 text-[#334155] hover:text-gray-600 transition-colors z-10"
          >
            {svgIcons.OtpCloseIcon()}
          </button>
        )}

        {/* Body */}
        <div className="flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-3 font-roboto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default BaseModal;
