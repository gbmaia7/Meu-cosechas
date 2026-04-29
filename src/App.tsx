/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  MapPin, 
  Search, 
  Plus, 
  Bike, 
  Utensils, 
  CreditCard, 
  Star, 
  ShoppingBag, 
  User, 
  UserPlus, 
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="bg-[#fcf9f8] min-h-dvh pb-40 font-body text-[#1c1b1b]">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50">
        <div className="bg-white py-3 border-b border-[#e5e2e1] flex justify-center items-center shadow-sm">
          <h1 className="text-[#E8173A] font-black italic tracking-tighter text-xl font-display">Meu Cosechas</h1>
        </div>
        <div className="bg-[#bd002a] text-white">
          <div className="flex flex-col items-center justify-center px-6 py-5 w-full text-center">
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="font-bold text-sm">Dimension Park — Barra</span>
            </div>
            <p className="text-[10px] opacity-80 mt-1 font-medium">Programa exclusivo desta unidade, não se aplica a outras.</p>
            <div className="mt-3 inline-flex items-center gap-2 bg-[#008388] px-4 py-1.5 rounded-full shadow-lg">
              <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-2 h-2 rounded-full bg-white" />
              <span className="text-white text-[10px] font-bold uppercase tracking-wider">ABERTO • ATÉ AS 19H</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-48 px-4 space-y-6">
        {/* Engagement Cards (Bento Style) */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-[#FDECEA] p-4 rounded-2xl border border-[#F3E0C1]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
            <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <Award className="text-[#bd002a] w-5 h-5" />
            </div>
            <h3 className="font-bold text-[13px] leading-tight mb-1">Clube Cosechas</h3>
            <p className="text-[10px] text-[#5d3f3e] leading-snug mb-3 flex-grow">Ganhe pontos em cada compra e troque por prêmios</p>
            <div className="mt-auto">
              <p className="font-extrabold text-[#bd002a] mb-2 tracking-wide text-[11px]">SEUS PONTOS: 5</p>
              <button className="w-full text-center bg-[#bd002a] text-white text-[9px] font-bold py-2 rounded-lg uppercase tracking-tight">VER COMO FUNCIONA</button>
            </div>
          </div>
          <div className="bg-[#E6F7F5] p-4 rounded-2xl border border-[#D1EAE7]/50 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full">
            <div className="bg-white w-9 h-9 rounded-xl flex items-center justify-center mb-3 shadow-sm">
              <UserPlus className="text-[#00686c] w-5 h-5" />
            </div>
            <h3 className="font-bold text-[13px] leading-tight mb-1">Indique e Ganhe</h3>
            <p className="text-[10px] text-[#5d3f3e] leading-snug mb-3 flex-grow">Indique um amigo e ganhe os dois R$5 off</p>
            <div className="mt-auto">
              <p className="font-extrabold text-[#00686c] mb-2 tracking-wide text-[11px]">SEUS CRÉDITOS: R$5</p>
              <button className="w-full text-center bg-[#008388] text-white text-[9px] font-bold py-2 rounded-lg uppercase tracking-tight">VER MEU CÓDIGO</button>
            </div>
          </div>
        </section>

        {/* Featured Assinatura Card */}
        <section className="relative overflow-hidden rounded-lg bg-[#bd002a] min-h-[14rem] flex items-center p-8 transition-transform active:scale-98 shadow-xl">
          <div className="z-10 w-2/3">
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">Exclusivo</span>
            <h2 className="text-white font-extrabold text-2xl leading-tight mb-2 font-display">Assinatura Cosechas</h2>
            <p className="text-white/80 text-sm mb-4">Assine agora e ganhe até 20% off em todas as compras + pontos em dobro</p>
            <button className="bg-white text-[#bd002a] px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider shadow-md">Conhecer planos</button>
          </div>
        </section>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5d3f3e] w-5 h-5" />
          <input className="w-full bg-[#f0eded] border-none rounded-md py-4 pl-12 pr-4 focus:ring-2 focus:ring-[#bd002a]/20 focus:bg-[#ffffff] transition-all" placeholder="O que você quer beber hoje?" type="text"/>
        </div>
        
        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {['Todos', 'Smoothies', 'Açaí', 'Sucos Detox', 'Refrescantes'].map((cat, i) => (
            <button key={cat} className={`${i === 0 ? 'bg-[#bd002a] text-white' : 'bg-[#e5e2e1] text-[#5d3f3e]'} px-6 py-2.5 rounded-full font-bold text-sm whitespace-nowrap`}>{cat}</button>
          ))}
        </div>

        {/* Products */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold font-display">Mais Pedidos</h3>
            <span className="text-[#bd002a] font-bold text-sm">Ver tudo</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Frutas Vermelhas', desc: 'Morango, amora, mirtilo e suco de laranja.', price: 'R$ 18,90' },
              { name: 'Detox Power', desc: 'Couve, abacaxi, maçã verde e gengibre.', price: 'R$ 16,50' },
              { name: 'Copo Açaí Clássico', desc: 'Açaí puro com granola e banana.', price: 'R$ 22,00' },
            ].map(prod => (
              <div key={prod.name} className="bg-white p-4 rounded-lg flex gap-4 transition-transform active:scale-[0.98]">
                <div className="relative w-24 h-24 rounded-md overflow-hidden bg-[#f0eded]">
                  <div className="absolute top-1 left-1 bg-[#008388] text-white px-1.5 py-0.5 rounded-full text-[8px] font-bold">+1 ponto</div>
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-[#1c1b1b]">{prod.name}</h4>
                    <p className="text-[#5d3f3e] text-xs mt-1 line-clamp-1">{prod.desc}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-[#bd002a]">{prod.price}</span>
                    <button className="w-8 h-8 bg-[#bd002a] rounded-full flex items-center justify-center text-white">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 backdrop-blur-xl shadow-[0_-8px_30px_rgb(0,0,0,0.04)] rounded-t-[2.5rem]">
        {[
          { icon: Utensils, label: 'Menu', active: true },
          { icon: CreditCard, label: 'Assinatura', active: false },
          { icon: Star, label: 'Clube', active: false },
          { icon: ShoppingBag, label: 'Sacola', active: false },
          { icon: User, label: 'Perfil', active: false },
        ].map(item => (
          <a key={item.label} href="#" className={`flex flex-col items-center justify-center ${item.active ? 'text-[#e8173a] bg-[#e8173a]/10' : 'text-[#a8a29e]'} rounded-full px-4 py-2 transition-transform duration-300 ${item.active ? 'scale-105' : 'active:scale-95'}`}>
            <item.icon className="w-6 h-6" />
            <span className="font-display text-[10px] font-semibold mt-1">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
