import React, { useState } from 'react';

// المكون الرئيسي لصفحة تسجيل الدخول
const SignInPage = () => {
  // حالة لتخزين قيمة البريد الإلكتروني
  const [email, setEmail] = useState('');
  // حالة لتخزين قيمة مربع الاختيار
  const [subscribe, setSubscribe] = useState(false);

  return (
    // الحاوية الرئيسية ذات الخلفية الرمادية الفاتحة لتمئيز النموذج الأبيض
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* بطاقة نموذج تسجيل الدخول البيضاء المركزية */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg border border-slate-100">
        
        {/* قسم الشعار والعنوان */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-6">Slava</h1>
          <h2 className="text-2xl font-semibold text-slate-950 self-start">Sign in</h2>
          <p className="text-slate-600 self-start mt-1">Sign in or create an account</p>
        </div>

        {/* زر "Continue with Shop" - البنفسجي */}
        <button className="w-full bg-[#5a31f4] text-white font-semibold py-3 px-6 rounded-lg text-lg hover:bg-[#4a28c4] transition-colors mb-4 flex items-center justify-center">
          Continue with Shop
        </button>

        {/* الفاصل "or" مع خطوط رمادية */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-4 text-slate-400 font-medium text-sm">or</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* حقل إدخال البريد الإلكتروني */}
        <div className="mb-6">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition outline-none"
          />
        </div>

        {/* زر "Continue" الأزرق */}
        <button className="w-full bg-[#0061e0] text-white font-semibold py-3 px-6 rounded-lg text-lg hover:bg-[#0052cc] transition-colors mb-4 flex items-center justify-center">
          Continue
        </button>

        {/* مربع الاختيار للاشتراك في الأخبار */}
        <div className="flex items-center mb-6">
          <input
            id="subscribe"
            type="checkbox"
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
            className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="subscribe" className="ml-3 text-slate-700 text-base">
            Email me with news and offers
          </label>
        </div>

        {/* نص شروط الخدمة */}
        <p className="text-center text-slate-500 text-sm">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-blue-600">
            Terms of service
          </a>
        </p>
      </div>

      {/* رابط سياسة الخصوصية في أسفل الصفحة */}
      <div className="absolute bottom-6 left-0 right-0 text-center">
        <a href="#" className="text-slate-500 hover:text-blue-600 text-sm">
          Privacy policy
        </a>
      </div>
    </div>
  );
};

export default SignInPage;