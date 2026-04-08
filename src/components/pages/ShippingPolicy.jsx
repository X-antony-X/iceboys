import React from 'react';
import Loader2 from "../loaders/Loader2"

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            SHIPPING <span className="text-blue-600">POLICY</span>
          </h1>
            <Loader2 />
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Everything you need to know about how we get your <span className="font-bold text-slate-700">Ice Boys</span> gear to your doorstep.
          </p>
          <div className="w-24 h-1 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl">📦</div>
            <h3 className="font-bold text-slate-900 mb-2">Order Processing</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Orders are processed within 24-48 hours (excluding weekends and holidays).</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl">🚚</div>
            <h3 className="font-bold text-slate-900 mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Standard shipping takes 3-5 business days. Express options available at checkout.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-hover hover:shadow-md">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl">📍</div>
            <h3 className="font-bold text-slate-900 mb-2">Order Tracking</h3>
            <p className="text-sm text-gray-500 leading-relaxed">A tracking number will be sent to your email as soon as the package is dispatched.</p>
          </div>
        </div>

        {/* Detailed Content Table Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-12">
          <div className="p-8 border-b border-gray-50 bg-slate-900 text-white">
            <h2 className="text-xl font-bold uppercase tracking-widest">Shipping Rates & Estimates</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-slate-600 text-sm uppercase font-bold">
                  <th className="px-8 py-4">Shipping Method</th>
                  <th className="px-8 py-4">Estimated Delivery</th>
                  <th className="px-8 py-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-medium text-slate-700">Standard Shipping</td>
                  <td className="px-8 py-5 text-gray-500">3-5 Business Days</td>
                  <td className="px-8 py-5 text-right font-bold text-blue-600">$5.00</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 font-medium text-slate-700">Express Delivery</td>
                  <td className="px-8 py-5 text-gray-500">1-2 Business Days</td>
                  <td className="px-8 py-5 text-right font-bold text-blue-600">$12.00</td>
                </tr>
                <tr className="hover:bg-blue-50/30 transition-colors bg-blue-50/20">
                  <td className="px-8 py-5 font-medium text-slate-700">Orders over $100</td>
                  <td className="px-8 py-5 text-gray-500">3-5 Business Days</td>
                  <td className="px-8 py-5 text-right font-bold text-green-600 uppercase">Free</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Policies Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xl font-black text-slate-900 uppercase">International Shipping</h4>
            <p className="text-gray-600 leading-relaxed">
              We ship worldwide. Please note that international shipments may be subject to import duties and taxes, which are the responsibility of the customer.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xl font-black text-slate-900 uppercase">Lost or Damaged Items</h4>
            <p className="text-gray-600 leading-relaxed">
              If your order arrives damaged or gets lost during transit, please contact our support team immediately. We’ll make it right.
            </p>
          </div>
        </div>

        {/* Footer Help */}
        <div className="mt-20 p-10 bg-blue-600 rounded-[3rem] text-center text-white relative overflow-hidden">
            {/* Background design element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full -mr-10 -mt-10 opacity-50"></div>
            
            <h2 className="text-2xl font-bold mb-4 relative z-10">Still have questions?</h2>
            <p className="text-blue-100 mb-6 relative z-10">Our support team is always ready to help you keep things cool.</p>
            <button className="bg-white text-blue-600 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg uppercase tracking-wider text-sm">
                Contact Support
            </button>
        </div>

      </div>
    </div>
  );
};

export default ShippingPolicy;