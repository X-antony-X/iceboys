import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

export default function SignInPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  // 1. Mutation لتسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => navigate('/account'),
    onError: (error) => setErrorMessage(error.message)
  });

  // 2. Mutation لإنشاء حساب + إضافة البيانات لجدول profiles
  const signupMutation = useMutation({
    mutationFn: async (userData) => {
      // أ- إنشاء اليوزر مع إضافة الـ display_name في الـ Metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName, // ده اللي بيظهر في الـ User Metadata
            full_name: `${userData.firstName} ${userData.lastName}` // ده اللي بيسمع في الـ Display Name أحياناً
          }
        }
      });

      if (authError) throw new Error(authError.message);

      // ب- إضافة البيانات لجدول الـ profiles (تأكد أن الـ RLS مفتوح كما في الخطوة الأولى)
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              first_name: userData.firstName,
              last_name: userData.lastName,
              phone: userData.phone,
              address: userData.address,
              email: userData.email,
            },
          ]);

        if (profileError) {
          // لو حصل مشكلة في جدول البروفايل، يفضل نمسح اليوزر اللي اتكريه عشان ميعلقش
          console.error("Profile Error:", profileError.message);
          throw new Error("حدث خطأ أثناء حفظ بيانات البروفايل: " + profileError.message);
        }
      }
      return authData;
    },
    onSuccess: () => navigate('/account'),
    onError: (error) => setErrorMessage(error.message)
  });

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setErrorMessage(error.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (isLogin) {
      if (!formData.email || !formData.password) return setErrorMessage('Please fill in all fields');
      loginMutation.mutate({ email: formData.email, password: formData.password });
    } else {
      if (!formData.email || !formData.password || !formData.firstName) return setErrorMessage('Please fill in all required fields');
      signupMutation.mutate(formData);
    }
  };

  const isLoading = loginMutation.isPending || signupMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 border-t-4 border-[#004b93] relative overflow-hidden">
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#004b93] opacity-5 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gray-400 opacity-5 rounded-full blur-2xl"></div>

        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-black text-[#004b93] uppercase tracking-widest mb-2">Ice Boys</h1>
          <p className="text-gray-500 text-sm font-medium">
            {isLogin ? 'Welcome back! Please enter your details.' : 'Create an account to join the crew.'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-sm flex items-start gap-2 text-red-600 text-sm relative z-10">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form className="space-y-4 relative z-10" onSubmit={handleSubmit} autoComplete="off">
          {!isLogin && (
            <>
              <div className="flex gap-4">
                <div className="relative w-full">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                    placeholder="First Name" autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#004b93] text-sm" 
                  />
                </div>
                <div className="relative w-full">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                    placeholder="Last Name" autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#004b93] text-sm" 
                  />
                </div>
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  placeholder="Phone Number" autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#004b93] text-sm" 
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" name="address" value={formData.address} onChange={handleChange}
                  placeholder="Address" autoComplete="off"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#004b93] text-sm" 
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="Email Address" autoComplete="off"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#004b93] text-sm" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" value={formData.password} onChange={handleChange}
              placeholder="Password" 
              autoComplete="new-password"
              className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#004b93] text-sm" 
            />
            {/* زرار العين ثابت وموجود دايماً */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004b93] transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <div className="flex justify-end pt-1">
              <button type="button" className="text-[11px] font-bold text-gray-500 hover:text-[#004b93]">FORGOT PASSWORD?</button>
            </div>
          )}

          <button 
            type="submit" disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-[#004b93] text-white font-bold tracking-widest text-[13px] py-3 rounded-sm hover:bg-[#00366b] disabled:opacity-70 transition-all shadow-sm mt-4"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : null}
            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6 relative z-10">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Or continue with</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button 
          type="button" onClick={handleGoogleLogin}
          className="w-full relative z-10 flex items-center justify-center gap-2 bg-white border border-gray-200 text-[#2d2d2d] font-bold text-sm py-2.5 rounded-sm hover:bg-gray-50 transition-all shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Google
        </button>

        <div className="mt-8 text-center text-[13px] text-gray-600 relative z-10">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setErrorMessage(''); }}
            className="font-bold text-[#004b93] hover:text-[#00366b] transition-colors hover:underline underline-offset-2"
          >
            {isLogin ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  );
}