import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiX, FiLoader } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const SearchBar = ({ isOpen, setIsOpen }) => {
  const [inputValue, setInputValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // --- 1. منع السكرول عند فتح البحث ---
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Reset search when opened
      setInputValue('');
      setDebouncedSearch('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // --- 2. تقنية Debouncing لتقليل الطلبات على قاعدة البيانات ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 400); // ينتظر 400 ملي ثانية بعد توقف المستخدم عن الكتابة
    return () => clearTimeout(timer);
  }, [inputValue]);

  // --- 3. جلب البيانات باستخدام React Query ---
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['search_products', debouncedSearch],
    queryFn: async () => {
      let query = supabase.from('products').select('*');

      if (debouncedSearch) {
        // البحث في الاسم أو الفئة
        query = query.or(`name.ilike.%${debouncedSearch}%,category.ilike.%${debouncedSearch}%`);
      } else {
        // إذا لم يكن هناك بحث، اجلب المنتجات الشائعة (أحدث 8 منتجات كمثال)
        query = query.order('created_at', { ascending: false }).limit(8);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: isOpen, // تفعيل الاستعلام فقط إذا كانت نافذة البحث مفتوحة
  });

  // --- 4. إغلاق البحث وتصفير الحقول ---
  const handleClose = () => {
    setIsOpen(false);
    setInputValue('');
  };

  const trendingTags = ['hoodies', 'pants', 'shorts', 't-shirts', 'oversize'];

  return (
    <>
      {/* Search Icon for Mobile Trigger */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="md:hidden text-[#2d2d2d] text-2xl p-1 active:scale-90 transition-transform"
      >
        <FiSearch />
      </button>

      {/* Desktop Static Search (يظل مكانه الطبيعي في الهيدر لفتح الـ Overlay) */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative cursor-text" onClick={() => setIsOpen(true)}>
        <input
          type="text"
          readOnly
          placeholder="Search for items..."
          className="w-full py-2 px-5 pr-10 rounded-full bg-[#f2f2f2] text-sm border border-transparent outline-none cursor-text"
        />
        <FiSearch className="absolute right-3 top-2.5 text-gray-500 text-lg" />
      </div>

      {/* Mobile & Desktop Search Overlay (Portal) */}
      {isOpen && createPortal(
        <div className="fixed inset-0 bg-white z-[10000] flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Header of Search */}
          <div className="border-b border-gray-100 px-4 py-4 md:px-10 flex items-center justify-between gap-4 bg-white sticky top-0 z-10">
            <Link to="/" onClick={handleClose} className="hidden md:block font-black text-2xl tracking-tighter text-[#004b93]">
              LAVA
            </Link>

            <div className="relative flex-1 max-w-3xl mx-auto flex items-center border-b-2 border-gray-200 focus-within:border-[#004b93] transition-colors pb-2">
              <input
                autoFocus
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-transparent outline-none text-lg md:text-xl text-gray-900 placeholder-gray-400 pl-2"
              />
              {isLoading ? (
                <FiLoader className="text-gray-400 text-2xl animate-spin" />
              ) : (
                <FiSearch className="text-gray-400 text-2xl" />
              )}
            </div>
            
            <button 
              onClick={handleClose} 
              className="text-3xl p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
            >
              <FiX />
            </button>
          </div>

          {/* Search Content */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-[1400px] mx-auto p-4 md:p-10">
              
              {/* Trending Tags (تظهر فقط إذا لم يكتب المستخدم شيئاً) */}
              {!inputValue && (
                <div className="mb-10">
                  <h4 className="text-sm font-black text-gray-900 mb-4 tracking-wide">Trending Now</h4>
                  <div className="flex flex-wrap gap-3">
                    {trendingTags.map(tag => (
                      <button 
                        key={tag} 
                        onClick={() => setInputValue(tag)}
                        className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-sm text-sm font-bold text-gray-600 flex items-center gap-2 transition-colors"
                      >
                        <FiSearch className="text-gray-400" /> {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products Results Title */}
              <div className="mb-6">
                <h4 className="text-sm font-black text-gray-900 tracking-wide border-b border-gray-100 pb-3">
                  {inputValue ? 'Product Results' : 'Popular Products'}
                </h4>
              </div>

              {/* States Handling */}
              {isError && (
                <div className="text-center py-20 text-red-500 font-bold">
                  Oops! Something went wrong while fetching products.
                </div>
              )}

              {!isLoading && products?.length === 0 && (
                <div className="text-center py-20">
                  <FiSearch className="text-5xl text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 font-bold text-lg">No results found for "{inputValue}"</p>
                  <button onClick={() => setInputValue('')} className="mt-4 text-[#004b93] font-bold underline">
                    Clear search
                  </button>
                </div>
              )}

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-8">
                {products?.map((product) => (
                  <Link 
                    to={`/product/${product.id}`} 
                    key={product.id} 
                    onClick={handleClose}
                    className="flex flex-col group cursor-pointer"
                  >
                    {/* Image Container */}
                    <div className="aspect-[3/4] bg-[#f8f8f8] relative overflow-hidden mb-4 flex items-center justify-center">
                      <img 
                        src={product.image_urls?.[0] || 'https://via.placeholder.com/400x500?text=No+Image'} 
                        alt={product.name} 
                        className="object-cover w-full h-full mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* محاكاة وسم الخصم (Sale) يمكن تعديل شرطه بناءً على الداتا */}
                      {product.price < 300 && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest">
                          Sale
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="text-center flex flex-col flex-1 justify-between">
                      <div>
                        <h5 className="text-[13px] text-gray-800 font-medium mb-2 line-clamp-1">{product.name}</h5>
                        <div className="flex items-center justify-center gap-2 font-black text-[14px]">
                          <span className="text-gray-900">LE {product.price}</span>
                          {/* يمكن إضافة سعر مشطوب هنا إن وجد في المستقبل */}
                        </div>
                      </div>
                      
                      {/* More Sizes Indicator */}
                      {product.sizes && Object.keys(product.sizes).length > 0 && (
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-3 block">
                          More sizes available
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

            </div>
          </div>

          {/* Sticky Footer for "View All Results" */}
          {inputValue && products?.length > 0 && (
            <div className="border-t border-gray-100 p-4 bg-white flex justify-center">
              <Link 
                to={`/search?q=${debouncedSearch}`} 
                onClick={handleClose}
                className="text-[12px] font-black tracking-widest uppercase text-gray-900 border-b-2 border-gray-900 pb-1 hover:text-[#004b93] hover:border-[#004b93] transition-colors"
              >
                View All Results ({products.length})
              </Link>
            </div>
          )}

        </div>,
        document.body
      )}
    </>
  );
};

export default SearchBar;