import { LuBeer } from "react-icons/lu";
import "../style/Header.css"

export default function Header() {
    return (
        <header>
            <h1><LuBeer /> BAR DA AMIZADE</h1>

            <div className="header-buttons">
                
                <button>RESERVA</button>
                <button>CARDÁPIO</button>
                <button>MINHA CONTA</button>

            </div>
        </header>
    )
}