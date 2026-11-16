import { Link } from 'react-router-dom';
import React from "react";

export default function HomePage() {
  return (
    <section className="panel">
      <p className="eyebrow">BEM-VINDO</p>
      <h1>Seu restaurante, em um só lugar</h1>
      <p className="muted">Consulte o cardápio, faça seu pedido pelo tablet ou solicite uma reserva.</p>
      <div className="actions">
        <Link className="button-link" to="/cardapio">Ver cardápio</Link>
        <Link className="button-link secondary" to="/reservas">Fazer reserva</Link>
      </div>
    </section>
  );
}
