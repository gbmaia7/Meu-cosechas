import { useEffect } from 'react';
import { AppRoutes } from './routes';
import { CartProvider } from './context/CartContext';
import FloatingOrderTracker from './components/FloatingOrderTracker';

export default function App() {
  useEffect(() => {
    const key = import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY;
    if (key && window.MercadoPago) {
      new window.MercadoPago(key, { locale: 'pt-BR' });
    }
  }, []);

  return (
    <CartProvider>
      <AppRoutes />
      <FloatingOrderTracker />
    </CartProvider>
  );
}
