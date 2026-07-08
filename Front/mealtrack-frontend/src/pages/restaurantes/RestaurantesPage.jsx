import { useState } from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormDrawer } from "@/components/shared/FormDrawer";
import { FormField } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { RowActions } from "@/components/shared/RowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCrud } from "@/hooks/useCrud";
import * as restauranteService from "@/services/restauranteService";
import { formatDate } from "@/utils/formatters";

const EMPTY_FORM = { nome: "", cnpj: "", email: "", telefone: "", endereco: "", dataFundacao: "" };

const service = {
  list: restauranteService.listarRestaurantes,
  create: restauranteService.criarRestaurante,
  update: restauranteService.atualizarRestaurante,
  remove: restauranteService.excluirRestaurante,
};

export default function RestaurantesPage() {
  const { items, isLoading, error, isSubmitting, refetch, create, update, remove } = useCrud(
    service,
    { resourceLabel: "Restaurante" },
  );

  const [drawer, setDrawer] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setDrawer({ open: true, editing: null });
  }

  function openEdit(restaurante) {
    setForm({
      nome: restaurante.nome ?? "",
      cnpj: restaurante.cnpj ?? "",
      email: restaurante.email ?? "",
      telefone: restaurante.telefone ?? "",
      endereco: restaurante.endereco ?? "",
      dataFundacao: restaurante.dataFundacao ?? "",
    });
    setDrawer({ open: true, editing: restaurante });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const ok = drawer.editing ? await update(drawer.editing.id, form) : await create(form);
    if (ok) setDrawer({ open: false, editing: null });
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const ok = await remove(deleteTarget.id);
    setIsDeleting(false);
    if (ok) setDeleteTarget(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Restaurantes"
        description="Estabelecimentos cadastrados na plataforma."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Novo restaurante
          </Button>
        }
      />

      <DataTable
        data={items}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        getRowId={(item) => item.id}
        searchPlaceholder="Buscar por nome ou CNPJ..."
        searchFn={(item, query) =>
          item.nome?.toLowerCase().includes(query) || item.cnpj?.toLowerCase().includes(query)
        }
        emptyTitle="Nenhum restaurante cadastrado"
        emptyDescription="Cadastre o primeiro estabelecimento para começar."
        columns={[
          {
            key: "nome",
            header: "Nome",
            render: (item) => (
              <div>
                <p className="font-medium text-foreground">{item.nome}</p>
                <p className="text-xs text-muted-foreground">{item.cnpj}</p>
              </div>
            ),
          },
          { key: "email", header: "E-mail", render: (item) => item.email },
          { key: "telefone", header: "Telefone", render: (item) => item.telefone },
          {
            key: "dataFundacao",
            header: "Fundação",
            className: "font-mono tabular-nums",
            render: (item) => formatDate(item.dataFundacao),
          },
        ]}
        renderActions={(item) => (
          <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
        )}
      />

      <FormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((current) => ({ ...current, open }))}
        title={drawer.editing ? "Editar restaurante" : "Novo restaurante"}
        description="Dados cadastrais do estabelecimento."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <FormField label="Nome" htmlFor="nome" required>
          <Input
            id="nome"
            required
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            placeholder="Restaurante Sabor Caseiro"
          />
        </FormField>
        <FormField label="CNPJ" htmlFor="cnpj" required>
          <Input
            id="cnpj"
            required
            value={form.cnpj}
            onChange={(event) => setForm((current) => ({ ...current, cnpj: event.target.value }))}
            placeholder="00.000.000/0001-00"
          />
        </FormField>
        <FormField label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="contato@restaurante.com"
          />
        </FormField>
        <FormField label="Telefone" htmlFor="telefone" required>
          <Input
            id="telefone"
            required
            value={form.telefone}
            onChange={(event) =>
              setForm((current) => ({ ...current, telefone: event.target.value }))
            }
            placeholder="(71) 90000-0000"
          />
        </FormField>
        <FormField label="Endereço" htmlFor="endereco" required>
          <Input
            id="endereco"
            required
            value={form.endereco}
            onChange={(event) =>
              setForm((current) => ({ ...current, endereco: event.target.value }))
            }
            placeholder="Rua das Flores, 123 — Camaçari, BA"
          />
        </FormField>
        <FormField label="Data de fundação" htmlFor="dataFundacao" required>
          <Input
            id="dataFundacao"
            type="date"
            required
            value={form.dataFundacao}
            onChange={(event) =>
              setForm((current) => ({ ...current, dataFundacao: event.target.value }))
            }
          />
        </FormField>
      </FormDrawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir restaurante"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
