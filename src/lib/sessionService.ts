import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export type BusinessSessionData = {
  businessIdea?: string;
  businessName?: string;
  businessPlan?: string;
  location?: string;
  stage?: string;
  registrationAdvice?: string;
  websiteCode?: string;
  marketingTone?: string;
  socialPosts?: string[];
  logoUrl?: string;
  socialImageUrl?: string;
  currentStepIndex?: number;
};

export const createOrUpdateSession = async (sessionId: string, data: Partial<BusinessSessionData>) => {
  const sessionRef = doc(db, "sessions", sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (sessionSnap.exists()) {
    await updateDoc(sessionRef, data);
  } else {
    await setDoc(sessionRef, { ...data, createdAt: new Date().toISOString() });
  }
};

export const getSession = async (sessionId: string): Promise<BusinessSessionData | null> => {
  const sessionRef = doc(db, "sessions", sessionId);
  const sessionSnap = await getDoc(sessionRef);
  
  if (sessionSnap.exists()) {
    return sessionSnap.data() as BusinessSessionData;
  }
  return null;
};
