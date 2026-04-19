import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // أضفنا useLocation
import { ChevronDown, Info } from 'lucide-react';
import { useCart } from '../header/CartProvider';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { cartItems: globalCartItems } = useCart(); // السلة العالمية كحل بديل

  // 1. تحديد المنتجات اللي هتتعرض: 
  // لو فيه منتجات مبعوتة في الـ state (من Buy it now أو الـ Cart) هنستخدمها، غير كدة هنستخدم السلة
  const displayItems = location.state?.checkoutItems || globalCartItems;

  // 2. حساب المجموع بناءً على المنتجات المعروضة حالياً فقط
  const displaySubtotal = displayItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // حسابات الشحن والإجمالي
  const shipping = 110;
  const total = displaySubtotal + shipping;

  useEffect(() => {
    if (displayItems.length === 0) {
       // navigate('/'); 
    }
  }, [displayItems, navigate]);

  return (
    <div className="min-h-screen bg-white text-[#2d2d2d] font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        
        {/* القسم الأيسر: النماذج والبيانات */}
        <div className="lg:col-span-7 p-6 md:p-12 lg:border-r border-gray-100">
          <header className="mb-8">
            <h1 className="text-2xl font-black tracking-tight uppercase">Ice Boys</h1>
          </header>

          <main className="space-y-8">
            {/* ... (باقي كود الـ Contact والـ Shipping والـ Payment كما هو بدون تغيير) ... */}
            <section>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold uppercase tracking-tight">Contact</h2>
                <button className="text-sm underline text-gray-500">Log in</button>
              </div>
              <div className="relative border border-gray-300 rounded-md p-3 flex justify-between items-center group focus-within:ring-2 focus-within:ring-[#004b93]">
                <span className="text-sm">user@example.com</span>
                <button className="text-gray-400"><ChevronDown size={18} /></button>
              </div>
            </section>

            <section className="border border-gray-300 rounded-md overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase font-black tracking-widest mb-1">Ship to</span>
                  <p>Client Name, Giza, Egypt</p>
                </div>
                <button className="text-[#004b93] text-xs font-bold uppercase">Change</button>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase font-black tracking-widest mb-1">Shipping method</span>
                  <p>Standard Shipping · <span className="font-bold">E£{shipping.toFixed(2)}</span></p>
                </div>
                <button className="text-[#004b93] text-xs font-bold uppercase">Change</button>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold uppercase tracking-tight mb-1">Payment</h2>
              <p className="text-xs text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              <div className="border border-[#004b93] bg-blue-50/30 rounded-md p-4 flex items-center gap-3">
                <div className="w-4 h-4 border-4 border-[#004b93] rounded-full bg-white"></div>
                <span className="text-sm font-bold uppercase">Cash on Delivery (COD)</span>
              </div>
            </section>

            <button 
              disabled={displayItems.length === 0} 
              className="w-full bg-[#2d2d2d] hover:bg-black text-white font-black py-4 rounded-sm transition-all shadow-lg text-[13px] uppercase tracking-widest mt-4 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Complete order
            </button>
          </main>
        </div>

        {/* القسم الأيمن: ملخص الطلب */}
        <div className="lg:col-span-5 bg-gray-50/80 p-6 md:p-12 lg:min-h-screen">
          <div className="sticky top-12 space-y-8">
            
            {displayItems.length === 0 ? (
              <div className="text-center text-gray-500 py-10 font-bold uppercase">
                Your cart is empty.
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {displayItems.map((item, index) => (
                    <div key={item.cartItemId || index} className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-20 object-cover rounded-sm border border-gray-200 bg-white" 
                        />
                        <span className="absolute -top-2 -right-2 bg-[#2d2d2d] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[13px] font-black uppercase text-[#2d2d2d]">{item.name}</h3>
                        <p className="text-[11px] font-bold text-gray-400 uppercase mt-1">Size: {item.size}</p>
                      </div>
                      <span className="text-sm font-bold text-[#004b93]">E£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold uppercase text-[11px]">Subtotal</span>
                    <span className="font-bold text-[#2d2d2d]">E£{displaySubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold uppercase text-[11px] flex items-center gap-1">
                      Shipping <Info size={14} />
                    </span>
                    <span className="font-bold text-[#2d2d2d]">E£{shipping.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <span className="text-lg font-black uppercase tracking-tighter">Total</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-[10px] text-gray-400 font-black uppercase">EGP</span>
                      <span className="text-2xl font-black text-[#004b93]">E£{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}