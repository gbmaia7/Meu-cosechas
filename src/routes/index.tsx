import { Routes, Route, Navigate } from 'react-router-dom';
import HomeAcompanharPedido from '../screens/HomeMenu/HomeAcompanharPedido';
import HomeComSacola from '../screens/HomeMenu/HomeComSacola';
import Sacola from '../screens/Sacola';
import ClubeCosechasLogado from '../screens/ClubeCosechasLogado';
import ClubeCosechasNaoLogado from '../screens/ClubeCosechasNaoLogado';
import IndiqueGanhe from '../screens/IndiqueGanhe';
import IndiqueGanheLogado from '../screens/IndiqueGanheLogado';
import PerfilLogado from '../screens/PerfilLogado';
import PerfilNaoLogado from '../screens/PerfilNaoLogado';
import VerificarTelefone from '../screens/VerificarTelefone';
import MeusEnderecos from '../screens/MeusEnderecos';
import Favoritos from '../screens/Favoritos';
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import EsqueceuSenha from '../screens/EsqueceuSenha';
import RedefinirSenha from '../screens/RedefinirSenha';
import Pagamento from '../screens/Pagamento';
import PagamentoPix from '../screens/PagamentoPix';
import PagamentoVR from '../screens/PagamentoVR';
import ValidandoPagamento from '../screens/ValidandoPagamento';
import PagamentoConfirmado from '../screens/PagamentoConfirmado';
import PagamentoConfirmadoVR from '../screens/PagamentoConfirmadoVR';
import AcompanharPedido from '../screens/AcompanharPedido';
import Loja from '../screens/Loja';
import Entregador from '../screens/Entregador';


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/HomeComSacola" replace />} />
      <Route path="/HomeAcompanharPedido" element={<HomeAcompanharPedido />} />
      <Route path="/HomeComSacola" element={<HomeComSacola />} />
      <Route path="/sacola" element={<Sacola />} />
      <Route path="/clube/logado" element={<ClubeCosechasLogado />} />
      <Route path="/clube/nao-logado" element={<ClubeCosechasNaoLogado />} />
      <Route path="/indique-ganhe" element={<IndiqueGanhe />} />
      <Route path="/indique-ganhe/logado" element={<IndiqueGanheLogado />} />
      <Route path="/perfil/logado" element={<PerfilLogado />} />
      <Route path="/perfil/nao-logado" element={<PerfilNaoLogado />} />
      <Route path="/verificar-telefone" element={<VerificarTelefone />} />
      <Route path="/perfil/verificar-telefone" element={<VerificarTelefone />} />
      <Route path="/perfil/enderecos" element={<MeusEnderecos />} />
      <Route path="/perfil/favoritos" element={<Favoritos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/pagamento" element={<Pagamento />} />
      <Route path="/pagamento/pix" element={<PagamentoPix />} />
      <Route path="/pagamento/vr" element={<PagamentoVR />} />
      <Route path="/validando-pagamento" element={<ValidandoPagamento />} />
      <Route path="/pagamento-confirmado" element={<PagamentoConfirmado />} />
      <Route path="/pagamento-confirmado-vr" element={<PagamentoConfirmadoVR />} />
      <Route path="/acompanhar-pedido" element={<AcompanharPedido />} />
      <Route path="/loja" element={<Loja />} />
      <Route path="/entregador" element={<Entregador />} />
    </Routes>
  );
}
