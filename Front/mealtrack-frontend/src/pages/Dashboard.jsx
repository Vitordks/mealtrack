import { useEffect, useState } from "react";
import {
  Apple,
  ClipboardList,
  Scale,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import * as dashboardService from "@/services/dashboardService";
import { formatCurrency, formatKg, formatNumber } from "@/utils/formatters";

function formatarDia(dia) {
  if (!dia) return "";
  const [, mes, d] = dia.split("-");
  return `${d}/${mes}`;
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    setIsLoading(true);
    setError(null);
    try {
      const dashboardData = await dashboardService.obterDashboard();
      setDashboard(dashboardData);
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

  const producaoDiaria = (dashboard?.producaoDiaria ?? []).map((d) => ({
    ...d,
    label: formatarDia(d.dia),
  }));
  const consumoDiario = (dashboard?.consumoDiario ?? []).map((d) => ({
    ...d,
    label: formatarDia(d.dia),
  }));
  const desperdicioDiario = (dashboard?.desperdicioDiario ?? []).map((d) => ({
    ...d,
    label: formatarDia(d.dia),
  }));
  const topAlimentos = dashboard?.topAlimentos ?? [];
  const perdasFinanceiras = dashboard?.perdasFinanceiras ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard"
        description="Visão gerencial da produção, consumo, desperdício e eficiência do restaurante."
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
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Consumo total"
          value={formatKg(dashboard?.quantidadeConsumida)}
          icon={TrendingUp}
          isLoading={isLoading}
          accent="success"
        />
        <StatCard
          label="Desperdício total"
          value={formatKg(dashboard?.desperdicioKg)}
          icon={TrendingDown}
          isLoading={isLoading}
          accent="warning"
        />
        <StatCard
          label="Eficiência operacional"
          value={`${formatNumber(dashboard?.eficienciaOperacional)}%`}
          icon={TrendingUp}
          isLoading={isLoading}
        />
        <StatCard
          label="Perda financeira"
          value={formatCurrency(Number(dashboard?.perdaFinanceira ?? 0))}
          icon={Wallet}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produção diária</CardTitle>
            <CardDescription>Volume produzido por dia (kg).</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-md bg-muted" />
            ) : producaoDiaria.length === 0 ? (
              <EmptyState title="Sem dados de produção" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={producaoDiaria}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} kg`, "Produção"]} />
                  <Area type="monotone" dataKey="valor" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumo diário</CardTitle>
            <CardDescription>Volume consumido por dia (kg).</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-md bg-muted" />
            ) : consumoDiario.length === 0 ? (
              <EmptyState title="Sem dados de consumo" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={consumoDiario}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} kg`, "Consumo"]} />
                  <Line type="monotone" dataKey="valor" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desperdício diário</CardTitle>
            <CardDescription>Sobra descartada por dia (kg) — única fonte de desperdício.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-md bg-muted" />
            ) : desperdicioDiario.length === 0 ? (
              <EmptyState title="Sem dados de desperdício" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={desperdicioDiario}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} kg`, "Desperdício"]} />
                  <Bar dataKey="valor" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top alimentos</CardTitle>
            <CardDescription>Ranking por consumo e desperdício.</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            {isLoading ? (
              <div className="h-full animate-pulse rounded-md bg-muted" />
            ) : topAlimentos.length === 0 ? (
              <EmptyState title="Sem ranking" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAlimentos} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="nome" type="category" width={90} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="consumido" fill="hsl(var(--chart-2))" name="Consumido (kg)" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="desperdicado" fill="hsl(var(--chart-4))" name="Desperdiçado (kg)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perdas financeiras por alimento</CardTitle>
          <CardDescription>Valor perdido com base no descarte real (R$).</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {isLoading ? (
            <div className="h-full animate-pulse rounded-md bg-muted" />
          ) : perdasFinanceiras.length === 0 ? (
            <EmptyState title="Sem perdas registradas" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perdasFinanceiras}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Perda"]} />
                <Bar dataKey="valor" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
