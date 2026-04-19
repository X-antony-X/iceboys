import { Loader } from 'lucide-react';
import React from 'react';
// استيراد الأيقونات من مكتبة react-icons
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6'; 

const ContactSection = () => {
  return (
    // الحاوية أصبحت تمنع التمرير الأفقي (overflow-x-hidden) وتأخذ العرض بالكامل (w-full)
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 sm:px-6 w-full max-w-full overflow-x-hidden bg-gradient-to-b from-white to-gray-50 text-center min-h-[60vh]">
      
      {/* العنوان: يبدأ بحجم 3xl للموبايل ويكبر حتى 5xl للشاشات الكبيرة */}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 sm:mb-6 tracking-tight transition-transform duration-500 hover:scale-105">
        Get in Touch with <span className="text-blue-600">Ice Boys</span>
      </h2>


      {/* النصوص الوصفية: تحديد عرض أقصى لضمان عدم تمدد النص بشكل سيء */}
      <div className="mb-8 sm:mb-10 space-y-3 w-full max-w-md mx-auto">
        <p className="text-gray-500 text-base sm:text-lg px-2">
          Have a question or need help? We're here for you.
        </p>
        <p className="text-blue-600 font-semibold text-xs sm:text-sm bg-blue-50 inline-block px-3 sm:px-4 py-2 rounded-full animate-pulse border border-blue-100">
          We usually reply within 24 hours.
        </p>
      </div>

      {/* زر الواتساب: عرض مرن يتكيف مع الشاشات الصغيرة ولا يتخطى الشاشة */}
      <a 
        href="https://wa.me/yournumber" // ضع رقمك هنا
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 sm:gap-3 bg-blue-600 text-white font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-full mb-10 sm:mb-12 hover:bg-blue-700 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all duration-300 hover:-translate-y-1 tracking-widest text-xs sm:text-sm uppercase w-[90%] sm:w-auto max-w-xs"
      >
        <FaWhatsapp className="text-xl sm:text-2xl" />
        WHATSAPP
      </a>

      {/* الأيقونات: استخدام flex-wrap وتقليل الـ gap والـ padding على الموبايل */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 w-full px-2">
        <a href="https://www.facebook.com/ICBOYS" className="p-3 sm:p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:-translate-y-2 shadow-sm">
          <FaFacebookF className="text-lg sm:text-xl" />
        </a>
        <a href="https://www.instagram.com/iceboys.icb?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" className="p-3 sm:p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:-translate-y-2 shadow-sm">
          <FaInstagram className="text-xl sm:text-2xl" />
        </a>
        <a href="#" className="p-3 sm:p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:-translate-y-2 shadow-sm">
          <FaTiktok className="text-lg sm:text-xl" />
        </a>
        <a href="#" className="p-3 sm:p-4 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:-translate-y-2 shadow-sm">
          <FaXTwitter className="text-lg sm:text-xl" />
        </a>
      </div>
    </div>
  );
};

export default ContactSection;