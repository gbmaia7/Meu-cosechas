/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Extra } from '../data/products';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  size?: string;
  base?: string;
  extras?: Extra[];
  notes?: string;
  quantity: number;
  pointsCost?: number;
}

export interface ActiveOrder {
  id: string;
  items: CartItem[];
  totalPrice: number;
  status: 'preparing' | 'ready';
  modality?: 'counter' | 'delivery';
  address?: { block: string; room: string; complement?: string };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  updateItem: (id: string, updates: Partial<CartItem>) => void;
  userPoints: number;
  setUserPoints: (points: number) => void;
  subsQuota: number;
  setSubsQuota: (quota: number) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  totalItems: number;
  totalPrice: number;
  clearCart: () => void;
  activeOrders: ActiveOrder[];
  addActiveOrder: (order: Omit<ActiveOrder, 'id'>) => void;
  updateActiveOrderStatus: (id: string, status: 'preparing' | 'ready') => void;
  removeActiveOrder: (id: string) => void;
  productFrequency: Record<string, number>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('userPoints');
    return saved ? parseInt(saved, 10) : 5;
  });

  useEffect(() => {
    localStorage.setItem('userPoints', userPoints.toString());
  }, [userPoints]);

  const [subsQuota, setSubsQuota] = useState(() => {
    const saved = localStorage.getItem('subsQuota');
    return saved ? parseInt(saved, 10) : 12; // default to Trio 12
  });

  useEffect(() => {
    localStorage.setItem('subsQuota', subsQuota.toString());
  }, [subsQuota]);

  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to true to not break current flow
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>([]);
  const [productFrequency, setProductFrequency] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('productFrequency');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('productFrequency', JSON.stringify(productFrequency));
  }, [productFrequency]);

  const addActiveOrder = (order: Omit<ActiveOrder, 'id'>) => {
    setActiveOrders((prev) => [...prev, { ...order, id: Math.random().toString(36).substr(2, 9) }]);
    
    // Update product tracking for CRM/Ranking
    setProductFrequency(prev => {
       const next = { ...prev };
       order.items.forEach(item => {
          next[item.productId] = (next[item.productId] || 0) + item.quantity;
       });
       return next;
    });
  };

  const updateActiveOrderStatus = (id: string, status: 'preparing' | 'ready') => {
    setActiveOrders((prev) => prev.map(order => order.id === id ? { ...order, status } : order));
  };

  const removeActiveOrder = (id: string) => {
    setActiveOrders((prev) => prev.filter(order => order.id !== id));
  };

  const addToCart = (newItem: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    const { quantity = 1, ...itemData } = newItem;
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => {
        const sameProduct = i.productId === itemData.productId;
        const sameSize = i.size === itemData.size;
        const sameBase = i.base === itemData.base;
        const sameNotes = i.notes === itemData.notes;
        const sameExtras = JSON.stringify(i.extras) === JSON.stringify(itemData.extras);
        return sameProduct && sameSize && sameBase && sameNotes && sameExtras;
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
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, updateItem, userPoints, setUserPoints, subsQuota, setSubsQuota, isAuthenticated, setIsAuthenticated, totalItems, totalPrice, clearCart, activeOrders, addActiveOrder, updateActiveOrderStatus, removeActiveOrder, productFrequency }}>
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
