import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import React from "react";

export default function LoginPage({ showNotice }) {
  const { login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [registerMode, setRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function submit(event) {
    event.preventDefault();
    try {
      if (registerMode) {
        await register({ name, cpf, phone, email, password });
        setRegisterMode(false);
        setPassword('');
        setCpf('');
        setPhone('');
        showNotice('Cadastro realizado. Agora entre com seu e-mail e senha.');
      } else {
        const loggedUser = await login({ email, password });
        showNotice('Login realizado com sucesso.');
        navigate(loggedUser.role === 'COZINHEIRO' ? '/cozinha' : '/cardapio');
      }
    } catch (error) { showNotice(error.message); }
  }

  return <AuthForm registerMode={registerMode} setRegisterMode={setRegisterMode}
    name={name} setName={setName} cpf={cpf} setCpf={setCpf} phone={phone} setPhone={setPhone} email={email} setEmail={setEmail}
    password={password} setPassword={setPassword} onSubmit={submit} loading={loading} />;
}
