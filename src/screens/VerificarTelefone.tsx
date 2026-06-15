import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Phone, ShieldCheck } from 'lucide-react';
import { usePhoneInput, CountrySelector } from 'react-international-phone';
import 'react-international-phone/style.css';
import { supabase } from '../lib/supabase';

const phoneDropdownStyle = `
  .react-international-phone-country-selector-dropdown {
    position: fixed !important;
    z-index: 9999 !important;
    max-height: 300px !important;
    overflow-y: auto !important;
    background: white !important;
    border: 1px solid #e5e2e1 !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
  }
`

export default function VerificarTelefone() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<1 | 2>(1);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent'>('idle');
  const rawPhone = location.state?.phone || '';
  const initialE164 = rawPhone && !rawPhone.startsWith('+') ? `+${rawPhone}` : rawPhone;
  const fromCadastro = location.state?.fromCadastro as { nome: string; email: string; senha: string } | undefined;
  const [phoneE164, setPhoneE164] = useState(initialE164);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');
  const [accountExists, setAccountExists] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const sendingRef = useRef(false);
  const resendTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } = usePhoneInput({
    defaultCountry: 'br',
    value: phoneE164,
    disableDialCodeAndPrefix: true,
    onChange: ({ phone }) => setPhoneE164(phone),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const startResendCooldown = () => {
    setResendCooldown(30);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(resendTimerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (sendingRef.current) return;
    sendingRef.current = true;
    setLoading(true);
    setError('');
    setAccountExists(false);
    setNormalizedPhone(phoneE164);

    const { data: alreadyVerified } = await supabase.rpc('phone_is_verified', { p_phone: phoneE164 });
    if (alreadyVerified) {
      setLoading(false);
      sendingRef.current = false;
      setAccountExists(true);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });
    setLoading(false);
    sendingRef.current = false;
    if (error) {
      setError('Não foi possível enviar o código. Verifique o número.');
      return;
    }
    startResendCooldown();
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
      if (fromCadastro) {
        await supabase.auth.updateUser({ password: fromCadastro.senha, email: fromCadastro.email });
        const nomeLetras = fromCadastro.nome.replace(/\s+/g, '').substring(0, 4).toUpperCase();
        const referralCode = `${nomeLetras}${Math.floor(1000 + Math.random() * 9000)}`;
        await supabase.from('profiles').update({
          name: fromCadastro.nome,
          phone: normalizedPhone,
          phone_verified: true,
          email: fromCadastro.email,
          referral_code: referralCode,
        }).eq('id', user.id);
      } else {
        await supabase.from('profiles')
          .update({ phone_verified: true, phone: normalizedPhone })
          .eq('id', user.id);
      }
    }
    setLoading(false);
    navigate('/HomeComSacola', { replace: true });
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || sendingRef.current) return;
    sendingRef.current = true;
    const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
    sendingRef.current = false;
    if (!error) {
      setResendStatus('sent');
      startResendCooldown();
      setTimeout(() => setResendStatus('idle'), 3000);
    }
  };

  const phoneDigits = phoneE164.replace(/\D/g, '');
  const phoneReady = phoneDigits.length >= 10;

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen">
      <style>{phoneDropdownStyle}</style>
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
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">
              {initialE164 ? 'Confirmar número' : 'Qual o seu número?'}
            </h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              {initialE164
                ? 'Enviaremos um código SMS para confirmar seu número.'
                : 'Ter um telefone verificado é necessário para fazer pedidos com entrega, resgatar prêmios e pontuar no Clube Cosechas. Enviaremos um código para confirmar seu número.'}
            </p>

            {initialE164 ? (
              <div style={{
                border: '1px solid #e5e2e1', borderRadius: '12px',
                backgroundColor: 'white', display: 'flex', alignItems: 'center',
                width: '100%', marginBottom: '32px', padding: '16px 20px',
              }}>
                <Phone className="w-5 h-5 text-[#a8a29e] mr-3 flex-shrink-0" />
                <span style={{ fontSize: '18px', fontWeight: 600, color: '#1c1b1b' }}>{phoneE164}</span>
              </div>
            ) : (
              <div style={{
                border: '1px solid #e5e2e1', borderRadius: '12px',
                backgroundColor: 'white', display: 'flex', alignItems: 'center',
                width: '100%', marginBottom: '32px', overflow: 'hidden',
              }}>
                <CountrySelector
                  selectedCountry={country.iso2}
                  onSelect={({ iso2 }) => setCountry(iso2)}
                  countrySelectorStyleProps={{
                    buttonStyle: {
                      border: 'none', backgroundColor: 'white',
                      paddingLeft: '12px', paddingRight: '4px', cursor: 'pointer',
                    }
                  }}
                />
                <span style={{
                  fontSize: '16px', fontWeight: 700, color: '#1c1b1b',
                  paddingLeft: '4px', paddingRight: '10px',
                  borderRight: '1px solid #e5e2e1',
                }}>
                  +{country.dialCode}
                </span>
                <input
                  ref={inputRef}
                  type="tel"
                  value={inputValue}
                  onChange={handlePhoneValueChange}
                  placeholder="(21) 99999-9999"
                  style={{
                    flex: 1, border: 'none', outline: 'none',
                    padding: '16px', fontSize: '18px', backgroundColor: 'white',
                  }}
                />
              </div>
            )}

            {error && <p className="text-[#bd002a] text-sm text-center mt-2">{error}</p>}

            {accountExists && (
              <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-3 mb-4">
                <p className="text-sm text-amber-800 font-medium">Já existe uma conta verificada com este número.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 rounded-full bg-[#bd002a] text-white font-extrabold font-display uppercase tracking-wider text-sm"
                >
                  Fazer Login
                </button>
                <button
                  onClick={() => navigate('/esqueceu-senha')}
                  className="text-xs font-bold text-[#bd002a] uppercase tracking-wider"
                >
                  Esqueceu a senha? Recuperar senha
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={handleSendOtp}
                disabled={!phoneReady || loading}
                className={`w-full py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 ${phoneReady ? 'bg-[#bd002a] text-white shadow-[#bd002a]/20' : 'bg-[#f0eded] text-[#a8a29e] shadow-none'}`}
              >
                {loading ? 'Enviando...' : 'Enviar código por SMS'}
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
              Digite o código de 6 dígitos que acabamos de enviar para {phoneE164}.
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
              disabled={resendCooldown > 0}
              className={`mt-4 text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-not-allowed ${resendStatus === 'sent' ? 'text-emerald-600' : resendCooldown > 0 ? 'text-[#c8c4c3]' : 'text-[#a8a29e]'}`}
            >
              {resendStatus === 'sent' ? 'Código reenviado!' : resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
