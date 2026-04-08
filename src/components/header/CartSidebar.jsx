import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../header/CartProvider'; 

export default function CartSidebar({ isOpen, onClose }) {
  const { cartItems, updateQuantity, removeItem, subtotal } = useCart();

  const FREE_SHIPPING_THRESHOLD = 3000;
  const amountAwayFromFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />

      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-[#2d2d2d] tracking-tight">Shopping Cart</h2>
            <p className="text-sm text-gray-500">{cartItems.length} items</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#004b93] rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {cartItems.length > 0 ? (
          <>
            {/* Free Shipping Bar */}
            <div className="px-6 py-4 bg-gray-50/50">
              <p className="text-[13px] font-semibold text-[#2d2d2d] mb-2">
                {amountAwayFromFreeShipping > 0 ? (
                  <>Only <span className="text-[#004b93]">LE {amountAwayFromFreeShipping.toFixed(2)}</span> away from Free Shipping</>
                ) : (
                  <span className="text-[#004b93]">You qualify for free shipping!</span>
                )}
              </p>
              <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#004b93] transition-all duration-500" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex gap-4">
                  <div className="w-20 h-28 bg-[#f8f9fa] rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[13px] font-bold text-[#2d2d2d] uppercase">{item.name}</h3>
                        <p className="text-[11px] font-bold text-gray-400 mt-1">SIZE: {item.size}</p>
                      </div>
                      <button onClick={() => removeItem(item.cartItemId)} className="text-gray-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="text-[14px] font-black text-[#004b93] mt-2">LE {item.price.toFixed(2)}</p>

                    <div className="mt-auto flex items-center w-fit border border-gray-200 rounded-sm">
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Minus size={12} /></button>
                      <span className="w-8 text-center text-[12px] font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-50"><Plus size={12} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-white">
              <div className="flex justify-between text-[18px] mb-6">
                <span className="font-black text-[#2d2d2d]">Total:</span>
                <span className="font-black text-[#004b93]">LE {subtotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-[#2d2d2d] hover:bg-black text-white py-4 text-[13px] font-black tracking-widest uppercase rounded-sm flex items-center justify-center gap-2">
                <ShoppingBag size={16} /> Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
             <ShoppingBag size={48} className="text-gray-200 mb-4" />
             <p className="text-gray-500 font-bold">Your cart is empty.</p>
          </div>
        )}
      </div>
    </>
  );
}