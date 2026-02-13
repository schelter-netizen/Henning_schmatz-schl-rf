
export interface Recipe {
  id: string;
  title: string;
  description: string;
  url: string;
  videoId?: string;
  thumbnail?: string;
  ingredients?: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface RecommendationResponse {
  recipes: Recipe[];
  reasoning: string;
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}
