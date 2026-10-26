import { useState } from "react";

import Home from "./pages/home";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";

export default function App() {
  const [tela, setTela] = useState("login");

  return (
    <>
      {tela === "login" && (
        <Login onNavigate={setTela} />
      )}

      {tela === "cadastro" && (
        <Cadastro onNavigate={setTela} />
      )}

      {tela === "home" && (
        <Home onNavigate={setTela} />
      )}
    </>
  );
}