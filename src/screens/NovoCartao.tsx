import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CreditCard, Calendar, Lock, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string) => any;
  }
}

const loadMercadoPago = async () => {
  if (window.MercadoPago) return window.MercadoPago;
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://sdk.mercadopago.com/js/v2"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Erro ao carregar MercadoPago.js')), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Erro ao carregar MercadoPago.js'));
    document.body.appendChild(script);
  });
  if (!window.MercadoPago) throw new Error('MercadoPago.js indisponível.');
  return window.MercadoPago;
};

export default function NovoCartao() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type || 'credit_card';
  const selecting = location.state?.selecting;

  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cpf, setCpf] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const validate = () => {
    const next: Record<string, string> = {};
    if (cardNumber.replace(/\D/g, '').length < 13) next.cardNumber = 'Número inválido';
    if (cardHolder.trim().split(' ').length < 2) next.cardHolder = 'Nome completo';
    if (expiry.length < 5) next.expiry = 'Data inválida';
    if (cvv.length < 3) next.cvv = 'CVV inválido';
    if (cpf.replace(/\D/g, '').length !== 11) next.cpf = 'CPF inválido';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setError('');
    try {
      const publicKey = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
      if (!publicKey) throw new Error('Public Key não configurada.');

      const cleanCard = cardNumber.replace(/\D/g, '');
      const cleanCpf = cpf.replace(/\D/g, '');
      const [month, shortYear] = expiry.split('/');
      const year = shortYear?.length === 2 ? `20${shortYear}` : shortYear;

      const MercadoPago = await loadMercadoPago();
      const mp = new MercadoPago(publicKey);

      const methods = await mp.getPaymentMethods({ bin: cleanCard.slice(0, 6) });
      const paymentMethodId = methods?.results?.[0]?.id || methods?.[0]?.id;
      if (!paymentMethodId) throw new Error('Bandeira não identificada.');

      const token = await mp.createCardToken({
        cardNumber: cleanCard,
        cardholderName: cardHolder,
        cardExpirationMonth: month,
        cardExpirationYear: year,
        securityCode: cvv,
        identificationType: 'CPF',
        identificationNumber: cleanCpf,
      });
      if (!token?.id) throw new Error('Não foi possível tokenizar o cartão.');

      const { error: fnError } = await supabase.functions.invoke('save-card', {
        body: { token: token.id },
      });
      if (fnError) throw new Error('Não foi possível salvar o cartão. Tente novamente.');

      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cartão.');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, children: React.ReactNode, err?: string) => (
    <div className="space-y-1">
      <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">{label}</label>
      {children}
      {err && <p className="text-[#e8173a] text-[10px] font-bold px-1">{err}</p>}
    </div>
  );

  const inputClass = (hasError?: boolean) =>
    `w-full bg-white border ${hasError ? 'border-[#e8173a]' : 'border-[#e5e2e1]'} rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all`;

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16 gap-4">
        <button onClick={() => navigate(-1)} className="text-[#E8173A] p-2 rounded-full active:scale-95 transition-transform -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg">Novo Cartão</h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-4 pb-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-extrabold tracking-tight mb-1">
            {type === 'debit_card' ? 'Cartão de débito' : 'Cartão de crédito'}
          </h2>
          <p className="text-[#5d3f3e] text-sm">Dados tokenizados pelo Mercado Pago. Nunca armazenamos o número completo.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {field('Número do cartão',
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/[^\d ]/g, '').slice(0, 19))}
                placeholder="0000 0000 0000 0000"
                className={`w-full bg-white border ${errors.cardNumber ? 'border-[#e8173a]' : 'border-[#e5e2e1]'} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all`}
              />
            </div>,
            errors.cardNumber,
          )}

          {field('Nome do titular',
            <input type="text" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="Como está no cartão" className={inputClass(!!errors.cardHolder)} />,
            errors.cardHolder,
          )}

          <div className="grid grid-cols-2 gap-3">
            {field('Validade',
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
                  placeholder="MM/AA"
                  className={`w-full bg-white border ${errors.expiry ? 'border-[#e8173a]' : 'border-[#e5e2e1]'} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all`}
                />
              </div>,
              errors.expiry,
            )}
            {field('CVV',
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="123"
                  className={`w-full bg-white border ${errors.cvv ? 'border-[#e8173a]' : 'border-[#e5e2e1]'} rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all`}
                />
              </div>,
              errors.cvv,
            )}
          </div>

          {field('CPF do titular',
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="000.000.000-00"
              className={inputClass(!!errors.cpf)}
            />,
            errors.cpf,
          )}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#bd002a] text-white rounded-full font-display font-bold shadow-lg shadow-[#bd002a]/20 active:scale-95 transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Cartão'}
        </button>
      </main>
    </div>
  );
}
