import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Trash2, Edit2, Check, CreditCard } from 'lucide-react';

export default function GerenciarCartoes() {
  const navigate = useNavigate();
  const location = useLocation();
  const selecting = location.state?.selecting;
  const type = location.state?.type; // 'credit_card' or 'debit_card'

  const [cardName, setCardName] = useState(() => {
    return localStorage.getItem('savedCardName') || 'Cartão Principal';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [removed, setRemoved] = useState(() => {
    return localStorage.getItem('savedCardRemoved') === 'true';
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSave = (e?: React.FocusEvent | React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(false);
    localStorage.setItem('savedCardName', cardName);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleCardClick = () => {
    if (selecting && !isEditing) {
      navigate('/pagamento', { state: { preSelectedMethod: 'credit_card_saved' } });
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoved(true);
    localStorage.setItem('savedCardRemoved', 'true');
  };

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body relative z-0">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#e8173a]/5 blur-[120px] rounded-full"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#E8173A] hover:bg-zinc-100 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform -ml-2 mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg text-[#1c1b1b]">
          {selecting ? 'Selecione um cartão' : 'Cartões Salvos'}
        </h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-4">
        {selecting && (
          <p className="text-[#5d3f3e] text-sm mb-6">
            Escolha um cartão salvo ou adicione um novo para continuar o pagamento.
          </p>
        )}
        {!selecting && (
          <p className="text-[#5d3f3e] text-sm mb-6">
            Gerencie seus cartões de crédito e débito salvos para usar em suas compras.
          </p>
        )}

        {/* Existing Card */}
        {!removed ? (
          <div 
            onClick={handleCardClick}
            className={`bg-white rounded-xl p-5 shadow-sm border border-[#e5e2e1] space-y-4 ${selecting ? 'cursor-pointer hover:bg-gray-50' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2 border-b border-[#e8173a] pb-1">
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleSave}
                      className="bg-transparent font-display font-bold text-[#1c1b1b] outline-none w-32"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button onClick={handleSave} className="text-[#e8173a]">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-[#1c1b1b]">{cardName}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
                      className="text-[#a8a29e] hover:text-[#1c1b1b]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={handleRemove}
                className="text-[#a8a29e] hover:text-[#e8173a] transition-colors p-1"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-between bg-[#f0eded]/50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-7 bg-white rounded flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  <img className="w-full h-full object-cover" alt="Mastercard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Uh-sXIL0YnH-y9H2GIPEpcGbkD0iPt3xodcycyU5vl0pQ4okQmnERSPEzehlmW9o7oWlz2pt8DAMk6pyxNmvLl4Dj0bsnXy8jsMi2eiToMS4k2odViHclQPmKrDucTrw41EEnGupoaxy0TfmoULr1sKeGcxBbS8Uo5V8nPsora-XYDXEUc4TzK3hdQ3exd5yYtO5pgTepJzLMLu-Lt3w-i7JkmInjpcTnDvwXYrOcO5f2NQgcw1baHoRPw5nLCyvEixykKs_rxI" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#1c1b1b]">Mastercard **** 4242</p>
                  <p className="text-xs text-[#5d3f3e]">Expira em 12/28</p>
                </div>
              </div>
              <div className="bg-[#fd6c70]/10 text-[#ac3139] px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
                Crédito
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-[#5d3f3e] py-8 border border-dashed border-[#e5e2e1] rounded-xl">
            Nenhum cartão salvo.
          </div>
        )}

        {selecting && (
          <button 
            onClick={() => navigate('/pagamento/cartao', { state: { type: type || 'credit_card' }})}
            className="w-full mt-6 flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-[#a8a29e] text-[#5d3f3e] font-bold text-sm bg-white hover:bg-gray-50 transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            Adicionar novo cartão
          </button>
        )}

      </main>
    </div>
  );
}
