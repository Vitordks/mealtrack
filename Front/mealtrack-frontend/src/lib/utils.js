import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classNames condicionais (clsx) e resolve conflitos de utilitárias
 * Tailwind (twMerge) — ex: cn("px-2", condition && "px-4") sempre resulta
 * em só um `px-*` aplicado, o último. Usado em todos os componentes de UI.
 *
 * @param {...unknown} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
