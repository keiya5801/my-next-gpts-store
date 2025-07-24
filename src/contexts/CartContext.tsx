'use client';
import { createContext, useState, useContext, ReactNode } from 'react';
import type { Game } from '@/types'; // ★ここが変更点！中央の型定義をインポート

type CartContextType = {
  cartItems: Game[];
  addToCart: (item: Game) => void;
  removeFromCart: (itemId: number) => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<Game[]>([]);

  const addToCart = (item: Game) => {
    setCartItems(prevItems => {
      if (!prevItems.find(cartItem => cartItem.id === item.id)) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};