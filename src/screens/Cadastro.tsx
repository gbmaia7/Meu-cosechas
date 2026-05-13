import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Mail, Lock, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cadastro() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCadastro = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    // After registration navigate directly to Phone Verification
    navigate('/perfil/verificar-telefone');
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <ChevronLeft className="text-[#5d3f3e] w-6 h-6" />
        </button>
        <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight ml-2">Criar Conta</h1>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-xl mx-auto space-y-8">
        <div className="flex flex-col items-center">
          <h2 className="font-display font-extrabold text-2xl text-center mb-2">Junte-se ao Clube!</h2>
          <p className="text-center text-[#5d3f3e] text-sm mb-8">
            Preencha seus dados para criar sua conta rápida.
          </p>

          <form onSubmit={handleCadastro} className="w-full space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="w-5 h-5 text-[#a8a29e]" />
              </div>
              <input 
                type="text"
                placeholder="Nome completo"
                required
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-[#a8a29e]" />
              </div>
              <input 
                type="email"
                placeholder="E-mail"
                required
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-[#a8a29e]" />
              </div>
              <input 
                type="tel"
                placeholder="WhatsApp"
                required
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-[#a8a29e]" />
              </div>
              <input 
                type="password"
                placeholder="Senha"
                required
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform mt-4"
            >
              Criar e Verificar Telefone
            </button>
          </form>

          <p className="mt-8 text-sm text-[#5d3f3e]">
            Já tem uma conta?{' '}
            <button onClick={() => navigate('/login')} className="font-bold text-[#bd002a]">
              Fazer Login
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
