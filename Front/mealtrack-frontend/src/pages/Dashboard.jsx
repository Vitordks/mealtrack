import { useEffect, useState } from "react";
import api from "../services/api";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";


import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Legend,
    ResponsiveContainer
} from "recharts";


function Dashboard() {

    const [dashboard, setDashboard] = useState(null);
    const [producoes, setProducoes] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const agrupado = {};

    producoes.forEach((producao) => {

        const nome = producao.alimento?.nome;

        if (!agrupado[nome]) {
            agrupado[nome] = 0;
        }

        agrupado[nome] += producao.quantidadeProduzida;

    });

    const dadosGrafico = Object.keys(agrupado).map(
        (nome) => ({
            nome,
            quantidade: agrupado[nome]
        })
    );

    useEffect(() => {
        const usuario = localStorage.getItem("usuario");

        if (!usuario) {
            navigate("/login");
            return;
        }

        Promise.all([
            api.get("/dashboard"),
            api.get("/producoes")
        ])
            .then(([dashRes, prodRes]) => {
                setDashboard(dashRes.data);
                setProducoes(prodRes.data);
            })
            .catch(console.log)
            .finally(() => setLoading(false));

    }, [navigate]);

    if (loading) {
        return (
            <>
                <h1>Dashboard</h1>
                <h2>Carregando...</h2>
            </>
        );
    }


    return (
        <>
            <h1>Dashboard</h1>


            <button
                className="logout-btn"
                onClick={() => {
                    localStorage.removeItem("usuario");
                    navigate("/login", {replace: true});
                }}
            >
                Sair
            </button>

            <div className="cards">
                <Card titulo="Alimentos"
                      valor={dashboard?.totalAlimentos ?? 0}/>

                <Card titulo="Usuários"
                      valor={dashboard?.totalUsuarios ?? 0}/>

                <Card titulo="Produções"
                      valor={dashboard?.totalProducoes ?? 0}/>

                <Card titulo="Quantidade Produzida"
                      valor={dashboard?.quantidadeProduzida ?? 0}/>
            </div>

            <h2 style={{marginTop: "40px"}}>
                Últimas Produções
            </h2>

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
                        <td>{producao.dataRegistro}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2 style={{marginTop: "40px"}}>
                Produção por Alimento
            </h2>

            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    marginTop: "20px"
                }}
            >
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={dadosGrafico}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>

                        <XAxis dataKey="nome"/>

                        <YAxis/>

                        <Tooltip/>

                        <Bar
                            dataKey="quantidade"
                            fill="#F59E0B"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <h2 style={{ marginTop: "40px" }}>
                Ranking de Produção
            </h2>

            <table>
                <thead>
                <tr>
                    <th>Alimento</th>
                    <th>Total Produzido</th>
                </tr>
                </thead>

                <tbody>

                {dadosGrafico
                    .sort(
                        (a, b) =>
                            b.quantidade - a.quantidade
                    )
                    .map((item) => (

                        <tr key={item.nome}>
                            <td>{item.nome}</td>
                            <td>{item.quantidade}</td>
                        </tr>

                    ))}

                </tbody>
            </table>

            <h2 style={{ marginTop: "40px" }}>
                Participação na Produção
            </h2>

            <div
                style={{
                    background: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    marginTop: "20px",
                    height: "400px"
                }}
            >

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={dadosGrafico}
                            dataKey="quantidade"
                            nameKey="nome"
                            outerRadius={120}
                            label
                        />

                        <Tooltip />

                        <Legend />

                    </PieChart>

                </ResponsiveContainer>

            </div>


        </>


    );
}

export default Dashboard;