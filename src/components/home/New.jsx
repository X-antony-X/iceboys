import React from 'react';

const categories = [
  { 
    id: 1, 
    title: 'THE LATEST DROPS', 
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 2, 
    title: 'STREETWEAR STYLE', 
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 3, 
    title: 'NEW FOOTWEAR', 
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 4, 
    title: 'PREMIUM BRANDS', 
    image: 'https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?auto=format&fit=crop&q=80&w=800' 
  },
];

const New = () => {
  const currentYear = new Date().getFullYear();

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header: Title and Shop Now Button */}
        <div className="flex justify-between items-end mb-6 md:mb-10 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter text-[#2d2d2d] uppercase">
              New in
            </h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Ice Boys Collection {currentYear}
            </p>
          </div>
          <button className="bg-[#f3f4f6] text-[#2d2d2d] px-4 md:px-8 py-2 font-bold text-[10px] md:text-xs hover:bg-[#004b93] hover:text-white transition-all uppercase tracking-widest border border-transparent">
            SHOP
          </button>
        </div>

        {/* Grid System: 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative cursor-pointer overflow-hidden bg-gray-100 aspect-[3/4]">
              {/* Image */}
              <img 
                src={cat.image} 
                alt={cat.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Gradient Overlay - اغمق شوية عشان الكلام يوضح */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
              
              {/* Category Title - تظبيط الخط للموبايل */}
              <div className="absolute inset-0 flex items-end justify-center pb-4 md:pb-8 px-2 text-center">
                <h3 className="text-white font-bold text-[11px] sm:text-xs md:text-lg leading-tight tracking-widest uppercase drop-shadow-lg group-hover:text-[#004b93] transition-colors">
                  {cat.title}
                </h3>
              </div>

              {/* Hover Effect Frame */}
              <div className="absolute inset-0 border-0 group-hover:border-[6px] border-white/20 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default New;