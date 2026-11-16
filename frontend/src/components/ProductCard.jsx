export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <article className="product">
      <div className="product-media">
        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} loading="lazy" /> : <div className="placeholder" aria-hidden="true">🍲</div>}
        {quantity > 0 && <span className="product-badge">{quantity} no pedido</span>}
      </div>
      <div className="product-body">
        <div className="product-title-row"><h3>{product.name}</h3><b>R$ {Number(product.price).toFixed(2)}</b></div>
        <p>{product.description || 'Feito na hora com ingredientes selecionados.'}</p>
        <div className="qty">
          <button type="button" className="secondary" onClick={onRemove} disabled={quantity === 0} aria-label={`Remover ${product.name}`}>−</button>
          <strong aria-live="polite">{quantity}</strong>
          <button type="button" onClick={onAdd} aria-label={`Adicionar ${product.name}`}>+</button>
        </div>
      </div>
    </article>
  );
}
