'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { CompraComItens, CompraComItensUpdate, CompraDetalhada, ItemCompra } from '../../../../hooks/useCompra';
import { CompraStatus, getStatusText } from '../constants';
import { useFornecedor } from '../../../../hooks/useFornecedor';
import { useMateriasPrimas } from '../../../../hooks/useMateriaPrima';
import { FormatNumber } from '../../../../utils/formatNumber';
import { ptBR } from 'date-fns/locale';
import { CompraModalHelp } from '@/components/help';

interface CompraFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CompraComItens | CompraComItensUpdate) => Promise<void>;
  initialData?: CompraDetalhada;
}

export default function CompraForm({ open, onClose, onSubmit, initialData }: CompraFormProps) {
  const { fornecedores, fetchFornecedores } = useFornecedor();
  const { materiasPrimas, fetchMateriasPrimas } = useMateriasPrimas();

  const [data, setData] = useState<Date | null>(new Date());
  const [fornecedorId, setFornecedorId] = useState<number>(0);
  const [status, setStatus] = useState<CompraStatus>(CompraStatus.PENDENTE);
  const [itens, setItens] = useState<ItemCompra[]>([]);
  const [valorTotal, setValorTotal] = useState<number>(0);

  const [novoItem, setNovoItem] = useState<ItemCompra>({
    materiaPrimaId: 0,
    quantidade: 0,
    preco: 0
  });

  useEffect(() => {
    fetchFornecedores();
    fetchMateriasPrimas();

    if (initialData) {
      setData(new Date(initialData.compra.data));
      setFornecedorId(initialData.compra.juridicaId);
      setStatus(initialData.compra.status as CompraStatus);
      setItens(initialData.itens);
      setValorTotal(initialData.compra.valorTotal);
    } else {
      resetForm();
    }
  }, [initialData, open]);

  useEffect(() => {
    const total = itens.reduce((sum, item) => sum + (item.quantidade * item.preco), 0);
    setValorTotal(total);
  }, [itens]);

  const resetForm = () => {
    setData(new Date());
    setFornecedorId(0);
    setStatus(CompraStatus.PENDENTE);
    setItens([]);
    setValorTotal(0);
    setNovoItem({
      materiaPrimaId: 0,
      quantidade: 0,
      preco: 0
    });
  };

  const handleAddItem = () => {
    if (novoItem.materiaPrimaId && novoItem.quantidade > 0 && novoItem.preco > 0) {
      const itemExistente = itens.findIndex(item => item.materiaPrimaId === novoItem.materiaPrimaId);

      if (itemExistente >= 0) {
        const novosItens = [...itens];
        novosItens[itemExistente] = {
          ...novosItens[itemExistente],
          quantidade: novosItens[itemExistente].quantidade + novoItem.quantidade,
          preco: novoItem.preco
        };
        setItens(novosItens);
      } else {
        setItens([...itens, { ...novoItem }]);
      }

      setNovoItem({
        materiaPrimaId: 0,
        quantidade: 0,
        preco: 0
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    const novosItens = [...itens];
    novosItens.splice(index, 1);
    setItens(novosItens);
  };

  const handleSubmit = async () => {
    if (!data || fornecedorId === 0 || itens.length === 0) {
      return;
    }

    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const formData = {
      data: formattedDate,
      juridicaId: fornecedorId,
      valorTotal,
      itens
    };

    if (initialData) {
      await onSubmit({
        ...formData,
        id: initialData.compra.id,
        status
      } as CompraComItensUpdate);
    } else {
      await onSubmit(formData as CompraComItens);
    }

    resetForm();
    onClose();
  };

  const getMateriaPrimaNome = (id: number) => {
    const materiaPrima = materiasPrimas.find(mp => mp.id === id);
    return materiaPrima ? materiaPrima.nome : `Matéria-prima ${id}`;
  };

  const isEditing = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Compra' : 'Nova Compra'}</span>
        <CompraModalHelp isEditing={isEditing} />
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label="Data da Compra"
                  value={data}
                  onChange={(newValue) => setData(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Fornecedor</InputLabel>
                <Select
                  value={fornecedorId}
                  onChange={(e) => setFornecedorId(Number(e.target.value))}
                  label="Fornecedor"
                >
                  <MenuItem value={0} disabled>Selecione um fornecedor</MenuItem>
                  {fornecedores.map((fornecedor) => (
                    <MenuItem key={fornecedor.id} value={fornecedor.id}>
                      {fornecedor.pessoa.nome}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {initialData && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CompraStatus)}
                    label="Status"
                  >
                    {Object.values(CompraStatus).map((statusValue) => (
                      <MenuItem key={statusValue} value={statusValue}>
                        {getStatusText(statusValue)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Itens da Compra
              </Typography>
              <Paper sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                      <InputLabel>Matéria-Prima</InputLabel>
                      <Select
                        value={novoItem.materiaPrimaId}
                        onChange={(e) => setNovoItem({
                          ...novoItem,
                          materiaPrimaId: Number(e.target.value)
                        })}
                        label="Matéria-Prima"
                      >
                        <MenuItem value={0} disabled>Selecione uma matéria-prima</MenuItem>
                        {materiasPrimas.map((mp) => (
                          <MenuItem key={mp.id} value={mp.id}>
                            {mp.nome}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Quantidade"
                      type="number"
                      value={novoItem.quantidade || ''}
                      onChange={(e) => setNovoItem({
                        ...novoItem,
                        quantidade: e.target.value ? Number(e.target.value) : 0
                      })}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Preço Unitário"
                      type="number"
                      value={novoItem.preco || ''}
                      onChange={(e) => setNovoItem({
                        ...novoItem,
                        preco: e.target.value ? Number(e.target.value) : 0
                      })}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleAddItem}
                      fullWidth
                      disabled={!novoItem.materiaPrimaId || novoItem.quantidade <= 0 || novoItem.preco <= 0}
                    >
                      Adicionar
                    </Button>
                  </Grid>
                </Grid>

                {itens.length > 0 && (
                  <TableContainer sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Matéria-Prima</TableCell>
                          <TableCell align="right">Quantidade</TableCell>
                          <TableCell align="right">Preço Unit.</TableCell>
                          <TableCell align="right">Subtotal</TableCell>
                          <TableCell align="center">Ações</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {itens.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{getMateriaPrimaNome(item.materiaPrimaId)}</TableCell>
                            <TableCell align="right">{item.quantidade}</TableCell>
                            <TableCell align="right">{FormatNumber.currency(item.preco)}</TableCell>
                            <TableCell align="right">{FormatNumber.currency(item.quantidade * item.preco)}</TableCell>
                            <TableCell align="center">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleRemoveItem(index)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Typography variant="h6">
                  Valor Total: {FormatNumber.currency(valorTotal)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!data || fornecedorId === 0 || itens.length === 0}
        >
          {initialData ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
