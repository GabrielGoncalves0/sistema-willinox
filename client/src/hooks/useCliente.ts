'use client';

import { useState, useEffect } from 'react';
import { listarCliente, CreateCliente } from '../app/admin/clientes/constants';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export const useCliente = () => {
  const [clientes, setClientes] = useState<listarCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientes = async (incluirInativos = false) => {
    try {
      setIsLoading(true);
      setError(null);

      const [fisicaResponse, juridicaResponse] = await Promise.all([
        httpClient.get<listarCliente[]>(`/pessoa-fisica/clientes${incluirInativos ? '?incluirInativos=true' : ''}`),
        httpClient.get<listarCliente[]>(`/pessoa-juridica/clientes${incluirInativos ? '?incluirInativos=true' : ''}`),
      ]);

      const combinedClientes: listarCliente[] = [
        ...fisicaResponse.data.map((cliente) => ({ ...cliente, tipo: 'fisica' as const })),
        ...juridicaResponse.data.map((cliente) => ({ ...cliente, tipo: 'juridica' as const })),
      ];

      setClientes(combinedClientes);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes');
      toast.error('Erro ao carregar clientes');
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createCliente = async (data: CreateCliente) => {
    try {
      const endpoint = data.tipo === 'fisica' ? '/pessoa-fisica' : '/pessoa-juridica';
      await httpClient.post(endpoint, data);
      toast.success('Cliente cadastrado com sucesso!');
      await fetchClientes();
      return true;
    } catch (err: any) {
      console.error('Erro ao criar cliente:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar cliente. Tente novamente.');
      }

      return false;
    }
  };

  const updateCliente = async (data: CreateCliente) => {
    try {
      const endpoint = data.tipo === 'fisica' ? '/pessoa-fisica' : '/pessoa-juridica';
      await httpClient.put(endpoint, {});
      toast.success('Cliente atualizado com sucesso!');
      await fetchClientes();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar cliente:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar cliente. Tente novamente.');
      }
      return false;
    }
  };

  const deleteCliente = async (id: number, tipo: 'fisica' | 'juridica') => {
    try {
      const endpoint = tipo === 'fisica' ? `/pessoa-fisica/${id}` : `/pessoa-juridica/${id}`;
      await httpClient.delete(endpoint);
      toast.success('Cliente excluído com sucesso!');
      await fetchClientes();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir cliente:', err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir cliente. Tente novamente.');
      }
      return false;
    }
  };

  const restaurarCliente = async (id: number, tipo: 'fisica' | 'juridica') => {
    try {
      const endpoint = tipo === 'fisica' ? `/pessoa-fisica/restaurar/${id}` : `/pessoa-juridica/restaurar/${id}`;
      await httpClient.put(endpoint, {});
      toast.success('Cliente restaurado com sucesso!');

      await fetchClientes(true);

      return true;
    } catch (err: any) {
      console.error('Erro ao restaurar cliente:', err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao restaurar cliente. Tente novamente.');
      }
      return false;
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  return {
    clientes,
    isLoading,
    error,
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    restaurarCliente,
  };
};