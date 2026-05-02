import { Routes, Route, Navigate } from 'react-router-dom';
import HomeAcompanharPedido from '../screens/HomeMenu/HomeAcompanharPedido';
import HomeComSacola from '../screens/HomeMenu/HomeComSacola';
import Sacola from '../screens/Sacola';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/HomeComSacola" replace />} />
      <Route path="/HomeAcompanharPedido" element={<HomeAcompanharPedido />} />
      <Route path="/HomeComSacola" element={<HomeComSacola />} />
      <Route path="/sacola" element={<Sacola />} />
    </Routes>
  );
}
