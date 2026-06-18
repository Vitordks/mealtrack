import { useEffect, useState } from "react";
import api from "../services/api";

function Alimentos() {

    const [alimentos, setAlimentos] = useState([]);

    const [nome, setNome] = useState("");

    const [categoria, setCategoria] = useState("");

    const [idEdicao, setIdEdicao] = useState(null);

    function carregarAlimentos() {

        api.get("/alimentos")
            .then((response) => {
                setAlimentos(response.data);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    useEffect(() => {
        carregarAlimentos();
    }, []);

    function prepararEdicao(alimento) {

        setIdEdicao(alimento.id);
        setNome(alimento.nome);
        setCategoria(alimento.categoria);

    }

    function atualizarAlimento() {

        const alimentoAtualizado = {
            nome,
            categoria
        };

        api.put(`/alimentos/${idEdicao}`, alimentoAtualizado)
            .then(() => {

                setIdEdicao(null);
                setNome("");
                setCategoria("");

                carregarAlimentos();

            })
            .catch((error) => {
                console.log(error);
            });

    }

    function cadastrarAlimento() {

        const novoAlimento = {
            nome,
            categoria
        };



        api.post("/alimentos", novoAlimento)
            .then(() => {

                setNome("");
                setCategoria("");

                carregarAlimentos();

            })
            .catch((error) => {
                console.log(error);
            });

    }
    function excluirAlimento(id) {

        api.delete(`/alimentos/${id}`)
            .then(() => {
                carregarAlimentos();
            })
            .catch((error) => {
                console.log(error);
            });

    }


    return (
        <div>

            <h1>Gestão de Alimentos</h1>

            <div className="formulario">

                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Categoria"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                />

                {
                    idEdicao === null ? (

                        <button onClick={cadastrarAlimento}>
                            Cadastrar
                        </button>

                    ) : (

                        <button onClick={atualizarAlimento}>
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
                    <th>Categoria</th>
                    <th>Ações</th>
                </tr>
                </thead>

                <tbody>

                {alimentos.map((alimento) => (

                    <tr key={alimento.id}>

                        <td>{alimento.id}</td>

                        <td>{alimento.nome}</td>

                        <td>{alimento.categoria}</td>

                        <td>

                            <button
                                onClick={() => prepararEdicao(alimento)}
                            >
                                Editar
                            </button>

                            <button
                                onClick={() => excluirAlimento(alimento.id)}
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

export default Alimentos;