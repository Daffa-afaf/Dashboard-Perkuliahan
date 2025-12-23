/*
SCREENSHOT: Report 2 — Role & Permission
File: src/pages/Admin/Users.jsx
Purpose: Users list UI (shows role & permissions). Capture list,
edit action, and the Users table for the report.
*/

import React, { useState } from "react";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import Button from "../Layouts/Components/atoms/Button";
import Pagination from "../Layouts/Components/atoms/Pagination";
import UserModal from "./UserModal";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";
import { useUsersList, useUpdateUser } from "../../Utils/Queries/useUsersQueries";
import { confirmDelete } from "../../Utils/Helpers/SwalHelpers";

const Users = () => {
  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // React Query hooks with pagination
  const { data: result = { data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } }, isLoading, error } = useUsersList(currentPage, pageSize);
  const users = result.data || [];
  const pagination = result.pagination || { currentPage: 1, totalPages: 0, totalItems: 0 };

  const updateMut = useUpdateUser();

  const openEdit = (user) => { 
    setEditingUser(user); 
    setShowModal(true); 
  };

  const handleSave = async (userData) => {
    try {
      await updateMut.mutateAsync({ id: userData.id, data: userData });
      toastSuccess("User berhasil diupdate");
      setShowModal(false);
      setEditingUser(null);
    } catch (err) {
      toastError("Gagal mengupdate user");
    }
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-600 p-4">Error memuat data</p>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2">User Management</Heading>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Permissions</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.id}</td>
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.role || 'user'}</td>
                <td className="px-4 py-2">{(u.permissions || []).join(', ')}</td>
                <td className="px-4 py-2">
                  <Button size="sm" onClick={() => openEdit(u)}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />

      {showModal && (
        <UserModal isOpen={showModal} onClose={() => { setShowModal(false); setEditingUser(null); }} onSave={handleSave} user={editingUser} />
      )}
    </Card>
  );
};

export default Users;
