import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Phone, ShieldCheck } from 'lucide-react';

export default function VerificarTelefone() {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleResend = () => {
    setResendStatus('sent');
    setTimeout(() => setResendStatus('idle'), 3000);
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex items-center px-4 py-4">
        <button 
          onClick={() => step === 2 ? setStep(1) : navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <ChevronLeft className="text-[#5d3f3e] w-6 h-6" />
        </button>
        <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight ml-2">Verificação</h1>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-xl mx-auto space-y-8">
        {step === 1 ? (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <Phone className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Qual o seu WhatsApp?</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Enviaremos um código via SMS ou WhatsApp para verificar seu número.
            </p>
            
            <input 
              type="tel"
              placeholder="(00) 00000-0000"
              className="w-full text-center text-2xl font-bold bg-white border border-[#e5e2e1] rounded-xl py-4 px-4 focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all mb-8 shadow-sm"
            />

            <button 
              onClick={() => setStep(2)}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Enviar Código
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Código de Verificação</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Digite o código de 4 dígitos que acabamos de enviar para você.
            </p>

            <div className="flex gap-4 justify-center mb-8">
              {[1, 2, 3, 4].map((i) => (
                <input 
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-14 h-16 text-center text-2xl font-bold bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
                />
              ))}
            </div>

            <button 
              onClick={() => navigate('/perfil/logado')}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Verificar
            </button>
            <button 
              onClick={handleResend} 
              className={`mt-4 text-xs font-bold uppercase tracking-wider transition-colors ${resendStatus === 'sent' ? 'text-emerald-600' : 'text-[#a8a29e]'}`}
            >
              {resendStatus === 'sent' ? 'Código reenviado!' : 'Reenviar código'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
