
import React, { useState } from 'react';

interface Props {
  onSearch: (ingredients: string[]) => void;
  isLoading: boolean;
}

const IngredientInput: React.FC<Props> = ({ onSearch, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const ingredients = inputValue
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0);
    
    if (ingredients.length > 0) {
      onSearch(ingredients);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4 mb-16">
      <form onSubmit={handleSubmit} className="relative group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="z.B. Kartoffeln, Sahne, Zwiebeln, Käse..."
          disabled={isLoading}
          className="w-full h-16 pl-6 pr-32 rounded-2xl border-2 border-[#FDF2B3] bg-white shadow-sm focus:outline-none focus:ring-4 focus:ring-[#FDF2B3]/50 focus:border-[#FDF2B3] transition-all text-stone-800 text-lg placeholder-stone-400"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-2 bottom-2 px-8 rounded-xl bg-stone-800 text-white font-semibold hover:bg-stone-700 active:scale-95 transition-all disabled:bg-stone-400"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Suche...
            </span>
          ) : 'Suchen'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-stone-500 italic">
        Trenne die Zutaten für beste Ergebnisse mit Kommas.
      </p>
    </section>
  );
};

export default IngredientInput;
