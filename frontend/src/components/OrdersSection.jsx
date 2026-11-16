const STATUS_ROLES = ['ADMIN','GERENTE','ATENDENTE','COZINHEIRO','GARCOM'];
const PAYMENT_ROLES = ['ADMIN','GERENTE','ATENDENTE','CAIXA'];

export default function OrdersSection({ user, orders, onRefresh, onChangeStatus, onPay, onViewReceipt }) {
  const canChangeStatus = STATUS_ROLES.includes(user?.role);
  const canRegisterPayment = PAYMENT_ROLES.includes(user?.role);
  const statusActions = user?.role === 'GARCOM' ? ['ENTREGUE'] : user?.role === 'COZINHEIRO' ? [] : ['EM_PREPARACAO','PRONTO','ENTREGUE'];
  return (
    <section id="pedidos" className="panel">
      <div className="section-head">
        <h2>Pedidos</h2>
        <button className="secondary" onClick={onRefresh}>Atualizar</button>
      </div>
      {orders.map(order => (
        <article className="order-row" key={order.id}>
          <div>
            <b>Pedido #{order.id} · Mesa {order.table?.number}</b>
            <p>{order.status} · R$ {Number(order.total).toFixed(2)} · {order.paymentStatus === 'PAGO' ? `Pago (${order.paymentMethod || '—'})` : 'Aguardando pagamento'}</p>
            {order.receipt && <button className="link" onClick={() => onViewReceipt(order.receipt.id)}>Consultar comprovante</button>}
          </div>
          <div className="actions">
            {canChangeStatus && statusActions.map(status => (
              <button className="secondary" key={status} onClick={() => onChangeStatus(order.id, status)}>{status === 'ENTREGUE' ? 'Confirmar entrega na mesa' : status.replace('_',' ')}</button>
            ))}
            {canRegisterPayment && ['DINHEIRO','CARTAO','PIX'].map(method => (
              <button key={method} onClick={() => onPay(order.id, method)} disabled={order.paymentStatus === 'PAGO'}>Registrar {method}</button>
            ))}
          </div>
        </article>
      ))}
      {!orders.length && <p className="muted">Nenhum pedido encontrado.</p>}
    </section>
  );
}
