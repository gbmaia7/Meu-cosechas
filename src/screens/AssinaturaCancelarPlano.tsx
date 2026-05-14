import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Trash2 } from 'lucide-react';

export default function AssinaturaCancelarPlano() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPlanName = location.state?.currentPlan || 'Trio';
  
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = () => {
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="bg-[#fcf9f8] min-h-dvh flex flex-col items-center justify-center p-6 text-center font-body selection:bg-[#e8173a]/20">
        <div className="w-24 h-24 bg-[#f6f3f2] rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Trash2 className="w-10 h-10 text-[#5d3f3e]" />
        </div>
        
        <h2 className="text-2xl font-display font-black text-[#1c1b1b] tracking-tight mb-3">Assinatura Cancelada</h2>
        <p className="text-sm text-[#5d3f3e] max-w-[250px] leading-relaxed font-medium mb-8">
          Sua assinatura foi cancelada com sucesso mas continuará ativa no seu aplicativo. Você ainda pode aproveitar seus benefícios até o dia 30 deste mês!
        </p>
        
        <button 
          onClick={() => navigate('/assinatura/ativa', { state: { canceled: true } })}
          className="w-full max-w-[300px] bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white py-4 rounded-full font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-base"
        >
          Voltar para minha assinatura
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf9f8] min-h-dvh font-body text-[#1c1b1b] pb-48 overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#e5e2e1] flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
        >
          <ArrowLeft className="text-[#e8173a] w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-base text-[#1c1b1b] ml-2">Cancelar Assinatura</h1>
      </header>

      <main className="px-4 pt-8 space-y-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-[#fff0f0] rounded-full mx-auto flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[#e8173a]" />
          </div>
          <h2 className="text-2xl font-display font-black text-[#1c1b1b] mb-3">
            Tem certeza que deseja cancelar?
          </h2>
          <p className="text-sm text-[#5d3f3e]">
            Ao cancelar seu plano <span className="font-bold text-[#1c1b1b]">{currentPlanName}</span>, você perderá os benefícios exclusivos no final deste ciclo.
          </p>
        </div>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-[#e5e2e1]">
          <h3 className="font-bold text-sm text-[#1c1b1b] mb-4">O que você vai perder:</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f6f3f2] flex justify-center items-center text-[#5d3f3e] text-xs font-bold leading-none shrink-0 mt-0.5">X</span>
              <div>
                <p className="font-bold text-sm text-[#5d3f3e]">Descontos em todas as compras</p>
                <p className="text-xs text-[#a8a29e] mt-1">Gaste de R$ 30 a R$ 60 a menos por mês em suas visitas.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#f6f3f2] flex justify-center items-center text-[#5d3f3e] text-xs font-bold leading-none shrink-0 mt-0.5">X</span>
              <div>
                <p className="font-bold text-sm text-[#5d3f3e]">Acúmulo rápido de pontos</p>
                <p className="text-xs text-[#a8a29e] mt-1">Sua conta deixará de ter multiplicador de pontos.</p>
              </div>
            </li>
          </ul>
        </section>

      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e5e2e1] p-4 pb-8 z-50 flex flex-col gap-3">
        <button 
          onClick={() => navigate(-1)}
          className="w-full bg-[#f6f3f2] text-[#1c1b1b] py-4 rounded-full font-bold flex items-center justify-center transition-all hover:bg-[#e5e2e1] active:scale-95 text-base"
        >
          Manter meu plano
        </button>
        <button 
          onClick={handleConfirm}
          className="w-full bg-white text-[#bd002a] border border-[#bd002a] py-4 rounded-full font-bold flex items-center justify-center transition-all shadow-sm hover:bg-neutral-50 active:scale-95 text-base"
        >
          Quero cancelar
        </button>
      </div>
    </div>
  );
}
