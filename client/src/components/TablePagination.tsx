'use client';

import {
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  SelectChangeEvent,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowLeft,
  KeyboardArrowRight,
  FirstPage,
  LastPage
} from '@mui/icons-material';
import { ChangeEvent } from 'react';

interface TablePaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const TablePagination = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: TablePaginationProps) => {
  const theme = useTheme();

  const handleFirstPageButtonClick = () => {
    onPageChange(null, 0);
  };

  const handleBackButtonClick = () => {
    onPageChange(null, page - 1);
  };

  const handleNextButtonClick = () => {
    onPageChange(null, page + 1);
  };

  const handleLastPageButtonClick = () => {
    onPageChange(null, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const handleRowsPerPageChange = (event: SelectChangeEvent<number>) => {
    onRowsPerPageChange(event as ChangeEvent<HTMLInputElement>);
  };

  const from = count === 0 ? 0 : page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        padding: 2,
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: '0 0 8px 8px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: { xs: 2, sm: 0 },
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}
      >
        <Typography
          variant="body2"
          sx={{
            mr: 1,
            fontWeight: 500,
            color: theme.palette.text.secondary
          }}
        >
          Itens por página:
        </Typography>
        <Select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          size="small"
          sx={{
            minWidth: 70,
            height: '32px',
            '& .MuiSelect-select': {
              py: 0.5,
              fontWeight: 500,
              paddingTop: '4px',
              paddingBottom: '4px',
              fontSize: '0.875rem',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
              borderRadius: '4px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.palette.divider,
              borderWidth: '1px',
            },
          }}
        >
          {[5, 10, 25, 50].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', sm: 'flex-end' }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '20px',
            padding: '2px 12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            mr: 2,
            border: `1px solid ${theme.palette.divider}`,
            height: '32px'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              color: theme.palette.text.primary,
              fontSize: '0.875rem'
            }}
          >
            {from}-{to} de {count}
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: theme.palette.background.paper,
            borderRadius: '20px',
            padding: '2px 4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: `1px solid ${theme.palette.divider}`,
            height: '32px'
          }}
        >
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="primeira página"
            size="small"
            sx={{
              color: page === 0 ? 'text.disabled' : 'primary.main',
              '&:hover': {
                backgroundColor: page === 0 ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
              },
              mx: 0.5,
              padding: '4px',
              width: '32px',
              height: '32px'
            }}
          >
            <FirstPage sx={{ fontSize: '1.25rem' }} />
          </IconButton>
          <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            aria-label="página anterior"
            size="small"
            sx={{
              color: page === 0 ? 'text.disabled' : 'primary.main',
              '&:hover': {
                backgroundColor: page === 0 ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
              },
              mx: 0.5,
              padding: '4px',
              width: '32px',
              height: '32px'
            }}
          >
            <KeyboardArrowLeft sx={{ fontSize: '1.25rem' }} />
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '32px',
              height: '32px',
              mx: 0.5,
              borderRadius: '4px',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            {page + 1}
          </Box>

          <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="próxima página"
            size="small"
            sx={{
              color: page >= Math.ceil(count / rowsPerPage) - 1 ? 'text.disabled' : 'primary.main',
              '&:hover': {
                backgroundColor: page >= Math.ceil(count / rowsPerPage) - 1 ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
              },
              mx: 0.5,
              padding: '4px',
              width: '32px',
              height: '32px'
            }}
          >
            <KeyboardArrowRight sx={{ fontSize: '1.25rem' }} />
          </IconButton>
          <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="última página"
            size="small"
            sx={{
              color: page >= Math.ceil(count / rowsPerPage) - 1 ? 'text.disabled' : 'primary.main',
              '&:hover': {
                backgroundColor: page >= Math.ceil(count / rowsPerPage) - 1 ? 'transparent' : 'rgba(25, 118, 210, 0.08)',
              },
              mx: 0.5,
              padding: '4px',
              width: '32px',
              height: '32px'
            }}
          >
            <LastPage sx={{ fontSize: '1.25rem' }} />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
