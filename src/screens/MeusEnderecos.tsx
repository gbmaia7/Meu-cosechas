import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function MeusEnderecos() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#fcf9f8] min-h-dvh font-body text-[#1c1b1b] pb-32">
      {/* Header */}
      <header className="sticky top-0 w-full z-50 bg-[#fcf9f8]/90 backdrop-blur-xl border-b border-[#e5e2e1] flex items-center px-4 py-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full active:bg-[#f0eded] transition-colors shrink-0"
        >
          <ArrowLeft className="text-[#e8173a] w-6 h-6" />
        </button>
        <h1 className="font-display font-bold text-base text-[#1c1b1b] ml-2">Meus Endereços</h1>
      </header>

      <main className="px-4 pt-6 space-y-4">
        
        <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-[#a8a29e] text-[#5d3f3e] font-bold text-sm bg-white hover:bg-gray-50 transition-colors">
          <Plus className="w-5 h-5" />
          Adicionar novo endereço
        </button>

        <section className="space-y-4 mt-6">
          <h2 className="font-display font-bold text-lg px-2">Endereços Salvos</h2>
          
          <div className="bg-white p-5 rounded-2xl border border-[#bd002a] shadow-sm flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-[#bd002a]/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#bd002a]" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#1c1b1b]">Trabalho</span>
                  <span className="bg-[#f6f3f2] text-[#5d3f3e] px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
                    Padrão
                  </span>
                </div>
                <p className="text-xs text-[#5d3f3e] leading-snug">Dimension Park — Barra<br/>Bloco 2, Sala 301</p>
                <div className="flex gap-4 mt-3">
                  <button className="text-xs font-bold text-[#bd002a] hover:underline">Editar</button>
                  <button className="text-xs font-bold text-[#a8a29e] hover:text-[#5d3f3e]">Excluir</button>
                </div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e5e2e1] shadow-sm flex items-start gap-4">
             <div className="w-10 h-10 rounded-full bg-[#f6f3f2] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#5d3f3e]" />
             </div>
             <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#1c1b1b]">Recepção</span>
                </div>
                <p className="text-xs text-[#5d3f3e] leading-snug">Dimension Park — Barra<br/>Bloco 1, Recepção<br/>Complemento: Deixar na portaria</p>
                <div className="flex gap-4 mt-3">
                   <button className="text-xs font-bold text-[#bd002a] hover:underline">Editar</button>
                   <button className="text-xs font-bold text-[#a8a29e] hover:text-[#5d3f3e]">Excluir</button>
                </div>
             </div>
          </div>
        </section>

      </main>
    </div>
  );
}
