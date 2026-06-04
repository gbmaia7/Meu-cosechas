import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, ChevronLeft, Copy, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PagamentoPix() {
  const navigate = useNavigate();
  const location = useLocation();
  const payment = location.state?.payment;
  const orderId = location.state?.orderId || payment?.order_id;
  const total = location.state?.total || '0,00';
  const qrCode = payment?.qr_code;
  const qrCodeBase64 = payment?.qr_code_base64;
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Aguardando confirmacao do pagamento.');
  const [statusError, setStatusError] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkWarning, setCheckWarning] = useState('');

  const qrImage = useMemo(() => {
    if (qrCodeBase64) return `data:image/png;base64,${qrCodeBase64}`;
    if (qrCode) return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrCode)}`;
    return '';
  }, [qrCode, qrCodeBase64]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!orderId) {
      setStatusError('Pedido nao encontrado para validacao do Pix.');
      return;
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
        setStatusMessage('Nao foi possivel consultar o pagamento agora.');
        return;
      }

      if (data?.payment_status === 'paid') {
        setStatusMessage('Pagamento aprovado.');
        navigate('/pagamento-confirmado', {
          state: {
            ...location.state,
            existingOrder: true,
            orderId,
            paymentMethod: 'pix',
          },
        });
        return;
      }

      if (data?.payment_status === 'failed') {
        setStatusError('Pagamento recusado ou cancelado. Tente novamente.');
        return;
      }

      if (attempts >= 60) {
        setStatusMessage('Pagamento ainda pendente. Voce pode voltar a esta tela para consultar novamente.');
        return;
      }

      setTimeout(pollPayment, 5000);
    };

    const timer = setTimeout(pollPayment, 3000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [location.state, navigate, orderId]);

  const handleCheckPayment = async () => {
    if (isChecking || !orderId) return;
    setIsChecking(true);
    setCheckWarning('');

    const { data, error } = await supabase.functions.invoke('get-mercado-pago-payment', {
      body: { order_id: orderId },
    });

    if (error) {
      setCheckWarning('Nao foi possivel verificar agora. Tente novamente em alguns segundos.');
      setIsChecking(false);
      return;
    }

    if (data?.payment_status === 'paid') {
      navigate('/pagamento-confirmado', {
        state: { ...location.state, existingOrder: true, orderId, paymentMethod: 'pix' },
      });
      return;
    }

    if (data?.payment_status === 'failed') {
      setStatusError('Pagamento recusado ou cancelado. Tente novamente.');
      setIsChecking(false);
      return;
    }

    setCheckWarning('Pagamento ainda nao identificado. Aguarde alguns segundos e tente novamente.');
    setIsChecking(false);
  };

  const handleCopy = async () => {
    if (!qrCode) return;
    await navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body relative z-0">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16">
        <button onClick={() => navigate(-1)} className="text-[#E8173A] p-2 rounded-full active:scale-95 transition-transform -ml-2 mr-2">
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
          <p className="text-sm text-[#5d3f3e] text-center font-medium">Escaneie o QR Code abaixo</p>
          <div className="w-56 h-56 bg-[#f6f3f2] rounded-lg flex items-center justify-center p-3">
            {qrImage ? (
              <img src={qrImage} alt="QR Code Pix" className="w-full h-full object-contain mix-blend-multiply" />
            ) : (
              <AlertCircle className="w-10 h-10 text-[#bd002a]" />
            )}
          </div>
          <p className="text-xs text-[#a8a29e] text-center mt-2">
            O Pix é regulamentado pelo Banco Central do Brasil e tem a mesma segurança de uma transferência bancária.
          </p>
        </div>

        <div className="w-full space-y-3">
          <p className="text-sm font-bold text-[#1c1b1b] text-center">Ou copie o codigo Pix copia-e-cola</p>
          <button
            onClick={handleCopy}
            disabled={!qrCode}
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#f0eded] rounded-xl text-[#1c1b1b] font-bold text-sm active:scale-95 transition-transform disabled:opacity-60"
          >
            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5 text-[#5d3f3e]" />}
            {copied ? 'Codigo copiado' : 'Copiar codigo Pix'}
          </button>
        </div>

        <div className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 ${statusError ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-blue-50 border border-blue-200 text-blue-800'}`}>
          {statusError ? <AlertCircle className="w-5 h-5 shrink-0" /> : <Loader2 className="w-5 h-5 shrink-0 animate-spin" />}
          <p className="text-xs font-medium leading-relaxed">{statusError || statusMessage}</p>
        </div>

        <button
          onClick={handleCheckPayment}
          disabled={isChecking}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#bd002a] text-white rounded-full font-display font-bold shadow-lg shadow-[#bd002a]/20 active:scale-95 transition-transform disabled:opacity-70"
        >
          {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          {isChecking ? 'Verificando...' : 'Ja realizei o pagamento'}
        </button>

        {checkWarning && (
          <div className="w-full rounded-xl px-4 py-3 flex items-center gap-3 bg-amber-50 border border-amber-200">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600" />
            <p className="text-xs font-medium text-amber-800 leading-relaxed">{checkWarning}</p>
          </div>
        )}
      </main>
    </div>
  );
}
