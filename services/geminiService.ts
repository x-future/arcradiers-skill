import { GoogleGenAI, Type } from "@google/genai";
import { SkillTreeData } from "../types";

// NOTE: In a real production app, this key should be proxied through a backend.
// For this demo, we assume the environment variable or user input is handled securely.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export interface AISuggestion {
  skillId: string;
  rank: number;
}

export const generateBuildSuggestion = async (
  prompt: string,
  treeData: SkillTreeData
): Promise<AISuggestion[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure it.");
  }

  // Minimize the context sent to Gemini to save tokens, just sending structure needed
  const simplifiedTree = Object.values(treeData.skills).map(s => ({
    id: s.id,
    name: s.name,
    description: s.description,
    maxRank: s.maxRank,
    category: s.category,
    parentIds: s.parentIds
  }));

  const systemInstruction = `
    You are an expert RPG theory-crafter for a game called "Neural Arc".
    You will receive a user's desired playstyle description and a list of available skills.
    Your goal is to suggest an optimal distribution of exactly 50 skill points.
    
    Rules:
    1. Respect the dependency tree (parent must be rank >= 1 to unlock child).
    2. Respect max ranks for each skill.
    3. Total ranks across all skills must NOT exceed 50.
    4. Prioritize skills that match the user's description (e.g., "Tank" -> Defense skills).
    5. Always allocate at least 1 point to the root skill if required for others.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Skill Tree Data: ${JSON.stringify(simplifiedTree)}
        
        User Playstyle Request: "${prompt}"
        
        Generate a JSON list of skill allocations.
      `,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              skillId: { type: Type.STRING },
              rank: { type: Type.INTEGER }
            },
            required: ["skillId", "rank"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as AISuggestion[];
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw error;
  }
};