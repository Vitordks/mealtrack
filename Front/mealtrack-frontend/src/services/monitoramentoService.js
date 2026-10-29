import { api } from "@/services/api";

export async function listarMonitoramento() {
  const response = await api.get("/monitoramento");
  return response.data;
}

export async function obterResumoMonitoramento() {
  const response = await api.get("/monitoramento/summary");
  return response.data;
}

export async function obterEventosMonitoramento() {
  const response = await api.get("/monitoramento/history");
  return response.data;
}

export async function reporBandeja(id) {
  const response = await api.post(`/monitoramento/repor/${id}`);
  return response.data;
}
