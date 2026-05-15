import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Utensils, Star, ShoppingBag, User, CreditCard, UserPlus, Phone, CheckCircle2, AlertCircle, MapPin, Wallet, Heart, LogOut, ChevronRight , Crown, CupSoda} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function PerfilLogado() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, totalItems } = useCart();
  const [isPhoneVerified, setIsPhoneVerified] = useState(() => {
    return localStorage.getItem('isPhoneVerified') === 'true';
  });

  const togglePhoneVerified = () => {
    const newState = !isPhoneVerified;
    setIsPhoneVerified(newState);
    localStorage.setItem('isPhoneVerified', String(newState));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/HomeComSacola');
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen pb-40">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bd002a]" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight">Meu Perfil</h1>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <X className="text-[#5d3f3e] w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 pb-12 px-4 max-w-2xl mx-auto space-y-6">
        {/* Simulator Toggle */}
        <div className="flex justify-end gap-2 px-1">
          <button 
            onClick={togglePhoneVerified}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Simular: {isPhoneVerified ? 'Não Verificado' : 'Verificado'}
          </button>
          <button 
            onClick={() => {
              setIsAuthenticated(false);
              navigate('/perfil/nao-logado');
            }}
            className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
          >
            Simular: Não Logado
          </button>
        </div>

        {/* User Info Header */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e2e1]/50 flex items-start justify-between">
          <div>
            <h2 className="font-display font-extrabold text-xl text-[#1c1b1b] mb-1">Gabriel Maia</h2>
            <p className="text-sm font-medium text-[#5d3f3e]">maiagabrielbusiness@gmail.com</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
            <span className="font-display font-bold text-[#bd002a] text-xl">G</span>
          </div>
        </section>

        {/* Verification Alert / Status */}
        <section className={`rounded-xl p-5 shadow-sm border ${isPhoneVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center ${isPhoneVerified ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              <Phone className={`w-5 h-5 ${isPhoneVerified ? 'text-emerald-600' : 'text-amber-600'}`} />
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-1 justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`font-display font-bold text-sm ${isPhoneVerified ? 'text-emerald-800' : 'text-amber-800'}`}>
                    {localStorage.getItem('savedPhone') || '(21) 99999-9999'}
                  </h3>
                  {isPhoneVerified ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <button 
                  onClick={() => navigate('/perfil/verificar-telefone')} 
                  className={`text-[10px] font-bold uppercase underline ${isPhoneVerified ? 'text-emerald-700' : 'text-amber-700'}`}
                >
                  Alterar
                </button>
              </div>
              <p className={`text-xs ${isPhoneVerified ? 'text-emerald-700/80' : 'text-amber-800/80 mb-3'}`}>
                {isPhoneVerified 
                  ? 'Número de telefone verificado! Com isso você acumula pontos, pode resgatar prêmios e tem acesso a promoções exclusivas no Clube Cosechas!'
                  : 'Sem o telefone verificado, você não poderá realizar pedidos para entrega, nem acumular pontos e resgatar prêmios no Clube Cosechas.'}
              </p>
              
              {!isPhoneVerified && (
                <button 
                  onClick={() => navigate('/perfil/verificar-telefone')}
                  className="bg-amber-500 text-white font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-full hover:bg-amber-600 transition-colors shadow-sm"
                >
                  Verificar agora
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e5e2e1]/50">
          <div className="divide-y divide-[#f0eded]">
            <button 
              onClick={() => navigate('/perfil/enderecos')}
              className="w-full flex items-center justify-between p-5 hover:bg-[#fcf9f8] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#5d3f3e]" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-sm text-[#1c1b1b]">Meus Endereços</p>
                  <p className="text-xs text-[#5d3f3e]">Gerencie seus locais de entrega</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#a8a29e]" />
            </button>

            <button 
              onClick={() => navigate('/gerenciar-cartoes')}
              className="w-full flex items-center justify-between p-5 hover:bg-[#fcf9f8] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                  <Wallet className="w-5 h-5 text-[#5d3f3e]" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-sm text-[#1c1b1b]">Formas de Pagamento</p>
                  <p className="text-xs text-[#5d3f3e]">Cartões salvos e histórico</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#a8a29e]" />
            </button>

            <button 
              onClick={() => navigate('/perfil/favoritos')}
              className="w-full flex items-center justify-between p-5 hover:bg-[#fcf9f8] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                  <Heart className="w-5 h-5 text-[#bd002a]" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold text-sm text-[#1c1b1b]">Favoritos</p>
                  <p className="text-xs text-[#5d3f3e]">Seus produtos preferidos</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#a8a29e]" />
            </button>
          </div>
        </section>

        {/* Logout */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#5d3f3e] hover:text-[#bd002a] font-bold text-sm transition-colors py-2 px-4"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair da conta</span>
          </button>
        </div>

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-[50%] -translate-x-[50%] w-full max-w-md z-50 flex justify-around items-center px-6 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] sm:rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: CupSoda, label: 'Assinatura', active: false, path: isAuthenticated ? '/assinatura/ativa' : '/assinatura' },
          { icon: Crown, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
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
