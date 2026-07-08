import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormDrawer } from "@/components/shared/FormDrawer";
import { FormField } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { RowActions } from "@/components/shared/RowActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCrud } from "@/hooks/useCrud";
import { useAuth } from "@/hooks/useAuth";
import * as producaoService from "@/services/producaoService";
import * as alimentoService from "@/services/alimentoService";
import * as usuarioService from "@/services/usuarioService";
import { formatDateTime, formatKg, toDatetimeLocalInput, toIsoDateTime } from "@/utils/formatters";

const EMPTY_FORM = { alimentoId: "", usuarioId: "", quantidadeProduzida: "", dataRegistro: "" };

const service = {
  list: producaoService.listarProducoes,
  create: producaoService.criarProducao,
  update: producaoService.atualizarProducao,
  remove: producaoService.excluirProducao,
};

function nowAsDatetimeLocal() {
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function ProducaoPage() {
  const { user } = useAuth();
  const { items, isLoading, error, isSubmitting, refetch, create, update, remove } = useCrud(
    service,
    { resourceLabel: "Registro de produção" },
  );

  const [alimentos, setAlimentos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    alimentoService.listarAlimentos().then(setAlimentos).catch(() => setAlimentos([]));
    usuarioService
      .listarUsuarios()
      .then(setUsuarios)
      .catch(() => setUsuarios(user ? [user] : []));
  }, [user]);

  const [drawer, setDrawer] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setForm({
      ...EMPTY_FORM,
      usuarioId: user?.id ? String(user.id) : "",
      dataRegistro: nowAsDatetimeLocal(),
    });
    setDrawer({ open: true, editing: null });
  }

  function openEdit(registro) {
    setForm({
      alimentoId: registro.alimento?.id ? String(registro.alimento.id) : "",
      usuarioId: registro.usuario?.id ? String(registro.usuario.id) : "",
      quantidadeProduzida: String(registro.quantidadeProduzida ?? ""),
      dataRegistro: toDatetimeLocalInput(registro.dataRegistro),
    });
    setDrawer({ open: true, editing: registro });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      alimento: { id: Number(form.alimentoId) },
      usuario: { id: Number(form.usuarioId) },
      quantidadeProduzida: Number(form.quantidadeProduzida),
      dataRegistro: toIsoDateTime(form.dataRegistro),
    };
    const ok = drawer.editing
      ? await update(drawer.editing.id, payload)
      : await create(payload);
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
        title="Produção"
        description="Registro de quantidade produzida por alimento, antes de cada serviço."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Novo registro
          </Button>
        }
      />

      <DataTable
        data={items}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        getRowId={(item) => item.id}
        searchPlaceholder="Buscar por alimento ou responsável..."
        searchFn={(item, query) =>
          item.alimento?.nome?.toLowerCase().includes(query) ||
          item.usuario?.nome?.toLowerCase().includes(query)
        }
        emptyTitle="Nenhum registro de produção"
        emptyDescription="Registre a quantidade produzida antes de iniciar o serviço."
        columns={[
          {
            key: "alimento",
            header: "Alimento",
            render: (item) => (
              <span className="font-medium text-foreground">{item.alimento?.nome ?? "—"}</span>
            ),
          },
          {
            key: "quantidadeProduzida",
            header: "Quantidade",
            className: "font-mono tabular-nums",
            render: (item) => formatKg(item.quantidadeProduzida),
          },
          {
            key: "usuario",
            header: "Responsável",
            render: (item) => item.usuario?.nome ?? "—",
          },
          {
            key: "dataRegistro",
            header: "Registrado em",
            className: "font-mono tabular-nums",
            render: (item) => formatDateTime(item.dataRegistro),
          },
        ]}
        renderActions={(item) => (
          <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
        )}
      />

      <FormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((current) => ({ ...current, open }))}
        title={drawer.editing ? "Editar registro" : "Novo registro de produção"}
        description="Alimento, quantidade produzida e responsável pelo registro."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        <FormField label="Alimento" htmlFor="alimentoId" required>
          <Select
            required
            value={form.alimentoId}
            onValueChange={(value) => setForm((current) => ({ ...current, alimentoId: value }))}
          >
            <SelectTrigger id="alimentoId">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {alimentos.map((alimento) => (
                <SelectItem key={alimento.id} value={String(alimento.id)}>
                  {alimento.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Quantidade produzida (kg)" htmlFor="quantidadeProduzida" required>
          <Input
            id="quantidadeProduzida"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.quantidadeProduzida}
            onChange={(event) =>
              setForm((current) => ({ ...current, quantidadeProduzida: event.target.value }))
            }
            placeholder="12.5"
          />
        </FormField>

        <FormField label="Responsável" htmlFor="usuarioId" required>
          <Select
            required
            value={form.usuarioId}
            onValueChange={(value) => setForm((current) => ({ ...current, usuarioId: value }))}
          >
            <SelectTrigger id="usuarioId">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {usuarios.map((usuario) => (
                <SelectItem key={usuario.id} value={String(usuario.id)}>
                  {usuario.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Data e hora do registro" htmlFor="dataRegistro" required>
          <Input
            id="dataRegistro"
            type="datetime-local"
            required
            value={form.dataRegistro}
            onChange={(event) =>
              setForm((current) => ({ ...current, dataRegistro: event.target.value }))
            }
          />
        </FormField>
      </FormDrawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir registro de produção"
        description="Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita."
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
