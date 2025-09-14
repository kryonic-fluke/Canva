import axios from "axios";
import type { CanvasStats } from "../hooks/useCanvasStats";

export interface ProjectAnalysis {
  summary: string | undefined;
  strengths: string[] | undefined;
  risks: string[] | undefined;
  suggestions: string[] | undefined;
}

export const Analysis = async (
  stats: CanvasStats|undefined
): Promise<ProjectAnalysis> => {
  const GOOGLE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

  const statsStr = JSON.stringify(stats, null, 2);
  const prompt = `
  You are an expert project manager and senior analyst. Your task is to analyze the following JSON data, which represents the current state of a visual project plan on a canvas, and provide a high-level analysis.

  **Input Data:**
  \`\`\`json
  ${statsStr}
  \`\`\`

  **Your Analysis Task:**
  Based on the data provided (node counts by category, type, and checklist progress), generate a concise analysis. Identify key strengths, potential risks, and actionable suggestions.

  **CRITICAL: Response Format**
  Your response MUST be a single, valid JSON object. Do not include any text, explanation, or markdown formatting outside of the JSON object itself. The JSON object must conform to this exact structure:
  {
    "summary": "A one or two-sentence high-level summary of the project's current state.",
    "strengths": ["A key strength observed from the data.", "Another key strength, like good progress on checklists."],
    "risks": ["A potential risk, e.g., 'A high number of uncategorized nodes may indicate a lack of clarity.'", "Another potential risk to highlight."],
    "suggestions": ["An actionable suggestion, e.g., 'Prioritize categorizing the remaining nodes to structure the plan.'", "Another clear suggestion for next steps."]
  }
`;

  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: prompt }] }],
    });
    const rawText = response.data.candidates[0].content.parts[0].text;
    const cleanedJsonString = rawText.replace(/```json|```/g, "").trim();

    const analysisData: ProjectAnalysis = JSON.parse(cleanedJsonString);
    //parsing to json obj

    return analysisData;
  } catch (error) {
    console.error("Error fetching AI project analysis:", error);

    throw new Error(
      "Failed to get analysis from AI. Please check the API key and network connection."
    );
  }
};
