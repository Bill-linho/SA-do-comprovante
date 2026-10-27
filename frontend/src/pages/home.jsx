import Header from "../components/header"

export default function Home() {
    return (
        <>
            <Header />
            <div className="home-hero">

                <h1>BEM-VINDO AO BAR DA AMIZADE</h1>
                <h2>FAÇA SUA RESERVA AGORA!</h2>
                <div className="home-hero-cardapio">
                    <p>Confira nosso cardápio e aproveite os melhores drinks!</p>
                    <button>CARDÁPIO</button>
                    <p>CRIE SUA CONTA E FAÇA SUA RESERVA</p>
                    <button>MINHA CONTA</button>
                </div>

            </div>
            <div className="home-localizacao">
                <h1>LOCALIZAÇÃO <span>BAR DA AMIZADE</span></h1>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3605.094444444444!2d-48.643137!3d-27.618359!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952735e3eca181c5%3A0x5e28c5420766ea66!2sBar+Da+Amizade!5e0!3m2!1sen!2sbr!4v1678901234567!5m2!1sen!2sbr" width="600" height="450" style={{ border: 0 }} allowfullscreen="" loading="lazy"></iframe>
            </div>
        </>
    )
}