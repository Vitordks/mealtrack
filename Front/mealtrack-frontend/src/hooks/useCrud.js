import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

/**
 * Encapsula o ciclo listar/criar/atualizar/excluir comum a Usuários,
 * Restaurantes, Alimentos, Refeições e Produção — cada página só passa
 * as funções do seu service e ganha loading, erro e feedback (toast)
 * de graça, sem repetir o mesmo bloco try/catch em cada tela.
 *
 * @template T
 * @param {{
 *   list: () => Promise<T[]>,
 *   create: (payload: unknown) => Promise<T>,
 *   update: (id: number | string, payload: unknown) => Promise<T>,
 *   remove: (id: number | string) => Promise<void>,
 * }} service
 * @param {{ resourceLabel?: string }} [options]
 */
export function useCrud(service, { resourceLabel = "Registro" } = {}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.list();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = useCallback(
    async (payload) => {
      setIsSubmitting(true);
      try {
        await service.create(payload);
        toast.success(`${resourceLabel} criado com sucesso.`);
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err.message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [service, resourceLabel, fetchAll],
  );

  const update = useCallback(
    async (id, payload) => {
      setIsSubmitting(true);
      try {
        await service.update(id, payload);
        toast.success(`${resourceLabel} atualizado com sucesso.`);
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err.message);
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [service, resourceLabel, fetchAll],
  );

  const remove = useCallback(
    async (id) => {
      try {
        await service.remove(id);
        toast.success(`${resourceLabel} excluído com sucesso.`);
        await fetchAll();
        return true;
      } catch (err) {
        toast.error(err.message);
        return false;
      }
    },
    [service, resourceLabel, fetchAll],
  );

  return { items, isLoading, error, isSubmitting, refetch: fetchAll, create, update, remove };
}
