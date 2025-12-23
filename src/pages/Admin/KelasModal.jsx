import { useState, useEffect } from "react";
import { toastError } from "../../Utils/Helpers/ToastHelpers";
import { useRencanaStudiByKelas } from "../../Utils/Queries/useRencanaStudiQueries";
import { useMataKuliahList } from "../../Utils/Queries/useMataKuliahQueries";
import { useDosenList } from "../../Utils/Queries/useDosenQueries";

const KelasModal = ({ kelas = null, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    kode: "",
    nama: "",
    semester: "",
  });

  // Fetch dependencies
  const { data: rencanaStudiData = [] } = useRencanaStudiByKelas(kelas?.id);
  const rencanaStudiList = Array.isArray(rencanaStudiData) ? rencanaStudiData : [];
  
  const { data: mataKuliahResult = {} } = useMataKuliahList(1, 100);
  const mataKuliahList = mataKuliahResult.data || [];
  
  const { data: dosenResult = {} } = useDosenList(1, 100);
  const dosenList = dosenResult.data || [];

  useEffect(() => {
    if (kelas) {
      setFormData({
        ...kelas,
        id: kelas.id || "",
      });
    }
  }, [kelas]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.kode.trim()) {
      toastError("Kode kelas harus diisi");
      return;
    }

    if (!formData.nama.trim()) {
      toastError("Nama kelas harus diisi");
      return;
    }

    if (!formData.semester) {
      toastError("Semester harus diisi");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-5 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-3">
          {kelas ? "Edit Kelas" : "Tambah Kelas"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1">Kode Kelas</label>
            <input
              type="text"
              name="kode"
              value={formData.kode}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              placeholder="Misal: K1A"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Nama Kelas</label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
              placeholder="Misal: Kelas 1A"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Semester</label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            >
              <option value="">Pilih Semester</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>

          {/* Mata Kuliah dalam Kelas */}
          {kelas && rencanaStudiList.length > 0 && (
            <div className="border-t pt-3 mt-3">
              <h3 className="text-xs font-semibold mb-2 text-gray-700">
                Mata Kuliah ({rencanaStudiList.length})
              </h3>
              <div className="space-y-1 max-h-32 overflow-y-auto text-xs">
                {rencanaStudiList.map((rs) => {
                  const mk = mataKuliahList.find((m) => m.id === rs.mataKuliahId);
                  const dosen = dosenList.find((d) => d.id === rs.dosenId);
                  return (
                    <div key={rs.id} className="bg-gray-50 px-2 py-1 rounded flex justify-between items-center">
                      <div>
                        <span className="font-medium">{mk?.nama}</span>
                        <span className="text-gray-500 ml-1">({mk?.sks} SKS)</span>
                      </div>
                      <div className="text-right text-gray-600">
                        <div>{dosen?.nama?.split(' ')[0]}</div>
                        <div>{rs.terdaftar}/{rs.kapasitas} mhs</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KelasModal;
