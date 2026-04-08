import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, X, Minus, Plus, Bell } from 'lucide-react';
import { useCart } from '../header/CartProvider';
import { useWishlist } from '../header/WishlistProvider';

export default function ProductCard({ product, viewMode }) {
  const isList = viewMode === 'list';
  
  const { addToWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  // States للتحكم في الإضافة السريعة
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  // دالة لمعرفة مخزون المقاس
  const getStock = (size) => {
    if (product.inventory) return product.inventory[size] || 0;
    if (size === 'XL' || size === '2XL') return 0; 
    return 10;
  };

  const isOutOfStock = selectedSize ? getStock(selectedSize) === 0 : false;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    handleCloseQuickAdd();
  };

  const handleOpenQuickAdd = () => {
    setShowQuickAdd(true);
    setSelectedSize(null);
    setQuantity(1);
  };

  const handleCloseQuickAdd = () => {
    setShowQuickAdd(false);
    setSelectedSize(null);
  };

  return (
    <div className={`group flex ${isList ? 'flex-col sm:flex-row gap-4 sm:gap-8 items-center border-b border-gray-100 pb-6 sm:pb-8' : 'flex-col'} w-full bg-white transition-all duration-300 relative`}>
      
      {/* حاوية الصورة (جعلتها Relative عشان الـ Overlay يكون جواها بالضبط) */}
      <div className={`relative overflow-hidden bg-[#f8f9fa] rounded-sm ${isList ? 'w-full sm:w-1/3 max-w-[280px]' : 'w-full'} aspect-[4/5]`}>
        
        {/* الصور الأساسية */}
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

        {/* 🚀 نافذة الإضافة السريعة (Quick Add Overlay) - Responsive Fix 🚀 */}
        <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 sm:p-6 transition-all duration-300 ${showQuickAdd ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <button 
            onClick={handleCloseQuickAdd}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-[#2d2d2d] transition-colors p-1"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>

          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 sm:mb-3 text-center">
            {selectedSize ? `Size: ${selectedSize}` : 'Select a Size'}
          </span>

          {/* اختيار المقاسات - متجاوب مع الشاشات الصغيرة جداً */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 w-full px-1">
            {product.sizes.map(size => {
              const stock = getStock(size);
              const isOOS = stock === 0;
              return (
                <button 
                  key={size} 
                  onClick={() => {
                    setSelectedSize(size);
                    setQuantity(1);
                  }}
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-sm transition-all border ${
                    selectedSize === size 
                      ? 'border-[#004b93] bg-[#004b93] text-white shadow-md' 
                      : isOOS 
                        ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-[#004b93]'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>

          {/* التحكم في الكمية */}
          {selectedSize && !isOutOfStock && (
            <div className="flex items-center justify-between border border-gray-200 rounded-sm w-full max-w-[120px] sm:max-w-[160px] mb-4 sm:mb-6 bg-white h-8 sm:h-10">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-[#004b93] transition-colors"
              >
                <Minus size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="text-xs sm:text-sm font-bold text-[#2d2d2d]">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(getStock(selectedSize), q + 1))}
                className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-[#004b93] transition-colors"
              >
                <Plus size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          )}

          {/* أزرار الإضافة أو التنبيه - بحجم متجاوب */}
          <div className="flex w-full gap-2 sm:gap-3 mt-auto flex-col xs:flex-row">
            <button 
              onClick={handleCloseQuickAdd}
              className="flex-1 border border-gray-200 text-gray-500 py-2 sm:py-3 text-[10px] sm:text-[11px] font-black tracking-widest uppercase hover:bg-gray-50 transition-colors rounded-sm hidden xs:block"
            >
              Cancel
            </button>
            
            {isOutOfStock ? (
              <button className="flex-[2] w-full bg-[#2d2d2d] text-white py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors rounded-sm">
                <Bell size={12} className="sm:w-3.5 sm:h-3.5" />
                Notify Me
              </button>
            ) : (
              <button 
                disabled={!selectedSize}
                onClick={handleAddToCart}
                className={`flex-[2] w-full py-2.5 sm:py-3 text-[10px] sm:text-[11px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 sm:gap-2 rounded-sm transition-all ${
                  selectedSize 
                    ? 'bg-[#004b93] text-white hover:bg-[#00366b] shadow-md cursor-pointer' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" />
                Add
              </button>
            )}
          </div>
        </div>

        {/* الأيقونات الثابتة */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex flex-col gap-2 opacity-100 translate-x-0 lg:opacity-0 lg:translate-x-4 transition-all duration-300 lg:group-hover:opacity-100 lg:group-hover:translate-x-0 z-20">
          <button 
            onClick={() => addToWishlist(product)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
              isFavorite ? 'bg-[#004b93] text-white' : 'bg-white text-gray-500 hover:bg-[#004b93] hover:text-white'
            }`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
          <button className="hidden lg:flex w-10 h-10 bg-white rounded-full items-center justify-center text-gray-500 hover:bg-[#004b93] hover:text-white shadow-sm transition-all duration-300">
            <Eye size={16} />
          </button>
        </div>

        {/* زر Quick Add العادي في الديسكتوب */}
        {!isList && (
          <button 
            onClick={handleOpenQuickAdd}
            className="hidden lg:flex absolute bottom-0 left-0 w-full bg-[#004b93] text-white font-bold text-[11px] tracking-widest py-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 hover:bg-[#2d2d2d] items-center justify-center gap-2 z-20"
          >
            <ShoppingBag size={14} />
            QUICK ADD
          </button>
        )}
      </div>

      {/* تفاصيل المنتج */}
      <div className={`mt-3 sm:mt-4 w-full px-1 ${isList ? 'flex-1 text-center sm:text-left' : 'text-center'}`}>
        <h3 className="text-[#2d2d2d] text-xs md:text-[15px] font-bold uppercase tracking-tight lg:group-hover:text-[#004b93] transition-colors line-clamp-1">
          {product.name}
        </h3>
        
        {isList && (
          <p className="text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3 leading-relaxed max-w-xl mx-auto sm:mx-0 line-clamp-2 sm:line-clamp-none">
            {product.description}
          </p>
        )}

        <div className={`mt-1 sm:mt-1.5 flex items-center ${isList ? 'justify-center sm:justify-start' : 'justify-center'} gap-2 sm:gap-3`}>
          <p className="text-[#004b93] font-black text-sm md:text-lg tracking-wide">
            LE {product.price.toFixed(2)}
          </p>
        </div>

        {/* زر الشراء في الموبايل */}
        {!isList && (
          <div className="flex flex-col lg:hidden mt-2 sm:mt-3 w-full">
            <button 
              onClick={handleOpenQuickAdd}
              className="w-full bg-white border border-gray-200 text-[#2d2d2d] py-2 sm:py-3 text-[10px] sm:text-[11px] font-black tracking-widest flex items-center justify-center gap-1.5 sm:gap-2 rounded-sm active:scale-95 transition-all hover:border-[#004b93]"
            >
              <ShoppingBag size={12} className="sm:w-3.5 sm:h-3.5" />
              QUICK ADD
            </button>
          </div>
        )}
        
        {/* تصميم وضع الـ List */}
        {isList && (
          <div className="mt-3 sm:mt-5">
            <button 
              onClick={handleOpenQuickAdd}
              className="w-full sm:w-auto bg-[#004b93] text-white px-4 sm:px-8 py-2.5 sm:py-3 text-[10px] sm:text-[12px] font-bold tracking-widest hover:bg-[#2d2d2d] transition-all flex items-center justify-center gap-2 sm:gap-3 rounded-sm"
            >
              <ShoppingBag size={14} className="sm:w-4 sm:h-4" />
              QUICK ADD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}