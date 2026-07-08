import { useState } from "react";
import { Outlet } from "react-router-dom";

import { SidebarNav } from "@/components/layout/SidebarNav";
import { Header } from "@/components/layout/Header";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function AppLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* Sidebar fixa — visível a partir de md */}
      <aside className="hidden w-sidebar shrink-0 border-r border-sidebar-border md:block">
        <SidebarNav />
      </aside>

      {/* Sidebar em drawer — abaixo de md */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="right" className="w-sidebar max-w-[85vw] p-0 sm:max-w-none">
          <SidebarNav onNavigate={() => setIsMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header onOpenMobileSidebar={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
