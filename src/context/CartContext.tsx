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
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, totalItems, totalPrice, clearCart }}>
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
