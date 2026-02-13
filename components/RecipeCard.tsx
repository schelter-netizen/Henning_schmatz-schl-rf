
import React from 'react';
import { Recipe } from '../types';

interface Props {
  recipe: Recipe;
}

const RecipeCard: React.FC<Props> = ({ recipe }) => {
  // Use high-quality YouTube thumbnail
  const thumbnailUrl = recipe.videoId 
    ? `https://i.ytimg.com/vi/${recipe.videoId}/maxresdefault.jpg`
    : `https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600`;

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-[#FDF2B3] shadow-md hover:shadow-2xl transition-all duration-500 group flex flex-col h-full hover:-translate-y-2">
      <div className="aspect-video bg-stone-100 relative overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={recipe.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            // Fallback to hqdefault if maxres doesn't exist
            (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${recipe.videoId}/hqdefault.jpg`;
          }}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Persistent & Hover Play Button */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-14 h-14 rounded-full bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:bg-white/90 transition-all duration-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-stone-800 group-hover:text-amber-500 transition-colors">
                <path d="M8 5v14l11-7z"/>
              </svg>
           </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-stone-800 uppercase tracking-widest shadow-sm border border-[#FDF2B3]/30">
            Rezept ansehen
          </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-2xl font-bold text-stone-800 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2 leading-tight italic">
          {recipe.title}
        </h3>
        <p className="text-sm text-stone-600 mb-6 line-clamp-3 leading-relaxed font-medium opacity-80">
          {recipe.description}
        </p>
        
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {recipe.ingredients.slice(0, 4).map((ing, idx) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-[#FFF9E3] text-[#8B7E3D] text-[10px] font-bold uppercase border border-[#FDF2B3]">
                {ing}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-[#FDF2B3]/50">
          <a 
            href={recipe.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-stone-800 text-white font-bold hover:bg-stone-700 transition-all active:scale-95 shadow-lg shadow-stone-200"
          >
            Auf YouTube ansehen
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
