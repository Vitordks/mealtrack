import { NavLink } from "react-router-dom";

import logoMealTrack from "@/assets/logo-mealtrack.png";
import { NAV_ITEMS } from "@/components/layout/nav-items";
import { APP_NAME } from "@/config/app";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

/** @param {{ onNavigate?: () => void }} props */
export function SidebarNav({ onNavigate }) {
  const { user } = useAuth();

  const items = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.nivelAcesso));

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-header shrink-0 items-center gap-3 border-b border-sidebar-border px-5">
        <img src={logoMealTrack} alt={APP_NAME} className="h-10 w-10 rounded-md object-contain" />
        <div className="min-w-0">
          <span className="block text-base font-semibold tracking-tight">{APP_NAME}</span>
          <span className="block truncate text-xs text-sidebar-foreground/60">
            Controle operacional
          </span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-border/70 hover:text-sidebar-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground/60">
        MealTrack © {new Date().getFullYear()}
      </div>
    </div>
  );
}
