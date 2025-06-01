'use client';

import { useState, useEffect } from 'react';
import { listarFuncionario, CreateFuncionario } from '../app/admin/funcionarios/constants';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export const useFuncionario = () => {
  const [funcionarios, setFuncionarios] = useState<listarFuncionario[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFuncionarios = async (incluirInativos = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await httpClient.get<listarFuncionario[]>(`/pessoa-fisica/funcionarios${incluirInativos ? '?incluirInativos=true' : ''}`);
      setFuncionarios(response.data);
    } catch (err) {
      console.error('Erro ao carregar funcionários:', err);
      setError('Erro ao carregar funcionários');
      toast.error('Erro ao carregar funcionários');
      setFuncionarios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createFuncionario = async (data: CreateFuncionario) => {
    try {
      await httpClient.post('/pessoa-fisica', data);
      toast.success('Funcionário cadastrado com sucesso!');
      await fetchFuncionarios();
      return true;
    } catch (err: any) {
      console.error('Erro ao criar funcionário:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar funcionário. Tente novamente.');
      }

      return false;
    }
  };

  const updateFuncionario = async (data: CreateFuncionario) => {
    try {
      await httpClient.put('/pessoa-fisica', data);
      toast.success('Funcionário atualizado com sucesso!');
      await fetchFuncionarios();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar funcionário:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar funcionário. Tente novamente.');
      }

      return false;
    }
  };

  const deleteFuncionario = async (id: number) => {
    try {
      await httpClient.delete(`/pessoa-fisica/${id}`);
      toast.success('Funcionário excluído com sucesso!');
      await fetchFuncionarios();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir funcionário:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir funcionário. Tente novamente.');
      }

      return false;
    }
  };

  const restaurarFuncionario = async (id: number) => {
    try {
      await httpClient.put(`/pessoa-fisica/restaurar/${id}`, {});
      toast.success('Funcionário restaurado com sucesso!');


      await fetchFuncionarios(true);

      return true;
    } catch (err: any) {
      console.error('Erro ao restaurar funcionário:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao restaurar funcionário. Tente novamente.');
      }

      return false;
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  return {
    funcionarios,
    isLoading,
    error,
    fetchFuncionarios,
    createFuncionario,
    updateFuncionario,
    deleteFuncionario,
    restaurarFuncionario,
  };
};
