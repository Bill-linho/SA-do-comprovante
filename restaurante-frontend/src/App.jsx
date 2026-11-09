
import React, { useEffect, useMemo, useState } from "react";

import {
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  X,
  Menu,
  Utensils,
  Clock3,
  MapPin,
  Phone,
  CreditCard,
  LogIn,
  LogOut,
  CheckCircle2
} from "lucide-react";

import api, {
  entrar,
  cadastrar,
  criarPedido,
  pagarPedido,
  abrirComprovante
} from "./api";


// PRODUTOS INICIAIS

const produtosIniciais = [
  {
    id: 1,
    nome: "Burger da Casa",
    descricao: "Blend artesanal, queijo cheddar, alface, tomate e molho especial.",
    preco: 32.90,
    categoria: "Hambúrgueres",
    emoji: "🍔",
    tag: "Mais pedido"
  },

  {
    id: 2,
    nome: "Pizza Margherita",
    descricao: "Muçarela, tomate fresco, manjericão e azeite.",
    preco: 46.90,
    categoria: "Pizzas",
    emoji: "🍕"
  },

  {
    id: 3,
    nome: "Pasta ao molho pesto",
    descricao: "Massa italiana, pesto de manjericão e parmesão.",
    preco: 39.90,
    categoria: "Massas",
    emoji: "🍝"
  },

  {
    id: 4,
    nome: "Frango crocante",
    descricao: "Filé empanado, acompanhado de batatas rústicas.",
    preco: 36.50,
    categoria: "Pratos",
    emoji: "🍗"
  },

  {
    id: 5,
    nome: "Salada Mediterrânea",
    descricao: "Folhas frescas, tomate-cereja, queijo e molho da casa.",
    preco: 28.00,
    categoria: "Pratos",
    emoji: "🥗"
  },

  {
    id: 6,
    nome: "Brownie com sorvete",
    descricao: "Brownie de chocolate servido com sorvete de creme.",
    preco: 19.90,
    categoria: "Sobremesas",
    emoji: "🍫"
  },

  {
    id: 7,
    nome: "Limonada da Casa",
    descricao: "Limão fresco, água gelada e um toque de hortelã.",
    preco: 9.90,
    categoria: "Bebidas",
    emoji: "🍋"
  },

  {
    id: 8,
    nome: "Suco natural",
    descricao: "Suco natural de laranja feito na hora.",
    preco: 11.90,
    categoria: "Bebidas",
    emoji: "🍊"
  }
];


const money = value =>
  Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });


// COMPONENTE PRINCIPAL

