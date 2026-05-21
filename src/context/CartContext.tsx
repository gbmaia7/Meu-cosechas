/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Extra } from '../data/products';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

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
  session: Session | null;
  phoneVerified: boolean;
  canEarnPoints: boolean;
  canSubscribe: boolean;
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

  const [session, setSession] = useState<Session | null>(null);
  const [phoneVerified, setPhoneVerified] = useState(false);

  const isAuthenticated = session !== null;
  const canEarnPoints = isAuthenticated && phoneVerified;
  const canSubscribe = isAuthenticated && phoneVerified;
  // kept for backward compatibility — Supabase is now the source of truth
  const setIsAuthenticated = (_val: boolean) => {};

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('points, phone_verified')
      .eq('id', userId)
      .single()
    if (data) {
      setPhoneVerified(data.phone_verified)
      setUserPoints(data.points)
    }
  }

  useEffect(() => {
    console.log('[CartContext] iniciando auth listener')

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('[CartContext] getSession:', { session, error })
      setSession(session)
      if (session) fetchProfile(session.user.id)
    }).catch(err => console.error('[CartContext] getSession error:', err))

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('[CartContext] onAuthStateChange:', { _event, session })
        setSession(session)
        if (session) fetchProfile(session.user.id)
        else {
          setPhoneVerified(false)
          setUserPoints(0)
          setSubsQuota(0)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

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
    <CartContext.Provider value={{ items, addToCart, updateQuantity, removeFromCart, updateItem, userPoints, setUserPoints, subsQuota, setSubsQuota, isAuthenticated, setIsAuthenticated, session, phoneVerified, canEarnPoints, canSubscribe, totalItems, totalPrice, clearCart, activeOrders, addActiveOrder, updateActiveOrderStatus, removeActiveOrder, productFrequency }}>
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
