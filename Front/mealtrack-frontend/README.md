# MealTrack — Frontend

Frontend do sistema MealTrack. Consome a API REST existente (Spring Boot, `http://localhost:8080`) sem nenhuma alteração de contrato, endpoints, DTOs ou regras de negócio.

## Stack

- React 19 + Vite
- Tailwind CSS (design tokens) + componentes estilo shadcn/ui (Radix UI + CVA)
- React Router 7 (rotas protegidas por autenticação e por nível de acesso)
- Axios (instância central com interceptors de token e de erro)
- Recharts
- Lucide React

## Como rodar

```bash
npm install
cp .env.example .env.local   # ajuste VITE_API_URL se o backend não estiver em localhost:8080
npm run dev
```

O backend precisa estar rodando e aceitando CORS de `http://localhost:5173` (já configurado nos `@CrossOrigin` dos controllers).

## Estrutura de pastas

```
src/
  assets/              Imagens, ícones estáticos
  components/
    ui/                Componentes de base (button, card, dialog, sheet, select,
                        table, badge, avatar, dropdown-menu, tooltip, tabs...)
    layout/            Sidebar, Header, ThemeToggle, UserMenu
    shared/             Componentes reutilizáveis entre telas: DataTable, SearchInput,
                        Pagination, EmptyState, ErrorState, TableSkeleton, ConfirmDialog,
                        FormDrawer, FormField, PageHeader, StatCard, RowActions, RoleBadge
  config/              env.js (URL da API) e app.js (constantes globais)
  contexts/            AuthContext (sessão) e ThemeContext (dark mode)
  hooks/               useAuth, useTheme, useCrud, usePagination, useDebounce
  layouts/             AuthLayout (tela de login) e AppLayout (sidebar + header + conteúdo)
  lib/                 utils.js — helper `cn` (clsx + tailwind-merge)
  pages/               Uma pasta por módulo: usuarios, restaurantes, alimentos,
                        refeicoes, producao — mais Dashboard, Login, Perfil, NotFound
  routes/              AppRoutes (definição de rotas) e ProtectedRoute (auth + roles)
  services/            Um arquivo por recurso da API, todos usando a mesma instância Axios
  types/               Typedefs JSDoc com o formato exato de cada entidade da API
  utils/               Formatadores (data, moeda, kg) e tradução de enums
```

## Convenções

- Cada recurso da API (`usuarios`, `restaurantes`, `alimentos`, `refeicoes`, `producoes`) tem
  um service dedicado em `src/services/`, e cada tela de CRUD usa o hook `useCrud` para
  listar/criar/atualizar/excluir sem repetir loading/erro/toast em cada página.
- Nenhuma tela usa dados mockados: toda informação exibida vem da API real.
- Toda cor, espaçamento, raio de borda, sombra e fonte vem de tokens definidos em
  `tailwind.config.js` / `src/index.css` — nunca valores fixos espalhados nos componentes.
- Dark mode via classe `dark` na tag `<html>`, alternável pelo botão no header
  e persistido em `localStorage`.

## Limitações conhecidas (do backend, não do frontend)

- O filtro JWT não está registrado no `SecurityFilterChain` do backend — o frontend já
  envia o Bearer token em toda requisição, mas rotas que exigem `authenticated()` podem
  responder 401/403 até esse filtro ser implementado no servidor.
- Não existem endpoints de monitoramento por balança, cálculo de desperdício ou
  exportação de relatórios (PDF/CSV) — por isso essas telas não foram construídas,
  conforme combinado.

## Status

Projeto completo: estrutura, tokens de tema, componentes de UI, layout, autenticação
e as 8 telas (Login, Dashboard, Usuários, Restaurantes, Alimentos, Refeições, Produção,
Perfil) implementadas e integradas à API real.

