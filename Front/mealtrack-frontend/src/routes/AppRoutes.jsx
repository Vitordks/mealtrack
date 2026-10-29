import { Route, Routes } from "react-router-dom";

import { AppLayout } from "@/layouts/AppLayout";
import { AuthLayout } from "@/layouts/AuthLayout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Perfil from "@/pages/Perfil";
import NotFound from "@/pages/NotFound";
import UsuariosPage from "@/pages/usuarios/UsuariosPage";
import RestaurantesPage from "@/pages/restaurantes/RestaurantesPage";
import AlimentosPage from "@/pages/alimentos/AlimentosPage";
import Monitoramento from "@/pages/Monitoramento";
import Simulacao from "@/pages/Simulacao";
import ProducaoPage from "@/pages/producao/ProducaoPage";
import RelatoriosPage from "@/pages/relatorios/RelatoriosPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="/producao" element={<ProducaoPage />} />
        <Route
          path="/alimentos"
          element={
            <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
              <AlimentosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/relatorios"
          element={
            <ProtectedRoute roles={["ADMIN", "SUPERVISOR"]}>
              <RelatoriosPage />
            </ProtectedRoute>
          }
        />
        <Route path="/monitoramento" element={<Monitoramento />} />
        <Route path="/simulacao" element={<Simulacao />} />
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <UsuariosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/restaurantes"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <RestaurantesPage />
            </ProtectedRoute>
          }
        />
        <Route path="/perfil" element={<Perfil />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
