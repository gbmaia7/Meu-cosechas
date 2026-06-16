import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ValidandoPagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const [validationError, setValidationError] = useState('');
  const [isHighRiskRejection, setIsHighRiskRejection] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Por favor, aguarde enquanto processamos o seu pedido.');

  const modality = location.state?.modality || 'counter';
  const address = location.state?.address;
  const paymentMethod = location.state?.paymentMethod || 'pix';
  const couponDiscount = location.state?.couponDiscount ?? 0;
  const referrerId = location.state?.referrerId ?? null;
  const orderId = location.state?.orderId;

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!orderId) {
      const timer = setTimeout(() => {
        navigate('/pagamento-confirmado', {
          state: { modality, address, paymentMethod, isReward: location.state?.isFree || false, couponDiscount, referrerId },
        });
      }, 1800);

      return () => clearTimeout(timer);
    }

    let cancelled = false;
    let attempts = 0;

    const pollPayment = async () => {
      attempts += 1;
      const { data, error } = await supabase.functions.invoke('get-mercado-pago-payment', {
        body: { order_id: orderId },
      });

      if (cancelled) return;

      if (error) {
        setValidationError('Nao foi possivel consultar o pagamento. Tente novamente.');
        return;
      }

      if (data?.payment_status === 'paid') {
        setStatusMessage('Pagamento aprovado.');
        navigate('/pagamento-confirmado', {
          state: {
            ...location.state,
            existingOrder: true,
            orderId,
          },
        });
        return;
      }

      if (data?.payment_status === 'failed') {
        if (data?.status_detail === 'cc_rejected_high_risk') {
          setIsHighRiskRejection(true);
          setValidationError('Cartão recusado por análise de risco. Para novos clientes, recomendamos usar o Pix no primeiro pedido — é mais rápido e sem burocracia.');
        } else {
          setValidationError('Pagamento recusado. Verifique os dados do cartão ou escolha outra forma de pagamento.');
        }
        return;
      }

      if (attempts >= 60) {
        setStatusMessage('Pagamento ainda pendente. Aguarde alguns instantes e tente novamente.');
        return;
      }

      setTimeout(pollPayment, 3000);
    };

    pollPayment();

    return () => {
      cancelled = true;
    };
  }, [address, couponDiscount, location.state, modality, navigate, orderId, paymentMethod, referrerId]);

  return (
    <div className="bg-[#fcf9f8] min-h-screen flex flex-col items-center justify-center p-6 text-center z-50">
      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6">
        {validationError ? (
          <AlertCircle className="w-10 h-10 text-[#e8173a]" />
        ) : (
          <Loader2 className="w-10 h-10 text-[#e8173a] animate-spin" />
        )}
      </div>
      <h2 className="font-display text-2xl font-extrabold text-[#1c1b1b] mb-2">
        {location.state?.isFree ? 'Processando Resgate' : 'Validando Pagamento'}
      </h2>
      <p className="text-[#5d3f3e] text-sm">{validationError || statusMessage}</p>
      {validationError && (
        <button
          onClick={() => navigate('/pagamento', { state: { modality, address, couponDiscount, referrerId } })}
          className="mt-6 bg-[#bd002a] text-white rounded-full px-6 py-3 font-display font-bold text-sm active:scale-95 transition-transform"
        >
          {isHighRiskRejection ? 'Pagar com Pix' : 'Escolher outro pagamento'}
        </button>
      )}
    </div>
  );
}
