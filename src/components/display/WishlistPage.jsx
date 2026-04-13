import React, { useState } from 'react';
import { useWishlist } from '../header/WishlistProvider';
import { useCart } from '../header/CartProvider';
import { Trash2, ShoppingBag, HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const WishlistPage = () => {
  // نستخدم الأسامي الجديدة من الـ Provider
  const { wishlistItems, removeFromWishlistLocal } = useWishlist();
  const { addToCart } = useCart();
  const [deletingId, setDeletingId] = useState(null);

  // دالة الحذف النهائي (DB + Local)
  const handleDelete = async (productId) => {
    setDeletingId(productId);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 1. احذف من Supabase
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (!error) {
        // 2. احذف من الشاشة (Provider)
        removeFromWishlistLocal(productId);
      } else {
        console.error("Error deleting:", error.message);
      }
    } else {
      // لو مش مسجل دخول، امسح محلياً بس
      removeFromWishlistLocal(productId);
    }
    setDeletingId(null);
  };

  // دالة لجلب رابط الصورة (نفس اللي في الكارت)
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x500?text=No+Image';
    if (path.startsWith('http')) return path;
    const { data } = supabase.storage.from('product-images').getPublicUrl(path);
    return data?.publicUrl;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-black text-[#2d2d2d] uppercase tracking-tighter mb-2">
            My Wishlist <span className="text-[#004b93]">({wishlistItems.length})</span>
          </h1>
          <div className="w-20 h-1 bg-[#004b93] mx-auto"></div>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-sm shadow-sm p-12 text-center border border-gray-100">
            <HeartOff size={64} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500 mb-8 font-medium">Your wishlist is currently empty.</p>
            <Link 
              to="/new-arrivals" 
              className="inline-block bg-[#004b93] text-white px-8 py-4 font-bold text-xs tracking-widest uppercase hover:bg-[#2d2d2d] transition-colors rounded-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className={`bg-white border border-gray-100 group relative transition-opacity ${deletingId === item.id ? 'opacity-50' : 'opacity-100'}`}>
                {/* Delete Button */}
                <button 
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors shadow-sm"
                >
                  <Trash2 size={18} />
                </button>

                {/* Product Image */}
                <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                  <img 
                    src={getImageUrl(item.image_urls?.[0])} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5 text-center">
                  <h3 className="text-[#2d2d2d] font-bold text-sm uppercase mb-1 line-clamp-1">{item.name}</h3>
                  <p className="text-[#004b93] font-black mb-4">LE {item.price?.toFixed(2)}</p>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/product/${item.id}`} // يفضل توديه لصفحة المنتج عشان يختار مقاسه صح
                      className="flex-1 bg-[#2d2d2d] text-white py-3 text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#004b93] transition-colors rounded-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;