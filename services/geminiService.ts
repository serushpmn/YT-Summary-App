import { GoogleGenAI } from "@google/genai";
import { GenerationRequest } from "../types";

const apiKey = process.env.API_KEY || '';

export const generateSummary = async (request: GenerationRequest): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing via process.env.API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are an expert linguistics assistant. 
    Task: Rewrite and summarize the provided YouTube transcript text.
    
    Constraints:
    1. Output Language: ${request.language}.
    2. Proficiency Level: ${request.level} (CEFR standards). Use vocabulary and grammar appropriate for this level.
    3. Length: Approximately ${request.wordCount} words.
    4. Style: Educational, clear, and coherent.
    5. Formatting: **EXTREMELY IMPORTANT**: Use proper Markdown formatting to make the text visually appealing and easy to read.
       - Use **Bold** for key terms or important concepts.
       - Use *Italics* for emphasis or foreign words.
       - Use Bullet points or Numbered lists where appropriate to break down information.
       - Use Headings (## or ###) to structure the summary into sections (e.g., Introduction, Key Points, Conclusion).
       - Use > Blockquotes for important takeaways.

    Input Text:
    """
    ${request.text}
    """
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "خطایی در تولید متن رخ داد.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("ارتباط با هوش مصنوعی برقرار نشد. لطفا مجددا تلاش کنید.");
  }
};