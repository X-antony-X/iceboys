import React, { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase'; 

// ==========================================
// 1. مكون القسم الفردي (ProductSection)
// ==========================================
const ProductSection = ({ title, products }) => {
  const scrollRef = useRef(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [activeDot, setActiveDot] = useState(0);

  // تحديث حالة الأسهم والنقط مع كل حركة سكرول
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      
      setIsAtStart(scrollLeft <= 1);
      setIsAtEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);

      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const currentDot = Math.round(progress * (products.length - 1));
      setActiveDot(currentDot);
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      handleScroll(); 
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-16 relative">
      {/* خط العنوان الجانبي */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex-grow h-[1px] bg-gray-300"></div>
        <h2 className="px-6 text-xl md:text-2xl font-black italic tracking-tighter text-[#004b93] uppercase">
          {title}
        </h2>
        <div className="flex-grow h-[1px] bg-gray-300"></div>
      </div>

      <div className="relative group">
        {/* سهم الشمال */}
        <button 
          onClick={() => scroll('left')}
          className={`hidden md:flex absolute left-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 items-center justify-center rounded-full shadow-md transition-all duration-300 hover:bg-[#004b93] hover:text-white hover:border-[#004b93] ${isAtStart ? 'opacity-0 pointer-events-none' : 'opacity-100 text-[#2d2d2d]'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* سهم اليمين */}
        <button 
          onClick={() => scroll('right')}
          className={`hidden md:flex absolute right-4 top-[40%] -translate-y-1/2 z-20 w-10 h-10 bg-white border border-gray-200 items-center justify-center rounded-full shadow-md transition-all duration-300 hover:bg-[#004b93] hover:text-white hover:border-[#004b93] ${isAtEnd ? 'opacity-0 pointer-events-none' : 'opacity-100 text-[#2d2d2d]'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* حاوية التقليب (Slider) */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 md:px-1"
        >
          {products.map((product) => (
            /* تم تغيير الـ div هنا إلى Link مع إضافة المسار /product/${product.id}
               وإضافة display: block ليحتفظ بنفس شكل التصميم
            */
            <Link 
              to={`/product/${product.id}`} 
              key={product.id} 
              className="block group/item cursor-pointer flex-none w-[65%] sm:w-[45%] md:w-[23%] snap-start"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#f8f9fa] mb-4 relative rounded-md shadow-sm">
                
                {/* علامة الخصم (إذا كان هناك سعر مخفض) */}
                {product.sale_price && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10">
                    SALE
                  </span>
                )}

                {/* الصور */}
                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-100 group-hover/item:opacity-0" />
                {product.hoverImage && (
                  <img src={product.hoverImage} alt={product.name} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover/item:opacity-100" />
                )}

                {/* المقاسات */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-sm translate-y-full group-hover/item:translate-y-0 transition-transform duration-300 py-3 px-2 flex justify-center items-center gap-2 border-t border-gray-100">
                    {product.sizes.map((size, index) => (
                      <span key={index} className="text-[11px] font-bold text-[#2d2d2d] hover:text-[#004b93] transition-transform cursor-pointer">
                        {size}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* بيانات المنتج */}
              <div className="text-center md:text-left px-1">
                <h3 className="text-[12px] md:text-sm font-bold text-[#2d2d2d] mb-1 uppercase truncate" title={product.name}>
                  {product.name}
                </h3>
                
                {/* عرض السعر (مع أو بدون خصم) */}
                <div className="flex gap-2 items-center justify-center md:justify-start">
                  {product.sale_price ? (
                    <>
                      <span className="text-[13px] md:text-sm font-bold text-red-600">{product.sale_price} LE</span>
                      <span className="text-[11px] md:text-xs font-medium text-gray-400 line-through">{product.price} LE</span>
                    </>
                  ) : (
                    <span className="text-[13px] md:text-sm font-bold text-gray-600">{product.price} LE</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* النقط (Dots Navigation) - نعرضها فقط إذا كانت المنتجات أكثر من 4 */}
      {products.length > 4 && (
        <div className="flex justify-center gap-2 mt-4 overflow-hidden">
          {products.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                activeDot === index ? 'bg-[#2d2d2d]' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}

      {/* زرار عرض المزيد */}
      <div className="w-full mt-6 flex justify-center md:justify-start px-4 md:px-0">
        <Link to={`/category/${title.toLowerCase()}`} className="w-full md:w-auto px-12 py-3 bg-white border border-gray-300 text-[#2d2d2d] text-[11px] md:text-xs font-black uppercase tracking-widest hover:bg-[#004b93] hover:text-white hover:border-[#004b93] transition-all duration-300 text-center text-decoration-none">
          Discover All {title}
        </Link>
      </div>
    </div>
  );
};

// ==========================================
// 2. المكون الرئيسي (Sections) وجلب البيانات
// ==========================================
const Sections = () => {
  // دالة جلب البيانات باستخدام Supabase
  const fetchProductsData = async () => {
    // 1. جلب كل المنتجات من جدول products
    const { data: products, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      throw new Error(error.message);
    }

    // 2. تجميع المنتجات بناءً على الفئة (category)
    const groupedByCategory = products.reduce((acc, product) => {
      const categoryName = product.category || 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      
      // تجهيز بيانات المنتج لتناسب التصميم
      acc[categoryName].push({
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price, // تم إضافة السعر المخفض
        // استخدام أول صورة كصورة أساسية، والثانية (إن وجدت) عند الـ hover
        image: product.image_urls && product.image_urls.length > 0 ? product.image_urls[0] : 'https://via.placeholder.com/500x700?text=No+Image',
        hoverImage: product.image_urls && product.image_urls.length > 1 ? product.image_urls[1] : (product.image_urls?.[0] || ''),
        // استخراج المقاسات من مصفوفة الـ JSON
        sizes: product.sizes ? product.sizes.map(s => s.size) : []
      });
      
      return acc;
    }, {});

    // 3. فلترة الفئات التي تحتوي على أكثر من 5 منتجات، وأخذ 6 فئات كحد أقصى
    const filteredAndLimitedCategories = Object.keys(groupedByCategory)
      .filter(category => groupedByCategory[category].length > 5) // أكثر من 5 منتجات
      .slice(0, 6) // عرض 6 فئات فقط
      .map(category => ({
        id: category,
        title: category,
        products: groupedByCategory[category]
      }));

    return filteredAndLimitedCategories;
  };

  // استخدام React Query للتعامل مع الحالة (Loading, Error, Data)
  const { data: sectionsData, isLoading, isError, error } = useQuery({
    queryKey: ['groupedProducts'],
    queryFn: fetchProductsData,
  });

  // حالة التحميل (Skeleton Loader)
  if (isLoading) {
    return (
      <section className="bg-white py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse flex flex-col gap-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-8"></div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="w-[65%] sm:w-[45%] md:w-[23%] flex-none">
                  <div className="aspect-[3/4] bg-gray-200 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // حالة الخطأ
  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 font-bold">
        حدث خطأ أثناء تحميل البيانات: {error.message}
      </div>
    );
  }

  // حالة عدم وجود فئات تطابق الشروط
  if (!sectionsData || sectionsData.length === 0) {
    return null; // لا نعرض شيئاً إذا لم يكن هناك منتجات كافية
  }

  return (
    <section className="bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sectionsData.map((section) => (
          <ProductSection key={section.id} title={section.title} products={section.products} />
        ))}
      </div>
    </section>
  );
};

export default Sections;