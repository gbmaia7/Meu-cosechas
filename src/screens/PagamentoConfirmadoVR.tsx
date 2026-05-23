import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';
import { MoreVertical, Store, ArrowRight, Bike, MapPin, Wallet } from 'lucide-react';

export default function PagamentoConfirmadoVR() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart, addActiveOrder, userPoints } = useCart();
  
  const modality = location.state?.modality || 'counter';
  const address = location.state?.address;
  
  const validItemsCount = items.reduce((sum, item) => sum + (item.name.startsWith('[CLUBE]') ? 0 : item.quantity), 0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen">
      {/* TopAppBar */}
      <header className="bg-[#fcf9f8]/70 backdrop-blur-xl fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4">
        <div className="w-10"></div> {/* Spacer for center alignment */}
        <h1 className="font-display font-bold tracking-tight text-xl text-[#1c1b1b]">Pedido Confirmado</h1>
        <div className="w-10 flex justify-end">
          <MoreVertical className="w-6 h-6 text-[#5d3f3e]" />
        </div>
      </header>
      
      <main className="pt-24 pb-32 px-6 max-w-lg mx-auto flex flex-col items-center">
        {/* Success State */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-24 h-24 bg-[#008388]/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[#008388] text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
            </span>
          </div>
          <h2 className="text-[#00686c] font-display font-extrabold text-3xl mb-2 tracking-tight">Pedido Recebido!</h2>
          <p className="text-[#5d3f3e] font-medium">Você pagará {modality === 'counter' ? 'no balcão' : 'na entrega'} com Vale Refeição/Alimentação.</p>
        </div>
        
        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-[0_-12px_40px_rgba(28,27,27,0.05)] p-6 mb-6 w-full mt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#5d3f3e] text-sm font-semibold uppercase tracking-wider">Pedido</span>
            <span className="text-[#e8173a] font-bold text-lg">#82931</span>
          </div>
          
          <div className="space-y-4 mb-6">
            {items.length > 0 ? items.map((item, index) => (
              <div key={index} className="flex justify-between gap-4">
                <div className="flex gap-3 text-left">
                  <span className="text-[#e8173a] font-bold">{item.quantity}x</span>
                  <div>
                    <p className="font-bold text-[#1c1b1b] leading-tight">{item.name}</p>
                    <p className="text-[#5d3f3e] text-xs">
                      {item.size ? `Tamanho: ${item.size}` : 'Tamanho Único'}
                    </p>
                  </div>
                </div>
              </div>
            )) : (
              // Fallback for styling preview
              <>
                <div className="flex justify-between gap-4">
                  <div className="flex gap-3 text-left">
                    <span className="text-[#e8173a] font-bold">1x</span>
                    <div>
                      <p className="font-bold text-[#1c1b1b] leading-tight">Smoothie Morango & Banana</p>
                      <p className="text-[#5d3f3e] text-xs">Tamanho: M</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="flex gap-3 text-left">
                    <span className="text-[#e8173a] font-bold">1x</span>
                    <div>
                      <p className="font-bold text-[#1c1b1b] leading-tight">Suco Detox Verde Especial</p>
                      <p className="text-[#5d3f3e] text-xs">Prensado a frio</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          <div className="border-t border-dashed border-[#e7bcbb]/30 pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#5d3f3e]">Subtotal</span>
              <span className="text-[#1c1b1b] font-medium">R$ {totalPrice > 0 ? totalPrice.toFixed(2).replace('.', ',') : '34,90'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#5d3f3e]">Desconto cupom</span>
              <span className="text-[#00686c] font-bold">- R$ 5,00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#5d3f3e]">Taxa de entrega</span>
              <span className="text-[#00686c] font-bold">{modality === 'counter' ? 'Grátis' : 'R$ 5,00'}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#1c1b1b] font-bold text-lg">Total</span>
              <span className="text-[#e8173a] font-display font-extrabold text-2xl">
                 R$ {totalPrice > 0 ? (totalPrice + (modality === 'counter' ? 0 : 5)).toFixed(2).replace('.', ',') : '29,90'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Modality Section */}
        <div className="bg-[#f6f3f2] rounded-lg p-5 flex items-center justify-center gap-4 mb-6 w-full text-center">
          <div className="bg-white p-3 rounded-md shadow-sm flex-shrink-0">
            {modality === 'counter' ? (
               <Store className="w-6 h-6 text-[#e8173a]" />
            ) : (
               <Bike className="w-6 h-6 text-[#e8173a]" />
            )}
          </div>
          <div className="text-left">
            {modality === 'counter' ? (
              <p className="text-[#1c1b1b] text-sm leading-relaxed">
                Retire e pague no balcão da unidade <span className="font-bold">Dimension Park — Barra</span>.
              </p>
            ) : (
              <div className="text-[#1c1b1b] text-sm leading-relaxed">
                Entrega prevista para o seu endereço:<br />
                <span className="font-bold">{address?.block}, {address?.room}</span>
                <p className="mt-3 text-xs text-[#5d3f3e] text-left font-medium bg-yellow-50 p-2.5 rounded-lg border border-yellow-200 leading-snug">
                  <span className="font-bold text-yellow-800">Atenção:</span> Fique atento ao seu WhatsApp, nosso colaborador entrará em contato por lá para finalizar a entrega.
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Loyalty Points Badge */}
        {validItemsCount > 0 && (
          <div className="bg-[#FDECEA] rounded-full px-6 py-4 flex items-center justify-center gap-4 mb-10 w-full text-center">
            <div className="w-10 h-10 bg-[#e8173a] rounded-full flex items-center justify-center flex-shrink-0">
               <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  redeem
              </span>
            </div>
            <div className="text-left">
              <p className="text-[#8b1724] font-bold text-sm leading-none mb-1">+ {validItemsCount} ponto{validItemsCount > 1 ? 's' : ''} adicionado{validItemsCount > 1 ? 's' : ''} ao seu Clube Cosechas</p>
              <p className="text-[#8b1724]/70 text-xs font-medium">Você agora tem {userPoints + validItemsCount} pontos.</p>
            </div>
          </div>
        )}
        
        {/* Primary CTA */}
        <button 
          onClick={() => {
            if (items.length > 0) {
              addActiveOrder({
                items: [...items],
                totalPrice: totalPrice,
                status: 'preparing',
                modality,
                address
              });
            }
            clearCart();
            navigate('/acompanhar-pedido');
          }}
          className="w-full bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white font-bold py-5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Acompanhar pedido
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </main>
    </div>
  );
}
