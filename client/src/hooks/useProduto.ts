'use client';

import { useState, useEffect } from 'react';
import { Product } from '../app/admin/produtos/constants';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async (incluirInativos = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await httpClient.get<Product[]>(`/produtos${incluirInativos ? '?incluirInativos=true' : ''}`);
      setProducts(response.data);
    } catch (err: any) {
      console.error("Erro ao carregar produtos:", err);
      setError('Erro ao carregar produtos');
      toast.error('Erro ao carregar produtos');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    try {
      await httpClient.post<Product>("/produtos", productData);
      toast.success('Produto cadastrado com sucesso!');
      await fetchProducts();
      return true;
    } catch (err: any) {
      console.error("Erro ao criar produto:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao criar produto. Tente novamente.');
      }
      return false;
    }
  };

  const updateProduct = async (productData: Partial<Product>) => {
    try {
      await httpClient.put<Product>(`/produtos`, productData);
      toast.success('Produto atualizado com sucesso!');
      await fetchProducts();
      return true;
    } catch (err: any) {
      console.error("Erro ao atualizar produto:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao atualizar produto. Tente novamente.');
      }
      return false;
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      await httpClient.delete(`/produtos/${productId}`);
      toast.success('Produto excluído com sucesso!');
      await fetchProducts();
      return true;
    } catch (err: any) {
      console.error("Erro ao excluir produto:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao excluir produto. Tente novamente.');
      }
      return false;
    }
  };

  const restaurarProduct = async (productId: number) => {
    try {
      await httpClient.put(`/produtos/restaurar/${productId}`, {});
      toast.success('Produto restaurado com sucesso!');
      await fetchProducts(true);
      return true;
    } catch (err: any) {
      console.error("Erro ao restaurar produto:", err);
      if (err.data?.msg) {
        toast.error(err.data.msg);
      } else {
        toast.error('Erro ao restaurar produto. Tente novamente.');
      }
      return false;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    isLoading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    restaurarProduct,
  };
};
