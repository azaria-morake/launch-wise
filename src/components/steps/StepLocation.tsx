"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2 } from "lucide-react";

export default function StepLocation() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [location, setLocation] = useState(data.location || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleContinue = async () => {
    if (!sessionId || !location.trim()) return;
    setIsSaving(true);
    try {
      const update = { location };
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
    <div className="space-y-6 transition-opacity duration-500 ease-in max-w-lg mx-auto py-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Where are you operating?</h2>
        <p className="mt-2 text-gray-600">City, township, province, or just "Online".</p>
      </div>

      <div className="space-y-6 pt-4">
        <input
          type="text"
          className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-xl font-medium text-center text-gray-800 shadow-sm"
          placeholder="e.g. Soweto, Online, Cape Town"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          autoFocus
        />
        
        <button
          onClick={handleContinue}
          disabled={!location.trim() || isSaving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue"}
        </button>
      </div>
      
      <div className="flex justify-center pt-8">
        <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600 transition-colors">
          &larr; Back to Plan
        </button>
      </div>
    </div>
  );
}
