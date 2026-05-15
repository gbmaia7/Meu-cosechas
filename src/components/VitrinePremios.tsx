import { X, ChevronRight, CupSoda, Star, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, PRODUCTS } from '../data/products';
import { useState } from 'react';
import ProductBottomSheet from './ProductBottomSheet';
import { useCart } from '../context/CartContext';
import ImageLightbox from './ImageLightbox';

interface VitrinePremiosProps {
  tier: 7 | 10 | 12 | null;
  onClose: () => void;
}

export default function VitrinePremios({ tier, onClose }: VitrinePremiosProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addToCart, setUserPoints, userPoints } = useCart();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  if (!tier) return null;

  // Filter products based on tier
  const allowedCategories = tier === 7 
    ? ['Funcional', 'Boa de Hoje', 'Promoção Seu Cosechas']
    : tier === 10
      ? ['Mix de Frutas', 'Milkshake', 'Linha Caribe']
      : ['Premium'];
  
  // Also include specific Açaí products
  const allowedProducts = PRODUCTS.filter(p => {
    if (allowedCategories.includes(p.category)) return true;
    if (tier === 10 && p.id === '3') return true; // Açaí Médio
    if (tier === 12 && p.id === '2') return true; // Trio Açaí
    // Note: Açaí Bowl (id 4) logic with size depends on selection, we can just allow the product
    // and handle size cost inside the Add sheet if necessary, but to keep it simple we just allow it.
    if (tier === 10 && p.id === '4') return true; // Açaí Bowl M
    if (tier === 12 && p.id === '4') return true; // Açaí Bowl G
    return false;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddReward = (options: { sizeLabel?: string; price: number; extras: any[]; notes: string; quantity: number; base?: string }) => {
    // Determine target size for Açaí Bowl
    let isSizeAllowed = true;
    if (selectedProduct?.id === '4') {
      if (tier === 10 && options.sizeLabel !== 'M') isSizeAllowed = false;
      if (tier === 12 && options.sizeLabel !== 'G') isSizeAllowed = false;
    }

    if (!isSizeAllowed) {
      alert(`Para esse prêmio de ${tier} pontos, você deve selecionar o tamanho ${tier === 10 ? 'M' : 'G'}.`);
      return;
    }

    addToCart({
      productId: selectedProduct!.id,
      name: `[CLUBE] ${selectedProduct!.name}`,
      price: options.price, // Uses the computed price from ProductBottomSheet
      size: options.sizeLabel,
      extras: options.extras,
      notes: options.notes,
      image: selectedProduct!.image,
      quantity: 1, // Only 1 reward per transaction,
      base: options.base,
      pointsCost: tier
    });

    // Deduct points
    setUserPoints(Math.max(0, userPoints - tier));
    
    setSelectedProduct(null);
    onClose();
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#fcf9f8] rounded-t-[2.5rem] overflow-hidden pointer-events-auto shadow-2xl flex flex-col h-[85dvh]"
          >
            {/* Header */}
            <header className="sticky top-0 w-full z-10 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#E8173A] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-[#1c1b1b] text-base leading-none">
                    Prêmios do Clube Cosechas
                  </span>
                  <span className="font-bold text-[#e8173a] text-[10px] uppercase tracking-wider">
                    Tier {tier} Pontos
                  </span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-[#f0eded] rounded-full text-[#5d3f3e] active:scale-90 transition-transform"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-safe">
              <div className="p-4 bg-[#bd002a]/10 rounded-2xl mb-4 border border-[#bd002a]/20">
                <p className="text-sm font-medium text-[#bd002a]">
                  <strong>Parabéns!</strong> Escolha qualquer produto abaixo e ele sairá de graça na sua sacola.
                </p>
              </div>
              
              {allowedProducts.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white p-4 rounded-lg flex gap-4 transition-transform border border-[#e5e2e1]/30 shadow-sm overflow-hidden"
                >
                  <button 
                    onClick={() => {
                      setLightboxImage(product.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g");
                      setIsLightboxOpen(true);
                    }}
                    className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all"
                  >
                    <img src={product.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} alt={product.name} className="w-full h-full object-cover" />
                  </button>
                  <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                    <div>
                      <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight pr-6">{product.name}</h4>
                      <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight mt-1">{product.description}</p>
                      {product.glutenWarning && (
                        <p className="text-[9px] text-[#5d3f3e]/60 font-normal mt-1">contém glúten</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="font-extrabold text-[#bd002a] text-[10px] uppercase">Resgatar Grátis</span>
                      <button 
                        onClick={() => handleProductClick(product)}
                        className="w-8 h-8 bg-[#bd002a] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm active:scale-90 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {selectedProduct && (
        <ProductBottomSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleAddReward}
          isReward={true}
          rewardType="clube"
        />
      )}

      <ImageLightbox 
        isOpen={isLightboxOpen} 
        imageSrc={lightboxImage} 
        onClose={() => setIsLightboxOpen(false)} 
      />
    </>
  );
}
