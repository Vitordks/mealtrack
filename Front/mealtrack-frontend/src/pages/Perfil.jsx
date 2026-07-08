import { Info, Mail, ShieldCheck, User as UserIcon } from "lucide-react";

import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { nivelAcessoLabel } from "@/utils/enumLabels";

function getInitials(nome) {
  if (!nome) return "?";
  const parts = nome.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/**
 * Tela somente leitura. A API expõe GET /usuarios/{id} apenas com
 * { id, nome, email, nivelAcesso } — não retorna documento, tipoPessoa
 * nem restaurante. Como o PUT /usuarios/{id} sobrescreve esses três
 * campos com o que for enviado, permitir edição aqui sem esses dados
 * apagaria informação do cadastro. Edição de dados fica concentrada na
 * tela de Usuários (administrador), onde esse aviso também aparece.
 */
export default function Perfil() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Meu perfil" description="Informações da sua conta no MealTrack." />

      <Card className="max-w-xl">
        <CardContent className="flex items-center gap-4 p-6">
          <Avatar className="size-14">
            <AvatarFallback className="text-lg">{getInitials(user?.nome)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-foreground">{user?.nome}</p>
            <p className="text-sm text-muted-foreground">{nivelAcessoLabel(user?.nivelAcesso)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardContent className="divide-y divide-border p-0">
          <div className="flex items-center gap-3 px-6 py-4">
            <UserIcon className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Nome</p>
              <p className="text-sm font-medium text-foreground">{user?.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <Mail className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">E-mail</p>
              <p className="text-sm font-medium text-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-4">
            <ShieldCheck className="size-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Nível de acesso</p>
              <p className="text-sm font-medium text-foreground">
                {nivelAcessoLabel(user?.nivelAcesso)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex max-w-xl items-start gap-2 rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          A edição de dados cadastrais (nome, e-mail, senha, documento) é feita por um
          administrador na tela de <span className="font-medium text-foreground">Usuários</span>.
        </p>
      </div>
    </div>
  );
}
