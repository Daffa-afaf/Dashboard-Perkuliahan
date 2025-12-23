import { useState, useMemo } from 'react';
import Button from '../Layouts/Components/atoms/Button';

const ModalRencanaStudi = ({ mataKuliah = [], dosen = [], onSave, onClose }) => {
  const [formData, setFormData] = useState({
    mataKuliahIds: [],
    dosenId: '',
    kelasNama: '',
    kelasKode: '',
    jurusan: '' // Tambah field jurusan
  });

  // Filter dosen berdasarkan jurusan yang dipilih
  const filteredDosen = useMemo(() => {
    if (!formData.jurusan) return [];
    return dosen.filter(d => d.jurusan === formData.jurusan);
  }, [dosen, formData.jurusan]);

  // Filter mata kuliah berdasarkan jurusan yang dipilih
  const filteredMataKuliah = useMemo(() => {
    if (!formData.jurusan) return [];
    return mataKuliah.filter(mk => mk.jurusan === formData.jurusan);
  }, [mataKuliah, formData.jurusan]);

  const handleChange = (e) => {
    const { name, value, options, multiple } = e.target;
    if (multiple && name === 'mataKuliahIds') {
      const vals = Array.from(options).filter(o => o.selected).map(o => o.value);
      setFormData((prev) => ({ ...prev, [name]: vals }));
      return;
    }
    // Reset mata kuliah dan dosen ketika jurusan berubah
    if (name === 'jurusan') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        mataKuliahIds: [],
        dosenId: ''
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.jurusan) {
      alert('Silakan pilih jurusan terlebih dahulu');
      return;
    }

    if (!formData.mataKuliahIds.length || !formData.dosenId) {
      alert('Silakan pilih minimal satu mata kuliah dan dosen');
      return;
    }

    onSave(formData);
    setFormData({ mataKuliahIds: [], dosenId: '', kelasNama: '', kelasKode: '', jurusan: '' });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4">
          <h2 className="text-lg font-bold">Buat Kelas Baru</h2>
          <p className="text-blue-100 text-sm mt-1">Tambahkan kelas baru untuk mata kuliah tertentu</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Jurusan Select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jurusan <span className="text-red-500">*</span>
            </label>
            <select
              name="jurusan"
              value={formData.jurusan}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih Jurusan --</option>
              <option value="Teknik Elektro">Teknik Elektro</option>
              <option value="Teknik Mesin">Teknik Mesin</option>
              <option value="Ilmu Komputer">Ilmu Komputer</option>
              <option value="Sistem Informasi">Sistem Informasi</option>
              <option value="Ekonomi Manajemen">Ekonomi Manajemen</option>
              <option value="Ekonomi Akuntansi">Ekonomi Akuntansi</option>
              <option value="Ilmu Hukum">Ilmu Hukum</option>
              <option value="Kedokteran Umum">Kedokteran Umum</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Pilih jurusan untuk memfilter mata kuliah dan dosen</p>
          </div>

          {/* Mata Kuliah (multi) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mata Kuliah (pilih 1 atau lebih) <span className="text-red-500">*</span>
            </label>
            <select
              name="mataKuliahIds"
              multiple
              value={formData.mataKuliahIds}
              onChange={handleChange}
              disabled={!formData.jurusan}
              className="w-full border border-gray-300 rounded px-3 py-2 h-32 overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              {filteredMataKuliah.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.nama} ({mk.sks} SKS)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {formData.jurusan 
                ? 'Tahan Ctrl (Windows) / Cmd (Mac) untuk memilih lebih dari satu.'
                : 'Pilih jurusan terlebih dahulu'}
            </p>
          </div>

          {/* Dosen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dosen Pengampu <span className="text-red-500">*</span>
            </label>
            <select
              name="dosenId"
              value={formData.dosenId}
              onChange={handleChange}
              disabled={!formData.jurusan}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">
                {formData.jurusan ? '-- Pilih Dosen --' : '-- Pilih jurusan terlebih dahulu --'}
              </option>
              {filteredDosen.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded mt-4">
            <p className="text-xs text-blue-900">
              <strong>Catatan:</strong> Kelas yang dibuat dapat diisi mahasiswa dengan maksimal 45 orang. 
              Setiap mahasiswa dapat mengambil maksimal 24 SKS per semester.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
            >
              Buat Kelas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;
