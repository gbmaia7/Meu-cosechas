import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Trash2, CreditCard, Loader2, Pencil } from 'lucide-react';
import { supabase } from '../lib/supabase';

type SavedCard = {
  id: string;
  mp_card_id: string;
  brand: string;
  last_four: string;
  holder_name: string;
  exp_month: number;
  exp_year: number;
  nickname?: string;
};

const brandLabel: Record<string, string> = {
  visa: 'Visa',
  master: 'Mastercard',
  mastercard: 'Mastercard',
  elo: 'Elo',
  amex: 'Amex',
  hipercard: 'Hipercard',
};

export default function GerenciarCartoes() {
  const navigate = useNavigate();
  const location = useLocation();
  const selecting = location.state?.selecting;
  const type = location.state?.type;

  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setLoading(false); return; }

    const { data, error } = await supabase
      .from('saved_cards')
      .select('id, mp_card_id, brand, last_four, holder_name, exp_month, exp_year, nickname')
      .eq('user_id', session.user.id)
      .not('mp_card_id', 'is', null)
      .order('created_at', { ascending: false });

    setLoading(false);
    if (!error && data) setCards(data as SavedCard[]);
  };

  const handleRemove = async (card: SavedCard) => {
    setDeletingId(card.id);
    setError('');
    const { error } = await supabase.functions.invoke('delete-card', {
      body: { saved_card_id: card.id },
    });
    if (error) {
      setError('Não foi possível remover o cartão. Tente novamente.');
    } else {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
    }
    setDeletingId(null);
  };

  const startEdit = (card: SavedCard) => {
    setEditingId(card.id);
    setEditValue(card.nickname || '');
  };

  const saveNickname = async (cardId: string) => {
    const trimmed = editValue.trim();
    setCards((prev) => prev.map((c) => c.id === cardId ? { ...c, nickname: trimmed || undefined } : c));
    setEditingId(null);
    await supabase.from('saved_cards').update({ nickname: trimmed || null }).eq('id', cardId);
  };

  const handleCardClick = (card: SavedCard) => {
    if (!selecting) return;
    navigate('/pagamento', {
      state: { preSelectedMethod: type || 'credit_card', savedCard: card },
    });
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16 gap-4">
        <button onClick={() => navigate(-1)} className="text-[#E8173A] p-2 rounded-full active:scale-95 transition-transform -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg">
          {selecting ? 'Selecione um cartão' : 'Cartões Salvos'}
        </h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-4 pb-12">
        <p className="text-[#5d3f3e] text-sm">
          {selecting
            ? 'Escolha um cartão salvo ou adicione um novo.'
            : 'Gerencie seus cartões salvos.'}
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-800 font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-[#bd002a]" />
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center text-[#5d3f3e] py-8 border border-dashed border-[#e5e2e1] rounded-xl">
            Nenhum cartão salvo.
          </div>
        ) : (
          cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`bg-white rounded-xl p-5 shadow-sm border border-[#e5e2e1] flex items-center justify-between gap-4 ${selecting ? 'cursor-pointer hover:bg-[#f6f3f2]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f6f3f2] rounded-full flex items-center justify-center text-[#5d3f3e]">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === card.id ? (
                    <input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => saveNickname(card.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter') saveNickname(card.id); if (e.key === 'Escape') setEditingId(null); }}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="Apelido do cartão"
                      className="w-full font-display font-bold text-sm bg-transparent border-b border-[#bd002a] outline-none pb-0.5"
                    />
                  ) : (
                    <p className="font-display font-bold text-sm truncate">
                      {card.nickname || `${brandLabel[card.brand.toLowerCase()] || card.brand} •••• ${card.last_four}`}
                    </p>
                  )}
                  <p className="text-xs text-[#5d3f3e]">
                    {brandLabel[card.brand.toLowerCase()] || card.brand} •••• {card.last_four} · Expira {String(card.exp_month).padStart(2, '0')}/{String(card.exp_year).slice(-2)}
                  </p>
                </div>
              </div>
              {!selecting && (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); startEdit(card); }}
                    className="text-[#a8a29e] hover:text-[#5d3f3e] transition-colors p-1"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRemove(card); }}
                    disabled={deletingId === card.id}
                    className="text-[#a8a29e] hover:text-[#e8173a] transition-colors p-1 disabled:opacity-50"
                  >
                    {deletingId === card.id
                      ? <Loader2 className="w-5 h-5 animate-spin" />
                      : <Trash2 className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          ))
        )}

        <button
          onClick={() => navigate('/pagamento/cartao', { state: { type: type || 'credit_card', selecting } })}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-[#a8a29e] text-[#5d3f3e] font-bold text-sm bg-white hover:bg-[#f6f3f2] transition-colors"
        >
          <CreditCard className="w-5 h-5" />
          Adicionar novo cartão
        </button>
      </main>
    </div>
  );
}
