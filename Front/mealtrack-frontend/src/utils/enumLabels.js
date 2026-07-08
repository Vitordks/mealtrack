/**
 * Nunca traduzir o valor enviado/recebido da API — só o rótulo exibido.
 * O valor que trafega em requests/responses continua sendo exatamente
 * "ADMIN" | "SUPERVISOR" | "FUNCIONARIO" / "FISICA" | "JURIDICA".
 */

export const NIVEL_ACESSO_OPTIONS = [
  { value: "ADMIN", label: "Administrador" },
  { value: "SUPERVISOR", label: "Gerente" },
  { value: "FUNCIONARIO", label: "Funcionário" },
];

export const NIVEL_ACESSO_BADGE = {
  ADMIN: { label: "Administrador", variant: "default" },
  SUPERVISOR: { label: "Gerente", variant: "secondary" },
  FUNCIONARIO: { label: "Funcionário", variant: "outline" },
};

export function nivelAcessoLabel(value) {
  return NIVEL_ACESSO_BADGE[value]?.label ?? value ?? "—";
}

export const TIPO_PESSOA_OPTIONS = [
  { value: "FISICA", label: "Pessoa física" },
  { value: "JURIDICA", label: "Pessoa jurídica" },
];

export function tipoPessoaLabel(value) {
  return TIPO_PESSOA_OPTIONS.find((option) => option.value === value)?.label ?? value ?? "—";
}
