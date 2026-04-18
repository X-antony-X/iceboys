import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // استدعاء useLocation
import { ChevronDown, ShoppingBag, Info } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. استقبال بيانات المنتج المُرسلة من صفحة تفاصيل المنتج
  const passedProduct = location.state?.selectedProduct;

  // 2. وضع المنتج المستلم كحالة مبدئية للسلة (أو مصفوفة فارغة لو لم يوجد)
  const [cartItems, setCartItems] = useState(
    passedProduct ? [passedProduct] : []
  );

  // اختياري: توجيه المستخدم للصفحة الرئيسية لو دخل صفحة الدفع مباشرة بدون منتج
  useEffect(() => {
    if (cartItems.length === 0) {
      // إذا كنت تستخدم سلة مشتريات عالمية (Context)، يمكنك جلب البيانات منها هنا بدلاً من التوجيه
      // navigate('/'); 
    }
  }, [cartItems, navigate]);

  // الحسابات الديناميكية بناءً على المنتجات في cartItems
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 110;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white text-[#2d2d2d] font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
        
        {/* القسم الأيسر: النماذج والبيانات */}
        <div className="lg:col-span-7 p-6 md:p-12 lg:border-r border-gray-100">
          <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Slava</h1>
          </header>

          <main className="space-y-8">
             {/* ... (أكواد Contact و Shipping و Payment و Billing كما هي بدون تغيير) ... */}
            <section>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Contact</h2>
                <button className="text-sm underline text-gray-500">Log in</button>
              </div>
              <div className="relative border border-gray-300 rounded-md p-3 flex justify-between items-center group focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-sm">antonyishak2016@gmail.com</span>
                <button className="text-gray-400"><ChevronDown size={18} /></button>
              </div>
            </section>

            <section className="border border-gray-300 rounded-md overflow-hidden">
              <div className="p-4 flex justify-between items-center border-b border-gray-200">
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Ship to</span>
                  <p>antony ishak, giza, 6, IS, Ismailia, EG, 0279354982</p>
                </div>
                <button className="text-blue-600 text-xs font-bold uppercase">Change</button>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-gray-500 block text-xs uppercase font-bold tracking-wider mb-1">Shipping method</span>
                  <p>الدلتا والقناة · <span className="font-bold">E£110.00</span></p>
                </div>
                <button className="text-blue-600 text-xs font-bold uppercase">Change</button>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-1">Payment</h2>
              <p className="text-xs text-gray-500 mb-4">All transactions are secure and encrypted.</p>
              <div className="border border-blue-500 bg-blue-50/30 rounded-md p-4 flex items-center gap-3">
                <div className="w-4 h-4 border-4 border-blue-600 rounded-full bg-white"></div>
                <span className="text-sm font-medium">Cash on Delivery (COD)</span>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-medium mb-4">Billing address</h2>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <label className="p-4 flex items-center gap-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="billing" defaultChecked className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm">Same as shipping address</span>
                </label>
                <label className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="billing" className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm">Use a different billing address</span>
                </label>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <input type="checkbox" id="news" className="w-4 h-4 accent-blue-600" />
                <label htmlFor="news" className="text-sm text-gray-600">Text me with news and offers</label>
              </div>
            </section>

            <button disabled={cartItems.length === 0} className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold py-4 rounded-md transition-all shadow-lg text-sm uppercase tracking-widest mt-4 disabled:bg-gray-400 disabled:cursor-not-allowed">
              Complete order
            </button>
          </main>
        </div>

        {/* القسم الأيمن: ملخص الطلب */}
        <div className="lg:col-span-5 bg-gray-50/80 p-6 md:p-12 lg:min-h-screen">
          <div className="sticky top-12 space-y-8">
            
            {/* رسالة في حالة عدم وجود منتجات */}
            {cartItems.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No items to checkout.
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div key={item.id || index} className="flex items-center gap-4">
                      <div className="relative">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md border border-gray-200 bg-white" />
                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold">{item.name}</h3>
                        <p className="text-xs text-gray-500 uppercase">Size: {item.size}</p>
                      </div>
                      <span className="text-sm font-medium">E£{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal · {cartItems.length} items</span>
                    <span className="font-medium text-gray-900">E£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">Shipping <Info size={14} /></span>
                    <span className="font-medium text-gray-900">E£{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                    <span className="text-lg font-bold uppercase tracking-tight">Total</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-gray-500 font-bold uppercase">EGP</span>
                      <span className="text-xl font-black">E£{total.toFixed(2)}</span>
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