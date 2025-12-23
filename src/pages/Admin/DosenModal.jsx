import { useState, useEffect } from "react";
import Form from "../Layouts/Components/atoms/Form";
import Input from "../Layouts/Components/atoms/Input";
import Label from "../Layouts/Components/atoms/Label";
import Button from "../Layouts/Components/atoms/Button";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const DosenModal = ({ isModalOpen, onClose, onSubmit, selectedDosen, dosen }) => {
  const [form, setForm] = useState({ nidn: "", nama: "", email: "", jurusan: "" });

  useEffect(() => {
    if (selectedDosen) {
      setForm(selectedDosen);
    } else {
      setForm({ nidn: "", nama: "", email: "", jurusan: "" });
    }
  }, [selectedDosen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi data tidak kosong
    if (!form.nidn || !form.nama || !form.email || !form.jurusan) {
      toastError("Semua field wajib diisi");
      return;
    }

    // Validasi NIDN unique
    const isNidnExist = dosen.some(
      (dsn) => dsn.nidn === form.nidn && (!selectedDosen || dsn.nidn !== selectedDosen.nidn)
    );
    if (isNidnExist) {
      toastError("NIDN sudah terdaftar!");
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
          {selectedDosen ? "Edit Dosen" : "Tambah Dosen"}
        </h3>
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="nidn">NIDN</Label>
            <Input
              type="text"
              name="nidn"
              value={form.nidn}
              onChange={handleChange}
              placeholder="Masukkan NIDN"
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
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Masukkan Email"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="jurusan">Jurusan</Label>
            <Input
              type="text"
              name="jurusan"
              value={form.jurusan}
              onChange={handleChange}
              placeholder="Masukkan Jurusan"
              required
            />
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
              {selectedDosen ? "Update" : "Tambah"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default DosenModal;
