import { api } from "@/services/api";

export async function executarSimulacao() {
  const response = await api.post("/simulacao/executar");
  return response.data;
}
