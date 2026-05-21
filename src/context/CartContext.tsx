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
  pickup_code?: string | null;
  delivery_pin?: string | null;
  payment_method?: string;
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
  addActiveOrder: (order: Omit<ActiveOrder, 'id'>) => Promise<void> | void;
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

  const addActiveOrder = async (order: Omit<ActiveOrder, 'id'>) => {
    console.log('[addActiveOrder] items recebidos:',
      JSON.stringify(order.items.map(i => ({
        name: i.name,
        pointsCost: i.pointsCost,
        startsWithClube: i.name.startsWith('[CLUBE]'),
        startsWithAssinatura: i.name.startsWith('[ASSINATURA]')
      })))
    )
    setProductFrequency(prev => {
      const next = { ...prev };
      order.items.forEach(item => {
        next[item.productId] = (next[item.productId] || 0) + item.quantity;
      });
      return next;
    });

    clearCart();

    if (!session || !phoneVerified) {
      setActiveOrders((prev) => [...prev, {
        ...order,
        id: crypto.randomUUID(),
        pickup_code: null,
        delivery_pin: null,
      }]);
      return;
    }

    const userId = session.user.id;

    let pickupCode: string | null = null;
    let deliveryPin: string | null = null;

    if (order.modality === 'counter' || !order.modality) {
      const today = new Date();
      today.setHours(7, 0, 0, 0);
      const { count } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('modality', 'counter')
        .gte('created_at', today.toISOString());
      const sequence = (count || 0) + 1;
      pickupCode = `C-${String(sequence).padStart(3, '0')}`;
    }

    if (order.modality === 'delivery') {
      deliveryPin = String(Math.floor(1000 + Math.random() * 9000));
    }

    const newOrder: ActiveOrder = {
      ...order,
      id: crypto.randomUUID(),
      pickup_code: pickupCode,
      delivery_pin: deliveryPin,
    };
    setActiveOrders((prev) => [...prev, newOrder]);

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('double_points, status')
      .eq('user_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    const hasDoublePoints = sub?.double_points === true;

    // Verifica se há itens pagos (não resgate de clube/assinatura)
    const hasPaidItems = order.items.some(
      item => !item.name.startsWith('[CLUBE]') &&
              !item.name.startsWith('[ASSINATURA]')
    )

    console.log('[addActiveOrder] hasPaidItems:', hasPaidItems,
      'items nomes:', order.items.map(i => i.name))

    // Se não há itens pagos, não credita pontos
    if (!hasPaidItems) {
      return
    }

    const basePoints = 1;
    const bonusPoints = hasDoublePoints ? 1 : 0;

    const { data: savedOrder, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        subtotal: order.totalPrice,
        total_price: order.totalPrice,
        status: 'preparing',
        payment_status: 'pending',
        modality: order.modality || 'counter',
        points_earned: basePoints + bonusPoints,
        pickup_code: pickupCode,
        delivery_pin: deliveryPin,
      })
      .select('id, pickup_code, delivery_pin')
      .single();

    if (orderError) {
      console.error('[CartContext] Erro ao salvar pedido:', orderError);
      return;
    }

    const orderItems = order.items.map(item => ({
      order_id: savedOrder.id,
      product_id: item.productId,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      size_label: item.size || null,
      base: item.base || null,
      notes: item.notes || null,
      points_cost: item.pointsCost || 0,
      is_reward: (item.pointsCost || 0) > 0,
    }));

    await supabase.from('order_items').insert(orderItems);

    const shouldCreditPoints =
      order.payment_method !== 'cash' &&
      order.payment_method !== 'machine';

    if (shouldCreditPoints) {
      const productNames = order.items
        .filter(i => !i.name.startsWith('[CLUBE]') && !i.name.startsWith('[ASSINATURA]'))
        .map(i => i.name.replace(/^\[.*?\]\s*/, ''))
        .join(', ')

      await supabase.from('loyalty_points_ledger').insert({
        user_id: userId,
        order_id: savedOrder.id,
        points: basePoints,
        reason: 'purchase',
        description: productNames,
      });

      if (bonusPoints > 0) {
        await supabase.from('loyalty_points_ledger').insert({
          user_id: userId,
          order_id: savedOrder.id,
          points: bonusPoints,
          reason: 'double_points',
          description: productNames,
        });
      }

      const newPoints = userPoints + basePoints + bonusPoints;
      const { data: profileData } = await supabase
        .from('profiles')
        .select('total_orders')
        .eq('id', userId)
        .single();

      await supabase
        .from('profiles')
        .update({
          points: newPoints,
          total_orders: (profileData?.total_orders || 0) + 1,
          last_purchase_at: new Date().toISOString(),
        })
        .eq('id', userId);

      setUserPoints(newPoints);
    } else {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('total_orders')
        .eq('id', userId)
        .single();

      await supabase
        .from('profiles')
        .update({
          total_orders: (profileData?.total_orders || 0) + 1,
          last_purchase_at: new Date().toISOString(),
        })
        .eq('id', userId);
    }
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
