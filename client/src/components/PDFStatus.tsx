import { Text, StyleSheet } from '@react-pdf/renderer';

export const getStatusText = (status: string) => {
  switch (status) {
    case 'pendente': return 'Pendente';
    case 'processando': return 'Processando';
    case 'concluido': return 'Concluído';
    case 'cancelado': return 'Cancelado';
    default: return 'Desconhecido';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pendente': return '#ff9800';
    case 'processando': return '#2196f3';
    case 'concluido': return '#4caf50';
    case 'cancelado': return '#f44336';
    default: return '#757575';
  }
};

export const statusBadgeStyle = StyleSheet.create({
  badge: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    borderRadius: 8,
    padding: '2px 10px',
    marginLeft: 8,
    textTransform: 'capitalize',
  },
});

export function PDFStatusBadge({ status }: { status: string }) {
  return (
    <Text style={[statusBadgeStyle.badge, { backgroundColor: getStatusColor(status) }]}>
      {getStatusText(status)}
    </Text>
  );
}
