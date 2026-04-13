import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, X, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../header/CartProvider';
import { useWishlist } from '../header/WishlistProvider';
import { supabase } from '../../services/supabase';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

// 1. دالة جلب المنتجات بناءً على الـ collection_id
const fetchCollectionProducts = async (collectionId) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('collection_id', collectionId);

  if (error) throw new Error(error.message);
  return data;
};

// 2. دالة جلب بيانات الكولكشن نفسه (عشان الاسم والوصف)
const fetchCollectionDetails = async (collectionId) => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('id', collectionId)
    .single();

  if (error) throw error;
  return data;
};

export default function CollectionProducts() {
  const { id } = useParams(); // الـ ID اللي جاي من الـ URL
  const [viewMode, setViewMode] = useState('grid');
  
  // React Query لجلب المنتجات
  const { data: products, isLoading: loadingProducts, isError, error } = useQuery({
    queryKey: ['collection-products', id],
    queryFn: () => fetchCollectionProducts(id),
    enabled: !!id,
  });

  // React Query لجلب تفاصيل الكولكشن
  const { data: collection } = useQuery({
    queryKey: ['collection-details', id],
    queryFn: () => fetchCollectionDetails(id),
    enabled: !!id,
  });

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 text-[#004b93] animate-spin mb-4" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Loading Collection...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="font-bold text-gray-700">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header الكولكشن */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <Link to="/collections" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors mb-6 text-[10px] font-bold tracking-widest">
           <ArrowLeft size={14} /> BACK TO COLLECTIONS
        </Link>
        
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#2d2d2d] mb-4">
                {collection?.name || 'Collection'}
            </h1>
            {collection?.description && (
                <p className="max-w-2xl mx-auto text-gray-500 text-sm leading-relaxed">
                    {collection.description}
                </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-black text-gray-400 tracking-[0.2em]">
                <span>{products?.length || 0} ITEMS</span>
            </div>
        </div>

        {/* شبكة المنتجات */}
        {products?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-lg">
            <p className="text-gray-400 font-bold uppercase tracking-widest">No products found in this collection.</p>
          </div>
        ) : (
          <div className={viewMode === 'list' ? 'flex flex-col gap-6' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 3. مكون كارت المنتج (نفس الـ UI اللي إنت بعته بالظبط)
function ProductCard({ product, viewMode }) {
  const isList = viewMode === 'list';
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlistLocal, removeFromWishlistLocal } = useWishlist(); 
  const isFavorite = isInWishlist(product.id);

  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const goToDetails = () => navigate(`/product/${product.id}`);

  const handleFavoriteToggle = async (e) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("Please sign in to save favorites!"); return; }

    if (isFavorite) {
      const { error } = await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', product.id);
      if (!error && removeFromWishlistLocal) removeFromWishlistLocal(product.id);
    } else {
      const { error } = await supabase.from('favorites').insert([{ user_id: user.id, product_id: product.id }]);
      if (!error && addToWishlistLocal) addToWishlistLocal(product);
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

  return (
    <div className={`group flex ${isList ? 'flex-col sm:flex-row gap-4 sm:gap-8 items-center border-b border-gray-100 pb-6 sm:pb-8' : 'flex-col h-full'} w-full bg-white transition-all duration-300 relative`}>
      <div className="relative w-full">
        <div onClick={goToDetails} className={`relative overflow-hidden bg-[#f8f9fa] rounded-sm ${isList ? 'w-full sm:w-1/3 max-w-[280px]' : 'w-full'} aspect-[4/5] cursor-pointer`}>
          <img src={mainImage} alt={product.name} className={`w-full h-full object-cover transition-all duration-500 lg:group-hover:scale-110 ${activeImageIndex === 0 ? 'opacity-100 z-10' : 'opacity-0 lg:opacity-100 z-0'}`} />
          <img src={hoverImage} alt={`${product.name} hover`} className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 lg:opacity-0 lg:group-hover:opacity-100 ${activeImageIndex === 1 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} />

          {/* Quick Add Overlay */}
          <div className={`absolute inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center justify-center p-3 transition-all duration-300 ${showQuickAdd ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            <button onClick={(e) => {e.stopPropagation(); setShowQuickAdd(false)}} className="absolute top-2 right-2 text-gray-400 hover:text-[#2d2d2d]"><X size={18} /></button>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{selectedSize ? `Size: ${selectedSize}` : 'Select Size'}</span>
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {product.sizes?.map((item) => (
                <button key={item.size} onClick={(e) => {e.stopPropagation(); parseInt(item.quantity) > 0 && setSelectedSize(item.size)}} className={`w-8 h-8 flex items-center justify-center text-[10px] font-bold rounded-sm border ${selectedSize === item.size ? 'border-[#004b93] bg-[#004b93] text-white' : parseInt(item.quantity) === 0 ? 'text-gray-300 line-through' : 'border-gray-200 hover:border-[#004b93]'}`}>{item.size}</button>
              ))}
            </div>
            <button disabled={!selectedSize || isOutOfStock} onClick={(e) => {e.stopPropagation(); handleAddToCart()}} className={`w-full py-2.5 text-[10px] font-black uppercase flex items-center justify-center gap-2 ${selectedSize ? 'bg-[#004b93] text-white' : 'bg-gray-100 text-gray-400'}`}>
              <ShoppingBag size={12} /> {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO CART'}
            </button>
          </div>

          {/* Icons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-30">
            <button onClick={handleFavoriteToggle} className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${isFavorite ? 'bg-[#004b93] text-white' : 'bg-white/80 text-gray-600 hover:bg-[#004b93] hover:text-white'}`}>
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>
            <button onClick={(e) => { e.stopPropagation(); goToDetails();}} className="w-8 h-8 bg-white/80 flex items-center justify-center text-gray-600 hover:bg-[#004b93] hover:text-white rounded-full transition-all">
              <Eye size={16} strokeWidth={2.5} />
            </button>
          </div>

          {!isList && (
            <button onClick={(e) => {e.stopPropagation(); setShowQuickAdd(true)}} className="hidden lg:flex absolute bottom-0 left-0 w-full bg-[#004b93] text-white font-bold text-[11px] tracking-widest py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 items-center justify-center gap-2 z-20">
              <ShoppingBag size={14} /> QUICK ADD
            </button>
          )}
        </div>
      </div>

      <div className={`mt-3 w-full px-1 flex flex-col flex-grow ${isList ? 'flex-1 text-left' : 'text-center'}`}>
        <h3 onClick={goToDetails} className="text-[#2d2d2d] text-[13px] font-bold uppercase tracking-tight hover:text-[#004b93] transition-colors cursor-pointer line-clamp-1">
          {product.name}
        </h3>
        <p className="text-[#004b93] font-black text-[15px] mt-1">LE {product.price?.toFixed(2)}</p>
        
        {!isList && (
          <div className="lg:hidden mt-auto pt-3">
            <button onClick={(e) => {e.stopPropagation(); setShowQuickAdd(true)}} className="w-full bg-white border border-gray-200 text-[#2d2d2d] py-2 text-[10px] font-bold tracking-widest flex items-center justify-center gap-1.5 rounded-sm">
              <ShoppingBag size={12} /> QUICK ADD
            </button>
          </div>
        )}
      </div>
    </div>
  );
}