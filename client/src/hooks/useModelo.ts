'use client';

import { useState, useEffect, useCallback } from 'react';
import { Modelo } from '../app/admin/produtos/constants';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export const useModelos = () => {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchModelos = useCallback(async (incluirInativos = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await httpClient.get<Modelo[]>(`/modelo${incluirInativos ? '?incluirInativos=true' : ''}`);
      setModelos(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar modelos:", err);
      setError('Erro ao carregar modelos');
      toast.error('Erro ao carregar modelos');
      setModelos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createModelo = async (modeloData: Omit<Modelo, 'id'>) => {
    try {
      await httpClient.post<Modelo>("/modelo", modeloData);
      toast.success('Modelo cadastrado com sucesso!');
      await fetchModelos();
      return true;
    } catch (err: any) {
      console.error("Erro ao criar modelo:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar modelo. Tente novamente.');
      }
      return false;
    }
  };

  const updateModelo = async (modeloData: Modelo) => {
    try {
      await httpClient.put<Modelo>(`/modelo`, modeloData);
      toast.success('Modelo atualizado com sucesso!');
      await fetchModelos();
      return true;
    } catch (err: any) {
      console.error("Erro ao atualizar modelo:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar modelo. Tente novamente.');
      }
      return false;
    }
  };

  const deleteModelo = async (modeloId: number) => {
    try {
      await httpClient.delete(`/modelo/${modeloId}`);
      toast.success('Modelo excluído com sucesso!');
      await fetchModelos();
      return true;
    } catch (err: any) {
      console.error("Erro ao excluir modelo:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir modelo. Tente novamente.');
      }
      return false;
    }
  };

  const restaurarModelo = async (modeloId: number, incluirInativos = false) => {
    try {
      await httpClient.put(`/modelo/restaurar/${modeloId}`, {});
      toast.success('Modelo restaurado com sucesso!');
      await fetchModelos(incluirInativos);
      return true;
    } catch (err: any) {
      console.error("Erro ao restaurar modelo:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao restaurar modelo. Tente novamente.');
      }
      return false;
    }
  };

  useEffect(() => {
    fetchModelos();
  }, []);

  return {
    modelos,
    isLoading,
    error,
    fetchModelos,
    createModelo,
    updateModelo,
    deleteModelo,
    restaurarModelo,
  };
};
