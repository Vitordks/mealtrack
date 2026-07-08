import { APP_LOCALE } from "@/config/app";

const dateTimeFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const dateFormatter = new Intl.DateTimeFormat(APP_LOCALE, {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat(APP_LOCALE, {
  style: "currency",
  currency: "BRL",
});

const numberFormatter = new Intl.NumberFormat(APP_LOCALE);

const kgFormatter = new Intl.NumberFormat(APP_LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

/** @param {string | null | undefined} value ISO date/datetime */
export function formatDateTime(value) {
  if (!value) return "—";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "—" : dateTimeFormatter.format(parsed);
}

/** @param {string | null | undefined} value ISO date (yyyy-MM-dd) */
export function formatDate(value) {
  if (!value) return "—";
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? "—" : dateFormatter.format(parsed);
}

/** @param {number | null | undefined} value */
export function formatCurrency(value) {
  if (value === null || value === undefined) return "—";
  return currencyFormatter.format(value);
}

/** @param {number | null | undefined} value */
export function formatNumber(value) {
  if (value === null || value === undefined) return "—";
  return numberFormatter.format(value);
}

/** @param {number | null | undefined} value em kg */
export function formatKg(value) {
  if (value === null || value === undefined) return "—";
  return `${kgFormatter.format(value)} kg`;
}

/** Converte um datetime-local ("2026-01-01T12:00") para o ISO que o backend espera. */
export function toIsoDateTime(datetimeLocalValue) {
  if (!datetimeLocalValue) return null;
  return datetimeLocalValue.length === 16 ? `${datetimeLocalValue}:00` : datetimeLocalValue;
}

/** Converte um ISO datetime vindo da API para o formato aceito por <input type="datetime-local">. */
export function toDatetimeLocalInput(isoValue) {
  if (!isoValue) return "";
  return isoValue.slice(0, 16);
}
