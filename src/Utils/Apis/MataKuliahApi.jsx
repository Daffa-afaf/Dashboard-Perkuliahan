import axiosInstance from "../AxiosInstance";

export const getAllMataKuliah = async () => {
  return await axiosInstance.get("/matakuliah");
};

export const getMataKuliahById = async (id) => {
  return await axiosInstance.get(`/matakuliah/${id}`);
};

export const storeMataKuliah = async (matakuliah) => {
  return await axiosInstance.post("/matakuliah", matakuliah);
};

export const updateMataKuliah = async (id, matakuliah) => {
  return await axiosInstance.put(`/matakuliah/${id}`, matakuliah);
};

export const deleteMataKuliah = async (id) => {
  return await axiosInstance.delete(`/matakuliah/${id}`);
};
