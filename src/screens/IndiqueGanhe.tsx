import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Users, 
  X, 
  Share2, 
  UserPlus, 
  Gift, 
  Info, 
  ArrowRight 
} from 'lucide-react';

export default function IndiqueGanhe() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen pb-32 selection:bg-[#008388]/20">
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
            className="text-[9px] font-bold text-[#008388] border border-[#008388] px-2 py-1 rounded-md bg-[#008388]/5"
          >
            Não logado
          </button>
          <button 
            onClick={() => navigate('/indique-ganhe/logado')}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
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

        {/* How it Works Section */}
        <section className="mt-12 px-6">
          <h3 className="text-xl font-display font-black text-[#1c1b1b] mb-8">Como funciona?</h3>
          
          <div className="space-y-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="flex gap-4"
              >
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-[#ffdad8] flex items-center justify-center">
                  <step.icon className="text-[#e8173a] w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-[#1c1b1b] text-base mb-1">
                    {step.title}
                  </h4>
                  <p className="text-sm font-medium text-[#5d3f3e] opacity-70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Restriction Alert */}
        <section className="mt-12 px-6">
          <div className="bg-[#fff9c4] rounded-2xl p-5 flex gap-4 border border-[#fbc02d]/20 shadow-sm">
            <Info className="text-[#fbc02d] w-6 h-6 shrink-0" />
            <p className="text-sm font-bold text-[#5d3f3e] leading-tight">
              Cupom não válido para Açaís e Promoção Seu Cosechas.
            </p>
          </div>
        </section>

        {/* Disclaimers */}
        <section className="mt-12 px-6 pb-20 text-center space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#5d3f3e]/40">
            CRÉDITO VÁLIDO POR 45 DIAS APÓS LIBERAÇÃO
          </p>
          <p className="text-[10px] font-bold text-[#5d3f3e]/40 max-w-[200px] mx-auto leading-relaxed">
            Válido somente para quem nunca comprou na Unidade Dimension Park, Barra
          </p>
        </section>
      </main>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#fcf9f8] via-[#fcf9f8] to-transparent z-50">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          className="w-full bg-[#bd002a] text-white font-display font-black py-5 rounded-full flex items-center justify-center gap-2 shadow-2xl shadow-[#bd002a]/30"
        >
          <span>ATIVAR E GERAR MEU CÓDIGO</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
