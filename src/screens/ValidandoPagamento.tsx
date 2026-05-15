import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ValidandoPagamento() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      navigate('/pagamento-confirmado', { state: location.state });
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  return (
    <div className="bg-[#fcf9f8] min-h-screen flex flex-col items-center justify-center p-6 text-center z-50">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
        <Loader2 className="w-10 h-10 text-[#e8173a] animate-spin" />
      </div>
      <h2 className="font-display text-2xl font-extrabold text-[#1c1b1b] mb-2">{location.state?.isFree ? 'Processando Resgate' : 'Validando Pagamento'}</h2>
      <p className="text-[#5d3f3e] text-sm">Por favor, aguarde enquanto processamos o seu pedido.</p>
    </div>
  );
}
