'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  TableRow,
  Tabs,
  Tab,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { toast } from 'sonner';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  PedidoComItens,
  PedidoComItensUpdate,
  PedidoDetalhado,
  ItemProduto,
  ItemMateriaPrima,
  PedidoStatus,
  getStatusText
} from '../constants';
import { useCliente } from '@/hooks/useCliente';
import { useProducts } from '@/hooks/useProduto';
import { useMateriasPrimas } from '@/hooks/useMateriaPrima';
import { FormatNumber } from '@/utils/formatNumber';
import { ptBR } from 'date-fns/locale';
import { PedidoModalHelp } from '@/components/help';

interface PedidoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PedidoComItens | PedidoComItensUpdate) => Promise<void>;
  initialData?: PedidoDetalhado;
}

export default function PedidoForm({ open, onClose, onSubmit, initialData }: PedidoFormProps) {
  const { clientes, fetchClientes } = useCliente();
  const { products, fetchProducts } = useProducts();
  const { materiasPrimas: materiaPrimasList, fetchMateriasPrimas } = useMateriasPrimas();
  const [activeTab, setActiveTab] = useState<number>(0);

  const [data, setData] = useState<Date | null>(new Date());
  const [clienteId, setClienteId] = useState<number>(0);
  const [status, setStatus] = useState<PedidoStatus>(PedidoStatus.PENDENTE);
  const [produtos, setProdutos] = useState<ItemProduto[]>([]);
  const [materiasPrimas, setMateriasPrimas] = useState<ItemMateriaPrima[]>([]);
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [valorEntrada, setValorEntrada] = useState<number>(0);
  const [aplicarEntrada, setAplicarEntrada] = useState<boolean>(false);

  const [novoProduto, setNovoProduto] = useState<ItemProduto>({
    produtoId: 0,
    quantidade: 0,
    preco: 0
  });

  const [novaMateriaPrima, setNovaMateriaPrima] = useState<ItemMateriaPrima>({
    materiaPrimaId: 0,
    quantidade: 0,
    preco: 0
  });

  useEffect(() => {
    fetchClientes();
    fetchProducts();
    fetchMateriasPrimas();
  }, []);

  useEffect(() => {
    if (initialData) {
      setData(new Date(initialData.pedido.data));
      setClienteId(initialData.pedido.pessoaId);
      setStatus(initialData.pedido.status);
      setProdutos(initialData.produtos || []);
      setMateriasPrimas(initialData.materiasPrimas || []);
      setValorTotal(initialData.valorTotal);

      if (initialData.pedido.valorEntrada && initialData.pedido.valorEntrada > 0) {
        setAplicarEntrada(true);
        setValorEntrada(initialData.pedido.valorEntrada);
      } else {
        setAplicarEntrada(false);
        setValorEntrada(0);
      }
    } else {
      resetForm();
    }
  }, [initialData, open]);

  useEffect(() => {
    const valorProdutos = produtos.reduce((total, item) => total + (item.quantidade * item.preco), 0);
    const valorMateriasPrimas = materiasPrimas.reduce((total, item) => total + (item.quantidade * item.preco), 0);
    const novoValorTotal = valorProdutos + valorMateriasPrimas;
    setValorTotal(novoValorTotal);

    if (aplicarEntrada) {
      setValorEntrada(novoValorTotal * 0.5);
    } else {
      setValorEntrada(0);
    }
  }, [produtos, materiasPrimas, aplicarEntrada]);

  const resetForm = () => {
    setData(new Date());
    setClienteId(0);
    setStatus(PedidoStatus.PENDENTE);
    setProdutos([]);
    setMateriasPrimas([]);
    setValorTotal(0);
    setValorEntrada(0);
    setAplicarEntrada(false);
    setNovoProduto({
      produtoId: 0,
      quantidade: 0,
      preco: 0
    });
    setNovaMateriaPrima({
      materiaPrimaId: 0,
      quantidade: 0,
      preco: 0
    });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddProduto = () => {
    if (novoProduto.produtoId && novoProduto.quantidade > 0) {
      const existingIndex = produtos.findIndex(p => p.produtoId === novoProduto.produtoId);

      if (existingIndex >= 0) {
        const updatedProdutos = [...produtos];
        updatedProdutos[existingIndex].quantidade += novoProduto.quantidade;
        setProdutos(updatedProdutos);
      } else {
        const produto = products.find(p => p.id === novoProduto.produtoId);
        const preco = novoProduto.preco > 0 ? novoProduto.preco : (produto?.preco || 0);

        setProdutos([...produtos, {
          ...novoProduto,
          preco,
          produto
        }]);
      }

      setNovoProduto({
        produtoId: 0,
        quantidade: 0,
        preco: 0
      });
    }
  };

  const handleRemoveProduto = (index: number) => {
    const updatedProdutos = [...produtos];
    updatedProdutos.splice(index, 1);
    setProdutos(updatedProdutos);
  };

  const handleAddMateriaPrima = () => {
    if (novaMateriaPrima.materiaPrimaId && novaMateriaPrima.quantidade > 0) {
      const existingIndex = materiasPrimas.findIndex(mp => mp.materiaPrimaId === novaMateriaPrima.materiaPrimaId);

      if (existingIndex >= 0) {
        const updatedMateriasPrimas = [...materiasPrimas];
        updatedMateriasPrimas[existingIndex].quantidade += novaMateriaPrima.quantidade;
        setMateriasPrimas(updatedMateriasPrimas);
      } else {
        const materiaPrima = materiaPrimasList.find(mp => mp.id === novaMateriaPrima.materiaPrimaId);
        const preco = novaMateriaPrima.preco > 0 ? novaMateriaPrima.preco : (materiaPrima?.preco || 0);

        setMateriasPrimas([...materiasPrimas, {
          ...novaMateriaPrima,
          preco
        }]);
      }

      setNovaMateriaPrima({
        materiaPrimaId: 0,
        quantidade: 0,
        preco: 0
      });
    }
  };

  const handleRemoveMateriaPrima = (index: number) => {
    const updatedMateriasPrimas = [...materiasPrimas];
    updatedMateriasPrimas.splice(index, 1);
    setMateriasPrimas(updatedMateriasPrimas);
  };

  const handleProdutoChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const produtoId = Number(event.target.value);
    const produto = products.find(p => p.id === produtoId);

    setNovoProduto({
      ...novoProduto,
      produtoId,
      preco: produto?.preco || 0
    });
  };

  const handleMateriaPrimaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const materiaPrimaId = Number(event.target.value);
    const materiaPrima = materiaPrimasList.find(mp => mp.id === materiaPrimaId);

    setNovaMateriaPrima({
      ...novaMateriaPrima,
      materiaPrimaId,
      preco: materiaPrima?.preco || 0
    });
  };

  const handleSubmit = async () => {
    if (!data || !clienteId) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (produtos.length === 0 && materiasPrimas.length === 0) {
      toast.error('Por favor, adicione pelo menos um produto ou matéria-prima ao pedido.');
      return;
    }

    const year = data.getFullYear();
    const month = String(data.getMonth() + 1).padStart(2, '0');
    const day = String(data.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const pedidoData: PedidoComItens | PedidoComItensUpdate = {
      ...(initialData ? { id: initialData.pedido.id } : {}),
      data: formattedDate,
      pessoaId: clienteId,
      valorEntrada: aplicarEntrada ? valorEntrada : 0,
      ...(initialData ? { status } : {}),
      ...(produtos.length > 0 ? { produtos } : {}),
      ...(materiasPrimas.length > 0 ? { materiasPrimas } : {})
    };

    await onSubmit(pedidoData);
    onClose();
  };

  const isEditing = Boolean(initialData);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>{isEditing ? 'Editar Pedido' : 'Novo Pedido'}</span>
        <PedidoModalHelp isEditing={isEditing} />
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label="Data"
                value={data}
                onChange={(newValue) => setData(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Cliente</InputLabel>
              <Select
                value={clienteId}
                onChange={(e) => setClienteId(Number(e.target.value))}
                label="Cliente"
              >
                <MenuItem value={0} disabled>Selecione um cliente</MenuItem>
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.pessoa.id} value={cliente.pessoa.id}>
                    {cliente.pessoa.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {initialData && (
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PedidoStatus)}
                  label="Status"
                >
                  {Object.values(PedidoStatus).map((statusValue) => (
                    <MenuItem key={statusValue} value={statusValue}>
                      {getStatusText(statusValue)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Produtos" />
            <Tab label="Matérias-Primas" />
          </Tabs>

          {activeTab === 0 && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Produto</InputLabel>
                    <Select
                      value={novoProduto.produtoId}
                      onChange={(e) => handleProdutoChange(e as any)}
                      label="Produto"
                    >
                      <MenuItem value={0} disabled>Selecione um produto</MenuItem>
                      {products.map((produto) => (
                        <MenuItem key={produto.id} value={produto.id}>
                          {produto.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Quantidade"
                    type="number"
                    value={novoProduto.quantidade}
                    onChange={(e) => setNovoProduto({...novoProduto, quantidade: Number(e.target.value)})}
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Preço Unitário"
                    type="number"
                    value={novoProduto.preco}
                    onChange={(e) => setNovoProduto({...novoProduto, preco: Number(e.target.value)})}
                    fullWidth
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddProduto}
                    fullWidth
                    disabled={!novoProduto.produtoId || novoProduto.quantidade <= 0}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Grid>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Produto</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Preço Unitário</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {produtos.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Nenhum produto adicionado
                        </TableCell>
                      </TableRow>
                    ) : (
                      produtos.map((item, index) => (
                        <TableRow key={`produto-${index}`}>
                          <TableCell>
                            {products.find(p => p.id === item.produtoId)?.nome || `Produto ${item.produtoId}`}
                          </TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>{FormatNumber.currency(item.preco)}</TableCell>
                          <TableCell>{FormatNumber.currency(item.quantidade * item.preco)}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleRemoveProduto(index)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === 1 && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Matéria-Prima</InputLabel>
                    <Select
                      value={novaMateriaPrima.materiaPrimaId}
                      onChange={(e) => handleMateriaPrimaChange(e as any)}
                      label="Matéria-Prima"
                    >
                      <MenuItem value={0} disabled>Selecione uma matéria-prima</MenuItem>
                      {materiaPrimasList.map((mp) => (
                        <MenuItem key={mp.id} value={mp.id}>
                          {mp.nome}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Quantidade"
                    type="number"
                    value={novaMateriaPrima.quantidade}
                    onChange={(e) => setNovaMateriaPrima({...novaMateriaPrima, quantidade: Number(e.target.value)})}
                    fullWidth
                    InputProps={{ inputProps: { min: 1 } }}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    label="Preço Unitário"
                    type="number"
                    value={novaMateriaPrima.preco}
                    onChange={(e) => setNovaMateriaPrima({...novaMateriaPrima, preco: Number(e.target.value)})}
                    fullWidth
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddMateriaPrima}
                    fullWidth
                    disabled={!novaMateriaPrima.materiaPrimaId || novaMateriaPrima.quantidade <= 0}
                  >
                    Adicionar
                  </Button>
                </Grid>
              </Grid>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Matéria-Prima</TableCell>
                      <TableCell>Quantidade</TableCell>
                      <TableCell>Preço Unitário</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell align="center">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materiasPrimas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Nenhuma matéria-prima adicionada
                        </TableCell>
                      </TableRow>
                    ) : (
                      materiasPrimas.map((item, index) => (
                        <TableRow key={`materia-prima-${index}`}>
                          <TableCell>
                            {materiaPrimasList.find(mp => mp.id === item.materiaPrimaId)?.nome || `Matéria-Prima ${item.materiaPrimaId}`}
                          </TableCell>
                          <TableCell>{item.quantidade}</TableCell>
                          <TableCell>{FormatNumber.currency(item.preco)}</TableCell>
                          <TableCell>{FormatNumber.currency(item.quantidade * item.preco)}</TableCell>
                          <TableCell align="center">
                            <IconButton onClick={() => handleRemoveMateriaPrima(index)} color="error">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              mb: 2
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={aplicarEntrada}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAplicarEntrada(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography fontWeight="medium">
                  Aplicar entrada de 50% do valor total
                </Typography>
              }
            />
          </Paper>

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                bgcolor: aplicarEntrada ? '#bbdefb' : 'grey.200', /* Azul médio (blue[100]) */
                color: aplicarEntrada ? '#1565c0' : 'text.secondary', /* Texto azul mais escuro para contraste */
                borderRadius: 1,
                transition: 'all 0.3s ease'
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Valor Entrada
              </Typography>
              <Typography variant="h5">
                {aplicarEntrada ? FormatNumber.currency(valorEntrada) : FormatNumber.currency(0)}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                bgcolor: '#c8e6c9', /* Verde médio (green[100]) */
                color: '#2e7d32', /* Texto verde mais escuro para contraste */
                borderRadius: 1
              }}
            >
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Valor Total
              </Typography>
              <Typography variant="h5">
                {FormatNumber.currency(valorTotal)}
              </Typography>
            </Paper>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {initialData ? 'Atualizar' : 'Criar'} Pedido
        </Button>
      </DialogActions>
    </Dialog>
  );
}
