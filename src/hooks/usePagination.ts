import { useState, useMemo, useEffect } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  pageSize: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  currentPageData: T[];
  totalPages: number;
  totalItems: number;
}

export function usePagination<T>({ data, pageSize }: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageData, setCurrentPageData] = useState<T[]>([]);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize), [data.length, pageSize]);
  const totalItems = data.length;

  useEffect(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const items = data.slice(start, end);
    setCurrentPageData(items);
  }, [data, currentPage, pageSize]);

  return {
    currentPage,
    setCurrentPage,
    currentPageData,
    totalPages,
    totalItems,
  };
} 