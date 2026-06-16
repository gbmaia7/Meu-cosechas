/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X, Check, Minus, Plus, Zap, Flower2, Activity, PlusCircle, Apple, Wheat, Heart, Star, Leaf, Citrus, IceCream, Milk, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { Product, Extra } from '../data/products';
import ImageLightbox from './ImageLightbox';

interface ProductBottomSheetProps {
  product: Product | null;
  onClose: () => void;
  onAdd: (options: { sizeLabel?: string; price: number; extras: Extra[]; notes: string; quantity: number; base?: string }) => void;
  isReward?: boolean;
  rewardType?: 'clube';
  discountAmount?: number;
  discountLabel?: string;
}

const ExtraIcon = ({ iconName }: { iconName: string }) => {
  switch (iconName) {
    case 'bolt': return <Zap className="w-5 h-5" />;
    case 'local_florist': return <Flower2 className="w-5 h-5" />;
    case 'sync_alt': return <Activity className="w-5 h-5" />;
    case 'nutrition': return <Apple className="w-5 h-5" />;
    case 'grain': return <Wheat className="w-5 h-5" />;
    case 'health_and_safety': return <Heart className="w-5 h-5" />;
    case 'leaf': return <Leaf className="w-5 h-5" />;
    case 'citrus': return <Citrus className="w-5 h-5" />;
    case 'icecream': return <IceCream className="w-5 h-5" />;
    case 'milk': return <Milk className="w-5 h-5" />;
    default: return <PlusCircle className="w-5 h-5" />;
  }
};

