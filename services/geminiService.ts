import { GoogleGenAI, Type } from "@google/genai";
import { ServiceCategory, AIRecommendation } from '../types';

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const analyzeSkinConcern = async (concern: string): Promise<AIRecommendation | null> => {
  const ai = getAIClient();
  if (!ai) {
    console.warn("API Key not found, skipping AI analysis");
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `User concern: "${concern}". 
      Classify this concern into one of these categories: 
      - Skin Rejuvenation
      - Facial Enhancements
      - Body SCULPTING
      - Other Services
      
      Provide a brief 1-sentence reason why.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: [
                ServiceCategory.SKIN_REJUVENATION,
                ServiceCategory.FACIAL_ENHANCEMENTS,
                ServiceCategory.BODY_SCULPTING,
                ServiceCategory.OTHER
              ]
            },
            reason: {
              type: Type.STRING,
            }
          },
          required: ["category", "reason"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIRecommendation;
    }
    return null;

  } catch (error) {
    console.error("Error analyzing skin concern:", error);
    return null;
  }
};
