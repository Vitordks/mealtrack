import { api } from "@/services/api";

/** @typedef {import("@/types/entities").Restaurante} Restaurante */

/** @returns {Promise<Restaurante[]>} */
export async function listarRestaurantes() {
  const response = await api.get("/restaurantes");
  return response.data;
}

/** @returns {Promise<Restaurante>} */
export async function buscarRestaurante(id) {
  const response = await api.get(`/restaurantes/${id}`);
  return response.data;
}

/** @returns {Promise<Restaurante>} */
export async function criarRestaurante(restaurante) {
  const response = await api.post("/restaurantes", restaurante);
  return response.data;
}

/** @returns {Promise<Restaurante>} */
export async function atualizarRestaurante(id, restaurante) {
  const response = await api.put(`/restaurantes/${id}`, restaurante);
  return response.data;
}

export async function excluirRestaurante(id) {
  await api.delete(`/restaurantes/${id}`);
}
