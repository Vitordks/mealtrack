import { useState } from "react";
import { CheckCircle2, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as simulacaoService from "@/services/simulacaoService";
import { formatCurrency, formatDateTime, formatKg, formatNumber } from "@/utils/formatters";

export default function Simulacao() {
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleExecutarSimulacao() {
    setError(null);
    setIsLoading(true);
    try {
      const data = await simulacaoService.executarSimulacao();
      setResultado(data);
    } catch (err) {
      setError(err.message || "Falha ao executar a simulação.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulação Semanal"
        description="Execute uma semana completa de operação. Todos os dados do sistema serão atualizados de forma real."
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Executar Simulação</CardTitle>
          <CardDescription>
            Ao clicar, o sistema simula 7 dias de operação: produções, consumos, reposições, descartes e eventos.
            Dashboard, monitoramento, alimentos e relatórios refletirão os novos dados.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleExecutarSimulacao} disabled={isLoading} size="lg" className="w-full sm:w-auto">
            <Play className="size-4" />
            {isLoading ? "Executando simulação..." : "Executar Simulação"}
          </Button>

          {resultado ? (
            <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="size-5" />
                <span className="font-medium">{resultado.mensagem}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Executado em: {formatDateTime(resultado.executadoEm)}
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Dias simulados</p>
                  <p className="text-lg font-semibold">{resultado.diasSimulados}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Produções registradas</p>
                  <p className="text-lg font-semibold">{resultado.totalProducoes}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Eventos gerados</p>
                  <p className="text-lg font-semibold">{resultado.totalEventos}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Total produzido</p>
                  <p className="text-lg font-semibold">{formatKg(resultado.totalProduzido)}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Total consumido</p>
                  <p className="text-lg font-semibold">{formatKg(resultado.totalConsumido)}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Total desperdiçado</p>
                  <p className="text-lg font-semibold">{formatKg(resultado.totalDesperdicado)}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Perda financeira</p>
                  <p className="text-lg font-semibold">{formatCurrency(Number(resultado.perdaFinanceira ?? 0))}</p>
                </div>
                <div className="rounded-lg border bg-background p-3">
                  <p className="text-xs text-muted-foreground">Eficiência</p>
                  <p className="text-lg font-semibold">{formatNumber(resultado.eficiencia)}%</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => navigate("/monitoramento")}>
                  Ver monitoramento
                </Button>
                <Button variant="outline" onClick={() => navigate("/relatorios")}>
                  Ver relatórios
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Ver dashboard
                </Button>
              </div>
            </div>
          ) : null}

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
