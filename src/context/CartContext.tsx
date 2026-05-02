/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Extra } from '../data/products';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size?: string;
  extras?: Extra[];
  notes?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  userPoints: number;
  setUserPoints: (points: number) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userPoints, setUserPoints] = useState(5); // Default points as seen in Home screen
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true to not break current flow

  const addToCart = (newItem: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    const { quantity = 1, ...itemData } = newItem;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => {
        const sameProduct = i.productId === itemData.productId;
        const sameSize = i.size === itemData.size;
        const sameNotes = i.notes === itemData.notes;
        const sameExtras = JSON.stringify(i.extras) === JSON.stringify(itemData.extras);
        return sameProduct && sameSize && sameNotes && sameExtras;
      });

      if (existingIndex !== -1) {
        const updatedItems = [...prev];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return updatedItems;
      }
      
      return [...prev, { ...itemData, id: Math.random().toString(36).substr(2, 9), quantity }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) => 
      prev.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<CartItem>) => {
    setItems((prev) => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, updateItem, userPoints, setUserPoints, isAuthenticated, setIsAuthenticated, totalItems, totalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
