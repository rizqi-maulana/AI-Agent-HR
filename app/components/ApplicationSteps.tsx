import React from "react";
import clsx from "clsx";

interface ApplicationStepsProps {
  currentStep: number;
  steps: string[];
}

const ApplicationSteps: React.FC<ApplicationStepsProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center w-full">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            {/* Step indicator */}
            <div className="relative flex flex-col items-center">
              <div
                className={clsx(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border transition-all",
                  {
                    "bg-blue-500 text-white border-blue-500":
                      index < currentStep,
                    "text-blue-500 border-blue-500": index === currentStep,
                    "text-gray-400 border-gray-300": index > currentStep,
                  }
                )}
              >
                {index + 1}
              </div>
              <div className="text-xs mt-2 text-center font-medium">
                <span
                  className={clsx({
                    "text-blue-600": index <= currentStep,
                    "text-gray-400": index > currentStep,
                  })}
                >
                  {step}
                </span>
              </div>
            </div>

            {/* Divider line */}
            {index < steps.length - 1 && (
              <div
                className={clsx(
                  "flex-auto border-t-2 mx-2",
                  index < currentStep ? "border-blue-500" : "border-gray-300"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ApplicationSteps;
