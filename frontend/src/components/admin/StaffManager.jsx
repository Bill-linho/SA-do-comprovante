import React, { useEffect, useState } from 'react';
import { staffService } from '../../services/staffService';

const ROLES = ['GERENTE', 'ATENDENTE', 'COZINHEIRO', 'GARCOM', 'CAIXA'];
const initial = { name: '', email: '', password: '', role: 'ATENDENTE' };

export default function StaffManager({ notify }) {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  async function load() { setStaff(await staffService.list()); }
  useEffect(() => { load().catch(error => notify(error.message)); }, []);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await staffService.create(form);
      setForm(initial);
      await load();
      notify('Funcionário cadastrado. Ele já pode entrar com o e-mail e a senha definidos.');
    } catch (error) { notify(error.message); }
    finally { setBusy(false); }
  }

  async function toggleActive(person) {
    try {
      await staffService.update(person.id, { active: !person.active });
      await load();
      notify(person.active ? 'Acesso do funcionário desativado.' : 'Acesso do funcionário reativado.');
    } catch (error) { notify(error.message); }
  }

  async function changeRole(person, role) {
    try {
      await staffService.update(person.id, { role });
      await load();
      notify('Cargo atualizado.');
    } catch (error) { notify(error.message); }
  }

  return (
    <section className="panel admin-panel">
      <h2>Funcionários</h2>
      <p className="muted">Crie contas individuais e atribua apenas os cargos operacionais. O administrador principal não é gerenciado por esta tela.</p>
      <form className="admin-form" onSubmit={submit}>
        <h3>Cadastrar funcionário</h3>
        <label>Nome completo<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required minLength="3" /></label>
        <div className="admin-grid">
          <label>E-mail<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
          <label>Cargo<select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>{ROLES.map(role => <option key={role} value={role}>{role}</option>)}</select></label>
        </div>
        <label>Senha inicial (mínimo 8 caracteres)<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength="8" autoComplete="new-password" /></label>
        <button disabled={busy}>{busy ? 'Cadastrando...' : 'Cadastrar funcionário'}</button>
      </form>

      <h3>Equipe cadastrada ({staff.length})</h3>
      <div className="admin-list">
        {staff.map(person => (
          <article className="admin-list-row" key={person.id}>
            <div><strong>{person.name}</strong><p>{person.email}</p><small>{person.active ? 'Acesso ativo' : 'Acesso desativado'}</small></div>
            <div className="staff-actions">
              <select aria-label={`Cargo de ${person.name}`} value={person.role} onChange={e => changeRole(person, e.target.value)}>
                {ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
              <button type="button" className="secondary" onClick={() => toggleActive(person)}>{person.active ? 'Desativar' : 'Reativar'}</button>
            </div>
          </article>
        ))}
        {!staff.length && <p className="muted">Nenhum funcionário cadastrado.</p>}
      </div>
    </section>
  );
}
