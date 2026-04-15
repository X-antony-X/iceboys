import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase'; // تأكد من مسار ملف الـ supabase عندك
import { Loader2 } from 'lucide-react';

// دالة جلب البيانات من Supabase
const fetchHeroData = async () => {
  const { data, error } = await supabase
    .from('hero_section')
    .select('*')
    .single();
  
  if (error) throw error;
  return data;
};

const HeroSection = () => {
  // استخدام React Query لجلب البيانات
  const { data: heroData, isLoading, isError } = useQuery({
    queryKey: ['hero_section'],
    queryFn: fetchHeroData,
  });

  // حالة التحميل (اختياري: ممكن تسيبها فاضية أو تحط Skeleton)
  if (isLoading) {
    return (
      <div className="min-h-[600px] flex items-center justify-center bg-[#f4f4f4]">
        <Loader2 className="animate-spin text-[#004b93]" size={40} />
      </div>
    );
  }

  // في حالة وجود خطأ أو مفيش بيانات، بنحط قيم افتراضية عشان الموقع ميبوظش
  const content = heroData || {
    badge_text: "Live: Winter Drop '26",
    body: "Streetwear designed to fit your lifestyle. Stand out with the all-new ICE BOYS collection.",
    image_url: "/1.png"
  };

  return (
    <section className="relative min-h-[600px] md:min-h-[800px] flex items-center bg-[#f4f4f4] overflow-hidden">
      
      {/* 1. Background "ICE" Text */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <span className="text-[20vw] md:text-[25vw] font-black text-black/[0.03] italic leading-none uppercase tracking-tighter">
          ICE BOYS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* الجانب الأيسر: المحتوى النصي */}
          <div className="flex-1 text-center md:text-left mt-10 md:mt-0">
            {/* Badge - مسحوب من قاعدة البيانات */}
            <div className="inline-flex items-center gap-2 bg-[#004b93] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              {content.badge_text}
            </div>

            <h1 className="relative text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter text-[#2d2d2d] leading-[0.9]">
              STAY <span className="text-[#004b93]">COLD</span> <br />
              DRIP <span className="relative inline-block">
                HARD
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-red-600/20 -skew-x-12"></span>
              </span>
            </h1>

            {/* Body Text - مسحوب من قاعدة البيانات */}
            <p className="mt-8 text-gray-500 text-lg md:text-xl max-w-lg font-medium leading-relaxed mx-auto md:mx-0">
               {content.body}
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button className="group relative bg-[#2d2d2d] text-white px-12 py-5 font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10">SHOP</span>
                <div className="absolute inset-0 bg-[#004b93] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
              
              <button className="px-12 py-5 font-bold text-lg border-2 border-[#2d2d2d] text-[#2d2d2d] hover:bg-gray-100 transition-all uppercase tracking-tighter">
                NEW ARRIVALS
              </button>
            </div>
          </div>

          {/* الجانب الأيمن: الصورة */}
          <div className="flex-1 relative w-full flex justify-center md:justify-end">
            <div className="relative w-full max-w-[450px] aspect-[4/5]">
              <div className="absolute -top-4 -right-4 w-full h-full border-4 border-[#004b93]/10 -z-10 translate-x-4 translate-y-4"></div>
              
              <div className="w-full h-full bg-[#e0e0e0] overflow-hidden shadow-2xl relative group">
                <img 
                  src={content.image_url} 
                  alt="ICE BOYS Hero" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Logo العائم */}
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-white p-4 shadow-2xl rounded-sm rotate-[-12deg] hidden lg:block border border-gray-100">
                  <img src="/2.png" alt="Ice Boys" className="w-full h-full object-contain" />
              </div>

              {/* Sale Tag */}
              <div className="absolute bottom-10 -right-8 bg-red-600 text-white px-6 py-2 font-black italic -rotate-90 tracking-widest text-sm shadow-xl">
                SALE -30%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </section>
  );
};

export default HeroSection;