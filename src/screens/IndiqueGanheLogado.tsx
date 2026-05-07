import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  X, 
  Share2, 
  UserPlus, 
  Gift, 
  Info, 
  ArrowRight,
  Copy,
  Check,
  Award
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function IndiqueGanheLogado() {
  const navigate = useNavigate();
  const { applyCoupon } = useCart();
  const [isCopied, setIsCopied] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  const referrals = [
    { id: 1, friend: 'Marina Silva', date: '28/04/2024', coupon: 'R$5 OFF', status: 'Disponível', expiry: '12/06' },
    { id: 2, friend: 'Ricardo Alves', date: '25/04/2024', coupon: 'R$5 OFF', status: 'Disponível', expiry: '09/06' },
    { id: 3, friend: 'Ana Paula', date: '20/04/2024', coupon: 'R$5 OFF', status: 'Disponível', expiry: '04/06' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText('GABRIEL10');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleUseCoupon = () => {
    applyCoupon('GABRIEL10');
    navigate('/HomeComSacola');
  };

  const steps = [
    {
      icon: Share2,
      title: 'Compartilhe seu código',
      description: 'Envie para amigos que nunca compraram na nossa unidade Dimension Park, Barra.'
    },
    {
      icon: UserPlus,
      title: 'Amigo faz o primeiro pedido',
      description: 'Seu amigo precisa ter cadastro no Meu Cosechas e digitar seu código no campo de cupom na hora de finalizar o primeiro pedido pelo app. O cupom de indicação não é válido para compras no caixa.'
    },
    {
      icon: Gift,
      title: 'Os dois saem ganhando',
      description: 'Seu amigo ganha R$5 de desconto na hora. Você recebe R$5 de crédito automaticamente após a primeira compra dele.'
    }
  ];

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen pb-32">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#008388]/10 rounded-full flex items-center justify-center">
            <Users className="text-[#008388] w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-lg text-[#1c1b1b]">
            Indique e Ganhe
          </h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors"
        >
          <X className="text-[#5d3f3e] w-6 h-6" />
        </button>
      </header>

      <main className="max-w-md mx-auto pt-20">
        {/* Simulator Toggle (Preview Only) */}
        <div className="flex justify-end gap-2 px-6 mb-4">
          <button 
            onClick={() => navigate('/indique-ganhe')}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Não logado
          </button>
          <button 
            className="text-[9px] font-bold text-[#008388] border border-[#008388] px-2 py-1 rounded-md bg-[#008388]/5"
          >
            Logado
          </button>
        </div>

        {/* Hero Banner */}
        <section className="mt-4 px-4">
          <div className="relative overflow-hidden bg-gradient-to-br from-[#bd002a] to-[#e8173a] rounded-2xl p-8 flex flex-col justify-center min-h-[200px] shadow-lg text-white">
            <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 bg-white/10 rounded-full opacity-30 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-display font-extrabold leading-tight mb-2">
                Ganhe R$5 por cada amigo!
              </h2>
              <p className="text-white/90 text-sm font-medium">
                Seu amigo também ganha R$5 na primeira compra.
              </p>
            </div>
            {/* Decorative Image Placeholder/Style */}
            <div className="absolute right-[-20px] bottom-[-20px] opacity-20 pointer-events-none">
               <Users size={120} strokeWidth={1} />
            </div>
          </div>
        </section>

        {/* Exclusive Code Card */}
        <section className="mt-6 px-4">
          <div className="bg-[#FDECEA] rounded-2xl p-6 shadow-sm border border-[#ffdad8]">
            <div className="flex items-center gap-2 mb-4">
              <Award className="text-[#e8173a] w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#5d3f3e]">SEU CÓDIGO EXCLUSIVO</span>
            </div>
            
            <div className="flex flex-col items-center gap-6">
              <h3 className="text-3xl font-black text-[#bd002a] tracking-tight">GABRIEL10</h3>
              
              <div className="w-full">
                <button 
                  onClick={handleCopy}
                  className="w-full py-4 border-2 border-[#bd002a] text-[#bd002a] rounded-full text-sm font-black flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <AnimatePresence mode="wait">
                    {isCopied ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="check">
                        <Check className="w-4 h-4 text-green-600" />
                      </motion.div>
                    ) : (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} key="copy">
                        <Copy className="w-4 h-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isCopied ? 'COPIADO!' : 'COPIAR CÓDIGO'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="mt-12 px-6">
          <h3 className="text-xl font-display font-black text-[#1c1b1b] mb-8">Como funciona?</h3>
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#f0eded] flex items-center justify-center">
                  <step.icon className="text-[#5d3f3e] w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1c1b1b] text-sm mb-0.5">{step.title}</h4>
                  <p className="text-xs font-medium text-[#5d3f3e] opacity-60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Referrals Section */}
        <section className="mt-12 px-4 pb-12">
          <div className="flex flex-col gap-4 mb-6 px-2">
            <h3 className="text-xl font-display font-black text-[#1c1b1b]">Minhas Indicações</h3>
            
            {/* Toggle State (Preview Only) */}
            <div className="flex bg-[#f0eded]/50 p-1 rounded-full w-fit">
              <button 
                onClick={() => setShowEmptyState(false)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${!showEmptyState ? 'bg-[#bd002a] text-white shadow-sm' : 'text-[#5d3f3e]/60'}`}
              >
                Com indicações
              </button>
              <button 
                onClick={() => setShowEmptyState(true)}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all ${showEmptyState ? 'bg-[#bd002a] text-white shadow-sm' : 'text-[#5d3f3e]/60'}`}
              >
                Sem indicações
              </button>
            </div>
          </div>
          
          {referrals.length > 0 && !showEmptyState ? (
            <div className="bg-white rounded-2xl overflow-hidden border border-[#f0eded] shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#fcf9f8] border-b border-[#f0eded]">
                    <tr>
                      <th className="px-4 py-3 text-[10px] font-black text-[#5d3f3e]/60 uppercase tracking-widest">Amigo</th>
                      <th className="px-4 py-3 text-[10px] font-black text-[#5d3f3e]/60 uppercase tracking-widest text-center">Cupom</th>
                      <th className="px-4 py-3 text-[10px] font-black text-[#5d3f3e]/60 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eded]">
                    {referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-[#fcf9f8]/50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="text-[13px] font-bold text-[#1c1b1b]">{ref.friend}</p>
                          <p className="text-[10px] font-medium text-[#5d3f3e]/60">{ref.date}</p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="bg-[#e6f7f5] text-[#00686c] text-[10px] font-black px-2 py-1 rounded-md">
                            {ref.coupon}
                          </span>
                          <p className="text-[9px] font-medium text-[#5d3f3e]/40 mt-1">Val: {ref.expiry}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button 
                            onClick={handleUseCoupon}
                            className="bg-[#bd002a] text-white text-[10px] font-black rounded-full px-4 py-1.5 active:scale-90 transition-transform shadow-sm"
                          >
                            USAR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center border-2 border-dashed border-[#f0eded]">
              <Users className="text-[#5d3f3e]/20 w-16 h-16 mb-4" />
              <p className="text-base font-bold text-[#1c1b1b] text-center mb-2">Você ainda não indicou ninguém.</p>
              <p className="text-xs font-medium text-[#5d3f3e]/60 text-center max-w-[240px] leading-relaxed">
                Compartilhe seu código e comece a ganhar R$5 por cada amigo que fizer o primeiro pedido.
              </p>
            </div>
          )}
        </section>

        {/* Global Warnings */}
        <section className="px-6 space-y-4 mb-20">
          <div className="bg-[#fff9c4]/50 rounded-2xl p-4 flex gap-3 border border-[#fbc02d]/10">
            <Info className="text-[#fbc02d] w-5 h-5 shrink-0" />
            <p className="text-[11px] font-bold text-[#5d3f3e] leading-snug">
              Cupom não válido para Açaís e Promoção Seu Cosechas.
            </p>
          </div>
          <div className="text-center space-y-2">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#5d3f3e]/30">
              CRÉDITO VÁLIDO POR 45 DIAS APÓS LIBERAÇÃO
            </p>
            <p className="text-[9px] font-bold text-[#5d3f3e]/30">
              Válido somente para a Unidade Dimension Park, Barra
            </p>
          </div>
        </section>
      </main>

      {/* No Sticky Button Here */}
    </div>
  );
}
