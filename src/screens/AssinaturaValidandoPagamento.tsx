import { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AssinaturaValidandoPagamento() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan;

  useEffect(() => {
    if (!plan) return;
    
    // Simulate payment processing time
    const timer = setTimeout(() => {
      navigate('/assinatura/pagamento-confirmado', { state: { plan } });
    }, 3500);

    return () => clearTimeout(timer);
  }, [navigate, plan]);

  if (!plan) return <Navigate to="/assinatura" />;

  return (
    <div className="bg-[#fcf9f8] min-h-dvh flex flex-col items-center justify-center p-6 text-center font-body selection:bg-[#e8173a]/20">
      <div className="relative">
        {/* Outer sweeping arc */}
        <div className="absolute inset-[-10px] rounded-full border-t-2 border-r-2 border-[#bd002a] animate-[spin_2s_linear_infinite]" />
        
        {/* Inner glow circle */}
        <div className="absolute inset-0 bg-[#e8173a] rounded-full opacity-10 animate-pulse" />
        
        {/* Center icon */}
        <div className="bg-white p-6 rounded-full shadow-lg relative z-10 w-24 h-24 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-[#bd002a] animate-[spin_3s_linear_infinite]" />
        </div>
      </div>
      
      <h2 className="mt-8 text-2xl font-display font-black text-[#1c1b1b] tracking-tight">Validando assinatura...</h2>
      <p className="mt-3 text-sm text-[#5d3f3e] max-w-[250px] leading-relaxed font-medium">
        Estamos processando seu pagamento e ativando seu plano {plan.name} de R$ {plan.price}.
      </p>
      
      <p className="mt-8 text-xs font-bold text-[#a8a29e] uppercase tracking-widest animate-pulse">Não feche o aplicativo</p>
    </div>
  );
}
