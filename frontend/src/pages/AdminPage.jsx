import React from 'react';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import ProductManager from '../components/admin/ProductManager';
import StaffManager from '../components/admin/StaffManager';
import { useAuth } from '../contexts/AuthContext';

export default function AdminPage({ showNotice }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user || !['ADMIN', 'GERENTE'].includes(user.role)) return <Navigate to="/" replace />;

  const showStaff = location.pathname.endsWith('/funcionarios');
  return (
    <section className="admin-page">
      <div className="panel admin-heading">
        <p className="eyebrow">ÁREA RESTRITA · {user.role}</p>
        <h1>Painel de administração</h1>
        <p className="muted">Gerencie os pratos e acompanhe os acessos da equipe.</p>
        <nav className="admin-tabs">
          <NavLink to="/admin/cardapio">Cardápio</NavLink>
          {user.role === 'ADMIN' && <NavLink to="/admin/funcionarios">Funcionários</NavLink>}
        </nav>
      </div>
      {showStaff
        ? (user.role === 'ADMIN' ? <StaffManager notify={showNotice} /> : <Navigate to="/admin/cardapio" replace />)
        : <ProductManager notify={showNotice} />}
    </section>
  );
}
