import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase'; // تأكد من مسار ملف الـ supabase عندك

// دالة جلب البيانات من قاعدة البيانات
const fetchOffers = async () => {
  // نجلب المنتجات التي لا يكون فيها السعر المخفض فارغاً (أي عليها عرض)
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .not('sale_price', 'is', null);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

const Offers = () => {
  const currentYear = new Date().getFullYear();

  // استخدام React Query لإدارة حالة جلب البيانات
  const { data: offers, isLoading, isError, error } = useQuery({
    queryKey: ['offers'], // مفتاح فريد لهذا الاستعلام
    queryFn: fetchOffers, // الدالة التي تقوم بجلب البيانات
  });

  return (
    <section className="bg-white py-10 md:py-16 overflow-hidden">
      {/* إضافة تنسيق بسيط لشريط التمرير ليكون أنيقاً ورفيعاً 
        يمكنك أيضاً وضع هذه التنسيقات في ملف index.css الخاص بك
      */}
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 6px; /* ارتفاع شريط التمرير */
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1; 
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1; 
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8; 
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header: Title and Shop Now Button */}
        <div className="flex justify-between items-end mb-6 md:mb-10 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter text-[#2d2d2d] uppercase">
              offers & collections
            </h2>
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Ice Boys offers {currentYear}
            </p>
          </div>
          <Link to="/new-arrivals" className="bg-[#f3f4f6] text-[#2d2d2d] px-4 md:px-8 py-2 font-bold text-[10px] md:text-xs hover:bg-[#004b93] hover:text-white transition-all uppercase tracking-widest border border-transparent">
            SHOP
          </Link>
        </div>

        {/* التعامل مع حالات التحميل والخطأ */}
        {isLoading && <p className="text-center text-gray-500">جاري تحميل العروض...</p>}
        {isError && <p className="text-center text-red-500">حدث خطأ: {error.message}</p>}

        {/* عرض المنتجات إذا تم جلبها بنجاح */}
        {!isLoading && !isError && offers && offers.length > 0 && (
          /* حاوية التمرير الأفقي:
            - flex: لعرض العناصر بجانب بعضها
            - overflow-x-auto: لتفعيل التمرير الأفقي
            - gap-4: مسافة بين العناصر
            - snap-x: لجعل التمرير يقف عند بداية كل عنصر بسلاسة
          */
          <div className="flex overflow-x-auto gap-4 md:gap-6 pb-6 custom-scrollbar snap-x snap-mandatory">
            {offers.map((product) => {
              // استخراج أول صورة من مصفوفة الصور أو وضع صورة افتراضية
              const mainImage = product.image_urls && product.image_urls.length > 0 
                ? product.image_urls[0] 
                : 'https://via.placeholder.com/300x400?text=No+Image';

              return (
                <div 
                  key={product.id} 
                  // تحديد عرض الكارت ليناسب الشاشات الصغيرة والكبيرة
                  className="group relative cursor-pointer flex-none w-[200px] md:w-[280px] snap-start flex flex-col"
                >
                  {/* حاوية الصورة */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3">
                    {/* شارة التخفيض (Sale Badge) */}
                    <div className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      Sale
                    </div>
                    <img 
                      src={mainImage} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* تأثير الإطار عند التمرير بالماوس */}
                    <div className="absolute inset-0 border-0 group-hover:border-[6px] border-white/20 transition-all duration-300"></div>
                  </div>

                  {/* تفاصيل المنتج */}
                  <div className="flex flex-col">
                    <h3 className="text-sm md:text-base font-bold text-gray-800 truncate">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {/* السعر بعد الخصم */}
                      <span className="text-red-600 font-black text-sm md:text-base">
                        ${product.sale_price}
                      </span>
                      {/* السعر القديم مشطوب */}
                      <span className="text-gray-400 text-xs md:text-sm line-through">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* رسالة في حال عدم وجود عروض */}
        {!isLoading && !isError && offers && offers.length === 0 && (
          <p className="text-center text-gray-500">لا توجد عروض متاحة حالياً.</p>
        )}

      </div>
    </section>
  );
};

export default Offers;