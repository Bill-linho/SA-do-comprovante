import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import { useCallback, useEffect, useState } from 'react';
import ReservaForm from './components/reservaForm';
import ReservaList from './components/reservaList';
import {
  listarReservas,
  atualizarStatusReserva,
  cancelarReserva
} from './services/reservasService';


function AppRoutes() {
  const navigate = useNavigate();

  const onNavigate = (tela) => {
    const rotas = {
      home: "/",
      login: "/login",
      cadastro: "/cadastro",
    };

    navigate(rotas[tela] || "/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<Home onNavigate={onNavigate} />}
      />

      <Route
        path="/login"
        element={<Login onNavigate={onNavigate} />}
      />

      <Route
        path="/cadastro"
        element={<Cadastro onNavigate={onNavigate} />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  const [reservas, setReservas] = useState([]);
  const [nome, setNome] = useState('');
  const [data, setData] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      setErro('');
      setCarregando(true);
      const resposta = await listarReservas({
        ...(nome ? { nome } : {}),
        ...(data ? { data } : {})
      });
      setReservas(resposta.data);
    } catch {
      setErro('Não foi possível carregar as reservas.');
    } finally {
      setCarregando(false);
    }
  }, [nome, data]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alterarStatus = async (id, status) => {
    try {
      await atualizarStatusReserva(id, status);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha ao atualizar status.');
    }
  };

  const cancelar = async (id) => {
    if (!window.confirm('Deseja cancelar esta reserva?')) return;
    try {
      await cancelarReserva(id);
      await carregar();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha ao cancelar reserva.');
    }
  };

  return (
    <main>
      <h1>Reservas do Restaurante</h1>

      <section>
        <h2>Nova reserva</h2>
        <ReservaForm onCriada={carregar} />
      </section>

      <section>
        <h2>Pesquisar reservas</h2>
        <label>
          Nome do cliente
          <input value={nome} onChange={(event) => setNome(event.target.value)} />
        </label>
        <label>
          Data
          <input type="date" value={data} onChange={(event) => setData(event.target.value)} />
        </label>
        <button onClick={carregar}>Pesquisar</button>
        <button onClick={() => { setNome(''); setData(''); }}>Limpar filtros</button>
      </section>

      {erro && <p role="alert">{erro}</p>}
      {carregando
        ? <p>Carregando reservas...</p>
        : <ReservaList reservas={reservas}
            onStatusChange={alterarStatus}
            onCancelar={cancelar} />}
    </main>
  );
}