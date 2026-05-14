import { Plus } from 'lucide-react';
import { Product } from '../data/products';

export const CATEGORY_COLORS: Record<string, string> = {
  'Promoção': 'bg-[#bd002a] text-white',
  'Funcional': 'bg-[#008388] text-white',
  'Premium': 'bg-purple-600 text-white',
  'Açaí': 'bg-[#442c2b] text-[#f6f3f2]',
  'Mix de Frutas': 'bg-[#e8173a] text-white',
  'Milkshake': 'bg-[#2b1f1e] text-[#f0eded]',
  'Kids': 'bg-yellow-400 text-yellow-900',
  'Salgado': 'bg-orange-500 text-white',
};

export default function ProductCard({ 
  prod, 
  onImageClick, 
  onPlusClick, 
  badge, 
  isAvailable = true, 
  availabilityMsg 
}: { 
  prod: Product; 
  onImageClick: (img: string) => void; 
  onPlusClick: (prod: Product) => void; 
  key?: string;
  badge?: string;
  isAvailable?: boolean;
  availabilityMsg?: string;
}) {
  return (
    <div className={`relative bg-white p-4 rounded-lg flex gap-4 transition-transform ${isAvailable ? 'active:scale-[0.98]' : ''} border border-[#e5e2e1]/30 shadow-sm overflow-hidden`}>
      {!isAvailable && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center pointer-events-none">
          <div className="bg-black/80 text-white text-[10px] font-black px-3 py-1 rounded-full mb-1">ENCERRADO</div>
          {availabilityMsg && <p className="text-[9px] font-bold text-black/60 text-center px-4 break-words leading-snug">{availabilityMsg}</p>}
        </div>
      )}

      <button 
        disabled={!isAvailable}
        onClick={() => onImageClick(prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g")}
        className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded] shrink-0 hover:opacity-90 active:scale-95 transition-all"
      >
        <img 
          src={prod.image || "https://lh3.googleusercontent.com/aida-public/AB6AXuB21WTQIQ2EsX2xg7nMbuctpTWvS4hhYAqD_dqH5VzJpimCmEPUJ_n576SDIhFT6uuNfRU4-UdPLn6HVHE5Rc0UqIGh3OWSs1upbNIh1VATp99vlKooECRXXFPCkkKxPcGI8rOoUOdNstd7Nf6cmk7-rhCBZ61d0LfeFitALEKhgvL-7nTD5tPxPTew8ZE1pH1sULKI419idSgujvKEiBh74jVsIPK7mhotM9Goepyoo6aQIkiGhlJuMOz6AQzfLY7cC-Ml2t0XS4g"} 
          alt={prod.name} 
          className="w-full h-full object-cover" 
        />
        {badge && (
          <div className="absolute top-1 left-1 bg-[#bd002a] text-white text-[7px] font-black px-1.5 py-0.5 rounded-sm shadow-md">
            {badge}
          </div>
        )}
      </button>
      <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden relative">
        <button className="absolute top-0 right-0 text-[#e8173a] active:scale-90 transition-transform z-10 w-6 h-6 flex items-center justify-center">
            {/* Opcional: botão coração pras telas que precisem */}
        </button>
        <div>
          <h4 className="font-bold text-[#1c1b1b] text-sm leading-tight pr-6">
            {prod.name}
          </h4>
          
          <div className="flex flex-col gap-1 mt-1.5 mb-2">
            <div className={`inline-flex self-start ${CATEGORY_COLORS[prod.category]} px-1.5 py-0.5 rounded-full text-[7px] font-bold uppercase shadow-sm`}>
              {prod.category}
            </div>
          </div>

          <p className="text-[#5d3f3e] text-[10px] line-clamp-2 leading-tight">{prod.description}</p>
          {prod.glutenWarning && (
            <p className="text-[9px] text-[#5d3f3e]/60 font-normal mt-1">contém glúten</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="font-extrabold text-[#bd002a] text-sm">{prod.priceDisplay}</span>
          <button 
            disabled={!isAvailable}
            onClick={() => onPlusClick(prod)}
            className={`w-8 h-8 ${isAvailable ? 'bg-[#bd002a]' : 'bg-[#e5e2e1]'} rounded-full flex items-center justify-center text-white shrink-0 shadow-sm active:scale-90 transition-transform`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
