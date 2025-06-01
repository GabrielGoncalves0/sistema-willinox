'use client';

import { useState, useEffect } from 'react';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';
import { CompraStatus } from '@/app/admin/compras/constants';

export interface ItemCompra {
  materiaPrimaId: number;
  quantidade: number;
  preco: number;
}

export interface Compra {
  id: number;
  data: string;
  status: CompraStatus;
  juridicaId: number;
  valorTotal: number;
}

export interface CompraDetalhada {
  compra: Compra;
  itens: ItemCompra[];
}

export interface CompraComItens {
  data: string;
  juridicaId: number;
  valorTotal: number;
  itens: ItemCompra[];
}

export interface CompraComItensUpdate extends CompraComItens {
  id: number;
  status?: CompraStatus;
}

export const useCompra = () => {
  const [compras, setCompras] = useState<CompraDetalhada[]>([]);
  const [compraAtual, setCompraAtual] = useState<CompraDetalhada | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompras = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await httpClient.get<CompraDetalhada[]>('/compra');
      setCompras(response.data);
    } catch (err) {
      console.error('Erro ao carregar compras:', err);
      setError('Erro ao carregar compras');
      toast.error('Erro ao carregar compras');
      setCompras([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompraById = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await httpClient.get<CompraDetalhada>(`/compra/${id}`);
      setCompraAtual(response.data);
      return response.data;
    } catch (err) {
      console.error(`Erro ao carregar compra ${id}:`, err);
      setError(`Erro ao carregar compra ${id}`);
      toast.error(`Erro ao carregar compra ${id}`);
      setCompraAtual(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createCompra = async (data: CompraComItens) => {
    try {
      setIsLoading(true);
      const response = await httpClient.post<{ msg: string; compraId: number }>('/compra', data);
      toast.success('Compra cadastrada com sucesso!');
      await fetchCompras();
      return response.data.compraId;
    } catch (err: any) {
      console.error('Erro ao criar compra:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar compra. Tente novamente.');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompra = async (data: CompraComItensUpdate) => {
    try {
      setIsLoading(true);
      await httpClient.put('/compra', data);
      toast.success('Compra atualizada com sucesso!');
      await fetchCompras();
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar compra:', err);

      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar compra. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompra = async (id: number) => {
    try {
      setIsLoading(true);
      await httpClient.delete(`/compra/${id}`);
      toast.success('Compra excluída com sucesso!');
      await fetchCompras();
      return true;
    } catch (err: any) {
      console.error('Erro ao excluir compra:', err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir compra. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calcularValorTotal = (itens: ItemCompra[]): number => {
    return itens.reduce((total, item) => {
      return total + (item.quantidade * item.preco);
    }, 0);
  };


  const finalizarCompra = async (_id: number, data: CompraComItensUpdate) => {
    try {
      setIsLoading(true);
      const compraFinalizada = {
        ...data,
        status: CompraStatus.CONCLUIDO
      };
      await httpClient.put('/compra', compraFinalizada);
      toast.success('Compra finalizada com sucesso!');
      await fetchCompras();
      return true;
    } catch (err: any) {
      console.error('Erro ao finalizar compra:', err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao finalizar compra. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarCompra = async (_id: number, data: CompraComItensUpdate) => {
    try {
      setIsLoading(true);
      const compraCancelada = {
        ...data,
        status: CompraStatus.CANCELADO
      };
      await httpClient.put('/compra', compraCancelada);
      toast.success('Compra cancelada com sucesso!');
      await fetchCompras();
      return true;
    } catch (err: any) {
      console.error('Erro ao cancelar compra:', err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao cancelar compra. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompras();
  }, []);

  return {
    compras,
    compraAtual,
    isLoading,
    error,
    fetchCompras,
    fetchCompraById,
    createCompra,
    updateCompra,
    deleteCompra,
    calcularValorTotal,
    finalizarCompra,
    cancelarCompra
  };
};
