"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { generateLegalAdvice } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2 } from "lucide-react";

export default function StepLegal() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (data.stage && data.location && !advice && !isLoading) {
      loadAdvice();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadAdvice = async () => {
    setIsLoading(true);
    try {
      const result = await generateLegalAdvice(data.stage!, data.location!);
      setAdvice(result);
    } catch (err) {
      console.error(err);
      alert("Failed to generate advice.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const update = { registrationAdvice: advice };
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

  return (
    <div className="space-y-6 transition-opacity duration-500 ease-in py-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Legal & Registration</h2>
        <p className="mt-2 text-gray-600">Personalized advice for your specific situation.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-gray-500 font-medium">Checking requirements for {data.location}...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border border-amber-200 shadow-sm">
            <h3 className="font-semibold text-amber-900 mb-4 pb-2 border-b border-amber-200">
              Registration Guide
            </h3>
            <div className="prose prose-amber max-w-none text-amber-900/90 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
              {advice}
            </div>
          </div>
          
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600">
              &larr; Back
            </button>
            <button
              onClick={handleContinue}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "I've Read This, Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
