import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    setLoading(true);

    const normalizedPhone = phone;

    const { data, error: authError } = await supabase.auth.signUp({
      phone: normalizedPhone,
      password: senha,
      options: { data: { name: nome, email: email } }
    });

    if (authError) {
      setLoading(false);
      console.error('Supabase error:', authError);
      if (authError.message.includes('User already registered') ||
          authError.message.includes('already been registered'))
        setError('Este telefone ou e-mail já está cadastrado.');
      else if (authError.message.includes('Password should be at least 6 characters') ||
               authError.message.includes('at least 6'))
        setError('A senha deve ter pelo menos 6 caracteres.');
      else if (authError.message.includes('phone') ||
               authError.message.includes('Invalid phone'))
        setError('Número de telefone inválido. Verifique e tente novamente.');
      else if (authError.message.includes('email'))
        setError('E-mail inválido ou já cadastrado.');
      else
        setError(`Erro: ${authError.message}`);
      return;
    }

    if (data.user) {
      await supabase
        .from('profiles')
        .update({ name: nome, phone: normalizedPhone, email: email })
        .eq('id', data.user.id);

      const nomeLetras = nome.replace(/\s+/g, '').substring(0, 4).toUpperCase();
      const digitos = Math.floor(1000 + Math.random() * 9000).toString();
      const referralCode = `${nomeLetras}${digitos}`;

      await supabase
        .from('profiles')
        .update({ referral_code: referralCode })
        .eq('id', data.user.id);

      await supabase.auth.updateUser({ email: email });
    }

    setLoading(false);
    navigate('/verificar-telefone', { state: { phone: normalizedPhone } });
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
            {loading ? 'Criando conta...' : 'CRIAR E VERIFICAR TELEFONE'}
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
