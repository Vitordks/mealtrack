import { useEffect, useState } from "react";
import api from "../services/api";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [restaurantes, setRestaurantes] = useState([]);

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [documento, setDocumento] = useState("");
    const [tipoPessoa, setTipoPessoa] = useState("FISICA");
    const [nivelAcesso, setNivelAcesso] = useState("FUNCIONARIO");
    const [idRestaurante, setIdRestaurante] = useState("");

    const [idEdicao, setIdEdicao] = useState(null);

    function carregarUsuarios() {

        api.get("/usuarios")
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    function carregarRestaurantes() {

        api.get("/restaurantes")
            .then((response) => {
                setRestaurantes(response.data);

                if (response.data.length > 0) {
                    setIdRestaurante(response.data[0].id);
                }

            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {

        carregarUsuarios();
        carregarRestaurantes();

    }, []);

    function limparFormulario() {

        setNome("");
        setEmail("");
        setSenha("");
        setDocumento("");
        setTipoPessoa("FISICA");
        setNivelAcesso("FUNCIONARIO");
        setIdEdicao(null);

    }

    function cadastrarUsuario() {

        const novoUsuario = {
            nome,
            email,
            senha,
            documento,
            tipoPessoa,
            nivelAcesso,
            restaurante: {
                id: Number(idRestaurante)
            }



        };

        if (!nome || !email || !senha || !documento) {
            alert("Preencha todos os campos");
            return;
        }

        const documentoLimpo = documento.replace(/\D/g, "");

        if (
            documentoLimpo.length !== 11 &&
            documentoLimpo.length !== 14
        ) {
            alert("CPF deve ter 11 dígitos ou CNPJ 14 dígitos");
            return;
        }

        api.post("/usuarios", novoUsuario)
            .then(() => {

                limparFormulario();
                carregarUsuarios();

            })
            .catch((error) => {
                console.log(error);
            });

    }

    function prepararEdicao(usuario) {

        setIdEdicao(usuario.id);

        setNome(usuario.nome);
        setEmail(usuario.email);
        setSenha(usuario.senha);
        setDocumento(usuario.documento);
        setTipoPessoa(usuario.tipoPessoa);
        setNivelAcesso(usuario.nivelAcesso);
        setIdRestaurante(usuario.restaurante?.id);

    }

    function atualizarUsuario() {

        const usuarioAtualizado = {
            nome,
            email,
            senha,
            documento,
            tipoPessoa,
            nivelAcesso,
            restaurante: {
                id: Number(idRestaurante)
            }
        };

        api.put(`/usuarios/${idEdicao}`, usuarioAtualizado)
            .then(() => {

                limparFormulario();
                carregarUsuarios();

            })
            .catch((error) => {
                console.log(error);
            });

    }

    function excluirUsuario(id) {

        api.delete(`/usuarios/${id}`)
            .then(() => {
                carregarUsuarios();
            })
            .catch((error) => {
                console.log(error);
            });

    }

    return (
        <div>

            <h1>Gestão de Usuários</h1>

            <div className="formulario">

                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <input
                    type="email"
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

                <input
                    type="text"
                    placeholder="Documento"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                />

                <select
                    value={tipoPessoa}
                    onChange={(e) => setTipoPessoa(e.target.value)}
                >
                    <option value="FISICA">Física</option>
                    <option value="JURIDICA">Jurídica</option>
                </select>

                <select
                    value={nivelAcesso}
                    onChange={(e) => setNivelAcesso(e.target.value)}
                >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPERVISOR">Supervisor</option>
                    <option value="FUNCIONARIO">Funcionário</option>
                </select>

                <select
                    value={idRestaurante}
                    onChange={(e) => setIdRestaurante(e.target.value)}
                >
                    {restaurantes.map((restaurante) => (
                        <option
                            key={restaurante.id}
                            value={restaurante.id}
                        >
                            {restaurante.nome}
                        </option>
                    ))}
                </select>

                {
                    idEdicao === null ? (

                        <button onClick={cadastrarUsuario}>
                            Cadastrar
                        </button>

                    ) : (

                        <button onClick={atualizarUsuario}>
                            Atualizar
                        </button>

                    )
                }

            </div>

            <table>

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Nível</th>
                    <th>Restaurante</th>
                    <th>Ações</th>
                </tr>
                </thead>

                <tbody>

                {usuarios.map((usuario) => (

                    <tr key={usuario.id}>

                        <td>{usuario.id}</td>
                        <td>{usuario.nome}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.tipoPessoa}</td>
                        <td>{usuario.nivelAcesso}</td>
                        <td>{usuario.restaurante?.nome}</td>

                        <td>

                            <button
                                onClick={() => prepararEdicao(usuario)}
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => excluirUsuario(usuario.id)}
                            >
                                Excluir
                            </button>

                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}

export default Usuarios;