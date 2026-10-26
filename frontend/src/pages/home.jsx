
import "../styles/home.css";

export default function Home({ onNavigate }) {
  return (
    <main className="bar-home">
      <header className="bar-header">
        <a className="bar-brand" href="#inicio">
          <span className="brand-symbol">✳</span>
          <span>
            BAR
            <small> DA AMIZADE</small>
          </span>
        </a>

        <nav className="bar-nav" aria-label="Navegação principal">
          <a href="#inicio">Início</a>
          <a href="#mesas">Mesas</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#reservas">Reservas</a>
          <a href="#contato">Contato</a>
        </nav>

        <button
          className="bar-login-button"
          onClick={() => onNavigate?.("login")}
        >
          Entrar
        </button>
      </header>

      <section className="bar-hero" id="inicio">
        <div className="bar-hero-content">
          <span className="bar-eyebrow">
            BOA COMIDA • BOA MÚSICA • BOAS AMIZADES
          </span>

          <h1>
            Bar da
            <br />
            <span>Amizade</span>
          </h1>

          <p>
            O lugar perfeito para reunir os amigos,
            aproveitar bons momentos e brindar à vida.
          </p>

          <div className="bar-hero-actions">
            <a className="bar-button" href="#mesas">
              Conheça nossas mesas
            </a>

            <a className="bar-button bar-button-outline" href="#cardapio">
              Ver cardápio
            </a>
          </div>

          <div className="bar-hero-note">
            <span>✦</span> Aqui, todo encontro vira uma boa história.
          </div>
        </div>

        <div className="bar-hero-stamp">
          <span>✳</span>
          <strong>BA</strong>
          <small>DESDE SEMPRE</small>
        </div>
      </section>

      <section className="bar-section" id="mesas">
        <div className="bar-section-heading">
          <span className="bar-eyebrow">SEU LUGAR ESTÁ AQUI</span>
          <h2>Encontre sua mesa</h2>
          <p>
            Escolha o espaço ideal para aproveitar com quem você gosta.
          </p>
        </div>

        <div className="bar-table-grid">
          {mesas.map((mesa) => (
            <article className="bar-table-card" key={mesa.numero}>
              <div className="table-number">{mesa.numero}</div>
              <span className="table-type">{mesa.tipo}</span>
              <h3>{mesa.nome}</h3>
              <p>{mesa.descricao}</p>
              <div className="table-capacity">
                <span>♟</span> {mesa.capacidade}
              </div>
              <a
                className="bar-card-link"
                href="#reservas"
                onClick={() =>
                  sessionStorage.setItem("mesaSelecionada", mesa.nome)
                }
              >
                Reservar esta mesa ↗
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="bar-menu-section" id="cardapio">
        <div className="bar-section-heading">
          <span className="bar-eyebrow">SABORES QUE REÚNEM</span>
          <h2>Um gostinho do nosso cardápio</h2>
          <p>
            Petiscos para compartilhar e bons motivos para ficar mais um pouco.
          </p>
        </div>

        <div className="bar-menu-grid">
          {pratos.map((prato) => (
            <article className="bar-menu-card" key={prato.nome}>
              <div className="menu-emoji" aria-hidden="true">
                {prato.emoji}
              </div>
              <div className="menu-info">
                <h3>{prato.nome}</h3>
                <p>{prato.descricao}</p>
                <strong>{prato.preco}</strong>
              </div>
            </article>
          ))}
        </div>

        <p className="bar-menu-note">
          <span>✦</span> Consulte a equipe para conhecer todas as opções.
        </p>
      </section>

      <section className="bar-reservation" id="reservas">
        <span className="bar-eyebrow">VAMOS MARCAR ESSE ENCONTRO?</span>
        <h2>Sua próxima história começa aqui.</h2>
        <p>
          Escolha sua mesa e venha aproveitar o Bar da Amizade.
        </p>
        <button
          className="bar-button"
          onClick={() => onNavigate?.("login")}
        >
          Entrar para reservar
        </button>
      </section>

      <footer className="bar-footer" id="contato">
        <a className="bar-brand" href="#inicio">
          <span className="brand-symbol">✳</span>
          <span>BAR <small>DA AMIZADE</small></span>
        </a>

        <p>Boas bebidas, bons petiscos e melhores amizades.</p>

        <div className="bar-footer-links">
          <a href="#mesas">Mesas</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#reservas">Reservas</a>
        </div>

        <small>© {new Date().getFullYear()} Bar da Amizade.</small>
      </footer>
    </main>
  );
}