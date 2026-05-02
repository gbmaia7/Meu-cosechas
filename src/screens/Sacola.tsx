/**
 * Copyright 2024 Google LLC
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArrowLeft, X, Minus, Plus, Edit, Trash2, Store, Bike, ArrowUp, ArrowRight, Tag, ShoppingBag, Check, Zap, Flower2, Activity, Apple, Wheat, Heart, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PRODUCTS, EXTRA_FITNESS, EXTRA_ACAI, EXTRA_CARIBE, Extra } from '../data/products';
import ProductBottomSheet from '../components/ProductBottomSheet';

const ExtraIcon = ({ iconName }: { iconName: string }) => {
  switch (iconName) {
    case 'bolt': return <Zap className="w-4 h-4" />;
    case 'local_florist': return <Flower2 className="w-4 h-4" />;
    case 'sync_alt': return <Activity className="w-4 h-4" />;
    case 'nutrition': return <Apple className="w-4 h-4" />;
    case 'grain': return <Wheat className="w-4 h-4" />;
    case 'health_and_safety': return <Heart className="w-4 h-4" />;
    default: return <PlusCircle className="w-4 h-4" />;
  }
};

export default function Sacola() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, updateItem, totalPrice, totalItems } = useCart();
  const [modality, setModality] = useState<'counter' | 'delivery'>('counter');
  const [coupon, setCoupon] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<{ product: any, itemId: string } | null>(null);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const deliveryFee = modality === 'counter' ? 0 : 5.00;
  const subtotal = totalPrice;
  const total = subtotal + deliveryFee;

  const turbineSections = useMemo(() => {
    return items.map(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      if (!product) return null;

      // Determine which extra pool to use based on product property or category
      // Based on products.ts, each product has an 'extras' property already.
      const productExtras = product.extras || [];

      // Filter: ONLY show extras NOT currently in the item
      const availableExtras = productExtras.filter(extra => 
        !item.extras?.some(e => e.id === extra.id)
      );

      if (availableExtras.length === 0) return null;

      return {
        itemId: item.id,
        productId: item.productId,
        productName: product.name,
        availableOnly: availableExtras
      };
    }).filter(Boolean);
  }, [items]);

  const handleApplyCoupon = () => {
    if (coupon.toUpperCase() !== 'COSECHAS10') {
      setCouponError(true);
    } else {
      setCouponError(false);
      // Implement coupon logic if needed
    }
  };

  const handleUpgrade = (itemId: string, productId: string) => {
    const item = items.find(i => i.id === itemId);
    const product = PRODUCTS.find(p => p.id === productId);
    if (!item || !product || !product.sizes) return;

    const mSize = product.sizes.find(s => s.label === 'M');
    const gSize = product.sizes.find(s => s.label === 'G');
    
    if (gSize && mSize) {
      const diff = gSize.price - mSize.price;
      updateItem(itemId, { 
        size: 'G', 
        price: item.price + diff,
        name: `${product.name} (G)`
      });
    }
  };

  const handleEditItem = (itemId: string, productId: string) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      setSelectedProductForEdit({ product, itemId });
    }
  };

  const handleQuickAddExtra = (itemId: string, extra: Extra) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      const newExtras = [...(item.extras || []), extra];
      updateItem(itemId, { 
        extras: newExtras,
        price: item.price + extra.price
      });
    }
  };

  const handleUpdateFromSheet = (options: { sizeLabel?: string; price: number; extras: Extra[]; notes: string; quantity: number }) => {
    if (selectedProductForEdit) {
      let displayName = selectedProductForEdit.product.name;
      if (options.sizeLabel) displayName += ` (${options.sizeLabel})`;
      
      updateItem(selectedProductForEdit.itemId, {
        name: displayName,
        price: options.price,
        size: options.sizeLabel,
        extras: options.extras,
        notes: options.notes,
        quantity: options.quantity
      });
      setSelectedProductForEdit(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-[#fcf9f8] min-h-screen flex flex-col items-center justify-center p-6 text-center">
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

        {/* Product List */}
        <section className="space-y-6">
          {items.map((item) => {
            const product = PRODUCTS.find(p => p.id === item.productId);
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
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {item.size && <p className="text-[10px] text-[#5d3f3e]">Tamanho: {item.size}</p>}
                          {item.extras && item.extras.length > 0 && (
                            <p className="text-[10px] text-[#5d3f3e]">
                              Extras: {item.extras.map(e => e.name).join(', ')}
                            </p>
                          )}
                        </div>
                        
                        <div className="inline-flex items-center gap-1 bg-[#FDECEA] px-2 py-0.5 rounded-full mt-2">
                           <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1", color: '#E8173A', fontSize: '12px' }}>nutrition</span>
                           <span className="text-[9px] font-bold text-[#E8173A] leading-none">+1 ponto no Clube Cosechas</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[#bd002a] font-black text-base">
                          {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        <div className="flex items-center bg-[#f6f3f2] rounded-full px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-[#e8173a]"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 font-bold text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-[#e8173a]"
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
            
            {turbineSections.map((section: any) => (
              <div key={section.itemId} className="space-y-3">
                {items.length > 1 && (
                  <p className="text-[11px] font-bold text-[#5d3f3e] uppercase tracking-wider px-1">
                    Para: {section.productName}
                  </p>
                )}
                <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar">
                  {section.availableOnly.map((extra: Extra) => (
                    <div key={extra.id} className="min-w-[150px] bg-white rounded-2xl p-4 border border-[#eae7e7] shadow-sm flex flex-col justify-between">
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                          extra.icon === 'bolt' ? 'bg-yellow-50 text-yellow-600' :
                          extra.icon === 'local_florist' ? 'bg-pink-50 text-pink-600' :
                          extra.icon === 'sync_alt' ? 'bg-blue-50 text-blue-600' :
                          extra.icon === 'health_and_safety' ? 'bg-red-50 text-red-600' :
                          extra.icon === 'nutrition' ? 'bg-green-50 text-green-600' :
                          'bg-[#f0eded] text-[#008388]'
                        }`}>
                          <ExtraIcon iconName={extra.icon} />
                        </div>
                        <h4 className="text-xs font-bold text-[#1c1b1b]">{extra.name}</h4>
                        <p className="text-[9px] text-[#5d3f3e] mt-1 leading-tight line-clamp-2">{extra.description}</p>
                      </div>
                      <div className="mt-4">
                        <p className="text-xs font-black text-[#1c1b1b] text-center mb-3">
                          {extra.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </p>
                        <button 
                          onClick={() => handleQuickAddExtra(section.itemId, extra)}
                          className="w-full border border-[#bd002a] text-[#bd002a] py-2 rounded-full text-[10px] font-bold hover:bg-[#bd002a]/5 active:bg-green-50 active:text-green-600 active:border-green-200 transition-all flex items-center justify-center gap-1"
                        >
                          + Adicionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Clube Cosechas */}
        <section className="bg-[#FDECEA] rounded-lg flex gap-3 items-center py-4 px-4 shadow-sm">
          <span className="material-symbols-outlined text-[#E8173A] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-0.5 w-full">
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#5d3f3e]">Clube Cosechas</span>
              <button className="text-[9px] font-bold text-[#E8173A] px-3 py-1 rounded-full border border-[#E8173A] hover:bg-[#E8173A] hover:text-white transition-colors flex items-center gap-1">
                Ver prêmios <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-sm font-bold text-[#bd002a]">Você tem 7 pontos</p>
            <p className="text-xs font-bold text-[#E8173A]">Prêmio Disponível!</p>
          </div>
        </section>

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
          {couponError && <p className="text-[10px] font-bold text-[#ba1a1a] pl-1">Cupom inválido ou expirado.</p>}
        </section>

        {/* Order Summary */}
        <section className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#e5e2e1]/50 mb-12">
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-xs font-medium text-[#5d3f3e]">
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
            <div className="flex justify-between text-xs font-medium text-[#5d3f3e]">
              <span>Taxa de entrega</span>
              {modality === 'counter' ? (
                <span className="text-[#008388] font-bold uppercase text-[9px]">Grátis</span>
              ) : (
                <span>{deliveryFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              )}
            </div>
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
        <button className="w-full bg-[#E8173A] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all shadow-lg">
          <span>Escolher pagamento</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <ProductBottomSheet 
        product={selectedProductForEdit?.product}
        onClose={() => setSelectedProductForEdit(null)}
        onAdd={handleUpdateFromSheet}
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
      </AnimatePresence>
    </div>
  );
}
