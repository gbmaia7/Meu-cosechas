import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Banknote, CheckCircle2, ChevronLeft, Loader2, Wallet, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { calculateDeliveryFee, calculateDeliverySubtotal } from '../lib/deliveryFee';

type PaymentMethod = 'pix' | 'cash';

export default function Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, session, clearCart, addActiveOrder } = useCart();

  const preSelected = location.state?.preSelectedMethod;
  const initialMethod: PaymentMethod = preSelected === 'cash' ? 'cash' : 'pix';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initialMethod);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const modality = location.state?.modality || 'delivery';
  const address = location.state?.address;
  const couponDiscount = location.state?.couponDiscount ?? 0;
  const referrerId = location.state?.referrerId ?? null;
  const referralCreditId = location.state?.referralCreditId ?? null;
  const cartState = { modality, address, couponDiscount, referrerId, referralCreditId };
  const deliverySubtotal = calculateDeliverySubtotal(items);
  const deliveryFee = calculateDeliveryFee(deliverySubtotal, modality);
  const finalTotal = Math.max(0, totalPrice + deliveryFee - couponDiscount);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const createMercadoPagoPayment = async (paymentMethod: PaymentMethod) => {
    if (!session) throw new Error('Entre na sua conta para pagar online.');
    if (items.length === 0) throw new Error('Sua sacola esta vazia.');

    const orderState = {
      items,
      orderSnapshot: items,
      totalPrice,
      totalPriceSnapshot: totalPrice,
      modality,
      address,
      couponDiscount,
      deliveryFee,
      referrerId,
      referralCreditId,
      paymentMethod,
    };

    const { data, error } = await supabase.functions.invoke('create-mercado-pago-payment', {
      body: {
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          base: item.base,
          notes: item.notes,
          pointsCost: item.pointsCost,
          deliveryEligibilityPrice: item.deliveryEligibilityPrice,
          extras: item.extras,
        })),
        modality,
        address,
        deliveryFee,
        couponDiscount,
        referrerId,
        referralCreditId,
        paymentMethod,
        payer: {
          email: session.user.email,
        },
      },
    });

    if (error) throw error;
    if (data?.success === false) throw new Error(`MP ${data.mp_status}: ${JSON.stringify(data.mp_error)}, email: ${data.payer_email_used}`);

    sessionStorage.setItem('mercadoPagoPendingOrder', JSON.stringify({
      ...orderState,
      order_id: data?.order_id,
      pickup_code: data?.pickup_code,
      delivery_pin: data?.delivery_pin,
    }));

    clearCart();

    const nextState = {
      ...orderState,
      orderId: data?.order_id,
      pickupCode: data?.pickup_code,
      deliveryPin: data?.delivery_pin,
      payment: data,
      total: finalTotal.toFixed(2).replace('.', ','),
    };

    navigate('/pagamento/pix', { state: nextState });
  };

  const handleFinalize = async () => {
    if (isCreatingPayment) return;
    setPaymentError('');
    setIsCreatingPayment(true);

    try {
      if (selectedMethod === 'cash') {
        const order = await addActiveOrder({
          items,
          totalPrice: finalTotal,
          status: 'new',
          modality,
          address,
          payment_method: selectedMethod,
        });
        navigate('/pagamento-presencial', {
          state: {
            modality,
            address,
            paymentMethod: selectedMethod,
            couponDiscount,
            deliveryFee,
            referrerId,
            existingOrder: !!order,
            orderId: order?.id,
            pickupCode: order?.pickup_code,
            deliveryPin: order?.delivery_pin,
            orderSnapshot: items,
            totalPriceSnapshot: totalPrice,
          },
        });
        return;
      }

      await createMercadoPagoPayment(selectedMethod);
    } catch (error) {
      console.error('[Pagamento] Erro ao criar pagamento Mercado Pago:', error);
      setPaymentError(error instanceof Error ? error.message : 'Nao foi possivel iniciar o pagamento. Tente novamente.');
      setIsCreatingPayment(false);
    }
  };

  const selectMethod = (method: PaymentMethod) => {
    if (isCreatingPayment) return;
    setSelectedMethod(method);
    setPaymentError('');
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen relative z-0">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <button onClick={() => navigate('/sacola', { state: cartState })} className="text-[#E8173A] p-2 rounded-full active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg text-[#1c1b1b]">Forma de Pagamento</h1>
        <button onClick={() => navigate('/HomeComSacola')} className="text-[#E8173A] p-2 rounded-full active:scale-95 transition-transform">
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 pb-40 px-6 max-w-md mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-3xl font-extrabold tracking-tight mb-2">Finalize seu pedido</h2>
          <p className="text-[#5d3f3e] font-medium">
            {modality === 'counter'
              ? 'Pague com Pix no app ou finalize o pagamento no balcao.'
              : 'Pague com Pix no app ou finalize o pagamento na entrega.'}
          </p>
        </div>

        <section className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e2e1] mb-8">
          <h2 className="font-display font-extrabold text-lg mb-4 text-[#5d3f3e]">Resumo</h2>
          <div className="space-y-2 text-sm text-[#5d3f3e]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>{modality === 'counter' ? 'Retirada no balcao' : 'Taxa de entrega'}</span>
              <span className={`font-medium ${modality === 'counter' ? 'text-emerald-600' : ''}`}>
                {modality === 'counter' ? 'Gratis' : formatCurrency(deliveryFee)}
              </span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Desconto</span>
                <span>- {formatCurrency(couponDiscount)}</span>
              </div>
            )}
            <div className="h-px bg-[#e5e2e1] my-2" />
            <div className="flex justify-between text-base font-bold text-[#1c1b1b]">
              <span>Total a pagar</span>
              <span>{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="font-display text-xl font-bold">Pagamento</h3>

          <button
            type="button"
            onClick={() => selectMethod('pix')}
            className={`w-full rounded-lg p-5 flex items-center justify-between transition-all text-left ${selectedMethod === 'pix' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#008388]/10 rounded-full flex items-center justify-center text-[#008388]">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold">Pix</p>
                <p className="text-xs font-medium text-[#5d3f3e]">QR Code gerado com segurança — expira automaticamente</p>
              </div>
            </div>
            {selectedMethod === 'pix' && <CheckCircle2 className="text-[#bd002a] w-6 h-6" />}
          </button>

          <button
            type="button"
            onClick={() => selectMethod('cash')}
            className={`w-full rounded-lg p-5 flex items-center justify-between transition-all text-left ${selectedMethod === 'cash' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold">{modality === 'counter' ? 'Pagar no caixa' : 'Pagar na entrega'}</p>
                <p className="text-xs font-medium text-[#5d3f3e]">Dinheiro, cartao ou VR</p>
              </div>
            </div>
            {selectedMethod === 'cash' && <CheckCircle2 className="text-[#bd002a] w-6 h-6" />}
          </button>
        </section>

        {paymentError && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-xs text-red-800 font-medium leading-relaxed">{paymentError}</p>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.05)] px-6 py-4 pb-8 flex justify-between items-center gap-4">
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-xs font-semibold text-zinc-400 font-display">Total</span>
          <span className="text-xl font-extrabold text-[#E8173A] font-display tracking-tight">{formatCurrency(finalTotal)}</span>
        </div>
        <button
          onClick={handleFinalize}
          disabled={isCreatingPayment}
          className="flex-1 max-w-[200px] flex items-center justify-center rounded-full px-4 py-3.5 font-display font-semibold text-sm transition-all bg-[#E8173A] text-white shadow-lg shadow-[#bd002a]/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isCreatingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continuar'}
        </button>
      </nav>
    </div>
  );
}
