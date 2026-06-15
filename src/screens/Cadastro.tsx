import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, User, Lock, Mail } from 'lucide-react';
import { PhoneInput } from 'react-international-phone';
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

export default function Cadastro() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.prefill as { nome?: string; email?: string; phone?: string; senha?: string } | undefined;
  const [nome, setNome] = useState(prefill?.nome || '');
  const [email, setEmail] = useState(prefill?.email || '');
  const [phone, setPhone] = useState(prefill?.phone || '');
  const [senha, setSenha] = useState(prefill?.senha || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneExists, setPhoneExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCadastro = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 12) {
      setError('Digite um número de telefone completo com DDD.');
      return;
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    setPhoneExists(false);
    setEmailExists(false);

    const normalizedPhone = phone;

    const { data: alreadyVerified } = await supabase.rpc('phone_is_verified', { p_phone: normalizedPhone });
    if (alreadyVerified) {
      setLoading(false);
      setPhoneExists(true);
      return;
    }

    const { data: emailRegistered } = await supabase.rpc('email_is_registered', { p_email: email });
    if (emailRegistered) {
      setLoading(false);
      setEmailExists(true);
      return;
    }

    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
    setLoading(false);

    if (otpError) {
      setError('Número de telefone inválido. Verifique e tente novamente.');
      return;
    }

    navigate('/verificar-telefone', { state: { phone: normalizedPhone, fromCadastro: { nome, email, senha } } });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcf9f8', paddingTop: '80px' }}>
      <style>{phoneDropdownStyle}</style>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', padding: '16px'
      }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: '8px' }}>
          <ChevronLeft color="#5d3f3e" size={24} />
        </button>
        <span style={{ fontWeight: 800, color: '#bd002a', fontSize: '20px' }}>Criar Conta</span>
      </header>

      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '24px 24px 48px' }}>
        <h2 style={{ fontWeight: 800, fontSize: '24px', textAlign: 'center', marginBottom: '8px' }}>
          Junte-se ao Clube!
        </h2>
        <p style={{ textAlign: 'center', color: '#5d3f3e', fontSize: '14px', marginBottom: '32px' }}>
          Preencha seus dados para criar sua conta rápida.
        </p>

        <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <User size={20} color="#a8a29e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              style={{
                width: '100%', paddingLeft: '44px', paddingRight: '16px',
                paddingTop: '16px', paddingBottom: '16px',
                border: '1px solid #e5e2e1', borderRadius: '12px',
                fontSize: '16px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={20} color="#a8a29e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%', paddingLeft: '44px', paddingRight: '16px',
                paddingTop: '16px', paddingBottom: '16px',
                border: '1px solid #e5e2e1', borderRadius: '12px',
                fontSize: '16px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            border: '1px solid #e5e2e1', borderRadius: '12px',
            overflow: 'hidden', backgroundColor: 'white',
            display: 'flex', alignItems: 'center'
          }}>
            <PhoneInput
              defaultCountry="br"
              value={phone}
              onChange={(value) => setPhone(value)}
              style={{ width: '100%' }}
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

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="#a8a29e" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              style={{
                width: '100%', paddingLeft: '44px', paddingRight: '16px',
                paddingTop: '16px', paddingBottom: '16px',
                border: '1px solid #e5e2e1', borderRadius: '12px',
                fontSize: '16px', outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <p style={{ color: '#bd002a', fontSize: '14px', textAlign: 'center' }}>{error}</p>
          )}

          {phoneExists && (
            <div style={{
              backgroundColor: '#fffbeb', border: '1px solid #fcd34d',
              borderRadius: '12px', padding: '16px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
              <p style={{ fontSize: '14px', color: '#92400e', fontWeight: 600 }}>
                Já existe uma conta verificada com este número.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '12px', backgroundColor: '#bd002a',
                  color: 'white', border: 'none', borderRadius: '9999px',
                  fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                Fazer Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/esqueceu-senha')}
                style={{ fontSize: '12px', fontWeight: 800, color: '#bd002a', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Esqueceu a senha? Recuperar senha
              </button>
            </div>
          )}

          {emailExists && (
            <div style={{
              backgroundColor: '#fffbeb', border: '1px solid #fcd34d',
              borderRadius: '12px', padding: '16px', textAlign: 'center',
              display: 'flex', flexDirection: 'column', gap: '10px'
            }}>
              <p style={{ fontSize: '14px', color: '#92400e', fontWeight: 600 }}>
                Já existe uma conta com este e-mail.
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '12px', backgroundColor: '#bd002a',
                  color: 'white', border: 'none', borderRadius: '9999px',
                  fontWeight: 800, fontSize: '13px', cursor: 'pointer',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                Fazer Login
              </button>
              <button
                type="button"
                onClick={() => navigate('/esqueceu-senha')}
                style={{ fontSize: '12px', fontWeight: 800, color: '#bd002a', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              >
                Esqueceu a senha? Recuperar senha
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              backgroundColor: loading ? '#e5e2e1' : '#bd002a',
              color: 'white', border: 'none', borderRadius: '9999px',
              fontWeight: 800, fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px'
            }}
          >
            {loading ? 'Enviando código...' : 'VERIFICAR TELEFONE'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '11px', color: '#a8a29e', marginTop: '8px' }}>
            🔒 Seus dados são protegidos e nunca compartilhados com terceiros.
          </p>
        </form>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: '#5d3f3e' }}>
          Já tem uma conta?{' '}
          <button onClick={() => navigate('/login')} style={{ color: '#bd002a', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
            Fazer Login
          </button>
        </p>
      </main>
    </div>
  );
}
