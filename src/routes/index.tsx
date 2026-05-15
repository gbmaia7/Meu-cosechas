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
import MenuAssinatura from '../screens/MenuAssinatura';
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
import Pagamento from '../screens/Pagamento';
import PagamentoPix from '../screens/PagamentoPix';
import NovoCartao from '../screens/NovoCartao';
import GerenciarCartoes from '../screens/GerenciarCartoes';
import PagamentoVR from '../screens/PagamentoVR';
import ValidandoPagamento from '../screens/ValidandoPagamento';
import PagamentoConfirmado from '../screens/PagamentoConfirmado';
import PagamentoConfirmadoVR from '../screens/PagamentoConfirmadoVR';
import AcompanharPedido from '../screens/AcompanharPedido';

import AssinaturaCheckout from '../screens/AssinaturaCheckout';
import AssinaturaValidandoPagamento from '../screens/AssinaturaValidandoPagamento';
import AssinaturaPagamentoConfirmado from '../screens/AssinaturaPagamentoConfirmado';
import AssinaturaTrocarPlano from '../screens/AssinaturaTrocarPlano';
import AssinaturaCancelarPlano from '../screens/AssinaturaCancelarPlano';

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
      <Route path="/assinatura/checkout" element={<AssinaturaCheckout />} />
      <Route path="/assinatura/validando-pagamento" element={<AssinaturaValidandoPagamento />} />
      <Route path="/assinatura/pagamento-confirmado" element={<AssinaturaPagamentoConfirmado />} />
      <Route path="/assinatura/trocar" element={<AssinaturaTrocarPlano />} />
      <Route path="/assinatura/cancelar" element={<AssinaturaCancelarPlano />} />
      <Route path="/assinatura/ativa" element={<AssinaturaAtiva />} />
      <Route path="/assinatura/duo" element={<AssinaturaDuo />} />
      <Route path="/assinatura/daily" element={<AssinaturaDaily />} />
      <Route path="/assinatura/menu" element={<MenuAssinatura />} />
      <Route path="/indique-ganhe" element={<IndiqueGanhe />} />
      <Route path="/indique-ganhe/logado" element={<IndiqueGanheLogado />} />
      <Route path="/perfil/logado" element={<PerfilLogado />} />
      <Route path="/perfil/nao-logado" element={<PerfilNaoLogado />} />
      <Route path="/perfil/verificar-telefone" element={<VerificarTelefone />} />
      <Route path="/perfil/enderecos" element={<MeusEnderecos />} />
      <Route path="/perfil/favoritos" element={<Favoritos />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/esqueceu-senha" element={<EsqueceuSenha />} />
      <Route path="/pagamento" element={<Pagamento />} />
      <Route path="/pagamento/pix" element={<PagamentoPix />} />
      <Route path="/pagamento/cartao" element={<NovoCartao />} />
      <Route path="/pagamento/vr" element={<PagamentoVR />} />
      <Route path="/gerenciar-cartoes" element={<GerenciarCartoes />} />
      <Route path="/validando-pagamento" element={<ValidandoPagamento />} />
      <Route path="/pagamento-confirmado" element={<PagamentoConfirmado />} />
      <Route path="/pagamento-confirmado-vr" element={<PagamentoConfirmadoVR />} />
      <Route path="/acompanhar-pedido" element={<AcompanharPedido />} />
    </Routes>
  );
}
