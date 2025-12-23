import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllMataKuliah, getMataKuliahById, storeMataKuliah, updateMataKuliah, deleteMataKuliah } from '../Apis/MataKuliahApi';
import { paginateArray } from '../Helpers/PaginationHelpers';

export const useMataKuliahList = (page = 1, pageSize = 10) => useQuery({
  queryKey: ['matakuliah', { page, pageSize }],
  queryFn: async () => {
    const res = await getAllMataKuliah();
    const paginatedResult = paginateArray(res.data, page, pageSize);
    return paginatedResult;
  },
  gcTime: 1000 * 60 * 5,
});

export const useMataKuliah = (id) => useQuery({
  queryKey: ['matakuliah', id],
  queryFn: async () => {
    const res = await getMataKuliahById(id);
    return res.data;
  },
  enabled: !!id,
});

export const useCreateMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => storeMataKuliah({ ...data, id: data.kode || Date.now().toString() }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matakuliah'] }),
  });
};

export const useUpdateMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMataKuliah(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matakuliah'] }),
  });
};

export const useDeleteMataKuliah = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteMataKuliah(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['matakuliah'] }),
  });
};
