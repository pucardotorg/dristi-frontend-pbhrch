import React from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { ctcStyles } from "../../styles/certifiedCopyStyles";

interface FormActionsProps {
  /** Label for the left (secondary/destructive) button */
  secondaryLabel: string;
  onSecondary: () => void;
  isSecondaryDisabled?: boolean;

  /** Label for the right (primary/proceed) button */
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;

  /** Pass true to colour as a "next"-style button (light teal), false for "proceed" (dark teal) */
  primaryVariant?: "proceed" | "next";
}

const FormActions: React.FC<FormActionsProps> = ({
  secondaryLabel,
  onSecondary,
  isSecondaryDisabled = false,
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryVariant = "proceed",
}) => {
  const { t } = useSafeTranslation();

  const primaryActiveClass =
    primaryVariant === "next"
      ? ctcStyles.btnNextActive
      : ctcStyles.btnPrimaryActive;

  const primaryDisabledClass =
    primaryVariant === "next"
      ? ctcStyles.btnNextDisabled
      : ctcStyles.btnPrimaryDisabled;

  const secondaryDisabledClass = ctcStyles.btnSecondaryDisabled;

  return (
    <>
      <div className={ctcStyles.divider} />
      <div className={ctcStyles.actionRow}>
        <button
          onClick={onSecondary}
          className={`${ctcStyles.btnSecondary} ${isSecondaryDisabled ? secondaryDisabledClass : ""}`}
          disabled={isSecondaryDisabled}
        >
          {t(secondaryLabel)}
        </button>
        <button
          onClick={onPrimary}
          disabled={primaryDisabled}
          className={`${ctcStyles.btnPrimary} ${primaryVariant === "proceed" && "!px-12"} ${primaryDisabled ? primaryDisabledClass : primaryActiveClass}`}
        >
          {t(primaryLabel)}
        </button>
      </div>
    </>
  );
};

export default FormActions;
