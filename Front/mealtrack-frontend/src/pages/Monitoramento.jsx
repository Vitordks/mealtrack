import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  DollarSign,
  Layers,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Utensils,
  Trash2,
  Clock,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import * as monitoramentoService from "@/services/monitoramentoService";
import { formatCurrency, formatDateTime, formatKg, formatNumber } from "@/utils/formatters";

const STATUS_CORES = {
  DISPONIVEL: "bg-emerald-100 text-emerald-800",
  ATENCAO: "bg-amber-100 text-amber-800",
  CRITICO: "bg-red-100 text-red-800",
  ESGOTADO: "bg-slate-200 text-slate-700",
  VENCIDO: "bg-purple-100 text-purple-800",
};

export default function Monitoramento() {
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  async function carregarMonitoramento() {
    setError(null);
    try {
      const [itemsData, summaryData, historyData] = await Promise.all([
        monitoramentoService.listarMonitoramento(),
        monitoramentoService.obterResumoMonitoramento(),
        monitoramentoService.obterEventosMonitoramento(),
      ]);
      setItems(itemsData);
      setSummary(summaryData);
      setHistory(historyData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    carregarMonitoramento();
    
    // Auto-refresh a cada 10 segundos
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(carregarMonitoramento, 10000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  async function handleRepor(id) {
    try {
      await monitoramentoService.reporBandeja(id);
      carregarMonitoramento();
    } catch (err) {
      setError(err.message);
    }
  }

  const cartoesDestaque = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Maior desperdício", value: summary.alimentoMaiorDesperdicio ?? "—", icon: TrendingDown },
      { label: "Maior consumo", value: summary.alimentoMaiorConsumo ?? "—", icon: Activity },
      { label: "Maior lucro perdido", value: summary.alimentoMaiorLucroPerdido ?? "—", icon: DollarSign },
      { label: "Mais produzido", value: summary.alimentoMaisProduzido ?? "—", icon: Layers },
      { label: "Mais consumido", value: summary.alimentoMaisConsumido ?? "—", icon: BarChart3 },
      { label: "Mais desperdiçado", value: summary.alimentoMaisDesperdicado ?? "—", icon: AlertTriangle },
      { label: "Eficiência média", value: `${formatNumber(summary.eficienciaMedia)}%`, icon: TrendingUp },
      {
        label: "Perda financeira",
        value: formatCurrency(Number(summary.perdaFinanceira ?? 0)),
        icon: DollarSign,
      },
    ];
  }, [summary]);

  const indicadoresGerais = useMemo(() => {
    if (!summary) return [];
    return [
      { label: "Total produzido", value: formatKg(summary.totalProduzido) },
      { label: "Total consumido", value: formatKg(summary.totalConsumido) },
      { label: "Total desperdiçado", value: formatKg(summary.totalDesperdicado) },
      { label: "Reposições", value: formatKg(summary.totalReposicao) },
      { label: "Em bandeja", value: formatKg(summary.totalAtual) },
    ];
  }, [summary]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Central de Monitoramento"
        description="Central operacional do buffet — acompanhe estoque, consumo, desperdício e eventos em tempo real."
        actions={
          <div className="flex gap-2">
            <Button 
              variant={autoRefresh ? "default" : "outline"} 
              onClick={() => setAutoRefresh(!autoRefresh)}
              size="sm"
            >
              <Clock className="mr-2 h-4 w-4" />
              {autoRefresh ? "Auto: ON" : "Auto: OFF"}
            </Button>
            <Button variant="outline" onClick={carregarMonitoramento} disabled={isLoading}>
              <RefreshCw className={isLoading ? "animate-spin" : ""} />
              Atualizar
            </Button>
          </div>
        }
      />
      
      {lastUpdate && (
        <div className="text-sm text-muted-foreground">
          Última atualização: {formatDateTime(lastUpdate)}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {indicadoresGerais.map((item) => (
          <Card key={item.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-xl font-semibold">{isLoading ? "—" : item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cartoesDestaque.map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-semibold">{isLoading ? "—" : item.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Bandejas em operação</CardTitle>
            <CardDescription>
              Quantidade inicial, atual, consumo, reposições, perdas e eficiência por alimento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alimento</TableHead>
                  <TableHead>Inicial</TableHead>
                  <TableHead>Atual</TableHead>
                  <TableHead>Consumo</TableHead>
                  <TableHead>Reposição</TableHead>
                  <TableHead>Perdas</TableHead>
                  <TableHead>Valor perdido</TableHead>
                  <TableHead>Eficiência</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>{formatKg(item.quantidadeInicialKg)}</TableCell>
                    <TableCell>{formatKg(item.quantidadeAtualKg)}</TableCell>
                    <TableCell>{formatKg(item.quantidadeConsumida)}</TableCell>
                    <TableCell>{formatKg(item.quantidadeReposicaoKg)}</TableCell>
                    <TableCell>{formatKg(item.desperdicioKg)}</TableCell>
                    <TableCell>{formatCurrency(Number(item.valorPerdido ?? 0))}</TableCell>
                    <TableCell>{formatNumber(item.eficiencia)}%</TableCell>
                    <TableCell>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CORES[item.status] ?? STATUS_CORES.DISPONIVEL}`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleRepor(item.id)}>
                        Repor
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visualização em Tempo Real</CardTitle>
            <CardDescription>Status atual das bandejas com representação visual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => {
              const percentualRestante = item.percentualRestante ?? 0;
              const percentualConsumido = 100 - percentualRestante;
              const statusColor = 
                percentualRestante > 50 ? "bg-emerald-500" :
                percentualRestante > 25 ? "bg-amber-500" :
                percentualRestante > 10 ? "bg-orange-500" : "bg-red-500";
              
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.nome}</span>
                    </div>
                    <Badge variant="outline">{formatKg(item.quantidadeAtualKg)}</Badge>
                  </div>
                  
                  <div className="relative h-8 rounded-lg bg-muted overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full transition-all duration-500 ${statusColor}`}
                      style={{ width: `${percentualRestante}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      <span className="drop-shadow-md">
                        {formatNumber(percentualRestante)}% disponível
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      <span>Consumido: {formatKg(item.quantidadeConsumida)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Trash2 className="h-3 w-3" />
                      <span>Perda: {formatKg(item.desperdicioKg)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de eventos</CardTitle>
            <CardDescription>Reposições, alertas, descartes e produções registradas.</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[520px] space-y-3 overflow-y-auto">
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum evento registrado.</p>
            ) : (
              history.map((evento) => (
                <div key={evento.id} className="rounded-lg border bg-muted/40 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {formatDateTime(evento.dataHora)}
                    </span>
                    <span className="rounded bg-background px-2 py-0.5 text-xs">{evento.tipo}</span>
                  </div>
                  <p className="mt-1 text-sm">{evento.descricao}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quantidade atual por alimento</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items.slice(0, 10)} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [formatKg(v), "Atual"]} />
                <Bar dataKey="quantidadeAtualKg" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Perda financeira por alimento</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={items.slice(0, 10)} margin={{ left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="nome" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Perda"]} />
                <Bar dataKey="valorPerdido" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      ) : null}
    </div>
  );
}
