
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="w-full">
      {/* Official Banner Hero */}
      <div className="w-full h-[180px] md:h-[280px] lg:h-[360px] relative overflow-hidden bg-stone-900">
        <img 
          src="https://yt3.googleusercontent.com/lSeUir4DMrdh5oxragPxEE1s1wR7yu9KZsaZ1p811yXktorVH4h_H4C2TKCKTBgOCoUUZ3-aNQ=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj" 
          alt="Schmatz & Schlürf Banner" 
          className="w-full h-full object-cover"
          onError={(e) => {
             // Fallback to a high-quality kitchen aesthetic if banner fails to load
             (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=2000";
          }}
        />
        {/* Soft butter yellow gradient transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFFCEB] via-transparent to-black/20"></div>
      </div>

      <div className="text-center py-10 px-4 relative -mt-10 md:-mt-16 z-10">
        <h1 className="text-5xl md:text-7xl font-black text-stone-800 mb-4 italic tracking-tight drop-shadow-sm">
          Schmatz <span className="text-amber-500">&</span> Schlürf
        </h1>
        <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto leading-relaxed font-medium italic">
          Guten Appetit! Lass uns dein nächstes Lieblingsessen finden – mit dem, was du noch in deiner Küche hast.
        </p>
      </div>
    </header>
  );
};

export default Header;
