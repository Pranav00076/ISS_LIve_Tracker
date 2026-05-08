import { GoogleGenAI } from "@google/genai";

async function query(data: any) {
  const hfToken = import.meta.env.VITE_HF_TOKEN || process.env.VITE_HF_TOKEN || process.env.HF_TOKEN;
  
  if (!hfToken) {
    throw new Error(
      "Hugging Face API token is missing. Please set VITE_HF_TOKEN in your environment variables.",
    );
  }

  const response = await fetch(
    "https://router.huggingface.co/v1/chat/completions",
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) {
     const errorText = await response.text();
     throw new Error(`Hugging Face API returned error ${response.status}: ${errorText}`);
  }
  const result = await response.json();
  return result;
}

export async function askAI(prompt: string) {
  try {
    const response = await query({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/Llama-3.1-8B-Instruct:novita",
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    }
    
    return JSON.stringify(response);
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error(error.message || "Failed to get a response from AI.");
  }
}
