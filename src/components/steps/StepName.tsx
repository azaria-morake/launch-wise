"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { generateNames } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2 } from "lucide-react";

export default function StepName() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [names, setNames] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    if (data.businessIdea && names.length === 0 && !isLoading) {
      loadNames();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadNames = async () => {
    setIsLoading(true);
    try {
      const suggestions = await generateNames(data.businessIdea!);
      setNames(suggestions);
    } catch (err) {
      console.error(err);
      alert("Failed to generate names.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (name: string) => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const update = { businessName: name };
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
        <h2 className="text-3xl font-bold text-gray-900">Choose a Business Name</h2>
        <p className="mt-2 text-gray-600">Here are some catchy, available-sounding suggestions based on your idea.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium">Generating creative names...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {names.map((name, i) => (
              <button
                key={i}
                onClick={() => handleSelect(name)}
                disabled={isSaving}
                className="p-5 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 hover:shadow-md transition-all bg-white"
              >
                <span className="font-semibold text-gray-800 text-lg">{name}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Or type your own name:</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                placeholder="My Awesome Bakery"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <button
                onClick={() => handleSelect(customName)}
                disabled={!customName.trim() || isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Use Name"}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center pt-2 border-t border-gray-100 mt-6">
        <button onClick={prevStep} className="mt-4 text-gray-500 font-medium hover:text-indigo-600 transition-colors">
          &larr; Back to Idea
        </button>
      </div>
    </div>
  );
}
