/**
 * Configurações globais não relacionadas a ambiente (env.js) nem a tema
 * visual (definido via design tokens no Tailwind). Constantes usadas em
 * mais de uma tela devem morar aqui, nunca espalhadas pelo código.
 */
export const APP_NAME = "MealTrack";

/** Chave usada no localStorage para persistir a sessão autenticada. */
export const AUTH_STORAGE_KEY = "mealtrack:auth";

/** Tamanho de página padrão para listagens client-side (a API não pagina). */
export const DEFAULT_PAGE_SIZE = 10;

/** Locale usado em formatações de data e número em toda a aplicação. */
export const APP_LOCALE = "pt-BR";
