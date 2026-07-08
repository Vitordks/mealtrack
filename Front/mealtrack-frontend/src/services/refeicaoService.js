import { api } from "@/services/api";

/** @typedef {import("@/types/entities").Refeicao} Refeicao */

/** @returns {Promise<Refeicao[]>} */
export async function listarRefeicoes() {
  const response = await api.get("/refeicoes");
  return response.data;
}

/** @returns {Promise<Refeicao>} */
export async function buscarRefeicao(id) {
  const response = await api.get(`/refeicoes/${id}`);
  return response.data;
}

/** @returns {Promise<Refeicao>} */
export async function criarRefeicao(refeicao) {
  const response = await api.post("/refeicoes", refeicao);
  return response.data;
}

/** @returns {Promise<Refeicao>} */
export async function atualizarRefeicao(id, refeicao) {
  const response = await api.put(`/refeicoes/${id}`, refeicao);
  return response.data;
}

export async function excluirRefeicao(id) {
  await api.delete(`/refeicoes/${id}`);
}
