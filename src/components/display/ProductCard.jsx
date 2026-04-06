import React from 'react';

export default function ProductCard({ product, viewMode }) {
  const isList = viewMode === 'list';

  return (
    <div className={`group flex ${isList ? 'flex-row gap-8 items-center border-b pb-6' : 'flex-col'} w-full`}>
      {/* حاوية الصورة (بها كل حركات الـ Hover) */}
      <div className={`relative overflow-hidden bg-gray-100 ${isList ? 'w-1/3' : 'w-full'} aspect-[4/5]`}>
        {/* الصورة الأساسية */}
        <img 
          src={product.mainImage} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* الصورة البديلة (تظهر عند الـ Hover) */}
        <img 
          src={product.hoverImage} 
          alt={`${product.name} hover`} 
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* أيقونات الجنب (قلب وعين) */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-800 shadow-md">
            ♥
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-blue-800 shadow-md">
            👁
          </button>
        </div>

        {/* المقاسات (تظهر فقط في الـ Grid) */}
        {!isList && (
          <div className="absolute bottom-16 left-0 w-full flex justify-center gap-2 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 z-10">
            {product.sizes.map(size => (
              <span key={size} className="w-8 h-8 bg-white text-gray-800 text-xs font-bold flex items-center justify-center rounded-full shadow hover:bg-blue-800 hover:text-white cursor-pointer transition-colors">
                {size}
              </span>
            ))}
          </div>
        )}

        {/* زرار الإضافة السريعة (في الـ Grid بيكون تحت وبيطلع لفوق) */}
        {!isList && (
          <button className="absolute bottom-0 left-0 w-full bg-white text-gray-900 font-semibold py-3 border-t translate-y-full transition-transform duration-300 group-hover:translate-y-0 hover:bg-gray-50 z-20">
            QUICK ADD
          </button>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div className={`mt-4 ${isList ? 'w-2/3 mt-0 text-left' : 'text-center'}`}>
        <h3 className="text-gray-800 text-sm md:text-base font-medium">{product.name}</h3>
        {isList && <p className="text-gray-500 text-sm mt-2 max-w-md">{product.description}</p>}
        <p className="text-gray-900 font-bold mt-2">LE {product.price.toFixed(2)}</p>
        
        {/* أزرار ومقاسات خاصة بوضع الـ List */}
        {isList && (
          <div className="mt-6">
            <button className="bg-gray-100 border border-gray-300 text-gray-800 px-8 py-3 font-semibold hover:bg-gray-200 transition-colors">
              QUICK ADD
            </button>
            <p className="text-xs text-gray-400 mt-4 uppercase">More sizes available</p>
          </div>
        )}
      </div>
    </div>
  );
}