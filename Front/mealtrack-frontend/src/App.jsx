import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Alimentos from "./pages/Alimentos";
import Usuarios from "./pages/Usuarios";
import Producoes from "./pages/Producoes";
import Login from "./pages/Login.jsx";
import RotaProtegida from "./components/RotaProtegida";
import { useLocation } from "react-router-dom";
import Relatorios from "./pages/Relatorios";
import "./App.css";

function Layout() {

    const location = useLocation();

    const mostrarSidebar = location.pathname !== "/login";

    return (
        <div className="layout">

            {mostrarSidebar && <Sidebar />}

            <main className="content">

                <Routes>

                    <Route
                        path="/"
                        element={
                            <RotaProtegida>
                                <Dashboard />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/alimentos"
                        element={
                            <RotaProtegida>
                                <Alimentos />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/usuarios"
                        element={
                            <RotaProtegida>
                                <Usuarios />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/producoes"
                        element={
                            <RotaProtegida>
                                <Producoes />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/relatorios"
                        element={
                            <RotaProtegida>
                                <Relatorios />
                            </RotaProtegida>
                        }
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                </Routes>

            </main>

        </div>
    );
}

function App() {

    return (

        <BrowserRouter>

            <Layout />

        </BrowserRouter>

    );
}

export default App;