import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/shared/DataTable";
import { FormDrawer } from "@/components/shared/FormDrawer";
import { FormField } from "@/components/shared/FormField";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { RowActions } from "@/components/shared/RowActions";
import { RoleBadge } from "@/components/shared/RoleBadge";
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
import * as usuarioService from "@/services/usuarioService";
import * as restauranteService from "@/services/restauranteService";
import { NIVEL_ACESSO_OPTIONS, TIPO_PESSOA_OPTIONS } from "@/utils/enumLabels";

const EMPTY_FORM = {
  nome: "",
  email: "",
  senha: "",
  documento: "",
  tipoPessoa: "",
  nivelAcesso: "",
  restauranteId: "",
};

const service = {
  list: usuarioService.listarUsuarios,
  create: usuarioService.criarUsuario,
  update: usuarioService.atualizarUsuario,
  remove: usuarioService.excluirUsuario,
};

export default function UsuariosPage() {
  const { items, isLoading, error, isSubmitting, refetch, create, update, remove } = useCrud(
    service,
    { resourceLabel: "Usuário" },
  );

  const [restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    restauranteService.listarRestaurantes().then(setRestaurantes).catch(() => setRestaurantes([]));
  }, []);

  const [drawer, setDrawer] = useState({ open: false, editing: null });
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function openCreate() {
    setForm(EMPTY_FORM);
    setDrawer({ open: true, editing: null });
  }

  function openEdit(usuario) {
    // GET /usuarios só retorna { id, nome, email, nivelAcesso } — documento,
    // tipoPessoa e restaurante não vêm nessa resposta e o PUT do backend
    // sempre sobrescreve esses 3 campos com o que for enviado. Por isso
    // eles precisam ser preenchidos novamente aqui (ver aviso no formulário).
    setForm({
      ...EMPTY_FORM,
      nome: usuario.nome ?? "",
      email: usuario.email ?? "",
      nivelAcesso: usuario.nivelAcesso ?? "",
    });
    setDrawer({ open: true, editing: usuario });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (drawer.editing) {
      const payload = {
        nome: form.nome,
        email: form.email,
        senha: form.senha || null,
        documento: form.documento,
        tipoPessoa: form.tipoPessoa,
        nivelAcesso: form.nivelAcesso,
        restaurante: { id: Number(form.restauranteId) },
      };
      const ok = await update(drawer.editing.id, payload);
      if (ok) setDrawer({ open: false, editing: null });
      return;
    }

    const payload = {
      nome: form.nome,
      email: form.email,
      senha: form.senha,
      documento: form.documento,
      tipoPessoa: form.tipoPessoa,
      nivelAcesso: form.nivelAcesso,
      restaurante: { id: Number(form.restauranteId) },
    };
    const ok = await create(payload);
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
        title="Usuários"
        description="Funcionários e gestores com acesso ao sistema."
        actions={
          <Button onClick={openCreate}>
            <Plus />
            Novo usuário
          </Button>
        }
      />

      <DataTable
        data={items}
        isLoading={isLoading}
        error={error}
        onRetry={refetch}
        getRowId={(item) => item.id}
        searchPlaceholder="Buscar por nome ou e-mail..."
        searchFn={(item, query) =>
          item.nome?.toLowerCase().includes(query) || item.email?.toLowerCase().includes(query)
        }
        emptyTitle="Nenhum usuário cadastrado"
        emptyDescription="Cadastre o primeiro usuário do restaurante."
        columns={[
          {
            key: "nome",
            header: "Nome",
            render: (item) => <span className="font-medium text-foreground">{item.nome}</span>,
          },
          { key: "email", header: "E-mail", render: (item) => item.email },
          {
            key: "nivelAcesso",
            header: "Nível de acesso",
            render: (item) => <RoleBadge nivelAcesso={item.nivelAcesso} />,
          },
        ]}
        renderActions={(item) => (
          <RowActions onEdit={() => openEdit(item)} onDelete={() => setDeleteTarget(item)} />
        )}
      />

      <FormDrawer
        open={drawer.open}
        onOpenChange={(open) => setDrawer((current) => ({ ...current, open }))}
        title={drawer.editing ? "Editar usuário" : "Novo usuário"}
        description="Dados de acesso e vínculo com o restaurante."
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {drawer.editing ? (
          <p className="rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
            A API não retorna documento, tipo de pessoa e restaurante ao listar usuários — preencha
            esses campos novamente para não perdê-los na atualização.
          </p>
        ) : null}

        <FormField label="Nome" htmlFor="nome" required>
          <Input
            id="nome"
            required
            value={form.nome}
            onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))}
            placeholder="Maria Silva"
          />
        </FormField>

        <FormField label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="maria@restaurante.com"
          />
        </FormField>

        <FormField
          label={drawer.editing ? "Nova senha" : "Senha"}
          htmlFor="senha"
          required={!drawer.editing}
        >
          <Input
            id="senha"
            type="password"
            required={!drawer.editing}
            value={form.senha}
            onChange={(event) => setForm((current) => ({ ...current, senha: event.target.value }))}
            placeholder={drawer.editing ? "Deixe em branco para manter a atual" : "••••••••"}
          />
        </FormField>

        <FormField label="Documento (CPF/CNPJ)" htmlFor="documento" required>
          <Input
            id="documento"
            required
            value={form.documento}
            onChange={(event) =>
              setForm((current) => ({ ...current, documento: event.target.value }))
            }
            placeholder="000.000.000-00"
          />
        </FormField>

        <FormField label="Tipo de pessoa" htmlFor="tipoPessoa" required>
          <Select
            required
            value={form.tipoPessoa}
            onValueChange={(value) => setForm((current) => ({ ...current, tipoPessoa: value }))}
          >
            <SelectTrigger id="tipoPessoa">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {TIPO_PESSOA_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Nível de acesso" htmlFor="nivelAcesso" required>
          <Select
            required
            value={form.nivelAcesso}
            onValueChange={(value) => setForm((current) => ({ ...current, nivelAcesso: value }))}
          >
            <SelectTrigger id="nivelAcesso">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {NIVEL_ACESSO_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Restaurante" htmlFor="restauranteId" required>
          <Select
            required
            value={form.restauranteId ? String(form.restauranteId) : ""}
            onValueChange={(value) => setForm((current) => ({ ...current, restauranteId: value }))}
          >
            <SelectTrigger id="restauranteId">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {restaurantes.map((restaurante) => (
                <SelectItem key={restaurante.id} value={String(restaurante.id)}>
                  {restaurante.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </FormDrawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Excluir usuário"
        description={`Tem certeza que deseja excluir "${deleteTarget?.nome}"? Esta ação não pode ser desfeita.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
