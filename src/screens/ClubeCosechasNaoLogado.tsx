import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { X, Utensils, Star, ShoppingBag, User, CreditCard, ArrowRight, Store, Smartphone, Info, Award, CupSoda, Crown, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ClubeCosechasNaoLogado() {
  const navigate = useNavigate();
  const { isAuthenticated, totalItems } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const rewards = [
    { 
      points: 7, 
      name: 'Funcional, A Boa de Hoje ou Promoção Seu Cosechas',
      subtitle: 'Equivale a 7 compras'
    },
    { 
      points: 10, 
      name: 'Mix de Frutas, Milkshake, Linha Caribe, Açaí Médio ou Açaí Bowl M',
      subtitle: 'Equivale a 10 compras'
    },
    { 
      points: 12, 
      name: 'Premium, Açaí Bowl G ou Trio Açaí',
      subtitle: 'Equivale a 12 compras'
    },
  ];

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen pb-40">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <Crown className="text-[#bd002a] w-5 h-5" />
          <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight">Clube Cosechas</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <X className="text-[#5d3f3e] w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-2xl mx-auto space-y-6">
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

        {/* Como funciona Section */}
        <section className="bg-white rounded-lg px-6 py-8 sm:p-8 shadow-sm border border-[#e5e2e1]/30 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-black font-display text-[#1c1b1b] uppercase mb-1">Como funciona?</h2>
            <p className="text-[#5d3f3e]/60 font-bold text-[10px] uppercase tracking-widest leading-tight">Válido somente na Unidade Dimension Office Barra</p>
            <div className="w-12 h-1 bg-[#bd002a] mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-10">
            {/* Step 1 */}
            <div className="relative">
              <div className="relative z-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 01:</h3>
                  <h4 className="font-display font-extrabold text-[#1c1b1b] text-lg">Cadastre-se</h4>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#bd002a]" />
                  </div>
                  <p className="text-[#5d3f3e] text-sm pt-0.5 leading-relaxed">Crie sua conta em segundos e comece a pontuar.</p>
                </div>

                <div className="flex justify-center md:justify-start pt-1">
                  <button 
                    onClick={() => navigate('/login')}
                    className="bg-[#bd002a] text-white font-display font-bold py-3 px-8 rounded-full shadow-lg shadow-[#bd002a]/20 text-xs active:scale-95 transition-transform"
                  >
                    Cadastrar Agora
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="relative z-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 02:</h3>
                  <h4 className="font-display font-extrabold text-[#1c1b1b] text-lg">Acumule pontos</h4>
                </div>

                <div className="space-y-5">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5 text-[#bd002a]" />
                    </div>
                    <div className="pt-0.5">
                      <h5 className="font-bold text-[#1c1b1b] text-sm leading-tight mb-1">Compre no Caixa</h5>
                      <p className="text-[#5d3f3e] text-xs leading-relaxed">
                        Informe seu número de telefone no caixa ao fazer o pedido e os pontos serão creditados.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                    <div className="flex-1 h-[1px] bg-[#bd002a]/10"></div>
                    <span className="text-[10px] font-bold italic text-[#bd002a]/30">ou</span>
                    <div className="flex-1 h-[1px] bg-[#bd002a]/10"></div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5 text-[#bd002a]" />
                    </div>
                    <div className="pt-0.5">
                      <h5 className="font-bold text-[#1c1b1b] text-sm leading-tight mb-1">Peça no Meu Cosechas</h5>
                      <p className="text-[#5d3f3e] text-xs leading-relaxed">
                        Seus pontos são creditados automaticamente no seu perfil.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="relative z-10 space-y-5">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-[#bd002a] text-xs uppercase tracking-[0.2em] mb-1">Passo 03:</h3>
                  <h4 className="font-display font-extrabold text-[#1c1b1b] text-lg">Troque por Prêmios</h4>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-[#bd002a]" />
                  </div>
                  <p className="text-[#5d3f3e] text-sm pt-0.5 leading-relaxed">1 ponto por compra. Junte para trocar por produtos da nossa loja.</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Prêmios Section */}
        <section className="mb-16">
          <h2 className="font-display font-bold text-2xl mb-8 flex items-center gap-3 text-[#1c1b1b]">
            <span className="w-8 h-1 bg-[#bd002a] rounded-full"></span>
            Prêmios disponíveis
          </h2>
          
          <div className="overflow-hidden bg-white rounded-lg shadow-[0_20px_40px_-10px_rgba(28,27,27,0.05)] border border-[#e5e2e1]/30">
            <div className="flex justify-between items-center px-6 py-4 bg-[#f6f3f2] font-display font-bold text-[10px] sm:text-xs tracking-widest text-[#5d3f3e] uppercase">
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
                    <p className="font-display font-bold text-sm sm:text-base text-[#1c1b1b] mb-1">{reward.name}</p>
                    <p className="font-body text-[10px] text-[#5d3f3e]">{reward.subtitle}</p>
                  </div>
                  <div className="w-24 shrink-0 text-right">
                    <button className="w-full bg-[#f0eded] text-[#5d3f3e] font-display font-bold text-[10px] py-2.5 rounded-full opacity-50 cursor-not-allowed uppercase" disabled>
                      Resgatar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Info & Action */}
        <footer className="mt-12 space-y-6">
          <div className="flex items-center gap-4 bg-[#f0eded] rounded-xl p-6 border border-[#e5e2e1]/50">
            <Info className="text-[#e8173a] w-6 h-6 shrink-0" />
            <p className="text-sm font-medium text-[#5d3f3e] leading-tight">
              Compre pelo menos uma vez a cada 45 dias para manter seus pontos vivos.
            </p>
          </div>
          
          <div className="flex flex-col items-center w-full">
            <button 
              onClick={() => navigate('/login')}
              className="w-full md:w-max bg-[#be0a45] text-white font-display font-extrabold text-lg py-5 px-16 rounded-full shadow-lg shadow-[#be0a45]/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 tracking-wide uppercase"
            >
              Ativar agora
            </button>
            <p className="mt-4 text-[10px] font-bold text-[#5d3f3e]/40 uppercase tracking-widest leading-none">Acesso Exclusivo para Cadastrados</p>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: Crown, label: 'Clube', active: true, path: '/clube/nao-logado' },
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
    </div>
  );
}
