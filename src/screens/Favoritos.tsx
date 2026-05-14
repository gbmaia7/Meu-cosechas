import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, Heart, Plus, Utensils, CreditCard, Star, ShoppingBag, ArrowRight, ChevronRight, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, Product } from '../data/products';
import ImageLightbox from '../components/ImageLightbox';
import ProductBottomSheet from '../components/ProductBottomSheet';
import { useCart } from '../context/CartContext';
import FloatingOrderTracker from '../components/FloatingOrderTracker';

export default function Favoritos() {
  const navigate = useNavigate();
  
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const { addToCart, activeOrders, totalItems, totalPrice, isAuthenticated, productFrequency } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageClick = (img: string) => {
    setLightboxImg(img);
  };

  const handlePlusClick = (prod: Product) => {
    setSelectedProduct(prod);
  };

  const handleAddToCart = (options: { sizeLabel?: string; price: number; extras: any[]; notes: string; quantity: number; base?: string }) => {
    if (selectedProduct) {
      let displayName = selectedProduct.name;
      if (options.sizeLabel) displayName += ` (${options.sizeLabel})`;
      if (options.base) displayName += ` - ${options.base}`;
      
      addToCart({
        productId: selectedProduct.id,
        name: displayName,
        price: options.price,
        size: options.sizeLabel,
        base: options.base,
        extras: options.extras,
        notes: options.notes,
        quantity: options.quantity
      });
    }
    setSelectedProduct(null);
  };

  // Rank favorite products based on purchase frequency
  const favoriteProducts = [...PRODUCTS]
    .filter(p => (productFrequency[p.id] || 0) > 0)
    .sort((a, b) => (productFrequency[b.id] || 0) - (productFrequency[a.id] || 0));

  const hasFavorites = favoriteProducts.length > 0;

  return (
    <div className="bg-[#fcf9f8] min-h-dvh font-body text-[#1c1b1b]">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#e5e2e1] flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
          >
            <ArrowLeft className="text-[#e8173a] w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-base text-[#1c1b1b] ml-2">Favoritos</h1>
        </div>
      </header>

      <main className={`px-6 pt-6 ${totalItems > 0 && hasFavorites ? 'pb-44' : 'pb-32'}`}>
        {!hasFavorites ? (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <div className="w-20 h-20 bg-[#fff0f0] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Heart className="w-10 h-10 text-[#e8173a]" />
            </div>
            <h2 className="text-xl font-display font-black text-[#1c1b1b] mb-3">
              Nenhum favorito ainda
            </h2>
            <p className="text-sm text-[#5d3f3e] leading-relaxed max-w-[280px]">
              Você ainda não salvou nenhum produto como favorito. Explore nosso cardápio e adicione os que mais gostar!
            </p>

            <button 
              onClick={() => navigate('/HomeComSacola')}
              className="mt-10 w-full max-w-[300px] bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white py-4 rounded-full font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-base"
            >
              Explorar o Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {favoriteProducts.map(prod => (
              <div key={prod.id} className="relative bg-white p-4 rounded-lg flex gap-4 transition-transform active:scale-[0.98] border border-[#e5e2e1]/30 shadow-sm overflow-hidden">
                <button
                  onClick={() => handleImageClick(prod.image || "")}
                  className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all"
                >
                  <img 
                    alt={prod.name} 
                    src={prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} 
                    className="w-full h-full object-cover" 
                  />
                </button>
                <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                   <div>
                      <button className="absolute top-4 right-4 text-[#e8173a] active:scale-90 transition-transform z-10 w-6 h-6 flex items-center justify-center">
                        <Heart className="w-5 h-5 fill-current" />
                      </button>
                      <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight pr-8 line-clamp-2">
                        {prod.name}
                      </h4>
                      <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight mt-1">{prod.description}</p>
                   </div>
                   <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-[#1c1b1b] text-sm">{prod.priceDisplay}</span>
                      <button 
                        onClick={() => handlePlusClick(prod)}
                        className="w-6 h-6 rounded-full bg-[#bd002a] flex items-center justify-center text-white font-bold active:scale-90 transition-transform"
                      >
                         <Plus className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      {/* Tracker */}
      <AnimatePresence>
        {activeOrders.length > 0 && <FloatingOrderTracker activeOrders={activeOrders} />}
      </AnimatePresence>

      <ImageLightbox img={lightboxImg} onClose={() => setLightboxImg(null)} />
      
      <ProductBottomSheet 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)}
        onAdd={handleAddToCart}
      />

      {/* Sticky Bottom Cart Bar */}
      {totalItems > 0 && hasFavorites && (
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
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: CreditCard, label: 'Assinatura', active: false, path: isAuthenticated ? '/assinatura/ativa' : '/assinatura' },
          { icon: Star, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
          { icon: ShoppingBag, label: 'Sacola', active: false, badge: totalItems, path: '/sacola' },
          { icon: User, label: 'Perfil', active: false, path: isAuthenticated ? '/perfil/logado' : '/perfil/nao-logado' },
        ].map((item: any) => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-4 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge ? (item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E8173A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )) : null}
            </div>
            <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
