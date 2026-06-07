import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, Copy, Check, Gift, Users, UserPlus, Utensils, Crown, ShoppingBag, User } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCart } from '../context/CartContext'

interface Referral {
  id: string
  status: string
  created_at: string
  referred_id: string
}

export default function IndiqueGanheLogado() {
  const navigate = useNavigate()
  const { isAuthenticated, totalItems } = useCart()
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('referral_code')
      .eq('id', user.id)
      .single()

    if (profile) setReferralCode(profile.referral_code)

    const { data: refs } = await supabase
      .from('referrals')
      .select('id, status, created_at, referred_id')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })

    if (refs) setReferrals(refs)
    setLoading(false)
  }

  const handleCopy = () => {
    if (!referralCode) return
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const convertidos = referrals.filter(r => r.status === 'redeemed')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcf9f8', paddingBottom: '80px' }}>

      {/* Header */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', padding: '16px'
      }}>
        <button onClick={() => navigate(-1)} style={{ marginRight: '8px' }}>
          <ChevronLeft color="#5d3f3e" size={24} />
        </button>
        <span style={{ fontWeight: 800, color: '#bd002a', fontSize: '20px' }}>Indique e Ganhe</span>
      </header>

      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '80px 24px 24px' }}>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#a8a29e', marginTop: '40px' }}>Carregando...</p>
        ) : (
          <>
            {/* Card do código */}
            <div style={{
              backgroundColor: '#bd002a', borderRadius: '16px',
              padding: '24px', marginBottom: '24px', textAlign: 'center'
            }}>
              <Gift size={32} color="white" style={{ marginBottom: '12px' }} />
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13px', marginBottom: '8px' }}>
                Seu código de indicação
              </p>
              <p style={{
                color: 'white', fontSize: '32px', fontWeight: 900,
                letterSpacing: '4px', marginBottom: '16px'
              }}>
                {referralCode ?? '---'}
              </p>
              <button onClick={handleCopy} style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                margin: '0 auto', backgroundColor: 'white',
                color: '#bd002a', border: 'none', borderRadius: '9999px',
                padding: '10px 24px', fontWeight: 800, fontSize: '13px', cursor: 'pointer'
              }}>
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copiado!' : 'Copiar código'}
              </button>
            </div>

            {/* Como funciona */}
            <div style={{
              backgroundColor: 'white', borderRadius: '16px',
              padding: '20px', marginBottom: '24px',
              border: '1px solid #e5e2e1'
            }}>
              <p style={{ fontWeight: 800, fontSize: '15px', marginBottom: '16px', color: '#1a1a1a' }}>
                Como funciona
              </p>
              {[
                { n: '1', txt: 'Compartilhe seu código com um amigo' },
                { n: '2', txt: 'Seu amigo usa o código no primeiro pedido e ganha R$5 de desconto' },
                { n: '3', txt: 'Quando ele finalizar o pedido, você recebe R$5 de crédito para usar na próxima compra' },
              ].map(item => (
                <div key={item.n} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    backgroundColor: '#bd002a', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '13px', flexShrink: 0
                  }}>{item.n}</div>
                  <p style={{ fontSize: '14px', color: '#5d3f3e', margin: 0, paddingTop: '4px' }}>{item.txt}</p>
                </div>
              ))}
            </div>

            {/* Estatísticas */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '12px', marginBottom: '24px'
            }}>
              {[
                { label: 'Amigos convertidos', valor: convertidos.length, icon: <Users size={20} color="#bd002a" /> },
                { label: 'Créditos ganhos', valor: `R$ ${(convertidos.length * 5).toFixed(2).replace('.', ',')}`, icon: <Gift size={20} color="#bd002a" /> },
              ].map(card => (
                <div key={card.label} style={{
                  backgroundColor: 'white', borderRadius: '16px',
                  padding: '16px', border: '1px solid #e5e2e1', textAlign: 'center'
                }}>
                  <div style={{ marginBottom: '8px' }}>{card.icon}</div>
                  <p style={{ fontWeight: 900, fontSize: '22px', color: '#1a1a1a', margin: '0 0 4px' }}>{card.valor}</p>
                  <p style={{ fontSize: '12px', color: '#a8a29e', margin: 0 }}>{card.label}</p>
                </div>
              ))}
            </div>

            {/* Histórico */}
            {convertidos.length > 0 && (
              <div style={{
                backgroundColor: 'white', borderRadius: '16px',
                padding: '20px', border: '1px solid #e5e2e1'
              }}>
                <p style={{ fontWeight: 800, fontSize: '15px', marginBottom: '16px', color: '#1a1a1a' }}>
                  Amigos que compraram
                </p>
                {convertidos.map((ref, i) => (
                  <div key={ref.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    paddingBottom: i < convertidos.length - 1 ? '12px' : 0,
                    marginBottom: i < convertidos.length - 1 ? '12px' : 0,
                    borderBottom: i < convertidos.length - 1 ? '1px solid #f5f5f5' : 'none'
                  }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', margin: '0 0 2px' }}>
                        Amigo #{i + 1}
                      </p>
                      <p style={{ fontSize: '12px', color: '#a8a29e', margin: 0 }}>
                        {new Date(ref.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span style={{
                      fontSize: '12px', fontWeight: 700, padding: '4px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#d4edda',
                      color: '#1e7e34'
                    }}>
                      + R$5
                    </span>
                  </div>
                ))}
              </div>
            )}

            {convertidos.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#a8a29e' }}>
                <Users size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <p style={{ fontSize: '14px' }}>Nenhum amigo convertido ainda.</p>
                <p style={{ fontSize: '13px' }}>Compartilhe seu código e comece a ganhar!</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: false, path: '/HomeComSacola' },
          { icon: Crown, label: 'Clube', active: false, path: isAuthenticated ? '/clube/logado' : '/clube/nao-logado' },
          { icon: UserPlus, label: 'Indique', active: true, path: isAuthenticated ? '/indique-ganhe/logado' : '/indique-ganhe' },
          { icon: ShoppingBag, label: 'Sacola', active: false, badge: totalItems, path: '/sacola' },
          { icon: User, label: 'Perfil', active: false, path: isAuthenticated ? '/perfil/logado' : '/perfil/nao-logado' },
        ].map((item: any) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a]' : 'text-[#a8a29e]'} rounded-full px-2 py-2 transition-transform duration-300 active:scale-95`}
          >
            <div className="relative">
              <item.icon className="w-6 h-6" />
              {item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E8173A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
