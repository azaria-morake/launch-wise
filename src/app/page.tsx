"use client";

import WizardLayout from "@/components/WizardLayout";
import { useWizardStore } from "@/store/wizardStore";

import StepIdea from "@/components/steps/StepIdea";
import StepName from "@/components/steps/StepName";
import StepPlan from "@/components/steps/StepPlan";
import StepLocation from "@/components/steps/StepLocation";
import StepStage from "@/components/steps/StepStage";
import StepLegal from "@/components/steps/StepLegal";
import StepLanding from "@/components/steps/StepLanding";
import StepMarketing from "@/components/steps/StepMarketing";
import StepVisuals from "@/components/steps/StepVisuals";
import Dashboard from "@/components/steps/Dashboard";

export default function Home() {
  const currentStep = useWizardStore((state: any) => state.currentStep);

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepIdea />;
      case 1: return <StepName />;
      case 2: return <StepPlan />;
      case 3: return <StepLocation />;
      case 4: return <StepStage />;
      case 5: return <StepLegal />;
      case 6: return <StepLanding />;
      case 7: return <StepMarketing />;
      case 8: return <StepVisuals />;
      case 9: return <Dashboard />;
      default: return null;
    }
  };

  return (
    <WizardLayout>
      {renderStep()}
    </WizardLayout>
  );
}
