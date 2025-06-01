'use client';

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Divider,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import {
  FileText,
  ShoppingBag,
  Factory,
  TrendingUp,
  Package
} from 'lucide-react';
import HelpCollapse from '@/components/HelpCollapse';

export default function RelatoriosPage() {
  const router = useRouter();

  const relatorios = [

    {
      id: 'producao',
      titulo: 'Relatório de Produção',
      descricao: 'Acompanhe a produção de produtos ao longo do tempo.',
      classificacao: 'Saída',
      complexidade: 'BAIXA',
      icone: <Factory size={48} />,
      cor: '#2196f3',
      rota: '/admin/relatorios/producao'
    },
    {
      id: 'pedidos',
      titulo: 'Relatório de Pedidos',
      descricao: 'Analise informações detalhadas sobre os pedidos realizados.',
      classificacao: 'Saída',
      complexidade: 'BAIXA',
      icone: <TrendingUp size={48} />,
      cor: '#ff9800',
      rota: '/admin/relatorios/pedidos'
    },
    {
      id: 'produtos',
      titulo: 'Relatório de Produtos',
      descricao: 'Consulte informações sobre o estoque e movimentação de produtos.',
      classificacao: 'Saída',
      complexidade: 'BAIXA',
      icone: <Package size={48} />,
      cor: '#9c27b0',
      rota: '/admin/relatorios/produtos'
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <HelpCollapse
        title="Relatórios do Sistema"
        content={
          <>
            <Typography paragraph>
              Esta página permite acessar os diferentes relatórios disponíveis no sistema. Selecione um dos relatórios abaixo para visualizar informações detalhadas.
            </Typography>
            <Typography paragraph>
              <strong>Tipos de relatórios disponíveis:</strong>
            </Typography>
            <ul>
              <li><strong>Relatório de Pedidos:</strong> Visualize informações detalhadas sobre os pedidos realizados, incluindo status, valores e clientes.</li>
              <li><strong>Relatório de Produção:</strong> Acompanhe a produção de produtos, com dados sobre quantidades, funcionários responsáveis e datas.</li>
              <li><strong>Relatório de Produtos:</strong> Consulte informações sobre estoque e movimentação de produtos.</li>
            </ul>
            <Typography paragraph>
              <strong>Classificação:</strong> Todos os relatórios são classificados como "Saída", pois apresentam dados já processados pelo sistema.
            </Typography>
            <Typography paragraph>
              <strong>Complexidade:</strong> Todos os relatórios possuem complexidade BAIXA, sendo fáceis de gerar e interpretar.
            </Typography>
          </>
        }
      />

      <Typography variant="h1" sx={{ mb: 4, fontSize: '2rem', fontWeight: 600 }}>
        Relatórios do Sistema
      </Typography>

      <Grid container spacing={3}>
        {relatorios.map((relatorio) => (
          <Grid item xs={12} sm={6} md={3} key={relatorio.id}>
            <Card
              sx={{
                height: '100%',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                }
              }}
            >
              <CardActionArea
                sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                onClick={() => router.push(relatorio.rota)}
              >
                <Box
                  sx={{
                    p: 3,
                    display: 'flex',
                    justifyContent: 'center',
                    backgroundColor: `${relatorio.cor}15`
                  }}
                >
                  <Box sx={{ color: relatorio.cor }}>
                    {relatorio.icone}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {relatorio.titulo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {relatorio.descricao}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Classificação:</strong> {relatorio.classificacao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Complexidade:</strong> {relatorio.complexidade}
                    </Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
