import {
  Apple,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  Soup,
  Store,
  Users,
} from "lucide-react";

/**
 * `roles: undefined` = visível para qualquer usuário autenticado.
 * Administrador gerencia toda a operação, supervisor acompanha cadastros
 * operacionais e relatórios, funcionário registra produção.
 */
export const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/producao", label: "Produção", icon: ClipboardList },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3, roles: ["ADMIN", "SUPERVISOR"] },
  { to: "/alimentos", label: "Alimentos", icon: Apple, roles: ["ADMIN", "SUPERVISOR"] },
  { to: "/refeicoes", label: "Refeições", icon: Soup, roles: ["ADMIN", "SUPERVISOR"] },
  { to: "/usuarios", label: "Usuários", icon: Users, roles: ["ADMIN"] },
  { to: "/restaurantes", label: "Restaurantes", icon: Store, roles: ["ADMIN"] },
];
