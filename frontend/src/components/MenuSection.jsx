import ProductCard from './ProductCard';

export default function MenuSection({ products, cart, user, tables, tableId, setTableId, onSendOrder, total, onAdd, onRemove }) {
  return (
    <section id="cardapio">
      <div className="section-head">
        <div>
          <p className="eyebrow">FEITO NA HORA</p>
          <h1>Nosso cardápio</h1>
          <p className="muted">Escolha seus pratos e envie o pedido pelo tablet.</p>
        </div>
      </div>
      {products.length ? <div className="products">
        {products.map(product => <ProductCard key={product.id} product={product}
          quantity={cart[product.id] || 0} onAdd={() => onAdd(product.id)} onRemove={() => onRemove(product.id)} />)}
      </div> : <p className="muted">Nenhum produto disponível no momento.</p>}
      {user && <div className="panel order-box">
        <h2>Finalizar pedido</h2>
        <label>Mesa
          <select value={tableId} onChange={event => setTableId(event.target.value)} required>
            {tables.map(table => <option key={table.id} value={String(table.id)}>Mesa {table.number} · {table.capacity} lugares</option>)}
          </select>
        </label>
        <button onClick={onSendOrder} disabled={!tables.length || total <= 0}>Enviar pedido · R$ {total.toFixed(2)}</button>
      </div>}
    </section>
  );
}
