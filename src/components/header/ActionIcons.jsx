import { useState, useEffect } from 'react';
import { FiUser, FiHeart, FiShoppingBag, FiPackage } from 'react-icons/fi';
import { useCart } from './CartProvider';
import { useWishlist } from './WishlistProvider';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

const ActionIcons = ({ onCartClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalWishlistItems = wishlistItems.length;

  const iconStyle = "text-[#2d2d2d] text-[24px] md:text-2xl lg:text-[30px] cursor-pointer hover:text-[#004b93] transition-colors p-1";

  // متابعة حالة تسجيل الدخول
  useEffect(() => {
    // جلب الجلسة الحالية عند أول تحميل
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // الاستماع لأي تغيير في الحالة (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // دالة موحدة للانتقال لصفحة الحساب وإغلاق القائمة
  const goToAccount = () => {
    navigate('/account');
    setIsUserMenuOpen(false);
  };

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {/* --- User Menu Container --- */}
      <div 
        className="relative"
        onMouseLeave={() => setIsUserMenuOpen(false)}
        onMouseEnter={() => setIsUserMenuOpen(true)}
      >
        {/* User Icon Button */}
        <button 
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center focus:outline-none"
        >
          <FiUser className={iconStyle} />
        </button>

        {/* --- Dropdown Menu --- */}
        <div className={`
          absolute top-full right-0 mt-2 w-[240px] bg-white shadow-2xl border border-gray-100 z-[110] transition-all duration-300
          ${isUserMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}
        `}>
          
          {/* لو المستخدم مش عامل Log In */}
          {!user ? (
            <div className="p-5">
              <h4 className="text-[13px] font-bold text-[#2d2d2d] mb-4 text-center">Welcome to ICE BOYS</h4>
              <div className="flex gap-2">
                <button 
                  onClick={() => { navigate('/signin'); setIsUserMenuOpen(false); }}
                  className="flex-1 border border-gray-200 text-[#2d2d2d] text-[11px] font-bold py-2 hover:bg-gray-50 transition-colors uppercase"
                >
                  Join
                </button>
              </div>
            </div>
          ) : (
            /* لو المستخدم عامل Log In */
            <>
              <div className="p-5 border-b border-gray-50">
                <h4 className="text-[13px] font-bold text-[#2d2d2d] capitalize">
                  Hello, {user.user_metadata?.first_name || 'Hero'}
                </h4>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>

              <div className="py-2">
                <button 
                  onClick={() => { navigate('/account'); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group/link text-left"
                >
                  <FiUser className="text-lg text-gray-400 group-hover/link:text-[#004b93]" />
                  <span className="text-[13px] text-[#2d2d2d] font-medium">My Account</span>
                </button>
                
                <button 
                  onClick={() => { navigate('/account'); setIsUserMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors group/link text-left"
                >
                  <FiPackage className="text-lg text-gray-400 group-hover/link:text-[#004b93]" />
                  <span className="text-[13px] text-[#2d2d2d] font-medium">My Orders</span>
                </button>

                <div className="border-t border-gray-50 mt-2 pt-2">
                  <button 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate('/', { replace: true });
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 text-red-500 transition-colors text-left"
                  >
                    <span className="text-[13px] font-bold">Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Heart Icon */}
      <button 
        onClick={() => navigate('/wishlist')}
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