export default function App() {

  // ESTADOS

  const [produtos, setProdutos] = useState(produtosIniciais);
  const [categoria, setCategoria] = useState("Todos");

  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  const [modal, setModal] = useState("");

  const [usuario, setUsuario] = useState(() =>
    JSON.parse(localStorage.getItem("usuario") || "null")
  );

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
    cpf: ""
  });

  const [metodo, setMetodo] = useState("pix");
  const [mensagem, setMensagem] = useState("");
  const [pedidoId, setPedidoId] = useState("");

  const [carregando, setCarregando] = useState(false);


  // CATEGORIAS E CÁLCULOS

  const categorias = [
    "Todos",
    "Hambúrgueres",
    "Pizzas",
    "Massas",
    "Pratos",
    "Sobremesas",
    "Bebidas"
  ];

  const quantidade = carrinho.reduce(
    (s, p) => s + p.quantidade,
    0
  );

  const total = useMemo(
    () => carrinho.reduce(
      (s, p) => s + p.preco * p.quantidade,
      0
    ),
    [carrinho]
  );

  const lista = produtos.filter(
    p => categoria === "Todos" ||
      (p.categoria || "Pratos") === categoria
  );


  // CARREGAR CARDÁPIO

  async function carregarCardapio() {
    try {
      const { data } = await api.get("/pratos");

      if (Array.isArray(data)) {
        setProdutos(data);
      } else if (Array.isArray(data.pratos)) {
        setProdutos(data.pratos);
      }

    } catch {
      // A rota GET /pratos ainda não existe no backend enviado.
    }
  }

  useEffect(() => {
    carregarCardapio();
  }, []);


  // ADICIONAR PRODUTO AO CARRINHO

  function adicionar(produto) {
    setCarrinho(atual => {
      const existe = atual.find(p => p.id === produto.id);

      return existe
        ? atual.map(p =>
          p.id === produto.id
            ? { ...p, quantidade: p.quantidade + 1 }
            : p
        )
        : [...atual, { ...produto, quantidade: 1 }];
    });

    setCarrinhoAberto(true);
  }


  // ALTERAR QUANTIDADE

  function alterar(id, delta) {
    setCarrinho(atual =>
      atual
        .map(p =>
          p.id === id
            ? { ...p, quantidade: p.quantidade + delta }
            : p
        )
        .filter(p => p.quantidade > 0)
    );
  }


  // LOGIN E CADASTRO

  async function autenticar(e) {
    e.preventDefault();

    setCarregando(true);
    setMensagem("");

    try {

      if (modal === "cadastro") {

        await cadastrar({
          nome: form.nome,
          email: form.email,
          senha: form.senha
        });

        setMensagem(
          "Cadastro realizado! Agora entre com seu email e senha."
        );

        setModal("login");

      } else {

        const data = await entrar(form.email, form.senha);

        setUsuario(data.usuario);
        setModal("");

        setMensagem("Login realizado com sucesso!");
      }

    } catch (err) {

      setMensagem(
        err.response?.data?.mensagem ||
        "Não foi possível concluir. Confira os dados e tente novamente."
      );

    } finally {
      setCarregando(false);
    }
  }


  // FINALIZAR PEDIDO

  async function finalizarPedido(e) {
    e.preventDefault();

    if (!usuario) {
      setModal("login");
      setMensagem("Entre na sua conta para continuar.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {

      const payload = {
        itens: carrinho.map(p => ({
          prato_id: p.id,
          quantidade: p.quantidade
        })),

        metodo_pagamento: metodo
      };

      const data = await criarPedido(payload);

      const id = data.pedido?.id || data.id;

      if (!id) {
        throw new Error(
          "A API não retornou o identificador do pedido."
        );
      }

      setPedidoId(id);

      await pagarPedido(id, metodo);

      setMensagem(
        `Pedido #${id} criado e pagamento simulado enviado.`
      );

      setCarrinho([]);
      setModal("sucesso");

    } catch (err) {

      setMensagem(
        err.response?.data?.mensagem ||
        err.message ||
        "Não foi possível criar/pagar o pedido. Verifique as rotas do backend."
      );

    } finally {
      setCarregando(false);
    }
  }


  // SAIR DA CONTA

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("expiraEm");

    setUsuario(null);

    setMensagem("Você saiu da sua conta.");
  }


  // RETORNO JSX

  return (
    <div>

      {/* CABEÇALHO */}

      <header className="topbar">

        <a className="brand" href="#inicio">
          <span className="brand-mark">
            <Utensils size={20} />
          </span>

          <span>
            casa<span className="brand-amp">&</span>sabor
            <small>RESTAURANTE</small>
          </span>
        </a>

        <nav>
          <a href="#inicio">Início</a>
          <a href="#sobre">O restaurante</a>
          <a href="#cardapio">Cardápio</a>
          <a href="#contato">Contato</a>
        </nav>

        <div className="header-actions">

          {usuario ? (
            <button className="user-chip" onClick={sair}>
              <LogOut size={16} />
              {usuario.nome?.split(" ")[0] || "Sair"}
            </button>
          ) : (
            <button
              className="login-btn"
              onClick={() => setModal("login")}
            >
              <LogIn size={17} />
              Entrar
            </button>
          )}

          <button
            className="cart-btn"
            onClick={() => setCarrinhoAberto(true)}
          >
            <ShoppingBag size={18} />
            <span>Pedido</span>
            <b>{quantidade}</b>
          </button>

        </div>
      </header>


      {/* CONTEÚDO PRINCIPAL */}

      <main>

        {/* INÍCIO */}

        <section className="hero" id="inicio">

          <div className="hero-copy">

            <span className="eyebrow">
              <span />
              SABOR QUE REÚNE
            </span>

            <h1>
              Comida boa.
              <br />
              <em>Momentos melhores.</em>
            </h1>

            <p>
              Ingredientes selecionados, receitas feitas com carinho
              e aquele sabor que faz você querer voltar.
            </p>

            <div className="hero-actions">
              <a className="primary-btn" href="#cardapio">
                Ver cardápio
                <ArrowRight size={18} />
              </a>

              <a className="text-link" href="#sobre">
                Conheça a casa
              </a>
            </div>

            <div className="hero-meta">
              <span>
                <Clock3 size={16} />
                Ter–Dom · 18h às 23h
              </span>

              <span>
                <MapPin size={16} />
                Atendimento local e delivery
              </span>
            </div>

          </div>

          <div className="hero-art">
            <div className="hero-orbit"></div>
            <div className="hero-food">🍔</div>

            <div className="floating-note">
              <span>★ 4,9</span>
              <small>Feito com carinho</small>
            </div>

            <div className="hero-stamp">
              FRESCO
              <br />
              & ARTESANAL
            </div>
          </div>

        </section>


        {/* DIFERENCIAIS */}

        <section className="features">

          <div>
            <span>🥬</span>
            <p>
              <b>Ingredientes frescos</b>
              <small>Qualidade em cada detalhe</small>
            </p>
          </div>

          <div>
            <span>👨‍🍳</span>
            <p>
              <b>Feito na hora</b>
              <small>Preparado com cuidado</small>
            </p>
          </div>

          <div>
            <span>🛵</span>
            <p>
              <b>Peça sem sair de casa</b>
              <small>Praticidade para você</small>
            </p>
          </div>

        </section>


        {/* SOBRE O RESTAURANTE */}

        <section className="about section" id="sobre">

          <div className="about-photo">
            <div className="photo-card">
              🍽️
              <span>
                UMA EXPERIÊNCIA
                <br />
                FEITA PARA COMPARTILHAR
              </span>
            </div>
          </div>

          <div className="about-copy">

            <span className="eyebrow">
              MAIS QUE UMA REFEIÇÃO
            </span>

            <h2>
              Uma mesa cheia
              <br />
              de <em>boas histórias.</em>
            </h2>

            <p>
              A Casa & Sabor nasceu da vontade de reunir pessoas
              em volta de uma boa comida. Nosso cardápio combina
              clássicos queridos e receitas especiais, sempre com
              ingredientes selecionados.
            </p>

            <a href="#cardapio" className="text-link">
              Descubra nossos sabores
              <ArrowRight size={16} />
            </a>

          </div>
        </section>


        {/* CARDÁPIO */}

        <section className="menu section" id="cardapio">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                ESCOLHIDOS PARA VOCÊ
              </span>

              <h2>
                Nosso <em>cardápio</em>
              </h2>
            </div>

            <p>
              Seu próximo prato favorito
              <br />
              está a um clique de distância.
            </p>

          </div>

          <div className="filters">

            {categorias.map(c => (
              <button
                key={c}
                className={categoria === c ? "active" : ""}
                onClick={() => setCategoria(c)}
              >
                {c}
              </button>
            ))}

          </div>

          <div className="product-grid">

            {lista.map(p => (
              <article className="product-card" key={p.id}>

                <div className="product-image">

                  <span className="food-emoji">
                    {p.emoji || "🍽️"}
                  </span>

                  {p.tag && (
                    <span className="product-tag">
                      {p.tag}
                    </span>
                  )}

                  <button
                    aria-label={`Adicionar ${p.nome}`}
                    className="add-float"
                    onClick={() => adicionar(p)}
                  >
                    <Plus size={20} />
                  </button>

                </div>

                <div className="product-info">

                  <span className="product-category">
                    {p.categoria || "Pratos"}
                  </span>

                  <h3>{p.nome}</h3>

                  <p>{p.descricao}</p>

                  <div className="product-bottom">
                    <b>{money(p.preco)}</b>

                    <button onClick={() => adicionar(p)}>
                      Adicionar
                      <Plus size={15} />
                    </button>
                  </div>

                </div>
              </article>
            ))}

          </div>

        </section>


        {/* CHAMADA PARA PEDIDO */}

        <section className="cta">

          <div>
            <span className="eyebrow">
              BATEU A FOME?
            </span>

            <h2>
              Seu pedido começa
              <br />
              com <em>um clique.</em>
            </h2>

            <p>Escolha seus favoritos e aproveite.</p>

            <a href="#cardapio" className="primary-btn">
              Pedir agora
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="cta-emoji">🍕</div>

        </section>


        {/* CONTATO */}

        <section className="contact section" id="contato">

          <div>
            <span className="eyebrow">
              VAMOS CONVERSAR?
            </span>

            <h2>
              Estamos esperando
              <br />
              <em>por você.</em>
            </h2>
          </div>

          <div className="contact-items">

            <p>
              <MapPin />
              Rua Exemplo, 123 · Sua cidade
            </p>

            <p>
              <Phone />
              (00) 00000-0000
            </p>

            <p>
              <Clock3 />
              Terça a domingo, das 18h às 23h
            </p>

            <p>
              <Instagram />
              @casaesabor
            </p>

          </div>

        </section>

      </main>


      {/* RODAPÉ */}

      <footer>

        <a className="brand footer-brand" href="#inicio">

          <span className="brand-mark">
            <Utensils size={18} />
          </span>

          <span>
            casa<span className="brand-amp">&</span>sabor
            <small>RESTAURANTE</small>
          </span>

        </a>

        <span>
          © 2026 Casa & Sabor. Feito para compartilhar.
        </span>

        <a href="#inicio">Voltar ao topo ↑</a>

      </footer>


      {/* CARRINHO */}

      {carrinhoAberto && (

        <div
          className="overlay"
          onMouseDown={e =>
            e.target === e.currentTarget &&
            setCarrinhoAberto(false)
          }
        >

          <aside className="drawer">

            <div className="drawer-head">

              <div>
                <span className="eyebrow">
                  SUA SELEÇÃO
                </span>

                <h2>Meu pedido</h2>
              </div>

              <button
                className="icon-btn"
                onClick={() => setCarrinhoAberto(false)}
              >
                <X />
              </button>

            </div>


            {carrinho.length === 0 ? (

              <div className="empty">

                <span>🛍️</span>

                <h3>Seu carrinho está vazio</h3>

                <p>
                  Escolha algo delicioso no cardápio.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setCarrinhoAberto(false);
                    document.querySelector("#cardapio").scrollIntoView();
                  }}
                >
                  Ver cardápio
                </button>

              </div>

            ) : (

              <>

                <div className="cart-items">

                  {carrinho.map(p => (

                    <div className="cart-item" key={p.id}>

                      <span className="cart-emoji">
                        {p.emoji}
                      </span>

                      <div className="cart-desc">

                        <b>{p.nome}</b>

                        <small>{money(p.preco)}</small>

                        <div className="qty">

                          <button onClick={() => alterar(p.id, -1)}>
                            <Minus size={13} />
                          </button>

                          <span>{p.quantidade}</span>

                          <button onClick={() => alterar(p.id, 1)}>
                            <Plus size={13} />
                          </button>

                        </div>

                      </div>

                      <b>
                        {money(p.preco * p.quantidade)}
                      </b>

                    </div>

                  ))}

                </div>


                {/* RESUMO DO PEDIDO */}

                <div className="cart-summary">

                  <div>
                    <span>Subtotal</span>
                    <b>{money(total)}</b>
                  </div>

                  <div>
                    <span>Entrega</span>
                    <span>A combinar</span>
                  </div>

                  <div className="grand-total">
                    <span>Total parcial</span>
                    <b>{money(total)}</b>
                  </div>

                  <button
                    className="primary-btn full"
                    onClick={() => {
                      setCarrinhoAberto(false);
                      setModal("checkout");
                    }}
                  >
                    Continuar para pagamento
                    <ArrowRight size={17} />
                  </button>

                  <small className="secure-note">
                    Pagamento demonstrativo para fins acadêmicos.
                  </small>

                </div>

              </>

            )}

          </aside>

        </div>

      )}


      {/* MODAIS */}

      {modal && (

        <div
          className="overlay modal-overlay"
          onMouseDown={e =>
            e.target === e.currentTarget && setModal("")
          }
        >

          <section className="modal">

            <button
              className="modal-close"
              onClick={() => setModal("")}
            >
              <X />
            </button>


            {/* LOGIN E CADASTRO */}

            {(modal === "login" || modal === "cadastro") && (

              <>

                <span className="eyebrow">
                  BEM-VINDO À CASA & SABOR
                </span>

                <h2>
                  {modal === "login"
                    ? "Acesse sua conta"
                    : "Crie sua conta"}
                </h2>

                <p className="modal-sub">
                  Entre para acompanhar seus pedidos e aproveitar nossos sabores.
                </p>


                <form onSubmit={autenticar}>

                  {modal === "cadastro" && (

                    <label>
                      Nome completo

                      <input
                        required
                        value={form.nome}
                        onChange={e =>
                          setForm({ ...form, nome: e.target.value })
                        }
                        placeholder="Seu nome"
                      />
                    </label>

                  )}

                  <label>
                    Cpf
                    <input
                      required
                      type="text"
                      value={form.cpf}
                      onChange={e =>
                        setForm({ ...form, cpf: e.target.value })
                      }
                      placeholder="000.000.000-00"
                    />
                  </label>


                  <label>
                    Email

                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={e =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="voce@email.com"
                    />
                  </label>


                  <label>
                    Senha

                    <input
                      required
                      type="password"
                      minLength="8"
                      value={form.senha}
                      onChange={e =>
                        setForm({ ...form, senha: e.target.value })
                      }
                      placeholder="Mínimo 8 caracteres"
                    />
                  </label>


                  <button
                    className="primary-btn full"
                    disabled={carregando}
                  >
                    {carregando
                      ? "Aguarde..."
                      : modal === "login"
                        ? "Entrar"
                        : "Cadastrar"}
                  </button>

                </form>


                <p className="switch-modal">

                  {modal === "login"
                    ? "Ainda não tem conta?"
                    : "Já tem uma conta?"}

                  <button
                    onClick={() => {
                      setMensagem("");
                      setModal(
                        modal === "login"
                          ? "cadastro"
                          : "login"
                      );
                    }}
                  >
                    {modal === "login"
                      ? "Cadastre-se"
                      : "Entrar"}
                  </button>

                </p>

              </>

            )}


            {/* CHECKOUT */}

            {modal === "checkout" && (

              <>

                <span className="eyebrow">
                  QUASE LÁ
                </span>

                <h2>Finalizar pedido</h2>

                <p className="modal-sub">
                  Confira o total e escolha como deseja pagar.
                </p>


                <div className="checkout-total">
                  <span>Total do pedido</span>
                  <b>{money(total)}</b>
                </div>


                <form onSubmit={finalizarPedido}>

                  <label>
                    Forma de pagamento

                    <select
                      value={metodo}
                      onChange={e => setMetodo(e.target.value)}
                    >
                      <option value="pix">
                        PIX (simulado)
                      </option>

                      <option value="cartao_credito">
                        Cartão de crédito (simulado)
                      </option>

                      <option value="cartao_debito">
                        Cartão de débito (simulado)
                      </option>

                      <option value="dinheiro">
                        Dinheiro
                      </option>

                    </select>

                  </label>


                  <div className="payment-info">
                    <CreditCard size={18} />

                    <span>
                      Esta etapa usa o pagamento de teste do projeto.
                      Nenhum dinheiro será movimentado.
                    </span>
                  </div>


                  <button
                    className="primary-btn full"
                    disabled={carregando}
                  >
                    {carregando
                      ? "Processando..."
                      : `Confirmar pedido · ${money(total)}`}
                  </button>

                </form>

              </>

            )}


            {/* SUCESSO */}

            {modal === "sucesso" && (

              <div className="success">

                <CheckCircle2 size={48} />

                <h2>Pedido enviado!</h2>

                <p>{mensagem}</p>

                <button
                  className="primary-btn full"
                  onClick={() => setModal("")}
                >
                  Continuar
                </button>

                <button
                  className="secondary-btn full"
                  onClick={() => abrirComprovante(pedidoId, "cliente")}
                >
                  Abrir comprovante PDF
                </button>

              </div>

            )}


            {/* MENSAGEM DE ERRO OU AVISO */}

            {mensagem && modal !== "sucesso" && (
              <p className="notice">
                {mensagem}
              </p>
            )}

          </section>

        </div>

      )}


      {/* NOTIFICAÇÃO */}

      {mensagem && (

        <div className="toast" role="status">

          {mensagem}

          <button onClick={() => setMensagem("")}>
            <X size={15} />
          </button>

        </div>

      )}

    </div>
  );
}