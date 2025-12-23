/**
 * Pagination Helper - Untuk menangani pagination di client-side
 * Gunakan ini ketika API tidak mendukung pagination native
 */
export const paginateArray = (array, page = 1, pageSize = 10) => {
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Validasi page
  const validPage = Math.max(1, Math.min(page, totalPages || 1));
  
  const startIndex = (validPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const data = array.slice(startIndex, endIndex);
  
  return {
    data,
    pagination: {
      currentPage: validPage,
      pageSize,
      totalItems,
      totalPages,
    },
  };
};

/**
 * Create paginated query key untuk React Query
 */
export const createPaginatedQueryKey = (entityName, page, pageSize) => {
  return [entityName, { page, pageSize }];
};
