import React from 'react';

function NotFoundPage() {
  return (
    // الحاوية الرئيسية تمتد على كامل الشاشة مع خلفية رمادية فاتحة
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 font-sans text-center relative overflow-hidden">
      
      {/* تأثير إضاءة أزرق خفيف في الخلفية لزيادة الأناقة (اختياري) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="z-10 flex flex-col items-center max-w-xl">
        {/* رقم 404 بحجم كبير ولون أزرق */}
        <h1 className="text-9xl md:text-[150px] font-black text-blue-600 tracking-tighter mb-2 md:mb-6 drop-shadow-sm">
          404
        </h1>

        {/* العنوان مع تأثير التظليل الأزرق خلفه */}
        <div className="relative mb-6">
          <span className="absolute inset-x-0 bottom-1 md:bottom-2 h-4 md:h-6 bg-blue-100 -z-10 transform -skew-x-6 rounded-sm"></span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 relative z-0">
            Oops! Page Not Found
          </h2>
        </div>

        {/* النص الوصفي */}
        <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed max-w-md">
          Sorry! The page you're looking for clocked out or might have been moved. Let's get you back on track.
        </p>

        {/* زر العودة للمتجر */}
        <button 
          onClick={() => window.location.href = '/'} 
          className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-xl hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 active:transform active:scale-95"
        >
          Return to Store
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2 -mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;