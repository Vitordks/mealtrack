/**
 * Configuração de ambiente do frontend.
 *
 * A URL base da API pode ser sobrescrita criando um arquivo `.env.local`
 * na raiz do projeto com:
 *
 *   VITE_API_URL=http://localhost:8080
 *
 * Caso não seja definida, assume o endereço padrão do backend em
 * desenvolvimento (Spring Boot, sem context-path).
 */
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
