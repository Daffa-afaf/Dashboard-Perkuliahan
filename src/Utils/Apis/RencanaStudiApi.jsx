import AxiosInstance from "../AxiosInstance";

// Get all rencanaStudi
export const getAllRencanaStudi = async () => {
  const res = await AxiosInstance.get("/rencanaStudi");
  return res;
};

// Get rencanaStudi by id
export const getRencanaStudiById = async (id) => {
  const res = await AxiosInstance.get(`/rencanaStudi/${id}`);
  return res;
};

// Get rencanaStudi by kelasId
export const getRencanaStudiByKelasId = async (kelasId) => {
  const res = await AxiosInstance.get(`/rencanaStudi?kelasId=${kelasId}`);
  return res;
};

// Create rencanaStudi
export const createRencanaStudi = async (data) => {
  const res = await AxiosInstance.post("/rencanaStudi", data);
  return res;
};

// Update rencanaStudi
export const updateRencanaStudi = async (id, data) => {
  const res = await AxiosInstance.put(`/rencanaStudi/${id}`, data);
  return res;
};

// Delete rencanaStudi
export const deleteRencanaStudi = async (id) => {
  const res = await AxiosInstance.delete(`/rencanaStudi/${id}`);
  return res;
};

// Register mahasiswa ke rencanaStudi
export const registerMahasiswaToRencanaStudi = async (rencanaStudiId, mahasiswaId) => {
  const res = await AxiosInstance.get(`/rencanaStudi/${rencanaStudiId}`);
  const rencanaStudi = res.data;
  
  if (!rencanaStudi.mahasiswaIds.includes(mahasiswaId)) {
    rencanaStudi.mahasiswaIds.push(mahasiswaId);
    rencanaStudi.terdaftar = rencanaStudi.mahasiswaIds.length;
  }
  
  return updateRencanaStudi(rencanaStudiId, rencanaStudi);
};

// Unregister mahasiswa dari rencanaStudi
export const unregisterMahasiswaFromRencanaStudi = async (rencanaStudiId, mahasiswaId) => {
  const res = await AxiosInstance.get(`/rencanaStudi/${rencanaStudiId}`);
  const rencanaStudi = res.data;
  
  rencanaStudi.mahasiswaIds = rencanaStudi.mahasiswaIds.filter((id) => id !== mahasiswaId);
  rencanaStudi.terdaftar = rencanaStudi.mahasiswaIds.length;
  
  return updateRencanaStudi(rencanaStudiId, rencanaStudi);
};
