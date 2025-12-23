/*
SCREENSHOT: Report 2 — Role & Permission
File: src/Utils/Queries/useUsersQueries.jsx
Purpose: Hooks used to list and mutate users. Capture to show the
React Query mutation used for updating roles/permissions.
*/

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, updateUser, deleteUser } from '../Apis/AuthApi';
import { paginateArray } from '../Helpers/PaginationHelpers';

export const useUsersList = (page = 1, pageSize = 10) => useQuery({
  queryKey: ['users', { page, pageSize }],
  queryFn: async () => {
    const res = await getAllUsers();
    const paginatedResult = paginateArray(res.data, page, pageSize);
    return paginatedResult;
  },
  gcTime: 1000 * 60 * 5,
});

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
};
