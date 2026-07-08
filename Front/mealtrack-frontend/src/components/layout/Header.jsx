import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UserMenu } from "@/components/layout/UserMenu";
import { Button } from "@/components/ui/button";

/** @param {{ onOpenMobileSidebar: () => void }} props */
export function Header({ onOpenMobileSidebar }) {
  return (
    <header className="flex h-header shrink-0 items-center justify-between border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileSidebar}
        aria-label="Abrir menu de navegação"
      >
        <Menu className="size-5" />
      </Button>
      <div className="hidden text-sm text-muted-foreground md:block">
        Planejamento, produção e análise em um só lugar.
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
