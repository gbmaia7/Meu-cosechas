import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useCart, ActiveOrder } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Utensils, 
  ShoppingBag, 
  ChevronRight,
  CupSoda,
  Bike,
  Wallet
, Crown} from 'lucide-react';

const isClube = (name: string) => name.startsWith('[CLUBE]')

const cleanProductName = (name: string) => name.replace(/^\[.*?\]\s*/, '');

const formatDeliveryAddress = (address?: ActiveOrder['address']) => {
  if (!address) return 'endereco informado no pedido';
  return [address.block, address.room, address.complement].filter(Boolean).join(', ');
};

export default function AcompanharPedido() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { activeOrders, updateActiveOrderStatus, removeActiveOrder } = useCart();
  
  const idFromUrl = searchParams.get('id');
  const activeOrder = idFromUrl 
    ? activeOrders.find(o => o.id === idFromUrl) 
    : (activeOrders.length > 0 ? activeOrders[0] : null);

  const orderStatus =
    activeOrder?.status === 'ready' ||
    activeOrder?.status === 'out_for_delivery' ||
    activeOrder?.status === 'delivered'
      ? 'ready'
      : 'preparing';

  const deliveryStep =
    activeOrder?.modality !== 'delivery' ? 0
    : activeOrder?.status === 'delivered' ? 3
    : activeOrder?.status === 'out_for_delivery' || activeOrder?.status === 'ready' ? 2
    : 1;

  const awaitingCashierPayment =
    activeOrder?.modality === 'counter' && activeOrder?.payment_status === 'pay_on_delivery';
  const orderDisplayCode = activeOrder?.pickup_code || (activeOrder?.id ? `#${activeOrder.id.slice(0, 8)}` : '');
  const deliveryProductName = activeOrder?.items?.[0]?.name ? cleanProductName(activeOrder.items[0].name) : 'meu pedido';
  const deliveryAddress = formatDeliveryAddress(activeOrder?.address);
  const deliveryWhatsappMessage = `Ol\u00e1. Sou o cliente que fez o pedido "${deliveryProductName} (${orderDisplayCode})". Estou aguardando a entrega no endere\u00e7o ${deliveryAddress}.`;

  const [deliveryWhatsapp, setDeliveryWhatsapp] = useState('5521995435384');

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase
        .from('store_config')
        .select('value')
        .eq('key', 'delivery_whatsapp')
        .single();
      if (data) setDeliveryWhatsapp(data.value);
    };
    loadConfig();
  }, []);

  const toggleOrderStatus = () => {
    if (activeOrder) {
      updateActiveOrderStatus(activeOrder.id, orderStatus === 'preparing' ? 'ready' : 'preparing');
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!activeOrder?.id) return;

    supabase
      .from('orders')
      .select('status, payment_status')
      .eq('id', activeOrder.id)
      .single()
      .then(({ data }) => {
        if (data?.status) updateActiveOrderStatus(activeOrder.id, data.status as ActiveOrder['status'], data.payment_status);
      });

    const channel = supabase
      .channel(`order-status-${activeOrder.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${activeOrder.id}` },
        (payload) => {
          const updated = payload.new as { status: string; payment_status?: string };
          if (updated?.status) updateActiveOrderStatus(activeOrder.id, updated.status as ActiveOrder['status'], updated.payment_status);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeOrder?.id]);

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
        {/* Status Area */}
        {awaitingCashierPayment ? (
          <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-8 text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-amber-200 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-amber-700" />
            </div>
            <h2 className="text-xl font-extrabold text-amber-900 leading-tight font-display">
              Dirija-se ao caixa e mostre seu código para pagar. Assim que o pagamento for realizado, seu pedido entra em preparo.
            </h2>
          </section>
        ) : (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f6f3f2] to-[#f0eded] rounded-lg p-8 text-center space-y-6">
          <div className="space-y-2 relative z-10">
            <h2 className="text-xl font-extrabold text-[#1c1b1b] leading-tight font-display">
                {activeOrder?.modality === 'delivery'
                  ? deliveryStep === 3 ? 'Pedido entregue!'
                    : deliveryStep === 2 ? 'Seu pedido saiu para entrega!'
                    : 'Seu pedido está sendo preparado.'
                  : orderStatus === 'preparing' ? 'Seu pedido está sendo preparado.' : 'Seu pedido está pronto!'}
            </h2>
            <p className="text-[#5d3f3e] text-sm">
                {activeOrder?.modality === 'delivery'
                  ? deliveryStep === 3 ? 'Confirme o recebimento abaixo.'
                    : deliveryStep === 2 ? 'Aguarde no endereço selecionado.'
                    : 'Você será notificado quando estiver pronto.'
                  : orderStatus === 'preparing' ? 'Você será notificado quando estiver pronto.' : 'Retire no balcão da loja.'}
            </p>
            {activeOrder?.modality === 'delivery' && deliveryStep < 3 && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-xs text-[#5d3f3e] font-medium leading-relaxed">
                  <span className="font-bold text-yellow-800">Atenção:</span> Fique atento ao seu WhatsApp, nosso colaborador entrará em contato por lá para finalizar a entrega.
                </p>
              </div>
            )}
          </div>
          
          {/* Horizontal Progress Bar */}
          {activeOrder?.modality === 'delivery' ? (
            <div className="relative pt-4 pb-2 px-2">
              <div className="flex justify-between items-center relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#bd002a] flex items-center justify-center text-white shadow-lg shadow-[#bd002a]/20">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors duration-500 ${deliveryStep === 1 ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse' : 'bg-[#bd002a]'}`}>
                  <Utensils className="w-6 h-6" />
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${deliveryStep === 2 ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse text-white' : deliveryStep === 3 ? 'bg-[#bd002a] text-white' : 'bg-[#e5e2e1] text-[#5d3f3e]'}`}>
                  <Bike className="w-6 h-6" />
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${deliveryStep === 3 ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse text-white' : 'bg-[#e5e2e1] text-[#5d3f3e]'}`}>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
              <div className="absolute top-1/2 left-0 w-full h-1 bg-[#e5e2e1] -translate-y-1"></div>
              <div className={`absolute top-1/2 left-0 h-1 bg-[#bd002a] -translate-y-1 transition-all duration-700 ease-in-out ${deliveryStep >= 3 ? 'w-full' : deliveryStep === 2 ? 'w-2/3' : 'w-1/3'}`}></div>
            </div>
          ) : (
            <div className="relative pt-4 pb-2 px-2">
              <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#bd002a] flex items-center justify-center text-white shadow-lg shadow-[#bd002a]/20">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${orderStatus === 'preparing' ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse cursor-default' : 'bg-[#bd002a]'} flex items-center justify-center text-white transition-colors duration-500`}>
                    <Utensils className="w-6 h-6" />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full ${orderStatus === 'ready' ? 'bg-[#e8173a] ring-4 ring-white shadow-xl animate-pulse cursor-default' : 'bg-[#e5e2e1]'} flex items-center justify-center ${orderStatus === 'ready' ? 'text-white' : 'text-[#5d3f3e]'} transition-colors duration-500`}>
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-0 w-full h-1 bg-[#e5e2e1] -translate-y-1"></div>
              <div className={`absolute top-1/2 left-0 ${orderStatus === 'ready' ? 'w-full' : 'w-1/2'} h-1 bg-[#bd002a] -translate-y-1 transition-all duration-700 ease-in-out`}></div>
            </div>
          )}
        </section>
        )}

        {/* Pickup Code — counter */}
        {activeOrder?.modality === 'counter' && activeOrder?.pickup_code && (
          <section className="bg-white rounded-lg p-6 shadow-sm border border-[#e5e2e1]/30 text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5d3f3e] mb-2">
              {awaitingCashierPayment ? 'Seu código de pagamento' : 'Seu código de retirada'}
            </p>
            <p className="font-display font-extrabold text-7xl text-[#bd002a] tracking-wider">
              {activeOrder.pickup_code}
            </p>
            <p className="text-xs text-[#5d3f3e] mt-3">
              {awaitingCashierPayment ? 'Mostre este código no caixa para pagar.' : 'Mostre este código no balcão para retirar seu pedido.'}
            </p>
          </section>
        )}

        {/* Delivery PIN */}
        {activeOrder?.modality === 'delivery' && activeOrder?.delivery_pin && (
          <section className="bg-white rounded-lg p-6 shadow-sm border border-[#e5e2e1]/30 text-center space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5d3f3e]">
              PIN de segurança
            </p>
            <p className="font-display font-extrabold text-7xl text-[#bd002a] tracking-[0.2em]">
              {activeOrder.delivery_pin}
            </p>
            <p className="text-xs text-[#5d3f3e]">
              Informe este código ao entregador para confirmar o recebimento.
            </p>
            <a
              href={`https://wa.me/${deliveryWhatsapp}?text=${encodeURIComponent(
                deliveryWhatsappMessage
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#25D366] text-white font-bold text-sm"
            >
              <span>💬</span>
              Falar com o entregador
            </a>
          </section>
        )}

        {/* Loyalty Card (From ClubeCosechasLogado config) */}
        <section className="bg-white rounded-lg p-6 shadow-[0_-8px_30px_rgb(0,0,0,0.02)] border border-[#e5e2e1]/30 relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2 mb-1">
                    <Crown className="text-[#bd002a] w-5 h-5" />
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
            <span className="text-xs font-bold text-[#5d3f3e] uppercase tracking-widest font-display">Pedido {orderDisplayCode}</span>
            <span className="text-[#bd002a] font-bold text-sm font-display">
                {activeOrder?.modality === 'delivery'
                  ? deliveryStep === 3 ? 'Entregue' : deliveryStep === 2 ? 'Saiu para entrega' : 'Em andamento'
                  : awaitingCashierPayment ? 'Aguardando pagamento'
                  : orderStatus === 'preparing' ? 'Em andamento' : 'Pronto para retirar'}
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
                            <h4 className="font-bold text-[#1c1b1b] font-display flex flex-wrap items-center gap-1">
                              <span>{item.quantity}x {item.name}</span>
                              {item.size && <span className="text-[10px] bg-[#eae7e7] px-1.5 py-0.5 rounded-md font-bold uppercase">{item.size}</span>}
                              {isClube(item.name) && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                  Clube
                                </span>
                              )}
                            </h4>
                            <p className="text-xs text-[#5d3f3e]">
                                {item.extras?.map(e => e.name).join(', ')}
                            </p>
                        </div>
                        {isClube(item.name)
                          ? <span className="text-sm font-semibold text-red-600">Grátis</span>
                          : <span className="text-sm font-semibold">{(item.price * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                        }
                    </div>
                ))
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#f0eded] flex justify-between items-center">
            <span className="font-display font-bold text-lg text-[#1c1b1b]">Total</span>
            <span className="font-display font-extrabold text-2xl text-[#bd002a]">
              {activeOrder.items.every(i => isClube(i.name))
                ? <span className="text-red-600 font-bold">Grátis</span>
                : <span className="font-bold">{activeOrder.totalPrice.toFixed(2).replace('.', ',')}</span>
              }
            </span>
          </div>
        </section>

        {/* Action Button */}
        <div className="pt-4 pb-6 flex flex-col gap-3">
          {(activeOrder?.modality === 'delivery' ? deliveryStep === 3 : orderStatus === 'ready') ? (
             <button
                onClick={() => {
                    removeActiveOrder(activeOrder.id);
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
