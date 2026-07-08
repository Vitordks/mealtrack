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
import * as refeicaoService from "@/services/refeicaoService";
import { formatCurrency } from "@/utils/formatters";

const EMPTY_FORM = { nome: "", valor: "" };

const service = {
  list: refeicaoService.listarRefeicoes,
  create: refeicaoService.criarRefeicao,
  update: refeicaoService.atualizarRefeicao,
  remove: refeicaoService.excluirRefeicao,
};

export default function RefeicoesPage() {
  const { items, isLoading, error, isSubmitting, refetch, create, update, remove } = useCrud(
    service,
    { resourceLabel: "Refeição" },
  );

  const [drawer, setDrawer] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setDrawer({ open: true, editing: null });
  }

  function openEdit(refeicao) {
    setForm({ nome: refeicao.nome ?? "", valor: String(refeicao.valor ?? "") });
    setDrawer({ open: true, editing: refeicao });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = { nome: form.nome, valor: Number(form.valor) };
    const ok = drawer.editing ? await update(drawer.editing.id, payload) : await create(payload);
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
        title="Refeições"
        description="Cardápio de refeições oferecidas pelo restaurante."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Nova refeição
          </Button>
        }
      />

      <DataTable
        data={items}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        getRowId={(item) => item.id}
        searchPlaceholder="Buscar por nome..."
        searchFn={(item, query) => item.nome?.toLowerCase().includes(query)}
        emptyTitle="Nenhuma refeição cadastrada"
        emptyDescription="Cadastre a primeira refeição do cardápio."
        columns={[
          {
            key: "nome",
            header: "Nome",
            render: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
          },
          {
            key: "valor",
            header: "Valor",
            className: "font-mono tabular-nums",
            render: (item) => formatCurrency(item.valor),
          },
        ]}
        renderActions={(item) => (
          <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
        )}
      />

      <FormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((current) => ({ ...current, open }))}
        title={drawer.editing ? "Editar refeição" : "Nova refeição"}
        description="Informe o nome e o valor cobrado pela refeição."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <FormField label="Nome" htmlFor="nome" required>
          <Input
            id="nome"
            required
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            placeholder="Prato executivo"
          />
        </FormField>
        <FormField label="Valor (R$)" htmlFor="valor" required>
          <Input
            id="valor"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.valor}
            onChange={(event) => setForm((current) => ({ ...current, valor: event.target.value }))}
            placeholder="29.90"
          />
        </FormField>
      </FormDrawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir refeição"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
