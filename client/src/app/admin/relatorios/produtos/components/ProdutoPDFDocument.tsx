import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ProdutoReport } from '../schema';
import { formatarValor } from '../services';
import { PDFStatusBadge } from '@/components/PDFStatus';

const getStatusColor = (ativo: boolean) => (ativo ? '#4caf50' : '#f44336');

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 12, fontFamily: 'Helvetica', backgroundColor: '#f5f7fa' },
  headerBox: {
    backgroundColor: '#1976d2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  headerSub: { color: 'white', fontSize: 12 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1976d2', marginBottom: 8 },
  row: { flexDirection: 'row', marginBottom: 6, alignItems: 'center' },
  label: { fontWeight: 'bold', color: '#333', minWidth: 80 },
  value: { marginLeft: 8, color: '#222' },
  statusBadge: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    borderRadius: 8,
    padding: '2px 10px',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 8,
  },
});

export default function ProdutoPDFDocument({ produto }: { produto: ProdutoReport }) {
  const valorTotalEstoque = produto.preco * produto.qtdEstoque;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Image
            src="/logo-will-inox.png"
            style={{ width: 200, height: 80, marginRight: 16, borderRadius: 8, backgroundColor: 'white' }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#1976d2', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Detalhes do Produto</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Código: {produto.codigo}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Data de emissão: {new Date().toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Código:</Text>
            <Text style={styles.value}>{produto.codigo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Nome:</Text>
            <Text style={styles.value}>{produto.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Descrição:</Text>
            <Text style={styles.value}>{produto.descricao || 'Não informado'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{produto.modelo.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Preço:</Text>
            <Text style={styles.value}>{formatarValor(produto.preco)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Quantidade em Estoque:</Text>
            <Text style={styles.value}>{produto.qtdEstoque}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Valor Total em Estoque:</Text>
            <Text style={styles.value}>{formatarValor(valorTotalEstoque)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <PDFStatusBadge status={produto.ativo ? 'concluido' : 'cancelado'} />
          </View>
        </View>
        <View style={styles.footer}>
          <Text>Documento gerado por WillInox • {new Date().toLocaleString('pt-BR')}</Text>
        </View>
      </Page>
    </Document>
  );
}
