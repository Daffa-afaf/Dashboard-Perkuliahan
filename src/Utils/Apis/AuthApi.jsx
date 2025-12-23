/*
SCREENSHOT: Report 2 — Role & Permission
File: src/Utils/Apis/AuthApi.jsx
Purpose: User CRUD and role update functions. Capture this file as evidence
of the API endpoints used to change user roles/permissions.
*/

import AxiosInstance from "../AxiosInstance";

export const login = async (email, password) => {
  const res = await AxiosInstance.get("/user", { params: { email } });
  const user = res.data[0];

  if (!user) throw new Error("Email tidak ditemukan");
  if (user.password !== password) throw new Error("Password salah");

  return user;
};

export const register = async (data) => {
  const res = await AxiosInstance.post("/user", data);
  return res.data;
};

export const getAllUsers = async () => {
  return await AxiosInstance.get('/user');
};

export const getUserById = async (id) => {
  return await AxiosInstance.get(`/user/${id}`);
};

export const updateUser = async (id, data) => {
  return await AxiosInstance.put(`/user/${id}`, data);
};

export const deleteUser = async (id) => {
  return await AxiosInstance.delete(`/user/${id}`);
};
