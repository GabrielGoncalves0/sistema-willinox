'use client';

import { useState, useEffect } from 'react';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

import {
  PedidoStatus,
  PedidoDetalhado,
  PedidoComItens,
  PedidoComItensUpdate
} from '@/app/admin/pedidos/constants';

export const usePedido = () => {
  const [pedidos, setPedidos] = useState<PedidoDetalhado[]>([]);
  const [pedidoAtual, setPedidoAtual] = useState<PedidoDetalhado | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await httpClient.get<PedidoDetalhado[]>('/pedido');
      setPedidos(response.data);
    } catch (err) {
      setError('Erro ao carregar pedidos');
      toast.error('Erro ao carregar pedidos');
      setPedidos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPedidoById = async (id: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await httpClient.get<PedidoDetalhado>(`/pedido/detalhado/${id}`);
      setPedidoAtual(response.data);
      return response.data;
    } catch (err) {
      setError(`Erro ao carregar pedido ${id}`);
      toast.error(`Erro ao carregar pedido ${id}`);
      setPedidoAtual(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createPedido = async (data: PedidoComItens) => {
    try {
      setIsLoading(true);

      let endpoint = '/pedido';

      if (data.produtos && data.materiasPrimas) {
        endpoint = '/pedido/com-itens';
      } else if (data.produtos) {
        endpoint = '/pedido/produtos';
      } else if (data.materiasPrimas) {
        endpoint = '/pedido/materias-primas';
      }

      const response = await httpClient.post<{ msg: string; pedidoId: number }>(endpoint, data);
      toast.success('Pedido cadastrado com sucesso!');
      await fetchPedidos();
      return response.data.pedidoId;
    } catch (err: any) {
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar pedido. Tente novamente.');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePedido = async (data: PedidoComItensUpdate) => {
    try {
      setIsLoading(true);

      let endpoint = '/pedido';

      if (data.produtos && data.materiasPrimas) {
        endpoint = '/pedido/com-itens';
      } else if (data.produtos) {
        endpoint = '/pedido/produtos';
      } else if (data.materiasPrimas) {
        endpoint = '/pedido/materias-primas';
      }

      await httpClient.put(endpoint, data);
      toast.success('Pedido atualizado com sucesso!');
      await fetchPedidos();
      return true;
    } catch (err: any) {
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar pedido. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deletePedido = async (id: number) => {
    try {
      setIsLoading(true);
      await httpClient.delete(`/pedido/${id}`);
      toast.success('Pedido excluído com sucesso!');
      await fetchPedidos();
      return true;
    } catch (err: any) {
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir pedido. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const calcularValorTotal = (pedido: PedidoDetalhado): number => {
    const produtos = Array.isArray(pedido.produtos) ? pedido.produtos : [];
    const materiasPrimas = Array.isArray(pedido.materiasPrimas) ? pedido.materiasPrimas : [];

    let valorProdutos = 0;
    for (const item of produtos) {
      const quantidade = Number(item.quantidade) || 0;
      const preco = Number(item.preco) || 0;
      const subtotal = quantidade * preco;
      valorProdutos += subtotal;
    }

    let valorMateriasPrimas = 0;
    for (const item of materiasPrimas) {
      const quantidade = Number(item.quantidade) || 0;
      const preco = Number(item.preco) || 0;
      const subtotal = quantidade * preco;
      valorMateriasPrimas += subtotal;
    }

    const valorTotal = valorProdutos + valorMateriasPrimas;
    return valorTotal;
  };

  const finalizarPedido = async (_id: number, data: PedidoComItensUpdate) => {
    try {
      setIsLoading(true);
      const pedidoFinalizado = {
        ...data,
        status: PedidoStatus.CONCLUIDO
      };

      let endpoint = '/pedido';

      if (data.produtos && data.materiasPrimas) {
        endpoint = '/pedido/com-itens';
      } else if (data.produtos) {
        endpoint = '/pedido/produtos';
      } else if (data.materiasPrimas) {
        endpoint = '/pedido/materias-primas';
      }

      await httpClient.put(endpoint, pedidoFinalizado);
      toast.success('Pedido finalizado com sucesso!');
      await fetchPedidos();
      return true;
    } catch (err: any) {
      if (err.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao finalizar pedido. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelarPedido = async (_id: number, data: PedidoComItensUpdate) => {
    try {
      setIsLoading(true);
      const pedidoCancelado = {
        ...data,
        status: PedidoStatus.CANCELADO
      };

      let endpoint = '/pedido';

      if (data.produtos && data.materiasPrimas) {
        endpoint = '/pedido/com-itens';
      } else if (data.produtos) {
        endpoint = '/pedido/produtos';
      } else if (data.materiasPrimas) {
        endpoint = '/pedido/materias-primas';
      }

      await httpClient.put(endpoint, pedidoCancelado);
      toast.success('Pedido cancelado com sucesso!');
      await fetchPedidos();
      return true;
    } catch (err: any) {
      if (err.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao cancelar pedido. Tente novamente.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return {
    pedidos,
    pedidoAtual,
    isLoading,
    error,
    fetchPedidos,
    fetchPedidoById,
    createPedido,
    updatePedido,
    deletePedido,
    calcularValorTotal,
    finalizarPedido,
    cancelarPedido
  };
};
