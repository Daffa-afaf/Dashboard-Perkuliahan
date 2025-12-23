/*
SCREENSHOT: Report 2 — Role & Permission
File: src/pages/Admin/UserModal.jsx
Purpose: Edit user form for role & permissions. Capture the modal
showing role select and permissions checkboxes when open.
*/

import { useState, useEffect } from "react";
import Form from "../Layouts/Components/atoms/Form";
import Input from "../Layouts/Components/atoms/Input";
import Label from "../Layouts/Components/atoms/Label";
import Button from "../Layouts/Components/atoms/Button";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const PERMISSIONS = [
  { key: "read", label: "Read" },
  { key: "write", label: "Write" },
  { key: "delete", label: "Delete" },
  { key: "manage_users", label: "Manage Users" },
];

const ROLES = ["user", "editor", "admin"];

const UserModal = ({ isOpen, onClose, onSave, user }) => {
  const [form, setForm] = useState({ name: "", email: "", role: "user", permissions: [] });

  useEffect(() => {
    if (user) setForm({
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
      permissions: user.permissions || [],
    });
    else setForm({ name: "", email: "", role: "user", permissions: [] });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const togglePermission = (key) => {
    setForm((prev) => {
      const has = prev.permissions.includes(key);
      return { ...prev, permissions: has ? prev.permissions.filter(p => p !== key) : [...prev.permissions, key] };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email) {
      toastError("Email wajib diisi");
      return;
    }
    onSave({ ...user, ...form });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">{user ? "Edit User" : "Tambah User"}</h3>
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="name">Nama</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="role">Role</Label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full border p-2 rounded">
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <Label>Permissions</Label>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSIONS.map(p => (
                <label key={p.key} className="flex items-center space-x-2">
                  <input type="checkbox" checked={form.permissions.includes(p.key)} onChange={() => togglePermission(p.key)} />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserModal;
