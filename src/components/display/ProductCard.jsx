import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, X, Minus, Plus, Bell } from 'lucide-react';
import { useCart } from '../header/CartProvider';
import { useWishlist } from '../header/WishlistProvider';
import { supabase } from '../../services/supabase';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// 1. دالة جلب البيانات من Supabase
const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products') 
    .select('*');

  if (error) throw new Error(error.message);
  return data;
};

// 2. مكون قائمة المنتجات
export function ProductList({ viewMode }) {
  const { category: urlSlug } = useParams(); 
  const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProducts });

  const cleanWord = (word) => {
    if (!word) return '';
    let w = word.toLowerCase().replace('collection', '').trim();
    if (w.endsWith('s')) w = w.slice(0, -1);
    return w;
  };

  const filteredProducts = products?.filter(product => {
    const slugWords = (urlSlug || '').split('-').map(w => cleanWord(w)).filter(w => w !== '' && w !== 'shop');
    if (slugWords.length === 0) return true;
    const productInfo = `${cleanWord(product.collection)} ${cleanWord(product.category)}`;
    return slugWords.every(word => productInfo.includes(word));
  });

  if (!filteredProducts || filteredProducts.length === 0) {
    return <div className="text-center py-10 font-bold text-gray-500">NO RESULTS FOUND</div>;
  }

  return (
    <div className={viewMode === 'list' ? 'flex flex-col gap-6' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'}>
      {filteredProducts?.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}

// 3. مكون كارت المنتج (Product Card)
export default function ProductCard({ product, viewMode }) {
  const isList = viewMode === 'list';
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // إعدادات الـ Swipe للموبايل
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance && hasMultipleImages) {
      setActiveImageIndex(1); // سحب لليسار
    } else if (distance < -minSwipeDistance && hasMultipleImages) {
      setActiveImageIndex(0); // سحب لليمين
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x500?text=No+Image';
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data?.publicUrl;
  };

  const mainImage = getImageUrl(product.image_urls?.[0]);
  const hoverImage = getImageUrl(product.image_urls?.[1] || product.image_urls?.[0]);
  const hasMultipleImages = product.image_urls && product.image_urls.length > 1;

  const getStock = (sizeName) => {
    const sizeEntry = product.sizes?.find((s) => s.size === sizeName);
    return sizeEntry ? parseInt(sizeEntry.quantity) : 0;
  };

  const isOutOfStock = selectedSize ? getStock(selectedSize) === 0 : false;

  const handleAddToCart = () => {
    if (!selectedSize || isOutOfStock) return;
    addToCart(product, selectedSize, quantity);
    setShowQuickAdd(false);
  };

  const handleOpenQuickAdd = () => {
    setShowQuickAdd(true);
    setSelectedSize(null);
    setQuantity(1);
  };

  return (
    // ضفنا h-full عشان الكروت كلها في الـ grid تبقى نفس الطول
    <div className={`group flex ${isList ? 'flex-col sm:flex-row gap-4 sm:gap-8 items-center border-b border-gray-100 pb-6 sm:pb-8' : 'flex-col h-full'} w-full bg-white transition-all duration-300 relative`}>
      
      {/* حاوية الصورة والتحكمات */}
      <div className="relative w-full">
        <div 
          className={`relative overflow-hidden bg-[#f8f9fa] rounded-sm ${isList ? 'w-full sm:w-1/3 max-w-[280px]' : 'w-full'} aspect-[4/5]`}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          
          {/* الصورة الأولى */}
          <img 
            src={mainImage} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-all duration-500 lg:group-hover:scale-110 
              ${activeImageIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 lg:opacity-100 z-0'}`}
          />
          
          {/* الصورة الثانية */}
          <img 
            src={hoverImage} 
            alt={`${product.name} hover`} 
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 lg:opacity-0 lg:group-hover:opacity-100 
              ${activeImageIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          />

          {/* نافذة الإضافة السريعة */}
          <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 sm:p-6 transition-all duration-300 ${showQuickAdd ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <button onClick={() => setShowQuickAdd(false)} className="absolute top-2 right-2 text-gray-400 hover:text-[#2d2d2d] p-1">
              <X size={18} />
            </button>
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-400 mb-2 text-center">
              {selectedSize ? `Size: ${selectedSize}` : 'Select a Size'}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 mb-4 w-full px-1">
              {product.sizes?.map((item) => (
                <button 
                  key={item.size} 
                  onClick={() => parseInt(item.quantity) > 0 && setSelectedSize(item.size)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-[10px] sm:text-xs font-bold rounded-sm transition-all border ${
                    selectedSize === item.size ? 'border-[#004b93] bg-[#004b93] text-white shadow-md' : parseInt(item.quantity) === 0 ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed line-through' : 'border-gray-200 bg-white text-gray-700 hover:border-[#004b93]'
                  }`}
                >
                  {item.size}
                </button>
              ))}
            </div>
            <div className="flex w-full gap-2 mt-auto">
              <button 
                disabled={!selectedSize || isOutOfStock}
                onClick={handleAddToCart}
                className={`w-full py-2.5 text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 rounded-sm transition-all ${selectedSize ? 'bg-[#004b93] text-white hover:bg-[#00366b]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <ShoppingBag size={12} /> {isOutOfStock ? 'Notify Me' : 'Add'}
              </button>
            </div>
          </div>

          {/* الأيقونات العلوية */}
          <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 flex flex-col gap-2 sm:gap-3 z-30">
            <div className="relative group/tooltip flex items-center justify-end">
              <span className="absolute right-full mr-3 text-[10px] font-black uppercase tracking-widest text-white bg-[#004b93] py-2 px-4 rounded-full shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 whitespace-nowrap z-50">
                {isFavorite ? 'Remove from Wishlist' : 'Add To Wishlist'}
              </span>
              <button 
                onClick={() => addToWishlist(product)}
                className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center transition-all duration-300 rounded-full ${isFavorite ? 'bg-[#004b93] text-white shadow-md' : 'bg-white/80 text-gray-600 hover:bg-[#004b93] hover:text-white shadow-sm'}`}
              >
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex relative group/tooltip items-center justify-end">
              <span className="absolute right-full mr-3 text-[10px] font-black uppercase tracking-widest text-white bg-[#004b93] py-2 px-4 rounded-full shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 whitespace-nowrap z-50">
                Quick View
              </span>
              <button className="w-8 h-8 sm:w-9 sm:h-9 bg-white/80 shadow-sm flex items-center justify-center text-gray-600 hover:bg-[#004b93] hover:text-white rounded-full transition-all duration-300">
                <Eye size={18} strokeWidth={2.5} />
              </button>
            </div>
          </div>

          {/* زر Quick Add للديسكتب (بيظهر وقت الـ Hover) */}
          {!isList && (
            <button 
              onClick={handleOpenQuickAdd}
              className="hidden lg:flex absolute bottom-0 left-0 w-full bg-[#004b93] text-white font-bold text-[11px] tracking-widest py-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 hover:bg-[#2d2d2d] items-center justify-center gap-2 z-20"
            >
              <ShoppingBag size={14} /> QUICK ADD
            </button>
          )}

          {/* ✅ النقط جوه الصورة من تحت (للموبايل) بناءً على التصميم */}
          {hasMultipleImages && !isList && (
            <div className="absolute bottom-2.5 w-full flex justify-center gap-1.5 z-20 lg:hidden">
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(0); }}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${activeImageIndex === 0 ? 'bg-[#004b93] w-4' : 'bg-gray-300/90 w-1.5'}`}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveImageIndex(1); }}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${activeImageIndex === 1 ? 'bg-[#004b93] w-4' : 'bg-gray-300/90 w-1.5'}`}
              />
            </div>
          )}
        </div>
      </div>

      {/* تفاصيل المنتج (خليناها flex-grow عشان تملى المساحة وتزق الزرار لتحت دايماً) */}
      <div className={`mt-3 w-full px-1 flex flex-col flex-grow ${isList ? 'flex-1 text-center sm:text-left' : 'text-center'}`}>
        
        <div>
          <h3 className="text-[#2d2d2d] text-[13px] md:text-[15px] font-bold uppercase tracking-tight lg:group-hover:text-[#004b93] transition-colors line-clamp-1">
            {product.name}
          </h3>
          
          <div className={`mt-1 flex items-center ${isList ? 'justify-center sm:justify-start' : 'justify-center'} gap-2`}>
            <p className="text-[#004b93] font-black text-[15px] md:text-lg tracking-wide">
              LE {product.price?.toFixed(2)}
            </p>
          </div>
        </div>

        {/* زر الشراء للموبايل (شكل متناسق مع تصميم صورتك وبياخد مساحته دايماً في أسفل الكارت) */}
        {!isList && (
          <div className="flex flex-col lg:hidden mt-auto pt-3 w-full pb-1">
            <button 
              onClick={handleOpenQuickAdd}
              className="w-full bg-white border border-gray-200 hover:border-[#004b93] text-[#2d2d2d] hover:text-[#004b93] py-2.5 text-[11px] font-bold tracking-widest flex items-center justify-center gap-1.5 rounded-sm active:scale-95 transition-all shadow-sm"
            >
              <ShoppingBag size={14} /> QUICK ADD
            </button>
          </div>
        )}
      </div>

    </div>
  );
}