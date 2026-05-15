import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  ShoppingBag, 
  ReceiptText, 
  ArrowRight, 
  Utensils, 
  CreditCard, 
  Star, 
  User,
  Apple,
  AlertCircle
, Crown} from 'lucide-react';
import { useCart } from '../context/CartContext';
import ImageLightbox from '../components/ImageLightbox';
import { CupSoda } from 'lucide-react';

export default function AssinaturaDaily() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems, isAuthenticated, subsQuota } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isVitrineOpen, setIsVitrineOpen] = useState(false);

  const isCanceled = location.state?.canceled === true;
  const maxQuota = 16;
  const usedQuota = Math.max(0, maxQuota - subsQuota);
  const progressPercent = (usedQuota / maxQuota) * 100;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const history = [
    { 
      id: 1, 
      name: 'Colibri Roxo com Iogurte', 
      date: 'Ontem, às 14:20',
      image: 'https://i.imgur.com/snuE7CH.png'
    },
    { 
      id: 2, 
      name: 'Trio Açaí (Açaí de 700ml)', 
      date: '15 Abr, às 18:45',
      image: 'https://i.imgur.com/Y1YLUiG.png'
    },
    { 
      id: 3, 
      name: 'Manga + Morango + Abacaxi', 
      date: '12 Abr, às 12:10',
      image: 'https://i.imgur.com/3I72MuT.png'
    },
    { 
      id: 4, 
      name: 'Melancia + Morango + Limão', 
      date: '08 Abr, às 16:30',
      image: 'https://i.imgur.com/wuKBZej.png'
    },
  ];

  return (
    <div className="bg-[#fcf9f8] text-[#1c1b1b] min-h-screen pb-32">
      <ImageLightbox 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageSrc={selectedImage || ''} 
      />

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-sm flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
        >
          <ArrowLeft className="text-[#bd002a] w-6 h-6" />
        </button>
        <div className="flex items-center gap-2 ml-2">
          <CupSoda className="text-[#bd002a] w-5 h-5 shrink-0" />
          <h1 className="font-display font-extrabold text-xl tracking-tight text-[#bd002a] whitespace-nowrap">
            Assinatura Cosechas
          </h1>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-20 px-5 space-y-8">
        {/* Simulator Toggle (Preview Only) */}
        <div className="flex flex-wrap justify-end gap-2 px-1 mb-4">
          <button 
            onClick={() => navigate('/assinatura')}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
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
            className="text-[9px] font-bold text-[#bd002a] border border-[#bd002a] px-2 py-1 rounded-md bg-[#bd002a]/5"
          >
            Daily
          </button>
        </div>

        {isCanceled && (
          <div className="bg-[#fff0f0] border border-[#e8173a] rounded-xl p-4 flex gap-3 items-start animate-fade-in shadow-sm">
            <AlertCircle className="text-[#e8173a] w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[#bd002a] text-sm">Cancelamento Agendado</p>
              <p className="text-xs text-[#5d3f3e] mt-1 leading-relaxed">Sua assinatura foi cancelada, mas você pode usar seus benefícios até o dia <span className="font-bold">30 deste mês</span>.</p>
            </div>
          </div>
        )}

        {/* Active Plan Card */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#bd002a] to-[#e8173a] p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 p-6">
            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">ATIVO</span>
          </div>
          
          <div className="space-y-1">
            <p className="text-white/80 font-medium text-sm">Plano Atual</p>
            <h2 className="text-4xl font-display font-extrabold tracking-tight">Plano Daily</h2>
          </div>

          <div className="mt-6 flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white/90" fill="currentColor" stroke="none" />
              <span className="text-sm font-medium">16 compras/mês</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white/90" fill="currentColor" stroke="none" />
              <span className="text-sm font-medium">20% de desconto</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white/90" fill="currentColor" stroke="none" />
              <span className="text-sm font-medium">Pontos em dobro</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/90" />
              <span className="text-sm font-medium">Vence em 30/04</span>
            </div>
          </div>

          <div className="mt-8 flex items-baseline gap-1">
            <span className="text-2xl font-black">R$205,00</span>
            <span className="text-white/70 text-sm font-medium">/mês</span>
          </div>

          {/* Decorative Image */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 pointer-events-none">
            <img 
              alt="Morangos" 
              className="w-full h-full object-cover rounded-full" 
              src="https://images.unsplash.com/photo-1518635017498-87f514b751ba?q=80&w=260&auto=format&fit=crop"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Usage Bar Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#f0eded]">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-lg font-display font-bold text-[#1c1b1b]">Uso este mês</h3>
            <span className="text-[#bd002a] font-display font-bold text-lg">
              {usedQuota} <span className="text-[#5d3f3e] font-medium text-sm">/ {maxQuota}</span>
            </span>
          </div>
          <div className="w-full bg-[#f0eded] h-4 rounded-full overflow-hidden mb-5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-[#bd002a] h-full rounded-full"
            ></motion.div>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm font-medium text-[#5d3f3e]">{subsQuota} unidades restantes</p>
            <button 
              onClick={() => navigate('/assinatura/menu')}
              className="bg-[#e8173a] text-white font-bold text-sm px-4 py-2 rounded-full active:scale-95 transition-transform shadow-sm flex items-center gap-2"
            >
              <CupSoda className="w-4 h-4" />
              Resgatar Bebida
            </button>
          </div>
        </section>

        {/* History Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 text-[#1c1b1b]">Compras do plano este mês</h3>
          <div className="bg-white rounded-2xl divide-y divide-[#f0eded] overflow-hidden shadow-sm">
            {history.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setSelectedImage(item.image)}
                    className="w-10 h-10 rounded-full bg-[#fcf9f8] flex items-center justify-center shrink-0 overflow-hidden active:scale-95 transition-transform shadow-sm border border-[#f0eded]"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                  <div>
                    <p className="font-bold text-[13px] text-[#1c1b1b] leading-tight">{item.name}</p>
                    <p className="text-[11px] font-medium text-[#5d3f3e] opacity-60 mt-0.5">{item.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/clube/logado')}
                  className="bg-[#FDECEA] text-[#E8173A] font-bold text-[10px] px-2.5 py-1.5 rounded-full flex items-center gap-1 shrink-0 shadow-sm border border-[#E8173A]/5 active:scale-95 transition-transform"
                >
                  <Apple className="w-4 h-4" fill="currentColor" stroke="none" />
                  <span className="text-[14px] font-black leading-none">+</span>2 PONTOS
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Billing Section */}
        <section className="space-y-4">
          <h3 className="text-lg font-display font-bold px-1 text-[#1c1b1b]">Cobrança</h3>
          <div className="bg-white rounded-2xl p-5 border border-[#f0eded] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <ReceiptText className="text-[#5d3f3e] w-5 h-5 opacity-60" />
              <p className="text-sm font-medium text-[#5d3f3e]">Próxima cobrança: <span className="font-bold text-[#1c1b1b]">01/05 · R$205,00</span></p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[#f0eded]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-[#f0eded] flex items-center justify-center rounded border border-[#e5e2e1] overflow-hidden">
                  <span className="text-[9px] font-black italic text-[#1c1b1b]">VISA</span>
                </div>
                <p className="text-sm font-bold text-[#1c1b1b]">Visa **** 1234</p>
              </div>
              <button className="text-[#bd002a] text-sm font-bold flex items-center gap-1 active:scale-95 transition-transform">
                Trocar <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Actions */}
        {!isCanceled && (
          <section className="space-y-6 pt-4 pb-12">
            <div className="space-y-3 text-center">
              <button 
                onClick={() => navigate('/assinatura/trocar', { state: { currentPlan: 'Daily' } })}
                className="w-full py-4 border-2 border-[#bd002a] text-[#bd002a] font-display font-bold rounded-full transition-all active:scale-95 hover:bg-[#bd002a]/5 shadow-sm"
              >
                Trocar de plano
              </button>
              <p className="text-xs text-[#5d3f3e] font-medium opacity-60">
                A troca entra em vigor no próximo ciclo.
              </p>
            </div>
            <button 
              onClick={() => navigate('/assinatura/cancelar', { state: { currentPlan: 'Daily' } })}
              className="w-full py-4 border-2 border-[#e5e2e1] text-[#bd002a] font-display font-bold rounded-full transition-all active:scale-95 hover:bg-red-50/50 shadow-sm"
            >
              Cancelar plano
            </button>
          </section>
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: CupSoda, label: 'Assinatura', active: true, path: '/assinatura/daily' },
          { icon: Crown, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
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
