"use client";

import { useWizardStore } from "@/store/wizardStore";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sessionId, initSession, currentStep } = useWizardStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initSession();
  }, [initSession]);

  if (!mounted || !sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const steps = [
    "Idea", "Name", "Plan", "Location", "Stage", "Legal", "Landing Page", "Marketing", "Visuals", "Dashboard"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
            Launch Wise
          </h1>
          <div className="text-sm font-medium text-gray-500 hidden sm:block">
            Step {currentStep + 1} of {steps.length}: <span className="text-indigo-600 font-semibold">{steps[currentStep]}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-1.5">
          <div 
            className="bg-indigo-600 h-1.5 transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, ((currentStep + 1) / steps.length) * 100)}%` }}
          />
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 md:p-12">
        <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-10 border border-gray-100 ring-1 ring-gray-200/50">
          {children}
        </div>
      </main>
      
      <footer className="text-center py-8 text-sm text-gray-400 font-medium">
        Launch Wise - Giving everyone a chance
      </footer>
    </div>
  );
}
