import { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, ChevronRight, ShieldCheck, Wallet } from 'lucide-react';

export default function AssinaturaCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;
  const [selectedMethod, setSelectedMethod] = useState<string>('credit_card_saved');

  if (!plan) return <Navigate to="/assinatura" />;

  const handleFinalize = () => {
    switch (selectedMethod) {
      case 'pix':
        navigate('/assinatura/validando-pagamento', { state: { plan, method: 'pix' } });
        break;
      case 'credit_card_saved':
      default:
        navigate('/assinatura/validando-pagamento', { state: { plan, method: 'cartao' } });
    }
  };

  return (
    <div className="bg-[#fcf9f8] min-h-dvh font-body text-[#1c1b1b] antialiased pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
        >
          <ArrowLeft className="text-[#e8173a] w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-base text-[#e8173a] ml-2">Pagamento da Assinatura</h1>
      </header>

      <main className="pt-20 px-4 space-y-6">
        {/* Resumo do Plano */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5e2e1]">
          <h2 className="font-display font-bold text-[#5d3f3e] text-[10px] uppercase tracking-widest mb-4">Resumo da Assinatura</h2>
          
          <div className="mb-4">
            <h3 className="text-xl font-display font-extrabold text-[#1c1b1b]">{plan.name}</h3>
            <p className="text-sm font-bold text-[#bd002a]">{plan.subtitle}</p>
            <ul className="mt-3 space-y-2">
               {plan.benefits.map((b: string, i: number) => (
                 <li key={i} className="flex items-start gap-2 text-xs text-[#5d3f3e]">
                   <ShieldCheck className="w-4 h-4 text-[#00686c] shrink-0" />
                   {b}
                 </li>
               ))}
            </ul>
          </div>
          
          <hr className="border-[#e5e2e1] my-4" />
          
          <div className="flex justify-between items-center bg-[#f6f3f2] p-4 rounded-xl">
            <span className="font-bold text-sm text-[#5d3f3e]">Total a pagar (mensal)</span>
            <span className="font-display font-black text-[#bd002a] text-xl">R$ {plan.price}</span>
          </div>
        </section>

        {/* Formas de Pagamento */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5e2e1] flex flex-col gap-3">
          <h2 className="font-display font-bold text-[#5d3f3e] text-[10px] uppercase tracking-widest mb-2">Forma de Pagamento</h2>

          <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'credit_card_saved' ? 'border-[#bd002a] bg-[#bd002a]/5' : 'border-[#e5e2e1] bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f6f3f2] rounded-full flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#bd002a]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1c1b1b]">Mastercard final 4912</p>
                <p className="text-[10px] text-[#5d3f3e]">Crédito</p>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              value="credit_card_saved" 
              checked={selectedMethod === 'credit_card_saved'}
              onChange={() => setSelectedMethod('credit_card_saved')}
              className="w-5 h-5 accent-[#bd002a]" 
            />
          </label>

          <label className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedMethod === 'pix' ? 'border-[#bd002a] bg-[#bd002a]/5' : 'border-[#e5e2e1] bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#f6f3f2] rounded-full flex items-center justify-center">
                 <Wallet className="w-5 h-5 text-[#00686c]" />
              </div>
              <div>
                <p className="font-bold text-sm text-[#1c1b1b]">Pix</p>
                <p className="text-[10px] text-[#5d3f3e]">Aprovação imediata</p>
              </div>
            </div>
            <input 
              type="radio" 
              name="payment" 
              value="pix" 
              checked={selectedMethod === 'pix'}
              onChange={() => setSelectedMethod('pix')}
              className="w-5 h-5 accent-[#bd002a]" 
            />
          </label>

          <button 
            onClick={() => navigate('/pagamento/cartao')}
            className="flex items-center justify-between p-4 rounded-xl border border-dashed border-[#a8a29e] hover:bg-[#f6f3f2] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-[#a8a29e] flex items-center justify-center text-[#5d3f3e]">
                +
              </div>
              <span className="font-bold text-sm text-[#5d3f3e]">Adicionar novo cartão</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#a8a29e]" />
          </button>
        </section>

        {/* Termos */}
        <p className="text-[10px] text-center text-[#5d3f3e] px-4 opacity-80 leading-relaxed font-medium">
          Ao confirmar, você concorda com a renovação automática mensal do plano. Cancele a qualquer momento nas configurações do app.
        </p>

        {/* Botões Bottom */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e5e2e1] p-4 pb-8 z-50">
          <button 
            onClick={handleFinalize}
            className="w-full bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-base"
          >
            Assinar por R$ {plan.price}/mês
          </button>
        </div>
      </main>
    </div>
  );
}
