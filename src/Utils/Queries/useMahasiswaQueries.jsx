import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAllMahasiswa,
  getMahasiswaById,
  getMahasiswaByNim,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswaByNim,
} from '../Apis/MahasiswaApi';
import { paginateArray } from '../Helpers/PaginationHelpers';

export const useMahasiswaList = (page = 1, pageSize = 10) => useQuery({
  queryKey: ['mahasiswa', { page, pageSize }],
  queryFn: async () => {
    const res = await getAllMahasiswa();
    const paginatedResult = paginateArray(res.data, page, pageSize);
    return paginatedResult;
  },
  gcTime: 1000 * 60 * 5,
});

export const useMahasiswa = (nim) => useQuery({
  queryKey: ['mahasiswa', nim],
  queryFn: async () => {
    const res = await getMahasiswaByNim(nim);
    return res.data;
  },
  enabled: !!nim,
});

export const useCreateMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => storeMahasiswa({ ...data, id: data.nim }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mahasiswa'] }),
  });
};

export const useUpdateMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateMahasiswa(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mahasiswa'] }),
  });
};

export const useDeleteMahasiswa = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (nimOrId) => deleteMahasiswaByNim(nimOrId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mahasiswa'] }),
  });
};
