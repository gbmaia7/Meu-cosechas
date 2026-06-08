/**
 * Copyright 2024 Google LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, X, Minus, Plus, Edit, Trash2, Store, Bike, ArrowUp, ArrowRight, Tag, ShoppingBag, Check, Zap, Flower2, Activity, Apple, Wheat, Heart, PlusCircle, MapPin, Leaf, Citrus, AlertCircle, Crown, CupSoda, Utensils, User, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { PRODUCTS, EXTRA_FITNESS, EXTRA_ACAI, EXTRA_CARIBE, Extra, CATEGORY_COLORS, LINHA_CARIBE, FUNCIONAL, COMECE_BEM, BOA_DE_DIA, ESPECIAIS, SALADA_DE_FRUTAS, COFFEE } from '../data/products';
import ProductBottomSheet from '../components/ProductBottomSheet';
import { calculateDeliveryFee, calculateDeliverySubtotal, FREE_DELIVERY_MINIMUM } from '../lib/deliveryFee';

const ALL_PRODUCTS = [...PRODUCTS, ...LINHA_CARIBE, ...FUNCIONAL, ...COMECE_BEM, ...ESPECIAIS, ...SALADA_DE_FRUTAS, ...COFFEE, ...Object.values(BOA_DE_DIA)];

const getOriginalProductPrice = (product: any, sizeLabel?: string) => {
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes.find((size: any) => size.label === sizeLabel)?.price ?? product.sizes[0].price;
  }

  return parseFloat((product.priceDisplay || '').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
};

const ExtraIcon = ({ iconName }: { iconName: string }) => {
  switch (iconName) {
    case 'bolt': return <Zap className="w-4 h-4" />;
    case 'local_florist': return <Flower2 className="w-4 h-4" />;
    case 'sync_alt': return <Activity className="w-4 h-4" />;
    case 'nutrition': return <Apple className="w-4 h-4" />;
    case 'grain': return <Wheat className="w-4 h-4" />;
    case 'health_and_safety': return <Heart className="w-4 h-4" />;
    case 'leaf': return <Leaf className="w-4 h-4" />;
    case 'citrus': return <Citrus className="w-4 h-4" />;
    default: return <PlusCircle className="w-4 h-4" />;
  }
};

export default function Sacola() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, addToCart, updateQuantity, removeFromCart, updateItem, totalPrice, totalItems, userPoints, setUserPoints, isAuthenticated, setIsAuthenticated, phoneVerified, addActiveOrder } = useCart();
  const [modality, setModality] = useState<'counter' | 'delivery'>('counter');
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [referrerId, setReferrerId] = useState<string | null>(null);
  const [referralCreditId] = useState<string | null>((location.state as any)?.referralCreditId ?? null);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<{ product: any, itemId: string } | null>(null);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 0);
  }, []);

  const SAVED_ADDRESSES = [
    { id: '1', name: 'Trabalho', block: 'Bloco 2', room: 'Sala 301', complement: '' },
    { id: '2', name: 'Recepção', block: 'Bloco 1', room: 'Recepção', complement: 'Deixar na portaria' }
  ];

  const [useSavedAddress, setUseSavedAddress] = useState<string | 'new'>('1');
  const [showPhoneAlert, setShowPhoneAlert] = useState(false);
  const [showFreeCheckoutConfirm, setShowFreeCheckoutConfirm] = useState(false);

  // Address State
  const [address, setAddress] = useState({
    block: SAVED_ADDRESSES[0].block,
    room: SAVED_ADDRESSES[0].room,
    complement: SAVED_ADDRESSES[0].complement
  });
  const [showAddressErrors, setShowAddressErrors] = useState(false);

  // Update address when a saved one is selected
  const handleAddressSelect = (id: string | 'new') => {
    setUseSavedAddress(id);
    if (id !== 'new') {
      const selected = SAVED_ADDRESSES.find(a => a.id === id);
      if (selected) {
        setAddress({
          block: selected.block,
          room: selected.room,
          complement: selected.complement
        });
      }
    } else {
      setAddress({ block: '', room: '', complement: '' });
    }
  };

  const subtotal = totalPrice;
  const deliverySubtotal = calculateDeliverySubtotal(items);
  const deliveryFee = calculateDeliveryFee(deliverySubtotal, modality);
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_MINIMUM - deliverySubtotal);
  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);

  const isFormValid = useMemo(() => {
    if (modality === 'counter') return true;
    return address.block.trim() !== '' && address.room.trim() !== '';
  }, [modality, address]);

  const turbineSections = useMemo(() => {
    const sections: any[] = [];
    
    items.forEach(item => {
      const product = ALL_PRODUCTS.find(p => p.id === item.productId);
      if (!product) return;

      const productExtras = product.extras || [];

      if (productExtras.length > 0) {
        // Iterate over quantity to create one section per unit
        for (let i = 0; i < item.quantity; i++) {
          sections.push({
            id: `${item.id}-unit-${i}`,
            itemId: item.id,
            productId: item.productId,
            productName: product.name,
            availableOnly: productExtras,
            unitIndex: i + 1,
            totalInGroup: item.quantity,
            originalItem: item
          });
        }
      }
    });

    return sections;
  }, [items]);

  const handleApplyCoupon = async () => {
    setCouponError(false)
    setCouponSuccess(false)
    if (!coupon.trim()) return

    const code = coupon.trim().toUpperCase()

    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', code)
      .single()

    if (!referrer) {
      setCouponError(true)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (referrer.id === user?.id) {
      setCouponError(true)
      return
    }

    const { data: userProfile } = await supabase
      .from('profiles')
      .select('phone_verified')
      .eq('id', user?.id)
      .single()

    if (!userProfile?.phone_verified) {
      setCouponError(true)
      return
    }

    const { count } = await supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user?.id)

    if ((count ?? 0) > 0) {
      setCouponError(true)
      return
    }

    setCouponDiscount(5)
    setAppliedCoupon(code)
    setReferrerId(referrer.id)
    setCouponSuccess(true)
  };

  const handleUpgrade = (itemId: string, productId: string) => {
    const item = items.find(i => i.id === itemId);
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (!item || !product || !product.sizes) return;

    const mSize = product.sizes.find(s => s.label === 'M');
    const gSize = product.sizes.find(s => s.label === 'G');
    
    if (gSize && mSize) {
      const diff = gSize.price - mSize.price;
      const prefix = item.name.startsWith('[INDIQUE]') ? '[INDIQUE] ' : item.name.startsWith('[CLUBE]') ? '[CLUBE] ' : '';
      updateItem(itemId, { 
        size: 'G', 
        price: item.price + diff,
        name: `${prefix}${product.name} (G)`,
        deliveryEligibilityPrice: item.deliveryEligibilityPrice !== undefined
          ? item.deliveryEligibilityPrice + diff
          : undefined,
      });
    }
  };

  const handleEditItem = (itemId: string, productId: string) => {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProductForEdit({ product, itemId });
    }
  };

  const handleQuickToggleExtra = (itemId: string, extra: Extra) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const hasExtra = item.extras?.some(e => e.id === extra.id);

    if (item.quantity > 1) {
      // Split the item: decrease quantity of grouped items
      updateQuantity(itemId, -1);
      
      const newExtras = hasExtra 
        ? (item.extras || []).filter(e => e.id !== extra.id)
        : [...(item.extras || []), extra];

      const priceDiff = hasExtra ? -extra.price : extra.price;

      // Add a single unit with the toggled extra
      addToCart({
        productId: item.productId,
        name: item.name,
        price: item.price + priceDiff,
        size: item.size,
        extras: newExtras,
        notes: item.notes,
        quantity: 1,
        pointsCost: item.pointsCost,
        deliveryEligibilityPrice: item.deliveryEligibilityPrice !== undefined
          ? item.deliveryEligibilityPrice + priceDiff
          : undefined,
      });
    } else {
      // Single item: just update in place
      const newExtras = hasExtra 
        ? (item.extras || []).filter(e => e.id !== extra.id)
        : [...(item.extras || []), extra];
      
      const priceDiff = hasExtra ? -extra.price : extra.price;

      updateItem(itemId, { 
        extras: newExtras,
        price: item.price + priceDiff,
        deliveryEligibilityPrice: item.deliveryEligibilityPrice !== undefined
          ? item.deliveryEligibilityPrice + priceDiff
          : undefined,
      });
    }
  };

  const handleUpdateFromSheet = (options: { sizeLabel?: string; price: number; extras: Extra[]; notes: string; quantity: number }) => {
    if (selectedProductForEdit) {
      const originalItem = items.find(i => i.id === selectedProductForEdit.itemId);
      const isClube = originalItem?.name.startsWith('[CLUBE]');
      const isIndique = originalItem?.name.startsWith('[INDIQUE]');

      let displayName = selectedProductForEdit.product.name;
      if (isClube) displayName = `[CLUBE] ${displayName}`;
      if (isIndique) displayName = `[INDIQUE] ${displayName}`;
      
      if (options.sizeLabel) displayName += ` (${options.sizeLabel})`;
      
      updateItem(selectedProductForEdit.itemId, {
        name: displayName,
        price: options.price,
        size: options.sizeLabel,
        extras: options.extras,
        notes: options.notes,
        quantity: options.quantity,
        deliveryEligibilityPrice: isClube
          ? getOriginalProductPrice(selectedProductForEdit.product, options.sizeLabel) + options.price
          : originalItem?.deliveryEligibilityPrice,
      });
      setSelectedProductForEdit(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#fcf9f8] min-h-screen flex flex-col font-body text-[#1c1b1b]">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center pb-32">
          <div className="w-24 h-24 bg-[#f0eded] rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-12 h-12 text-[#a8a29e]" />
          </div>
          <h2 className="text-xl font-bold text-[#1c1b1b] mb-2 font-display">Sua sacola está vazia</h2>
          <p className="text-sm text-[#5d3f3e] mb-8">Adicione produtos do cardápio para continuar</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#e8173a] text-white px-8 py-4 rounded-full font-bold shadow-lg active:scale-95 transition-transform"
          >
            Ver cardápio
          </button>
        </div>
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
          {[
            { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
            { icon: Crown, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
            { icon: UserPlus, label: 'Indique', active: false, path: isAuthenticated ? '/indique-ganhe/logado' : '/indique-ganhe' },
            { icon: ShoppingBag, label: 'Sacola', active: true, path: '/sacola' },
            { icon: User, label: 'Perfil', active: false, path: isAuthenticated ? '/perfil/logado' : '/perfil/nao-logado' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-2 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
            >
              <item.icon className="w-6 h-6" />
              <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen pb-32 font-body">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl flex items-center justify-between px-6 h-16 border-b border-[#e5e2e1]/50">
        <button onClick={() => navigate(-1)} className="hover:opacity-80 active:scale-90 transition-transform">
          <ArrowLeft className="text-[#E8173A] w-6 h-6" />
        </button>
        <h1 className="font-display text-lg font-bold tracking-tight text-[#1c1b1b]">Minha Sacola ({totalItems})</h1>
        <button onClick={() => navigate('/')} className="hover:opacity-80 active:scale-90 transition-transform">
          <X className="text-[#E8173A] w-6 h-6" />
        </button>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Modality Selector */}
        <section className="flex gap-3">
          <button 
            onClick={() => setModality('counter')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all shadow-sm ${modality === 'counter' ? 'bg-[#e8173a] text-white scale-[1.02]' : 'border-2 border-[#e7bcbb] text-[#bd002a]'}`}
          >
            <Store className={`w-5 h-5 ${modality === 'counter' ? 'fill-white' : ''}`} />
            <span className="text-sm">Retirar no balcão</span>
          </button>
          <button 
            onClick={() => setModality('delivery')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-semibold transition-all shadow-sm ${modality === 'delivery' ? 'bg-[#e8173a] text-white scale-[1.02]' : 'border-2 border-[#e7bcbb] text-[#bd002a]'}`}
          >
            <Bike className={`w-5 h-5 ${modality === 'delivery' ? 'fill-white' : ''}`} />
            <span className="text-sm">Entrega</span>
          </button>
        </section>

        {/* Delivery Address Section */}
        {modality === 'delivery' && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3"
          >
            <div className="bg-[#f0eded] border border-[#e5e2e1] rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-[#e5e2e1]">
                <MapPin className="text-[#E8173A] w-5 h-5" />
                <div>
                  <p className="text-[10px] font-bold text-[#5d3f3e] uppercase leading-none mb-1">Local de Entrega</p>
                  <p className="text-sm font-bold text-[#1c1b1b]">Dimension Park — Barra</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#5d3f3e] uppercase block">Endereço</label>
                <div className="flex flex-col gap-2">
                  {SAVED_ADDRESSES.map((saved) => (
                    <label key={saved.id} onClick={() => handleAddressSelect(saved.id)} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${useSavedAddress === saved.id ? 'bg-white border-[#bd002a]' : 'bg-white/50 border-[#e5e2e1] hover:bg-white'}`}>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${useSavedAddress === saved.id ? 'border-[#bd002a]' : 'border-[#a8a29e]'}`}>
                        {useSavedAddress === saved.id && <div className="w-2 h-2 rounded-full bg-[#bd002a]"></div>}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1c1b1b]">{saved.name}</p>
                        <p className="text-[10px] text-[#5d3f3e]">{saved.block}, {saved.room}</p>
                      </div>
                    </label>
                  ))}
                  <label onClick={() => handleAddressSelect('new')} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${useSavedAddress === 'new' ? 'bg-white border-[#bd002a]' : 'bg-white/50 border-[#e5e2e1] hover:bg-white'}`}>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${useSavedAddress === 'new' ? 'border-[#bd002a]' : 'border-[#a8a29e]'}`}>
                      {useSavedAddress === 'new' && <div className="w-2 h-2 rounded-full bg-[#bd002a]"></div>}
                    </div>
                    <p className="text-xs font-bold text-[#1c1b1b]">Novo Endereço</p>
                  </label>
                </div>
              </div>

              {useSavedAddress === 'new' && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#5d3f3e] uppercase flex items-center gap-0.5">
                        Bloco/Prédio <span className="text-[#E8173A]">*</span>
                      </label>
                      <input 
                        type="text"
                        value={address.block}
                        onChange={(e) => setAddress({ ...address, block: e.target.value })}
                        placeholder="Ex: Bloco 2"
                        className={`w-full bg-white border ${showAddressErrors && !address.block ? 'border-[#bd002a]' : 'border-[#e5e2e1]'} rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#bd002a] outline-none transition-all placeholder:text-[#a8a29e]`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#5d3f3e] uppercase flex items-center gap-0.5">
                        Sala/Apto <span className="text-[#E8173A]">*</span>
                      </label>
                      <input 
                        type="text"
                        value={address.room}
                        onChange={(e) => setAddress({ ...address, room: e.target.value })}
                        placeholder="Ex: Sala 301"
                        className={`w-full bg-white border ${showAddressErrors && !address.room ? 'border-[#bd002a]' : 'border-[#e5e2e1]'} rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#bd002a] outline-none transition-all placeholder:text-[#a8a29e]`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#5d3f3e] uppercase">Complemento</label>
                    <input 
                      type="text"
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      placeholder="Informações adicionais"
                      className="w-full bg-white border border-[#e5e2e1] rounded-xl px-3 py-2.5 text-sm focus:ring-1 focus:ring-[#bd002a] outline-none transition-all placeholder:text-[#a8a29e]"
                    />
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#B45309] text-lg shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                <p className="text-[11px] font-medium text-yellow-800 leading-tight">
                  Entregamos somente no Dimension Park por enquanto.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Product List */}
        <section className="space-y-6">
          {items.map((item) => {
            const product = ALL_PRODUCTS.find(p => p.id === item.productId);
            const canUpgrade = item.size === 'M' && product?.sizes?.some(s => s.label === 'G');
            const upgradePrice = product?.sizes?.find(s => s.label === 'G')?.price! - (product?.sizes?.find(s => s.label === 'M')?.price || 0);

            return (
              <div key={item.id} className="space-y-4">
                <div className="bg-white p-4 rounded-lg flex flex-col gap-3 relative overflow-hidden shadow-sm">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-md overflow-hidden shrink-0 bg-[#f0eded]">
                      <img 
                        alt={item.name} 
                        className="w-full h-full object-cover" 
                        src={product?.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[#1c1b1b] leading-tight text-sm font-display">{product?.name || item.name}</h3>
                        
                        {product && (
                          <div className="flex flex-col gap-1 mt-1 mb-1.5">
                            <div className={`inline-flex self-start ${CATEGORY_COLORS[product.category]} px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase shadow-sm`}>
                              {product.category}
                            </div>
                          </div>
                        )}

                        {product?.description && (
                          <p className="text-[10px] text-[#5d3f3e] leading-tight mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {item.size && <p className="text-[10px] text-[#5d3f3e]">Tamanho: {item.size}</p>}
                          {item.extras && item.extras.length > 0 && (
                            <p className="text-[10px] text-[#5d3f3e]">
                              Extras: {item.extras.map(e => e.name).join(', ')}
                            </p>
                          )}
                        </div>
                        
                        {!item.name.startsWith('[CLUBE]') && (
                          <div className="inline-flex items-center gap-1 bg-[#FDECEA] px-2 py-0.5 rounded-full mt-2">
                             <Crown className="w-3 h-3 text-[#E8173A] shrink-0" />
                             <span className="text-[9px] font-bold text-[#E8173A] leading-none">+1 ponto no Clube Cosechas</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col items-start gap-1">
                          {item.name.startsWith('[CLUBE]') && (
                            <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200/50">
                               <Crown className="w-3 h-3" />
                               <span className="text-[9px] font-bold uppercase tracking-wider">Clube</span>
                            </div>
                          )}
                          {(item.price > 0 || !item.name.startsWith('[CLUBE]')) && (
                            <span className={`text-[#bd002a] font-black ${item.name.startsWith('[CLUBE]') ? 'text-xs' : 'text-base'}`}>
                              {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center bg-[#f6f3f2] rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-[#e8173a]"
                            disabled={item.quantity === 1}
                          >
                            <Minus className={`w-3.5 h-3.5 ${item.quantity === 1 ? 'opacity-30' : ''}`} />
                          </button>
                          <span className="px-3 font-bold text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className={`w-6 h-6 flex items-center justify-center text-[#e8173a] ${item.name.startsWith('[CLUBE]') ? 'opacity-30 cursor-not-allowed' : ''}`}
                            disabled={item.name.startsWith('[CLUBE]')}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {canUpgrade && (
                    <div className="bg-[#ecfeff] border border-[#a5f3fc] rounded-xl p-3 flex items-center justify-between mt-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#cffafe] flex items-center justify-center">
                          <ArrowUp className="text-[#0891b2] w-4 h-4" />
                        </div>
                        <p className="text-[10px] font-semibold text-[#164e63] leading-tight">
                          Upgrade para G por apenas <br/><span className="font-bold">+{upgradePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        </p>
                      </div>
                      <button 
                        onClick={() => handleUpgrade(item.id, item.productId)}
                        className="bg-white border-2 border-[#0891b2] text-[#0891b2] px-4 py-1.5 rounded-full text-[9px] font-bold hover:bg-[#0891b2] hover:text-white transition-colors"
                      >
                        UPGRADE
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-6 px-2">
                  <button 
                    onClick={() => handleEditItem(item.id, item.productId)}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#5d3f3e] hover:opacity-70 transition-opacity"
                  >
                    <Edit className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button 
                    onClick={() => setItemToRemove(item.id)}
                    className="flex items-center gap-1 text-[10px] font-bold text-[#bd002a] hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remover
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        {/* Turbine seu pedido */}
        {turbineSections.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display font-bold text-[#1c1b1b] px-1 text-base">Turbine seu pedido 💪</h2>
            
            {turbineSections.map((section: any) => {
              const fullOrder = [
                'Iogurte', 'Sorvete', 'Granola', 'Aveia', 'Mel de Abelha', 
                'Leite Desnatado', 'Leite de Soja', 'Whey Protein', 'Colágeno', 'Creatina'
              ];

              const sortedExtras = [...section.availableOnly].sort((a: Extra, b: Extra) => {
                const indexA = fullOrder.indexOf(a.name);
                const indexB = fullOrder.indexOf(b.name);
                return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
              });

              if (sortedExtras.length === 0) return null;

              return (
                <div key={section.id} className="space-y-3">
                  <p className="text-[11px] font-bold text-[#5d3f3e] uppercase tracking-wider px-1">
                    {section.productName} {section.totalInGroup > 1 ? `— unidade ${section.unitIndex}` : ''}
                  </p>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar">
                    {sortedExtras.map((extra: Extra) => (
                      <div key={extra.id} className="min-w-[150px] bg-white rounded-2xl p-4 border border-[#eae7e7] shadow-sm flex flex-col justify-between">
                        <div className="flex flex-col items-center text-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                            extra.icon === 'bolt' ? 'bg-yellow-50 text-yellow-600' :
                            extra.icon === 'local_florist' ? 'bg-pink-50 text-pink-600' :
                            extra.icon === 'sync_alt' ? 'bg-blue-50 text-blue-600' :
                            extra.icon === 'health_and_safety' ? 'bg-red-50 text-red-600' :
                            extra.icon === 'nutrition' ? 'bg-green-50 text-green-600' :
                            extra.icon === 'leaf' ? 'bg-green-50 text-[#16a34a]' :
                            extra.icon === 'citrus' ? 'bg-orange-50 text-[#ea580c]' :
                            'bg-[#f0eded] text-[#008388]'
                          }`}>
                            <ExtraIcon iconName={extra.icon} />
                          </div>
                          <h4 className="text-xs font-bold text-[#1c1b1b]">{extra.name}</h4>
                          <p className="text-[9px] text-[#5d3f3e] mt-1 leading-tight line-clamp-2">{extra.description}</p>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                          <p className="text-xs font-black text-[#1c1b1b] text-center">
                            {extra.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </p>
                          {extra.glutenFree === false && (
                            <span className="text-[9px] text-[#5d3f3e]/60 font-normal mt-0.5 mb-2">
                              contém glúten
                            </span>
                          )}
                          {(() => {
                            const isSelected = section.originalItem.extras?.some((e: Extra) => e.id === extra.id);
                            return (
                              <button 
                                onClick={() => handleQuickToggleExtra(section.itemId, extra)}
                                className={`w-full py-2 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 border ${
                                  isSelected 
                                    ? 'bg-green-50 text-green-600 border-green-200 mt-2' 
                                    : 'mt-auto border-[#bd002a] text-[#bd002a] hover:bg-[#bd002a]/5 active:bg-green-50 active:text-green-600 active:border-green-200'
                                }`}
                              >
                                {isSelected ? (
                                  <><Check className="w-3 h-3" /> Adicionado</>
                                ) : (
                                  '+ Adicionar'
                                )}
                              </button>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Simulator Toggle (Preview Only) */}
        <div className="px-1 flex justify-end gap-2">
          <button 
            onClick={() => setIsAuthenticated(!isAuthenticated)}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Simular: {isAuthenticated ? 'Sair' : 'Entrar'}
          </button>
          {isAuthenticated && (
            <button 
              onClick={() => setUserPoints(userPoints >= 7 ? 5 : 7)}
              className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
            >
              Pontos: {userPoints}
            </button>
          )}
        </div>

        {/* Clube Cosechas */}
        {!isAuthenticated ? (
          <section className="bg-[#FDECEA] rounded-lg p-4 shadow-sm">
            <div className="flex gap-3 items-center mb-1">
              <Crown className="text-[#E8173A] w-6 h-6 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5 w-full gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d3f3e]">Clube Cosechas</span>
                  <button 
                    onClick={() => navigate('/clube/nao-logado')}
                    className="text-[10px] font-bold text-[#E8173A] px-3 py-1 rounded-full border border-[#E8173A] hover:bg-[#E8173A] hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    Ver detalhes <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-sm font-bold text-[#E8173A]">Acumule pontos e ganhe prêmios</p>
                <p className="text-xs text-[#5d3f3e]/80">Faça login ou cadastre-se para participar do Clube Cosechas</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="bg-[#E8173A] text-white rounded-full py-2.5 font-bold text-sm mt-3 w-full active:scale-95 transition-transform"
            >
              Entrar ou cadastrar
            </button>
          </section>
        ) : userPoints < 7 ? (
          <section className="bg-[#FDECEA] rounded-lg flex gap-3 items-center py-4 px-4 shadow-sm">
            <Crown className="text-[#E8173A] w-6 h-6 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5 w-full gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d3f3e]">Clube Cosechas</span>
                <button 
                  onClick={() => navigate('/clube/logado')}
                  className="text-[10px] font-bold text-[#E8173A] px-3 py-1 rounded-full border border-[#E8173A] hover:bg-[#E8173A] hover:text-white transition-colors flex items-center gap-1 whitespace-nowrap"
                >
                  Ver detalhes <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-bold text-[#E8173A]">Você tem {userPoints} pontos</p>
              <p className="text-xs text-[#5d3f3e]/80">Faltam {7 - userPoints} pontos para o seu primeiro prêmio</p>
            </div>
          </section>
        ) : (
          <section className="bg-[#FDECEA] rounded-lg flex gap-3 items-center py-4 px-4 shadow-sm">
            <Crown className="text-[#E8173A] w-6 h-6 shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5 w-full">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#5d3f3e]">Clube Cosechas</span>
                <button 
                  onClick={() => navigate('/clube/logado')}
                  className="text-[9px] font-bold text-[#E8173A] px-3 py-1 rounded-full border border-[#E8173A] hover:bg-[#E8173A] hover:text-white transition-colors flex items-center gap-1"
                >
                  Ver prêmios <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <p className="text-sm font-bold text-[#bd002a]">Você tem {userPoints} pontos</p>
              <p className="text-xs font-bold text-[#E8173A]">Prêmio Disponível!</p>
            </div>
          </section>
        )}

        {/* Coupon */}
        <section className="bg-[#E6F7F5] border border-[#D1EAE7] rounded-xl p-4 space-y-3 shadow-sm">
          <label className="text-xs font-bold text-[#004f52] block pl-1">Tem um cupom? Digite aqui.</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-[#008388] w-4 h-4" />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D1EAE7] rounded-lg text-xs focus:ring-1 focus:ring-[#008388] focus:border-[#008388] outline-none placeholder:text-[#a8a29e]" 
                placeholder="Cupom" 
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                type="text"
              />
            </div>
            <button 
              onClick={handleApplyCoupon}
              className="bg-[#bd002a] text-white px-6 py-2.5 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
            >
              Aplicar
            </button>
          </div>
          {couponError && (
            <p className="text-[10px] font-bold text-[#ba1a1a] pl-1">
              Cupom inválido, já utilizado ou não aplicável ao seu perfil.
            </p>
          )}
          {couponSuccess && (
            <p className="text-[10px] font-bold text-green-700 pl-1">
              Cupom aplicado! R$5,00 de desconto.
            </p>
          )}
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#e5e2e1]/50 mb-12">
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-xs font-medium text-[#5d3f3e]">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Desconto indicação ({appliedCoupon})</span>
                <span>- R$ 5,00</span>
              </div>
            )}
            <div className="flex justify-between text-xs font-medium text-[#5d3f3e]">
              <span>Taxa de entrega</span>
              {modality === 'counter' ? (
                <span className="text-[#008388] font-bold uppercase text-[9px]">Grátis</span>
              ) : (
                <span>{deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              )}
            </div>
            {modality === 'delivery' && (
              <p className={`text-[10px] font-bold ${deliveryFee === 0 ? 'text-[#008388]' : 'text-[#5d3f3e]'}`}>
                {deliveryFee === 0
                  ? 'Frete grátis liberado.'
                  : `Faltam ${remainingForFreeDelivery.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} em produtos ou adicionais para frete grátis.`}
              </p>
            )}
            <div className="pt-4 flex justify-between items-center border-t border-[#f0eded] border-dashed">
              <span className="text-sm font-bold text-[#1c1b1b]">Total</span>
              <span className="text-xl font-black text-[#bd002a]">
                {total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white px-6 pt-4 pb-10 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] z-[60]">
        <button 
          onClick={() => {
            if (!isFormValid) {
              setShowAddressErrors(true);
            } else if (modality === 'delivery' && !phoneVerified) {
              setShowPhoneAlert(true);
            } else if (total === 0) {
              setShowFreeCheckoutConfirm(true);
            } else if (!isAuthenticated) {
              navigate('/login', {
                state: { returnTo: '/pagamento', returnState: { modality, address, couponDiscount, referrerId, referralCreditId } },
              });
            } else {
              navigate('/pagamento', { state: { modality, address, couponDiscount, referrerId, referralCreditId } });
            }
          }}
          disabled={!isFormValid && false} // Keep enabled to show errors if clicked, OR follow prompt: "desabilitado (opacidade reduzida) enquanto estiverem vazios"
          className={`w-full bg-[#E8173A] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${!isFormValid ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95 active:scale-[0.98]'}`}
        >
          <span>Escolher pagamento</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <ProductBottomSheet 
        product={selectedProductForEdit?.product}
        onClose={() => setSelectedProductForEdit(null)}
        onAdd={handleUpdateFromSheet}
        isReward={
          selectedProductForEdit ? 
            (() => {
              const item = items.find(i => i.id === selectedProductForEdit.itemId);
              return item?.name.startsWith('[CLUBE]');
            })() 
          : false
        }
        rewardType={
          selectedProductForEdit ? 
            (() => {
              const item = items.find(i => i.id === selectedProductForEdit.itemId);
              if (item?.name.startsWith('[CLUBE]')) return 'clube' as const;
              return undefined;
            })() 
          : undefined
        }
        discountAmount={
          selectedProductForEdit ?
            (() => {
              const item = items.find(i => i.id === selectedProductForEdit.itemId);
              return item?.name.startsWith('[INDIQUE]') ? 5 : 0;
            })()
          : 0
        }
        discountLabel={
          selectedProductForEdit ?
            (() => {
              const item = items.find(i => i.id === selectedProductForEdit.itemId);
              return item?.name.startsWith('[INDIQUE]') ? '-R$5' : undefined;
            })()
          : undefined
        }
      />

      {/* Removal Confirmation Overlay */}
      <AnimatePresence>
        {itemToRemove && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 sm:items-center sm:pb-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setItemToRemove(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-bold mb-2">Remover item?</h3>
              <p className="text-sm text-[#5d3f3e] mb-6">Tem certeza que deseja remover este item da sua sacola?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setItemToRemove(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#f0eded] text-[#1c1b1b]"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    const itemRemoved = items.find(i => i.id === itemToRemove);
                    if (itemRemoved?.pointsCost) {
                      setUserPoints(userPoints + (itemRemoved.pointsCost * itemRemoved.quantity));
                    }
                    removeFromCart(itemToRemove);
                    setItemToRemove(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold text-sm bg-[#bd002a] text-white"
                >
                  Remover
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showFreeCheckoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 sm:items-center sm:pb-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowFreeCheckoutConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%', opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: '100%', opacity: 0 }} 
              className="relative w-full max-w-sm bg-[#fcf9f8] rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="mx-auto w-12 h-1.5 bg-[#e5e2e1] rounded-full mb-6" />
              
              <div className="w-16 h-16 bg-[#FDECEA] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-[#E8173A] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              
              <h3 className="font-display text-xl font-bold text-center text-[#1c1b1b] mb-2">Confirmar resgate grátis?</h3>
              <p className="text-center text-[#5d3f3e] text-sm mb-6">
                Este pedido não terá custos e utilizará seus benefícios do Clube Cosechas. <strong>Esta ação não poderá ser desfeita</strong>. Confirma o resgate?
              </p>
              
              <div className="flex flex-col gap-3">
                <button
                  onClick={async () => {
                    setShowFreeCheckoutConfirm(false);
                    const order = await addActiveOrder({
                      items,
                      totalPrice: 0,
                      status: 'new',
                      modality,
                      address: modality === 'delivery' ? address : undefined,
                      payment_method: 'subscription',
                    });
                    if (referralCreditId) {
                      await supabase.from('referrals')
                        .update({ credit_redeemed_at: new Date().toISOString() })
                        .eq('id', referralCreditId)
                        .is('credit_redeemed_at', null);
                    }
                    navigate('/pagamento-confirmado', {
                      state: {
                        modality,
                        address,
                        isReward: true,
                        couponDiscount,
                        referrerId,
                        orderId: order?.id,
                        pickupCode: order?.pickup_code,
                        deliveryPin: order?.delivery_pin,
                      },
                    });
                  }}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-[#bd002a] text-white hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  Confirmar Resgate
                </button>
                <button 
                  onClick={() => setShowFreeCheckoutConfirm(false)}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-[#e5e2e1] text-[#5d3f3e] hover:bg-[#d8d4d3] active:scale-[0.98] transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showPhoneAlert && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-12 sm:items-center sm:pb-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowPhoneAlert(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl pb-12 sm:pb-6"
            >
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#1c1b1b] mb-2 leading-tight">
                Verifique seu telefone
              </h3>
              <p className="text-sm text-[#5d3f3e] mb-8 leading-relaxed">
                Para realizar pedidos com entrega, precisamos que seu telefone esteja verificado. Ele é necessário para a nossa equipe entrar em contato na hora da entrega, além de trazer benefícios pro Clube Cosechas!
              </p>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => navigate('/perfil/verificar-telefone')}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-[#bd002a] text-white hover:opacity-95 active:scale-[0.98] transition-all"
                >
                  Verificar Telefone
                </button>
                <button 
                  onClick={() => setShowPhoneAlert(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-[#f6f3f2] text-[#5d3f3e] hover:bg-[#f0eded] active:scale-[0.98] transition-all"
                >
                  Voltar para sacola
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
