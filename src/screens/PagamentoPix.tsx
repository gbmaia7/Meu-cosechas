import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function PagamentoPix() {
  const navigate = useNavigate();
  const location = useLocation();
  const { total } = location.state || { total: '0,00' };
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body relative z-0">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#E8173A] hover:bg-zinc-100 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform -ml-2 mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg text-[#1c1b1b]">Pagar com Pix</h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-6 flex flex-col items-center">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-extrabold text-[#1c1b1b]">Total a pagar</h2>
          <p className="text-3xl font-display font-bold text-[#bd002a]">R$ {total}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e5e2e1] flex flex-col items-center w-full space-y-4">
          <p className="text-sm text-[#5d3f3e] text-center font-medium">Scaneie o QR Code abaixo</p>
          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center p-2">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=example_pix_payload`} 
              alt="QR Code Pix" 
              className="w-full h-full mix-blend-multiply"
            />
          </div>
          <p className="text-xs text-[#a8a29e] text-center mt-2">
            O QR Code expira em 15 minutos.
          </p>
        </div>

        <div className="w-full space-y-3">
          <p className="text-sm font-bold text-[#1c1b1b] text-center">Ou copie o código "Pix Copia e Cola"</p>
          <button 
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#f0eded] rounded-xl text-[#1c1b1b] font-bold text-sm hover:bg-[#e5e2e1] transition-colors active:scale-95"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-[#5d3f3e]" />}
            {copied ? 'Código Copiado!' : 'Copiar código Pix'}
          </button>
        </div>

        <button 
          onClick={() => navigate('/validando-pagamento', { state: location.state })}
          className="w-full mt-6 flex items-center justify-center gap-2 py-4 bg-[#bd002a] text-white rounded-full font-display font-bold shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Já realizei o pagamento
        </button>

      </main>
    </div>
  );
}
