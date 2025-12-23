import { useState, useEffect } from "react";
import Form from "../Layouts/Components/atoms/Form";
import Input from "../Layouts/Components/atoms/Input";
import Label from "../Layouts/Components/atoms/Label";
import Button from "../Layouts/Components/atoms/Button";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const MahasiswaModal = ({ isModalOpen, onClose, onSubmit, selectedMahasiswa, mahasiswa }) => {
  const [form, setForm] = useState({ nim: "", nama: "", status: true });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm(selectedMahasiswa);
    } else {
      setForm({ nim: "", nama: "", status: true });
    }
  }, [selectedMahasiswa]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi data tidak kosong
    if (!form.nim || !form.nama) {
      toastError("NIM dan Nama wajib diisi");
      return;
    }

    // Validasi NIM unique
    const isNimExist = mahasiswa.some(
      (mhs) => mhs.nim === form.nim && (!selectedMahasiswa || mhs.nim !== selectedMahasiswa.nim)
    );
    if (isNimExist) {
      toastError("NIM sudah terdaftar!");
      return;
    }

    onSubmit(form);
    onClose();
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
        </h3>
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="nim">NIM</Label>
            <Input
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              placeholder="Masukkan NIM"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="nama">Nama</Label>
            <Input
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="status">Status</Label>
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
              className="ml-2"
            />
            <span className="ml-2">Aktif</span>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              {selectedMahasiswa ? "Update" : "Tambah"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MahasiswaModal;
