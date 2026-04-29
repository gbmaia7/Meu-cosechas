import { Routes, Route, Navigate } from 'react-router-dom';
import HomeSemSacola from '../screens/HomeMenu/HomeSemSacola';
import HomeAcompanharPedido from '../screens/HomeMenu/HomeAcompanharPedido';
import HomeComSacola from '../screens/HomeMenu/HomeComSacola';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/HomeSemSacola" replace />} />
      <Route path="/HomeSemSacola" element={<HomeSemSacola />} />
      <Route path="/HomeAcompanharPedido" element={<HomeAcompanharPedido />} />
      <Route path="/HomeComSacola" element={<HomeComSacola />} />
    </Routes>
  );
}
