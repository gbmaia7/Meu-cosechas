/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import HomeSemSacola from './screens/HomeMenu/HomeSemSacola';
import HomeAcompanharPedido from './screens/HomeMenu/HomeAcompanharPedido';

export default function App() {
  // Simple switch for demonstration, defaulting to HomeSemSacola
  const showAcompanhar = false; 
  return showAcompanhar ? <HomeAcompanharPedido /> : <HomeSemSacola />;
}
