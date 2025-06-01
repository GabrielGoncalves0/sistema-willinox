'use client';

import { useState, ChangeEvent } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialRowsPerPage?: number;
}

interface UsePaginationReturn {
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: ChangeEvent<HTMLInputElement>) => void;
  resetPagination: () => void;
  getPaginatedData: <T>(data: T[]) => T[];
}

export const usePagination = ({
  initialPage = 0,
  initialRowsPerPage = 10,
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const resetPagination = () => {
    setPage(initialPage);
    setRowsPerPage(initialRowsPerPage);
  };

  const getPaginatedData = <T>(data: T[]): T[] => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    resetPagination,
    getPaginatedData,
  };
};
