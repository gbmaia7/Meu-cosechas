import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Lock } from 'lucide-react';
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
`

export default function Login() {
  const navigate = useNavigate();
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let authError;

    if (loginMode === 'email') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      authError = error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });
      authError = error;
    }

    setLoading(false);

    if (authError) {
      if (authError.message.includes('Invalid login credentials'))
        setError('Dados incorretos. Verifique e tente novamente.');
      else if (
        authError.message.includes('Email not confirmed') ||
        authError.message.includes('email not confirmed')
      )
        setError(
          'Seu e-mail ainda não foi confirmado. ' +
          'Entre com seu telefone e confirme o e-mail ' +
          'pelo link que enviamos para você.'
        );
      else
        setError(`Erro: ${authError.message}`);
      return;
    }

    navigate('/HomeComSacola', { replace: true });
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
        <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight ml-2">Fazer Login</h1>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-xl mx-auto space-y-8">
        <div className="flex flex-col items-center">
          <h2 className="font-display font-extrabold text-2xl text-center mb-2">Bem-vindo de volta!</h2>
          <p className="text-center text-[#5d3f3e] text-sm mb-8">
            Entre com seus dados para acessar sua conta.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            {/* Toggle de modo */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setLoginMode('phone')}
                style={{
                  flex: 1, padding: '10px',
                  borderRadius: '12px', border: 'none', cursor: 'pointer',
                  backgroundColor: loginMode === 'phone' ? '#bd002a' : '#f0eded',
                  color: loginMode === 'phone' ? 'white' : '#5d3f3e',
                  fontWeight: 600, fontSize: '14px'
                }}
              >
                Telefone
              </button>
              <button
                type="button"
                onClick={() => setLoginMode('email')}
                style={{
                  flex: 1, padding: '10px',
                  borderRadius: '12px', border: 'none', cursor: 'pointer',
                  backgroundColor: loginMode === 'email' ? '#bd002a' : '#f0eded',
                  color: loginMode === 'email' ? 'white' : '#5d3f3e',
                  fontWeight: 600, fontSize: '14px'
                }}
              >
                E-mail
              </button>
            </div>

            {/* Input condicional */}
            {loginMode === 'phone' ? (
              <div style={{
                border: '1px solid #e5e2e1', borderRadius: '12px',
                overflow: 'hidden', backgroundColor: 'white',
                marginBottom: '16px'
              }}>
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
                    }
                  }}
                />
              </div>
            ) : (
              <div className="relative" style={{ marginBottom: '16px' }}>
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#a8a29e]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-2xl focus:outline-none focus:border-[#bd002a] text-[#1c1b1b] placeholder:text-[#a89f9e]"
                  placeholder="seu@email.com"
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-[#a8a29e]" />
              </div>
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-4 bg-white border border-[#e5e2e1] rounded-xl focus:outline-none focus:border-[#bd002a] focus:ring-1 focus:ring-[#bd002a] transition-all shadow-sm"
              />
            </div>

            <div className="flex justify-end">
              <button type="button" onClick={() => navigate('/esqueceu-senha')} className="text-xs font-bold text-[#bd002a]">
                Esqueceu a senha?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform mt-4 disabled:opacity-60 disabled:scale-100"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>

          {error && <p className="text-[#bd002a] text-sm text-center mt-2">{error}</p>}

          <p className="mt-8 text-sm text-[#5d3f3e]">
            Não tem uma conta?{' '}
            <button onClick={() => navigate('/cadastro')} className="font-bold text-[#bd002a]">
              Criar Conta Rápida
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
