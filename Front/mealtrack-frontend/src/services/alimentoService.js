import { api } from "@/services/api";

/** @typedef {import("@/types/entities").Alimento} Alimento */

/** @returns {Promise<Alimento[]>} */
export async function listarAlimentos() {
  const response = await api.get("/alimentos");
  return response.data;
}

/** @returns {Promise<Alimento>} */
export async function buscarAlimento(id) {
  const response = await api.get(`/alimentos/${id}`);
  return response.data;
}

/** @returns {Promise<Alimento>} */
export async function criarAlimento(alimento) {
  const response = await api.post("/alimentos", alimento);
  return response.data;
}

/** @returns {Promise<Alimento>} */
export async function atualizarAlimento(id, alimento) {
  const response = await api.put(`/alimentos/${id}`, alimento);
  return response.data;
}

export async function excluirAlimento(id) {
  await api.delete(`/alimentos/${id}`);
}
