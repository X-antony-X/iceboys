import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../services/supabase';

// دالة جلب البيانات من Supabase
const fetchCollections = async () => {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('is_active', true) // بنعرض الكوليكشنز المفعلة بس
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function Collections() {
  // استخدام React Query لجلب البيانات
  const { data: collections, isLoading, isError, error } = useQuery({
    queryKey: ['active-collections'],
    queryFn: fetchCollections,
  });

  // حالة التحميل (Loading State)
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <Loader2 className="w-10 h-10 text-[#004b93] animate-spin mb-4" />
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-500">Loading Collections...</p>
      </div>
    );
  }

  // حالة الخطأ (Error State)
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-sm font-bold text-gray-700">Oops! Something went wrong.</p>
        <p className="text-xs text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  // حالة عدم وجود كوليكشنز (Empty State)
  if (!collections || collections.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa]">
        <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-[#2d2d2d]">No Collections Yet</h2>
        <p className="text-gray-500 mt-4 text-sm">Stay tuned for our upcoming drops!</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-xl md:text-5xl lg:text-6xl font-black uppercase tracking-[0.2em] text-[#004b93]  mb-4">
          Our Collections
        </h1>
        <div className="w-16 h-1 bg-[#2d2d2d] mx-auto"></div>
      </div>

      {/* Collections Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {collections.map((collection) => (
          <div key={collection.id} className="group flex flex-col bg-white rounded-sm shadow-sm hover:shadow-2xl transition-shadow duration-500 overflow-hidden border border-gray-100">
            
            {/* Image Container with Hover Zoom Effect */}
            <Link to={`/collections/${collection.id}`} className="relative h-[450px] sm:h-[500px] overflow-hidden block bg-gray-100">
              {collection.image_url ? (
                <img
                  src={collection.image_url}
                  alt={collection.name}
                  className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 text-sm uppercase tracking-widest">
                  No Image
                </div>
              )}
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500 z-10"></div>
            </Link>

            {/* Content Area */}
            <div className="p-8 flex flex-col flex-grow items-center text-center">
              <h3 className="text-lg font-black uppercase tracking-[0.15em] text-[#2d2d2d] mb-3">
                {collection.name}
              </h3>
              
              {collection.description && (
                <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                  {collection.description}
                </p>
              )}

              <div className="mt-auto w-full">
                <Link
                  to={`/collections/${collection.id}`}
                  className="block w-full py-4 px-6 bg-[#2d2d2d] text-white text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#004b93] transition-colors duration-300 text-center"
                >
                  Shop Collection
                </Link>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}