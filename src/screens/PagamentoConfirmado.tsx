import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { MoreVertical, Store, ArrowRight, Bike, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateDeliveryFee, calculateDeliverySubtotal } from '../lib/deliveryFee';

export default function PagamentoConfirmado() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, clearCart, addActiveOrder, trackActiveOrder, userPoints } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(false)

  const modality = location.state?.modality || 'counter';
  const address = location.state?.address;
  const paymentMethod = location.state?.paymentMethod || 'pix';
  const existingOrder = location.state?.existingOrder === true;
  const orderId = location.state?.orderId;
  const pickupCode = location.state?.pickupCode || location.state?.pickup_code || null;
  const deliveryPin = location.state?.deliveryPin || location.state?.delivery_pin || null;
  const isReward = location.state?.isReward || false;
  const couponDiscount = location.state?.couponDiscount ?? 0;
  const referrerId = location.state?.referrerId ?? null;

  const [orderSnapshot] = useState(() => location.state?.orderSnapshot || [...items])
  const [subtotalSnapshot] = useState(() => location.state?.totalPriceSnapshot ?? totalPrice)

  const isAllReward = orderSnapshot.every(
    i => i.name.startsWith('[CLUBE]')
  )
  const deliverySubtotal = calculateDeliverySubtotal(orderSnapshot)
  const deliveryFee = location.state?.deliveryFee ?? calculateDeliveryFee(deliverySubtotal, modality)
  const computedTotal = Math.max(0, subtotalSnapshot + deliveryFee - couponDiscount)

  const validItemsCount = orderSnapshot.reduce((sum, item) => sum + (item.name.startsWith('[CLUBE]') ? 0 : item.quantity), 0);

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
          <h2 className="text-[#00686c] font-display font-extrabold text-3xl mb-2 tracking-tight">Pagamento confirmado!</h2>
          <p className="text-[#5d3f3e] font-medium">Seu pedido já está sendo preparado com ingredientes frescos.</p>
        </div>
        
        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-[0_-12px_40px_rgba(28,27,27,0.05)] p-6 mb-6 w-full mt-4">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#5d3f3e] text-sm font-semibold uppercase tracking-wider">Pedido</span>
            <span className="text-[#e8173a] font-bold text-lg">#82931</span>
          </div>
          
          <div className="space-y-4 mb-6">
            {orderSnapshot.map((item, i) => {
              const isRewardItem = item.name.startsWith('[CLUBE]')
              const label = item.name.startsWith('[CLUBE]') ? 'Clube' : null
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>{item.quantity}× {item.name.replace(/^\[.*?\]\s*/, '')}</span>
                    {label && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">{label}</span>
                    )}
                  </div>
                  {isRewardItem
                    ? <span className="font-semibold text-red-600">Grátis</span>
                    : <span>R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  }
                </div>
              )
            })}
          </div>
          
          <div className="border-t border-dashed border-[#e7bcbb]/30 pt-6 space-y-3">
            {!isAllReward && (
              <div className="flex justify-between text-sm">
                <span className="text-[#5d3f3e]">Subtotal</span>
                <span className="text-[#1c1b1b] font-medium">R$ {subtotalSnapshot.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Desconto indicação</span>
                <span>- R$ 5,00</span>
              </div>
            )}
            {modality === 'delivery' && (
              <div className="flex justify-between text-sm">
                <span className="text-[#5d3f3e]">Taxa de entrega</span>
                <span className="text-[#00686c] font-bold">
                  {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2">
              <span className="text-[#1c1b1b] font-bold text-lg">Total</span>
              {computedTotal === 0
                ? <span className="text-red-600 font-display font-extrabold text-2xl">Grátis</span>
                : <span className="text-[#e8173a] font-display font-extrabold text-2xl">R$ {computedTotal.toFixed(2).replace('.', ',')}</span>
              }
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
                Retire seu pedido no balcão da unidade <span className="font-bold">Dimension Park — Barra</span>.
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
        {validItemsCount > 0 && paymentMethod !== 'cash' && paymentMethod !== 'machine' && (
          <div className="bg-[#FDECEA] rounded-full px-6 py-4 flex items-center justify-center gap-4 mb-10 w-full text-center">
            <div className="w-10 h-10 bg-[#e8173a] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                redeem
              </span>
            </div>
            <div className="text-left">
              <p className="text-[#8b1724] font-bold text-sm leading-none mb-1">
                + {validItemsCount} ponto{validItemsCount > 1 ? 's' : ''} adicionado{validItemsCount > 1 ? 's' : ''} ao seu Clube Cosechas
              </p>
              <p className="text-[#8b1724]/70 text-xs font-medium">
                Você agora tem {userPoints + validItemsCount} pontos.
              </p>
            </div>
          </div>
        )}

        {validItemsCount > 0 && (paymentMethod === 'cash' || paymentMethod === 'machine') && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-3 mb-10 w-full">
            <span className="text-blue-600 mt-0.5 shrink-0">ℹ️</span>
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              <span className="font-bold">Pontos do Clube:</span> Seus pontos serão
              creditados após a confirmação do pagamento pelo entregador.
            </p>
          </div>
        )}
        
        {/* Primary CTA */}
        <button
          disabled={isProcessing}
          onClick={async () => {
            if (isProcessing) return
            setIsProcessing(true)

            if (existingOrder && orderId && orderSnapshot.length > 0) {
              trackActiveOrder({
                id: orderId,
                items: [...orderSnapshot],
                totalPrice: computedTotal,
                status: 'new',
                modality,
                address,
                payment_method: paymentMethod,
                pickup_code: pickupCode,
                delivery_pin: deliveryPin,
              })
              clearCart()
            } else if (orderSnapshot.length > 0) {
              await addActiveOrder({
                items: [...orderSnapshot],
                totalPrice: computedTotal,
                status: 'preparing',
                modality,
                address,
                payment_method: paymentMethod,
              })
            } else {
              clearCart()
            }

            if (referrerId) {
              const { data: { user } } = await supabase.auth.getUser()

              await supabase.from('referrals').insert({
                referrer_id: referrerId,
                referred_id: user?.id,
                status: 'redeemed',
                converted_at: new Date().toISOString(),
              })

              await supabase.from('credits').insert({
                user_id: referrerId,
                amount: 5.00,
                reason: 'referral_bonus',
                expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
              })
            }

            navigate('/acompanhar-pedido')
          }}
          className="w-full bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white font-bold py-5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          Acompanhar pedido
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </main>
    </div>
  );
}
