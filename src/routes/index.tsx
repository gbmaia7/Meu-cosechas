import { Routes, Route, Navigate } from 'react-router-dom';
import HomeAcompanharPedido from '../screens/HomeMenu/HomeAcompanharPedido';
import HomeComSacola from '../screens/HomeMenu/HomeComSacola';
import Sacola from '../screens/Sacola';
import ClubeCosechasLogado from '../screens/ClubeCosechasLogado';
import ClubeCosechasNaoLogado from '../screens/ClubeCosechasNaoLogado';
import AssinaturaCosechas from '../screens/AssinaturaCosechas';
import AssinaturaAtiva from '../screens/AssinaturaAtiva';
import AssinaturaDuo from '../screens/AssinaturaDuo';
import AssinaturaDaily from '../screens/AssinaturaDaily';
import IndiqueGanhe from '../screens/IndiqueGanhe';
import IndiqueGanheLogado from '../screens/IndiqueGanheLogado';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/HomeComSacola" replace />} />
      <Route path="/HomeAcompanharPedido" element={<HomeAcompanharPedido />} />
      <Route path="/HomeComSacola" element={<HomeComSacola />} />
      <Route path="/sacola" element={<Sacola />} />
      <Route path="/clube/logado" element={<ClubeCosechasLogado />} />
      <Route path="/clube/nao-logado" element={<ClubeCosechasNaoLogado />} />
      <Route path="/assinatura" element={<AssinaturaCosechas />} />
      <Route path="/assinatura/ativa" element={<AssinaturaAtiva />} />
      <Route path="/assinatura/duo" element={<AssinaturaDuo />} />
      <Route path="/assinatura/daily" element={<AssinaturaDaily />} />
      <Route path="/indique-ganhe" element={<IndiqueGanhe />} />
      <Route path="/indique-ganhe/logado" element={<IndiqueGanheLogado />} />
    </Routes>
  );
}
