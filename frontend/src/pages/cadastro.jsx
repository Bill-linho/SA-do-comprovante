
import "../styles/auth.css";

export default function Cadastro({ onNavigate }) {
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const cpf = form.cpf.value.replace(/\D/g, "");
    const telefone = form.telefone.value.replace(/\D/g, "");

    if (cpf.length !== 11) {
      alert("Digite um CPF com 11 números.");
      return;
    }

    if (telefone.length < 10 || telefone.length > 11) {
      alert("Digite um telefone válido com DDD.");
      return;
    }

    if (form.senha.value !== form.confirmarSenha.value) {
      alert("As senhas não coincidem.");
      return;
    }

    alert("Dados validados! Falta conectar o cadastro ao backend.");
  }
  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">BA</div>
          <span>Bar da Amizade</span>
        </div>

        <div className="auth-heading">
          <h1>Crie sua conta</h1>
          <p>Preencha seus dados para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="cadastro-nome">Nome completo</label>
          <input
            id="cadastro-nome"
            name="nome"
            type="text"
            placeholder="Digite seu nome completo"
            autoComplete="name"
            minLength={3}
            required
          />

          <label htmlFor="cadastro-cpf">CPF</label>
          <input
            id="cadastro-cpf"
            name="cpf"
            type="text"
            placeholder="000.000.000-00"
            inputMode="numeric"
            maxLength={14}
            autoComplete="off"
            required
          />

          <label htmlFor="cadastro-telefone">Telefone</label>
          <input
            id="cadastro-telefone"
            name="telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            autoComplete="tel"
            maxLength={15}
            required
          />

          <label htmlFor="cadastro-email">E-mail</label>
          <input
            id="cadastro-email"
            name="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            autoComplete="email"
            required
          />

          <label htmlFor="cadastro-senha">Senha</label>
          <input
            id="cadastro-senha"
            name="senha"
            type="password"
            placeholder="Mínimo de 8 caracteres"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirmar-senha">Confirmar senha</label>
          <input
            id="confirmar-senha"
            name="confirmarSenha"
            type="password"
            placeholder="Digite a senha novamente"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <button type="submit" className="auth-button">
            Criar minha conta
          </button>
        </form>

        <p className="auth-switch">
          Já possui uma conta?
          <button
            type="button"
            onClick={() => onNavigate("login")}
          >
            Fazer login
          </button>
        </p>

        <footer className="auth-footer">
          Bar da Amizade — um lugar para reunir amigos
        </footer>
      </section>
    </main>
  );
}