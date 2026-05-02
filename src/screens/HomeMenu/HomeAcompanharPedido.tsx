/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  Plus, 
  Bike, 
  Utensils, 
  CreditCard, 
  Star, 
  ShoppingBag, 
  User, 
  UserPlus, 
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { PRODUCTS, CATEGORY_COLORS, Product, Extra } from '../../data/products';
import { useCart } from '../../context/CartContext';
import ProductBottomSheet from '../../components/ProductBottomSheet';
import ImageLightbox from '../../components/ImageLightbox';

export default function HomeAcompanharPedido() {
  const { addToCart, totalItems } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

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
    <div className="bg-[#fcf9f8] min-h-dvh pb-72 font-body text-[#1c1b1b]">
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
        {/* Engagement Cards (Bento Style) */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-[#FDECEA] p-4 rounded-2xl border border-[#F3E0C1]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
            <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <Award className="text-[#bd002a] w-5 h-5" />
            </div>
            <h3 className="font-bold text-[13px] leading-tight mb-1">Clube Cosechas</h3>
            <p className="text-[10px] text-[#5d3f3e] leading-snug mb-3 flex-grow">Ganhe pontos em cada compra e troque por prêmios</p>
            <div className="mt-auto">
              <p className="font-extrabold text-[#bd002a] mb-2 tracking-wide text-[11px]">SEUS PONTOS: 5</p>
              <button className="w-full text-center bg-[#bd002a] text-white text-[9px] font-bold py-2 rounded-lg uppercase tracking-tight">VER COMO FUNCIONA</button>
            </div>
          </div>
          <div className="bg-[#E6F7F5] p-4 rounded-2xl border border-[#D1EAE7]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
            <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <UserPlus className="text-[#00686c] w-5 h-5" />
            </div>
            <h3 className="font-bold text-[13px] leading-tight mb-1">Indique e Ganhe</h3>
            <p className="text-[10px] text-[#5d3f3e] leading-snug mb-3 flex-grow">Indique um amigo e ganhe os dois R$5 off</p>
            <div className="mt-auto">
              <p className="font-extrabold text-[#00686c] mb-2 tracking-wide text-[11px]">SEUS CRÉDITOS: R$5</p>
              <button className="w-full text-center bg-[#008388] text-white text-[9px] font-bold py-2 rounded-lg uppercase tracking-tight">VER MEU CÓDIGO</button>
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
            'Bowl',
            'Milkshakes',
            'Linha caribe',
            'Funcional',
            'Boa de hoje',
            'Salada de frutas',
            'Comece bem seu dia',
            'Especiais',
            'Promoção Seu Cosechas'
          ].map((cat, i) => (
            <button key={cat} className={`${i === 0 ? 'bg-[#bd002a] text-white' : 'bg-[#e5e2e1] text-[#5d3f3e]'} px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap`}>{cat}</button>
          ))}
        </div>

        {/* Products */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold font-display">Mais Pedidos</h3>
            <span className="text-[#bd002a] font-bold text-sm">Ver tudo</span>
          </div>
          <div className="space-y-4">
            {PRODUCTS.map(prod => (
              <div key={prod.id} className="bg-white p-4 rounded-lg flex gap-4 transition-transform active:scale-[0.98]">
                <button 
                  onClick={() => handleImageClick(prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g")}
                  className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all"
                >
                  <img 
                    src={prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} 
                    alt={prod.name} 
                    className="w-full h-full object-cover" 
                  />
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
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-extrabold text-[#bd002a] text-sm">{prod.priceDisplay}</span>
                    <button 
                      onClick={() => handlePlusClick(prod)}
                      className="w-8 h-8 bg-[#bd002a] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm active:scale-90 transition-transform"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Order Tracker */}
      <div className="fixed bottom-[96px] left-4 right-4 z-40">
        <div className="bg-[#E8173A] text-white px-5 py-4 rounded-3xl flex items-center justify-between shadow-[0_12px_40px_rgba(232,23,58,0.3)] transition-all active:scale-95 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
              <Bike className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">Acompanhar pedido</span>
              <span className="text-xs text-white/90">Em preparação...</span>
            </div>
          </div>
          <button className="bg-white/10 border border-white/30 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Detalhes</button>
        </div>
      </div>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: true, path: '/HomeComSacola' },
          { icon: CreditCard, label: 'Assinatura', active: false, path: '#' },
          { icon: Star, label: 'Clube', active: false, path: '#' },
          { icon: ShoppingBag, label: 'Sacola', active: false, badge: totalItems, path: '/sacola' },
          { icon: User, label: 'Perfil', active: false, path: '#' },
        ].map(item => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-4 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#bd002a] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
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
