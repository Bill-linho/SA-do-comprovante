import ProductCard from './ProductCard';
import { useMemo, useState } from 'react';

export default function MenuSection({ products, cart, user, tables, tableId, setTableId, onSendOrder, total, onAdd, onRemove }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const categories = useMemo(() => ['Todos', ...new Set(products.map(product => product.category?.name || product.categoryName).filter(Boolean))], [products]);
  const visibleProducts = useMemo(() => products.filter(product => {
    const productCategory = product.category?.name || product.categoryName;
    const matchesCategory = category === 'Todos' || productCategory === category;
    const matchesQuery = `${product.name} ${product.description || ''}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'));
    return matchesCategory && matchesQuery;
  }), [products, category, query]);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  return (
    <section id="cardapio" className="menu-page">
      <div className="menu-hero">
        <div>
          <p className="eyebrow">SABOR FEITO NA HORA</p>
          <h1>O que vai ser hoje?</h1>
          <p>Pratos preparados com carinho, do nosso fogão direto para a sua mesa.</p>
        </div>
        <div className="menu-hero-mark" aria-hidden="true">✳</div>
      </div>
      {products.length > 0 && <div className="menu-toolbar">
        <label className="menu-search"><span aria-hidden="true">⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar no cardápio" aria-label="Buscar no cardápio" /></label>
        {categories.length > 1 && <div className="menu-categories" aria-label="Categorias do cardápio">
          {categories.map(item => <button key={item} type="button" className={category === item ? 'category-chip active' : 'category-chip'} onClick={() => setCategory(item)}>{item}</button>)}
        </div>}
      </div>}
      <div className={user ? 'menu-content-grid has-order' : 'menu-content-grid'}>
        <div className="menu-results">
          {products.length ? visibleProducts.length ? <div className="products">
            {visibleProducts.map(product => <ProductCard key={product.id} product={product} quantity={cart[product.id] || 0} onAdd={() => onAdd(product.id)} onRemove={() => onRemove(product.id)} />)}
          </div> : <div className="menu-empty"><strong>Nenhum prato encontrado</strong><span>Tente buscar por outro nome ou escolha outra categoria.</span></div> : <div className="menu-empty"><strong>Cardápio em preparo</strong><span>Nenhum produto disponível no momento. Volte em breve!</span></div>}
        </div>
      {user && <div className="panel order-box">
        <div className="order-box-heading"><div><p className="eyebrow">SUA SELEÇÃO</p><h2>Seu pedido</h2></div><span className="cart-count">{cartCount} {cartCount === 1 ? 'item' : 'itens'}</span></div>
        <p className="muted order-hint">Escolha a mesa e confirme quando estiver tudo pronto.</p>
        <label>Mesa<select value={tableId} onChange={event => setTableId(event.target.value)} required>
          {tables.map(table => <option key={table.id} value={String(table.id)}>Mesa {table.number} · {table.capacity} lugares</option>)}
        </select></label>
        <div className="order-total"><span>Total</span><strong>R$ {total.toFixed(2)}</strong></div>
        <button className="order-submit" onClick={onSendOrder} disabled={!tables.length || total <= 0}>Enviar pedido <span aria-hidden="true">→</span></button>
      </div>}
      </div>
    </section>
  );
}
