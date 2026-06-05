import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useSecureCardFields, CardInfo } from '../lib/useSecureCardFields';

const PUBLIC_KEY = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY as string;

const SF = 'h-[52px] bg-white border border-[#e5e2e1] rounded-xl';

export default function NovoCartao() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type || 'credit_card';

  const [cardHolder, setCardHolder] = useState('');
  const [cpf, setCpf] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [cardInfo, setCardInfo] = useState<CardInfo>({ paymentMethodId: '' });

  const { createToken } = useSecureCardFields(
    PUBLIC_KEY,
    { cardNumber: 'nc-card-number', expiration: 'nc-expiration', cvv: 'nc-cvv' },
    setCardInfo,
  );

  const handleSave = async () => {
    setError('');
    if (cardHolder.trim().split(' ').length < 2) {
      setError('Informe o nome completo do titular.');
      return;
    }
    if (cpf.replace(/\D/g, '').length !== 11) {
      setError('CPF inválido.');
      return;
    }
    setSaving(true);
    try {
      const tokenId = await createToken(cardHolder, cpf);
      const { error: fnError } = await supabase.functions.invoke('save-card', {
        body: { token: tokenId, payment_method_id: cardInfo.paymentMethodId, issuer_id: cardInfo.issuerId },
      });
      if (fnError) throw new Error(fnError.message || 'Não foi possível salvar o cartão.');
      navigate(-1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar cartão.');
    } finally {
      setSaving(false);
    }
  };

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
          <p className="text-[#5d3f3e] text-sm">
            Só guardamos os últimos 4 números. Os dados ficam protegidos com o Mercado Pago.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">Número do cartão</label>
            <div id="nc-card-number" className={SF} />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">Nome do titular</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Como está no cartão"
              className="w-full bg-white border border-[#e5e2e1] rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">Validade</label>
              <div id="nc-expiration" className={SF} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">CVV</label>
              <div id="nc-cvv" className={SF} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">CPF do titular</label>
            <input
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
              placeholder="000.000.000-00"
              className="w-full bg-white border border-[#e5e2e1] rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a]"
            />
          </div>
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
