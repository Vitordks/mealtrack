import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useEffect } from "react";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();


    useEffect(() => {

        const usuario = localStorage.getItem("usuario");

        if (usuario) {
            navigate("/");
        }

    }, []);

    function fazerLogin() {

        api.post("/usuarios/login", {
            email,
            senha
        })
            .then((response) => {

                localStorage.setItem(
                    "usuario",
                    JSON.stringify(response.data)
                );

                navigate("/");

            })
            .catch(() => {

                alert("Email ou senha inválidos");

            });

    }

    return (


        <div className="login-container">

            <div className="login-box">

                <h1>MealTrack</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) =>
                        setSenha(e.target.value)
                    }
                />

                <button onClick={fazerLogin}>
                    Entrar
                </button>

                <button onClick={() => navigate("/cadastro")}>
                    Cadastrar-se
                </button>

            </div>

        </div>
    );
}

export default Login;