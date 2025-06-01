'use client';

import { useState, useEffect, useCallback } from 'react';
import { MateriaPrima } from '../app/admin/materiaPrima/constants';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export const useMateriasPrimas = () => {
  const [materiasPrimas, setMateriasPrimas] = useState<MateriaPrima[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMateriasPrimas = useCallback(async (incluirInativos = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await httpClient.get<MateriaPrima[]>(`/materiaPrima${incluirInativos ? '?incluirInativos=true' : ''}`);
      setMateriasPrimas(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar matérias-primas:", err);
      setError('Erro ao carregar matérias-primas');
      toast.error('Erro ao carregar matérias-primas');
      setMateriasPrimas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMateriaPrima = async (materialData: Partial<MateriaPrima>) => {
    try {
      await httpClient.post<MateriaPrima>("/materiaPrima", materialData);
      toast.success('Matéria-prima cadastrada com sucesso!');
      await fetchMateriasPrimas();
      return true;
    } catch (err: any) {
      console.error("Erro ao criar matéria-prima:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar matéria-prima. Tente novamente.');
      }
      return false;
    }
  };


  const updateMateriaPrima = async (materialData: Partial<MateriaPrima>) => {
    try {
      await httpClient.put<MateriaPrima>(`/materiaPrima`, materialData);
      toast.success('Matéria-prima atualizada com sucesso!');
      await fetchMateriasPrimas();
      return true;
    } catch (err: any) {
      console.error("Erro ao atualizar matéria-prima:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar matéria-prima. Tente novamente.');
      }
      return false;
    }
  };

  const deleteMateriaPrima = async (materialId: number) => {
    try {
      await httpClient.delete(`/materiaPrima/${materialId}`);
      toast.success('Matéria-prima excluída com sucesso!');
      await fetchMateriasPrimas();
      return true;
    } catch (err: any) {
      console.error("Erro ao excluir matéria-prima:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir matéria-prima. Tente novamente.');
      }
      return false;
    }
  };

  const restaurarMateriaPrima = async (materialId: number) => {
    try {
      await httpClient.put(`/materiaPrima/restaurar/${materialId}`, {});
      toast.success('Matéria-prima restaurada com sucesso!');
      await fetchMateriasPrimas(true);
      return true;
    } catch (err: any) {
      console.error("Erro ao restaurar matéria-prima:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao restaurar matéria-prima. Tente novamente.');
      }
      return false;
    }
  };

  useEffect(() => {
    fetchMateriasPrimas();
  }, []);

  return {
    materiasPrimas,
    isLoading,
    error,
    fetchMateriasPrimas,
    createMateriaPrima,
    updateMateriaPrima,
    deleteMateriaPrima,
    restaurarMateriaPrima,
  };
};
