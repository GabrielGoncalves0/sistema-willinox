'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import { CompraDetalhada } from '../../../../hooks/useCompra';
import { getStatusColor, getStatusText } from '../constants';
import { FormatNumber } from '../../../../utils/formatNumber';
import { FormatDate } from '../../../../utils/formatDate';
import { useFornecedor } from '../../../../hooks/useFornecedor';
import { useMateriasPrimas } from '../../../../hooks/useMateriaPrima';

interface CompraDetailsModalProps {
  open: boolean;
  onClose: () => void;
  compra: CompraDetalhada | null;
}

export const CompraDetailsModal = ({
  open,
  onClose,
  compra,
}: CompraDetailsModalProps) => {
  const { fornecedores } = useFornecedor();
  const { materiasPrimas } = useMateriasPrimas();

  if (!compra) return null;

  const getFornecedorNome = (id: number) => {
    const fornecedor = fornecedores.find(f => f.id === id);
    return fornecedor && fornecedor.pessoa ? fornecedor.pessoa.nome : `Fornecedor ${id}`;
  };

  const getMateriaPrimaNome = (id: number) => {
    const materiaPrima = materiasPrimas.find(mp => mp.id === id);
    return materiaPrima ? materiaPrima.nome : `Matéria-Prima ${id}`;
  };

  const valorTotal = compra.itens.reduce((total, item) => total + (item.quantidade * item.preco), 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Detalhes da Compra #{compra.compra.id}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Informações Gerais
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Data da Compra
              </Typography>
              <Typography variant="body1">
                {FormatDate.date(compra.compra.data)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Fornecedor
              </Typography>
              <Typography variant="body1">
                {getFornecedorNome(compra.compra.juridicaId)}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={getStatusText(compra.compra.status)}
                sx={{
                  bgcolor: getStatusColor(compra.compra.status),
                  color: 'white',
                  fontWeight: 'bold',
                  mt: 0.5
                }}
              />
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Valor Total
              </Typography>
              <Typography variant="h6" color="primary">
                {FormatNumber.currency(valorTotal)}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Itens da Compra
          </Typography>

          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Matéria-Prima</strong></TableCell>
                  <TableCell align="center"><strong>Quantidade</strong></TableCell>
                  <TableCell align="right"><strong>Preço Unit.</strong></TableCell>
                  <TableCell align="right"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {compra.itens.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {getMateriaPrimaNome(item.materiaPrimaId)}
                    </TableCell>
                    <TableCell align="center">
                      {FormatNumber.decimal(item.quantidade)}
                    </TableCell>
                    <TableCell align="right">
                      {FormatNumber.currency(item.preco)}
                    </TableCell>
                    <TableCell align="right">
                      {FormatNumber.currency(item.quantidade * item.preco)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      Total Geral
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {FormatNumber.currency(valorTotal)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
