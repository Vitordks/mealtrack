import { api } from "@/services/api";

/**
 * @typedef {import("@/types/entities").LoginRequest} LoginRequest
 * @typedef {import("@/types/entities").LoginResponse} LoginResponse
 */

/**
 * POST /usuarios/login — único endpoint da API que responde com o
 * envelope ApiResponse<T>. Aqui já retornamos o `data` de dentro,
 * para o restante do app nunca precisar lidar com esse envelope.
 *
 * @param {LoginRequest} credentials
 * @returns {Promise<LoginResponse>}
 */
export async function login(credentials) {
  const response = await api.post("/usuarios/login", credentials);
  return response.data.data;
}
