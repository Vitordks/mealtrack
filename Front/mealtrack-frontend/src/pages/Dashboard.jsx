import { useEffect, useState } from "react";
import { Apple, Boxes, ClipboardList, Scale, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import * as dashboardService from "@/services/dashboardService";
import * as producaoService from "@/services/producaoService";
import { formatKg, formatNumber } from "@/utils/formatters";

/**
 * Não existe endpoint de série histórica no backend — só o agregado de
 * GET /dashboard. O gráfico de "produção por alimento" é derivado, no
 * cliente, da lista real de GET /producoes (sem inventar dado nenhum).
 */
function buildProducaoPorAlimento(registros) {
  const totals = new Map();
  for (const registro of registros) {
    const nome = registro.alimento?.nome ?? "Sem alimento";
    totals.set(nome, (totals.get(nome) ?? 0) + (registro.quantidadeProduzida ?? 0));
  }
  return Array.from(totals, ([nome, total]) => ({ nome, total: Number(total.toFixed(2)) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const [dashboardData, producoes] = await Promise.all([
        dashboardService.obterDashboard(),
        producaoService.listarProducoes(),
      ]);
      setDashboard(dashboardData);
      setChartData(buildProducaoPorAlimento(producoes));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return <ErrorState description={error} onRetry={loadData} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Visão geral da produção e do cadastro do restaurante."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total de alimentos"
          value={formatNumber(dashboard?.totalAlimentos)}
          icon={Apple}
          isLoading={isLoading}
        />
        <StatCard
          label="Total de usuários"
          value={formatNumber(dashboard?.totalUsuarios)}
          icon={Users}
          isLoading={isLoading}
          accent="success"
        />
        <StatCard
          label="Registros de produção"
          value={formatNumber(dashboard?.totalProducoes)}
          icon={ClipboardList}
          isLoading={isLoading}
          accent="warning"
        />
        <StatCard
          label="Quantidade produzida"
          value={formatKg(dashboard?.quantidadeProduzida)}
          icon={Scale}
          isLoading={isLoading}
          hint={
            dashboard?.mediaProduzida != null
              ? `Média de ${formatKg(dashboard.mediaProduzida)} por registro`
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produção por alimento</CardTitle>
            <CardDescription>Soma da quantidade produzida (kg), por alimento.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-md bg-muted" />
            ) : chartData.length === 0 ? (
              <EmptyState
                title="Sem registros de produção"
                description="Assim que a produção for registrada, o gráfico aparece aqui."
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="nome"
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--popover-foreground))",
                      fontSize: 13,
                    }}
                    formatter={(value) => [`${value} kg`, "Produzido"]}
                  />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alimento mais produzido</CardTitle>
            <CardDescription>Segundo o total histórico de registros.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-full items-center">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Boxes className="size-5" />
              </div>
              <div>
                <p className="text-lg font-semibold text-foreground">
                  {dashboard?.alimentoMaisProduzido ?? "—"}
                </p>
                <p className="text-sm text-muted-foreground">Alimento líder de produção</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
