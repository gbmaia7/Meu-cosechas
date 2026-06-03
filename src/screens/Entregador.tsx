import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Bike, CheckCircle2, LogOut, Phone, RefreshCw, ShieldCheck, Store, Wallet } from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type StoreRole = 'customer' | 'store' | 'admin';
type DeliveryStatus = 'ready' | 'out_for_delivery' | 'delivered';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'pay_on_delivery';
type DeliveryTab = 'ready' | 'route' | 'completed';
type PinModal = {
  type: 'success' | 'error';
  title: string;
  message: string;
} | null;

type DeliveryItem = {
  id: string;
  product_name: string;
  size_label: string | null;
  base: string | null;
  quantity: number;
  notes: string | null;
  order_item_extras?: Array<{
    id: string;
    extra_name: string;
  }>;
};

type DeliveryOrder = {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  total_price: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  status: DeliveryStatus;
  created_at: string;
  ready_at: string | null;
  out_for_delivery_at: string | null;
  delivered_at: string | null;
  profiles?: {
    name: string | null;
    phone: string | null;
  } | null;
  addresses?: {
    block: string | null;
    room: string | null;
    complement: string | null;
  } | null;
  order_items?: DeliveryItem[];
};

const paymentLabels: Record<string, string> = {
  pix: 'Pix',
  card: 'Cartao',
  credit: 'Credito',
  debit: 'Debito',
  credit_card: 'Credito',
  debit_card: 'Debito',
  cash: 'Dinheiro',
  machine: 'Maquininha',
  vr: 'VR/VA',
  subscription: 'Assinatura',
};

const paymentStatusLabels: Record<PaymentStatus, string> = {
  pending: 'Pendente',
  paid: 'Pago',
  failed: 'Falhou',
  refunded: 'Estornado',
  pay_on_delivery: 'Paga na entrega',
};

const getCustomerName = (order: DeliveryOrder) =>
  order.profiles?.name || order.guest_name || 'Cliente';

const getCustomerPhone = (order: DeliveryOrder) =>
  order.profiles?.phone || order.guest_phone || '';

const getAddressLine = (order: DeliveryOrder) => {
  const address = order.addresses;
  if (!address) return 'Endereco nao informado';
  return [address.block, address.room, address.complement].filter(Boolean).join(', ');
};

const getItemSummary = (order: DeliveryOrder) => {
  const items = order.order_items || [];
  if (items.length === 0) return 'Pedido sem itens';
  const first = items[0];
  const firstLabel = `${first.quantity}x ${first.product_name}${first.size_label ? ` ${first.size_label}` : ''}`;
  if (items.length === 1) return firstLabel;
  return `${firstLabel} + ${items.length - 1} item${items.length > 2 ? 's' : ''}`;
};

