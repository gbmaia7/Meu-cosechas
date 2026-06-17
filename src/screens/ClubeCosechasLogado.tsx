import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ArrowLeft, X, Home, Utensils, Star, ShoppingBag, User, CreditCard, PartyPopper, Info, CupSoda, Crown, UserPlus } from 'lucide-react';
import VitrinePremios from '../components/VitrinePremios';

export default function ClubeCosechasLogado() {
  const navigate = useNavigate();
  const { userPoints, isAuthenticated, totalItems } = useCart();
  const [selectedRewardTier, setSelectedRewardTier] = useState<7 | 10 | 12 | null>(null);
  const [ledgerHistory, setLedgerHistory] = useState<{
    id: string;
    points: number;
    reason: string;
    description: string | null;
    created_at: string;
    order_id: string | null;
  }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setHistoryLoading(false); return; }

      const { data, error } = await supabase
        .from('loyalty_points_ledger')
        .select('id, points, reason, description, created_at, order_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data) setLedgerHistory(data);
      setHistoryLoading(false);
    };
    loadHistory();
  }, []);

  const formatReason = (reason: string) => {
    const map: Record<string, string> = {
      purchase: 'Compra realizada',
      double_points: 'Pontos em dobro (2x)',
      reward_redeem: 'Resgate de prêmio',
      referral_bonus: 'Indicação de amigo',
      expiration: 'Pontos expirados',
      manual: 'Ajuste manual',
      counter_purchase: 'Compra no balcão',
      counter_purchase_cancelled: 'Cancelamento — compra no balcão',
    };
    return map[reason] || reason;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).toUpperCase();
  };

  const progressPercentage = Math.min((userPoints / 12) * 100, 100);

  const rewards = [
    { 
      points: 7, 
      title: 'Funcionais e promoções',
      name: 'Funcional, A Boa de Hoje ou Promoção Seu Cosechas',
      subtitle: 'Equivale a 7 compras',
      description: 'Escolha entre funcionais, Boa de Hoje ou Promoção Seu Cosechas.'
    },
    { 
      points: 10, 
      title: 'Mix, Milkshake e Açaí médio',
      name: 'Mix de Frutas, Milkshake, Linha Caribe, Açaí Médio ou Açaí Bowl M',
      subtitle: 'Equivale a 10 compras',
      description: 'Inclui Mix de Frutas, Milkshake, Linha Caribe, Açaí Médio ou Açaí Bowl M.'
    },
    { 
      points: 12, 
      title: 'Premium e Açaís grandes',
      name: 'Premium, Açaí Bowl G ou Trio Açaí',
      subtitle: 'Equivale a 12 compras',
      description: 'Resgate produtos Premium, Açaí Bowl G ou Trio Açaí.'
    },
  ];
  const availableRewards = rewards.filter((reward) => userPoints >= reward.points);
  const bestAvailableReward = availableRewards[availableRewards.length - 1] || null;
  const nextReward = rewards.find((reward) => reward.points > userPoints) || null;
  const currentTarget = nextReward || bestAvailableReward || rewards[0];
  const pointsToNextReward = nextReward ? nextReward.points - userPoints : 0;

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen pb-40">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <Crown className="text-[#bd002a] w-5 h-5 pointer-events-none" />
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
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d3f3e]">Seu progresso</p>
              <h3 className="font-display font-extrabold text-lg leading-tight text-[#1c1b1b]">
                {bestAvailableReward ? `Você pode resgatar: ${bestAvailableReward.title}` : `Próximo prêmio: ${currentTarget.title}`}
              </h3>
            </div>
            {bestAvailableReward && (
              <button
                onClick={() => setSelectedRewardTier(bestAvailableReward.points as 7 | 10 | 12)}
                className="shrink-0 bg-[#bd002a] text-white font-display font-bold text-[10px] px-4 py-2 rounded-full uppercase active:scale-95 transition-transform"
              >
                Resgatar
              </button>
            )}
          </div>
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
            <p className="mt-2 text-xs font-bold text-[#5d3f3e] leading-relaxed">
              {nextReward ? (
                `Faltam ${pointsToNextReward} pontos para ${nextReward.title}`
              ) : (
                <span className="text-[#bd002a]">Você já alcançou o maior prêmio disponível.</span>
              )}
            </p>
            {bestAvailableReward && (
              <p className="mt-1 text-[11px] font-bold text-[#bd002a]">
                Melhor resgate disponível: {bestAvailableReward.title}
              </p>
            )}
          </div>
        </section>

        {/* Rewards Cards */}
        <section className="space-y-3">
          <div className="flex items-end justify-between px-1">
            <h2 className="font-display font-extrabold text-xl text-[#1c1b1b]">
              Prêmios do Clube
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#5d3f3e]/60">
              1 compra = 1 ponto
            </span>
          </div>

          {rewards.map((reward) => {
            const canRedeem = userPoints >= reward.points;
            const isBestAvailable = bestAvailableReward?.points === reward.points;

            return (
              <article
                key={reward.points}
                className={`bg-white rounded-lg p-5 border shadow-sm transition-colors ${
                  isBestAvailable
                    ? 'border-[#bd002a] ring-2 ring-[#bd002a]/10'
                    : 'border-[#e5e2e1]/30'
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${
                    canRedeem ? 'bg-[#FDECEA] text-[#bd002a]' : 'bg-[#f0eded] text-[#5d3f3e]'
                  }`}>
                    <span className="font-display font-black text-xl leading-none">{reward.points}</span>
                    <span className="text-[9px] font-bold uppercase leading-none">pts</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display font-extrabold text-base text-[#1c1b1b] leading-tight">
                          {reward.title}
                        </h3>
                        <p className="text-[10px] font-bold text-[#bd002a] uppercase tracking-wider mt-1">
                          {reward.subtitle}
                        </p>
                      </div>
                      {isBestAvailable && (
                        <span className="shrink-0 bg-[#bd002a]/10 text-[#bd002a] text-[9px] font-black px-2 py-1 rounded-full uppercase">
                          Disponível
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-xs text-[#5d3f3e] leading-relaxed">
                      {reward.description}
                    </p>

                    <button
                      disabled={!canRedeem}
                      onClick={() => setSelectedRewardTier(reward.points as 7 | 10 | 12)}
                      className={`mt-4 w-full font-display font-bold text-[11px] py-3 rounded-full uppercase transition-all ${
                        canRedeem
                          ? 'bg-[#bd002a] text-white active:scale-95 shadow-sm shadow-[#bd002a]/20'
                          : 'bg-[#f0eded] text-[#5d3f3e] opacity-60 cursor-not-allowed'
                      }`}
                    >
                      {canRedeem ? 'Resgatar prêmio' : `Faltam ${reward.points - userPoints} pontos`}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* History */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-display font-extrabold text-xl text-[#1c1b1b]">
              Histórico de pontos
            </h2>
          </div>

          {historyLoading ? (
            <div className="bg-white rounded-xl p-6 text-center text-sm text-[#a8a29e]">
              Carregando histórico...
            </div>
          ) : ledgerHistory.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center text-sm text-[#a8a29e]">
              Nenhuma movimentação ainda. Faça seu primeiro pedido!
            </div>
          ) : (
            <div className="space-y-3">
              {ledgerHistory.map((item) => (
                <div key={item.id}
                     className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-[#e5e2e1]/30">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.points > 0 ? 'bg-emerald-50' : 'bg-red-50'
                    }`}>
                      <CupSoda className={`w-5 h-5 ${
                        item.points > 0 ? 'text-emerald-600' : 'text-red-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">
                        {item.description ? item.description : formatReason(item.reason)}
                      </p>
                      <p className="text-[10px] text-[#5d3f3e] font-medium uppercase">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>
                  <span className={`font-display font-black text-lg ${
                    item.points > 0 ? 'text-emerald-600' : 'text-[#bd002a]'
                  }`}>
                    {item.points > 0 ? '+' : ''}{item.points}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="bg-white rounded-lg px-6 py-8 sm:p-8 shadow-sm border border-[#e5e2e1]/30 space-y-12 relative overflow-hidden">
          <div className="text-center space-y-3">
            <h2 className="font-display font-black text-2xl text-[#1c1b1b] uppercase tracking-tight">Como funciona?</h2>
            <p className="text-[10px] font-bold text-[#5d3f3e]/60 uppercase tracking-widest leading-relaxed">Válido somente para na Unidade Dimension Office Barra</p>
            <div className="w-12 h-1 bg-[#bd002a] mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-10">
            {/* Step 01 */}
            <div className="relative">
              <div className="relative z-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 01:</h3>
                  <h4 className="font-display font-extrabold text-lg text-[#1c1b1b] leading-tight">Compre na Loja ou Peça no Meu Cosechas</h4>
                </div>
                <div className="grid grid-cols-1 gap-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#e8173a]/10 text-[#bd002a]">
                      <span className="material-symbols-outlined text-lg">point_of_sale</span>
                    </div>
                    <div className="pt-0.5">
                      <h5 className="font-bold text-sm text-[#1c1b1b] leading-tight">Compre no caixa</h5>
                      <p className="text-[#5d3f3e] text-xs mt-1 leading-relaxed">Informe seu número de telefone no caixa ao fazer seu pedido e os pontos serão creditados para você</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-px bg-[#f0eded]"></div>
                    <span className="font-display italic font-black text-[#bd002a]/40 text-sm lowercase px-2">ou</span>
                    <div className="flex-1 h-px bg-[#f0eded]"></div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#e8173a]/10 text-[#bd002a]">
                      <span className="material-symbols-outlined text-lg">smartphone</span>
                    </div>
                    <div className="pt-0.5">
                      <h5 className="font-bold text-sm text-[#1c1b1b] leading-tight">Peça no Meu Cosechas</h5>
                      <p className="text-[#5d3f3e] text-xs mt-1 leading-relaxed">Seus pontos são creditados automaticamente no seu perfil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="relative">
              <div className="relative z-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 02:</h3>
                  <h4 className="font-display font-extrabold text-lg text-[#1c1b1b] leading-tight">Acumule e Ganhe</h4>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-[#e8173a]/10 text-[#bd002a]">
                    <span className="material-symbols-outlined text-lg">celebration</span>
                  </div>
                  <p className="text-[#5d3f3e] text-sm pt-0.5 leading-relaxed">1 ponto por compra. Junte para trocar por produtos da nossa loja</p>
                </div>
              </div>
            </div>
          </div>

          <footer className="pt-2 text-center">
            <div className="flex items-start gap-4 bg-[#f0eded] rounded-xl p-5 border border-[#e5e2e1]/50 mb-6 text-left">
              <Info className="text-[#e8173a] w-5 h-5 shrink-0" />
              <p className="text-[11px] font-medium text-[#5d3f3e] leading-relaxed">
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
          { icon: Crown, label: 'Clube', active: true, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
          { icon: UserPlus, label: 'Indique', active: false, path: isAuthenticated ? '/indique-ganhe/logado' : '/indique-ganhe' },
          { icon: ShoppingBag, label: 'Sacola', active: false, badge: totalItems, path: '/sacola' },
          { icon: User, label: 'Perfil', active: false, path: isAuthenticated ? '/perfil/logado' : '/perfil/nao-logado' },
        ].map(item => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-2 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
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
