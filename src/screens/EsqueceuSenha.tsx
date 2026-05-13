import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail } from 'lucide-react';

export default function EsqueceuSenha() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'sent'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sent');
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
        <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight ml-2">Recuperar Senha</h1>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-xl mx-auto space-y-8">
        {status === 'idle' ? (
          <div className="flex flex-col items-center">
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Esqueceu sua senha?</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Digite seu e-mail ou WhatsApp cadastrado e enviaremos as instruções para redefinir sua senha.
            </p>

            <form onSubmit={handleReset} className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#a8a29e]" />
                </div>
                <input 
                  type="text"
                  placeholder="E-mail ou WhatsApp"
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform mt-4"
              >
                Enviar link de recuperação
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl mb-2">Enviado!</h2>
            <p className="text-[#5d3f3e] text-sm mb-8">
              Se o e-mail ou número fornecido estiver associado a uma conta, você receberá instruções em breve.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Voltar ao Login
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
