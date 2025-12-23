import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as RencanaStudiApi from "../Apis/RencanaStudiApi";
import { paginateArray } from "../Helpers/PaginationHelpers";

// Get all rencanaStudi with pagination
export const useRencanaStudiList = (currentPage = 1, pageSize = 10) => {
  return useQuery({
    queryKey: ["rencanaStudi", { page: currentPage, pageSize }],
    queryFn: async () => {
      const res = await RencanaStudiApi.getAllRencanaStudi();
      const data = res.data || [];
      return paginateArray(data, currentPage, pageSize);
    },
    gcTime: 5 * 60 * 1000,
  });
};

// Get rencanaStudi by kelas
export const useRencanaStudiByKelas = (kelasId) => {
  return useQuery({
    queryKey: ["rencanaStudi", "byKelas", kelasId],
    queryFn: async () => {
      if (!kelasId) return { data: [] };
      const res = await RencanaStudiApi.getRencanaStudiByKelasId(kelasId);
      return res.data || [];
    },
    enabled: !!kelasId,
    gcTime: 5 * 60 * 1000,
  });
};

// Get single rencanaStudi
export const useRencanaStudiById = (id) => {
  return useQuery({
    queryKey: ["rencanaStudi", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await RencanaStudiApi.getRencanaStudiById(id);
      return res.data;
    },
    enabled: !!id,
    gcTime: 5 * 60 * 1000,
  });
};

// Create rencanaStudi
export const useCreateRencanaStudi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RencanaStudiApi.createRencanaStudi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencanaStudi"] });
    },
  });
};

// Update rencanaStudi
export const useUpdateRencanaStudi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => RencanaStudiApi.updateRencanaStudi(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencanaStudi"] });
    },
  });
};

// Delete rencanaStudi
export const useDeleteRencanaStudi = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: RencanaStudiApi.deleteRencanaStudi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencanaStudi"] });
    },
  });
};

// Register mahasiswa to rencanaStudi
export const useRegisterMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rencanaStudiId, mahasiswaId }) =>
      RencanaStudiApi.registerMahasiswaToRencanaStudi(rencanaStudiId, mahasiswaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencanaStudi"] });
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
    },
  });
};

// Unregister mahasiswa from rencanaStudi
export const useUnregisterMahasiswa = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ rencanaStudiId, mahasiswaId }) =>
      RencanaStudiApi.unregisterMahasiswaFromRencanaStudi(rencanaStudiId, mahasiswaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rencanaStudi"] });
      queryClient.invalidateQueries({ queryKey: ["mahasiswa"] });
    },
  });
};
