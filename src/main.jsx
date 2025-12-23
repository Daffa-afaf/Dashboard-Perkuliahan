import React from "react";
import "./App.css";
import ReactDOM from "react-dom/client";
import { Navigate, createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthLayout from "./pages/Layouts/AuthLayout";
import AdminLayout from "./pages/Layouts/AdminLayout";
import ProtectedRoute from "./pages/Layouts/Components/ProtectedRoute";
import PermissionRoute from "./pages/Layouts/Components/PermissionRoute";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Admin/Dashboard";
import Mahasiswa from "./pages/Admin/Mahasiswa";
import MahasiswaDetail from "./pages/Admin/MahasiswaDetail";
import Dosen from "./pages/Admin/Dosen";
import DosenDetail from "./pages/Admin/DosenDetail";
import MataKuliah from "./pages/Admin/MataKuliah";
import MataKuliahDetail from "./pages/Admin/MataKuliahDetail";
import Kelas from "./pages/Admin/Kelas";
import RencanaStudi from "./pages/Admin/RencanaStudi";
import Users from "./pages/Admin/Users";
import PageNotFound from "./pages/PageNotFound";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "mahasiswa",
        children: [
          {
            index: true,
            element: <Mahasiswa />,
          },
          {
            path: ":nim",
            element: <MahasiswaDetail />,
          },
        ],
      },
      {
        path: "dosen",
        children: [
          {
            index: true,
            element: <Dosen />,
          },
          {
            path: ":id",
            element: <DosenDetail />,
          },
        ],
      },
      {
        path: "matakuliah",
        children: [
          {
            index: true,
            element: <MataKuliah />,
          },
          {
            path: ":id",
            element: <MataKuliahDetail />,
          },
        ],
      },
      {
        path: "kelas",
        element: <Kelas />,
      },
      {
        path: "rencana-studi",
        element: <RencanaStudi />,
      },
      {
        path: "users",
        element: (
          <PermissionRoute requiredPermission="manage_users">
            <Users />
          </PermissionRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
