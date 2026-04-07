import React from "react";
import { useSafeTranslation } from "../../hooks/useSafeTranslation";
import { ctcStyles } from "../../styles/certifiedCopyStyles";

interface StepperProps {
  steps: string[];
  currentStep: number; // 1-indexed
}

const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  const { t } = useSafeTranslation();

  return (
    <div className={ctcStyles.stepperWrap}>
      {steps?.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        const circleClass = isCompleted
          ? ctcStyles.stepperCircleCompleted
          : isActive
            ? ctcStyles.stepperCircleActive
            : ctcStyles.stepperCircleDefault;

        const labelClass = isCompleted
          ? ctcStyles.stepperLabelCompleted
          : isActive
            ? ctcStyles.stepperLabelActive
            : ctcStyles.stepperLabelDefault;

        return (
          <React.Fragment key={step}>
            {/* Step item */}
            <div className={ctcStyles.stepperItem}>
              {/* Circle */}
              <div className={`${ctcStyles.stepperCircleBase} ${circleClass}`}>
                {isCompleted ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5 sm:w-6 sm:h-6"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>

              {/* Label */}
              <span className={`${ctcStyles.stepperLabelBase} ${labelClass}`}>
                {t(step)}
              </span>
            </div>

            {/* Connector line between steps */}
            {index < steps.length - 1 && (
              <div className={ctcStyles.stepperConnector} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
