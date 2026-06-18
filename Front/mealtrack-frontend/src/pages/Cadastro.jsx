import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
                alert("Usuário criado com sucesso!");
                navigate("/login");
            })
            .catch(() => {
                alert("Erro ao cadastrar usuário");
            });

    }

    return (
        <div className="login-container">

            <div className="login-box">

                <h1>Cadastro</h1>

                <input
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <button onClick={cadastrar}>
                    Criar conta
                </button>

                <button onClick={() => navigate("/login")}>
                    Voltar para login
                </button>

            </div>

        </div>
    );
}

export default Cadastro;