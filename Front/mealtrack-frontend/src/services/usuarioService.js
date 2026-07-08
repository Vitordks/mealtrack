import { api } from "@/services/api";

/**
 * @typedef {import("@/types/entities").UsuarioResponse} UsuarioResponse
 * @typedef {import("@/types/entities").UsuarioRequest} UsuarioRequest
 * @typedef {import("@/types/entities").Usuario} Usuario
 */

/** @returns {Promise<UsuarioResponse[]>} */
export async function listarUsuarios() {
  const response = await api.get("/usuarios");
  return response.data;
}

/** @returns {Promise<UsuarioResponse>} */
export async function buscarUsuario(id) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

/**
 * @param {UsuarioRequest} usuario
 * @returns {Promise<UsuarioResponse>}
 */
export async function criarUsuario(usuario) {
  const response = await api.post("/usuarios", usuario);
  return response.data;
}

/**
 * O backend espera a entidade Usuario completa no corpo do PUT
 * (não o UsuarioRequest). Quem chama deve montar esse objeto.
 *
 * @param {number} id
 * @param {Usuario} usuario
 * @returns {Promise<UsuarioResponse>}
 */
export async function atualizarUsuario(id, usuario) {
  const response = await api.put(`/usuarios/${id}`, usuario);
  return response.data;
}

export async function excluirUsuario(id) {
  await api.delete(`/usuarios/${id}`);
}
