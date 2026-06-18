import { Navigate } from "react-router-dom";

function RotaProtegida({ children }) {

    const usuario = localStorage.getItem("usuario");

    if (!usuario) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default RotaProtegida;