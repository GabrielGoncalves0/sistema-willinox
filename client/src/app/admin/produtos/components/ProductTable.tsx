'use client';

import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Typography,
    Box,
} from '@mui/material';
import { Edit, Delete, Restore } from '@mui/icons-material';
import { Product } from '../constants';
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';


interface ProductTableProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    onRestore?: (product: Product) => void;
    isLoading: boolean;
    searchTerm: string;
    showInativos?: boolean;
}

export const ProductTable = ({
    products,
    onEdit,
    onDelete,
    onRestore,
    isLoading,
    searchTerm,
    showInativos = false,
}: ProductTableProps) => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    const isProdutoAtivo = (product: any): boolean => {

        return product.ativo === true || product.ativo === 1 || product.ativo === '1';
    };

    const formatPrice = (price?: number) => {
        const numericPrice = Number(price) || 0;
        return `R$${numericPrice.toFixed(2)}`;
    };


    const statusFilteredProducts = Array.isArray(products)
        ? showInativos
            ? products.filter(product => !isProdutoAtivo(product))
            : products.filter(product => isProdutoAtivo(product))
        : [];


    const filteredProducts = statusFilteredProducts.filter((product) =>
        Object.values(product).some((value) =>
            value !== null &&
            value !== undefined &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );


    const paginatedProducts = filteredProducts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );


    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return <Typography>Carregando produtos...</Typography>;
    }

    return (
        <Box>
            <TableContainer component={Paper} sx={{ borderRadius: '8px 8px 0 0' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Código</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>Descrição</TableCell>
                        <TableCell>Preço</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell>Modelo</TableCell>
                        <TableCell align="center">Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedProducts.length > 0 ? (
                        paginatedProducts.map((product) => (
                            <TableRow
                                key={product.id}
                                sx={!isProdutoAtivo(product) ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
                            >
                                <TableCell>{product.codigo}</TableCell>
                                <TableCell>
                                    {product.nome}
                                    {!isProdutoAtivo(product) && (
                                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                                            (Inativo)
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>{product.descricao}</TableCell>
                                <TableCell>{formatPrice(product.preco)}</TableCell>
                                <TableCell>{product.qtdEstoque}</TableCell>
                                <TableCell>{product.modelo.nome}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                        <IconButton
                                            color="primary"
                                            onClick={() => onEdit(product)}
                                        >
                                            <Edit />
                                        </IconButton>
                                        {isProdutoAtivo(product) ? (
                                            <IconButton
                                                color="error"
                                                onClick={() => onDelete(product)}
                                            >
                                                <Delete />
                                            </IconButton>
                                        ) : (
                                            <IconButton
                                                color="success"
                                                onClick={() => onRestore && onRestore(product)}
                                                disabled={!onRestore}
                                            >
                                                <Restore />
                                            </IconButton>
                                        )}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                Nenhum produto encontrado
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <TablePagination
            count={filteredProducts.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </Box>
    );
};