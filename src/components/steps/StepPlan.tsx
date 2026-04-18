"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { generateBusinessPlan, auditBusinessPlan } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2, Zap, Upload } from "lucide-react";

export default function StepPlan() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [hasPlan, setHasPlan] = useState<boolean | null>(null);
  const [pastedPlan, setPastedPlan] = useState("");
  const [finalPlan, setFinalPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tweakRequest, setTweakRequest] = useState("");

  const handleGeneratePlan = async () => {
    setHasPlan(false);
    setIsLoading(true);
    try {
      const plan = await generateBusinessPlan(data.businessIdea!, data.businessName!);
      setFinalPlan(plan);
      updateData({ stage: "Beginner/Idea Phase" });
    } catch (err) {
      console.error(err);
      alert("Failed to generate plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditPlan = async () => {
    if (!pastedPlan.trim()) return;
    setIsLoading(true);
    try {
      const refined = await auditBusinessPlan(pastedPlan);
      setFinalPlan(refined);
    } catch (err) {
      console.error(err);
      alert("Failed to audit plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTweak = async () => {
    if (!tweakRequest.trim()) return;
    setIsLoading(true);
    try {
      const prompt = `Here is a business plan:\n\n${finalPlan}\n\nPlease update it according to this request: "${tweakRequest}"`;
      const refined = await auditBusinessPlan(prompt);
      setFinalPlan(refined);
      setTweakRequest("");
    } catch (err) {
      console.error(err);
      alert("Failed to tweak plan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async () => {
    if (!sessionId || !finalPlan.trim()) return;
    setIsSaving(true);
    try {
      const update = { businessPlan: finalPlan, stage: hasPlan === false ? "Beginner/Idea Phase" : undefined };
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
    <div className="space-y-6 transition-opacity duration-500 ease-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your Business Plan</h2>
      </div>

      {hasPlan === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => setHasPlan(true)}
            className="flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all"
          >
            <Upload className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">I have a plan</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">Paste it and let AI polish it up for investors.</p>
          </button>
          <button
            onClick={handleGeneratePlan}
            className="flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all"
          >
            <Zap className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">Build one for me</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">Generate a lean canvas based on your idea.</p>
          </button>
        </div>
      )}

      {hasPlan === true && !finalPlan && !isLoading && (
        <div className="space-y-4 animate-fade-in">
          <p className="text-gray-600 font-medium">Paste your existing plan below:</p>
          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
            value={pastedPlan}
            onChange={(e) => setPastedPlan(e.target.value)}
          />
          <button
            onClick={handleAuditPlan}
            disabled={!pastedPlan.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 shadow-md"
          >
            Audit & Refine Plan
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium tracking-wide">Working on your plan...</p>
        </div>
      )}

      {finalPlan && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-inner overflow-y-auto max-h-[50vh]">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 text-sm leading-relaxed">{finalPlan}</pre>
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="E.g., Make it shorter, focus on the marketing strategy..."
              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 text-gray-800"
              value={tweakRequest}
              onChange={(e) => setTweakRequest(e.target.value)}
            />
            <button
              onClick={handleTweak}
              disabled={!tweakRequest.trim()}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl shadow-md transition-all font-semibold"
            >
              Tweak
            </button>
          </div>

          <div className="flex justify-between pt-4 border-t border-gray-100">
             <button onClick={prevStep} className="text-gray-500 font-medium hover:text-gray-800 transition-colors px-4">
              &larr; Back
            </button>
            <button
              onClick={handleAccept}
              disabled={isSaving}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Looks Good, Continue"}
            </button>
          </div>
        </div>
      )}
      
      {!finalPlan && hasPlan !== null && !isLoading && (
         <div className="flex justify-center pt-2 mt-6">
          <button onClick={() => setHasPlan(null)} className="text-gray-500 font-medium hover:text-indigo-600">
            &larr; Go Back
          </button>
        </div>
      )}
    </div>
  );
}
