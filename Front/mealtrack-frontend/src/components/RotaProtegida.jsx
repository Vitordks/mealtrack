import { Navigate } from "react-router-dom";

function RotaProtegida({

                           children,
                           nivelPermitido

                       }) {

    const usuarioString =
        localStorage.getItem("usuario");

    if (!usuarioString) {
        return <Navigate to="/login" />;
    }

    const usuario =
        JSON.parse(usuarioString);

    if (
        nivelPermitido &&
        usuario.nivelAcesso !== nivelPermitido
    ) {
        return <Navigate to="/" />;
    }

    return children;
}

export default RotaProtegida;