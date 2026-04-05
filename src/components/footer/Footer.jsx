import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#121212] pt-16 pb-8 border-t-[4px] border-[#004b93] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        
        {/* قسم النشرة البريدية (Newsletter) */}
        <div className="mb-10 w-full max-w-xl">
          <h2 className="text-xl md:text-2xl font-black tracking-widest text-white uppercase mb-2">
            NEWSLETTER SIGN UP
          </h2>
          <p className="text-gray-400 text-sm md:text-base mb-6">
            Sign up for exclusive Ice Boys updates, new arrivals & insider only discounts.
          </p>

          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="flex flex-col sm:flex-row w-full gap-3 sm:gap-0 relative"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-transparent border border-gray-600 text-white px-5 py-3.5 focus:outline-none focus:border-white transition-colors duration-300 placeholder-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-white text-[#121212] font-black uppercase tracking-widest px-8 py-3.5 hover:bg-[#004b93] hover:text-white transition-all duration-300 border border-white hover:border-[#004b93] sm:ml-2 whitespace-nowrap"
            >
              SUBMIT
            </button>
          </form>
        </div>

        {/* قسم أيقونات السوشيال ميديا */}
        <div className="flex gap-4 mb-12">
          {/* Facebook */}
          <a href="#" className="w-10 h-10 rounded-full border border-gray-600 bg-transparent flex items-center justify-center text-white hover:bg-[#004b93] hover:border-[#004b93] hover:scale-110 transition-all duration-300 group">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 group-hover:text-white">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>

          {/* Instagram */}
          <a href="#" className="w-10 h-10 rounded-full border border-gray-600 bg-transparent flex items-center justify-center text-white hover:bg-[#004b93] hover:border-[#004b93] hover:scale-110 transition-all duration-300 group">
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4 group-hover:text-white">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>

          {/* TikTok */}
          <a href="#" className="w-10 h-10 rounded-full border border-gray-600 bg-transparent flex items-center justify-center text-white hover:bg-[#004b93] hover:border-[#004b93] hover:scale-110 transition-all duration-300 group">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 group-hover:text-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>

          {/* X (Twitter) */}
          <a href="#" className="w-10 h-10 rounded-full border border-gray-600 bg-transparent flex items-center justify-center text-white hover:bg-[#004b93] hover:border-[#004b93] hover:scale-110 transition-all duration-300 group">
            <svg fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 group-hover:text-white">
              <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
            </svg>
          </a>
        </div>

        {/* الخط الفاصل */}
        <div className="w-full h-[1px] bg-gray-800 mb-8"></div>

        {/* اسم البراند وحقوق النشر */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-3">
            ICE BOYS
          </h1>
          <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.2em] uppercase">
            © 2026 ICE BOYS. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;