"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { generateLandingPageCode } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2, Code, Eye } from "lucide-react";

export default function StepLanding() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");

  const handleGenerate = async () => {
    setHasWebsite(false);
    setIsLoading(true);
    try {
      const htmlCode = await generateLandingPageCode(
        data.businessName || "", 
        data.businessIdea || "", 
        data.businessPlan || ""
      );
      setCode(htmlCode || "<html><body>Error generating code.</body></html>");
    } catch (err) {
      console.error(err);
      alert("Failed to generate landing page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    setHasWebsite(true);
    nextStep();
  };

  const handleContinue = async () => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const update = { websiteCode: code };
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied to clipboard!");
  };

  return (
    <div className="space-y-6 transition-opacity duration-500 ease-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Your Landing Page</h2>
      </div>

      {hasWebsite === null && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <button
            onClick={handleSkip}
            className="flex flex-col items-center p-8 bg-white border border-gray-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all"
          >
            <h3 className="text-xl font-semibold text-gray-800">I have a website</h3>
            <p className="text-gray-500 text-center mt-2 text-sm">Skip this step.</p>
          </button>
          <button
            onClick={handleGenerate}
            className="flex flex-col items-center p-8 bg-indigo-50 border border-indigo-200 rounded-2xl hover:border-indigo-500 hover:shadow-xl transition-all"
          >
            <Code className="w-12 h-12 text-indigo-600 mb-4" />
            <h3 className="text-xl font-semibold text-indigo-900">Build one for me</h3>
            <p className="text-indigo-700/80 text-center mt-2 text-sm">Generate the HTML & Tailwind code.</p>
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium tracking-wide">Designing your perfect landing page...</p>
        </div>
      )}

      {code && !isLoading && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-end gap-2 mb-2">
            <button 
              onClick={() => setViewMode("preview")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'preview' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Eye className="w-4 h-4 inline mr-2" /> Preview
            </button>
            <button 
              onClick={() => setViewMode("code")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${viewMode === 'code' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
            >
              <Code className="w-4 h-4 inline mr-2" /> Code
            </button>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden shadow-inner h-[50vh]">
            {viewMode === "preview" ? (
              <iframe
                srcDoc={code}
                className="w-full h-full bg-white"
                title="Landing Page Preview"
              />
            ) : (
              <pre className="w-full h-full p-6 text-sm text-gray-800 overflow-auto whitespace-pre-wrap font-mono">
                {code}
              </pre>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-4">
            <button onClick={copyToClipboard} className="text-indigo-600 font-medium hover:text-indigo-800 px-4">
              Copy Code
            </button>
            <button
              onClick={handleContinue}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save & Continue"}
            </button>
          </div>
        </div>
      )}
      
      {!code && hasWebsite === null && !isLoading && (
         <div className="flex justify-between w-full pt-4 border-t border-gray-100 mt-6">
          <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600 py-2">
            &larr; Back to Legal
          </button>
        </div>
      )}
    </div>
  );
}
