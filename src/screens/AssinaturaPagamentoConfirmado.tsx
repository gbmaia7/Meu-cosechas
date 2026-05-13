import { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function AssinaturaPagamentoConfirmado() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!plan) return <Navigate to="/assinatura" />;

  const getPlanRoute = () => {
    switch (plan.name.toLowerCase()) {
      case 'duo': return '/assinatura/duo';
      case 'trio': return '/assinatura/ativa';
      case 'daily': return '/assinatura/daily';
      default: return '/assinatura/ativa';
    }
  };

  return (
    <div className="fixed inset-0 bg-[#bd002a] flex flex-col font-body selection:bg-white/20 overflow-y-auto overflow-x-hidden">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative min-h-dvh">
         <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
            className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl relative"
         >
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20"></div>
            <CheckCircle2 className="w-12 h-12 text-[#bd002a]" />
         </motion.div>

         <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-display font-black text-white tracking-tight mb-4"
         >
            Assinatura<br/>Confirmada!
         </motion.h2>

         <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-2 mb-10"
         >
            <p className="text-white/90 font-medium text-sm">O plano <strong className="text-white font-bold">{plan.name}</strong> está ativo.</p>
            <p className="text-white/80 text-sm max-w-[280px]">Seus descontos e benefícios já estão disponíveis para uso.</p>
         </motion.div>

         <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-4"
         >
            <button 
               onClick={() => navigate(getPlanRoute())}
               className="w-full py-4 rounded-full bg-white text-[#bd002a] font-bold text-base hover:bg-gray-50 shadow-xl transition-all active:scale-95 duration-200"
            >
               Acessar meu plano
            </button>
         </motion.div>
      </main>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8173a] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#e8173a] rounded-full blur-3xl opacity-50 translate-y-1/3 -translate-x-1/4"></div>

      <motion.div 
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 0.8, type: 'spring' }}
         className="absolute top-1/4 left-8"
      >
         <Star className="text-white/30 w-8 h-8" fill="currentColor" />
      </motion.div>
      <motion.div 
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 1, type: 'spring' }}
         className="absolute bottom-1/3 right-8"
      >
         <Zap className="text-white/30 w-10 h-10" fill="currentColor" />
      </motion.div>
    </div>
  );
}
