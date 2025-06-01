# Instruções para Adicionar Paginação às Tabelas

Para adicionar paginação a uma tabela, siga os passos abaixo:

## 1. Importar os componentes necessários

```tsx
import { TablePagination } from '@/components/TablePagination';
import { useState, ChangeEvent } from 'react';
```

## 2. Adicionar estado para paginação

```tsx
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
```

## 3. Adicionar lógica de paginação

```tsx
const paginatedItems = filteredItems.slice(
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
```

## 4. Atualizar o corpo da tabela para usar os itens paginados

Substitua:
```tsx
{filteredItems.map((item) => (
```

Por:
```tsx
{paginatedItems.map((item) => (
```

## 5. Envolver a tabela em um Box e adicionar o componente de paginação

```tsx
return (
  <Box>
    <TableContainer component={Paper}>
      {/* ... conteúdo da tabela ... */}
    </TableContainer>
    <TablePagination
      count={filteredItems.length}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Box>
);
```
