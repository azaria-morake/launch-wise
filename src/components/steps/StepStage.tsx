"use client";

import { useWizardStore } from "@/store/wizardStore";
import { createOrUpdateSession } from "@/lib/sessionService";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function StepStage() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [isSaving, setIsSaving] = useState(false);

  const stages = [
    "Idea",
    "Trading Informally",
    "Registered but Pre-revenue",
    "Revenue Generating"
  ];

  const handleSelect = async (stage: string) => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const update = { stage };
      await createOrUpdateSession(sessionId, update);
      updateData(update);
      nextStep();
    } catch (err) {
      console.error(err);
      alert("Failed to save.");
    } finally {
      setIsSaving(false);
    }
  };

  if (data.stage === "Beginner/Idea Phase") {
    return (
      <div className="space-y-6 text-center transition-opacity duration-500 ease-in py-8">
        <h2 className="text-3xl font-bold text-gray-900">Your Business Stage</h2>
        <div className="mt-8 p-8 bg-indigo-50 border border-indigo-100 rounded-3xl shadow-inner">
          <p className="text-indigo-900 text-lg font-medium">
            Since you generated your plan with our AI, we've categorised your stage as:
          </p>
          <div className="text-2xl font-bold text-indigo-600 mt-4 bg-white py-3 px-6 rounded-xl inline-block shadow-sm">
            Beginner / Idea Phase
          </div>
        </div>
        
        <div className="flex gap-4 justify-center mt-12">
           <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600 px-6 py-3 transition-colors">
             &larr; Back
          </button>
          <button
            onClick={() => nextStep()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-10 rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Continue &rarr;
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 transition-opacity duration-500 ease-in py-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">What stage is your business?</h2>
        <p className="mt-2 text-gray-600">Select the option that best describes your current progress.</p>
      </div>

      <div className="grid gap-4 mt-8">
        {stages.map((stage) => (
          <button
            key={stage}
            onClick={() => handleSelect(stage)}
            disabled={isSaving}
            className="w-full p-6 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 transition-all bg-white shadow-sm flex items-center justify-between group"
          >
            <span className="font-semibold text-gray-800 text-lg">{stage}</span>
            <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
          </button>
        ))}
      </div>
      
      <div className="flex justify-center pt-8 mt-4">
        <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600 transition-colors">
          &larr; Back to Location
        </button>
      </div>
    </div>
  );
}
