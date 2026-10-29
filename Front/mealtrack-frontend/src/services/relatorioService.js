import { api } from "@/services/api";

export async function obterRelatorio() {
  const response = await api.get("/relatorios");
  return response.data;
}
