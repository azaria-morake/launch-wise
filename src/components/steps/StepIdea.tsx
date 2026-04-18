"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { refineIdea } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2 } from "lucide-react";

export default function StepIdea() {
  const { sessionId, updateData, nextStep } = useWizardStore();
  const [rawIdea, setRawIdea] = useState("");
  const [refinedIdea, setRefinedIdea] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleRefine = async () => {
    if (!rawIdea.trim()) return;
    setIsRefining(true);
    try {
      const result = await refineIdea(rawIdea);
      setRefinedIdea(result);
    } catch (err) {
      console.error(err);
      alert("Failed to refine idea. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleAccept = async () => {
    if (!sessionId || !refinedIdea.trim()) return;
    setIsSaving(true);
    try {
      const update = { businessIdea: refinedIdea };
      await createOrUpdateSession(sessionId, update);
      updateData(update);
      nextStep();
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 transition-opacity duration-500 ease-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">What's your business idea?</h2>
        <p className="mt-2 text-gray-600">Describe it simply. Our AI consultant will help you refine it into a sharp value proposition.</p>
      </div>

      {!refinedIdea ? (
        <div className="space-y-4">
          <textarea
            className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800"
            placeholder="e.g., I want to sell home-made vetkoek and coffee at the taxi rank..."
            value={rawIdea}
            onChange={(e) => setRawIdea(e.target.value)}
          />
          <button
            onClick={handleRefine}
            disabled={isRefining || !rawIdea.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {isRefining ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isRefining ? "Refining..." : "Refine Idea"}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-inner">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-800 mb-2 uppercase">Refined Value Proposition</h3>
            <textarea
              className="w-full h-24 p-0 bg-transparent border-none focus:ring-0 text-gray-800 font-medium resize-none"
              value={refinedIdea}
              onChange={(e) => setRefinedIdea(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setRefinedIdea("")}
              disabled={isSaving}
              className="w-1/3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all shadow-sm"
            >
              Start Over
            </button>
            <button
              onClick={handleAccept}
              disabled={isSaving || !refinedIdea.trim()}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 shadow-indigo-200"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {isSaving ? "Saving..." : "Accept & Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
