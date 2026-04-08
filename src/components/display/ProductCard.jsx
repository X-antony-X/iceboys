import React from 'react';
import { Heart, Eye, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product, viewMode }) {
  const isList = viewMode === 'list';

  return (
    <div className={`group flex ${isList ? 'flex-col sm:flex-row gap-6 sm:gap-8 items-center border-b border-gray-100 pb-8' : 'flex-col'} w-full bg-white transition-all duration-300`}>
      
      {/* حاوية الصورة */}
      <div className={`relative overflow-hidden bg-[#f8f9fa] rounded-sm ${isList ? 'w-full sm:w-1/3 max-w-[280px]' : 'w-full'} aspect-[4/5]`}>
        {/* الصور */}
        <img 
          src={product.mainImage} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <img 
          src={product.hoverImage} 
          alt={`${product.name} hover`} 
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100 hidden lg:block"
        />

        {/* أيقونات التفاعل (بتكون ظاهرة في الموبايل ومخفية في الديسكتوب لحد الـ Hover) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 z-30">
          <button className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-gray-500 hover:bg-[#004b93] hover:text-white shadow-sm transition-all duration-300">
            <Heart size={16} />
          </button>
          <button className="hidden lg:flex w-10 h-10 bg-white rounded-full items-center justify-center text-gray-500 hover:bg-[#004b93] hover:text-white shadow-sm transition-all duration-300">
            <Eye size={16} />
          </button>
        </div>

        {/* المقاسات - تظهر عند الـ Hover في الديسكتوب فقط (lg) */}
        {!isList && (
          <div className="hidden lg:flex absolute bottom-16 left-0 w-full justify-center gap-1.5 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-20">
            {product.sizes.map(size => (
              <span key={size} className="w-9 h-9 bg-white/90 backdrop-blur-sm text-[#2d2d2d] text-[11px] font-bold flex items-center justify-center rounded-full shadow-sm hover:bg-[#004b93] hover:text-white cursor-pointer transition-all border border-gray-100">
                {size}
              </span>
            ))}
          </div>
        )}

        {/* زرار Quick Add - يظهر كطبقة في الديسكتوب فقط (lg) */}
        {!isList && (
          <button className="hidden lg:flex absolute bottom-0 left-0 w-full bg-[#004b93] text-white font-bold text-[11px] tracking-widest py-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 hover:bg-[#2d2d2d] items-center justify-center gap-2 z-30">
            <ShoppingBag size={14} />
            QUICK ADD
          </button>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div className={`mt-4 w-full ${isList ? 'flex-1 text-center sm:text-left' : 'text-center'}`}>
        <h3 className="text-[#2d2d2d] text-[13px] md:text-[15px] font-bold uppercase tracking-tight lg:group-hover:text-[#004b93] transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        {isList && (
          <p className="text-gray-500 text-sm mt-3 leading-relaxed max-w-xl mx-auto sm:mx-0">
            {product.description}
          </p>
        )}

        <div className={`mt-1.5 flex items-center ${isList ? 'justify-center sm:justify-start' : 'justify-center'} gap-3`}>
          <p className="text-[#004b93] font-black text-sm md:text-lg tracking-wide">
            LE {product.price.toFixed(2)}
          </p>
        </div>

        {/* 🚀 الحل للموبايل والشاشات الصغيرة: المقاسات وزر الشراء الثابت 🚀 */}
        {!isList && (
          <div className="flex flex-col lg:hidden mt-3 gap-3 w-full">
            {/* المقاسات في الموبايل */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {product.sizes.map(size => (
                <button key={size} className="w-8 h-8 md:w-9 md:h-9 border border-gray-200 bg-[#f8f9fa] text-gray-700 text-[10px] md:text-[11px] font-bold flex items-center justify-center rounded-sm hover:bg-[#004b93] hover:text-white hover:border-[#004b93] transition-colors">
                  {size}
                </button>
              ))}
            </div>
            
            {/* زر الشراء المباشر في الموبايل */}
            <button className="w-full bg-[#2d2d2d] text-white py-2.5 text-[11px] font-bold tracking-widest flex items-center justify-center gap-2 rounded-sm active:scale-95 transition-all">
              <ShoppingBag size={14} />
              ADD TO CART
            </button>
          </div>
        )}
        
        {/* تصميم وضع الـ List الخاص بالديسكتوب */}
        {isList && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sizes:</span>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
                {product.sizes.map(size => (
                  <button key={size} className="w-9 h-9 md:w-10 md:h-10 border border-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 hover:border-[#004b93] hover:text-[#004b93] hover:bg-[#f8f9fa] rounded-sm transition-all">
                    {size}
                  </button>
                ))}
              </div>
            </div>
            
            <button className="w-full sm:w-auto bg-[#004b93] text-white px-8 py-3 text-[11px] md:text-[12px] font-bold tracking-widest hover:bg-[#2d2d2d] transition-all flex items-center justify-center gap-3 rounded-sm">
              <ShoppingBag size={16} />
              ADD TO CART
            </button>
          </div>
        )}
      </div>
    </div>
  );
}