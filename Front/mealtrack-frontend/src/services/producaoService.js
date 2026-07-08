import { api } from "@/services/api";

/**
 * @typedef {import("@/types/producao").RegistroProducao} RegistroProducao
 * @typedef {import("@/types/producao").RegistroProducaoRequest} RegistroProducaoRequest
 */

/** @returns {Promise<RegistroProducao[]>} */
export async function listarProducoes() {
  const response = await api.get("/producoes");
  return response.data;
}

/** @returns {Promise<RegistroProducao>} */
export async function buscarProducao(id) {
  const response = await api.get(`/producoes/${id}`);
  return response.data;
}

/**
 * @param {RegistroProducaoRequest} registro
 * @returns {Promise<RegistroProducao>}
 */
export async function criarProducao(registro) {
  const response = await api.post("/producoes", registro);
  return response.data;
}

/**
 * @param {number} id
 * @param {RegistroProducaoRequest} registro
 * @returns {Promise<RegistroProducao>}
 */
export async function atualizarProducao(id, registro) {
  const response = await api.put(`/producoes/${id}`, registro);
  return response.data;
}

export async function excluirProducao(id) {
  await api.delete(`/producoes/${id}`);
}
