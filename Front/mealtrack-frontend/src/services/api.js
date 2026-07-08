import axios from "axios";

import { API_URL } from "@/config/env";
import { AUTH_STORAGE_KEY } from "@/config/app";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Injeta o Bearer token em toda requisição, quando existir sessão salva.
 * A API não altera contrato: o header é sempre enviado, mesmo que o
 * backend ainda não valide o JWT em todas as rotas — a integração fica
 * pronta para quando o filtro for implementado no servidor.
 */
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // sessão corrompida no storage — ignora, requisição segue sem token
    }
  }
  return config;
});

/**
 * Normaliza erros de resposta para uma mensagem legível, sem esconder
 * o status original. Uma sessão expirada/rejeitada (401) limpa o
 * storage local; quem escuta esse evento (AuthContext) decide o que
 * fazer (redirecionar para o login).
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("mealtrack:unauthorized"));
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      error.message ||
      "Erro inesperado ao comunicar com o servidor.";

    return Promise.reject(new Error(message));
  },
);
