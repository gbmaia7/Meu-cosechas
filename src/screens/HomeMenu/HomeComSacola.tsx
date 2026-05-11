/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Plus, 
  Utensils, 
  CreditCard, 
  Star, 
  ShoppingBag, 
  User, 
  UserPlus, 
  Award,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { 
  PRODUCTS, 
  CATEGORY_COLORS, 
  Product, 
  Extra, 
  LINHA_CARIBE, 
  FUNCIONAL, 
  COMECE_BEM, 
  ESPECIAIS,
  BOA_DE_DIA,
  PROMOCAO_SEU_COSECHAS
} from '../../data/products';
import { useCart } from '../../context/CartContext';
import ProductBottomSheet from '../../components/ProductBottomSheet';
import ImageLightbox from '../../components/ImageLightbox';

export default function HomeComSacola() {
  const navigate = useNavigate();
  const { addToCart, totalItems, totalPrice, userPoints, isAuthenticated, setIsAuthenticated } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Mais pedidos');
  const [manualAvailability, setManualAvailability] = useState<'AUTO' | 'AVAILABLE' | 'UNAVAILABLE'>('AUTO');
  const [manualDay, setManualDay] = useState<number>(new Date().getDay());

  const agora = new Date();
  const diaSemana = agora.getDay(); // 0=Dom, 1=Seg... 6=Sab
  const hora = agora.getHours();
  
  const effectiveDay = manualAvailability === 'AUTO' ? diaSemana : manualDay;
  const isPromoDayEffective = manualAvailability === 'AUTO' ? (diaSemana === 3 || diaSemana === 5) : (manualDay === 3 || manualDay === 5);
  const productOfToday = BOA_DE_DIA[effectiveDay];

  const effectiveBoaAvailability = manualAvailability === 'AUTO'
    ? (!!productOfToday && hora < 16)
    : (manualAvailability === 'AVAILABLE');

  const effectivePromoAvailability = manualAvailability === 'AUTO'
    ? (isPromoDayEffective && hora < 16)
    : (manualAvailability === 'AVAILABLE');

  const handleImageClick = (img: string) => {
    setLightboxImage(img);
    setIsLightboxOpen(true);
  };

  const handlePlusClick = (prod: Product) => {
    if ((prod.sizes && prod.sizes.length > 0) || (prod.extras && prod.extras.length > 0)) {
      setSelectedProduct(prod);
    } else {
      const price = parseFloat(prod.priceDisplay.replace(/[^\d,]/g, '').replace(',', '.'));
      addToCart({
        productId: prod.id,
        name: prod.name,
        price: price,
      });
    }
  };

  const handleAddFromSheet = (options: { sizeLabel?: string; price: number; extras: Extra[]; notes: string; quantity: number }) => {
    if (selectedProduct) {
      let displayName = selectedProduct.name;
      if (options.sizeLabel) displayName += ` (${options.sizeLabel})`;
      
      addToCart({
        productId: selectedProduct.id,
        name: displayName,
        price: options.price,
        size: options.sizeLabel,
        extras: options.extras,
        notes: options.notes,
        quantity: options.quantity
      });
      setSelectedProduct(null);
    }
  };

  return (
    <div className="bg-[#fcf9f8] min-h-dvh pb-40 font-body text-[#1c1b1b]">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50">
        <div className="bg-white py-3 border-b border-[#e5e2e1] flex justify-center items-center shadow-sm">
          <h1 className="text-[#E8173A] font-black italic tracking-tighter text-xl font-display">Meu Cosechas</h1>
        </div>
        <div className="bg-[#bd002a] text-white">
          <div className="flex flex-col items-center justify-center px-6 py-5 w-full text-center">
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="font-bold text-sm">Dimension Park — Barra</span>
            </div>
            <p className="text-[10px] opacity-80 mt-1 font-medium">Programa exclusivo desta unidade, não se aplica a outras.</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-[#008388] px-4 py-1.5 rounded-full shadow-lg">
              <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-white" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">ABERTO • ATÉ AS 19H</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-48 px-4 space-y-6">
        {/* Simulator Toggle (Preview Only) */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="flex justify-center gap-2">
            <button 
              onClick={() => setIsAuthenticated(true)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${isAuthenticated ? 'bg-[#bd002a] text-white shadow-sm' : 'border border-[#e5e2e1] text-[#5d3f3e]/60'}`}
            >
              Logado
            </button>
            <button 
              onClick={() => setIsAuthenticated(false)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${!isAuthenticated ? 'bg-[#bd002a] text-white shadow-sm' : 'border border-[#e5e2e1] text-[#5d3f3e]/60'}`}
            >
              Não logado
            </button>
          </div>

          {(selectedCategory === 'Boa de hoje' || selectedCategory === 'Promoção Seu Cosechas') && (
            <div className="flex flex-col gap-3 items-center w-full">
              {selectedCategory === 'Boa de hoje' && (
                <div className="flex gap-2 overflow-x-auto pb-1 w-full justify-center scrollbar-none px-4">
                  {[
                    { label: 'Dom', value: 0 },
                    { label: 'Seg', value: 1 },
                    { label: 'Ter', value: 2 },
                    { label: 'Qua', value: 3 },
                    { label: 'Qui', value: 4 },
                    { label: 'Sex', value: 5 },
                    { label: 'Sáb', value: 6 }
                  ].map((day) => (
                    <button
                      key={day.value}
                      onClick={() => {
                        setManualDay(day.value);
                        setManualAvailability('AVAILABLE'); // Auto switch to manual mode when selecting day
                      }}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all whitespace-nowrap ${
                        manualDay === day.value 
                          ? 'bg-[#bd002a] text-white shadow-sm' 
                          : 'border border-[#e5e2e1] text-[#5d3f3e]/60'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex justify-center gap-2 bg-[#f0eded]/50 p-1 rounded-full">
                <button 
                  onClick={() => setManualAvailability('AVAILABLE')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${manualAvailability === 'AVAILABLE' ? 'bg-[#008388] text-white shadow-sm' : 'text-[#5d3f3e]/60'}`}
                >
                  Disponível
                </button>
                <button 
                  onClick={() => setManualAvailability('UNAVAILABLE')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${manualAvailability === 'UNAVAILABLE' ? 'bg-[#bd002a] text-white shadow-sm' : 'text-[#5d3f3e]/60'}`}
                >
                  Indisponível
                </button>
                <button 
                  onClick={() => setManualAvailability('AUTO')}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${manualAvailability === 'AUTO' ? 'bg-black text-white shadow-sm' : 'text-[#5d3f3e]/60'}`}
                >
                  Auto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Engagement Cards (Bento Style) */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-[#FDECEA] p-4 rounded-2xl border border-[#F3E0C1]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
            <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <Award className="text-[#bd002a] w-5 h-5" />
            </div>
            <h3 className="font-bold text-[13px] leading-tight mb-1">Clube Cosechas</h3>
            <p className="text-[10px] text-[#5d3f3e] leading-snug mb-3 flex-grow">Ganhe pontos em cada compra e troque por prêmios</p>
            <div className="mt-auto">
              {isAuthenticated && (
                <p className="font-extrabold text-[#bd002a] mb-2 tracking-wide text-[11px]">SEUS PONTOS: {userPoints}</p>
              )}
              <button 
                onClick={() => navigate(isAuthenticated ? '/clube/logado' : '/clube/nao-logado')}
                className={`w-full text-center ${isAuthenticated ? 'bg-[#bd002a]' : 'bg-[#e8173a] shadow-lg shadow-[#e8173a]/20'} text-white text-[9px] font-bold py-2 rounded-full uppercase tracking-tight`}
              >
                {isAuthenticated ? 'VER COMO FUNCIONA' : 'ATIVAR'}
              </button>
            </div>
          </div>
          <div 
            onClick={() => navigate(isAuthenticated ? '/indique-ganhe/logado' : '/indique-ganhe')}
            className="bg-[#E6F7F5] p-4 rounded-2xl border border-[#D1EAE7]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <UserPlus className="text-[#00686c] w-5 h-5" />
            </div>
            <h3 className="font-bold text-[13px] leading-tight mb-1">Indique e Ganhe</h3>
            <p className="text-[10px] text-[#5d3f3e] leading-snug mb-3 flex-grow">Indique um amigo e ganhe os dois R$5 off</p>
            <div className="mt-auto">
              {isAuthenticated && (
                <p className="font-extrabold text-[#00686c] mb-2 tracking-wide text-[11px]">SEUS CRÉDITOS: R$5</p>
              )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(isAuthenticated ? '/indique-ganhe/logado' : '/indique-ganhe');
                }}
                className={`w-full text-center ${isAuthenticated ? 'bg-[#008388]' : 'bg-[#e8173a] shadow-lg shadow-[#e8173a]/20'} text-white text-[9px] font-bold py-2 rounded-full uppercase tracking-tight`}
              >
                {isAuthenticated ? 'VER MEU CÓDIGO' : 'ATIVAR'}
              </button>
            </div>
          </div>
        </section>

        {/* Featured Assinatura Card */}
        <section className="relative overflow-hidden rounded-lg bg-[#bd002a] min-h-[14rem] flex items-center p-8 transition-transform active:scale-98 shadow-xl">
          <div className="z-10 w-2/3">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Exclusivo</span>
            <h2 className="text-white font-extrabold text-2xl leading-tight mb-2 font-display">Assinatura Cosechas</h2>
            <p className="text-white/80 text-sm mb-4">Assine agora e ganhe até 20% off em todas as compras + pontos em dobro</p>
            <button className="bg-white text-[#bd002a] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md">Conhecer planos</button>
          </div>
        </section>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d3f3e] w-5 h-5" />
          <input className="w-full bg-[#f0eded] border-none rounded-md py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#bd002a]/20 focus:bg-[#ffffff] transition-all" placeholder="O que você quer beber hoje?" type="text"/>
        </div>
        
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {[
            'Mais pedidos',
            'Premium',
            'Mix de frutas',
            'Açaís',
            'Milkshakes',
            'Linha Caribe',
            'Funcional',
            'Boa de hoje',
            'Salada de frutas',
            'Comece bem seu dia',
            'Especiais',
            'Promoção Seu Cosechas'
          ].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`${selectedCategory === cat ? 'bg-[#bd002a] text-white' : 'bg-[#e5e2e1] text-[#5d3f3e]'} px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all active:scale-95`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        <section className="space-y-6">
          {/* Boa de Hoje Section */}
          {selectedCategory === 'Boa de hoje' && (
            <>
              <div className="flex flex-col px-2 gap-1 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Boa de hoje</h3>
                  {effectiveBoaAvailability && (
                    <span className="bg-green-100 text-green-700 text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-wider animate-pulse">
                      Disponível até 16h
                    </span>
                  )}
                </div>
                {!effectiveBoaAvailability && (
                  <span className="bg-red-100 text-[#bd002a] text-[10px] font-bold px-2 py-0.5 rounded-full w-fit">
                    Encerrado
                  </span>
                )}
              </div>
              
              {!productOfToday ? (
                <div className="py-12 flex flex-col items-center justify-center text-center px-4 bg-white rounded-2xl border border-[#f0eded]">
                  <div className="bg-[#f0eded] w-16 h-16 rounded-full flex items-center justify-center mb-4 text-[#bd002a]">
                    <Star className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-[#1c1b1b] mb-1">A Boa de Hoje é uma promoção disponível às segundas, terças e quintas até as 16h.</h4>
                  <p className="text-xs text-[#5d3f3e]">Que tal experimentar outro item do nosso menu?</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <ProductCard 
                    prod={productOfToday} 
                    onImageClick={handleImageClick} 
                    onPlusClick={handlePlusClick}
                    badge={effectiveBoaAvailability ? "HOJE" : undefined}
                    isAvailable={effectiveBoaAvailability}
                    availabilityMsg="A Boa de Hoje é uma promoção disponível às segundas, terças e quintas até as 16h."
                  />
                </div>
              )}
            </>
          )}

          {/* Promoção Seu Cosechas Section */}
          {selectedCategory === 'Promoção Seu Cosechas' && (
            <>
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Promoção Seu Cosechas</h3>
              </div>

              <div className="space-y-4">
                {PROMOCAO_SEU_COSECHAS.map(prod => (
                  <ProductCard 
                    key={prod.id} 
                    prod={prod} 
                    onImageClick={handleImageClick} 
                    onPlusClick={handlePlusClick}
                    badge={effectivePromoAvailability ? "PROMOÇÃO" : undefined}
                    isAvailable={effectivePromoAvailability}
                    availabilityMsg="A Promoção Seu Cosechas é uma promoção disponível às quartas e sextas até as 16h."
                  />
                ))}
              </div>
            </>
          )}

          {/* Mais Pedidos Section */}
          {selectedCategory === 'Mais pedidos' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Mais Pedidos</h3>
              </div>
              <div className="space-y-4">
                {PRODUCTS.filter(p => parseInt(p.id) >= 0 && parseInt(p.id) <= 10).map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Mix de Frutas Section */}
          {selectedCategory === 'Mix de frutas' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Mix de Frutas</h3>
              </div>
              <div className="space-y-4">
                {PRODUCTS.filter(p => p.category === 'Mix de Frutas').map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Premium Section */}
          {selectedCategory === 'Premium' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-purple-500 rounded-full" />
                  <h4 className="font-black text-xs uppercase tracking-widest text-purple-600">Iogurte</h4>
                </div>
                <div className="space-y-4">
                  {PRODUCTS.filter(p => p.category === 'Premium' && p.name.toLowerCase().includes('iogurte')).map(prod => (
                    <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-purple-500 rounded-full" />
                  <h4 className="font-black text-xs uppercase tracking-widest text-purple-600">Sorvete</h4>
                </div>
                <div className="space-y-4">
                  {PRODUCTS.filter(p => p.category === 'Premium' && p.name.toLowerCase().includes('sorvete')).map(prod => (
                    <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-1 bg-blue-400 rounded-full" />
                  <h4 className="font-black text-xs uppercase tracking-widest text-blue-500">Água</h4>
                </div>
                <div className="space-y-4">
                  {PRODUCTS.filter(p => p.category === 'Premium' && !p.name.toLowerCase().includes('iogurte') && !p.name.toLowerCase().includes('sorvete')).map(prod => (
                    <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Açaís Section */}
          {selectedCategory === 'Açaís' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Açaís</h3>
              </div>
              <div className="space-y-4">
                {PRODUCTS.filter(p => p.category === 'Açaí').map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Milkshakes Section */}
          {selectedCategory === 'Milkshakes' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Milkshakes</h3>
              </div>
              <div className="space-y-4">
                {PRODUCTS.filter(p => p.category === 'Milkshake').map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Linha Caribe Section */}
          {selectedCategory === 'Linha Caribe' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Linha Caribe</h3>
              </div>
              <div className="space-y-4">
                {LINHA_CARIBE.map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Funcional Section */}
          {selectedCategory === 'Funcional' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Funcional</h3>
              </div>
              <div className="space-y-4">
                {FUNCIONAL.map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Comece Bem Seu Dia Section */}
          {(selectedCategory === 'Comece bem seu dia' || selectedCategory === 'Comece Bem Seu Dia') && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Comece Bem Seu Dia</h3>
              </div>
              <div className="space-y-4">
                {COMECE_BEM.map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Especiais Section */}
          {selectedCategory === 'Especiais' && (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Especiais</h3>
              </div>
              <div className="space-y-4">
                {ESPECIAIS.map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Placeholder for other categories */}
          {selectedCategory !== 'Mais pedidos' && selectedCategory !== 'Mix de frutas' && selectedCategory !== 'Premium' && selectedCategory !== 'Açaís' && selectedCategory !== 'Milkshakes' && selectedCategory !== 'Linha Caribe' && selectedCategory !== 'Funcional' && selectedCategory !== 'Comece bem seu dia' && selectedCategory !== 'Comece Bem Seu Dia' && selectedCategory !== 'Especiais' && selectedCategory !== 'Boa de hoje' && selectedCategory !== 'Promoção Seu Cosechas' && (
            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-[#f0eded] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Utensils className="text-[#a8a29e] w-8 h-8" />
              </div>
              <h4 className="font-bold text-[#1c1b1b] mb-1">Seção em breve</h4>
              <p className="text-xs text-[#5d3f3e]">Novos produtos de {selectedCategory} estão chegando!</p>
            </div>
          )}
        </section>
      </main>

      {/* Sticky Bottom Cart Bar */}
      {totalItems > 0 && (
        <div className="fixed bottom-[96px] left-4 right-4 z-40 mt-4">
          <Link to="/sacola" className="bg-[#E8173A] text-white px-5 py-4 rounded-3xl flex items-center justify-between shadow-[0_12px_40px_rgba(232,23,58,0.4)] transition-all active:scale-95 cursor-pointer block">
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="text-white w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-white text-[#bd002a] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="text-sm font-extrabold tracking-tight font-semibold">Ver sacola</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">
                {totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <ChevronRight className="text-white/50 w-5 h-5" />
            </div>
          </Link>
        </div>
      )}

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: true, path: '/HomeComSacola' },
          { icon: CreditCard, label: 'Assinatura', active: false, path: isAuthenticated ? '/assinatura/ativa' : '/assinatura' },
          { icon: Star, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
          { icon: UserPlus, label: 'Indique', active: false, path: isAuthenticated ? '/indique-ganhe/logado' : '/indique-ganhe' },
          { icon: User, label: 'Perfil', active: false, path: '#' },
        ].map(item => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-4 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
            </div>
            <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>

      <ProductBottomSheet 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddFromSheet}
      />

      <ImageLightbox 
        isOpen={isLightboxOpen} 
        onClose={() => setIsLightboxOpen(false)} 
        imageSrc={lightboxImage} 
      />
    </div>
  );
}

function ProductCard({ 
  prod, 
  onImageClick, 
  onPlusClick, 
  badge, 
  isAvailable = true, 
  availabilityMsg 
}: { 
  prod: Product; 
  onImageClick: (img: string) => void; 
  onPlusClick: (prod: Product) => void; 
  key?: string;
  badge?: string;
  isAvailable?: boolean;
  availabilityMsg?: string;
}) {
  return (
    <div className={`relative bg-white p-4 rounded-lg flex gap-4 transition-transform ${isAvailable ? 'active:scale-[0.98]' : ''} border border-[#e5e2e1]/30 shadow-sm overflow-hidden`}>
      {!isAvailable && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-black/80 text-white text-[10px] font-black px-3 py-1 rounded-full mb-1">ENCERRADO</div>
          {availabilityMsg && <p className="text-[9px] font-bold text-black/60">{availabilityMsg}</p>}
        </div>
      )}

      <button 
        disabled={!isAvailable}
        onClick={() => onImageClick(prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g")}
        className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all"
      >
        <img 
          src={prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} 
          alt={prod.name} 
          className="w-full h-full object-cover" 
        />
        {badge && (
          <div className="absolute top-1 left-1 bg-[#bd002a] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm shadow-md">
            {badge}
          </div>
        )}
      </button>
      <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
        <div>
          <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight">
            {prod.name}
          </h4>
          
          <div className="flex flex-col gap-1 mt-1.5 mb-2">
            <div className={`inline-flex self-start ${CATEGORY_COLORS[prod.category]} px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase shadow-sm`}>
              {prod.category}
            </div>
          </div>

          <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight">{prod.description}</p>
          {prod.glutenWarning && (
            <p className="text-[9px] text-[#5d3f3e]/60 font-normal mt-1">contém glúten</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-extrabold text-[#bd002a] text-sm">{prod.priceDisplay}</span>
          <button 
            disabled={!isAvailable}
            onClick={() => onPlusClick(prod)}
            className={`w-8 h-8 ${isAvailable ? 'bg-[#bd002a]' : 'bg-[#e5e2e1]'} rounded-full flex items-center justify-center text-white shrink-0 shadow-sm active:scale-90 transition-transform`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
