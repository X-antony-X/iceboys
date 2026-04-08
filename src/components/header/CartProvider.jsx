import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // إضافة منتج للسلة
  const addToCart = (product, size, quantity) => {
    setCartItems(prev => {
      const cartItemId = `${product.id}-${size}`; // ID فريد للمنتج بالمقاس
      const existingItem = prev.find(item => item.cartItemId === cartItemId);

      if (existingItem) {
        return prev.map(item =>
          item.cartItemId === cartItemId 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }

      return [...prev, {
        cartItemId,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.mainImage,
        size: size,
        quantity: quantity
      }];
    });
  };

  // تعديل الكمية (لأزرار + و - في السايد بار)
  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  // حذف منتج من السلة
  const removeItem = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  // حساب إجمالي السعر
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);