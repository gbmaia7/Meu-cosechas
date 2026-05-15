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
  CupSoda,
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
  PROMOCAO_SEU_COSECHAS,
  SALADA_DE_FRUTAS,
  COFFEE
} from '../data/products';
import { useCart } from '../context/CartContext';
import ProductBottomSheet from '../components/ProductBottomSheet';
import ImageLightbox from '../components/ImageLightbox';

export default function MenuAssinatura() {
  const navigate = useNavigate();
  const { addToCart, totalItems, totalPrice, subsQuota, setSubsQuota, userPoints, isAuthenticated, setIsAuthenticated } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Mais pedidos');

  const agora = new Date();
  const diaSemana = agora.getDay(); // 0=Dom, 1=Seg... 6=Sab
  const hora = agora.getHours();
  
  const isPromoDayEffective = (diaSemana === 3 || diaSemana === 5);
  const productOfToday = BOA_DE_DIA[diaSemana];

  const effectiveBoaAvailability = (!!productOfToday && hora < 16);
  const effectivePromoAvailability = (isPromoDayEffective && hora < 16);

  const handleImageClick = (img: string) => {
    setLightboxImage(img);
    setIsLightboxOpen(true);
  };

  const handlePlusClick = (prod: Product) => {
    setSelectedProduct(prod);
  };

  const handleAddFromSheet = (options: { sizeLabel?: string; price: number; extras: Extra[]; notes: string; quantity: number; base?: string }) => {
    if (selectedProduct) {
      if (subsQuota <= 0) {
        alert("Você não possui mais cota na sua assinatura este mês.");
        return;
      }
      
      let displayName = `[ASSINATURA] ${selectedProduct.name}`;
      if (options.sizeLabel) displayName += ` (${options.sizeLabel})`;
      if (options.base) displayName += ` - ${options.base}`;
      
      addToCart({
        productId: selectedProduct.id,
        name: displayName,
        price: options.price, // comes from the sheet which correctly calculates 0 base + extras
        size: options.sizeLabel,
        base: options.base,
        extras: options.extras,
        notes: options.notes,
        quantity: 1, // Fix: Assinatura generally adds 1 at a time, or if we want options.quantity, we need to check quota
        pointsCost: 0,
        image: selectedProduct.image
      });
      
      setSubsQuota(Math.max(0, subsQuota - 1));
      setSelectedProduct(null);
    }
  };

  return (
    <div className="bg-[#fcf9f8] min-h-dvh pb-40 font-body text-[#1c1b1b]">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50">
        <div className="bg-white py-3 border-b border-[#e5e2e1] flex items-center shadow-sm px-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[#e8173a]">arrow_back_ios</span>
          </button>
          <div className="flex-1 flex justify-center">
            <h1 className="text-[#E8173A] font-black italic tracking-tighter text-xl font-display mr-10 relative">
              Menu Assinatura
            </h1>
          </div>
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
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">ABERTO • 8H ATÉ AS 20H</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-48 px-4 space-y-6">
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
            'Coffee',
            'Linha Caribe',
            'Funcional',
            'Boa de hoje',
            'Salada de Frutas',
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

          {/* Salada de Frutas Section */}
          {selectedCategory === 'Salada de Frutas' && (
            <>
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Salada de Frutas</h3>
              </div>
              <div className="space-y-4">
                {SALADA_DE_FRUTAS.map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Coffee Section */}
          {selectedCategory === 'Coffee' && (
            <>
              <div className="flex items-center justify-between px-2 mb-4">
                <h3 className="text-xl font-extrabold font-display text-[#1c1b1b]">Tropical & Spicy Coffee</h3>
              </div>
              <div className="space-y-4">
                {COFFEE.map(prod => (
                  <ProductCard key={prod.id} prod={prod} onImageClick={handleImageClick} onPlusClick={handlePlusClick} />
                ))}
              </div>
            </>
          )}

          {/* Placeholder for other categories */}
          {selectedCategory !== 'Mais pedidos' && selectedCategory !== 'Mix de frutas' && selectedCategory !== 'Premium' && selectedCategory !== 'Açaís' && selectedCategory !== 'Milkshakes' && selectedCategory !== 'Coffee' && selectedCategory !== 'Linha Caribe' && selectedCategory !== 'Funcional' && selectedCategory !== 'Comece bem seu dia' && selectedCategory !== 'Comece Bem Seu Dia' && selectedCategory !== 'Especiais' && selectedCategory !== 'Boa de hoje' && selectedCategory !== 'Promoção Seu Cosechas' && selectedCategory !== 'Salada de Frutas' && (
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
        <div className="fixed bottom-6 left-4 right-4 z-40 mt-4 pb-safe">
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

      <ProductBottomSheet 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddFromSheet}
        isReward={true}
        rewardType="assinatura"
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
          {availabilityMsg && <p className="text-[9px] font-bold text-black/60 text-center px-4 break-words leading-snug">{availabilityMsg}</p>}
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
          <div className="flex items-center gap-1.5">
            <div className="inline-flex items-center gap-1 bg-[#e8173a]/10 text-[#e8173a] border border-[#e8173a]/20 px-1.5 py-0.5 rounded-md">
               <CupSoda className="w-3 h-3" />
               <span className="text-[9px] font-bold uppercase tracking-wider">Assinatura</span>
            </div>
            <span className="font-extrabold text-[#13612f] text-xs">GRÁTIS</span>
          </div>
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
