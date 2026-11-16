
import React from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import Notice from "./components/Notice";

import { useAuth } from "./contexts/AuthContext";
import { useNotice } from "./hooks/useNotice";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MenuPage from "./pages/MenuPage";
import OrdersPage from "./pages/OrdersPage";
import ReservationsPage from "./pages/ReservationsPage";
import AdminPage from "./pages/AdminPage";
import KitchenPage from "./pages/KitchenPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const { user, logout } = useAuth();

  const { message, showNotice, clearNotice } = useNotice();

  function handleLogout() {
    logout();
    showNotice("Você saiu do sistema.");
  }

  return (
    <div className="app">
      <Header
        user={user}
        onLogout={handleLogout}
      />


      <main>
        <Notice
          message={message}
          onClose={clearNotice}
        />

        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/login"
            element={
              user ? (
                <Navigate to={user.role === 'COZINHEIRO' ? '/cozinha' : '/cardapio'} replace />
              ) : (
                <LoginPage showNotice={showNotice} />
              )
            }
          />

          <Route
            path="/cardapio"
            element={<MenuPage showNotice={showNotice} />}
          />

          <Route
            path="/reservas"
            element={<ReservationsPage showNotice={showNotice} />}
          />

          <Route path="/cozinha" element={<KitchenPage showNotice={showNotice} />} />

          <Route path="/configuracoes" element={<SettingsPage />} />

          <Route
            path="/pedidos"
            element={<OrdersPage showNotice={showNotice} />}
          />

          <Route
            path="/admin/*"
            element={<AdminPage showNotice={showNotice} />}
          />

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>

        <footer>
          Restaurante · Sistema de pedidos e reservas
        </footer>
      </main>
    </div>
  );
}
