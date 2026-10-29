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

const EMPTY_FORM = { nome: "", categoria: "", valorPorQuilograma: "", quantidadeInicialKg: "", quantidadeAtualKg: "", quantidadeDesperdicadoKg: "" };

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
    setForm({
      nome: alimento.nome ?? "",
      categoria: alimento.categoria ?? "",
      valorPorQuilograma: alimento.valorPorQuilograma ?? "",
      quantidadeInicialKg: alimento.quantidadeInicialKg ?? "",
      quantidadeAtualKg: alimento.quantidadeAtualKg ?? "",
      quantidadeDesperdicadoKg: alimento.quantidadeDesperdicadoKg ?? "",
    });
    setDrawer({ open: true, editing: alimento });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      nome: form.nome,
      categoria: form.categoria,
      valorPorQuilograma: Number(form.valorPorQuilograma) || 0,
      quantidadeInicialKg: Number(form.quantidadeInicialKg) || 0,
      quantidadeAtualKg: Number(form.quantidadeAtualKg) || 0,
      quantidadeDesperdicadoKg: Number(form.quantidadeDesperdicadoKg) || 0,
    };

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
          { key: "quantidadeAtualKg", header: "Atual (kg)", className: "font-mono tabular-nums", render: (item) => (
            <span>{(item.quantidadeAtualKg ?? 0).toFixed(2)}</span>
          ) },
          { key: "quantidadeConsumida", header: "Consumido (kg)", className: "font-mono tabular-nums", render: (item) => (
            <span>{(item.quantidadeConsumida ?? 0).toFixed(2)}</span>
          ) },
          { key: "quantidadeDesperdicadoKg", header: "Desperdiçado (kg)", className: "font-mono tabular-nums", render: (item) => (
            <span>{(item.quantidadeDesperdicadoKg ?? 0).toFixed(2)}</span>
          ) },
          { key: "status", header: "Status", render: (item) => (
            <Badge variant="secondary">{item.status ?? "DISPONIVEL"}</Badge>
          ) },
          { key: "valorPorQuilograma", header: "R$/kg", className: "font-mono tabular-nums", render: (item) => (
            <span>{Number(item.valorPorQuilograma ?? 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
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
        <FormField label="Valor (R$/kg)" htmlFor="valorPorQuilograma" required>
          <Input
            id="valorPorQuilograma"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.valorPorQuilograma}
            onChange={(event) => setForm((current) => ({ ...current, valorPorQuilograma: event.target.value }))}
            placeholder="8.50"
          />
        </FormField>
        <FormField label="Quantidade Inicial (kg)" htmlFor="quantidadeInicialKg" required>
          <Input
            id="quantidadeInicialKg"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.quantidadeInicialKg}
            onChange={(event) => setForm((current) => ({ ...current, quantidadeInicialKg: event.target.value }))}
            placeholder="20"
          />
        </FormField>
        <FormField label="Quantidade Atual (kg)" htmlFor="quantidadeAtualKg" required>
          <Input
            id="quantidadeAtualKg"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.quantidadeAtualKg}
            onChange={(event) => setForm((current) => ({ ...current, quantidadeAtualKg: event.target.value }))}
            placeholder="20"
          />
        </FormField>
        <FormField label="Quantidade Desperdiçada (kg)" htmlFor="quantidadeDesperdicadoKg">
          <Input
            id="quantidadeDesperdicadoKg"
            type="number"
            min="0"
            step="0.01"
            value={form.quantidadeDesperdicadoKg}
            onChange={(event) => setForm((current) => ({ ...current, quantidadeDesperdicadoKg: event.target.value }))}
            placeholder="0"
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
