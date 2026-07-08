import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

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

                console.error(error);

                toast.error("Erro ao carregar alimentos.");

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

        if (!nome || !categoria) {

            toast.warning("Preencha todos os campos.");

            return;

        }

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

                toast.success("Alimento atualizado com sucesso!");

            })

            .catch((error) => {

                console.error(error);

                toast.error("Erro ao atualizar o alimento.");

            });

    }

    function cadastrarAlimento() {

        if (!nome || !categoria) {

            toast.warning("Preencha todos os campos.");

            return;

        }

        const novoAlimento = {

            nome,
            categoria

        };

        api.post("/alimentos", novoAlimento)

            .then(() => {

                setNome("");
                setCategoria("");

                carregarAlimentos();

                toast.success("Alimento cadastrado com sucesso!");

            })

            .catch((error) => {

                console.error(error);

                toast.error("Erro ao cadastrar o alimento.");

            });

    }

    function excluirAlimento(id) {

        const confirmar = window.confirm(
            "Deseja realmente excluir este alimento?"
        );

        if (!confirmar) {

            return;

        }

        api.delete(`/alimentos/${id}`)

            .then(() => {

                carregarAlimentos();

                toast.success("Alimento excluído com sucesso!");

            })

            .catch((error) => {

                console.error(error);

                toast.error("Erro ao excluir o alimento.");

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

                    idEdicao === null ?

                        (

                            <button onClick={cadastrarAlimento}>

                                Cadastrar

                            </button>

                        )

                        :

                        (

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

                {

                    alimentos.map((alimento) => (

                        <tr key={alimento.id}>

                            <td>{alimento.id}</td>

                            <td>{alimento.nome}</td>

                            <td>{alimento.categoria}</td>

                            <td>

                                <button

                                    className="botao-editar"

                                    onClick={() => prepararEdicao(alimento)}

                                >

                                    ✏ Editar

                                </button>

                                <button

                                    className="botao-excluir"

                                    onClick={() => excluirAlimento(alimento.id)}

                                >

                                    🗑 Excluir

                                </button>
                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

}

export default Alimentos;