import React from 'react';
import { useWishlist } from '../header/WishlistProvider';
import { useCart } from '../header/CartProvider';
import { Trash2, ShoppingBag, HeartOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

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
              to="/shop" 
              className="inline-block bg-[#004b93] text-white px-8 py-4 font-bold text-xs tracking-widest uppercase hover:bg-[#2d2d2d] transition-colors rounded-sm"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-100 group relative">
                {/* Delete Button */}
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                >
                  <Trash2 size={18} />
                </button>

                {/* Product Image */}
                <div className="aspect-[4/5] overflow-hidden bg-gray-50">
                  <img 
                    src={item.mainImage} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-[#2d2d2d] font-bold text-sm uppercase mb-1">{item.name}</h3>
                  <p className="text-[#004b93] font-black mb-4">LE {item.price.toFixed(2)}</p>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        // هنا بنفترض اختيار أول مقاس متاح عشان الإضافة السريعة
                        addToCart(item, item.sizes[0], 1);
                      }}
                      className="flex-1 bg-[#2d2d2d] text-white py-3 text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#004b93] transition-colors rounded-sm"
                    >
                      <ShoppingBag size={14} />
                      Add to Cart
                    </button>
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