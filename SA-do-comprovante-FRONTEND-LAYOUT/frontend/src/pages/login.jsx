
import "../styles/auth.css";

export default function Login({ onNavigate }) {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Login demonstrativo. Falta conectar ao backend.");
    // Depois, integrar a autenticação real.
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">BA</div>
          <span>Bar da Amizade</span>
        </div>

        <div className="auth-heading">
          <h1>Bem-vindo de volta</h1>
          <p>Entre com seus dados para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-cpf">CPF</label>
          <input
            id="login-cpf"
            name="cpf"
            type="text"
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
            autoComplete="off"
            required
          />

          <label htmlFor="login-telefone">Telefone</label>
          <input
            id="login-telefone"
            name="telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            maxLength={15}
            required
          />

          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            autoComplete="email"
            required
          />

          <label htmlFor="login-senha">Senha</label>
          <input
            id="login-senha"
            name="senha"
            type="password"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            required
          />

          <button type="submit" className="auth-button">
            Entrar
          </button>
        </form>

        <p className="auth-switch">
          Ainda não tem uma conta?
          <button
            type="button"
            onClick={() => onNavigate("cadastro")}
          >
            Criar conta
          </button>
        </p>

        <footer className="auth-footer">
          Bar da Amizade — um lugar para reunir amigos
        </footer>
      </section>
    </main>
  );
}
