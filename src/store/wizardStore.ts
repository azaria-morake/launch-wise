import { create } from 'zustand';
import { BusinessSessionData } from '../lib/sessionService';

export type WizardState = {
  sessionId: string | null;
  currentStep: number;
  data: Partial<BusinessSessionData>;
  initSession: () => void;
  nextStep: () => void;
  prevStep: () => void;
  updateData: (newData: Partial<BusinessSessionData>) => void;
  setStep: (step: number) => void;
  setSessionId: (id: string) => void;
};

export const useWizardStore = create<WizardState>((set) => ({
  sessionId: null,
  currentStep: 0,
  data: {},
  
  initSession: () => {
    if (typeof window !== 'undefined') {
      const localId = localStorage.getItem('sessionId');
      if (localId) {
        set({ sessionId: localId });
      } else {
        const newId = crypto.randomUUID();
        localStorage.setItem('sessionId', newId);
        set({ sessionId: newId });
      }
    }
  },
  
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
  
  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),
  
  setStep: (step) => set({ currentStep: step }),

  setSessionId: (id) => set({ sessionId: id }),
  
  updateData: (newData) => set((state) => ({ 
    data: { ...state.data, ...newData } 
  })),
}));
