import { useState } from 'react';
import { criarReserva } from '../services/reservasService';

const estadoInicial = {
  nome: '',
  telefone: '',
  email: '',
  data_reserva: '',
  horario: '',
  quantidade_pessoas: 2,
  observacoes: ''
};

export default function ReservaForm({ onCriada }) {
  const [form, setForm] = useState(estadoInicial);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  const alterar = (event) => {
    const { name, value } = event.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  };

  const enviar = async (event) => {
    event.preventDefault();
    setErro('');

    if (!form.telefone.trim() && !form.email.trim()) {
      setErro('Informe telefone ou e-mail para contato.');
      return;
    }

    try {
      setEnviando(true);
      await criarReserva({
        ...form,
        quantidade_pessoas: Number(form.quantidade_pessoas)
      });
      setForm(estadoInicial);
      onCriada();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Não foi possível criar a reserva.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar}>
      <label>
        Nome
        <input name="nome" value={form.nome} onChange={alterar} required minLength={2} />
      </label>

      <label>
        Telefone
        <input name="telefone" value={form.telefone} onChange={alterar} />
      </label>

      <label>
        E-mail
        <input name="email" type="email" value={form.email} onChange={alterar} />
      </label>

      <label>
        Data
        <input name="data_reserva" type="date" value={form.data_reserva} onChange={alterar} required />
      </label>

      <label>
        Horário
        <input name="horario" type="time" value={form.horario} onChange={alterar} required />
      </label>

      <label>
        Quantidade de pessoas
        <input name="quantidade_pessoas" type="number" min="1" max="30"
          value={form.quantidade_pessoas} onChange={alterar} required />
      </label>

      <label>
        Observações
        <textarea name="observacoes" value={form.observacoes} onChange={alterar} maxLength={500} />
      </label>

      {erro && <p role="alert">{erro}</p>}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Solicitar reserva'}
      </button>
    </form>
  );
}