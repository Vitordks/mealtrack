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
import { Badge } from "@/components/ui/badge";
import { useCrud } from "@/hooks/useCrud";
import * as alimentoService from "@/services/alimentoService";

/** @typedef {import("@/types/entities").Alimento} Alimento */

const EMPTY_FORM = { nome: "", categoria: "" };

const service = {
  list: alimentoService.listarAlimentos,
  create: alimentoService.criarAlimento,
  update: alimentoService.atualizarAlimento,
  remove: alimentoService.excluirAlimento,
};

export default function AlimentosPage() {
  const { items, isLoading, error, isSubmitting, refetch, create, update, remove } = useCrud(
    service,
    { resourceLabel: "Alimento" },
  );

  const [drawer, setDrawer] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setDrawer({ open: true, editing: null });
  }

  function openEdit(alimento) {
    setForm({ nome: alimento.nome ?? "", categoria: alimento.categoria ?? "" });
    setDrawer({ open: true, editing: alimento });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const ok = drawer.editing
      ? await update(drawer.editing.id, form)
      : await create(form);
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
        title="Alimentos"
        description="Alimentos monitorados no buffet, usados nos registros de produção."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Novo alimento
          </Button>
        }
      />

      <DataTable
        data={items}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        getRowId={(item) => item.id}
        searchPlaceholder="Buscar por nome ou categoria..."
        searchFn={(item, query) =>
          item.nome?.toLowerCase().includes(query) || item.categoria?.toLowerCase().includes(query)
        }
        emptyTitle="Nenhum alimento cadastrado"
        emptyDescription="Cadastre o primeiro alimento para começar a registrar produção."
        columns={[
          { key: "nome", header: "Nome", render: (item) => (
            <span className="font-medium text-foreground">{item.nome}</span>
          ) },
          { key: "categoria", header: "Categoria", render: (item) => (
            <Badge variant="outline">{item.categoria}</Badge>
          ) },
        ]}
        renderActions={(item) => (
          <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
        )}
      />

      <FormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((current) => ({ ...current, open }))}
        title={drawer.editing ? "Editar alimento" : "Novo alimento"}
        description="Informe o nome e a categoria do alimento."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <FormField label="Nome" htmlFor="nome" required>
          <Input
            id="nome"
            required
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            placeholder="Arroz branco"
          />
        </FormField>
        <FormField label="Categoria" htmlFor="categoria" required>
          <Input
            id="categoria"
            required
            value={form.categoria}
            onChange={(event) =>
              setForm((current) => ({ ...current, categoria: event.target.value }))
            }
            placeholder="Cereais e grãos"
          />
        </FormField>
      </FormDrawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir alimento"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
