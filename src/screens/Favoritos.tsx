import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, Heart, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function Favoritos() {
  const navigate = useNavigate();
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcf9f8] min-h-dvh font-body text-[#1c1b1b]">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#e5e2e1] flex items-center justify-between px-4 py-4">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
          >
            <ArrowLeft className="text-[#e8173a] w-6 h-6" />
          </button>
          <h1 className="font-display font-bold text-base text-[#1c1b1b] ml-2">Favoritos</h1>
        </div>
        <button 
          onClick={() => setShowItems(!showItems)}
          className="text-[10px] font-bold uppercase tracking-wider bg-[#f6f3f2] text-[#5d3f3e] px-2 py-1 rounded-lg"
        >
          {showItems ? 'Ver Vazio' : 'Ver Com Itens'}
        </button>
      </header>

      <main className="px-6 pt-6 pb-32">
        {!showItems ? (
          <div className="flex flex-col items-center justify-center text-center mt-10">
            <div className="w-20 h-20 bg-[#fff0f0] rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Heart className="w-10 h-10 text-[#e8173a]" />
            </div>
            <h2 className="text-xl font-display font-black text-[#1c1b1b] mb-3">
              Nenhum favorito ainda
            </h2>
            <p className="text-sm text-[#5d3f3e] leading-relaxed max-w-[280px]">
              Você ainda não salvou nenhum produto como favorito. Explore nosso cardápio e adicione os que mais gostar!
            </p>

            <button 
              onClick={() => navigate('/HomeComSacola')}
              className="mt-10 w-full max-w-[300px] bg-gradient-to-r from-[#bd002a] to-[#e8173a] text-white py-4 rounded-full font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-95 text-base"
            >
              Explorar o Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            
            {/* Produto 1 */}
            <div className="relative bg-white p-4 rounded-lg flex gap-4 transition-transform border border-[#e5e2e1]/30 shadow-sm overflow-hidden">
              <button className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all">
                <img 
                  alt="Açaí Cosechas" 
                  src="https://images.unsplash.com/photo-1590165482129-1b8b27698780?auto=format&fit=crop&q=80&w=400&h=400" 
                  className="w-full h-full object-cover" 
                />
              </button>
              <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                 <div>
                    <button className="absolute top-4 right-4 text-[#e8173a] active:scale-90 transition-transform z-10 w-6 h-6 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                    <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight pr-8">
                      Açaí Cosechas
                    </h4>
                    <div className="flex flex-col gap-1 mt-1.5 mb-2">
                      <div className="inline-flex self-start bg-[#442c2b] text-[#f6f3f2] px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase shadow-sm">
                        Açaí
                      </div>
                    </div>
                    <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight">Açaí puro batido com banana, leite em pó e granola.</p>
                 </div>
                 <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-[#1c1b1b] text-sm">R$ 24,90</span>
                    <button className="w-6 h-6 rounded-full bg-[#bd002a] flex items-center justify-center text-white font-bold active:scale-90 transition-transform">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>

            {/* Produto 2 */}
            <div className="relative bg-white p-4 rounded-lg flex gap-4 transition-transform border border-[#e5e2e1]/30 shadow-sm overflow-hidden">
              <button className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all">
                <img 
                  alt="Suco Detox Verde Especial" 
                  src="https://images.unsplash.com/photo-1622484211148-52210b37cd09?auto=format&fit=crop&q=80&w=400&h=400" 
                  className="w-full h-full object-cover" 
                />
              </button>
              <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                 <div>
                    <button className="absolute top-4 right-4 text-[#e8173a] active:scale-90 transition-transform z-10 w-6 h-6 flex items-center justify-center">
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                    <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight pr-8">
                      Suco Detox Verde Especial
                    </h4>
                    <div className="flex flex-col gap-1 mt-1.5 mb-2">
                      <div className="inline-flex self-start bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase shadow-sm">
                        Detox
                      </div>
                    </div>
                    <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight">Maçã, couve, gengibre e limão. Excelente para iniciar o dia.</p>
                 </div>
                 <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-[#1c1b1b] text-sm">R$ 16,90</span>
                    <button className="w-6 h-6 rounded-full bg-[#bd002a] flex items-center justify-center text-white font-bold active:scale-90 transition-transform">
                       <Plus className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
