import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Header({ user, onLogout }) {
  return (
    <header>
      <Link to="/" className="brand">🍽️ Restaurante</Link>
      <nav>
        <NavLink to="/cardapio">Cardápio</NavLink>
        <NavLink to="/reservas">Reservas</NavLink>
        <NavLink to="/configuracoes">Configurações</NavLink>
        {user && user.role === 'COZINHEIRO' && <NavLink to="/cozinha">Cozinha</NavLink>}
        {user && user.role !== 'COZINHEIRO' && <NavLink to="/pedidos">Pedidos</NavLink>}
        {user && ['ADMIN', 'GERENTE'].includes(user.role) && <NavLink to="/admin/cardapio">Administração</NavLink>}
      </nav>
      <div>
        {user ? <>
          <span>{user.name} · {user.role}</span>
          <button className="secondary" onClick={onLogout}>Sair</button>
        </> : <>
          <span>Área do cliente</span>
          <Link to="/login">Entrar</Link>
        </>}
      </div>
    </header>
  );
}
