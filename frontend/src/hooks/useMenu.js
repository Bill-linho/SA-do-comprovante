import { useCallback, useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { tableService } from '../services/tableService';

export function useMenu(onError) {
  const [products, setProducts] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshMenu = useCallback(async () => {
    setLoading(true);
    try {
      const [productList, tableList] = await Promise.all([productService.list(), tableService.list()]);
      setProducts(productList);
      setTables(tableList);
    } catch (error) { onError?.(error.message); throw error; }
    finally { setLoading(false); }
  }, [onError]);

  useEffect(() => { refreshMenu().catch(() => {}); }, [refreshMenu]);
  return { products, tables, loading, refreshMenu };
}
