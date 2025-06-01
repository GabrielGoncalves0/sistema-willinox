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
import { MateriaPrima } from '../constants';
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';


interface MateriaPrimaTableProps {
  materials: MateriaPrima[];
  onEdit: (material: MateriaPrima) => void;
  onDelete: (material: MateriaPrima) => void;
  onRestore?: (material: MateriaPrima) => void;
  isLoading: boolean;
  searchTerm: string;
  showInativos?: boolean;
}

export const MateriaPrimaTable = ({
  materials,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
  searchTerm,
  showInativos = false,
}: MateriaPrimaTableProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const formatPrice = (price?: number) => {
    const numericPrice = Number(price) || 0;
    return `R$${numericPrice.toFixed(2)}`;
  };

  const statusFilteredMaterials = Array.isArray(materials)
    ? showInativos
      ? materials.filter(material => !material.ativo)
      : materials.filter(material => material.ativo)
    : [];

  const filteredMaterials = statusFilteredMaterials.filter((material) =>
    Object.values(material).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedMaterials = filteredMaterials.slice(
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
    return <Typography>Carregando matérias-primas...</Typography>;
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
            <TableCell align="left">Quantidade</TableCell>
            <TableCell>Unidade</TableCell>
            <TableCell align="left">Preço</TableCell>
            <TableCell align="center">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedMaterials.length > 0 ? (
            paginatedMaterials.map((material) => (
              <TableRow
                key={material.id}
                sx={!material.ativo ? { backgroundColor: 'rgba(0, 0, 0, 0.04)' } : {}}
              >
                <TableCell>{material.codigo}</TableCell>
                <TableCell>
                  {material.nome}
                  {!material.ativo && (
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1, fontStyle: 'italic' }}>
                      (Inativo)
                    </Typography>
                  )}
                </TableCell>
                <TableCell>{material.descricao}</TableCell>
                <TableCell align="left">{material.qtdEstoque}</TableCell>
                <TableCell>{material.unidadeMedida}</TableCell>
                <TableCell align="left">{formatPrice(material.preco)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      color="primary"
                      onClick={() => onEdit(material)}
                    >
                      <Edit />
                    </IconButton>
                    {material.ativo ? (
                      <IconButton
                        color="error"
                        onClick={() => onDelete(material)}
                      >
                        <Delete />
                      </IconButton>
                    ) : (
                      <IconButton
                        color="success"
                        onClick={() => onRestore && onRestore(material)}
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
                Nenhuma matéria-prima encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
    <TablePagination
      count={filteredMaterials.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
  );
};