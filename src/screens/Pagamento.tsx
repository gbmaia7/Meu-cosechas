import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, X, ChevronRight, Banknote, CheckCircle2, CreditCard, Wallet } from 'lucide-react';
import { useCart } from '../context/CartContext';

type PaymentMethod = 'pix' | 'credit_card_saved' | 'credit_card' | 'debit_card' | 'vr';

export default function Pagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalPrice } = useCart();
  
  const preSelected = location.state?.preSelectedMethod;
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(preSelected || 'pix');
  const [hasSavedCards, setHasSavedCards] = useState(() => {
    return localStorage.getItem('savedCardRemoved') !== 'true';
  });

  const modality = location.state?.modality || 'delivery';
  const address = location.state?.address;
  const deliveryFee = modality === 'counter' ? 0 : 5.00;
  const finalTotal = totalPrice + deliveryFee;

  const toggleSavedCardsState = () => {
    const newState = !hasSavedCards;
    setHasSavedCards(newState);
    if (!newState) {
      localStorage.setItem('savedCardRemoved', 'true');
      if (selectedMethod === 'credit_card_saved') {
        setSelectedMethod('pix');
      }
    } else {
      localStorage.removeItem('savedCardRemoved');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFinalize = () => {
    switch (selectedMethod) {
      case 'pix':
        navigate('/pagamento/pix', { state: { total: finalTotal.toFixed(2).replace('.', ','), modality, address } });
        break;
      case 'vr':
        navigate('/pagamento/vr', { state: { modality, address } });
        break;
      case 'credit_card_saved':
        navigate('/validando-pagamento', { state: { modality, address } });
        break;
      default:
        navigate('/validando-pagamento', { state: { modality, address } });
    }
  };

  return (
    <div className="bg-[#fcf9f8] font-body text-[#1c1b1b] antialiased min-h-screen relative z-0">
      {/* Background Decoration */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[40%] bg-[#e8173a]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#008388]/5 blur-[100px] rounded-full"></div>
      </div>

      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center justify-between px-6 h-16">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#E8173A] hover:bg-zinc-100 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg text-[#1c1b1b]">Forma de Pagamento</h1>
        <button 
          onClick={() => navigate('/HomeComSacola')}
          className="text-[#E8173A] hover:bg-zinc-100 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      <main className="pt-24 pb-40 px-6 max-w-md mx-auto">
        {/* Editorial Intro Section */}
        <div className="mb-10">
          <h2 className="font-display text-3xl font-extrabold tracking-tight mb-2">Finalize seu pedido</h2>
          <p className="text-[#5d3f3e] font-medium">Escolha como deseja pagar e receba sua vitalidade em instantes.</p>
        </div>

        {/* Resumo do Pedido (kept from original) */}
        <section className="bg-white p-5 rounded-3xl shadow-sm border border-[#e5e2e1] mb-10">
          <h2 className="font-display font-extrabold text-lg mb-4 text-[#5d3f3e]">Resumo</h2>
          <div className="space-y-2 text-sm text-[#5d3f3e]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between">
              <span>{modality === 'counter' ? 'Retirada no balcão' : 'Taxa de entrega'}</span>
              <span className={`font-medium ${modality === 'counter' ? 'text-emerald-600' : ''}`}>
                {modality === 'counter' ? 'Grátis' : `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
            <div className="h-px bg-[#e5e2e1] my-2" />
            <div className="flex justify-between text-base font-bold text-[#1c1b1b]">
              <span>Total a pagar</span>
              <span>R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </section>

        {/* Saved Cards Section */}
        {hasSavedCards && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold">Cartões salvos</h3>
              <span 
                onClick={() => navigate('/gerenciar-cartoes')}
                className="text-xs font-bold uppercase tracking-wider text-[#bd002a] cursor-pointer hover:underline"
              >
                Gerenciar
              </span>
            </div>
            
            <div 
              onClick={() => setSelectedMethod('credit_card_saved')}
              className={`group relative rounded-lg p-6 shadow-[0_-12px_40px_rgba(0,0,0,0.03)] flex items-center justify-between transition-colors duration-300 cursor-pointer ${selectedMethod === 'credit_card_saved' ? 'bg-[#bd002a]/5 ring-2 ring-[#bd002a]' : 'bg-white hover:bg-[#f6f3f2]'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-[#f0eded] rounded-md flex items-center justify-center overflow-hidden shrink-0">
                  <img className="w-full h-full object-cover opacity-80" alt="Mastercard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1Uh-sXIL0YnH-y9H2GIPEpcGbkD0iPt3xodcycyU5vl0pQ4okQmnERSPEzehlmW9o7oWlz2pt8DAMk6pyxNmvLl4Dj0bsnXy8jsMi2eiToMS4k2odViHclQPmKrDucTrw41EEnGupoaxy0TfmoULr1sKeGcxBbS8Uo5V8nPsora-XYDXEUc4TzK3hdQ3exd5yYtO5pgTepJzLMLu-Lt3w-i7JkmInjpcTnDvwXYrOcO5f2NQgcw1baHoRPw5nLCyvEixykKs_rxI" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-display font-bold text-[#1c1b1b]">
                      {localStorage.getItem('savedCardName') || 'Cartão Principal'}
                    </p>
                    <span className="bg-[#fd6c70]/10 text-[#ac3139] px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      Crédito
                    </span>
                  </div>
                  <p className="text-xs font-medium text-[#5d3f3e]">Mastercard **** {localStorage.getItem('savedCardLast4') || '4242'}</p>
                </div>
              </div>
              {selectedMethod === 'credit_card_saved' ? (
                <CheckCircle2 className="text-[#bd002a] font-bold w-6 h-6" />
              ) : (
                <ChevronRight className="text-[#5d3f3e]" />
              )}
            </div>
          </section>
        )}

        {/* Payment Options List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-xl font-bold">Outras formas de pagamento</h3>
            <button 
              onClick={toggleSavedCardsState}
              className="text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-2 py-1 rounded"
            >
              Dev: Toggle Cartão
            </button>
          </div>
          
          {/* Pix Card */}
          <div 
            onClick={() => setSelectedMethod('pix')}
            className={`rounded-lg p-5 flex items-center justify-between transition-all duration-300 cursor-pointer ${selectedMethod === 'pix' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#008388]/10 rounded-full flex items-center justify-center text-[#008388]">
                <Banknote className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display font-bold">Pix</p>
                  <span className="bg-[#008388] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Recomendado</span>
                </div>
                <p className="text-xs font-medium text-[#5d3f3e]">Aprovação imediata</p>
              </div>
            </div>
            {selectedMethod === 'pix' ? (
              <CheckCircle2 className="text-[#bd002a] font-bold w-6 h-6" />
            ) : (
              <ChevronRight className="text-[#5d3f3e]" />
            )}
          </div>

          {/* Credit Card */}
          <div 
            onClick={() => navigate('/gerenciar-cartoes', { state: { selecting: true } })}
            className={`rounded-lg p-5 flex items-center justify-between transition-all duration-300 cursor-pointer ${selectedMethod === 'credit_card' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#fd6c70]/10 rounded-full flex items-center justify-center text-[#ac3139]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold">Cartão de crédito</p>
                <p className="text-xs font-medium text-[#5d3f3e]">À vista ou parcelado</p>
              </div>
            </div>
            {selectedMethod === 'credit_card' ? (
              <CheckCircle2 className="text-[#bd002a] font-bold w-6 h-6" />
            ) : (
              <ChevronRight className="text-[#5d3f3e]" />
            )}
          </div>

          {/* Debit Card */}
          <div 
            onClick={() => navigate('/gerenciar-cartoes', { state: { selecting: true, type: 'debit_card' } })}
            className={`rounded-lg p-5 flex items-center justify-between transition-all duration-300 cursor-pointer ${selectedMethod === 'debit_card' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#5d3f3e]/10 rounded-full flex items-center justify-center text-[#5d3f3e]">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold">Cartão de débito</p>
                <p className="text-xs font-medium text-[#5d3f3e]">Pagamento imediato</p>
              </div>
            </div>
            {selectedMethod === 'debit_card' ? (
              <CheckCircle2 className="text-[#bd002a] font-bold w-6 h-6" />
            ) : (
              <ChevronRight className="text-[#5d3f3e]" />
            )}
          </div>

          {/* Vale Refeição / Alimentação */}
          {modality === 'delivery' && (
            <div 
              onClick={() => setSelectedMethod('vr')}
              className={`rounded-lg p-5 flex items-center justify-between transition-all duration-300 cursor-pointer ${selectedMethod === 'vr' ? 'ring-2 ring-[#bd002a] bg-[#bd002a]/5' : 'bg-white hover:bg-[#f6f3f2]'}`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#e7bcbb]/20 rounded-full flex items-center justify-center text-[#92001e]">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-display font-bold">Vale Refeição/Alimentação</p>
                  <p className="text-xs font-medium text-[#5d3f3e]">Levaremos a maquininha</p>
                </div>
              </div>
              {selectedMethod === 'vr' ? (
                <CheckCircle2 className="text-[#bd002a] font-bold w-6 h-6" />
              ) : (
                <ChevronRight className="text-[#5d3f3e]" />
              )}
            </div>
          )}
        </section>

        {/* Signature Visual Moment */}
        <div className="mt-12 opacity-40">
          <img className="w-full h-32 object-cover rounded-xl" alt="artistic macro shot of fresh red acai berries" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtp0DQMrBG7g2Wgu03FxbxASctxXlvYNnIx4XS-w7esXIUy-iOvcX9meVRLyHVKaNeFpDdp8b_gbuxjsIQ-SYHjOtL4ofb0R3OSbJ-GbnfeTcCc464NyXPTRBs9plBZaANTdQEClT15SpvjO1HTkKHftBs0ypyTpbQYT2gdMH5U8fz49nN7JrKoVLrGtdWkWBXdshFiUoumlIcxdq1szuDDsmApkXsBI9BHy33G6G1rAtUcbkW9WtVuxkli_6c-KVmXF-GzlHWSZM" />
        </div>
      </main>

      {/* BottomNavBar (Order Summary Footer) */}
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-white rounded-t-[2.5rem] shadow-[0_-12px_40px_rgba(0,0,0,0.05)] px-6 py-4 pb-8 flex justify-between items-center gap-4">
        <div className="flex flex-col whitespace-nowrap">
          <span className="text-xs font-semibold text-zinc-400 font-display">Total</span>
          <span className="text-xl font-extrabold text-[#E8173A] font-display tracking-tight">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <button 
          onClick={handleFinalize}
          className="flex-1 max-w-[200px] flex items-center justify-center rounded-full px-4 py-3.5 font-display font-semibold text-sm transition-all duration-200 bg-[#E8173A] text-white shadow-lg shadow-[#bd002a]/20 hover:scale-105 active:scale-95"
        >
          Finalizar Pedido
        </button>
      </nav>
    </div>
  );
}

