import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CreditCard, Calendar, Lock } from 'lucide-react';

export default function NovoCartao() {
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type || 'credit_card'; // 'credit_card' or 'debit_card'
  const [expiry, setExpiry] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length >= 3) {
      formattedValue = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiry(formattedValue);
  };

  const handleSave = () => {
    localStorage.removeItem('savedCardRemoved');
    localStorage.setItem('savedCardName', 'Novo Cartão');
    navigate('/pagamento', { state: { preSelectedMethod: 'credit_card_saved' } });
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body relative z-0">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#E8173A] hover:bg-zinc-100 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform -ml-2 mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg text-[#1c1b1b]">Novo Cartão</h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-6">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-extrabold tracking-tight mb-2">
            {type === 'debit_card' ? 'Adicionar cartão de débito' : 'Adicionar cartão de crédito'}
          </h2>
          <p className="text-[#5d3f3e] font-medium text-sm">Insira os dados do seu cartão para concluir a compra de forma rápida e segura.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">Número do cartão</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000" 
                className="w-full bg-white border border-[#e5e2e1] rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">Nome do titular</label>
            <input 
              type="text" 
              placeholder="Como está impresso no cartão" 
              className="w-full bg-white border border-[#e5e2e1] rounded-xl py-3.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all"
            />
          </div>

          <div className="flex gap-4">
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">Validade</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input 
                  type="text" 
                  placeholder="MM/AA" 
                  value={expiry}
                  onChange={handleExpiryChange}
                  maxLength={5}
                  className="w-full bg-white border border-[#e5e2e1] rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-[#5d3f3e] uppercase tracking-wider pl-1">CVV</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full bg-white border border-[#e5e2e1] rounded-xl py-3.5 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#bd002a] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
             <button 
                type="submit"
                className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#bd002a] text-white rounded-full font-display font-bold shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Salvar Cartão
              </button>
          </div>

        </form>

      </main>
    </div>
  );
}
