import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Banknote, CheckCircle2, ChevronLeft, CreditCard, Loader2, Wallet, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';

type PaymentMethod = 'pix' | 'credit_card' | 'debit_card' | 'cash' | 'machine';

type SavedCard = {
  id: string;
  mp_card_id: string;
  brand: string;
  last_four: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
};

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => any;
  }
}

export default function Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, totalPrice, session, clearCart } = useCart();

  const preSelected = location.state?.preSelectedMethod;
  const initialMethod: PaymentMethod =
    preSelected === 'credit_card' || preSelected === 'debit_card' || preSelected === 'cash' || preSelected === 'machine'
      ? preSelected
      : 'pix';

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initialMethod);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<SavedCard | null>(
    location.state?.savedCard || null,
  );
  const [savedCardCvv, setSavedCardCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');

  const modality = location.state?.modality || 'delivery';
  const address = location.state?.address;
  const couponDiscount = location.state?.couponDiscount ?? 0;
  const referrerId = location.state?.referrerId ?? null;
  const deliveryFee = modality === 'counter' ? 0 : 5.00;
  const finalTotal = Math.max(0, totalPrice + deliveryFee - couponDiscount);
  const isCardPayment = selectedMethod === 'credit_card' || selectedMethod === 'debit_card';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!isCardPayment || !session) return;
    supabase
      .from('saved_cards')
      .select('id, mp_card_id, brand, last_four, holder_name, exp_month, exp_year')
      .eq('user_id', session.user.id)
      .not('mp_card_id', 'is', null)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setSavedCards(data as SavedCard[]); });
  }, [isCardPayment, session]);

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const loadMercadoPago = async () => {
    if (window.MercadoPago) return window.MercadoPago;

    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[src="https://sdk.mercadopago.com/js/v2"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Nao foi possivel carregar MercadoPago.js.')), { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Nao foi possivel carregar MercadoPago.js.'));
      document.body.appendChild(script);
    });

    if (!window.MercadoPago) throw new Error('MercadoPago.js nao esta disponivel.');
    return window.MercadoPago;
  };

  const getCardToken = async () => {
    const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    if (!publicKey) throw new Error('Public Key do Mercado Pago nao configurada.');

    const MercadoPago = await loadMercadoPago();
    const mp = new MercadoPago(publicKey);

    if (selectedSavedCard) {
      if (!savedCardCvv || savedCardCvv.length < 3) throw new Error('Digite o CVV do cartao salvo.');
      const token = await mp.createCardToken({
        cardId: selectedSavedCard.mp_card_id,
        securityCode: savedCardCvv,
      });
      if (!token?.id) throw new Error('Nao foi possivel tokenizar o cartao salvo.');
      return { token: token.id, payment_method_id: selectedSavedCard.brand };
    }

    const cleanCardNumber = cardNumber.replace(/\D/g, '');
    const cleanDocument = identificationNumber.replace(/\D/g, '');
    const [month, shortYear] = expiry.split('/');
    const year = shortYear?.length === 2 ? `20${shortYear}` : shortYear;

    if (!cleanCardNumber || !cardHolder.trim() || !month || !year || !securityCode || !cleanDocument) {
      throw new Error('Preencha todos os dados do cartao.');
    }

    const bin = cleanCardNumber.slice(0, 6);
    const methods = await mp.getPaymentMethods({ bin });
    const paymentMethodId = methods?.results?.[0]?.id || methods?.[0]?.id;

    if (!paymentMethodId) throw new Error('Nao foi possivel identificar a bandeira do cartao.');

    const token = await mp.createCardToken({
      cardNumber: cleanCardNumber,
      cardholderName: cardHolder,
      cardExpirationMonth: month,
      cardExpirationYear: year,
      securityCode,
      identificationType: 'CPF',
      identificationNumber: cleanDocument,
    });

    if (!token?.id) throw new Error('Nao foi possivel tokenizar o cartao.');
    return { token: token.id, payment_method_id: paymentMethodId };
  };

  const createMercadoPagoPayment = async (paymentMethod: PaymentMethod) => {
    if (!session) throw new Error('Entre na sua conta para pagar online.');
    if (items.length === 0) throw new Error('Sua sacola esta vazia.');

    const orderState = {
      items,
      totalPrice,
      modality,
      address,
      couponDiscount,
      referrerId,
      paymentMethod,
    };

    const cardPayload = isCardPayment ? await getCardToken() : {};

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
          extras: item.extras,
        })),
        modality,
        address,
        deliveryFee,
        couponDiscount,
        paymentMethod,
        payer: {
          email: session.user.email,
          identification: identificationNumber
            ? { type: 'CPF', number: identificationNumber.replace(/\D/g, '') }
            : undefined,
        },
        installments: 1,
        ...cardPayload,
      },
    });

    if (error) throw error;

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

    navigate(paymentMethod === 'pix' ? '/pagamento/pix' : '/validando-pagamento', {
      state: nextState,
    });
  };

  const handleFinalize = async () => {
    if (isCreatingPayment) return;
    setPaymentError('');
    setIsCreatingPayment(true);

    try {
      if (selectedMethod === 'cash') {
        navigate('/pagamento-confirmado', { state: { modality, address, paymentMethod: 'cash', couponDiscount, referrerId } });
        return;
      }

      if (selectedMethod === 'machine') {
        navigate('/pagamento-confirmado', { state: { modality, address, paymentMethod: 'machine', couponDiscount, referrerId } });
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
        <button onClick={() => navigate(-1)} className="text-[#E8173A] p-2 rounded-full active:scale-95 transition-transform">
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
          <p className="text-[#5d3f3e] font-medium">Pague dentro do app com Mercado Pago.</p>
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
            onClick={() => selectMethod('credit_card')}
            className={`w-full rounded-lg p-5 flex items-center justify-between transition-all text-left ${selectedMethod === 'credit_card' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#fd6c70]/10 rounded-full flex items-center justify-center text-[#ac3139]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold">Cartao de credito</p>
                <p className="text-xs font-medium text-[#5d3f3e]">Seus dados ficam 100% com o Mercado Pago</p>
              </div>
            </div>
            {selectedMethod === 'credit_card' && <CheckCircle2 className="text-[#bd002a] w-6 h-6" />}
          </button>

          <button
            type="button"
            onClick={() => selectMethod('debit_card')}
            className={`w-full rounded-lg p-5 flex items-center justify-between transition-all text-left ${selectedMethod === 'debit_card' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5d3f3e]/10 rounded-full flex items-center justify-center text-[#5d3f3e]">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold">Cartao de debito</p>
                <p className="text-xs font-medium text-[#5d3f3e]">Pague direto pelo app com segurança</p>
              </div>
            </div>
            {selectedMethod === 'debit_card' && <CheckCircle2 className="text-[#bd002a] w-6 h-6" />}
          </button>

          {isCardPayment && savedCards.length > 0 && (
            <div className="bg-white border border-[#e5e2e1] rounded-lg p-5 space-y-3">
              <p className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider">Cartões salvos</p>
              {savedCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => { setSelectedSavedCard(card); setSavedCardCvv(''); }}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all ${selectedSavedCard?.id === card.id ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-[#f6f3f2] hover:bg-[#ede9e8]'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-[#5d3f3e]" />
                    <div>
                      <p className="text-sm font-bold text-[#1c1b1b]">{card.brand.toUpperCase()} •••• {card.last_four}</p>
                      <p className="text-xs text-[#5d3f3e]">{card.holder_name} · {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).slice(-2)}</p>
                    </div>
                  </div>
                  {selectedSavedCard?.id === card.id && <CheckCircle2 className="text-[#bd002a] w-5 h-5" />}
                </button>
              ))}
              {selectedSavedCard && (
                <input
                  value={savedCardCvv}
                  onChange={(e) => setSavedCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="CVV"
                  className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#bd002a]"
                />
              )}
              <button
                type="button"
                onClick={() => setSelectedSavedCard(null)}
                className={`w-full text-xs font-bold text-[#5d3f3e] py-2 rounded-xl transition-all ${!selectedSavedCard ? 'bg-[#bd002a]/10 text-[#bd002a]' : 'hover:bg-[#f6f3f2]'}`}
              >
                + Usar novo cartão
              </button>
            </div>
          )}

          {isCardPayment && !selectedSavedCard && (
            <div className="bg-white border border-[#e5e2e1] rounded-lg p-5 space-y-4">
              <input value={cardNumber} onChange={(event) => setCardNumber(event.target.value.replace(/[^\d ]/g, '').slice(0, 19))} placeholder="Numero do cartao" className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#bd002a]" />
              <input value={cardHolder} onChange={(event) => setCardHolder(event.target.value)} placeholder="Nome impresso no cartao" className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#bd002a]" />
              <div className="grid grid-cols-2 gap-3">
                <input value={expiry} onChange={(event) => setExpiry(event.target.value.replace(/[^\d/]/g, '').slice(0, 5))} placeholder="MM/AA" className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#bd002a]" />
                <input value={securityCode} onChange={(event) => setSecurityCode(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="CVV" className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#bd002a]" />
              </div>
              <input value={identificationNumber} onChange={(event) => setIdentificationNumber(event.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="CPF do titular" className="w-full bg-[#f6f3f2] border border-[#e5e2e1] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#bd002a]" />
              <p className="text-[11px] text-[#5d3f3e] leading-relaxed">
                🔒 Seus dados de cartão nunca passam pelos nossos servidores. O Mercado Pago processa tudo de forma criptografada — a mesma tecnologia usada por milhões de lojas no Brasil.
              </p>
            </div>
          )}


          {modality === 'delivery' && (
            <>
              <button type="button" onClick={() => selectMethod('cash')} className={`w-full rounded-lg p-5 flex items-center justify-between transition-all text-left ${selectedMethod === 'cash' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold">Dinheiro</p>
                    <p className="text-xs font-medium text-[#5d3f3e]">Pagar na entrega</p>
                  </div>
                </div>
                {selectedMethod === 'cash' && <CheckCircle2 className="text-[#bd002a] w-6 h-6" />}
              </button>

              <button type="button" onClick={() => selectMethod('machine')} className={`w-full rounded-lg p-5 flex items-center justify-between transition-all text-left ${selectedMethod === 'machine' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-display font-bold">Maquininha / Vale Refeicao</p>
                    <p className="text-xs font-medium text-[#5d3f3e]">Cartao, debito ou VR na entrega</p>
                  </div>
                </div>
                {selectedMethod === 'machine' && <CheckCircle2 className="text-[#bd002a] w-6 h-6" />}
              </button>
            </>
          )}
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
