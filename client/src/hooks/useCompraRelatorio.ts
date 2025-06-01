'use client';

import { useState, useEffect } from 'react';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export interface CompraRelatorio {
  id: number;
  codigo: string;
  data: string;
  status: string;
  valorTotal: number;
  fornecedor: {
    id: number;
    nome: string;
  } | null;
  itens: {
    id: number;
    quantidade: number;
    preco: number;
    valorTotal: number;
    materiaPrima: {
      id: number;
      nome: string;
      codigo: string;
    } | null;
  }[];
}

export const useCompraRelatorio = () => {
  const [compras, setCompras] = useState<CompraRelatorio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComprasRelatorio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await httpClient.get<CompraRelatorio[]>('/compra/relatorio');
      setCompras(response.data);
    } catch (err) {
      console.error('Erro ao carregar compras para relatório:', err);
      setError('Erro ao carregar compras para relatório');
      toast.error('Erro ao carregar compras para relatório');
      setCompras([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComprasRelatorio();
  }, []);

  return {
    compras,
    isLoading,
    error,
    fetchComprasRelatorio
  };
};