export default function ProductBottomSheet({ product, onClose, onAdd, isReward, rewardType, discountAmount = 0, discountLabel }: ProductBottomSheetProps) {
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [selectedBase, setSelectedBase] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.sizes) {
        const gIndex = product.sizes.findIndex(s => s.label === 'G');
        setSelectedSizeIndex(gIndex !== -1 ? gIndex : 0);
      } else {
        setSelectedSizeIndex(0);
      }
      setSelectedExtras([]);
      setSelectedBase('');
      setNotes('');
    }
  }, [product?.id]);

  const originalProductPrice = useMemo(() => {
    if (!product) return 0;
    return product.sizes 
      ? product.sizes[selectedSizeIndex].price 
      : parseFloat(product.priceDisplay.replace(/[^\d,]/g, '').replace(',', '.'));
  }, [product, selectedSizeIndex]);

  const selectedBasePrice = useMemo(() => {
    if (!product?.baseOptions || !selectedBase) return 0;
    return product.baseOptions.find(o => o.label === selectedBase)?.price ?? 0;
  }, [product, selectedBase]);

  const baseUnitPrice = useMemo(() => {
    if (!product) return 0;
    const basePrice = isReward ? 0 : originalProductPrice;
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    return Math.max(0, basePrice + extrasPrice + selectedBasePrice - discountAmount);
  }, [product, isReward, originalProductPrice, selectedExtras, selectedBasePrice, discountAmount]);

  const originalTotalPrice = useMemo(() => {
    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    return originalProductPrice + extrasPrice + selectedBasePrice;
  }, [originalProductPrice, selectedExtras, selectedBasePrice]);

  const totalPrice = useMemo(() => baseUnitPrice, [baseUnitPrice]);

  if (!product) return null;

  const toggleExtra = (extra: Extra) => {
    setSelectedExtras(prev => 
      prev.find(e => e.id === extra.id)
        ? prev.filter(e => e.id !== extra.id)
        : [...prev, extra]
    );
  };

  const handleAdd = () => {
    const sizeLabel = product.sizes ? product.sizes[selectedSizeIndex].label : undefined;
    onAdd({
      sizeLabel,
      price: baseUnitPrice,
      extras: selectedExtras,
      notes,
      quantity: 1,
      base: selectedBase || undefined
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 pointer-events-auto"
        />
        
        {/* Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#fcf9f8] rounded-t-[2.5rem] overflow-hidden pointer-events-auto shadow-2xl flex flex-col max-h-[90dvh]"
        >
          {/* New Detailed Header */}
          <header className="sticky top-0 w-full z-10 bg-white/70 backdrop-blur-xl border-b border-[#f0eded]">
            <div className="flex justify-end p-4 pb-0">
               <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-[#f0eded] rounded-full text-[#bd002a] active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="px-6 pb-6 pt-2">
              <div className="flex gap-4">
                <button 
                  onClick={() => setIsLightboxOpen(true)}
                  className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-low flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
                >
                  <img 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                    src={product.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"}
                  />
                </button>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h1 className="font-display text-lg font-bold text-[#1c1b1b] leading-tight mb-1">
                      {product.name}
                    </h1>
                    {!product.sizes && product.volume && (
                      <p className="text-[10px] font-bold text-[#bd002a] uppercase tracking-wider mb-1">
                        Tamanho único {product.volume}
                      </p>
                    )}
                    <p className="text-xs text-[#5d3f3e] leading-relaxed">
                      {product.description}
                    </p>
                    {!isReward && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        <div className="inline-flex items-center gap-1.5 bg-[#FDECEA] px-3 py-1 rounded-full">
                          <Crown className="w-3.5 h-3.5 text-[#E8173A] shrink-0" />
                          <span className="text-[10px] font-bold text-[#E8173A] leading-none">+1 ponto no Clube Cosechas</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {isReward ? (
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-[#a8a29e] line-through text-xs font-bold leading-tight">
                          {originalTotalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                        {rewardType === 'clube' && (
                          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-600 border border-amber-200/50">
                            <Crown className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-wider">Clube</span>
                          </div>
                        )}
                        {(totalPrice > 0 || (!rewardType)) && (
                          <span className={`text-[#13612f] font-extrabold ${rewardType ? 'text-sm mt-0.5' : 'text-lg leading-none mt-1'}`}>
                            {totalPrice === 0 ? 'GRÁTIS' : totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-start gap-1">
                        {discountAmount > 0 && (
                          <span className="text-[#a8a29e] line-through text-xs font-bold leading-tight">
                            {originalTotalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-[#e8173a] font-extrabold text-lg">
                            {baseUnitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                          {discountLabel && (
                            <span className="text-[9px] font-black bg-[#008388] text-white px-1.5 py-0.5 rounded-sm leading-none">
                              {discountLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <ImageLightbox 
            isOpen={isLightboxOpen} 
            onClose={() => setIsLightboxOpen(false)} 
            imageSrc={product.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} 
          />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32">
            {/* Compact Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <section>
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-[#1c1b1b]">Selecione o tamanho:</h3>
                  <div className="flex gap-3">
                    {product.sizes.map((size, index) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSizeIndex(index)}
                        className={`flex-1 px-3 py-2.5 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-0.5 ${
                          selectedSizeIndex === index
                            ? 'border-[#bd002a] bg-[#bd002a]/5 text-[#bd002a]'
                            : 'border-[#e5e2e1] bg-white text-[#5d3f3e]'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm">{size.label}</span>
                          <span className="opacity-40 text-xs font-light">|</span>
                          <span className="font-bold text-xs">
                            {Math.max(0, size.price - discountAmount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                        {size.volume && (
                          <span className="text-[10px] font-medium opacity-60">
                            {size.volume}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Base Options Section */}
            {product.baseOptions && product.baseOptions.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-bold text-[#1c1b1b]">
                  {product.id === 'salada-2'
                    ? 'Escolhe seu acompanhamento (obrigatório):'
                    : product.baseOptions?.some(o => o.label === 'Iogurte' || o.label === 'Sorvete')
                      ? 'Batido com (obrigatório):'
                      : 'Escolha sua base (obrigatório):'}
                </h3>
                <div className="flex gap-3">
                  {product.baseOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setSelectedBase(option.label)}
                      className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                        selectedBase === option.label
                          ? 'border-[#bd002a] bg-[#bd002a]/5 text-[#bd002a]'
                          : 'border-[#e5e2e1] bg-white text-[#5d3f3e]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        selectedBase === option.label ? 'border-[#bd002a]' : 'border-[#e5e2e1]'
                      }`}>
                        {selectedBase === option.label && <div className="w-2.5 h-2.5 rounded-full bg-[#bd002a]" />}
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="font-bold text-sm">{option.label}</span>
                        {option.price ? (
                          <span className="text-[10px] font-semibold text-[#008388]">
                            +{option.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Extras Section */}
            {product.extras && product.extras.length > 0 && (() => {
              const FEATURED = ['Mel de Abelha', 'Whey Protein'];
              const extrasOrder = [
                'Iogurte', 'Iogurte Natural', 'Iogurte Natural extra',
                'Sorvete', 'Sorvete extra',
                'Granola', 'Aveia', 'Mel de Abelha',
                'Leite Desnatado', 'Leite de Soja'
              ];
              const fitOrder = ['Whey Protein', 'Colágeno', 'Creatina'];

              const featuredGroup = product.extras.filter(e => FEATURED.includes(e.name));

              const extrasGroup = product.extras
                .filter(e => extrasOrder.includes(e.name) && !FEATURED.includes(e.name))
                .sort((a, b) => extrasOrder.indexOf(a.name) - extrasOrder.indexOf(b.name));

              const fitGroup = product.extras
                .filter(e => fitOrder.includes(e.name) && !FEATURED.includes(e.name))
                .sort((a, b) => fitOrder.indexOf(a.name) - fitOrder.indexOf(b.name));

              if (featuredGroup.length === 0 && extrasGroup.length === 0 && fitGroup.length === 0) return null;

              return (
                <section className="space-y-6">
                  <h2 className="font-display font-bold text-[#1c1b1b] text-base">Turbine seu pedido 💪</h2>

                  {featuredGroup.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider">Mais pedidos</h3>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                        {featuredGroup.map((extra) => {
                          const isSelected = selectedExtras.some(e => e.id === extra.id);
                          return (
                            <div
                              key={extra.id}
                              className="relative min-w-[160px] bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm flex flex-col justify-between"
                            >
                              <div className="absolute top-2 right-2">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              </div>
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                                  extra.icon === 'bolt' ? 'bg-yellow-100 text-yellow-600' :
                                  extra.icon === 'local_florist' ? 'bg-pink-100 text-pink-600' :
                                  extra.icon === 'sync_alt' ? 'bg-blue-100 text-blue-600' :
                                  extra.icon === 'health_and_safety' ? 'bg-red-100 text-red-600' :
                                  extra.icon === 'nutrition' ? 'bg-green-100 text-green-600' :
                                  extra.icon === 'grain' ? 'bg-amber-100 text-amber-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  <ExtraIcon iconName={extra.icon} />
                                </div>
                                <h4 className="text-sm font-bold text-[#1c1b1b] text-center">{extra.name}</h4>
                                <p className="text-[10px] text-[#5d3f3e] mt-1 leading-tight text-center">{extra.description}</p>
                              </div>
                              <div className="mt-4 flex flex-col items-center">
                                <p className="text-sm font-bold text-[#1c1b1b] text-center">
                                  {extra.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                {extra.glutenFree === false && (
                                  <span className="text-[9px] text-[#5d3f3e]/60 font-normal mt-0.5 mb-2">
                                    contém glúten
                                  </span>
                                )}
                                <button
                                  onClick={() => toggleExtra(extra)}
                                  className={`w-full py-2 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 border ${
                                    isSelected
                                      ? 'bg-green-50 text-green-600 border-green-200'
                                      : 'mt-2 border-amber-500 text-amber-600 hover:bg-amber-50'
                                  }`}
                                >
                                  {isSelected ? (
                                    <><Check className="w-3 h-3" /> ✓ Adicionado</>
                                  ) : (
                                    '+ Adicionar'
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {featuredGroup.length > 0 && (extrasGroup.length > 0 || fitGroup.length > 0) && (
                    <div className="border-t border-[#f0eded]" />
                  )}

                  {extrasGroup.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#5d3f3e] uppercase tracking-wider">Extras</h3>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                        {extrasGroup.map((extra) => {
                          const isSelected = selectedExtras.some(e => e.id === extra.id);
                          return (
                            <div 
                              key={extra.id} 
                              className="min-w-[160px] bg-white rounded-2xl p-4 border border-[#f0eded] shadow-sm flex flex-col justify-between"
                            >
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                                  extra.icon === 'bolt' ? 'bg-yellow-50 text-yellow-600' :
                                  extra.icon === 'local_florist' ? 'bg-pink-50 text-pink-600' :
                                  extra.icon === 'sync_alt' ? 'bg-blue-50 text-blue-600' :
                                  extra.icon === 'health_and_safety' ? 'bg-red-50 text-red-600' :
                                  extra.icon === 'nutrition' ? 'bg-green-50 text-green-600' :
                                  extra.icon === 'leaf' ? 'bg-green-50 text-[#16a34a]' :
                                  extra.icon === 'citrus' ? 'bg-orange-50 text-[#ea580c]' :
                                  'bg-surface-container text-[#008388]'
                                }`}>
                                  <ExtraIcon iconName={extra.icon} />
                                </div>
                                <h4 className="text-sm font-bold text-[#1c1b1b] text-center">{extra.name}</h4>
                                <p className="text-[10px] text-[#5d3f3e] mt-1 leading-tight text-center">{extra.description}</p>
                              </div>
                              <div className="mt-4 flex flex-col items-center">
                                <p className="text-sm font-bold text-[#1c1b1b] text-center">
                                  {extra.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                {extra.glutenFree === false && (
                                  <span className="text-[9px] text-[#5d3f3e]/60 font-normal mt-0.5 mb-2">
                                    contém glúten
                                  </span>
                                )}
                                <button 
                                  onClick={() => toggleExtra(extra)}
                                  className={`w-full py-2 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 border ${
                                    isSelected 
                                      ? 'bg-green-50 text-green-600 border-green-200' 
                                      : 'mt-2 border-[#bd002a] text-[#bd002a] hover:bg-[#bd002a]/5'
                                  }`}
                                >
                                  {isSelected ? (
                                    <><Check className="w-3 h-3" /> ✓ Adicionado</>
                                  ) : (
                                    '+ Adicionar'
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {extrasGroup.length > 0 && fitGroup.length > 0 && (
                    <div className="border-t border-[#f0eded]" />
                  )}

                  {fitGroup.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-[#5d3f3e] uppercase tracking-wider">Linha Fit</h3>
                      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 no-scrollbar">
                        {fitGroup.map((extra) => {
                          const isSelected = selectedExtras.some(e => e.id === extra.id);
                          return (
                            <div 
                              key={extra.id} 
                              className="min-w-[160px] bg-white rounded-2xl p-4 border border-[#f0eded] shadow-sm flex flex-col justify-between"
                            >
                              <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                                  extra.icon === 'bolt' ? 'bg-yellow-50 text-yellow-600' :
                                  extra.icon === 'local_florist' ? 'bg-pink-50 text-pink-600' :
                                  extra.icon === 'sync_alt' ? 'bg-blue-50 text-blue-600' :
                                  extra.icon === 'health_and_safety' ? 'bg-red-50 text-red-600' :
                                  extra.icon === 'nutrition' ? 'bg-green-50 text-green-600' :
                                  extra.icon === 'leaf' ? 'bg-green-50 text-[#16a34a]' :
                                  extra.icon === 'citrus' ? 'bg-orange-50 text-[#ea580c]' :
                                  'bg-surface-container text-[#008388]'
                                }`}>
                                  <ExtraIcon iconName={extra.icon} />
                                </div>
                                <h4 className="text-sm font-bold text-[#1c1b1b] text-center">{extra.name}</h4>
                                <p className="text-[10px] text-[#5d3f3e] mt-1 leading-tight text-center">{extra.description}</p>
                              </div>
                              <div className="mt-4 flex flex-col items-center">
                                <p className="text-sm font-bold text-[#1c1b1b] text-center">
                                  {extra.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                                {extra.glutenFree === false && (
                                  <span className="text-[9px] text-[#5d3f3e]/60 font-normal mt-0.5 mb-2">
                                    contém glúten
                                  </span>
                                )}
                                <button 
                                  onClick={() => toggleExtra(extra)}
                                  className={`w-full py-2 rounded-full text-[10px] font-bold transition-all flex items-center justify-center gap-1 border ${
                                    isSelected 
                                      ? 'bg-green-50 text-green-600 border-green-200' 
                                      : 'mt-2 border-[#bd002a] text-[#bd002a] hover:bg-[#bd002a]/5'
                                  }`}
                                >
                                  {isSelected ? (
                                    <><Check className="w-3 h-3" /> ✓ Adicionado</>
                                  ) : (
                                    '+ Adicionar'
                                  )}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              );
            })()}

            {/* Notes Section */}
            <section className="space-y-3">
              <label className="text-sm font-bold text-[#1c1b1b] block">
                Alguma observação? Ex: sem açúcar
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Digite aqui..."
                className="w-full p-4 bg-white border border-[#e5e2e1] rounded-2xl text-sm focus:ring-2 focus:ring-[#bd002a]/20 focus:border-[#bd002a] outline-none min-h-[100px] resize-none transition-all"
              />
            </section>
          </div>

          {/* Footer Action Bar */}
          <div className="absolute bottom-0 left-0 w-full bg-white px-6 pt-4 pb-8 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] z-20">
            <button 
              onClick={handleAdd}
              disabled={!!(product.baseOptions && product.baseOptions.length > 0 && !selectedBase)}
              className={`w-full py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                product.baseOptions && product.baseOptions.length > 0 && !selectedBase
                  ? 'bg-[#e5e2e1] text-[#a8a29e] cursor-not-allowed'
                  : 'bg-[#e8173a] text-white hover:opacity-90 active:scale-95'
              }`}
            >
              <span>Adicionar à sacola</span>
              {!isReward && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
                  <span>{totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
