"use server";
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function refineIdea(idea: string) {
  const prompt = `Act as an expert business consultant. Refine the following raw business idea into a clear, actionable 2-3 sentence value proposition: "${idea}"`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "";
}

export async function generateNames(refinedIdea: string) {
  const prompt = `Based on this refined business idea: "${refinedIdea}". Suggest 5 catchy, available-sounding business names. Simulate checking for uniqueness, avoiding massive global brands. Return JUST the 5 names as a comma-separated list, nothing else.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  const text = (response.text) || "";
  return text.split(',').map(n => n.trim().replace(/^\\d+\\.\\s*/, '')).filter(Boolean); // Clean any numbers
}

export async function generateBusinessPlan(idea: string, name: string) {
  const prompt = `Generate a lean canvas/simple business plan based on the business idea: "${idea}" and business name: "${name}". Structure it clearly with markdown headings. Ensure the tone is professional but accessible.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "";
}

export async function auditBusinessPlan(plan: string) {
  const prompt = `Audit and refine the following business plan for clarity and investor readiness. Maintain the core ideas but improve the verbiage and structure. Output the detailed, refined plan:\n\n${plan}`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "";
}

export async function generateLegalAdvice(stage: string, location: string) {
  const prompt = `Generate simple, jargon-free advice on business registration for a business at stage "${stage}" located in "${location}". Ensure the advice is deeply relevant to the location, especially if it's South Africa (explain Sole Proprietor vs Pty Ltd, CIPC registration, SARS tax). Format the response clearly.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text || "";
}

export async function generateLandingPageCode(name: string, idea: string, plan: string) {
  const prompt = `Generate a highly converting, single-page landing page for a business named "${name}". The idea is "${idea}" and plan is "${plan}". Use modern HTML and Tailwind CSS structure (use grid, gradients, a mock hero section). Output MUST ONLY contain the code starting with '<!DOCTYPE html>' and ending with '</html>'. No markdown code blocks, just raw HTML string.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });
  return response.text?.replace(/```html\\n|```/g, '').trim();
}

export async function generateMarketingStrategy(name: string, context: string) {
  const prompt = `Define a "brand voice/tone" based on this business context: "${context}" for business named "${name}". Then, generate 3 ready-to-use social media posts (including emojis and hashtags) tailored to the target audience. Return a JSON with exactly these keys: "brandVoice" (string), "socialPosts" (array of strings). Do not return markdown blocks, just the JSON.`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });
  return JSON.parse(response.text || '{}');
}

export async function generateLogoPrompt(name: string, tone: string) {
    const prompt = `Create a clean, minimal, modern logo for the business "${name}" with a "${tone}" brand voice. Keep it abstract and vector-like on a white background.`;
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
             numberOfImages: 1,
             outputMimeType: "image/jpeg",
        }
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return `data:image/jpeg;base64,${response.generatedImages[0].image?.imageBytes}`;
    }
    return "";
}

export async function generateSocialImagePrompt(name: string, tone: string) {
    const prompt = `Create a high quality promotional social media image for the business "${name}" with a "${tone}" brand voice. Engaging, lifestyle, modern.`;
    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
             numberOfImages: 1,
             outputMimeType: "image/jpeg",
             aspectRatio: "16:9"
        }
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return `data:image/jpeg;base64,${response.generatedImages[0].image?.imageBytes}`;
    }
    return "";
}
