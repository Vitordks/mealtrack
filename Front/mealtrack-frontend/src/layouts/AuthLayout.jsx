import { Outlet } from "react-router-dom";

import logoMealTrack from "@/assets/logo-mealtrack.png";
import { APP_NAME } from "@/config/app";

export function AuthLayout() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top_left,hsl(var(--accent)),transparent_34%),hsl(var(--muted))] px-4">
      <div className="flex w-full max-w-sm flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <img src={logoMealTrack} alt={APP_NAME} className="h-24 w-auto object-contain" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{APP_NAME}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestão de produção e desperdício de alimentos
            </p>
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
