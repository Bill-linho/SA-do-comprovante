export default function ReceiptView({ receipt }) {
  if (!receipt) return null;
  const data = receipt.snapshot;
  return (
    <section className="receipt">
      <h2>{data.restaurant}</h2>
      <p>Comprovante de pedido — {data.code}</p>
      <p>Mesa: {data.table} · Cliente: {data.customer}</p>
      <hr />
      {data.items.map((item, index) => (
        <div className="line" key={index}>
          <span>{item.quantity}x {item.name}<small>{item.notes}</small></span>
          <b>R$ {item.subtotal.toFixed(2)}</b>
        </div>
      ))}
      <hr />
      <h3>Total: R$ {Number(data.total).toFixed(2)}</h3>
      <p className="muted">Este documento é um comprovante não fiscal do pedido.</p>
      <button onClick={() => window.print()}>Imprimir / Salvar PDF</button>
    </section>
  );
}
