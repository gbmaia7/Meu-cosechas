import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function ValidandoPagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const [progress, setProgress] = useState(0);

  const modality = location.state?.modality || 'counter';
  const address = location.state?.address;
  const paymentMethod = location.state?.paymentMethod || 'pix';

  useEffect(() => {
    window.scrollTo(0, 0);

    const timer = setTimeout(() => {
      setIsValidating(false);
      setTimeout(() => {
        navigate('/pagamento-confirmado', {
          state: { modality, address, paymentMethod },
        });
      }, 800);
    }, 2800);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 18;
        return next > 92 ? 92 : next;
      });
    }, 120);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [modality, address, paymentMethod, navigate]);

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
