import { useState } from 'react';
import OrdersSection from '../components/OrdersSection';
import ReceiptView from '../components/ReceiptView';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { orderService } from '../services/orderService';

export default function OrdersPage({ showNotice }) {
  const { user } = useAuth();
  const [receipt, setReceipt] = useState(null);
  const { orders, loading, refreshOrders, changeStatus, pay } = useOrders(user, showNotice);
  if (!user) return <section className="panel"><h2>Pedidos</h2><p>Entre na sua conta para consultar os pedidos.</p></section>;

  async function viewReceipt(id) {
    try { setReceipt(await orderService.getReceipt(id)); }
    catch (error) { showNotice(error.message); }
  }

  async function run(action, ...args) {
    try {
      await action(...args);
      showNotice('Operação realizada com sucesso.');
    } catch (error) { showNotice(error.message); }
  }

  const visibleOrders = user.role === 'GARCOM' ? orders.filter(order => order.status === 'PRONTO') : orders;

  return <>
    {loading && <p className="muted">Carregando pedidos...</p>}
    <OrdersSection user={user} orders={visibleOrders} onRefresh={refreshOrders}
      onChangeStatus={(id, status) => run(changeStatus, id, status)}
      onPay={(id, method) => run(pay, id, method)} onViewReceipt={viewReceipt} />
    <ReceiptView receipt={receipt} />
  </>;
}
