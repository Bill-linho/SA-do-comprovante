import React, { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';

const money = value => Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function KitchenPage({ showNotice }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await orderService.list();
      setOrders(data.filter(order => ['RECEBIDO', 'EM_PREPARACAO'].includes(order.status)));
    } catch (error) {
      if (!silent) showNotice(error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(() => refresh(true), 15000);
    return () => window.clearInterval(interval);
  }, [refresh]);

  if (!user || user.role !== 'COZINHEIRO') return <Navigate to="/login" replace />;

  async function advance(order) {
    const status = order.status === 'RECEBIDO' ? 'EM_PREPARACAO' : 'PRONTO';
    setBusyId(order.id);
    try {
      await orderService.updateStatus(order.id, status);
      showNotice(status === 'PRONTO' ? `Pedido #${order.id} pronto! O garçom já pode entregar.` : `Pedido #${order.id} enviado para preparo.`);
      await refresh(true);
    } catch (error) {
      showNotice(error.message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="kitchen-page">
      <div className="kitchen-heading">
        <div><span className="eyebrow">ÁREA DA COZINHA</span><h1>Painel de pedidos</h1><p>Olá, {user.name}. Os novos pedidos aparecem automaticamente.</p></div>
        <button className="secondary" onClick={() => refresh()}>Atualizar agora</button>
      </div>
      <div className="kitchen-info"><strong>{orders.length}</strong><span>{orders.length === 1 ? 'pedido aguardando na cozinha' : 'pedidos aguardando na cozinha'}</span><small>Atualização automática a cada 15 segundos</small></div>
      {loading ? <p className="muted">Carregando pedidos...</p> : orders.length === 0 ? (
        <div className="kitchen-empty"><span>🍳</span><h2>Nenhum pedido pendente</h2><p>Quando um novo pedido entrar, ele aparecerá aqui.</p></div>
      ) : (
        <div className="kitchen-orders">
          {orders.map(order => (
            <article className={`kitchen-order ${order.status === 'RECEBIDO' ? 'is-new' : 'is-preparing'}`} key={order.id}>
              <header className="kitchen-order-header"><div><span className="kitchen-order-number">PEDIDO #{order.id}</span><h2>Mesa {order.table?.number ?? '—'}</h2></div><span className="kitchen-status">{order.status === 'RECEBIDO' ? 'NOVO PEDIDO' : 'EM PREPARAÇÃO'}</span></header>
              <div className="kitchen-items">
                {(order.items || []).map(item => <div className="kitchen-item" key={item.id}><strong>{item.quantity}×</strong><span>{item.Product?.name || item.product?.name || 'Item do pedido'}</span>{item.notes && <small>{item.notes}</small>}</div>)}
              </div>
              {order.notes && <div className="kitchen-notes"><strong>Observações do pedido:</strong> {order.notes}</div>}
              <div className="kitchen-order-footer"><span>{new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} · {money(order.total)}</span><button disabled={busyId === order.id} onClick={() => advance(order)}>{busyId === order.id ? 'Salvando...' : order.status === 'RECEBIDO' ? 'Iniciar preparo' : 'Finalizar preparo'}</button></div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
