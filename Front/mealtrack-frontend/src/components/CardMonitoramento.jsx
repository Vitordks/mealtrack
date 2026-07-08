function CardMonitoramento({

                               alimento,
                               quantidadeInicial,
                               pesoAtual

                           }) {

    const porcentagem =
        ((quantidadeInicial - pesoAtual) / quantidadeInicial) * 100;

    let status = "Normal";
    let cor = "#2e7d32";
    let icone = "🟢";

    if (porcentagem >= 70) {

        status = "Reposição";
        cor = "#d32f2f";
        icone = "🔴";

    } else if (porcentagem >= 40) {

        status = "Atenção";
        cor = "#f9a825";
        icone = "🟡";

    }

    return (

        <div className="card-monitoramento">

            <div className="monitoramento-header">

                <h2>{alimento}</h2>

                <span
                    className="status-badge"
                    style={{ backgroundColor: cor }}
                >
                    {icone} {status}
                </span>

            </div>

            <div className="monitoramento-info">

                <p>

                    <strong>Produção Inicial:</strong>

                    {` ${quantidadeInicial.toFixed(2)} kg`}

                </p>

                <p>

                    <strong>Peso Atual:</strong>

                    {` ${pesoAtual.toFixed(2)} kg`}

                </p>

                <p>

                    <strong>Consumido:</strong>

                    {` ${porcentagem.toFixed(1)} %`}

                </p>

            </div>

            <div className="barra">

                <div

                    className="barra-preenchimento"

                    style={{
                        width: `${100 - porcentagem}%`,
                        backgroundColor: cor
                    }}

                />

            </div>

            <small>

                Última atualização:
                {" "}
                {new Date().toLocaleTimeString("pt-BR")}

            </small>

        </div>

    );

}

export default CardMonitoramento;