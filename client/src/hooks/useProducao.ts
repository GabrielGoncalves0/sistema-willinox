'use client';

import { useState, useEffect } from 'react';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export interface Producao {
  id: number;
  fisicaId: number;
  produtoId: number;
  clienteNome: string;
  produtoNome: string;
}

export interface CreateProducao {
  id?: number;
  fisicaId: number;
  produtoId: number;
  status: string;
  dataInicio: string;
  dataFim?: string;
  quantidade?: number;
}

export enum ProducaoStatus {
  PENDENTE = "pendente",
  EM_ANDAMENTO = "em_andamento",
  CONCLUIDO = "concluido",
  CANCELADO = "cancelado"
}

export const useProducao = () => {
  const [producoes, setProducoes] = useState<Producao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducoes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await httpClient.get<Producao[]>('/producao');
      setProducoes(response.data);
    } catch (err) {
      console.error('Erro ao carregar produções:', err);
      setError('Erro ao carregar produções');
      toast.error('Erro ao carregar produções');
      setProducoes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createProducao = async (data: CreateProducao) => {
    try {
      await httpClient.post('/producao', data);
      toast.success('Produção cadastrada com sucesso!');
      await fetchProducoes();
      return true;
    } catch (err: any) {
      console.error('Erro ao criar produção:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar produção. Tente novamente.');
      }

      return false;
    }
  };

  const updateProducao = async (data: CreateProducao) => {
    try {
      await httpClient.put('/producao', data);
      toast.success('Produção atualizada com sucesso!');
      await fetchProducoes();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar produção:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar produção. Tente novamente.');
      }

      return false;
    }
  };

  const deleteProducao = async (id: number) => {
    try {
      await httpClient.delete(`/producao/${id}`);
      toast.success('Produção excluída com sucesso!');
      await fetchProducoes();
    } catch (err: any) {
      console.error('Erro ao excluir produção:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir produção. Tente novamente.');
      }

      return false;
    }
  };

  useEffect(() => {
    fetchProducoes();
  }, []);

  const finalizarProducao = async (producao: CreateProducao) => {
    try {
      setIsLoading(true);
      const producaoFinalizada = {
        ...producao,
        status: ProducaoStatus.CONCLUIDO,
        dataFim: producao.dataFim
          ? new Date(producao.dataFim).toISOString()
          : new Date().toISOString()
      };

      await httpClient.put('/producao', producaoFinalizada);
      toast.success('Produção finalizada com sucesso!');
      await fetchProducoes();
      return true;
    } catch (err: any) {
      console.error('Erro ao finalizar produção:', err);

      if (err.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao finalizar produção. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarProducao = async (producao: CreateProducao) => {
    try {
      setIsLoading(true);
      const producaoCancelada = {
        ...producao,
        status: ProducaoStatus.CANCELADO
      };

      await httpClient.put('/producao', producaoCancelada);
      toast.success('Produção cancelada com sucesso!');
      await fetchProducoes();
      return true;
    } catch (err: any) {
      console.error('Erro ao cancelar produção:', err);

      if (err.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao cancelar produção. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    producoes,
    isLoading,
    error,
    fetchProducoes,
    createProducao,
    updateProducao,
    deleteProducao,
    finalizarProducao,
    cancelarProducao
  };
};
