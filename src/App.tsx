/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppRoutes } from './routes';
import { CartProvider } from './context/CartContext';
import FloatingOrderTracker from './components/FloatingOrderTracker';

export default function App() {
  return (
    <CartProvider>
      <AppRoutes />
      <FloatingOrderTracker />
    </CartProvider>
  );
}
