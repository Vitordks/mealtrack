import { useEffect, useState } from "react";
import api from "../services/api";
import CardMonitoramento from "../components/CardMonitoramento";


function Monitoramento() {

    const [producoes, setProducoes] = useState([]);

    function carregarProducoes() {

        api.get("/producoes")
            .then((response) => {

                const dados = response.data.map((producao) => ({

                    ...producao,

                    pesoAtual: producao.quantidadeProduzida

                }));

                setProducoes(dados);

            })
            .catch((error) => {

                console.log(error);

            });

    }

    useEffect(() => {

        carregarProducoes();

    }, []);

    useEffect(() => {

        const intervalo = setInterval(() => {

            setProducoes((lista) =>

                lista.map((producao) => {

                    let novoPeso = producao.pesoAtual;

                    if (novoPeso > 0) {

                        novoPeso = Number(
                            (novoPeso - Math.random() * 0.3).toFixed(2)
                        );

                        if (novoPeso < 0) {

                            novoPeso = 0;

                        }

                    }

                    return {

                        ...producao,

                        pesoAtual: novoPeso

                    };

                })

            );

        }, 3000);

        return () => clearInterval(intervalo);

    }, []);

    const balancasOnline = producoes.length;

    const emAtencao = producoes.filter((p) => {

        const porcentagem =
            ((p.quantidadeProduzida - p.pesoAtual)
                / p.quantidadeProduzida) * 100;

        return porcentagem >= 40 && porcentagem < 70;

    }).length;

    const reposicao = producoes.filter((p) => {

        const porcentagem =
            ((p.quantidadeProduzida - p.pesoAtual)
                / p.quantidadeProduzida) * 100;

        return porcentagem >= 70;

    }).length;

    const pesoTotal = producoes
        .reduce((total, p) => total + p.pesoAtual, 0)
        .toFixed(2);
    const alertas = [];

    producoes.forEach((producao) => {

        const porcentagem =
            ((producao.quantidadeProduzida - producao.pesoAtual)
                / producao.quantidadeProduzida) * 100;

        if (porcentagem >= 70) {

            alertas.push({
                tipo: "erro",
                mensagem: `${producao.alimento.nome} precisa ser reabastecido.`
            });

        } else if (porcentagem >= 40) {

            alertas.push({
                tipo: "atencao",
                mensagem: `${producao.alimento.nome} está abaixo de 60% da capacidade.`
            });

        }

    });


    return (

        <div>

            <h1>Monitoramento</h1>

            <div className="cards-resumo">

                <div className="card-resumo">

                    <h3>Balanças Online</h3>

                    <h1>{balancasOnline}</h1>

                </div>

                <div className="card-resumo">

                    <h3>Em Atenção</h3>

                    <h1>{emAtencao}</h1>

                </div>

                <div className="card-resumo">

                    <h3>Reposição</h3>

                    <h1>{reposicao}</h1>

                </div>

                <div className="card-resumo">

                    <h3>Peso Atual</h3>

                    <h1>{pesoTotal} kg</h1>

                </div>

            </div>

            <div className="painel-alertas">

                <h2>Central de Alertas</h2>

                {

                    alertas.length === 0 ?

                        (

                            <div className="alerta alerta-sucesso">

                                ✅ Nenhum alerta no momento.

                            </div>

                        )

                        :

                        (

                            alertas.map((alerta, index) => (

                                <div

                                    key={index}

                                    className={`alerta ${
                                        alerta.tipo === "erro"
                                            ? "alerta-erro"
                                            : "alerta-atencao"
                                    }`}

                                >

                                    {alerta.tipo === "erro" ? "🔴" : "🟡"}

                                    {" "}

                                    {alerta.mensagem}

                                </div>

                            ))

                        )

                }

            </div>

            <div className="cards-monitoramento">

                {

                    producoes.map((producao) => (

                        <CardMonitoramento

                            key={producao.id}

                            alimento={producao.alimento.nome}

                            quantidadeInicial={
                                producao.quantidadeProduzida
                            }

                            pesoAtual={
                                producao.pesoAtual
                            }

                        />

                    ))

                }

            </div>

        </div>

    );

}

export default Monitoramento;