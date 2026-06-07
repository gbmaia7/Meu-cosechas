import { useState } from 'react';
import { X, Plus, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  PRODUCTS, LINHA_CARIBE, FUNCIONAL, COMECE_BEM, ESPECIAIS,
  SALADA_DE_FRUTAS, COFFEE, Product,
} from '../data/products';
import { useCart } from '../context/CartContext';
import ProductBottomSheet from './ProductBottomSheet';

const EXCLUDED = ['Açaí', 'Promoção Seu Cosechas'];

const allProducts: Product[] = Array.from(
  new Map(
    [...PRODUCTS, ...LINHA_CARIBE, ...FUNCIONAL, ...COMECE_BEM, ...ESPECIAIS, ...SALADA_DE_FRUTAS, ...COFFEE]
      .map(p => [p.id, p])
  ).values()
).filter(p => !EXCLUDED.includes(p.category));

// Use G size (default in ProductBottomSheet) so card price matches what gets added
const getBasePrice = (product: Product): number => {
  if (product.sizes && product.sizes.length > 0) {
    const gSize = product.sizes.find(s => s.label === 'G');
    return Number((gSize ?? product.sizes[product.sizes.length - 1]).price) || 0;
  }
  const raw = (product.priceDisplay || '').replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(raw) || 0;
};

const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

interface Props {
  referralCreditId: string;
  onClose: () => void;
}

export default function IndiqueProdutos({ referralCreditId, onClose }: Props) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleAdd = (options: { sizeLabel?: string; price: number; extras: any[]; notes: string; quantity: number; base?: string }) => {
    addToCart({
      productId: selectedProduct!.id,
      name: `[INDIQUE] ${selectedProduct!.name}`,
      price: Math.max(0, options.price - 5),
      size: options.sizeLabel,
      extras: options.extras,
      notes: options.notes,
      image: selectedProduct!.image,
      quantity: 1,
      base: options.base,
    });
    setSelectedProduct(null);
    onClose();
    navigate('/sacola', { state: { referralCreditId } });
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-[100] flex items-end justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
          />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#fcf9f8] rounded-t-[2.5rem] overflow-hidden pointer-events-auto shadow-2xl flex flex-col h-[85dvh]"
          >
            <header className="sticky top-0 w-full z-10 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#008388] flex items-center justify-center text-white">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-extrabold text-[#1c1b1b] text-base leading-none">
                    Seu cupom de R$5
                  </span>
                  <span className="font-bold text-[#008388] text-[10px] uppercase tracking-wider">
                    Indique e Ganhe
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-[#f0eded] rounded-full text-[#5d3f3e] active:scale-90 transition-transform">
                <X className="w-4 h-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <div className="p-4 bg-[#008388]/10 rounded-2xl border border-[#008388]/20">
                <p className="text-sm font-medium text-[#006b6f]">
                  Escolha qualquer produto abaixo e <strong>R$5 serão descontados</strong> do preço. Não válido para Açaís e Promoção Seu Cosechas.
                </p>
              </div>

              {allProducts.map((product) => {
                const base = getBasePrice(product);
                const discounted = Math.max(0, base - 5);
                const hasMultipleSizes = (product.sizes?.length ?? 0) > 1;
                return (
                  <div key={product.id} className="bg-white p-4 rounded-lg flex gap-4 border border-[#e5e2e1]/30 shadow-sm">
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0">
                      <img src={product.image || ''} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                      <div>
                        <span className="bg-[#008388] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm inline-block mb-1">
                          INDIQUE E GANHE
                        </span>
                        <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight">{product.name}</h4>
                        <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight mt-0.5">{product.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-[#a8a29e] line-through leading-none">
                            {fmt(base)}
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="font-extrabold text-[#008388] text-sm leading-none">
                              {fmt(discounted)}
                            </span>
                            <span className="text-[9px] font-black bg-[#008388] text-white px-1 py-0.5 rounded-sm leading-none">
                              −R$5
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="w-8 h-8 bg-[#008388] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm active:scale-90 transition-transform"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {selectedProduct && (
        <ProductBottomSheet
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAdd={handleAdd}
        />
      )}
    </>
  );
}
