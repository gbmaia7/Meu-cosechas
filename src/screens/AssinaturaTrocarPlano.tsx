import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

const plans = [
  {
    name: 'Duo',
    subtitle: '8 compras por mês',
    price: '115',
    benefits: [
      '10% de desconto em cada compra',
      'Cancele quando quiser'
    ]
  },
  {
    name: 'Trio',
    subtitle: '12 compras por mês',
    price: '165',
    benefits: [
      '15% de desconto em cada compra',
      'Pontos em dobro no Clube Cosechas',
      'Cancele quando quiser'
    ]
  },
  {
    name: 'Daily',
    subtitle: '16 compras por mês',
    price: '205',
    benefits: [
      '20% de desconto em cada compra',
      'Pontos em dobro no Clube Cosechas',
      'Cancele quando quiser'
    ]
  }
];

export default function AssinaturaTrocarPlano() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPlanName = location.state?.currentPlan || 'Trio';
  
  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans.find(p => p.name !== currentPlanName)?.name || 'Duo'
  );
  const handleConfirm = () => {
    const plan = plans.find(p => p.name === selectedPlan);
    navigate('/assinatura/checkout', { state: { plan } });
  };

  return (
    <div className="bg-[#fcf9f8] min-h-dvh font-body text-[#1c1b1b] pb-32">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#e5e2e1] flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
        >
          <ArrowLeft className="text-[#e8173a] w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-base text-[#1c1b1b] ml-2">Trocar de plano</h1>
      </header>

      <main className="px-4 pt-6 space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-display font-black text-[#1c1b1b] mb-2">
            Escolha seu novo plano
          </h2>
          <p className="text-sm text-[#5d3f3e]">
            O seu plano atual é o <span className="font-bold">{currentPlanName}</span>. Selecione o plano que deseja ativar no próximo ciclo.
          </p>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => {
            const isCurrent = plan.name === currentPlanName;
            const isSelected = plan.name === selectedPlan;

            if (isCurrent) return null;

            return (
              <label 
                key={plan.name}
                className={`relative flex flex-col p-5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected ? 'border-[#bd002a] bg-[#bd002a]/5 shadow-sm' : 'border-[#e5e2e1] bg-white'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3">
                    <input 
                      type="radio" 
                      name="plan" 
                      value={plan.name} 
                      checked={isSelected}
                      onChange={() => setSelectedPlan(plan.name)}
                      className="w-5 h-5 accent-[#bd002a] mt-1 shrink-0" 
                    />
                    <div>
                      <h3 className="font-display font-bold text-lg text-[#1c1b1b]">{plan.name}</h3>
                      <span className="font-bold text-sm text-[#bd002a]">{plan.subtitle}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-medium text-[#5d3f3e]">Por apenas</span>
                    <p className="font-display font-black text-xl text-[#1c1b1b]">
                      R$ {plan.price}<span className="text-xs font-normal text-[#5d3f3e]">/mês</span>
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mt-2 ml-8">
                  {plan.benefits.map((benefit, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2 text-[11px] text-[#5d3f3e]">
                      <ShieldCheck className="text-[#008388] w-4 h-4 shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </label>
            );
          })}
        </div>
      </main>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#e5e2e1] p-4 pb-8 z-50">
        <button 
          onClick={handleConfirm}
          className="w-full bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white py-4 rounded-full font-bold flex items-center justify-center transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-base"
        >
          Confirmar troca para {selectedPlan}
        </button>
      </div>
    </div>
  );
}
