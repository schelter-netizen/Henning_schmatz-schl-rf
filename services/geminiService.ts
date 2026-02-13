
import { GoogleGenAI } from "@google/genai";
import { RecommendationResponse, Recipe } from "../types";
import { RECIPE_DB, RecipeData } from "../data/recipes";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Robustly extracts the 11-character YouTube video ID
 */
export const extractVideoId = (url: string): string | undefined => {
  if (!url) return undefined;
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?)|(shorts\/))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[8] && match[8].length === 11) ? match[8] : undefined;
  
  if (!id && url.includes('v=')) {
    const parts = url.split('v=');
    if (parts[1]) return parts[1].substring(0, 11);
  }
  return id;
};

/**
 * Helper to extract JSON from a markdown string
 */
const parseJsonFromMarkdown = (text: string) => {
  try {
    const jsonMatch = text.match(/```json\s?([\s\S]*?)\s?```/) || text.match(/{[\s\S]*}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1] || jsonMatch[0]);
    }
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from model response", text);
    return null;
  }
};

export const getLatestVideos = async (): Promise<Recipe[]> => {
  // We use the top 4 from our curated local database for guaranteed functionality
  return RECIPE_DB.slice(0, 4).map(r => ({
    id: r.videoId,
    title: r.title,
    description: r.description,
    url: r.url,
    videoId: r.videoId,
    uploadDate: r.uploadDate
  }));
};

export const getRecipeRecommendations = async (ingredients: string[]): Promise<RecommendationResponse> => {
  // Create a simplified list of our available recipes for the model to choose from
  const availableRecipes = RECIPE_DB.map((r, index) => ({
    id: index,
    title: r.title,
    summary: r.description
  }));

  const prompt = `Du bist ein kulinarischer Experte für den YouTube-Kanal @schmatzundschlürf.
  Der Nutzer hat folgende Zutaten zur Verfügung: ${ingredients.join(', ')}.
  
  Wähle die 3 am besten passenden Rezepte aus dieser spezifischen Videodatenbank aus:
  ${JSON.stringify(availableRecipes)}
  
  Gib deine Antwort AUSSCHLIESSLICH als JSON-Objekt zurück, wobei die Begründung auf DEUTSCH sein muss:
  {
    "selectedIds": [index1, index2, index3],
    "reasoning": "Eine herzliche, hilfreiche Erklärung auf DEUTSCH, warum diese Rezepte von @schmatzundschlürf perfekt zu den vorhandenen Zutaten passen."
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const result = parseJsonFromMarkdown(response.text || "{}");
    
    if (!result || !result.selectedIds) {
      throw new Error("Ungültige Antwort von der Empfehlungs-Engine");
    }

    const selectedRecipes: Recipe[] = result.selectedIds
      .map((id: number) => {
        const data = RECIPE_DB[id];
        if (!data) return null;
        return {
          id: data.videoId,
          title: data.title,
          description: data.description,
          url: data.url,
          videoId: data.videoId,
          ingredients: [] 
        };
      })
      .filter((r: Recipe | null) => r !== null) as Recipe[];

    return {
      recipes: selectedRecipes,
      reasoning: result.reasoning || "Viel Spaß mit dieser Auswahl vom Kanal!"
    };
  } catch (error) {
    console.error("Fehler in getRecipeRecommendations:", error);
    // Fallback if AI fails: just return the first 3
    return {
      recipes: RECIPE_DB.slice(0, 3).map(r => ({
        id: r.videoId,
        title: r.title,
        description: r.description,
        url: r.url,
        videoId: r.videoId
      })),
      reasoning: "Ich hatte ein kleines technisches Problem, aber diese Klassiker gehen immer!"
    };
  }
};
