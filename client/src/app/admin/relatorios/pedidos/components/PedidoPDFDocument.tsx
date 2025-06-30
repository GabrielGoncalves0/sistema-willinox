import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { PDFStatusBadge, getStatusText, getStatusColor } from '@/components/PDFStatus';

function formatarValor(valor: number | undefined | null) {
  if (valor === undefined || valor === null) return 'R$ 0,00';
  return `R$ ${Number(valor).toFixed(2).replace('.', ',')}`;
}

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
  table: { display: 'flex', flexDirection: 'column', width: 'auto', marginTop: 8, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', backgroundColor: 'white' },
  tableRowAlt: { flexDirection: 'row', backgroundColor: '#f0f4fa' },
  tableCell: { flex: 1, padding: 6, borderLeft: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0', fontSize: 11 },
  tableHeader: { backgroundColor: '#1976d2', color: 'white', fontWeight: 'bold', fontSize: 12 },
  tableCellHeader: { flex: 1, padding: 6, borderLeft: '1px solid #1976d2', borderRight: '1px solid #1976d2', borderTop: '1px solid #1976d2', borderBottom: '1px solid #1976d2', color: 'white', fontWeight: 'bold', fontSize: 12, pointerEvents: 'none' },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTop: 'none',
    borderBottom: 'none',
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 0,
  },
  totalLabel: {
    flex: 1.3,
    textAlign: 'right',
    fontWeight: 700,
    fontSize: 12,
    color: '#000000',
    letterSpacing: 0.5,
    textTransform: 'none',
    paddingRight: 4,
  },
  totalValue: {
    flex: 1.1,
    fontWeight: 700,
    textAlign: 'right',
    fontSize: 12,
    color: '#000000',
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: '3px 6px',
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

export default function PedidoPDFDocument({ pedido }: { pedido: any }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <Image
            src="/logo-will-inox.png"
            style={{ width: 200, height: 80, marginRight: 16, borderRadius: 8, backgroundColor: 'white' }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#1976d2', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Detalhes do Pedido</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>ID: {pedido.id}</Text>
            <Text style={{ color: '#666', fontSize: 12 }}>Data de emissão: {new Date().toLocaleDateString('pt-BR')}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Gerais</Text>
          <View style={styles.row}>
            <Text style={styles.label}>ID:</Text>
            <Text style={{ ...styles.value, marginLeft: 16 }}>{pedido.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cliente:</Text>
            <Text style={{ ...styles.value, marginLeft: 16 }}>{pedido.cliente?.nome || '-'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Data:</Text>
            <Text style={{ ...styles.value, marginLeft: 16 }}>{formatarData(pedido.dataInicio)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <PDFStatusBadge status={pedido.status} />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Valor de Entrada:</Text>
            <Text style={{ ...styles.value, marginLeft: 16 }}>{formatarValor(pedido.valorEntrada)}</Text>
          </View>
        </View>

        {/* Produtos */}
        {pedido.produtos && pedido.produtos.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Produtos</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, { backgroundColor: '#1976d2' }]}>
                <Text style={[styles.tableCellHeader, { flex: 2, color: 'white', textAlign: 'left' }]}>Produto</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', flex: 1, color: 'white' }]}>Quantidade</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'right', flex: 1, color: 'white' }]}>Preço Unit.</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'right', flex: 1, color: 'white' }]}>Subtotal</Text>
              </View>
              {pedido.produtos.map((item: any, idx: number) => (
                <View style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt} key={idx}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.produto?.nome || `Produto ${item.produtoId}`}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center', flex: 1 }]}>{item.quantidade}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right', flex: 1 }]}>{formatarValor(item.preco)}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right', flex: 1 }]}>{formatarValor(item.quantidade * item.preco)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={{ flex: 4 }}></Text>
                <Text style={styles.totalLabel}>Total Produtos: </Text>
                <Text style={styles.totalValue}>{formatarValor(
                  pedido.produtos.reduce((sum: number, item: any) => sum + item.quantidade * item.preco, 0)
                )}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Matérias-primas */}
        {pedido.materiasPrimas && pedido.materiasPrimas.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Matérias-primas</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, { backgroundColor: '#1976d2' }]}>
                <Text style={[styles.tableCellHeader, { flex: 2, color: 'white', textAlign: 'left' }]}>Matéria-prima</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'center', flex: 1, color: 'white' }]}>Quantidade</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'right', flex: 1, color: 'white' }]}>Preço Unit.</Text>
                <Text style={[styles.tableCellHeader, { textAlign: 'right', flex: 1, color: 'white' }]}>Subtotal</Text>
              </View>
              {pedido.materiasPrimas.map((item: any, idx: number) => (
                <View style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt} key={idx}>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{item.materiaPrima?.nome || `Matéria-prima ${item.materiaPrimaId}`}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'center', flex: 1 }]}>{item.quantidade}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right', flex: 1 }]}>{formatarValor(item.preco)}</Text>
                  <Text style={[styles.tableCell, { textAlign: 'right', flex: 1 }]}>{formatarValor(item.quantidade * item.preco)}</Text>
                </View>
              ))}
              <View style={styles.totalRow}>
                <Text style={{ flex: 4 }}></Text>
                <Text style={styles.totalLabel}>Total Matérias-primas: </Text>
                <Text style={styles.totalValue}>{formatarValor(
                  pedido.materiasPrimas.reduce((sum: number, item: any) => sum + item.quantidade * item.preco, 0)
                )}</Text>
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