const getItemDetails = (order: DeliveryOrder) => {
  const first = order.order_items?.[0];
  if (!first) return '';
  return [
    first.base,
    first.order_item_extras?.map((extra) => extra.extra_name).join(', '),
    first.notes ? `Obs: ${first.notes}` : '',
  ].filter(Boolean).join(' | ');
};

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatTime = (value: string | null) => {
  if (!value) return '--:--';
  return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

export default function Entregador() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StoreRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [statusError, setStatusError] = useState('');
  const [pinByOrderId, setPinByOrderId] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<DeliveryTab>('ready');
  const [successMessage, setSuccessMessage] = useState('');
  const [pinModal, setPinModal] = useState<PinModal>(null);

  const canAccess = role === 'store' || role === 'admin';

  const readyOrders = useMemo(
    () => orders.filter((order) => order.status === 'ready'),
    [orders]
  );

  const routeOrders = useMemo(
    () => orders.filter((order) => order.status === 'out_for_delivery'),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === 'delivered'),
    [orders]
  );

  const loadRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) {
      setRole(null);
      return;
    }

    setRole((data?.role as StoreRole) || 'customer');
  };

  const loadOrders = async () => {
    setLoadingOrders(true);
    setStatusError('');

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        user_id,
        guest_name,
        guest_phone,
        total_price,
        payment_method,
        payment_status,
        status,
        created_at,
        ready_at,
        out_for_delivery_at,
        delivered_at,
        profiles:user_id(name, phone),
        addresses:address_id(block, room, complement),
        order_items(
          *,
          order_item_extras(id, extra_name)
        )
      `)
      .eq('modality', 'delivery')
      .in('status', ['ready', 'out_for_delivery', 'delivered'])
      .gte('created_at', start.toISOString())
      .order('created_at', { ascending: false });

    setLoadingOrders(false);

    if (error) {
      setStatusError('Nao foi possivel carregar as entregas.');
      return;
    }

    setOrders((data || []) as unknown as DeliveryOrder[]);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        loadRole(data.session.user.id).finally(() => setAuthLoading(false));
      } else {
        setAuthLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession) {
        setAuthLoading(true);
        loadRole(nextSession.user.id).finally(() => setAuthLoading(false));
      } else {
        setRole(null);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!canAccess) return;

    loadOrders();

    const channel = supabase
      .channel('delivery-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        loadOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canAccess]);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoginError('');
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);

    if (error) {
      setLoginError('Dados incorretos. Verifique e tente novamente.');
    }
  };

  const updateOrderStatus = async (order: DeliveryOrder, nextStatus: DeliveryStatus) => {
    setStatusError('');
    setSuccessMessage('');

    const timestamp = new Date().toISOString();
    const updates: Partial<DeliveryOrder> = { status: nextStatus };

    if (nextStatus === 'out_for_delivery') updates.out_for_delivery_at = timestamp;
    if (nextStatus === 'delivered') updates.delivered_at = timestamp;

    const { error } = await supabase.from('orders').update(updates).eq('id', order.id);

    if (error) {
      setStatusError('Nao foi possivel atualizar a entrega.');
      return;
    }

    await supabase.from('order_status_events').insert({
      order_id: order.id,
      old_status: order.status,
      new_status: nextStatus,
      changed_by: session?.user.id,
    });

    await loadOrders();
    if (nextStatus === 'out_for_delivery') {
      setActiveTab('route');
    }
  };

  const getDeliveryPinError = (message?: string) => {
    if (message?.includes('DELIVERY_PIN_INVALID')) return 'PIN incorreto. Confira o codigo com o cliente.';
    if (message?.includes('DELIVERY_PIN_REQUIRED')) return 'Digite o PIN informado pelo cliente.';
    if (message?.includes('ORDER_NOT_OUT_FOR_DELIVERY')) return 'Este pedido ainda nao esta em rota.';
    if (message?.includes('STORE_ACCESS_REQUIRED')) return 'Seu usuario nao tem permissao para confirmar entregas.';
    return 'Nao foi possivel confirmar a entrega.';
  };

  const confirmDelivery = async (order: DeliveryOrder) => {
    const typedPin = (pinByOrderId[order.id] || '').trim();

    if (!typedPin) {
      setStatusError('');
      setSuccessMessage('');
      setPinModal({
        type: 'error',
        title: 'PIN obrigatorio',
        message: 'Digite o PIN informado pelo cliente para concluir a entrega.',
      });
      return;
    }

    setStatusError('');
    setSuccessMessage('');
    setPinModal(null);

    const { error } = await supabase.rpc('confirm_delivery_with_pin', {
      p_order_id: order.id,
      p_delivery_pin: typedPin,
    });

    if (error) {
      setPinModal({
        type: 'error',
        title: 'PIN incorreto',
        message: getDeliveryPinError(error.message),
      });
      return;
    }

    setPinByOrderId((current) => {
      const next = { ...current };
      delete next[order.id];
      return next;
    });
    setPinModal({
      type: 'success',
      title: 'Entrega concluida',
      message: 'Pedido confirmado com sucesso.',
    });
    setSuccessMessage('Entrega concluida com sucesso.');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await loadOrders();
    setPinModal(null);
    setActiveTab('completed');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f7f4f1] flex items-center justify-center text-[#5d3f3e]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Carregando entregas
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f7f4f1] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border border-[#e5e2e1] rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#bd002a] text-white flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-[#1c1b1b]">Entregador</h1>
              <p className="text-xs text-[#5d3f3e]">Acesso interno</p>
            </div>
          </div>

          <label className="text-xs font-bold text-[#5d3f3e] uppercase">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 mb-4 w-full rounded-lg border border-[#e5e2e1] px-4 py-3 outline-none focus:border-[#bd002a]"
            required
          />

          <label className="text-xs font-bold text-[#5d3f3e] uppercase">Senha</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 mb-5 w-full rounded-lg border border-[#e5e2e1] px-4 py-3 outline-none focus:border-[#bd002a]"
            required
          />

          {loginError && <p className="text-sm text-[#bd002a] mb-4">{loginError}</p>}

          <button className="w-full rounded-full bg-[#bd002a] text-white font-bold py-3 active:scale-95 transition-transform">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-[#f7f4f1] flex items-center justify-center px-4 text-center">
        <div className="max-w-sm bg-white border border-[#e5e2e1] rounded-lg p-6">
          <ShieldCheck className="w-10 h-10 text-[#bd002a] mx-auto mb-3" />
          <h1 className="font-display font-extrabold text-xl mb-2">Acesso nao autorizado</h1>
          <p className="text-sm text-[#5d3f3e] mb-5">Seu usuario nao tem permissao para entregas.</p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="rounded-full bg-[#1c1b1b] text-white font-bold px-5 py-3"
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  const renderOrderCard = (order: DeliveryOrder, action: 'start' | 'finish' | 'completed') => {
    const phone = getCustomerPhone(order).replace(/\D/g, '');
    const paymentNeedsAttention = order.payment_status !== 'paid';
    const isCompleted = action === 'completed';

    return (
      <article key={order.id} className="rounded-lg border border-[#e5e2e1] bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display font-extrabold text-lg leading-tight">{getItemSummary(order)}</p>
            {getItemDetails(order) && (
              <p className="mt-1 text-xs text-[#5d3f3e] leading-snug">{getItemDetails(order)}</p>
            )}
          </div>
          <div className="rounded-lg bg-[#fef2f2] px-3 py-2 text-center shrink-0">
            <p className="text-[10px] uppercase font-bold text-[#bd002a]">Entrega</p>
            <p className="font-display font-extrabold text-sm text-[#bd002a]">
              {action === 'start' ? 'Pronta' : action === 'finish' ? 'Validar PIN' : 'Concluida'}
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-[#f7f4f1] p-3 text-sm space-y-2">
          <p className="font-bold text-[#1c1b1b]">{getCustomerName(order)}</p>
          {getCustomerPhone(order) && (
            <p className="font-bold text-[#0f7a45]">{getCustomerPhone(order)}</p>
          )}
          <p className="text-[#5d3f3e]">{getAddressLine(order)}</p>
          {paymentNeedsAttention && (
            <p className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              <Wallet className="w-3 h-3" />
              {paymentLabels[order.payment_method || ''] || order.payment_method || 'Pagamento'} - {paymentStatusLabels[order.payment_status]}
            </p>
          )}
          {isCompleted && (
            <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
              <CheckCircle2 className="w-3 h-3" />
              Concluida as {formatTime(order.delivered_at)}
            </p>
          )}
        </div>

        {action === 'finish' && (
          <div className="mt-4 rounded-lg border border-[#e5e2e1] bg-white p-3">
            <label className="text-[10px] uppercase font-bold text-[#5d3f3e]">PIN informado pelo cliente</label>
            <input
              value={pinByOrderId[order.id] || ''}
              onChange={(event) => {
                const value = event.target.value.replace(/\D/g, '').slice(0, 4);
                setPinByOrderId((current) => ({ ...current, [order.id]: value }));
              }}
              inputMode="numeric"
              maxLength={4}
              placeholder="0000"
              className="mt-2 w-full rounded-lg border border-[#e5e2e1] px-4 py-3 text-center font-display text-2xl font-extrabold tracking-[0.35em] outline-none focus:border-[#bd002a]"
            />
          </div>
        )}

        {!isCompleted && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {phone ? (
              <a
                href={`https://wa.me/${phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#0f7a45] text-[#0f7a45] font-bold py-3 text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                WhatsApp
              </a>
            ) : (
              <button disabled className="rounded-lg border border-[#e5e2e1] text-[#a8a29e] font-bold py-3 text-sm">
                Sem telefone
              </button>
            )}

            <button
              onClick={() => action === 'start' ? updateOrderStatus(order, 'out_for_delivery') : confirmDelivery(order)}
              className="rounded-lg bg-[#bd002a] text-white font-bold py-3 text-sm flex items-center justify-center gap-2"
            >
              {action === 'start' ? (
                <>
                  <Bike className="w-4 h-4" />
                  Iniciar
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Entregue
                </>
              )}
            </button>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-[#e5e2e1] pt-3 text-xs text-[#5d3f3e]">
          <span>{order.id.slice(0, 8)}</span>
          <span className="font-bold text-[#1c1b1b]">{formatCurrency(Number(order.total_price))}</span>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f4f1] text-[#1c1b1b]">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-[#e5e2e1]">
        <div className="px-4 py-4 max-w-3xl mx-auto flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#bd002a]">Delivery</p>
            <h1 className="font-display font-extrabold text-2xl">Entregas</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadOrders}
              className="w-11 h-11 rounded-full border border-[#e5e2e1] bg-white flex items-center justify-center"
              title="Atualizar"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-11 h-11 rounded-full bg-[#1c1b1b] text-white flex items-center justify-center"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {statusError && (
        <div className="mx-4 mt-4 max-w-3xl sm:mx-auto rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {statusError}
        </div>
      )}

      {successMessage && (
        <div className="mx-4 mt-4 max-w-3xl sm:mx-auto rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800">
          {successMessage}
        </div>
      )}

      {pinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center shadow-2xl">
            <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              pinModal.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-[#bd002a]'
            }`}>
              {pinModal.type === 'success' ? (
                <CheckCircle2 className="h-8 w-8" />
              ) : (
                <ShieldCheck className="h-8 w-8" />
              )}
            </div>
            <h2 className="font-display text-xl font-extrabold text-[#1c1b1b]">{pinModal.title}</h2>
            <p className="mt-2 text-sm text-[#5d3f3e]">{pinModal.message}</p>
            {pinModal.type === 'error' && (
              <button
                onClick={() => setPinModal(null)}
                className="mt-5 w-full rounded-lg bg-[#bd002a] py-3 text-sm font-bold text-white"
              >
                Tentar novamente
              </button>
            )}
          </div>
        </div>
      )}

      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-[#e5e2e1] bg-white p-1">
          {[
            { key: 'ready' as const, label: 'Pendentes', count: readyOrders.length },
            { key: 'route' as const, label: 'Em rota', count: routeOrders.length },
            { key: 'completed' as const, label: 'Concluidos', count: completedOrders.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-md px-2 py-3 text-xs font-extrabold transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#bd002a] text-white'
                  : 'text-[#5d3f3e] hover:bg-[#f7f4f1]'
              }`}
            >
              {tab.label}
              <span className={`ml-1 rounded-full px-2 py-0.5 ${activeTab === tab.key ? 'bg-white/20' : 'bg-[#f3eeee]'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === 'ready' && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-extrabold text-lg">Prontos para entrega</h2>
              <span className="text-xs font-bold bg-white border border-[#e5e2e1] rounded-full px-3 py-1">{readyOrders.length}</span>
            </div>
            <div className="space-y-3">
              {readyOrders.length > 0 ? (
                readyOrders.map((order) => renderOrderCard(order, 'start'))
              ) : (
                <div className="rounded-lg border border-dashed border-[#d8d4d3] p-6 text-center text-sm text-[#5d3f3e]">
                  Nenhuma entrega pronta.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'route' && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-extrabold text-lg">Em rota</h2>
              <span className="text-xs font-bold bg-white border border-[#e5e2e1] rounded-full px-3 py-1">{routeOrders.length}</span>
            </div>
            <div className="space-y-3">
              {routeOrders.length > 0 ? (
                routeOrders.map((order) => renderOrderCard(order, 'finish'))
              ) : (
                <div className="rounded-lg border border-dashed border-[#d8d4d3] p-6 text-center text-sm text-[#5d3f3e]">
                  Nenhum pedido em rota.
                </div>
              )}
            </div>
          </section>
        )}

        {activeTab === 'completed' && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-extrabold text-lg">Concluidos hoje</h2>
              <span className="text-xs font-bold bg-white border border-[#e5e2e1] rounded-full px-3 py-1">{completedOrders.length}</span>
            </div>
            <div className="space-y-3">
              {completedOrders.length > 0 ? (
                completedOrders.map((order) => renderOrderCard(order, 'completed'))
              ) : (
                <div className="rounded-lg border border-dashed border-[#d8d4d3] p-6 text-center text-sm text-[#5d3f3e]">
                  Nenhuma entrega concluida hoje.
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
