'use client';

import { useState, useEffect } from 'react';
import { listarFornecedor, CreateFornecedor } from '../app/admin/fornecedores/constants';
import httpClient from '@/utils/httpClient';
import { toast } from 'sonner';

export const useFornecedor = () => {
    const [fornecedores, setFornecedores] = useState<listarFornecedor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFornecedores = async (incluirInativos = false) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await httpClient.get<listarFornecedor[]>(`/pessoa-juridica${incluirInativos ? '?incluirInativos=true' : ''}`);

            const fornecedoresProcessados = response.data.map(fornecedor => {
                const ativoBoolean = fornecedor.ativo === true || String(fornecedor.ativo) === '1';

                return {
                    ...fornecedor,
                    ativo: ativoBoolean
                };
            });


            setFornecedores(fornecedoresProcessados);
        } catch (err) {
            console.error('Erro ao carregar fornecedores:', err);
            setError('Erro ao carregar fornecedores');
            toast.error('Erro ao carregar fornecedores');
            setFornecedores([]);
        } finally {
            setIsLoading(false);
        }
    };

    const createFornecedor = async (data: CreateFornecedor) => {
        try {
            await httpClient.post('/pessoa-juridica', data);
            toast.success('Fornecedor cadastrado com sucesso!');
            await fetchFornecedores();
            return true;
        } catch (err: any) {
            console.error('Erro ao criar fornecedor:', err);
            if (err.data?.msg) {
                toast.error(err.data.msg);
            } else {
                toast.error('Erro ao criar fornecedor. Tente novamente.');
            }
            return false;
        }
    };

    const updateFornecedor = async (data: CreateFornecedor) => {
        try {
            await httpClient.put('/pessoa-juridica', data);
            toast.success('Fornecedor atualizado com sucesso!');
            await fetchFornecedores();
            return true;
        } catch (err: any) {
            console.error('Erro ao atualizar fornecedor:', err);
            if (err.data?.msg) {
                toast.error(err.data.msg);
            } else {
                toast.error('Erro ao atualizar fornecedor. Tente novamente.');
            }
            return false;
        }
    };

    const deleteFornecedor = async (id: number, incluirInativos = false) => {
        try {
            await httpClient.delete(`/pessoa-juridica/${id}`);
            toast.success('Fornecedor excluído com sucesso!');

            await fetchFornecedores(incluirInativos);

            return true;
        } catch (err: any) {
            console.error('Erro ao excluir fornecedor:', err);
            if (err.data?.msg) {
                toast.error(err.data.msg);
            } else {
                toast.error('Erro ao excluir fornecedor. Tente novamente.');
            }
            return false;
        }
    };

    const restaurarFornecedor = async (id: number, incluirInativos = true) => {
        try {
            await httpClient.put(`/pessoa-juridica/restaurar/${id}`, {});
            toast.success('Fornecedor restaurado com sucesso!');


            await fetchFornecedores(incluirInativos);

            return true;
        } catch (err: any) {
            console.error('Erro ao restaurar fornecedor:', err);

            if (err.data?.msg) {
                toast.error(err.data.msg);
            } else {
                toast.error('Erro ao restaurar fornecedor. Tente novamente.');
            }
            return false;
        }
    };

    useEffect(() => {
        fetchFornecedores();
    }, []);

    return {
        fornecedores,
        isLoading,
        error,
        fetchFornecedores,
        createFornecedor,
        updateFornecedor,
        deleteFornecedor,
        restaurarFornecedor,
    };
};
