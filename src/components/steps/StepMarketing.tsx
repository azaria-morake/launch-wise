"use client";

import { useState, useEffect } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { generateMarketingStrategy } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";

export default function StepMarketing() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [tone, setTone] = useState<string>("");
  const [posts, setPosts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (data.businessIdea && !tone && !isLoading) {
      loadStrategy();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadStrategy = async () => {
    setIsLoading(true);
    try {
      const context = `Idea: ${data.businessIdea}. Plan: ${data.businessPlan || "None yet"}. Stage: ${data.stage}. Location: ${data.location}.`;
      const result = await generateMarketingStrategy(data.businessName || "My Business", context);
      setTone(result.brandVoice || "Professional yet accessible");
      setPosts(result.socialPosts || []);
    } catch (err) {
      console.error(err);
      alert("Failed to generate marketing strategy.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleContinue = async () => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const update = { marketingTone: tone, socialPosts: posts };
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
        <h2 className="text-3xl font-bold text-gray-900">Marketing Strategy</h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="text-gray-500 font-medium">Brewing up a viral marketing strategy...</p>
        </div>
      ) : (
        <div className="space-y-8 animate-fade-in pt-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="text-sm font-semibold tracking-wider text-indigo-800 uppercase mb-2">Recommended Brand Voice</h3>
            <p className="text-gray-800 font-medium">{tone}</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 text-lg">Ready-to-use Social Posts</h3>
            {posts.map((post, i) => (
              <div key={i} className="bg-white border text-sm md:text-base border-gray-200 p-5 rounded-2xl shadow-sm hover:border-indigo-300 transition-colors">
                <p className="text-gray-700 whitespace-pre-wrap">{post}</p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => handleCopy(post, i)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    {copiedIndex === i ? (
                      <><CheckCircle2 className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
            <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600 px-4">
              &larr; Back
            </button>
            <button
              onClick={handleContinue}
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save & Continue"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
