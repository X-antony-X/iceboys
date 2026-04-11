import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Mail, Phone, Package, LogOut, Loader2, Edit2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';;

export default function AccountPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) throw new Error('Not authenticated');

        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

        if (error) throw error;
        return data;
    },
    retry: false,
    });

const handleSignOut = async () => {
    await supabase.auth.signOut();

    queryClient.clear(); 

    navigate('/', { replace: true });
  };

  if  (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <Loader2 size={32} className="animate-spin text-[#004b93]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans pb-12">
      
      {/* هيدر الصفحة */}
      <div className="bg-white border-b border-gray-200 pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <h1 className="text-3xl font-black text-[#2d2d2d] tracking-tight">
              My Account
            </h1>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors w-fit"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* التبويبات (Tabs) */}
          <div className="flex items-center gap-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'profile'
                  ? 'border-[#004b93] text-[#004b93]'
                  : 'border-transparent text-gray-500 hover:text-[#2d2d2d]'
              }`}
            >
              PROFILE DETAILS
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-4 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'orders'
                  ? 'border-[#004b93] text-[#004b93]'
                  : 'border-transparent text-gray-500 hover:text-[#2d2d2d]'
              }`}
            >
              ORDER HISTORY
            </button>
          </div>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* === تبويب البروفايل === */}
        {activeTab === 'profile' && profileData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* كارت المعلومات الشخصية */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#004b93]"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
                  <User size={20} className="text-[#004b93]" />
                  Personal Information
                </h2>
                <button className="text-gray-400 hover:text-[#004b93] transition-colors">
                  <Edit2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="text-gray-800 font-medium capitalize">
                    {profileData.first_name} {profileData.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Email Address</p>
                  <p className="text-gray-800 font-medium">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">Phone Number</p>
                  <p className="text-gray-800 font-medium">{profileData.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* كارت العناوين */}
            <div className="bg-white rounded-md border border-gray-200 shadow-sm p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[#2d2d2d] flex items-center gap-2">
                  <MapPin size={20} className="text-[#004b93]" />
                  Saved Address
                </h2>
              </div>

              <div className="p-4 border border-gray-100 bg-gray-50 rounded-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-1 bg-white border border-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider rounded-sm mb-2">
                      Default Address
                    </span>
                    <p className="text-gray-800 text-sm leading-relaxed max-w-md">
                      {profileData.address || 'No address provided yet.'}
                    </p>
                  </div>
                  <button className="text-gray-400 hover:text-[#004b93] transition-colors mt-1">
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* === تبويب الطلبات === */}
        {activeTab === 'orders' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="bg-white rounded-md border border-gray-200 shadow-sm p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Package size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#2d2d2d] mb-2">No orders yet</h3>
              <p className="text-gray-500 text-sm mb-6 max-w-sm">
                Looks like you haven't made your first purchase with Ice Boys yet. 
                Go to the store to place an order.
              </p>
              <button 
                onClick={() => navigate('/store')} // عدل المسار ده لصفحة المنتجات بتاعتك
                className="bg-[#004b93] text-white font-bold text-[13px] tracking-widest uppercase px-8 py-3 rounded-sm hover:bg-[#00366b] transition-colors"
              >
                Start Shopping
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}