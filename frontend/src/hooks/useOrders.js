import { useCallback, useEffect, useState } from 'react';
import { orderService } from '../services/orderService';

const ORDER_ROLES = ['CLIENTE','COZINHEIRO','GARCOM','ATENDENTE','CAIXA','GERENTE','ADMIN'];

export function useOrders(user, onError) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const canList = Boolean(user && ORDER_ROLES.includes(user.role));

  const refreshOrders = useCallback(async () => {
    if (!canList) { setOrders([]); return; }
    setLoading(true);
    try { setOrders(await orderService.list()); }
    catch (error) { onError?.(error.message); }
    finally { setLoading(false); }
  }, [canList, onError]);

  useEffect(() => { refreshOrders(); }, [refreshOrders]);

  const createOrder = async (payload) => {
    const result = await orderService.create(payload);
    await refreshOrders();
    return result;
  };
  const changeStatus = async (id, status) => { await orderService.updateStatus(id, status); await refreshOrders(); };
  const pay = async (id, method) => { await orderService.registerPayment(id, method); await refreshOrders(); };
  return { orders, loading, refreshOrders, createOrder, changeStatus, pay };
}
