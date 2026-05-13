import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CupSoda, 
  CheckCircle2, 
  CircleCheck, 
  Star, 
  ChevronDown, 
  MapPin, 
  Utensils, 
  CreditCard, 
  ShoppingBag, 
  User,
  Zap,
  ShieldCheck,
  XCircle,
  Tag,
  Info
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AssinaturaCosechas() {
  const navigate = useNavigate();
  const { isAuthenticated, totalItems } = useCart();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const plans = [
    {
      name: 'Duo',
      subtitle: '8 compras por mês',
      tag: null,
      price: '115',
      benefits: [
        '10% de desconto em cada compra',
        'Cancele quando quiser'
      ],
      featured: false
    },
    {
      name: 'Trio',
      subtitle: '12 compras por mês',
      tag: 'Mais popular',
      price: '165',
      benefits: [
        '15% de desconto em cada compra',
        'Pontos em dobro no Clube Cosechas',
        'Cancele quando quiser'
      ],
      featured: true
    },
    {
      name: 'Daily',
      subtitle: '16 compras por mês',
      tag: null,
      price: '205',
      benefits: [
        '20% de desconto em cada compra',
        'Pontos em dobro no Clube Cosechas',
        'Cancele quando quiser'
      ],
      featured: false
    }
  ];

  const faqs = [
    {
      question: 'Quando começa a ser cobrado?',
      answer: 'A primeira cobrança ocorre após a primeira utilização do plano.'
    },
    {
      question: 'Posso cancelar quando quiser?',
      answer: 'Sim. O cancelamento pode ser feito a qualquer momento pelo app, sem multa.'
    },
    {
      question: 'O que acontece se eu não usar todas as compras do mês?',
      answer: 'As unidades não utilizadas expiram no final do ciclo mensal e não acumulam para o mês seguinte.'
    },
    {
      question: 'O desconto vale para qualquer produto?',
      answer: 'Sim, o desconto é válido em todo o cardápio em ambos os tamanhos M e G.'
    },
    {
      question: 'Como funciona o ponto em dobro?',
      answer: 'Enquanto seu plano estiver ativo, cada compra gera 2 pontos no Clube Cosechas em vez de 1.'
    },
    {
      question: 'Posso trocar de plano?',
      answer: 'Sim. A troca pode ser feita pelo app a qualquer momento.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubscribe = (plan: typeof plans[0]) => {
    if (!isAuthenticated) {
      navigate('/clube/nao-logado');
    } else {
      navigate('/assinatura/checkout', { state: { plan } });
    }
  };

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen pb-32 selection:bg-[#e8173a]/20">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
        >
          <ArrowLeft className="text-[#e8173a] w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <Tag className="text-[#e8173a] w-5 h-5 shrink-0" />
          <h1 className="font-display font-bold text-base text-[#e8173a] whitespace-nowrap">
            Assinatura Cosechas
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-20">
        {/* Simulator Toggle (Preview Only) */}
        <div className="flex flex-wrap justify-end gap-2 px-1 mb-4">
          <button 
            onClick={() => navigate('/assinatura')}
            className="text-[9px] font-bold text-[#bd002a] border border-[#bd002a] px-2 py-1 rounded-md bg-[#bd002a]/5"
          >
            Plano Inativo
          </button>
          <button 
            onClick={() => navigate('/assinatura/duo')}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Duo
          </button>
          <button 
            onClick={() => navigate('/assinatura/ativa')}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Trio
          </button>
          <button 
            onClick={() => navigate('/assinatura/daily')}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Daily
          </button>
        </div>

        {/* Hero Banner */}
        <section className="mt-4 px-4">
          <div className="relative overflow-hidden bg-[#bd002a] rounded-2xl p-8 flex flex-col justify-end min-h-[240px] shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 bg-[#e8173a] rounded-full opacity-20 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl font-display font-extrabold text-white leading-tight tracking-tight mb-3">
                Beba mais,<br />pague menos.
              </h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-[80%] font-medium">
                Assine um plano e ganhe desconto em cada compra e pontos em dobro.
              </p>
            </div>
          </div>
        </section>

        {/* Plan Cards Section */}
        <section className="mt-10 px-4 space-y-6">
          {plans.map((plan, idx) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl p-6 shadow-sm flex flex-col transition-all hover:scale-[1.02] duration-300 ${
                plan.featured 
                  ? 'bg-gradient-to-br from-[#bd002a] to-[#e8173a] shadow-xl p-7' 
                  : 'bg-white'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffc107] text-[#1c1b1b] px-4 py-1 rounded-full text-[11px] font-black uppercase tracking-widest shadow-md">
                   ✦ Mais popular
                </div>
              )}
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`font-display font-extrabold ${plan.featured ? 'text-3xl text-white' : 'text-2xl text-[#1c1b1b]'}`}>
                    {plan.name}
                  </h3>
                  <span className={`font-bold text-sm ${plan.featured ? 'text-white/80' : 'text-[#bd002a]'}`}>
                    {plan.subtitle}
                  </span>
                </div>
                {plan.tag && !plan.featured && (
                  <div className="bg-[#008388]/10 text-[#008388] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {plan.tag}
                  </div>
                )}
                {plan.featured && (
                  <Star className="text-white/40 w-10 h-10" fill="currentColor" />
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.benefits.map((benefit, bIdx) => (
                  <li key={bIdx} className={`flex items-start gap-2 text-sm ${plan.featured ? 'text-white font-medium' : 'text-[#5d3f3e]'}`}>
                    {plan.featured ? (
                      <ShieldCheck className="text-white w-5 h-5 shrink-0" />
                    ) : (
                      <CircleCheck className="text-[#00686c] w-4.5 h-4.5 shrink-0" />
                    )}
                    <span className={plan.featured ? 'whitespace-nowrap' : ''}>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className={`block text-xs font-medium ${plan.featured ? 'text-white/70' : 'text-[#5d3f3e]'}`}>
                    {plan.featured ? 'Investimento' : 'Por apenas'}
                  </span>
                  <p className={`font-display font-black ${plan.featured ? 'text-2xl text-white' : 'text-xl text-[#1c1b1b]'}`}>
                    R$ {plan.price}<span className={`text-sm font-normal ${plan.featured ? 'text-white/70' : 'text-[#5d3f3e]'}`}>/mês</span>
                  </p>
                </div>
                <button 
                  onClick={() => handleSubscribe(plan)}
                  className={`px-8 py-3 rounded-full font-display font-bold text-sm transition-all active:scale-95 shadow-lg ${
                    plan.featured 
                      ? 'bg-white text-[#bd002a] font-black' 
                      : 'border-2 border-[#bd002a] text-[#bd002a] hover:bg-[#bd002a]/5'
                  }`}
                >
                  {plan.featured ? 'Assinar Agora' : 'Assinar'}
                </button>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Why Subscribe Section */}
        <section className="mt-16 px-6">
          <h2 className="text-2xl font-display font-black text-[#1c1b1b] mb-8 text-center">Por que assinar?</h2>
          <div className="grid grid-cols-1 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad8] flex items-center justify-center shrink-0">
                <Tag className="text-[#bd002a] w-6 h-6" />
              </div>
              <div className="flex items-center h-12">
                <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight text-left">Economize em cada compra do mês</h4>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#91f2f7]/30 flex items-center justify-center shrink-0">
                <Zap className="text-[#00686c] w-6 h-6" />
              </div>
              <div className="flex items-center h-12">
                <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight text-left">Acumule pontos 2x mais rápido e troque por shakes grátis</h4>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e5e2e1] flex items-center justify-center shrink-0">
                <XCircle className="text-[#5d3f3e] w-6 h-6" />
              </div>
              <div className="flex items-center h-12">
                <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight text-left">Sem fidelidade — cancele quando quiser pelo app</h4>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-16 px-6">
          <h2 className="text-2xl font-display font-black text-[#1c1b1b] mb-6">Dúvidas frequentes</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-[#f6f3f2] rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 flex justify-between items-center transition-colors"
                >
                  <span className="text-sm font-bold text-[#1c1b1b]">{faq.question}</span>
                  <ChevronDown className={`text-[#5d3f3e] w-5 h-5 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-4 pb-4 overflow-hidden"
                    >
                      <p className="text-xs text-[#5d3f3e] leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pb-12 px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-[#5d3f3e]/60">
            <MapPin className="w-4 h-4" />
            <span className="text-[10px] font-bold tracking-tight uppercase">válido somente na unidade Dimension Park — Barra</span>
          </div>
        </footer>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: CreditCard, label: 'Assinatura', active: true, path: '/assinatura' },
          { icon: Star, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
          { icon: ShoppingBag, label: 'Sacola', active: false, badge: totalItems, path: '/sacola' },
          { icon: User, label: 'Perfil', active: false, path: isAuthenticated ? '/perfil/logado' : '/perfil/nao-logado' },
        ].map(item => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-4 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E8173A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
