export default function AuthForm({ registerMode, setRegisterMode, name, setName, cpf, setCpf, phone, setPhone, email, setEmail, password, setPassword, onSubmit, loading = false }) {
  return (
    <section className="panel auth">
      <h1>{registerMode ? 'Criar conta' : 'Acessar sistema'}</h1>
      <form onSubmit={onSubmit}>
        {registerMode && <>
          <label>Nome completo
            <input value={name} onChange={event => setName(event.target.value)} required minLength="3" maxLength="120" autoComplete="name" />
          </label>
          <label>CPF
            <input value={cpf} onChange={event => setCpf(event.target.value.replace(/\D/g, '').slice(0, 11))} required inputMode="numeric" placeholder="Somente números" autoComplete="off" minLength="11" maxLength="11" />
          </label>
          <label>Telefone / WhatsApp
            <input type="tel" value={phone} onChange={event => setPhone(event.target.value.replace(/[^0-9()+\- ]/g, '').slice(0, 20))} required minLength="10" maxLength="20" autoComplete="tel" placeholder="(48) 99999-9999" />
          </label>
        </>}
        <label>E-mail
          <input type="email" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" />
        </label>
        <label>Senha
          <input type="password" value={password} onChange={event => setPassword(event.target.value)} required minLength="8" autoComplete={registerMode ? 'new-password' : 'current-password'} />
        </label>
        <button disabled={loading}>{loading ? 'Aguarde...' : registerMode ? 'Cadastrar' : 'Entrar'}</button>
        {registerMode && <p className="muted">Seus dados serão utilizados para identificação, atendimento e gestão dos pedidos. Informe apenas dados verdadeiros.</p>}
      </form>
      <button type="button" className="link" disabled={loading} onClick={() => setRegisterMode(!registerMode)}>
        {registerMode ? 'Já tenho conta' : 'Quero me cadastrar'}
      </button>
    </section>
  );
}
