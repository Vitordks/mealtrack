import { useEffect, useState } from "react";
import api from "../services/api";

function Relatorios() {

    const [producoes, setProducoes] = useState([]);
    const [dataInicial, setDataInicial] = useState("");
    const [dataFinal, setDataFinal] = useState("");

    useEffect(() => {

        api.get("/producoes/relatorio")
            .then((response) => {
                setProducoes(response.data);
            })
            .catch(console.log);

    }, []);

    function exportarCSV() {

        let csv =
            "ID,Alimento,Usuario,Quantidade,Data\n";

        producoes.forEach((p) => {

            csv +=
                `${p.id},` +
                `${p.alimento?.nome},` +
                `${p.usuario?.nome},` +
                `${p.quantidadeProduzida},` +
                `${p.dataRegistro}\n`;

        });

        const blob = new Blob(
            [csv],
            { type: "text/csv;charset=utf-8;" }
        );

        const link = document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "relatorio_producoes.csv";

        link.click();
    }

    function filtrarPeriodo() {

        api.get(
            `/producoes/relatorio-periodo?dataInicial=${dataInicial}&dataFinal=${dataFinal}`
        )
            .then((response) => {
                setProducoes(response.data);
            })
            .catch(console.log);

    }

    return (
        <div>

            <h1>Relatórios</h1>

            <button
                onClick={exportarCSV}
            >
                Exportar CSV
            </button>

            <div
                className="formulario"
                style={{marginBottom:"20px"}}
            >

                <input
                    type="date"
                    value={dataInicial}
                    onChange={(e) =>
                        setDataInicial(e.target.value)
                    }
                />

                <input
                    type="date"
                    value={dataFinal}
                    onChange={(e) =>
                        setDataFinal(e.target.value)
                    }
                />

                <button
                    onClick={filtrarPeriodo}
                >
                    Filtrar
                </button>

                <button
                    onClick={exportarCSV}
                >
                    Exportar CSV
                </button>

            </div>

            <table
                style={{ marginTop: "20px" }}
            >
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
                {producoes.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.alimento?.nome}</td>
                        <td>{p.usuario?.nome}</td>
                        <td>{p.quantidadeProduzida}</td>
                        <td>{p.dataRegistro}</td>
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}

export default Relatorios;