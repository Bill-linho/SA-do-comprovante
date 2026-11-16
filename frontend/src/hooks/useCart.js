import { useMemo, useState } from 'react';

export function useCart(products) {
  const [cart, setCart] = useState({});
  const add = (id) => setCart(current => ({ ...current, [id]: (current[id] || 0) + 1 }));
  const remove = (id) => setCart(current => ({ ...current, [id]: Math.max(0, (current[id] || 0) - 1) }));
  const clear = () => setCart({});
  const items = useMemo(() => Object.entries(cart)
    .filter(([, quantity]) => quantity > 0)
    .map(([productId, quantity]) => ({ productId: Number(productId), quantity })), [cart]);
  const total = useMemo(() => products.reduce((sum, product) => sum + (cart[product.id] || 0) * Number(product.price), 0), [cart, products]);
  return { cart, add, remove, clear, items, total };
}
