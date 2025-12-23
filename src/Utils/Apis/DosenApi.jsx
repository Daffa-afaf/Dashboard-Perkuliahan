import axiosInstance from "../AxiosInstance";

export const getAllDosen = async () => {
  return await axiosInstance.get("/dosen");
};

export const getDosenById = async (id) => {
  return await axiosInstance.get(`/dosen/${id}`);
};

export const storeDosen = async (dosen) => {
  return await axiosInstance.post("/dosen", dosen);
};

export const updateDosen = async (id, dosen) => {
  return await axiosInstance.put(`/dosen/${id}`, dosen);
};

export const deleteDosen = async (id) => {
  return await axiosInstance.delete(`/dosen/${id}`);
};
