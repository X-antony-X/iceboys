import React from 'react';
import Loader1 from "../loaders/Loader1"

const AboutIceBoys = () => {
  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans overflow-x-hidden">
      
      {/* 1. Hero Section - The First Impression */}
      <section className="relative py-20 lg:py-32 flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4">
        {/* Animated Background Element */}
        <div className="absolute top-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-slate-900 tracking-tighter mb-6 relative text-center">
          ABOUT <span className="text-blue-600 drop-shadow-[0_0_15px_rgba(37,99,235,0.3)]">ICE BOYS</span>
        </h1>
        <Loader1 />
        <p className="text-lg md:text-2xl text-slate-500 max-w-2xl text-center font-medium leading-relaxed">
          Redefining the standard of cool. Bold designs for a colder generation. 
          <span className="block text-blue-500 mt-2 font-bold tracking-widest">EST. 2026</span>
        </p>
      </section>

      {/* 2. The Story Section - Creative Narrative */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-full">
              Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Crafting a legacy in the <span className="text-blue-600">Deep Freeze.</span>
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              The <span className="font-bold text-slate-900">Ice Boys</span> journey started with a simple vision: How do we maintain absolute composure and sharp style in a world that's constantly overheating? 
            </p>
            <p className="text-gray-600 leading-relaxed text-lg">
              We don't just drop products; we curate a lifestyle for those who dare to stand out—cold in their demeanor, yet burning with ambition. Born in the streets, refined in the chill.
            </p>
          </div>
          
          {/* Decorative "Ice" Box Card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-1000"></div>
            <div className="relative bg-white border border-blue-100 p-10 rounded-2xl shadow-2xl transform transition duration-500 hover:scale-[1.02]">
              <h3 className="text-6xl font-black text-blue-50 absolute top-4 right-6 pointer-events-none">FROST</h3>
              <p className="italic text-slate-600 text-xl font-medium leading-relaxed relative z-10">
                "In the heart of the chaos, we remain the frost. Unshakable, unbreakable, and undeniably cool."
              </p>
              <footer className="mt-6 flex items-center gap-3 font-bold text-blue-600 uppercase tracking-tighter">
                <div className="w-8 h-[2px] bg-blue-600"></div>
                The Ice Boys Crew
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Values Section - The Core DNA */}
      <section className="py-24 bg-slate-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 uppercase tracking-tight">The DNA</h2>
            <p className="text-slate-400 font-medium">What makes us colder than the rest.</p>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Value 1: Freshness */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                <span className="text-blue-600 group-hover:text-white font-black text-xl">01</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">Freshness</h4>
              <p className="text-slate-500 leading-relaxed font-medium">
                We are constantly pushing boundaries, delivering fresh designs and innovative ideas that stay years ahead of the curve.
              </p>
            </div>

            {/* Value 2: Durability */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                <span className="text-blue-600 group-hover:text-white font-black text-xl">02</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">Durability</h4>
              <p className="text-slate-500 leading-relaxed font-medium">
                Built like a glacier. Our quality is engineered to withstand the test of time and the harshest conditions without fading.
              </p>
            </div>

            {/* Value 3: Community */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 transition-colors duration-500">
                <span className="text-blue-600 group-hover:text-white font-black text-xl">03</span>
              </div>
              <h4 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors">Community</h4>
              <p className="text-slate-500 leading-relaxed font-medium">
                Join the frost. We aren't just a brand; we are a collective movement of individuals who embrace the "Cold Mindset."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Internal CSS for the Blob Animation */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(40px, -60px) scale(1.15); }
          66% { transform: translate(-30px, 30px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AboutIceBoys;