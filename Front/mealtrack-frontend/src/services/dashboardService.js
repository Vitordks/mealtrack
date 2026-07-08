import { api } from "@/services/api";

/** @typedef {import("@/types/producao").DashboardData} DashboardData */

/** @returns {Promise<DashboardData>} */
export async function obterDashboard() {
  const response = await api.get("/dashboard");
  return response.data;
}
