import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, AlertCircle, BarChart3, Scale } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import * as dashboardService from "@/services/dashboardService";
import * as producaoService from "@/services/producaoService";
import { formatKg, formatNumber } from "@/utils/formatters";

const CORES_GRAFICO = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

function dataCurta(valor) {
  if (!valor) return "Sem data";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(valor));
}

function agruparPorAlimento(registros) {
  const totais = new Map();

  for (const registro of registros) {
    const nome = registro.alimento?.nome ?? "Sem alimento";
    totais.set(nome, (totais.get(nome) ?? 0) + (registro.quantidadeProduzida ?? 0));
  }

  return Array.from(totais, ([nome, total]) => ({
    nome,
    total: Number(total.toFixed(2)),
  })).sort((a, b) => b.total - a.total);
}

function agruparPorDia(registros) {
  const totais = new Map();

  for (const registro of registros) {
    const chave = dataCurta(registro.dataRegistro);
    totais.set(chave, (totais.get(chave) ?? 0) + (registro.quantidadeProduzida ?? 0));
  }

  return Array.from(totais, ([data, total]) => ({
    data,
    total: Number(total.toFixed(2)),
  })).slice(-10);
}

export default function RelatoriosPage() {
  const [dashboard, setDashboard] = useState(null);
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function carregarDados() {
    setIsLoading(true);
    setError(null);
    try {
      const [dadosDashboard, dadosProducao] = await Promise.all([
        dashboardService.obterDashboard(),
        producaoService.listarProducoes(),
      ]);
      setDashboard(dadosDashboard);
      setRegistros(dadosProducao);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  const producaoPorAlimento = useMemo(() => agruparPorAlimento(registros), [registros]);
  const producaoPorDia = useMemo(() => agruparPorDia(registros), [registros]);
  const topAlimentos = producaoPorAlimento.slice(0, 6);

  if (error) {
    return <ErrorState description={error} onRetry={carregarDados} />;
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Relatórios"
        description="Análise da produção registrada e concentração por alimento."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Produção total"
          value={formatKg(dashboard?.quantidadeProduzida)}
          icon={Scale}
          isLoading={isLoading}
        />
        <StatCard
          label="Média por registro"
          value={formatKg(dashboard?.mediaProduzida)}
          icon={Activity}
          isLoading={isLoading}
          accent="success"
        />
        <StatCard
          label="Registros analisados"
          value={formatNumber(dashboard?.totalProducoes)}
          icon={BarChart3}
          isLoading={isLoading}
          accent="warning"
        />
        <StatCard
          label="Controle de desperdício"
          value="Pendente"
          icon={AlertCircle}
          isLoading={isLoading}
          hint="O backend atual ainda não registra sobra ou consumo."
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-md bg-muted" />
          <div className="h-96 animate-pulse rounded-md bg-muted" />
        </div>
      ) : registros.length === 0 ? (
        <EmptyState
          title="Sem dados para relatório"
          description="Registre a produção diária para visualizar indicadores e gráficos."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
          <Card className="xl:col-span-3">
            <CardHeader>
              <CardTitle>Produção por dia</CardTitle>
              <CardDescription>Últimos dias com registros de produção em kg.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={producaoPorDia} margin={{ left: -18, right: 12 }}>
                  <defs>
                    <linearGradient id="producaoDia" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="data" tick={{ fontSize: 12 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => [`${value} kg`, "Produzido"]} />
                  <Area
                    dataKey="total"
                    fill="url(#producaoDia)"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Concentração por alimento</CardTitle>
              <CardDescription>Participação dos principais alimentos no total produzido.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topAlimentos}
                    dataKey="total"
                    nameKey="nome"
                    innerRadius={58}
                    outerRadius={96}
                    paddingAngle={3}
                  >
                    {topAlimentos.map((item, index) => (
                      <Cell key={item.nome} fill={CORES_GRAFICO[index % CORES_GRAFICO.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, nome) => [`${value} kg`, nome]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="xl:col-span-5">
            <CardHeader>
              <CardTitle>Ranking de produção</CardTitle>
              <CardDescription>Alimentos ordenados pela quantidade total registrada.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAlimentos} layout="vertical" margin={{ left: 32, right: 16 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                  <YAxis
                    dataKey="nome"
                    type="category"
                    width={120}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip formatter={(value) => [`${value} kg`, "Produzido"]} />
                  <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
