import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ProducaoReport } from '../schema';
import { PDFStatusBadge, getStatusText, getStatusColor } from '@/components/PDFStatus';

function formatarData(data: string | null) {
  if (!data) return '-';
  try {
    return new Date(data).toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
}

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
  table: { display: 'flex', flexDirection: 'column', width: 'auto', marginTop: 8, borderRadius: 6, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', backgroundColor: 'white' },
  tableRowAlt: { flexDirection: 'row', backgroundColor: '#f0f4fa' },
  tableCell: { flex: 1, padding: 6, border: '1px solid #e0e0e0', fontSize: 11 },
  tableHeader: { backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', fontSize: 12 },
  tableCellHeader: { flex: 1, padding: 6, border: '1px solid #1976d2', color: 'white', fontWeight: 'bold', fontSize: 12 },
  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    borderTop: '1px solid #e0e0e0',
    paddingTop: 8,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', padding: 8, borderTop: '1px solid #e0e0e0' },
  totalLabel: { fontWeight: 'bold', color: '#333', marginRight: 8 },
  totalValue: { fontWeight: 'bold', color: '#1976d2' },
});

export default function ProducaoPDFDocument({ producao }: { producao: ProducaoReport }) {
  // Soma total de matérias-primas utilizadas
  const totalMaterias = producao.materiasPrimas?.reduce((sum, item) => sum + (item.quantidade || 0), 0) || 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Image
            src="/logo-will-inox.png"
            style={{ width: 200, height: 80, marginRight: 16, borderRadius: 8, backgroundColor: 'white' }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#1976d2', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Detalhes da Produção</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>ID: {producao.id}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Data de emissão: {new Date().toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.row}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{producao.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Produto:</Text>
            <Text style={styles.value}>{producao.produto.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Funcionário:</Text>
            <Text style={styles.value}>{producao.funcionario.nome}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Quantidade:</Text>
            <Text style={styles.value}>{producao.quantidade}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Início:</Text>
            <Text style={styles.value}>{formatarData(producao.dataInicio)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data de Fim:</Text>
            <Text style={styles.value}>{formatarData(producao.dataFim)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <PDFStatusBadge status={producao.status} />
          </View>
        </View>
        {producao.materiasPrimas && producao.materiasPrimas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Matérias-primas Utilizadas</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, { backgroundColor: '#1976d2' }]}>
                <Text style={[styles.tableCellHeader, { flex: 2, color: 'white', textAlign: 'left' }]}>Matéria-prima</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', flex: 1, color: 'white' }]}>Quantidade Utilizada</Text>
              </View>
              {producao.materiasPrimas.map((item, idx) => (
                <View style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt} key={idx}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center', flex: 1 }]}>{item.quantidade}</Text>
                </View>
              ))}
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 28, marginTop: 0, backgroundColor: '#fff', borderTop: 'none', borderBottom: 'none', justifyContent: 'flex-end' }}>
                <Text style={{ flex: 2 }}></Text>
                <Text style={{ flex: 1, textAlign: 'right', fontWeight: 700, fontSize: 12, color: '#000', letterSpacing: 0.5, textTransform: 'none', paddingRight: 4 }}>Total:</Text>
                <Text style={{ flex: 1, fontWeight: 700, textAlign: 'right', fontSize: 12, color: '#000', backgroundColor: '#fff', borderRadius: 4, padding: '3px 6px' }}>{totalMaterias}</Text>
              </View>
            </View>
          </View>
        )}
        <View style={styles.footer}>
          <Text>Documento gerado por WillInox • {new Date().toLocaleString('pt-BR')}</Text>
        </View>
      </Page>
    </Document>
  );
}
