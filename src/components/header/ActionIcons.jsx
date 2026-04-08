import { useState } from 'react';
import { FiUser, FiHeart, FiShoppingBag, FiPackage } from 'react-icons/fi';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';
import { useNavigate } from 'react-router-dom';

const ActionIcons = ({ onCartClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  const iconStyle = "text-[#2d2d2d] text-[24px] md:text-2xl lg:text-[30px] cursor-pointer hover:text-[#004b93] transition-colors p-1";

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* --- User Menu Container --- */}
      <div 
        className="relative group"
        onMouseLeave={() => setIsUserMenuOpen(false)}
      >
        {/* User Icon Button */}
        <button 
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center"
        >
          <FiUser className={iconStyle} />
        </button>

        {/* --- Dropdown Menu --- */}
        <div className={`
          absolute top-full right-0 mt-2 w-[240px] bg-white shadow-2xl border border-gray-100 z-[110] transition-all duration-300
          ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}
          group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
        `}>
          {/* Welcome Section */}
          <div className="p-5 border-b border-gray-50">
            <h4 className="text-[13px] font-bold text-[#2d2d2d] mb-4">Welcome to ICE BOYS</h4>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#2d2d2d] text-white text-[11px] font-bold py-2 hover:bg-black transition-colors uppercase tracking-wider">
                Sign In
              </button>
              <button className="flex-1 border border-gray-200 text-[#2d2d2d] text-[11px] font-bold py-2 hover:bg-gray-50 transition-colors uppercase tracking-wider">
                Join
              </button>
            </div>
          </div>

          {/* Links Section */}
          <div className="py-2">
            <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group/link">
              <FiUser className="text-lg text-gray-400 group-hover/link:text-[#004b93]" />
              <span className="text-[13px] text-[#2d2d2d] font-medium">My Account</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group/link">
              <FiPackage className="text-lg text-gray-400 group-hover/link:text-[#004b93]" />
              <span className="text-[13px] text-[#2d2d2d] font-medium">My Orders</span>
            </a>
          </div>
        </div>
      </div>

      {/* Heart Icon */}
      <button 
        onClick={() => navigate('/wishlist')} // تأكد أن المسار مطابق للـ Route في App.js
        className="relative focus:outline-none hidden md:block"
      >
        <FiHeart className={iconStyle} />
        {totalWishlistItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#004b93] text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shadow-sm">
            {totalWishlistItems}
          </span>
        )}
      </button>

      {/* Shopping Bag Icon */}
      <button onClick={onCartClick} className="relative focus:outline-none">
        <FiShoppingBag className={iconStyle} />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#004b93] text-white text-[10px] lg:text-[11px] min-w-[18px] h-[18px] lg:min-w-[22px] lg:h-[22px] px-1 rounded-full flex items-center justify-center font-bold shadow-sm transition-all animate-in zoom-in">
              {totalItems}
            </span>
          )}
      </button>
    </div>
  );
};

export default ActionIcons;