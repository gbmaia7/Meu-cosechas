import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Utensils, Star, ShoppingBag, User, CreditCard, UserPlus, Phone, MapPin, Wallet, Gift } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PerfilNaoLogado() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, totalItems } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleToggleAuth = () => {
    setIsAuthenticated(true);
    navigate('/perfil/logado');
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen pb-40">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bd002a]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight">Perfil</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <X className="text-[#5d3f3e] w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-xl mx-auto space-y-6">
        {/* Simulator Toggle */}
        <div className="flex justify-end gap-2 px-1">
          <button 
            onClick={handleToggleAuth}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Simular: Fazer Login
          </button>
        </div>

        {/* Hero Section */}
        <section className="bg-white rounded-2xl p-8 text-center shadow-lg border border-[#e5e2e1]/50 relative overflow-hidden">
          <div className="w-20 h-20 bg-[#f6f3f2] rounded-full mx-auto flex items-center justify-center mb-6 border-4 border-white shadow-sm relative z-10">
            <User className="w-10 h-10 text-[#a8a29e]" />
          </div>
          
          <h2 className="font-display font-extrabold text-2xl text-[#1c1b1b] mb-2 relative z-10">
            Acesse sua conta
          </h2>
          <p className="text-[#5d3f3e] text-sm mb-8 leading-relaxed relative z-10">
            Faça login para acompanhar pedidos, salvar seus endereços e aproveitar os benefícios do Clube Cosechas.
          </p>

          <div className="space-y-3 relative z-10">
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Fazer Login
            </button>
            <button 
              onClick={() => navigate('/cadastro')}
              className="w-full bg-white text-[#5d3f3e] font-display font-bold py-4 rounded-full border border-[#e5e2e1] active:bg-[#f0eded] transition-colors uppercase tracking-wider text-xs"
            >
              Criar Conta Rápida
            </button>
          </div>
        </section>

        {/* Features preview */}
        <section className="px-2">
          <h3 className="font-display font-bold text-sm text-[#a8a29e] uppercase tracking-widest mb-6 text-center">
            Vantagens de ter uma conta
          </h3>
          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-[#bd002a]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[#1c1b1b] mb-1">Clube de Benefícios</h4>
                <p className="text-xs text-[#5d3f3e] leading-relaxed">
                  Ganhe pontos em todas as compras e troque por produtos grátis.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                <Wallet className="w-6 h-6 text-[#5d3f3e]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[#1c1b1b] mb-1">Checkout Rápido</h4>
                <p className="text-xs text-[#5d3f3e] leading-relaxed">
                  Salve seus cartões para um pagamento seguro e em poucos cliques.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6 text-[#5d3f3e]" />
              </div>
              <div>
                <h4 className="font-display font-bold text-[#1c1b1b] mb-1">Seus Endereços</h4>
                <p className="text-xs text-[#5d3f3e] leading-relaxed">
                  Não perca tempo digitando onde você quer receber seus pedidos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-[50%] -translate-x-[50%] w-full max-w-md z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] sm:rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: CreditCard, label: 'Assinatura', active: false, path: isAuthenticated ? '/assinatura/ativa' : '/assinatura' },
          { icon: Star, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
          { icon: ShoppingBag, label: 'Sacola', active: false, badge: totalItems, path: '/sacola' },
          { icon: User, label: 'Perfil', active: true, path: isAuthenticated ? '/perfil/logado' : '/perfil/nao-logado' },
        ].map((item: any) => (
          <Link 
            key={item.label} 
            to={item.path} 
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-4 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge ? (item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E8173A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )) : null}
            </div>
            <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
