import { useState } from 'react';
import MenuSection from '../components/MenuSection';
import ReceiptView from '../components/ReceiptView';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';
import { useMenu } from '../hooks/useMenu';
import { orderService } from '../services/orderService';

export default function MenuPage({ showNotice }) {
  const { user } = useAuth();
  const { products, tables, loading } = useMenu(showNotice);
  const cart = useCart(products);
  const [tableId, setTableId] = useState('');
  const [receipt, setReceipt] = useState(null);

  const selectedTableId = tableId || (tables[0] ? String(tables[0].id) : '');

  async function sendOrder() {
    if (!user) return showNotice('Entre na sua conta para enviar um pedido.');
    if (!cart.items.length) return showNotice('Adicione pelo menos um produto.');
    if (!selectedTableId) return showNotice('Nenhuma mesa disponível para o pedido.');
    try {
      const result = await orderService.create({ tableId: Number(selectedTableId), items: cart.items });
      setReceipt(result.receipt);
      cart.clear();
      showNotice('Pedido enviado! Comprovante gerado automaticamente.');
    } catch (error) { showNotice(error.message); }
  }

  return <>
    {loading && <p className="muted">Carregando cardápio...</p>}
    {!loading && <MenuSection products={products} cart={cart.cart}
      user={user} tables={tables} tableId={selectedTableId}
      setTableId={setTableId} onSendOrder={sendOrder} total={cart.total}
      onAdd={cart.add} onRemove={cart.remove} />}
    <ReceiptView receipt={receipt} />
  </>;
}
