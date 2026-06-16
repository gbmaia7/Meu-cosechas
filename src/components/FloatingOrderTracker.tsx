import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Bike, ChevronUp, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

export default function FloatingOrderTracker() {
  const { activeOrders, totalItems } = useCart();
  const location = useLocation();
  const [showMultipleMenu, setShowMultipleMenu] = useState(false);

  if (!activeOrders || activeOrders.length === 0) return null;

  // Do not show the tracker on these specific screens because they already handle order tracking or are in a specific flow
  const hiddenRoutes = [
    '/acompanhar-pedido', 
    '/validando-pagamento', 
    '/pagamento-confirmado',
    '/pagamento-presencial',
    '/pagamento',
    '/pagamento/pix',
    '/pagamento/vr',
    '/sacola'
  ];
  if (hiddenRoutes.includes(location.pathname)) return null;

  // We need to move the tracker up if the cart summary bar is visible (which is also fixed at bottom-96px on the Home screen)
  const bottomClass = totalItems > 0 && (location.pathname === '/' || location.pathname === '/HomeComSacola') 
    ? "bottom-[168px]" 
    : "bottom-[96px]";

  if (activeOrders.length === 1) {
    const singleOrder = activeOrders[0];
    return (
      <div className={`fixed ${bottomClass} left-4 right-4 z-40 transition-all duration-300`}>
        <Link to={`/acompanhar-pedido?id=${singleOrder.id}`} className={`${singleOrder.status === 'ready' ? 'bg-[#b60026]' : 'bg-[#E8173A]'} text-white px-5 py-4 rounded-3xl flex items-center justify-between shadow-[0_12px_40px_rgba(232,23,58,0.3)] transition-all active:scale-95 cursor-pointer block`}>
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-4">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                {singleOrder.status === 'ready' ? (
                    <ShoppingBag className="text-white w-6 h-6 animate-bounce" />
                ) : (
                    <Bike className="text-white w-6 h-6 animate-pulse" />
                )}
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-bold tracking-tight">Acompanhar pedido</span>
                <span className="text-xs text-white/90">
                    {singleOrder.status === 'ready' ? 'Pronto para retirar!' : 'Em preparação...'}
                </span>
              </div>
            </div>
            <button className="shrink-0 bg-white/10 border border-white/30 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">Detalhes</button>
          </div>
        </Link>
      </div>
    );
  }

  // Multiple orders
  const anyReady = activeOrders.some(o => o.status === 'ready');

  return (
    <div className={`fixed ${bottomClass} left-4 right-4 z-40 transition-all duration-300`}>
      <div className={`${anyReady ? 'bg-[#b60026]' : 'bg-[#E8173A]'} text-white rounded-3xl shadow-[0_12px_40px_rgba(232,23,58,0.3)] transition-all overflow-hidden`}>
        <div 
          onClick={() => setShowMultipleMenu(!showMultipleMenu)} 
          className="px-5 py-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center justify-between w-full gap-3">
            <div className="flex min-w-0 items-center gap-4">
              <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="text-white w-6 h-6" />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="text-sm font-bold tracking-tight">Acompanhar pedidos</span>
                <span className="text-xs text-white/90">
                    Você tem {activeOrders.length} pedidos em andamento
                </span>
              </div>
            </div>
            <button className="shrink-0 bg-white/10 border border-white/30 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
              Detalhes
              {showMultipleMenu ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable menu */}
        {showMultipleMenu && (
          <div className="px-3 pb-3 pt-1 space-y-2">
            {activeOrders.map((order, idx) => (
              <Link 
                key={order.id} 
                to={`/acompanhar-pedido?id=${order.id}`}
                className="bg-white/10 rounded-xl p-3 flex justify-between items-center active:bg-white/20 transition-colors"
                onClick={() => setShowMultipleMenu(false)}
              >
                <div className="flex flex-col">
                  <span className="font-bold text-sm">Pedido {idx + 1}</span>
                  <span className="text-[10px] text-white/80">{order.status === 'ready' ? 'Pronto!' : 'Preparando'}</span>
                </div>
                <div className="text-xs font-bold bg-white text-[#bd002a] px-3 py-1 rounded-full">
                  Ver
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
