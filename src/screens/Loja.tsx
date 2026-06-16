import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  Bike,
  CheckCircle2,
  Clock,
  Copy,
  LogOut,
  PackageCheck,
  Phone,
  RefreshCw,
  Search,
  Store,
  Utensils,
  XCircle,
} from 'lucide-react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type StoreRole = 'customer' | 'store' | 'admin';

type OrderStatus =
  | 'pending'
  | 'pending_payment'
  | 'new'
  | 'accepted'
  | 'paid'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'payment_failed'
  | 'expired'
  | 'canceled'
  | 'cancelled';

type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'pay_on_delivery';

type OrderExtra = {
  id: string;
  extra_name: string;
  extra_price: number;
};

type OrderItem = {
  id: string;
  product_name: string;
  size_label: string | null;
  base: string | null;
  unit_price: number;
  quantity: number;
  notes: string | null;
  order_item_extras?: OrderExtra[];
};

type StoreOrder = {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  guest_phone: string | null;
  subtotal: number;
  total_price: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  status: OrderStatus;
  modality: 'counter' | 'delivery';
  notes: string | null;
  pickup_code: string | null;
  created_at: string;
  updated_at: string;
  accepted_at?: string | null;
  prepared_at?: string | null;
  ready_at?: string | null;
  out_for_delivery_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  cancel_reason: string | null;
  profiles?: {
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  addresses?: {
    block: string | null;
    room: string | null;
    complement: string | null;
    street: string | null;
    number: string | null;
  } | null;
  order_items?: OrderItem[];
};

const productionColumns: Array<{ key: OrderStatus; label: string; icon: typeof Clock }> = [
  { key: 'new', label: 'Novo', icon: Clock },
  { key: 'preparing', label: 'Em preparo', icon: Utensils },
  { key: 'ready', label: 'Pronto', icon: PackageCheck },
];

const finalColumns: Array<{ key: OrderStatus; label: string; icon: typeof Clock }> = [
  { key: 'out_for_delivery', label: 'Saiu entrega', icon: Bike },
  { key: 'delivered', label: 'Entregue', icon: CheckCircle2 },
  { key: 'cancelled', label: 'Cancelado', icon: XCircle },
];

const statusLabels: Record<OrderStatus, string> = {
  pending: 'Novo',
  pending_payment: 'Aguardando pagamento',
  new: 'Novo',
  accepted: 'Aceito',
  paid: 'Pago',
  preparing: 'Em preparo',
  ready: 'Pronto',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  payment_failed: 'Pagamento falhou',
  expired: 'Expirado',
  canceled: 'Cancelado',
  cancelled: 'Cancelado',
};

const paymentLabels: Record<string, string> = {
  pix: 'Pix',
  card: 'Cartao',
  credit: 'Credito',
  debit: 'Debito',
  credit_card: 'Credito',
  debit_card: 'Debito',
  cash: 'Presencial',
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

const normalizeStatus = (status: OrderStatus): OrderStatus => {
  if (status === 'pending' || status === 'paid') return 'new';
  if (status === 'pending_payment' || status === 'payment_failed' || status === 'expired') return status;
  if (status === 'accepted') return 'preparing';
  if (status === 'canceled') return 'cancelled';
  return status;
};

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const getCustomerName = (order: StoreOrder) =>
  order.profiles?.name || order.guest_name || 'Cliente';

const getCustomerPhone = (order: StoreOrder) =>
  order.profiles?.phone || order.guest_phone || '';

const getAddressLine = (order: StoreOrder) => {
  if (order.modality !== 'delivery') return 'Retirada no balcao';
  const address = order.addresses;
  if (!address) return 'Endereco nao informado';
  return [address.block, address.room, address.complement].filter(Boolean).join(', ');
};

const getPrimaryItem = (order: StoreOrder) => order.order_items?.[0] || null;

const getItemSummary = (order: StoreOrder) => {
  const items = order.order_items || [];
  if (items.length === 0) return 'Pedido sem itens';

  const first = items[0];
  const firstLabel = `${first.quantity}x ${first.product_name}${first.size_label ? ` ${first.size_label}` : ''}`;

  if (items.length === 1) return firstLabel;
  if (items.length === 2) {
    const second = items[1];
    return `${firstLabel} + ${second.quantity}x ${second.product_name}${second.size_label ? ` ${second.size_label}` : ''}`;
  }

  return `${firstLabel} + ${items.length - 1} itens`;
};

const getItemDetails = (order: StoreOrder) => {
  const primaryItem = getPrimaryItem(order);
  if (!primaryItem) return '';

  return [
    primaryItem.base,
    primaryItem.order_item_extras?.map((extra) => extra.extra_name).join(', '),
  ]
    .filter(Boolean)
    .join(' | ');
};

const getPaymentSummary = (order: StoreOrder) => {
  const method = paymentLabels[order.payment_method || ''] || order.payment_method || 'Pagamento';

  if (order.payment_status === 'paid') return `Pago - ${method}`;
  if (order.payment_status === 'pay_on_delivery') {
    return order.modality === 'delivery'
      ? `Paga na entrega - ${method}`
      : `Pagar no caixa - ${method}`;
  }
  if (order.payment_status === 'pending') return `Pendente - ${method}`;
  if (order.payment_status === 'failed') return `Falhou - ${method}`;
  if (order.payment_status === 'refunded') return `Estornado - ${method}`;

  return `${paymentStatusLabels[order.payment_status]} - ${method}`;
};

const getPaymentStyle = (order: StoreOrder) => {
  if (order.payment_status === 'paid') return 'bg-emerald-50 text-emerald-800 border-emerald-100';
  if (order.payment_status === 'pay_on_delivery') return 'bg-amber-50 text-amber-800 border-amber-100';
  if (order.payment_status === 'failed') return 'bg-[#bd002a] text-white border-[#bd002a]';
  return 'bg-[#f3eeee] text-[#5d3f3e] border-[#d8d0cf]';
};

const needsCounterPaymentConfirmation = (order: StoreOrder) =>
  order.modality === 'counter' && order.payment_status === 'pay_on_delivery';

const getCardStyle = (order: StoreOrder) => {
  if (order.modality === 'delivery') {
    return {
      cardBorder: 'border-l-blue-500',
      tag: 'bg-blue-600 text-white ring-blue-100',
      icon: Bike,
      label: 'Entrega',
    };
  }

  if (needsCounterPaymentConfirmation(order)) {
    return {
      cardBorder: 'border-l-red-500',
      tag: 'bg-red-600 text-white ring-red-100',
      icon: Store,
      label: 'Balcao',
    };
  }

  return {
    cardBorder: 'border-l-emerald-500',
    tag: 'bg-emerald-600 text-white ring-emerald-100',
    icon: Store,
    label: 'Balcao',
  };
};

const getOrderActions = (order: StoreOrder): Array<{ status: OrderStatus; label: string }> => {
  const status = normalizeStatus(order.status);

  if (status === 'new') return [{ status: 'preparing', label: 'Aceitar e preparar' }];
  if (status === 'preparing') return [{ status: 'ready', label: 'Pronto' }];
  if (status === 'ready') {
    return order.modality === 'delivery'
      ? [{ status: 'out_for_delivery', label: 'Saiu entrega' }]
      : [{ status: 'delivered', label: 'Retirado' }];
  }

  return [];
};

const buildOrderSummary = (order: StoreOrder) => {
  const lines = [
    `Pedido ${order.pickup_code || order.id.slice(0, 8)}`,
    `${getCustomerName(order)} ${getCustomerPhone(order)}`.trim(),
    `${order.modality === 'delivery' ? 'Entrega' : 'Retirada'} - ${getAddressLine(order)}`,
    `Pagamento: ${paymentLabels[order.payment_method || ''] || order.payment_method || 'Nao informado'} (${paymentStatusLabels[order.payment_status]})`,
    '',
    ...(order.order_items || []).map((item) => {
      const extras = item.order_item_extras?.map((extra) => extra.extra_name).join(', ');
      const details = [item.size_label, item.base, extras, item.notes].filter(Boolean).join(' | ');
      return `${item.quantity}x ${item.product_name}${details ? ` - ${details}` : ''}`;
    }),
  ];
  return lines.join('\n');
};

export default function Loja() {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StoreRole | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [search, setSearch] = useState('');
  const [statusError, setStatusError] = useState('');

  const canAccessStore = role === 'store' || role === 'admin';

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
        subtotal,
        total_price,
        payment_method,
        payment_status,
        status,
        modality,
        notes,
        pickup_code,
        created_at,
        updated_at,
        accepted_at,
        prepared_at,
        ready_at,
        out_for_delivery_at,
        delivered_at,
        cancelled_at,
        cancel_reason,
        profiles:user_id(name, phone, email),
        addresses:address_id(block, room, complement, street, number),
        order_items(
          *,
          order_item_extras(*)
        )
      `)
      .gte('created_at', start.toISOString())
      .order('created_at', { ascending: false });

    setLoadingOrders(false);

    if (error) {
      setStatusError('Nao foi possivel carregar os pedidos.');
      return;
    }

    const nextOrders = ((data || []) as unknown as StoreOrder[])
      .filter((order) => !['pending_payment', 'payment_failed', 'expired'].includes(order.status));
    setOrders(nextOrders);
    setSelectedOrder((current) => {
      if (!current) return nextOrders[0] || null;
      return nextOrders.find((order) => order.id === current.id) || nextOrders[0] || null;
    });
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
    if (!canAccessStore) return;

    loadOrders();

    const channel = supabase
      .channel('store-orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          loadOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [canAccessStore]);

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) => {
      const haystack = [
        order.id,
        order.pickup_code,
        getCustomerName(order),
        getCustomerPhone(order),
        getAddressLine(order),
        ...(order.order_items || []).map((item) => item.product_name),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(term);
    });
  }, [orders, search]);

  const groupedOrders = useMemo(() => {
    return [...productionColumns, ...finalColumns].reduce<Record<OrderStatus, StoreOrder[]>>((acc, column) => {
      acc[column.key] = filteredOrders.filter((order) => normalizeStatus(order.status) === column.key);
      return acc;
    }, {} as Record<OrderStatus, StoreOrder[]>);
  }, [filteredOrders]);

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

  const updateOrderStatus = async (order: StoreOrder, nextStatus: OrderStatus, reason?: string) => {
    setStatusError('');

    const timestamp = new Date().toISOString();
    const updates: Partial<StoreOrder> = { status: nextStatus };

    if (nextStatus === 'accepted' || (nextStatus === 'preparing' && normalizeStatus(order.status) === 'new')) {
      updates.accepted_at = timestamp;
    }
    if (nextStatus === 'preparing') updates.prepared_at = timestamp;
    if (nextStatus === 'ready') updates.ready_at = timestamp;
    if (nextStatus === 'out_for_delivery') updates.out_for_delivery_at = timestamp;
    if (nextStatus === 'delivered') updates.delivered_at = timestamp;
    if (nextStatus === 'cancelled') {
      updates.cancelled_at = timestamp;
      updates.cancel_reason = reason || 'Cancelado pela loja';
    }

    const { error } = await supabase.from('orders').update(updates).eq('id', order.id);

    if (error) {
      setStatusError('Nao foi possivel atualizar o pedido.');
      return;
    }

    await supabase.from('order_status_events').insert({
      order_id: order.id,
      old_status: order.status,
      new_status: nextStatus,
      changed_by: session?.user.id,
      reason: reason || null,
    });

    if (nextStatus === 'delivered' && ['cash', 'machine', 'vr'].includes(order.payment_method || '')) {
      await supabase.rpc('credit_order_points', { p_order_id: order.id });
    }

    await loadOrders();
  };

  const confirmCounterPayment = async (order: StoreOrder) => {
    setStatusError('');

    const timestamp = new Date().toISOString();
    const { error } = await supabase
      .from('orders')
      .update({ status: 'preparing', payment_status: 'paid', accepted_at: timestamp, prepared_at: timestamp })
      .eq('id', order.id);

    if (error) {
      setStatusError('Nao foi possivel confirmar o pagamento.');
      return;
    }

    await supabase.from('order_status_events').insert({
      order_id: order.id,
      old_status: order.status,
      new_status: 'preparing',
      changed_by: session?.user.id,
      reason: 'Pagamento confirmado no caixa',
    });

    await supabase.rpc('credit_order_points', { p_order_id: order.id });

    await loadOrders();
  };

  const cancelOrder = (order: StoreOrder) => {
    const reason = window.prompt('Motivo do cancelamento');
    if (reason === null) return;
    updateOrderStatus(order, 'cancelled', reason.trim() || 'Cancelado pela loja');
  };

  const copySummary = async (order: StoreOrder) => {
    await navigator.clipboard.writeText(buildOrderSummary(order));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f3eeee] flex items-center justify-center text-[#5d3f3e]">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Carregando loja
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#f3eeee] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white border border-[#e5e2e1] rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#bd002a] text-white flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl text-[#1c1b1b]">Loja Cosechas</h1>
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

  if (!canAccessStore) {
    return (
      <div className="min-h-screen bg-[#f3eeee] flex items-center justify-center px-4 text-center">
        <div className="max-w-sm bg-white border border-[#e5e2e1] rounded-lg p-6">
          <XCircle className="w-10 h-10 text-[#bd002a] mx-auto mb-3" />
          <h1 className="font-display font-extrabold text-xl mb-2">Acesso nao autorizado</h1>
          <p className="text-sm text-[#5d3f3e] mb-5">Seu usuario nao tem permissao de loja.</p>
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

  return (
    <div className="min-h-screen bg-[#f3eeee] text-[#1c1b1b]">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#d8d0cf] shadow-sm">
        <div className="px-4 sm:px-6 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#bd002a]">Operacao</p>
            <h1 className="font-display font-extrabold text-2xl">Loja Cosechas</h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a8a29e]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar pedido ou cliente"
                className="w-full sm:w-80 rounded-full border border-[#e5e2e1] bg-[#fcf9f8] pl-10 pr-4 py-3 text-sm outline-none focus:border-[#bd002a]"
              />
            </div>
            <button
              onClick={loadOrders}
              className="rounded-full border border-[#e5e2e1] bg-white px-4 py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
              Atualizar
            </button>
            <button
              onClick={() => supabase.auth.signOut()}
              className="rounded-full bg-[#1c1b1b] text-white px-4 py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {statusError && (
        <div className="mx-4 sm:mx-6 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {statusError}
        </div>
      )}

      <main className="p-4 sm:p-6 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5">
        <section className="space-y-4 overflow-x-auto pb-4">
          {[
            { title: 'Producao', columns: productionColumns, minWidth: 'min-w-[720px]' },
            { title: 'Entrega e fechamento', columns: finalColumns, minWidth: 'min-w-[720px]' },
          ].map((section) => (
            <div key={section.title} className={section.minWidth}>
              <h2 className="font-display font-extrabold text-sm uppercase tracking-wider text-[#5d3f3e] mb-2">
                {section.title}
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {section.columns.map((column) => {
                  const Icon = column.icon;
                  const columnOrders = groupedOrders[column.key] || [];

                  return (
                    <div key={column.key} className="rounded-lg border border-[#d8d0cf] bg-[#fbf8f7] min-h-[34vh] shadow-sm overflow-hidden">
                      <div className="p-3 bg-[#bd002a] text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <h3 className="font-display font-bold text-sm">{column.label}</h3>
                        </div>
                        <span className="text-xs font-bold bg-white/20 rounded-full px-2 py-1">{columnOrders.length}</span>
                      </div>

                      <div className="p-2 space-y-2">
                        {columnOrders.map((order) => {
                          const itemDetails = getItemDetails(order);
                          const primaryNote = getPrimaryItem(order)?.notes;
                          const modalityStyle = getCardStyle(order);
                          const ModalityIcon = modalityStyle.icon;
                          const paymentSummary = getPaymentSummary(order);

                          return (
                            <button
                              key={order.id}
                              onClick={() => setSelectedOrder(order)}
                              className={`w-full text-left rounded-lg border border-l-4 p-3 transition-all shadow-sm ${modalityStyle.cardBorder} ${
                                selectedOrder?.id === order.id
                                  ? 'border-[#bd002a] bg-white ring-2 ring-[#bd002a]/10'
                                  : 'border-[#d8d0cf] bg-white hover:border-[#bd002a]/50'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-display font-extrabold text-sm leading-tight flex-1">
                                  {getItemSummary(order)}
                                </p>
                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide shrink-0 ring-4 ${modalityStyle.tag}`}>
                                  <ModalityIcon className="w-3.5 h-3.5" />
                                  {modalityStyle.label}
                                </span>
                              </div>

                              {itemDetails && (
                                <p className="mt-2 text-xs text-[#5d3f3e] leading-snug line-clamp-2">
                                  {itemDetails}
                                </p>
                              )}

                              {primaryNote && (
                                <p className="mt-2 rounded-md bg-amber-50 border border-amber-100 px-2 py-1 text-xs font-bold text-amber-800 leading-snug">
                                  Obs: {primaryNote}
                                </p>
                              )}

                              <div className="mt-3 text-xs text-[#5d3f3e] leading-snug">
                                <p className="font-bold text-[#1c1b1b]">{getCustomerName(order)}</p>
                                <p className="truncate">{getAddressLine(order)}</p>
                              </div>

                              <p className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wide ${getPaymentStyle(order)}`}>
                                {paymentSummary}
                              </p>

                              <div className="mt-3 pt-2 border-t border-[#e5e2e1] flex items-center justify-between text-[11px] text-[#5d3f3e]">
                                <span className="rounded-md bg-[#f3eeee] px-2 py-1 font-bold">{order.pickup_code || `#${order.id.slice(0, 8)}`}</span>
                                <span className="font-bold text-[#1c1b1b]">{formatCurrency(Number(order.total_price))}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        <aside className="rounded-lg border border-[#e5e2e1] bg-white min-h-[70vh] overflow-hidden">
          {selectedOrder ? (
            <div className="h-full flex flex-col">
              <div className="p-5 border-b border-[#e5e2e1]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-[#5d3f3e]">Pedido</p>
                    <h2 className="font-display font-extrabold text-2xl">
                      {selectedOrder.pickup_code || `#${selectedOrder.id.slice(0, 8)}`}
                    </h2>
                    <p className="text-sm font-bold text-[#bd002a]">{statusLabels[selectedOrder.status]}</p>
                  </div>
                  <button
                    onClick={() => copySummary(selectedOrder)}
                    className="rounded-full border border-[#e5e2e1] p-3"
                    title="Copiar resumo"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-5 overflow-y-auto">
                <section>
                  <h3 className="font-display font-bold text-sm mb-2">Cliente</h3>
                  <div className="rounded-lg bg-[#f7f4f1] p-4 text-sm space-y-2">
                    <p className="font-bold">{getCustomerName(selectedOrder)}</p>
                    {getCustomerPhone(selectedOrder) && (
                      <a
                        href={`https://wa.me/${getCustomerPhone(selectedOrder).replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#0f7a45] font-bold"
                      >
                        <Phone className="w-4 h-4" />
                        {getCustomerPhone(selectedOrder)}
                      </a>
                    )}
                    <p className="text-[#5d3f3e]">{getAddressLine(selectedOrder)}</p>
                  </div>
                </section>

                <section>
                  <h3 className="font-display font-bold text-sm mb-2">Pagamento</h3>
                  <div className="rounded-lg bg-[#f7f4f1] p-4 text-sm grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#5d3f3e]">Forma</p>
                      <p className="font-bold">{paymentLabels[selectedOrder.payment_method || ''] || selectedOrder.payment_method || 'Nao informado'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#5d3f3e]">Status</p>
                      <p className="font-bold">{paymentStatusLabels[selectedOrder.payment_status]}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#5d3f3e]">Total</p>
                      <p className="font-bold">{formatCurrency(Number(selectedOrder.total_price))}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-[#5d3f3e]">Codigo</p>
                      <p className="font-bold">{selectedOrder.pickup_code || `#${selectedOrder.id.slice(0, 8)}`}</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="font-display font-bold text-sm mb-2">Itens</h3>
                  <div className="space-y-3">
                    {(selectedOrder.order_items || []).map((item) => (
                      <div key={item.id} className="rounded-lg border border-[#e5e2e1] p-4">
                        <div className="flex justify-between gap-3">
                          <div>
                            <p className="font-bold">{item.quantity}x {item.product_name}</p>
                            <p className="text-xs text-[#5d3f3e]">
                              {[item.size_label, item.base].filter(Boolean).join(' | ') || 'Sem variacao'}
                            </p>
                          </div>
                          <p className="text-sm font-bold">{formatCurrency(Number(item.unit_price) * item.quantity)}</p>
                        </div>
                        {item.order_item_extras && item.order_item_extras.length > 0 && (
                          <p className="mt-2 text-xs text-[#5d3f3e]">
                            Adicionais: {item.order_item_extras.map((extra) => extra.extra_name).join(', ')}
                          </p>
                        )}
                        {item.notes && <p className="mt-2 text-xs font-bold text-[#bd002a]">Obs: {item.notes}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="p-5 border-t border-[#e5e2e1] space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {needsCounterPaymentConfirmation(selectedOrder) && normalizeStatus(selectedOrder.status) === 'new' ? (
                    <button
                      onClick={() => confirmCounterPayment(selectedOrder)}
                      className="rounded-lg bg-red-600 text-white font-bold py-3 text-sm"
                    >
                      Pago
                    </button>
                  ) : (
                    getOrderActions(selectedOrder).map((action) => (
                      <button
                        key={action.status}
                        onClick={() => updateOrderStatus(selectedOrder, action.status)}
                        className="rounded-lg bg-[#bd002a] text-white font-bold py-3 text-sm"
                      >
                        {action.label}
                      </button>
                    ))
                  )}
                  {normalizeStatus(selectedOrder.status) !== 'cancelled' && normalizeStatus(selectedOrder.status) !== 'delivered' && (
                    <button
                      onClick={() => cancelOrder(selectedOrder)}
                      className="rounded-lg border border-[#bd002a] text-[#bd002a] font-bold py-3 text-sm"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[360px] flex items-center justify-center text-center p-8">
              <div>
                <PackageCheck className="w-10 h-10 text-[#a8a29e] mx-auto mb-3" />
                <h2 className="font-display font-bold text-lg">Sem pedido selecionado</h2>
                <p className="text-sm text-[#5d3f3e]">Escolha um pedido no quadro.</p>
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
