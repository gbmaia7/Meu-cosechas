import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Phone, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function VerificarTelefone() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent'>('idle');
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toE164 = (raw: string) => {
    const digits = raw.replace(/\D/g, '');
    if (digits.startsWith('55') && digits.length >= 12) return `+${digits}`;
    return `+55${digits}`;
  };

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    const e164 = toE164(phone);
    setNormalizedPhone(e164);
    const { error } = await supabase.auth.signInWithOtp({ phone: e164 });
    setLoading(false);
    if (error) {
      setError('Não foi possível enviar o código. Verifique o número.');
      return;
    }
    setStep(2);
  };

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp,
      type: 'sms',
    });
    if (error) {
      setLoading(false);
      setError('Código incorreto ou expirado. Tente novamente.');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ phone_verified: true, phone: normalizedPhone })
        .eq('id', user.id);
    }
    setLoading(false);
    navigate('/HomeComSacola', { replace: true });
  };

  const handleResend = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone }); // already E.164
    if (!error) {
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 3000);
    }
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
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Qual o seu número?</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Ter um telefone verificado é necessário para fazer pedidos com entrega, resgatar prêmios e pontuar no Clube Cosechas. Enviaremos um código para confirmar seu número.
            </p>
            
            <input 
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full text-center text-2xl font-bold bg-white border border-[#e5e2e1] rounded-xl py-4 px-4 focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all mb-8 shadow-sm"
            />

            {error && <p className="text-[#bd002a] text-sm text-center mt-2">{error}</p>}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleSendOtp}
                disabled={phone.length < 10 || loading}
                className={`w-full py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 ${phone.length >= 10 ? 'bg-[#25D366] text-white shadow-[#25D366]/20' : 'bg-[#f0eded] text-[#a8a29e] shadow-none'}`}
              >
                {loading ? 'Enviando...' : 'Enviar via WhatsApp'}
              </button>

              <button
                onClick={handleSendOtp}
                disabled={phone.length < 10 || loading}
                className={`w-full py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 ${phone.length >= 10 ? 'bg-[#bd002a]/10 text-[#bd002a]' : 'bg-[#f0eded] text-[#a8a29e]'}`}
              >
                {loading ? 'Enviando...' : 'Enviar via SMS'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Código de Verificação</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Digite o código de 6 dígitos que acabamos de enviar para {phone}.
            </p>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-white border border-[#e5e2e1] rounded-xl py-4 px-4 focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm mb-8"
              placeholder="000000"
            />

            <button
              onClick={handleVerify}
              disabled={otp.length < 6 || loading}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-60 disabled:scale-100"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
            {error && <p className="text-[#bd002a] text-sm text-center mt-2">{error}</p>}
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
