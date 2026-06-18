import { useEffect, useState } from "react";
import api from "../services/api";

function Producoes() {

    const [producoes, setProducoes] = useState([]);

    const [alimentos, setAlimentos] = useState([]);

    const [usuarios, setUsuarios] = useState([]);

    const [idAlimento, setIdAlimento] = useState("");

    const [idUsuario, setIdUsuario] = useState("");

    const [quantidadeProduzida, setQuantidadeProduzida] = useState("");

    function carregarProducoes() {

        api.get("/producoes")
            .then((response) => {
                setProducoes(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    function carregarAlimentos() {

        api.get("/alimentos")
            .then((response) => {
                setAlimentos(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    function carregarUsuarios() {

        api.get("/usuarios")
            .then((response) => {
                setUsuarios(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {

        carregarProducoes();
        carregarAlimentos();
        carregarUsuarios();

    }, []);

    function cadastrarProducao() {

        const novaProducao = {

            alimento: {
                id: idAlimento
            },

            usuario: {
                id: idUsuario
            },

            quantidadeProduzida: quantidadeProduzida

        };

        api.post("/producoes", novaProducao)
            .then(() => {

                setIdAlimento("");
                setIdUsuario("");
                setQuantidadeProduzida("");

                carregarProducoes();

            })
            .catch((error) => {
                console.log(error);
            });

    }

    return (
        <div>

            <h1>Produções</h1>

            <div className="formulario">

                <select
                    value={idAlimento}
                    onChange={(e) => setIdAlimento(e.target.value)}
                >

                    <option value="">
                        Selecione um alimento
                    </option>

                    {alimentos.map((alimento) => (

                        <option
                            key={alimento.id}
                            value={alimento.id}
                        >
                            {alimento.nome}
                        </option>

                    ))}

                </select>

                <select
                    value={idUsuario}
                    onChange={(e) => setIdUsuario(e.target.value)}
                >

                    <option value="">
                        Selecione um usuário
                    </option>

                    {usuarios.map((usuario) => (

                        <option
                            key={usuario.id}
                            value={usuario.id}
                        >
                            {usuario.nome}
                        </option>

                    ))}

                </select>

                <input
                    type="number"
                    placeholder="Quantidade Produzida"
                    value={quantidadeProduzida}
                    onChange={(e) =>
                        setQuantidadeProduzida(e.target.value)
                    }
                />

                <button onClick={cadastrarProducao}>
                    Registrar
                </button>

            </div>

            <table>

                <thead>
                <tr>
                    <th>ID</th>
                    <th>Alimento</th>
                    <th>Usuário</th>
                    <th>Quantidade</th>
                    <th>Data</th>
                </tr>
                </thead>

                <tbody>

                {producoes.map((producao) => (

                    <tr key={producao.id}>

                        <td>{producao.id}</td>

                        <td>{producao.alimento?.nome}</td>

                        <td>{producao.usuario?.nome}</td>

                        <td>{producao.quantidadeProduzida}</td>

                        <td>
                            {new Date(
                                producao.dataRegistro
                            ).toLocaleString("pt-BR")}
                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}

export default Producoes;