export default function ProductCard({ product, quantity, onAdd, onRemove }) {
  return (
    <article className="product">
      {product.imageUrl
        ? <img src={product.imageUrl} alt={product.name} />
        : <div className="placeholder">🍲</div>}
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <b>R$ {Number(product.price).toFixed(2)}</b>
        <div className="qty">
          <button className="secondary" onClick={onRemove}>−</button>
          <strong>{quantity}</strong>
          <button onClick={onAdd}>+</button>
        </div>
      </div>
    </article>
  );
}
