import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function fetchHSNCode(itemName: string) {
  if (!itemName || itemName.length < 3) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find the 4, 6 or 8 digit HSN (Harmonized System of Nomenclature) code for the following item: "${itemName}". Return ONLY the numeric code. If you are unsure, return a plausible 4-digit code.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            hsnCode: {
              type: Type.STRING,
              description: "The HSN code for the item.",
            },
          },
          required: ["hsnCode"],
        },
      },
    });

    const data = JSON.parse(response.text || '{}');
    return data.hsnCode || null;
  } catch (error) {
    console.error("Error fetching HSN code:", error);
    return null;
  }
}
