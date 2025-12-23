import { useState, useEffect } from "react";
import Form from "../Layouts/Components/atoms/Form";
import Input from "../Layouts/Components/atoms/Input";
import Label from "../Layouts/Components/atoms/Label";
import Button from "../Layouts/Components/atoms/Button";
import { useDosenList } from "../../Utils/Queries/useDosenQueries";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const MataKuliahModal = ({ matakuliah, onSave, onClose }) => {
  const [form, setForm] = useState({ kode: "", nama: "", sks: "", semester: "", jurusan: "", dosenId: "" });

  // Fetch all dosen
  const { data: dosenResult = { data: [] } } = useDosenList(1, 200);
  const allDosen = dosenResult.data || [];

  // Filter dosen berdasarkan jurusan yang dipilih
  const filteredDosen = form.jurusan 
    ? allDosen.filter((d) => d.jurusan === form.jurusan)
    : [];

  useEffect(() => {
    if (matakuliah) {
      setForm(matakuliah);
    } else {
      setForm({ kode: "", nama: "", sks: "", semester: "", jurusan: "", dosenId: "" });
    }
  }, [matakuliah]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset dosenId jika jurusan berubah
    if (name === "jurusan") {
      setForm({
        ...form,
        [name]: value,
        dosenId: "", // reset dosen selection
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi data tidak kosong
    if (!form.kode || !form.nama || !form.sks || !form.jurusan || !form.dosenId) {
      toastError("Semua field wajib diisi");
      return;
    }

    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {matakuliah ? "Edit Mata Kuliah" : "Tambah Mata Kuliah"}
        </h3>
        <Form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="kode">Kode</Label>
            <Input
              type="text"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              placeholder="Masukkan Kode"
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
            <Label htmlFor="sks">SKS</Label>
            <Input
              type="number"
              name="sks"
              value={form.sks}
              onChange={handleChange}
              placeholder="Masukkan SKS"
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="semester">Semester</Label>
            <select
              name="semester"
              value={form.semester}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="">Pilih Semester</option>
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <Label htmlFor="jurusan">Jurusan</Label>
            <select
              name="jurusan"
              value={form.jurusan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            >
              <option value="">Pilih Jurusan</option>
              <option value="Teknik Elektro">Teknik Elektro</option>
              <option value="Teknik Mesin">Teknik Mesin</option>
              <option value="Ilmu Komputer">Ilmu Komputer</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Ekonomi Manajemen">Ekonomi Manajemen</option>
              <option value="Ekonomi Akuntansi">Ekonomi Akuntansi</option>
              <option value="Ilmu Hukum">Ilmu Hukum</option>
              <option value="Kedokteran Umum">Kedokteran Umum</option>
            </select>
          </div>
          
          {/* Dosen - HANYA tampil dosen sesuai jurusan */}
          <div className="mb-4">
            <Label htmlFor="dosenId">Dosen Pengampu</Label>
            <select
              name="dosenId"
              value={form.dosenId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
              disabled={!form.jurusan}
            >
              <option value="">{form.jurusan ? 'Pilih Dosen' : 'Pilih Jurusan Dulu'}</option>
              {filteredDosen.map((dosen) => (
                <option key={dosen.id} value={dosen.id}>
                  {dosen.nama} ({dosen.pangkat})
                </option>
              ))}
            </select>
            {form.jurusan && filteredDosen.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Tidak ada dosen untuk jurusan ini</p>
            )}
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
              {matakuliah ? "Update" : "Tambah"}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default MataKuliahModal;
