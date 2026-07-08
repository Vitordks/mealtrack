import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

/**
 * @param {{ children: React.ReactNode, roles?: string[] }} props
 * roles: se informado, restringe o acesso aos NivelAcesso listados.
 * Sem sessão -> redireciona para /login preservando a rota de origem.
 * Sem permissão -> redireciona para o dashboard.
 */
export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.nivelAcesso)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
