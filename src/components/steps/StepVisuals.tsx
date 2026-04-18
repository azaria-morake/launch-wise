"use client";

import { useState } from "react";
import { useWizardStore } from "@/store/wizardStore";
import { generateLogoPrompt, generateSocialImagePrompt } from "@/app/actions/gemini";
import { createOrUpdateSession } from "@/lib/sessionService";
import { Loader2, Image as ImageIcon, Frame } from "lucide-react";

export default function StepVisuals() {
  const { sessionId, data, updateData, nextStep, prevStep } = useWizardStore();
  const [logo, setLogo] = useState<string>(data.logoUrl || "");
  const [socialImage, setSocialImage] = useState<string>(data.socialImageUrl || "");
  const [isLogoLoading, setIsLogoLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateLogo = async () => {
    setIsLogoLoading(true);
    try {
      const url = await generateLogoPrompt(data.businessName || "My Business", data.marketingTone || "Professional");
      setLogo(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate logo.");
    } finally {
      setIsLogoLoading(false);
    }
  };

  const handleGenerateSocial = async () => {
    setIsSocialLoading(true);
    try {
      const url = await generateSocialImagePrompt(data.businessName || "My Business", data.marketingTone || "Professional");
      setSocialImage(url);
    } catch (err) {
      console.error(err);
      alert("Failed to generate social image.");
    } finally {
      setIsSocialLoading(false);
    }
  };

  const handleContinue = async () => {
    if (!sessionId) return;
    setIsSaving(true);
    try {
      const update = { logoUrl: logo, socialImageUrl: socialImage };
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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Your Visual Identity</h2>
        <p className="mt-2 text-gray-600">Let AI design your core brand visuals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LOGO */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center hover:border-indigo-200 transition-colors">
          <div className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative">
            {logo ? (
              <img src={logo} alt="Logo" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <span className="text-sm font-medium">No Logo Yet</span>
              </div>
            )}
            {isLogoLoading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                 <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            )}
          </div>
          <button
            onClick={handleGenerateLogo}
            disabled={isLogoLoading}
            className="mt-6 w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors"
          >
            {logo ? "Regenerate Logo" : "Generate Logo"}
          </button>
        </div>

        {/* SOCIAL IMAGE */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col items-center hover:border-indigo-200 transition-colors">
          <div className="w-full aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative mt-auto mb-auto">
            {socialImage ? (
              <img src={socialImage} alt="Social Promo" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <Frame className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <span className="text-sm font-medium">No Promo Image</span>
              </div>
            )}
            {isSocialLoading && (
               <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
               </div>
            )}
          </div>
          <button
            onClick={handleGenerateSocial}
            disabled={isSocialLoading}
            className="mt-6 w-full py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors"
          >
            {socialImage ? "Regenerate Promo" : "Generate Promo Image"}
          </button>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-8 border-t border-gray-100 mt-6">
        <button onClick={prevStep} className="text-gray-500 font-medium hover:text-indigo-600 px-4">
          &larr; Back
        </button>
        <button
          onClick={handleContinue}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/30"
        >
          {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finish & View Dashboard"}
        </button>
      </div>
    </div>
  );
}
