import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MessageCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePhoneInput, CountrySelector } from 'react-international-phone';
import 'react-international-phone/style.css';

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
`;

export default function EsqueceuSenha() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'sms' | 'otp' | 'newpass' | 'done'>('sms');
  const [phoneE164, setPhoneE164] = useState('');
  const [otp, setOtp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent'>('idle');
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

  const phoneDigits = phoneE164.replace(/\D/g, '');
  const phoneReady = phoneDigits.length >= 10;

  const startResendCooldown = () => {
    setResendCooldown(30);
    resendTimerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(resendTimerRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sendingRef.current) return;
    sendingRef.current = true;
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneE164 });
    setLoading(false);
    sendingRef.current = false;
    if (error) {
      setError('Não foi possível enviar o código. Verifique o número.');
      return;
    }
    startResendCooldown();
    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneE164,
      token: otp,
      type: 'sms',
    });
    setLoading(false);
    if (error) {
      setError('Código incorreto ou expirado. Tente novamente.');
      return;
    }
    setStep('newpass');
  };

  const handleNewPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setError('As senhas não coincidem.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error) {
      setError('Não foi possível redefinir a senha. Tente novamente.');
      return;
    }
    setStep('done');
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen">
      <style>{phoneDropdownStyle}</style>
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

        {/* SMS */}
        {step === 'sms' && (
          <div className="flex flex-col items-center">
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Qual o seu número?</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Enviaremos um código SMS para o número cadastrado na sua conta.
            </p>

            <form onSubmit={handleSendSms} className="w-full space-y-4">
              <div style={{
                border: '1px solid #e5e2e1', borderRadius: '12px',
                backgroundColor: 'white', display: 'flex', alignItems: 'center',
                overflow: 'hidden',
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

              {error && <p className="text-[#bd002a] text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={!phoneReady || loading}
                className={`w-full py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-md hover:scale-[1.02] active:scale-95 transition-transform ${phoneReady ? 'bg-[#bd002a] text-white shadow-[#bd002a]/20' : 'bg-[#f0eded] text-[#a8a29e] shadow-none'}`}
              >
                {loading ? 'Enviando...' : 'Enviar código SMS'}
              </button>
            </form>
          </div>
        )}

        {/* OTP */}
        {step === 'otp' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Digite o código</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Enviamos um código de 6 dígitos para {phoneE164}.
            </p>

            <form onSubmit={handleVerifyOtp} className="w-full space-y-4">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-white border border-[#e5e2e1] rounded-xl py-4 px-4 focus:outline-none focus:border-[#bd002a] shadow-sm"
              />

              {error && <p className="text-[#bd002a] text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={otp.length < 6 || loading}
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-70"
              >
                {loading ? 'Verificando...' : 'Verificar código'}
              </button>
            </form>

            <button
              type="button"
              disabled={resendCooldown > 0}
              onClick={async () => {
                if (resendCooldown > 0 || sendingRef.current) return;
                sendingRef.current = true;
                await supabase.auth.signInWithOtp({ phone: phoneE164 });
                sendingRef.current = false;
                setResendStatus('sent');
                startResendCooldown();
                setTimeout(() => setResendStatus('idle'), 3000);
              }}
              className={`mt-4 text-xs font-bold uppercase tracking-wider disabled:cursor-not-allowed ${resendStatus === 'sent' ? 'text-emerald-600' : resendCooldown > 0 ? 'text-[#c8c4c3]' : 'text-[#a8a29e]'}`}
            >
              {resendStatus === 'sent' ? 'Código reenviado!' : resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('sms'); setError(''); setOtp(''); }}
              className="mt-2 text-sm text-[#5d3f3e] font-semibold py-1"
            >
              ← Voltar
            </button>
          </div>
        )}

        {/* Nova senha */}
        {step === 'newpass' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#fde8ed] rounded-full flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-[#bd002a]" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Crie uma nova senha</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Escolha uma senha segura para sua conta.
            </p>

            <form onSubmit={handleNewPass} className="w-full space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] transition-all shadow-sm"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] transition-all shadow-sm"
                />
              </div>

              {error && <p className="text-[#bd002a] text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-70"
              >
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </div>
        )}

        {/* Concluído */}
        {step === 'done' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl mb-2">Senha redefinida!</h2>
            <p className="text-[#5d3f3e] text-sm mb-8">
              Sua senha foi atualizada com sucesso. Faça login com a nova senha.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Fazer Login
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
