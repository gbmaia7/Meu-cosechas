import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Phone, MessageCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PhoneInput } from 'react-international-phone';
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
  const [step, setStep] = useState<'choose' | 'sms' | 'email' | 'otp' | 'newpass' | 'sent'>('choose');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sentVia, setSentVia] = useState<'sms' | 'email'>('sms');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sent'>('idle');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSendSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithOtp({ phone });

    setLoading(false);

    if (error) {
      setError('Não foi possível enviar o código. Verifique o número.');
      return;
    }

    setStep('otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.verifyOtp({
      phone,
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

    setSentVia('sms');
    setStep('sent');
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/redefinir-senha`,
    });

    setLoading(false);

    if (error) {
      setError('Não foi possível enviar o e-mail. Verifique o endereço.');
      return;
    }

    setSentVia('email');
    setStep('sent');
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

        {/* ── CHOOSE ── */}
        {step === 'choose' && (
          <div className="flex flex-col items-center">
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Como prefere recuperar?</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Escolha a forma de receber as instruções de recuperação.
            </p>

            <div className="w-full space-y-4">
              <button
                onClick={() => setStep('sms')}
                className="w-full bg-white border border-[#e5e2e1] rounded-2xl p-5 flex items-center gap-4 cursor-pointer active:bg-[#f8f4f3] transition-colors"
              >
                <div className="w-12 h-12 bg-[#fde8ed] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-[#bd002a]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-display font-extrabold text-base">Via SMS</p>
                  <p className="text-[#5d3f3e] text-sm">Receba um código no seu celular</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-[#a8a29e] rotate-180 shrink-0" />
              </button>

              <button
                onClick={() => setStep('email')}
                className="w-full bg-white border border-[#e5e2e1] rounded-2xl p-5 flex items-center gap-4 cursor-pointer active:bg-[#f8f4f3] transition-colors"
              >
                <div className="w-12 h-12 bg-[#fde8ed] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-[#bd002a]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-display font-extrabold text-base">Via E-mail</p>
                  <p className="text-[#5d3f3e] text-sm">Receba um link no seu e-mail verificado</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-[#a8a29e] rotate-180 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ── SMS ── */}
        {step === 'sms' && (
          <div className="flex flex-col items-center">
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Recuperar via SMS</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Digite o número cadastrado na sua conta.
            </p>

            <style>{phoneDropdownStyle}</style>

            <form onSubmit={handleSendSms} className="w-full space-y-4">
              <div className="bg-white border border-[#e5e2e1] rounded-xl overflow-hidden shadow-sm flex items-center focus-within:border-[#bd002a] focus-within:ring-1 focus-within:ring-[#bd002a] transition-all">
                <PhoneInput
                  defaultCountry="br"
                  value={phone}
                  onChange={(value) => setPhone(value || '')}
                  inputStyle={{
                    width: '100%',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    fontSize: '16px',
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'white',
                  }}
                  countrySelectorStyleProps={{
                    buttonStyle: {
                      paddingLeft: '12px',
                      paddingRight: '8px',
                      border: 'none',
                      borderRight: '1px solid #e5e2e1',
                      backgroundColor: 'white',
                      cursor: 'pointer',
                    },
                  }}
                />
              </div>

              {error && <p className="text-[#bd002a] text-sm text-center mt-2">{error}</p>}

              <button
                type="submit"
                disabled={phone.length < 8 || loading}
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                {loading ? 'Enviando...' : 'Enviar código SMS'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('choose'); setError(''); }}
                className="w-full text-[#5d3f3e] text-sm font-semibold py-2"
              >
                Voltar
              </button>
            </form>
          </div>
        )}

        {/* ── OTP ── */}
        {step === 'otp' && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Digite o código SMS</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Enviamos um código de 6 dígitos para {phone}
            </p>

            <form onSubmit={handleVerifyOtp} className="w-full">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center text-3xl font-bold tracking-[0.5em] bg-white border border-[#e5e2e1] rounded-xl py-4 px-4 focus:outline-none focus:border-[#bd002a] shadow-sm mb-4"
              />

              {error && <p className="text-[#bd002a] text-sm text-center mb-2">{error}</p>}

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
              onClick={async () => {
                await supabase.auth.signInWithOtp({ phone });
                setResendStatus('sent');
                setTimeout(() => setResendStatus('idle'), 3000);
              }}
              className="mt-4 text-[#5d3f3e] text-sm font-semibold py-2"
            >
              {resendStatus === 'sent' ? 'Código reenviado!' : 'Reenviar código'}
            </button>

            <button
              type="button"
              onClick={() => { setStep('sms'); setError(''); setOtp(''); }}
              className="text-[#5d3f3e] text-sm font-semibold py-1"
            >
              Voltar
            </button>
          </div>
        )}

        {/* ── NEWPASS ── */}
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
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#a8a29e]" />
                </div>
                <input
                  type="password"
                  placeholder="Nova senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-[#a8a29e]" />
                </div>
                <input
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
                />
              </div>

              {error && <p className="text-[#bd002a] text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-70 mt-4"
              >
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </div>
        )}

        {/* ── EMAIL ── */}
        {step === 'email' && (
          <div className="flex flex-col items-center">
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">Recuperar via E-mail</h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Digite o e-mail verificado cadastrado na sua conta.
            </p>

            <form onSubmit={handleSendEmail} className="w-full space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-[#a8a29e]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
                />
              </div>

              {error && <p className="text-[#bd002a] text-sm text-center mt-2">{error}</p>}

              <button
                type="submit"
                disabled={!email || loading}
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
              >
                {loading ? 'Enviando...' : 'Enviar link de recuperação'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('choose'); setError(''); }}
                className="w-full text-[#5d3f3e] text-sm font-semibold py-2"
              >
                Voltar
              </button>
            </form>
          </div>
        )}

        {/* ── SENT ── */}
        {step === 'sent' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              {sentVia === 'email'
                ? <Mail className="w-10 h-10 text-emerald-600" />
                : <MessageCircle className="w-10 h-10 text-emerald-600" />
              }
            </div>
            <h2 className="font-display font-extrabold text-2xl mb-2">Enviado!</h2>
            <p className="text-[#5d3f3e] text-sm mb-8">
              {sentVia === 'email'
                ? 'Se o e-mail fornecido estiver associado a uma conta verificada, você receberá um link em breve. Verifique também a caixa de spam.'
                : 'Sua senha foi redefinida com sucesso. Faça login com sua nova senha.'
              }
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
