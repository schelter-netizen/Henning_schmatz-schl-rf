
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import IngredientInput from './components/IngredientInput.tsx';
import RecipeCard from './components/RecipeCard.tsx';
import { getRecipeRecommendations, getLatestVideos } from './services/geminiService.ts';
import { Recipe, AppState } from './types.ts';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [latestVideos, setLatestVideos] = useState<Recipe[]>([]);
  const [reasoning, setReasoning] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const vids = await getLatestVideos();
        setLatestVideos(vids);
      } catch (e) {
        console.error("Failed to load featured videos");
      }
    };
    fetchLatest();
  }, []);

  const handleSearch = async (ingredients: string[]) => {
    setState(AppState.LOADING);
    setError(null);
    try {
      const result = await getRecipeRecommendations(ingredients);
      setRecipes(result.recipes);
      setReasoning(result.reasoning);
      setState(AppState.RESULTS);
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Die Küche ist gerade etwas überfüllt. Bitte versuche es gleich noch einmal.");
      setState(AppState.ERROR);
    }
  };

  const resetSearch = () => {
    setState(AppState.IDLE);
    setRecipes([]);
    setReasoning('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FFFCEB] pb-32 selection:bg-amber-200">
      <Header />
      
      <main className="container mx-auto px-4 max-w-6xl">
        <IngredientInput onSearch={handleSearch} isLoading={state === AppState.LOADING} />

        {state === AppState.LOADING && (
          <div className="text-center py-20 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-[#FDF2B3] border-t-amber-500 rounded-full animate-spin" />
            </div>
            <p className="text-stone-500 font-bold italic tracking-wide">
              Wir durchsuchen @schmatzundschlürf nach den besten Rezepten...
            </p>
          </div>
        )}

        {state === AppState.ERROR && (
          <div className="bg-white border border-red-100 rounded-[2.5rem] p-10 text-center max-w-lg mx-auto shadow-xl">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <p className="text-stone-800 mb-6 font-bold">{error}</p>
            <button 
              onClick={() => setState(AppState.IDLE)}
              className="px-8 py-3 rounded-xl bg-stone-800 text-white font-bold hover:bg-stone-700 transition-colors"
            >
              Zurück zur Vorratskammer
            </button>
          </div>
        )}

        {state === AppState.RESULTS && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-16 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl font-bold text-stone-800 mb-8 italic">Vorratskammer-Perlen</h2>
              <div className="p-10 bg-white/70 backdrop-blur-xl rounded-[3rem] border border-[#FDF2B3] shadow-inner relative">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FDF2B3] pl-2 pr-5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest text-[#8B7E3D] flex items-center gap-2 shadow-md border border-[#EBE1A4]">
                  <img 
                    src="https://moma-teams-photos.corp.google.com/photos/hschulte?sz=212&type=CUSTOM&type=SILHOUETTE" 
                    alt="Henning"
                    className="w-8 h-8 rounded-full border border-white bg-white/50 object-cover shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Henning&background=FDF2B3&color=8B7E3D";
                    }}
                  />
                  Henning’s Tipp
                </div>
                <p className="text-stone-700 text-lg leading-relaxed italic font-medium mt-4">"{reasoning}"</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {recipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>

            <div className="mt-20 text-center">
              <button 
                onClick={resetSearch}
                className="px-12 py-5 rounded-3xl bg-stone-800 text-white font-bold hover:bg-stone-700 hover:scale-105 transition-all shadow-2xl shadow-stone-300"
              >
                Erneut suchen
              </button>
            </div>
          </div>
        )}

        {state === AppState.IDLE && (
          <div className="mt-20 text-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="w-24 h-1 bg-[#FDF2B3] mx-auto mb-12 rounded-full opacity-50"></div>
            <h3 className="text-2xl font-bold text-stone-800 mb-12 italic">Frisch aus der YouTube-Küche</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
               {latestVideos.length > 0 ? (
                 latestVideos.map(vid => (
                   <a 
                    key={vid.id} 
                    href={vid.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative block aspect-video rounded-[2.5rem] overflow-hidden border-2 border-[#FDF2B3] bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                   >
                     <img 
                      src={`https://i.ytimg.com/vi/${vid.videoId}/maxresdefault.jpg`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      alt={vid.title} 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${vid.videoId}/hqdefault.jpg`;
                      }}
                     />
                     
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-white transition-all duration-500">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-stone-800">
                             <path d="M8 5v14l11-7z"/>
                           </svg>
                        </div>
                     </div>

                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <div>
                          <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest mb-2">Neu hochgeladen</p>
                          <span className="text-lg font-bold text-white italic tracking-tight line-clamp-2 leading-tight">
                            {vid.title}
                          </span>
                        </div>
                     </div>
                   </a>
                 ))
               ) : (
                 [1, 2].map(i => (
                    <div key={i} className="aspect-video rounded-[2.5rem] bg-white border-2 border-[#FDF2B3] shadow-sm animate-pulse flex items-center justify-center">
                       <div className="w-8 h-8 rounded-full border-2 border-[#FDF2B3] border-t-amber-300 animate-spin" />
                    </div>
                 ))
               )}
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 py-6 bg-[#FFFCEB]/80 backdrop-blur-xl border-t border-[#FDF2B3] text-center z-50">
        <p className="text-[10px] text-[#8B7E3D] font-black tracking-[0.3em] uppercase inline-flex items-center gap-2">
          Schmatz & Schlürf • 
          <a 
            href="https://www.linkedin.com/in/mira-von-justvanilla-8a3917307/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="made-by-mira-link relative inline-flex items-center px-2 py-1 group"
          >
            <div className="star-container absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
               <span className="star-anim-1 text-[8px]">✨</span>
               <span className="star-anim-2 text-[10px]">✨</span>
               <span className="star-anim-3 text-[7px]">✨</span>
               <span className="star-anim-4 text-[9px]">✨</span>
            </div>
            
            <span className="relative z-10 group-hover:text-amber-600 transition-colors duration-300">made by Mira</span>
          </a>
          • 2026
        </p>
      </footer>
    </div>
  );
};

export default App;