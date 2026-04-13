import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../services/supabase'; // اتأكد من المسار صح

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // 1. تحميل البيانات عند البداية
  useEffect(() => {
    const fetchInitialWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // لو مسجل دخول، هات البيانات من الـ Database
        const { data, error } = await supabase
          .from('favorites')
          .select('products (*)') // بيجيب بيانات المنتج كاملة من جدول المنتجات
          .eq('user_id', user.id);

        if (!error && data) {
          const products = data.map(item => item.products);
          setWishlistItems(products);
        }
      } else {
        // لو مش مسجل دخول، هات من الـ LocalStorage
        const saved = localStorage.getItem('wishlist');
        if (saved) setWishlistItems(JSON.parse(saved));
      }
    };

    fetchInitialWishlist();
  }, []);

  // 2. حفظ في LocalStorage كنسخة احتياطية (للـ Guests)
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ✅ الدالة اللي بنناديها لما الإضافة في Supabase تنجح
  const addToWishlistLocal = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (!exists) return [...prev, product];
      return prev;
    });
  };

  // ✅ الدالة اللي بنناديها لما الحذف من Supabase ينجح
  const removeFromWishlistLocal = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id) => wishlistItems.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ 
      wishlistItems, 
      addToWishlistLocal, 
      removeFromWishlistLocal, 
      isInWishlist,
      setWishlistItems // ضفت دي عشان لو احتاجت تمسح الكل عند تسجيل الخروج
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);