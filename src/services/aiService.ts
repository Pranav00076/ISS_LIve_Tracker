import { GoogleGenAI } from "@google/genai";

export async function askAI(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Gemini API key is missing. Please set GEMINI_API_KEY in your environment variables.",
    );
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        temperature: 0.1,
        maxOutputTokens: 1000,
      },
    });

    return response.text;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(error.message || "Failed to get a response from AI.");
  }
}
