import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../services/supabase'; // تأكد من مسار الـ supabase
import { useCart } from '../header/CartProvider'; // تأكد من مسار الـ CartProvider
import { 
  ChevronRight, 
  ChevronLeft, 
  Minus, 
  Plus, 
  Eye, 
  Truck, 
  ShieldCheck, 
  RefreshCcw,
  Ruler
} from 'lucide-react';

// دالة جلب بيانات منتج واحد من Supabase
const fetchProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // جلب البيانات باستخدام React Query
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
  });

  // State
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // دالة لجلب الرابط الصحيح للصورة من Supabase Storage
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600x800?text=No+Image';
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data?.publicUrl;
  };

  // حساب الكمية المتاحة بناءً على المقاس المختار
  const availableStock = selectedSize 
    ? parseInt(product?.sizes?.find(s => s.size === selectedSize)?.quantity || 0)
    : 0;

  // إعادة ضبط الكمية لـ 1 لو المستخدم غير المقاس
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  // دوال التحكم في الكمية
  const handleIncrease = () => {
    if (quantity < availableStock) setQuantity(prev => prev + 1);
  };
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

const handleBuyNow = () => {
    if (!selectedSize || availableStock === 0) return;
    
    // توجيه المستخدم لصفحة الدفع مع إرسال بيانات المنتج الحالي
    navigate('/checkout', {
      state: {
        selectedProduct: {
          id: product.id,
          name: product.name,
          size: selectedSize,
          price: product.price,
          quantity: quantity,
          image: mainImage
        }
      }
    });
  };

  const handleAddToCart = () => {
    if (!selectedSize || availableStock === 0) return;
    addToCart(product, selectedSize, quantity);
  };

  // حالات التحميل والخطأ
  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500 tracking-widest uppercase">Loading Product...</div>;
  if (isError || !product) return <div className="min-h-screen flex items-center justify-center font-bold text-red-500 uppercase">Product Not Found</div>;

  const images = product.image_urls || [];
  const mainImage = getImageUrl(images[activeImageIndex]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
      {/* تقسيم الشاشة لعمودين في الديسكتوب وعمود واحد في الموبايل */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        
        {/* ================= العمود الأيسر: الصور ================= */}
        <div className="flex flex-col gap-4">
          {/* الصورة الرئيسية */}
          <div className="relative aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden group">
            <img 
              src={mainImage} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* أسهم التقليب (تظهر لو فيه أكتر من صورة) */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={() => setActiveImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setActiveImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>

          {/* الصور المصغرة (Thumbnails) */}
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 sm:w-24 aspect-[4/5] flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-[#004b93]' : 'border-transparent hover:border-gray-200'}`}
                >
                  <img src={getImageUrl(img)} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>


        {/* ================= العمود الأيمن: تفاصيل المنتج ================= */}
        <div className="flex flex-col">
          {/* العنوان والسعر */}
          <h1 className="text-2xl sm:text-3xl font-black text-[#2d2d2d] uppercase tracking-tight mb-2">
            {product.name}
          </h1>
          
          <div className="text-sm text-gray-500 mb-4 flex flex-col gap-1">
            <p>SKU: {product.id.slice(0, 8).toUpperCase()}</p>
            <p>Availability: <span className="text-[#004b93] font-bold">In Stock</span></p>
          </div>

          <p className="text-2xl font-black text-[#004b93] mb-4">
            LE {product.price?.toFixed(2)}
          </p>

          <div className="bg-gray-50 p-3 rounded-sm border border-gray-100 mb-6">
            <p className="text-sm font-bold text-[#2d2d2d]">Premium Quality | Cash on Delivery</p>
          </div>

          {/* رسالة الكمية المتاحة (Scarcity Message) */}
          {selectedSize && availableStock > 0 && availableStock <= 20 && (
            <p className="text-red-500 font-bold text-sm mb-4 animate-pulse">
              Please hurry! Only {availableStock} left in stock
            </p>
          )}

          {/* اختيار المقاس */}
          <div className="mb-6">
            {/* <div className="flex justify-between items-end mb-3">
              <span className="text-sm font-bold text-[#2d2d2d] uppercase tracking-widest">
                Size: {selectedSize || ''}
              </span>
              <button className="text-xs font-bold text-gray-500 hover:text-[#004b93] flex items-center gap-1 uppercase tracking-widest underline underline-offset-4">
                <Ruler size={14} /> Size Guide
              </button>
            </div> */}
            
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((item) => {
                const stock = parseInt(item.quantity);
                const isOutOfStock = stock === 0;
                
                return (
                  <button
                    key={item.size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(item.size)}
                    className={`w-14 h-12 flex items-center justify-center text-sm font-bold uppercase transition-all border ${
                      selectedSize === item.size 
                        ? 'border-[#2d2d2d] bg-[#2d2d2d] text-white shadow-md' 
                        : isOutOfStock 
                          ? 'border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed line-through relative overflow-hidden' 
                          : 'border-gray-300 bg-white text-[#2d2d2d] hover:border-[#2d2d2d]'
                    }`}
                  >
                    {item.size}
                  </button>
                );
              })}
            </div>

{/* مؤشر الكمية المتاحة (Inventory Progress Bar) */}
{selectedSize && (
  <div className="mt-6 mb-6">
    <div className="flex justify-between items-center mb-2">
      <p className="text-[11px] font-black uppercase tracking-widest text-[#2d2d2d]">
        {availableStock > 0 ? (
          <>Only <span className="text-red-600">{availableStock}</span> left in stock</>
        ) : (
          <span className="text-red-600">Out of Stock</span>
        )}
      </p>
    </div>
    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${
          availableStock <= 5 ? 'bg-red-500' : availableStock <= 20 ? 'bg-orange-400' : 'bg-green-600'
        }`}
        style={{ 
          // بنفترض هنا إن أقصى كمية للعرض في الشريط هي 50 قطعة مثلاً كنسبة مئوية
          width: `${Math.min((availableStock / 50) * 100, 100)}%` 
        }}
      />
    </div>
  </div>
)}
          </div>

          {/* الإجمالي الفرعي (Subtotal) */}
          <div className="mb-6">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
              Subtotal: <span className="text-[#2d2d2d]">LE {(product.price * quantity).toFixed(2)}</span>
            </p>
          </div>

          {/* التحكم في الكمية والزرار */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 h-14 w-full sm:w-32">
              <button onClick={handleDecrease} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#2d2d2d] hover:bg-gray-50 transition-colors">
                <Minus size={16} />
              </button>
              <div className="flex-1 h-full flex items-center justify-center text-sm font-bold text-[#2d2d2d]">
                {quantity}
              </div>
              <button onClick={handleIncrease} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#2d2d2d] hover:bg-gray-50 transition-colors">
                <Plus size={16} />
              </button>
            </div>

          </div>

          {/* Buy It Now Button */}
          <button 
            onClick={handleBuyNow}
            disabled={!selectedSize || availableStock === 0}
            className={`w-full h-14 font-black text-xs uppercase tracking-[0.2em] border-2 transition-all flex items-center justify-center mb-8 ${
              selectedSize && availableStock > 0
                ? 'border-[#2d2d2d] bg-white text-[#2d2d2d] hover:bg-gray-50'
                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
            }`}
          >
            Buy It Now
          </button>

          {/* عداد المشاهدات الوهمي (زي الفيديو) */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-8 border-b border-gray-100 pb-6">
            <Eye size={18} className="text-gray-400" />
            <p><span className="font-bold text-[#2d2d2d]">{Math.floor(Math.random() * 50) + 20}</span> customers are viewing this product</p>
          </div>

          {/* معلومات إضافية (Accordions / Features) */}
          <div className="flex flex-col gap-5">
            <div className="flex gap-4 items-start group cursor-pointer">
              <Truck size={24} strokeWidth={1.5} className="text-[#004b93] mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-[#2d2d2d] text-sm uppercase tracking-wider mb-1">Free Shipping</h4>
                <p className="text-sm text-gray-500">Free standard shipping on orders over 3000EGP</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start group cursor-pointer">
              <ShieldCheck size={24} strokeWidth={1.5} className="text-[#004b93] mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-[#2d2d2d] text-sm uppercase tracking-wider mb-1">Pre-Payment Inspection</h4>
                <p className="text-sm text-gray-500">Inspection before payment is allowed</p>
              </div>
            </div>

            <div className="flex gap-4 items-start group cursor-pointer">
              <RefreshCcw size={24} strokeWidth={1.5} className="text-[#004b93] mt-1 group-hover:scale-110 transition-transform" />
              <div>
                <h4 className="font-bold text-[#2d2d2d] text-sm uppercase tracking-wider mb-1">Shipping & Return</h4>
                <p className="text-sm text-gray-500">Easy returns within 14 days</p>
              </div>
            </div>
          </div>

          {/* الوصف (Description) - لو حابب تعرضه */}
          {product.description && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="font-black text-[#2d2d2d] uppercase tracking-widest mb-4">Product Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}