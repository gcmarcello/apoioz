import { ReactNode, useState } from "react";

export function useSteps<T>(steps: Array<T>, initialStep: number = 0) {
  const [activeStep, setActiveStep] = useState(initialStep);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return {
    steps,
    activeStep: {
      index: activeStep,
      value: steps[activeStep],
    },
    handleNext,
    handleBack,
  };
}
