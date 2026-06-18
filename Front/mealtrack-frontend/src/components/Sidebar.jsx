import { Link } from "react-router-dom";

function Sidebar() {

    return (
        <aside className="sidebar">

            <h2>MealTrack</h2>

            <nav>

                <Link to="/">
                    Dashboard
                </Link>

                <Link to="/alimentos">
                    Alimentos
                </Link>

                <Link to="/usuarios">
                    Usuários
                </Link>

                <Link to="/producoes">
                    Produções
                </Link>

                    <Link to="/relatorios">
                        Relatórios
                    </Link>



            </nav>

        </aside>
    );
}

export default Sidebar;