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



    function Cadastro() {

        const [nome, setNome] = useState("");
        const [email, setEmail] = useState("");
        const [senha, setSenha] = useState("");

        const navigate = useNavigate();

        function cadastrar() {

            api.post("/usuarios", {
                nome,
                email,
                senha,
                documento: "12345678911",
                nivelAcesso: "ADMIN",
                restaurante: { id: 1 }
            })
                .then(() => {
                    alert("Usuário criado!");
                    navigate("/login");
                });

        }

        return (
            <div>
                <h1>Cadastro</h1>

                <input placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
                <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Senha" onChange={(e) => setSenha(e.target.value)} />

                <button onClick={cadastrar}>
                    Criar conta
                </button>
            </div>
        );
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