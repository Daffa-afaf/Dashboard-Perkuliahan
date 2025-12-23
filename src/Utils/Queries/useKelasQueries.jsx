import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllKelas, getKelasById, storeKelas, updateKelas, deleteKelas } from '../Apis/KelasApi';
import { paginateArray } from '../Helpers/PaginationHelpers';

export const useKelasList = (page = 1, pageSize = 10) => useQuery({
  queryKey: ['kelas', { page, pageSize }],
  queryFn: async () => {
    const res = await getAllKelas();
    const paginatedResult = paginateArray(res.data, page, pageSize);
    return paginatedResult;
  },
  gcTime: 1000 * 60 * 5,
});

export const useKelas = (id) => useQuery({
  queryKey: ['kelas', id],
  queryFn: async () => {
    const res = await getKelasById(id);
    return res.data;
  },
  enabled: !!id,
});

export const useCreateKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => storeKelas({ ...data, id: data.kode || Date.now().toString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kelas'] }),
  });
};

export const useUpdateKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateKelas(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kelas'] }),
  });
};

export const useDeleteKelas = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteKelas(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kelas'] }),
  });
};
