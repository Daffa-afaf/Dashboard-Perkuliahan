import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDosen, getDosenById, storeDosen, updateDosen, deleteDosen } from '../Apis/DosenApi';
import { paginateArray } from '../Helpers/PaginationHelpers';

export const useDosenList = (page = 1, pageSize = 10) => useQuery({
  queryKey: ['dosen', { page, pageSize }],
  queryFn: async () => {
    const res = await getAllDosen();
    const paginatedResult = paginateArray(res.data, page, pageSize);
    return paginatedResult;
  },
  gcTime: 1000 * 60 * 5,
});

export const useDosen = (id) => useQuery({
  queryKey: ['dosen', id],
  queryFn: async () => {
    const res = await getDosenById(id);
    return res.data;
  },
  enabled: !!id,
});

export const useCreateDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => storeDosen({ ...data, id: data.nidn }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dosen'] }),
  });
};

export const useUpdateDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dosen'] }),
  });
};

export const useDeleteDosen = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDosen(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dosen'] }),
  });
};
