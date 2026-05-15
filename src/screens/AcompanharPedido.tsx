import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Utensils, 
  ShoppingBag, 
  ChevronRight,
  CupSoda,
  Bike
} from 'lucide-react';

export default function AcompanharPedido() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { activeOrders, updateActiveOrderStatus, removeActiveOrder, userPoints, setUserPoints } = useCart();
  
  const idFromUrl = searchParams.get('id');
  const activeOrder = idFromUrl 
    ? activeOrders.find(o => o.id === idFromUrl) 
    : (activeOrders.length > 0 ? activeOrders[0] : null);

  const orderStatus = activeOrder?.status || 'preparing';
  
  const toggleOrderStatus = () => {
    if (activeOrder) {
      updateActiveOrderStatus(activeOrder.id, orderStatus === 'preparing' ? 'ready' : 'preparing');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const progressPercentage = Math.min((userPoints / 12) * 100, 100);

  if (!activeOrder) {
    return (
      <div className="bg-[#fcf9f8] min-h-dvh flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-[#1c1b1b] mb-2 font-display">Sem pedidos em andamento</h2>
        <p className="text-[#5d3f3e] mb-6">Que tal fazer um novo pedido no nosso menu?</p>
        <button 
          onClick={() => navigate('/')}
          className="w-full max-w-[200px] py-4 rounded-full bg-[#bd002a] text-white font-bold text-base hover:bg-[#a00021] shadow-lg transition-all active:scale-95 duration-200"
        >
          Ir para o menu
        </button>
      </div>
    );
  }

  // The rest remains mostly unchanged, except we use the correct handlers
  return (
    <div className="bg-[#fcf9f8] min-h-dvh pb-32 font-body text-[#1c1b1b] antialiased">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 w-full">
          <button 
            onClick={() => navigate(location.state?.from || '/')}
            className="text-[#e8173a] hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-display text-lg font-bold tracking-tight text-[#1c1b1b]">Meu pedido</h1>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="pt-20 px-6 space-y-6">
        {/* Dev Action Bar */}
        <div className="flex flex-wrap gap-2 justify-end">
            <button 
                onClick={toggleOrderStatus}
                className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
            >
                Simular Pedido: {orderStatus === 'preparing' ? 'Preparando' : 'Pronto'}
            </button>
            <button 
                onClick={() => {
                  if (userPoints < 5) setUserPoints(5);
                  else if (userPoints < 7) setUserPoints(7);
                  else if (userPoints < 10) setUserPoints(10);
                  else if (userPoints < 12) setUserPoints(12);
                  else if (userPoints < 14) setUserPoints(14);
                  else setUserPoints(0);
                }}
                className="text-[9px] font-bold text-[#a8a29e] border border-[#a8a29e] px-2 py-1 rounded-md active:bg-[#f0eded]"
            >
                Simular Pontos do Clube: {userPoints}
            </button>
        </div>

        {/* Status Area */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f6f3f2] to-[#f0eded] rounded-lg p-8 text-center space-y-6">
          <div className="space-y-2 relative z-10">
            <h2 className="text-xl font-extrabold text-[#1c1b1b] leading-tight font-display">
                {orderStatus === 'preparing' ? 'Seu pedido está sendo preparado.' : (activeOrder?.modality === 'delivery' ? 'Seu pedido saiu para entrega!' : 'Seu pedido está pronto!')}
            </h2>
            <p className="text-[#5d3f3e] text-sm">
                {orderStatus === 'preparing' ? 'Você será notificado quando estiver pronto.' : (activeOrder?.modality === 'delivery' ? 'Aguarde no endereço selecionado.' : 'Retire no balcão da loja.')}
            </p>
            {activeOrder?.modality === 'delivery' && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-[#5d3f3e] font-medium leading-relaxed">
                   <span className="font-bold text-yellow-800">Atenção:</span> Fique atento ao seu WhatsApp, nosso colaborador entrará em contato por lá para finalizar a entrega.
                </p>
              </div>
            )}
          </div>
          
          {/* Horizontal Progress Bar */}
          <div className="relative pt-4 pb-2 px-2">
            <div className="flex justify-between items-center relative z-10">
              {/* Step 1: Confirmed */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-[#bd002a] flex items-center justify-center text-white shadow-lg shadow-[#bd002a]/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              {/* Step 2: Preparing */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full ${orderStatus === 'preparing' ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse cursor-default' : 'bg-[#bd002a]'} flex items-center justify-center text-white transition-colors duration-500`}>
                  <Utensils className="w-6 h-6" />
                </div>
              </div>
              {/* Step 3: Ready */}
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full ${orderStatus === 'ready' ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse cursor-default' : 'bg-[#e5e2e1]'} flex items-center justify-center ${orderStatus === 'ready' ? 'text-white' : 'text-[#5d3f3e]'} transition-colors duration-500`}>
                  {activeOrder?.modality === 'delivery' ? <Bike className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                </div>
              </div>
            </div>
            
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-[#e5e2e1] -translate-y-1"></div>
            <div className={`absolute top-1/2 left-0 ${orderStatus === 'ready' ? 'w-full' : 'w-1/2'} h-1 bg-[#bd002a] -translate-y-1 transition-all duration-700 ease-in-out`}></div>
          </div>
        </section>

        {/* Loyalty Card (From ClubeCosechasLogado config) */}
        <section className="bg-white rounded-lg p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.02)] border border-[#e5e2e1]/30 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-[#bd002a] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>nutrition</span>
                    <h3 className="text-[#bd002a] font-bold text-[10px] uppercase tracking-widest font-display">Clube Cosechas</h3>
                </div>
                <button 
                  onClick={() => navigate('/clube/logado')}
                  className="w-8 h-8 rounded-full bg-[#f6f3f2] flex items-center justify-center hover:bg-[#eae7e7] transition-colors active:scale-95 text-[#bd002a]"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="relative pt-8 pb-4 mt-2">
                {/* Progress Line Background */}
                <div className="absolute top-10 left-0 w-full h-2 bg-[#f0eded] rounded-full overflow-hidden">
                <div 
                    className="h-full bg-[#e8173a] transition-all duration-1000" 
                    style={{ width: `${progressPercentage}%` }}
                ></div>
                </div>

                {/* Markers */}
                <div className="relative flex justify-between">
                <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full border-2 ${userPoints >= 0 ? 'bg-[#bd002a]' : 'bg-[#eae7e7]'} border-[#bd002a] mb-1 relative z-10`}></div>
                    <span className="text-[9px] font-bold">0</span>
                </div>
                
                <div className="flex flex-col items-center absolute" style={{ left: '58.3%', transform: 'translateX(-50%)' }}>
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full ${userPoints >= 7 ? 'bg-[#e8173a] text-white' : 'bg-[#eae7e7] text-[#5d3f3e]'} mb-1 relative z-10 shadow-sm transition-colors`}>
                    <CupSoda className="w-3 h-3" />
                    </div>
                    <span className="text-[9px] font-bold">7pts</span>
                </div>

                <div className="flex flex-col items-center absolute" style={{ left: '83.3%', transform: 'translateX(-50%)' }}>
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full ${userPoints >= 10 ? 'bg-[#e8173a] text-white' : 'bg-[#eae7e7] text-[#5d3f3e]'} mb-1 relative z-10 shadow-sm transition-colors`}>
                    <CupSoda className="w-3 h-3" />
                    </div>
                    <span className="text-[9px] font-bold">10pts</span>
                </div>

                <div className="flex flex-col items-center">
                    <div className={`w-5 h-5 flex items-center justify-center rounded-full ${userPoints >= 12 ? 'bg-[#e8173a] text-white' : 'bg-[#eae7e7] text-[#5d3f3e]'} mb-1 relative z-10 shadow-sm transition-colors`}>
                    <CupSoda className="w-3 h-3" />
                    </div>
                    <span className="text-[9px] font-bold">12pts</span>
                </div>
                </div>

                {/* User Indicator */}
                <div className="absolute top-0 flex flex-col items-center transition-all duration-1000" style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}>
                <div className="bg-gradient-to-br from-[#bd002a] to-[#e8173a] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full mb-1 shadow-sm">VOCÊ</div>
                <div className="w-0.5 h-4 bg-[#e8173a]"></div>
                </div>
            </div>

            {/* Balance and Status below progress */}
            <div className="pt-4 text-center border-t border-[#f0eded] mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d3f3e] mt-2">SEU SALDO ATUAL</p>
              <div className="mt-1">
                <span className="text-4xl font-display font-extrabold text-[#bd002a]">
                  {userPoints} pontos
                </span>
              </div>
              <p className="mt-2 text-xs font-bold text-[#5d3f3e]">
                {userPoints >= 7 ? (
                  <span className="text-[#bd002a]">🎉 Prêmio disponível!</span>
                ) : (
                  `Faltam ${7 - userPoints} compras para o próximo prêmio`
                )}
              </p>
            </div>
        </section>

        {/* Summary Card */}
        <section className="bg-white rounded-lg p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.02)] border border-[#e5e2e1]/30">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-[#5d3f3e] uppercase tracking-widest font-display">Pedido #82931</span>
            <span className="text-[#bd002a] font-bold text-sm font-display">
                {orderStatus === 'preparing' ? 'Em andamento' : (activeOrder?.modality === 'delivery' ? 'Saiu para entrega' : 'Pronto para retirar')}
            </span>
          </div>
          
          <div className="space-y-4">
            {/* Fallback to static items if activeOrder.items is empty, for the preview */}
            {!activeOrder?.items || activeOrder.items.length === 0 ? (
              <>
                <div className="flex items-center gap-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhu3k7jvvR_cy1CDnIVCuO4GrzlDCv_seej3z57SSuyxr7oYYBdpRrLZNg4u3Qfk_Biock3LnTOL2_C1htnc2awOOD_jmEnCEkQq1cMCzmkridMMUHJPrULmNTDCjJoTup_GrhlaWmIoBnYrSVtGhIcKirmT_zRUc2yEVKJbBQXHTdbvNry8i3Td75RPpYuUeRKeArG1TFz-ZZ7T5yIjKgTVkXm-tQYoc1odcX9wNZ6ijfWg6FHU-vGnIdHTF12nrgXP8BZm0RHiE" alt="Açaí Premium Médio" className="w-16 h-16 rounded-md object-cover bg-[#f6f3f2]" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1c1b1b] font-display">
                      Açaí Premium Médio
                      <span className="ml-1 text-[10px] bg-[#eae7e7] px-1.5 py-0.5 rounded-md font-bold uppercase vertical-middle">M</span>
                    </h4>
                    <p className="text-xs text-[#5d3f3e]">Banana, Leite em Pó e Granola</p>
                  </div>
                  <span className="font-bold text-[#1c1b1b]">R$ 21,90</span>
                </div>

                <div className="flex items-center gap-4">
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS85SNqnysJzVBcl3UzV8wGpkabxS2oN5sanhnRaJHuPPjpIY0D3Jh3nV4OpkmXV-oArinLSMFJ4JsovcFmQG_ojIEF4Byga-fjYWQHpvzv7WpYmUctupw4cXNX3YNR_JgXogCvUej6zOnItl62nd8xKmbtUNtR5GSSDqdkTndzKMz-JY7m_ZaV6CqRLUlbhIWqCYEHwCGJtPN7Bp14r0SFRQVPXpUHZlJczKAuO6Xe6VnVfRhm8Hde4azcyTOwr-F48n1R0nxdtg" alt="Suco Detox Verde" className="w-16 h-16 rounded-md object-cover bg-[#f6f3f2]" />
                  <div className="flex-1">
                    <h4 className="font-bold text-[#1c1b1b] font-display">
                      Suco Detox Verde
                      <span className="ml-1 text-[10px] bg-[#eae7e7] px-1.5 py-0.5 rounded-md font-bold uppercase vertical-middle">G</span>
                    </h4>
                    <p className="text-xs text-[#5d3f3e]">Abacaxi, Couve e Gengibre</p>
                  </div>
                  <span className="font-bold text-[#1c1b1b]">R$ 8,00</span>
                </div>
              </>
            ) : (
                activeOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                            <h4 className="font-bold text-[#1c1b1b] font-display">
                            {item.quantity}x {item.name}
                            {item.size && <span className="ml-1 text-[10px] bg-[#eae7e7] px-1.5 py-0.5 rounded-md font-bold uppercase vertical-middle">{item.size}</span>}
                            </h4>
                            <p className="text-xs text-[#5d3f3e]">
                                {item.extras?.map(e => e.name).join(', ')}
                            </p>
                        </div>
                        <span className="font-bold text-[#1c1b1b]">
                            {(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </span>
                    </div>
                ))
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#f0eded] flex justify-between items-center">
            <span className="font-display font-bold text-lg text-[#1c1b1b]">Total</span>
            <span className="font-display font-extrabold text-2xl text-[#bd002a]">
                {activeOrder?.totalPrice > 0 ? (activeOrder.totalPrice + (activeOrder.modality === 'counter' ? 0 : 5)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 29,90'}
            </span>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-4 pb-6 flex flex-col gap-3">
          {orderStatus === 'ready' ? (
             <button 
                onClick={() => {
                    removeActiveOrder(activeOrder.id);
                    // Add points only for valid (non-reward) items in the order
                    const validItemsCount = activeOrder.items.reduce((sum, item) => sum + ((item.name.startsWith('[CLUBE]') || item.name.startsWith('[ASSINATURA]')) ? 0 : item.quantity), 0);
                    if (validItemsCount > 0) {
                      // Original code used 1 point per checkout, but logically matching UI with "+1 ponto" per item means we should add validItemsCount
                      setUserPoints(userPoints + validItemsCount);
                    }
                    navigate('/');
                }}
                className="w-full py-4 rounded-full bg-[#bd002a] text-white font-bold text-base hover:bg-[#a00021] shadow-lg shadow-[#bd002a]/20 transition-all active:scale-95 duration-200"
             >
                {activeOrder?.modality === 'delivery' ? 'Confirmar Recebimento' : 'Confirmar Retirada'}
             </button>
          ) : (
            <button 
                onClick={() => navigate('/')}
                className="w-full py-4 rounded-full border-2 border-[#bd002a] text-[#bd002a] font-bold text-base hover:bg-[#bd002a]/5 transition-colors active:scale-95 duration-200"
            >
                Voltar ao menu
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
