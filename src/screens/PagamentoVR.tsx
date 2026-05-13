import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, Wallet, MapPin, Store } from 'lucide-react';
import { useEffect } from 'react';

export default function PagamentoVR() {
  const navigate = useNavigate();
  const location = useLocation();
  const address = location.state?.address;
  const modality = location.state?.modality;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcf9f8] min-h-screen text-[#1c1b1b] font-body relative z-0">
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/70 backdrop-blur-xl flex items-center px-6 h-16">
        <button 
          onClick={() => navigate(-1)}
          className="text-[#E8173A] hover:bg-zinc-100 transition-colors p-2 rounded-full scale-95 active:scale-90 transition-transform -ml-2 mr-2"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-lg text-[#1c1b1b]">Vale Refeição / Alimentação</h1>
      </header>

      <main className="pt-24 px-6 max-w-md mx-auto space-y-6 flex flex-col items-center text-center">
        
        <div className="w-24 h-24 bg-[#e7bcbb]/20 rounded-full flex items-center justify-center text-[#92001e] mb-2">
          <Wallet className="w-10 h-10" />
        </div>

        <h2 className="font-display text-2xl font-extrabold text-[#1c1b1b]">Pagamento na {modality === 'counter' ? 'Retirada' : 'Entrega'}</h2>
        
        <p className="text-[#5d3f3e] font-medium">
          {modality === 'counter' 
            ? 'Pague com vale na hora de retirar seu pedido no balcão.'
            : 'Nós levaremos a maquininha até você. Tenha o seu cartão em mãos no momento da entrega!'}
        </p>

        <div className="w-full bg-white p-5 rounded-2xl shadow-sm border border-[#e5e2e1] flex items-start gap-4 mt-8 text-left">
           {modality === 'counter' ? (
             <>
               <Store className="w-6 h-6 text-[#bd002a] shrink-0 mt-0.5" />
               <div>
                 <p className="font-display font-bold text-[#1c1b1b]">Local de Retirada</p>
                 <p className="text-sm text-[#5d3f3e] mt-1">
                   Dimension Park — Barra
                 </p>
               </div>
             </>
           ) : (
             <>
               <MapPin className="w-6 h-6 text-[#bd002a] shrink-0 mt-0.5" />
               <div>
                 <p className="font-display font-bold text-[#1c1b1b]">Endereço de Entrega</p>
                 <p className="text-sm text-[#5d3f3e] mt-1">
                   {address?.block}, {address?.room}<br />
                   Dimension Park — Barra<br />
                   {address?.complement && <span className="text-xs">{address.complement}</span>}
                 </p>
               </div>
             </>
           )}
        </div>

        <button 
          onClick={() => navigate('/validando-pagamento', { state: location.state })}
          className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-[#bd002a] text-white rounded-full font-display font-bold shadow-lg shadow-[#bd002a]/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <CheckCircle2 className="w-5 h-5" />
          Confirmar e Finalizar Pedido
        </button>

      </main>
    </div>
  );
}
