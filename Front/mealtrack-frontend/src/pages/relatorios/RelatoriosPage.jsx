import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Activity, BarChart3, Download, FileText, Scale, TrendingDown, Wallet } from "lucide-react";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import * as relatorioService from "@/services/relatorioService";
import { formatCurrency, formatKg, formatNumber } from "@/utils/formatters";
import { api } from "@/services/api";

function formatarDia(dia) {
  if (!dia) return "";
  const [, mes, d] = dia.split("-");
  return `${d}/${mes}`;
}

export default function RelatoriosPage() {
  const [relatorio, setRelatorio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  async function carregarDados() {
    setIsLoading(true);
    setError(null);
    try {
      const dados = await relatorioService.obterRelatorio();
      setRelatorio(dados);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarDados();
  }, []);

  async function exportarCSV() {
    try {
      const response = await api.get("/relatorios/export/csv", {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_mealtrack.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erro ao exportar CSV:", err);
    }
  }

  async function exportarPDF() {
    try {
      const response = await api.get("/relatorios/export/pdf", {
        responseType: "blob"
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio_mealtrack.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Erro ao exportar PDF:", err);
    }
  }

  if (error) {
    return <ErrorState description={error} onRetry={carregarDados} />;
  }

  const producaoPorDia = (relatorio?.producaoPorDia ?? []).map((d) => ({
    ...d,
    label: formatarDia(d.dia),
  }));
  const desperdicioPorDia = (relatorio?.desperdicioPorDia ?? []).map((d) => ({
    ...d,
    label: formatarDia(d.dia),
  }));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Relatórios"
        description="Análise completa de produção, consumo, desperdício e perdas financeiras."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportarCSV} disabled={!relatorio?.porAlimento?.length}>
              <FileText className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={exportarPDF} disabled={!relatorio?.porAlimento?.length}>
              <Download className="mr-2 h-4 w-4" />
              Exportar PDF
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Produção total" value={formatKg(relatorio?.totalProduzido)} icon={Scale} isLoading={isLoading} />
        <StatCard label="Consumo total" value={formatKg(relatorio?.totalConsumido)} icon={Activity} isLoading={isLoading} accent="success" />
        <StatCard label="Desperdício total" value={formatKg(relatorio?.totalDesperdicado)} icon={TrendingDown} isLoading={isLoading} accent="warning" />
        <StatCard label="Eficiência" value={`${formatNumber(relatorio?.eficiencia)}%`} icon={BarChart3} isLoading={isLoading} />
        <StatCard
          label="Perda financeira"
          value={formatCurrency(Number(relatorio?.perdaFinanceira ?? 0))}
          icon={Wallet}
          isLoading={isLoading}
          hint={relatorio?.economiaPotencial != null ? `Economia potencial: ${formatCurrency(relatorio.economiaPotencial)}` : undefined}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-md bg-muted" />
          <div className="h-80 animate-pulse rounded-md bg-muted" />
        </div>
      ) : !relatorio?.porAlimento?.length ? (
        <EmptyState
          title="Sem dados para relatório"
          description="Execute a simulação ou registre produções para gerar indicadores."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Produção por dia</CardTitle>
                <CardDescription>Volume produzido nos últimos dias (kg).</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={producaoPorDia}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v} kg`, "Produção"]} />
                    <Area type="monotone" dataKey="producao" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Desperdício por dia</CardTitle>
                <CardDescription>Sobra descartada — única fonte de desperdício (kg).</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={desperdicioPorDia}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [`${v} kg`, "Desperdício"]} />
                    <Bar dataKey="desperdicio" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por alimento</CardTitle>
              <CardDescription>Produção, consumo, desperdício, reposição e eficiência.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alimento</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Produzido</TableHead>
                    <TableHead>Consumido</TableHead>
                    <TableHead>Desperdiçado</TableHead>
                    <TableHead>Reposição</TableHead>
                    <TableHead>Eficiência</TableHead>
                    <TableHead>Valor perdido</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatorio.porAlimento.map((linha) => (
                    <TableRow key={linha.alimento}>
                      <TableCell className="font-medium">{linha.alimento}</TableCell>
                      <TableCell>{linha.categoria}</TableCell>
                      <TableCell>{formatKg(linha.produzido)}</TableCell>
                      <TableCell>{formatKg(linha.consumido)}</TableCell>
                      <TableCell>{formatKg(linha.desperdicado)}</TableCell>
                      <TableCell>{formatKg(linha.reposicao)}</TableCell>
                      <TableCell>{formatNumber(linha.eficiencia)}%</TableCell>
                      <TableCell>{formatCurrency(Number(linha.valorPerdido ?? 0))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ranking de desperdício</CardTitle>
              <CardDescription>Alimentos com maior volume descartado.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={relatorio.rankingDesperdicio ?? []} layout="vertical" margin={{ left: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="nome" type="category" width={120} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`${v} kg`, "Desperdiçado"]} />
                  <Bar dataKey="desperdicado" fill="hsl(var(--chart-4))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
