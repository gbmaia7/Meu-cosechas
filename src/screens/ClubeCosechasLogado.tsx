import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { ArrowLeft, X, Home, Utensils, Star, ShoppingBag, User, CreditCard, PartyPopper, Info, CupSoda } from 'lucide-react';
import VitrinePremios from '../components/VitrinePremios';

export default function ClubeCosechasLogado() {
  const navigate = useNavigate();
  const { userPoints, setUserPoints, isAuthenticated, setIsAuthenticated, totalItems } = useCart();
  const [selectedRewardTier, setSelectedRewardTier] = useState<7 | 10 | 12 | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleAuth = () => {
    setIsAuthenticated(!isAuthenticated);
    navigate(isAuthenticated ? '/clube/nao-logado' : '/clube/logado');
  };

  const progressPercentage = Math.min((userPoints / 12) * 100, 100);

  const rewards = [
    { 
      points: 7, 
      name: 'Funcional, A Boa de Hoje ou Promoção Seu Cosechas',
      subtitle: 'Equivale a 7 compras ou 4 com Assinatura Cosechas'
    },
    { 
      points: 10, 
      name: 'Mix de Frutas, Milkshake, Linha Caribe, Açaí Médio ou Açaí Bowl M',
      subtitle: 'Equivale a 10 compras ou 5 com Assinatura Cosechas'
    },
    { 
      points: 12, 
      name: 'Premium, Açaí Bowl G ou Trio Açaí',
      subtitle: 'Equivale a 12 compras ou 6 com Assinatura Cosechas'
    },
  ];

  const history = [
    { name: 'Suco Funcional Detox', date: '12 DE JUNHO, 14:30', points: '+1' },
    { name: 'Açaí Bowl M', date: '08 DE JUNHO, 10:15', points: '+1' },
    { name: 'Vitamina Morango', date: '01 DE JUNHO, 17:45', points: '+1' },
  ];

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen pb-40">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bd002a]" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
          <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight">Clube Cosechas</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <X className="text-[#5d3f3e] w-6 h-6" />
        </button>
      </header>

      <main className="mt-20 px-4 max-w-2xl mx-auto space-y-6">
        {/* Simulator Toggle (Preview Only) */}
        <div className="flex justify-end gap-2 px-1">
          <button 
            onClick={handleToggleAuth}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Simular: {isAuthenticated ? 'Sair' : 'Entrar'}
          </button>
          {isAuthenticated && (
            <button 
              onClick={() => {
                if (userPoints < 5) setUserPoints(5);
                else if (userPoints < 7) setUserPoints(7);
                else if (userPoints < 10) setUserPoints(10);
                else if (userPoints < 12) setUserPoints(12);
                else if (userPoints < 14) setUserPoints(14);
                else setUserPoints(0);
              }}
              className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
            >
              Pontos: {userPoints}
            </button>
          )}
        </div>
        {/* Banner Hero */}
        <section className="relative overflow-hidden bg-[#bd002a] rounded-2xl p-8 flex flex-col justify-center min-h-[160px] shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 -mr-12 -mt-12 bg-[#e8173a] rounded-full opacity-20 blur-3xl"></div>
          <div className="relative z-10">
            <h1 className="font-display font-extrabold text-2xl text-white leading-tight mb-2">
              Aqui a gente valoriza sua visita.
            </h1>
            <p className="font-body font-medium text-sm text-white/90">
              Cada compra vira ponto. Cada ponto vira recompensa.
            </p>
          </div>
        </section>

        {/* Progress Section */}
        <section className="bg-white rounded-lg p-6 shadow-sm border border-[#e5e2e1]/30">
          <h3 className="font-display font-bold text-sm mb-4 leading-tight">
            Próximo prêmio: {rewards.find(r => r.points > userPoints)?.name || rewards[rewards.length - 1].name}
          </h3>
          <div className="relative pt-8 pb-4">
            {/* Progress Line Background */}
            <div className="absolute top-10 left-0 w-full h-2 bg-[#f0eded] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#e8173a] transition-all duration-1000" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            {/* Markers */}
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 ${userPoints >= 0 ? 'bg-[#bd002a]' : 'bg-[#eae7e7]'} border-[#bd002a] mb-1 relative z-10`}></div>
                <span className="text-[10px] font-bold">0</span>
              </div>
              
              <div className="flex flex-col items-center absolute" style={{ left: '58.3%', transform: 'translateX(-50%)' }}>
                <div className={`w-6 h-6 flex items-center justify-center rounded-full ${userPoints >= 7 ? 'bg-[#e8173a] text-white' : 'bg-[#eae7e7] text-[#5d3f3e]'} mb-1 relative z-10 shadow-sm transition-colors`}>
                  <CupSoda className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold">7pts</span>
              </div>

              <div className="flex flex-col items-center absolute" style={{ left: '83.3%', transform: 'translateX(-50%)' }}>
                <div className={`w-6 h-6 flex items-center justify-center rounded-full ${userPoints >= 10 ? 'bg-[#e8173a] text-white' : 'bg-[#eae7e7] text-[#5d3f3e]'} mb-1 relative z-10 shadow-sm transition-colors`}>
                  <CupSoda className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold">10pts</span>
              </div>

              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full ${userPoints >= 12 ? 'bg-[#e8173a] text-white' : 'bg-[#eae7e7] text-[#5d3f3e]'} mb-1 relative z-10 shadow-sm transition-colors`}>
                  <CupSoda className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold">12pts</span>
              </div>
            </div>

            {/* User Indicator */}
            <div className="absolute top-0 flex flex-col items-center transition-all duration-1000" style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}>
              <div className="bg-gradient-to-br from-[#bd002a] to-[#e8173a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full mb-1 shadow-sm">VOCÊ</div>
              <div className="w-0.5 h-4 bg-[#e8173a]"></div>
            </div>
          </div>

          {/* Balance and Status below progress */}
          <div className="pt-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d3f3e]">SEU SALDO ATUAL</p>
            <div className="mt-1">
              <span className="text-4xl font-display font-extrabold text-[#bd002a]">
                {userPoints} pontos
              </span>
            </div>
            <p className="mt-2 text-xs font-bold text-[#5d3f3e]">
              {userPoints >= 7 ? (
                <span className="text-[#bd002a]">🎉 Prêmio disponível!</span>
              ) : (
                `Faltam ${7 - userPoints} compras para o próximo prêmio`
              )}
            </p>
          </div>
        </section>

        {/* Rewards Table */}
        <section className="overflow-hidden bg-white rounded-lg shadow-sm border border-[#e5e2e1]/30">
          <div className="flex justify-between items-center px-6 py-4 bg-[#f6f3f2] font-display font-bold text-[10px] tracking-widest text-[#5d3f3e] uppercase">
            <span className="w-20">Pontos</span>
            <span className="flex-grow text-left px-2">Prêmio</span>
            <span className="w-24 text-right">Resgatar</span>
          </div>
          <div className="divide-y divide-[#f0eded]">
            {rewards.map((reward) => (
              <div key={reward.points} className="flex items-center px-6 py-8">
                <div className="w-20 shrink-0 flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#FDECEA] flex items-center justify-center shrink-0 border border-[#bd002a]/10">
                    <CupSoda className="w-5 h-5 text-[#bd002a]" />
                  </div>
                  <div>
                    <span className="font-display font-extrabold text-2xl text-[#bd002a]">{reward.points}</span>
                    <span className="text-[10px] font-bold text-[#5d3f3e] block leading-none">pts</span>
                  </div>
                </div>
                <div className="flex-grow px-2">
                  <p className="font-display font-bold text-sm text-[#1c1b1b] mb-1">{reward.name}</p>
                  <p className="font-body text-[10px] text-[#5d3f3e]">{reward.subtitle}</p>
                </div>
                <div className="w-24 shrink-0 text-right">
                  <button 
                    disabled={userPoints < reward.points}
                    onClick={() => setSelectedRewardTier(reward.points as 7 | 10 | 12)}
                    className={`w-full font-display font-bold text-[10px] py-2.5 rounded-full uppercase transition-all shadow-sm ${
                      userPoints >= reward.points 
                        ? 'bg-[#bd002a] text-white active:scale-95 shadow-[#bd002a]/20' 
                        : 'bg-[#f0eded] text-[#5d3f3e] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    Resgatar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-display font-extrabold text-xl text-[#1c1b1b]">Histórico de pontos</h2>
            <button className="text-[#bd002a] font-bold text-sm hover:underline transition-all">Ver mais →</button>
          </div>
          <div className="space-y-3">
            {history.map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#e5e2e1]/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#f0eded] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#5d3f3e]">local_drink</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">{item.name}</p>
                    <p className="text-[10px] text-[#5d3f3e] font-medium uppercase">{item.date}</p>
                  </div>
                </div>
                <span className="font-display font-black text-[#bd002a] text-lg">{item.points}</span>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white rounded-lg p-8 shadow-sm border border-[#e5e2e1]/30 space-y-10 relative overflow-hidden">
          <div className="text-center space-y-1">
            <h2 className="font-display font-black text-2xl text-[#1c1b1b] uppercase tracking-tight">Como funciona?</h2>
            <p className="text-[10px] font-bold text-[#5d3f3e]/60 uppercase tracking-widest">Válido somente para na Unidade Dimension Office Barra</p>
            <div className="w-12 h-1 bg-[#bd002a] mx-auto rounded-full mt-4"></div>
          </div>
          
          <div className="space-y-12">
            {/* Step 01 */}
            <div className="relative">
              <div className="relative z-10 space-y-4">
                <div>
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 01:</h3>
                  <h4 className="font-display font-extrabold text-lg text-[#1c1b1b] leading-tight">Compre na Loja ou Peça no Meu Cosechas</h4>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#e8173a]/10 text-[#bd002a]">
                      <span className="material-symbols-outlined text-lg">point_of_sale</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#1c1b1b]">Compre no caixa</h5>
                      <p className="text-[#5d3f3e] text-xs mt-1 leading-relaxed">Informe seu número de telefone no caixa ao fazer seu pedido e os pontos serão creditados para você</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-1">
                    <div className="flex-1 h-px bg-[#f0eded]"></div>
                    <span className="font-display italic font-black text-[#bd002a]/40 text-sm lowercase px-2">ou</span>
                    <div className="flex-1 h-px bg-[#f0eded]"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#e8173a]/10 text-[#bd002a]">
                      <span className="material-symbols-outlined text-lg">smartphone</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-[#1c1b1b]">Peça no Meu Cosechas</h5>
                      <p className="text-[#5d3f3e] text-xs mt-1 leading-relaxed">Seus pontos são creditados automaticamente no seu perfil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative">
              <div className="relative z-10 space-y-2">
                <div>
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 02:</h3>
                  <h4 className="font-display font-extrabold text-lg text-[#1c1b1b] leading-tight">Acumule e Ganhe</h4>
                </div>
                <div className="flex gap-4 items-start pt-2">
                  <div className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full bg-[#e8173a]/10 text-[#bd002a]">
                    <span className="material-symbols-outlined text-lg">celebration</span>
                  </div>
                  <p className="text-[#5d3f3e] text-sm mt-1 leading-relaxed">1 ponto por compra. Junte para trocar por produtos da nossa loja</p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Advantage Card */}
          <div className="bg-[#E8173A] rounded-2xl p-6 shadow-[0_10px_30px_rgba(232,23,58,0.2)] relative overflow-hidden group mt-8">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                <span className="material-symbols-outlined text-[#E8173A] text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <span className="font-display font-black text-[11px] text-white uppercase tracking-widest">Vantagem para assinantes</span>
            </div>
            <p className="text-white text-xs font-medium mb-5 leading-relaxed">
              Assinantes ganham <span className="font-black font-display text-[#FFF3B0]">2 pontos por compra</span> e chegam mais rápido nos prêmios, além de garantir até <span className="font-black font-display text-[#FFF3B0]">20% de desconto.</span>
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/assinatura')}
                className="bg-white text-[#E8173A] font-bold py-2.5 px-6 rounded-full text-[11px] uppercase tracking-wider active:scale-[0.98] transition-all shadow-md leading-tight w-full max-w-[210px]"
              >
                Conhecer Assinatura Cosechas
              </button>
            </div>
          </div>

          <footer className="pt-4 text-center">
            <div className="flex items-center gap-4 bg-[#f0eded] rounded-xl p-6 border border-[#e5e2e1]/50 mb-8 text-left">
              <Info className="text-[#e8173a] w-5 h-5 shrink-0" />
              <p className="text-[11px] font-medium text-[#5d3f3e] leading-tight">
                Compre pelo menos uma vez a cada 45 dias para manter seus pontos vivos.
              </p>
            </div>
            <p className="text-[9px] font-medium text-[#5d3f3e]/40 uppercase tracking-[0.15em]">Válido somente na Unidade Dimension Office Barra</p>
          </footer>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: CreditCard, label: 'Assinatura', active: false, path: '/assinatura' },
          { icon: Star, label: 'Clube', active: true, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
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
      
      <VitrinePremios tier={selectedRewardTier} onClose={() => setSelectedRewardTier(null)} />
    </div>
  );
}
