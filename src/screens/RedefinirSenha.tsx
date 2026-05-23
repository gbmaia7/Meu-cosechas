import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Lock, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function RedefinirSenha() {
  const navigate = useNavigate()
  const [senha, setSenha] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRedefinir = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (senha !== confirmar) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)

    const { error: updateError } = await supabase.auth.updateUser({
      password: senha
    })

    setLoading(false)

    if (updateError) {
      setError('Não foi possível redefinir a senha. Tente novamente.')
      return
    }

    setDone(true)
  }

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen">
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-2xl shadow-sm flex items-center px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae7e7] transition-colors active:scale-90"
        >
          <ChevronLeft className="text-[#5d3f3e] w-6 h-6" />
        </button>
        <h1 className="font-display font-extrabold text-[#bd002a] text-xl tracking-tight ml-2">
          Nova Senha
        </h1>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-xl mx-auto space-y-8">
        {!done ? (
          <div className="flex flex-col items-center">
            <h2 className="font-display font-extrabold text-2xl text-center mb-2">
              Redefina sua senha
            </h2>
            <p className="text-center text-[#5d3f3e] text-sm mb-8">
              Digite uma nova senha para sua conta.
            </p>

            <form onSubmit={handleRedefinir} className="w-full space-y-4">
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

              {error && (
                <p className="text-[#bd002a] text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform mt-4 disabled:opacity-70"
              >
                {loading ? 'Salvando...' : 'Salvar nova senha'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h2 className="font-display font-extrabold text-2xl mb-2">
              Senha redefinida!
            </h2>
            <p className="text-[#5d3f3e] text-sm mb-8">
              Sua senha foi atualizada com sucesso. Faça login com a nova senha.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-[#bd002a] text-white py-4 rounded-full font-extrabold font-display uppercase tracking-wider text-sm shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-transform"
            >
              Ir para o Login
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
