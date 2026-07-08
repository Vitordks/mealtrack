/**
 * Envelope usado *apenas* pelo endpoint POST /usuarios/login.
 * Todos os demais endpoints (alimentos, refeicoes, producoes,
 * restaurantes, usuarios, dashboard) retornam o corpo "cru",
 * sem esse envelope — não assuma ApiResponse em outros lugares.
 *
 * @template T
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {T|null} data
 */

export {};
