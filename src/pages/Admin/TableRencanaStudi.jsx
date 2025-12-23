import Button from '../Layouts/Components/atoms/Button';
import { useState, useMemo } from 'react';
import { getNimPrefix, listAvailablePrefixesFromMahasiswa, allowedJurusanForFaculty, mapNimToJurusan } from '../../Utils/Helpers/NimHelpers';

const TableRencanaStudi = ({
  rencanaKelas = [],
  dosen = [],
  mahasiswa = [],
  mataKuliah = [],
  onEditDosen,
  onTambahMahasiswa,
  onHapusMahasiswa,
  onHapusKelas,
  hitungTotalSKS,
}) => {
  const [filters, setFilters] = useState({}); // { [kelasId]: { query: string, prefix: string } }
  const getMahasiswaNama = (id) => mahasiswa.find((m) => m.id === id)?.nama || 'Unknown';
  const getMahasiswaNim = (id) => mahasiswa.find((m) => m.id === id)?.nim || '';
  const getMahasiswaFakultas = (id) => mahasiswa.find((m) => m.id === id)?.fakultas || '';

  // Helper untuk mendapatkan jurusan dari kelas
  const getKelasJurusan = (rencana) => {
    // Cek dari rencana.jurusan (jika ada)
    if (rencana.jurusan) return rencana.jurusan;
    
    // Cek dari mataKuliahList pertama (jika ada)
    if (rencana.mataKuliahList && rencana.mataKuliahList.length > 0) {
      return rencana.mataKuliahList[0].jurusan || '';
    }
    
    // Cek dari mataKuliahId
    if (rencana.mataKuliahId) {
      const mk = mataKuliah.find(m => m.id === rencana.mataKuliahId);
      return mk?.jurusan || '';
    }
    
    return '';
  };

  return (
    <div className="space-y-6">
      {rencanaKelas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Belum ada kelas. Silakan tambahkan kelas baru.</p>
        </div>
      ) : (
        rencanaKelas.map((rencana) => (
          <div key={rencana.id} className="border rounded-lg overflow-hidden bg-gray-50">
            {/* Header Kelas */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold">
                    {rencana.mataKuliahNama ? rencana.mataKuliahNama : rencana.kelasNama}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    Kelas: {rencana.kelasNama || rencana.kelasKode || '-'} • SKS: {rencana.sks} | Kapasitas: {rencana.mahasiswa.length}/{rencana.kapasitas}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-100">Pengampu</p>
                  <p className="font-semibold">{rencana.dosenNama}</p>
                </div>
              </div>
            </div>

            {/* Konten Kelas */}
            <div className="p-4 space-y-4">
              {/* Edit Dosen */}
              <div className="bg-white p-4 rounded border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ubah Dosen Pengampu
                </label>
                <div className="flex gap-2">
                  <select
                    id={`dosen-${rencana.id}`}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue={rencana.dosenId || ''}
                  >
                    <option value="">-- Pilih Dosen --</option>
                    {dosen
                      .filter((d) => {
                        const kelasJurusan = getKelasJurusan(rencana);
                        // Hanya tampilkan dosen yang jurusannya sesuai dengan kelas
                        return kelasJurusan ? d.jurusan === kelasJurusan : true;
                      })
                      .map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.nama}
                        </option>
                      ))}
                  </select>
                  <Button
                    onClick={() => {
                      const dosenId = document.getElementById(`dosen-${rencana.id}`).value;
                      if (dosenId) {
                        onEditDosen(rencana.id, dosenId);
                      }
                    }}
                    size="sm"
                    variant="primary"
                  >
                    Update
                  </Button>
                </div>
              </div>

              {/* Tambah Mahasiswa */}
              <div className="bg-white p-4 rounded border border-gray-200">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tambah Mahasiswa
                </label>
                <div className="space-y-3">
                  {/* Mahasiswa Select */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Pilih Mahasiswa
                    </label>
                    <select
                      id={`mahasiswa-${rencana.id}`}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => {
                        // Update mata kuliah options berdasarkan mahasiswa yang dipilih
                        const mahasiswaId = e.target.value;
                        if (mahasiswaId) {
                          const m = mahasiswa.find(mhs => mhs.id === mahasiswaId);
                          const mkEl = document.getElementById(`mkselect-${rencana.id}`);
                          if (mkEl && m) {
                            // Clear previous selections
                            Array.from(mkEl.options).forEach(o => o.selected = false);
                          }
                        }
                      }}
                    >
                      <option value="">-- Pilih Mahasiswa --</option>
                      {mahasiswa
                        .filter((m) => {
                          const kelasJurusan = (rencana.mataKuliahList && rencana.mataKuliahList.length
                            ? rencana.mataKuliahList[0]?.jurusan
                            : (mataKuliah.find((x) => x.id === rencana.mataKuliahId)?.jurusan)) || rencana.jurusan || '';
                          const f = filters[rencana.id] || {};
                          const q = (f.query || '').toLowerCase();
                          const selectedPrefix = f.prefix || '';

                          const isNotEnrolled = !(rencana.mahasiswa || []).some((e) => e.id === m.id);
                          // Prioritas: NIM prefix dulu, baru fakultas
                          const mJurusan = mapNimToJurusan(m.nim || '', m.fakultas || m.jurusan || '');
                          const allowed = allowedJurusanForFaculty(m.fakultas || m.jurusan || '');
                          const isSameJurusan = kelasJurusan 
                            ? (mJurusan === kelasJurusan || allowed.includes(kelasJurusan))
                            : true;
                          const matchQuery = !q || (m.nama?.toLowerCase().includes(q) || m.nim?.toLowerCase().includes(q));
                          const mPrefix = getNimPrefix(m.nim || '');
                          const matchPrefix = !selectedPrefix || mPrefix === selectedPrefix;

                          return isNotEnrolled && isSameJurusan && matchQuery && matchPrefix;
                        })
                        .slice(0, 100)
                        .map((m) => {
                          const totalSKS = hitungTotalSKS(m.id);
                          // compute enrolled mata kuliah names for this student (across all classes)
                          const enrolledNames = rencanaKelas
                            .filter((rk) => (rk.mahasiswa || []).some((e) => e.id === m.id))
                            .map((rk) => {
                              // find student's entry in that class and map to mk names
                              const entry = (rk.mahasiswa || []).find((e) => e.id === m.id);
                              const names = (entry?.mataKuliahIds || []).map((mid) => {
                                return (rk.mataKuliahList || []).find((x) => x.id === mid)?.nama || '';
                              }).filter(Boolean);
                              return names.length ? names.join(', ') : (rk.mataKuliahNama || rk.kelasNama || 'Belum ada');
                            })
                            .filter(Boolean);
                          const enrolledLabel = enrolledNames.length > 0 ? enrolledNames.join(' | ') : 'Belum ada';
                          return (
                            <option key={m.id} value={m.id}>
                              {m.nama} ({m.nim}) - {m.fakultas} - {totalSKS} SKS - {enrolledLabel}
                            </option>
                          );
                        })}
                    </select>
                  </div>

                  {/* Mata Kuliah Multi-Select */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Pilih Mata Kuliah (multi - Ctrl/Cmd + klik)
                    </label>
                    <select
                      id={`mkselect-${rencana.id}`}
                      multiple
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm h-28 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
                      title="Pilih mata kuliah untuk mahasiswa (multi)"
                    >
                      {(() => {
                        // Filter mata kuliah berdasarkan mahasiswa yang dipilih
                        const selectedMahasiswaId = document.getElementById(`mahasiswa-${rencana.id}`)?.value;
                        const selectedMahasiswa = mahasiswa.find(m => m.id === selectedMahasiswaId);
                        
                        let availableMK = (rencana.mataKuliahList && rencana.mataKuliahList.length 
                          ? rencana.mataKuliahList 
                          : mataKuliah) || [];
                        
                        // Filter hanya mata kuliah yang sesuai jurusan mahasiswa
                        if (selectedMahasiswa) {
                          const mJurusan = mapNimToJurusan(selectedMahasiswa.nim || '', selectedMahasiswa.fakultas || selectedMahasiswa.jurusan || '');
                          const allowed = allowedJurusanForFaculty(selectedMahasiswa.fakultas || selectedMahasiswa.jurusan || '');
                          if (mJurusan) {
                            // Filter ke jurusan dari NIM prefix atau allowed list
                            availableMK = availableMK.filter(mk => mk.jurusan === mJurusan || allowed.includes(mk.jurusan));
                          } else if (allowed.length) {
                            availableMK = availableMK.filter(mk => allowed.includes(mk.jurusan));
                          }
                        }
                        
                        return availableMK.map((mk) => (
                          <option key={mk.id} value={mk.id}>{mk.nama} ({mk.sks} SKS)</option>
                        ));
                      })()}
                    </select>
                  </div>

                  {/* Tombol Tambah */}
                  <Button
                    onClick={() => {
                      const mahasiswaId = document.getElementById(`mahasiswa-${rencana.id}`).value;
                      const mkEl = document.getElementById(`mkselect-${rencana.id}`);
                      const selectedMKIds = mkEl ? Array.from(mkEl.selectedOptions).map(o => o.value) : [];
                      
                      if (!mahasiswaId) {
                        alert('Silakan pilih mahasiswa terlebih dahulu');
                        return;
                      }
                      
                      if (selectedMKIds.length === 0) {
                        alert('Silakan pilih minimal satu mata kuliah');
                        return;
                      }
                      
                      // Validasi jurusan berdasarkan NIM prefix atau fakultas
                      const selectedMahasiswa = mahasiswa.find(m => m.id === mahasiswaId);
                      const kelasJurusan = getKelasJurusan(rencana);
                      const mJurusan = selectedMahasiswa ? mapNimToJurusan(selectedMahasiswa.nim || '', selectedMahasiswa.fakultas || selectedMahasiswa.jurusan || '') : '';
                      const allowed = selectedMahasiswa ? allowedJurusanForFaculty(selectedMahasiswa.fakultas || selectedMahasiswa.jurusan || '') : [];
                      if (kelasJurusan && !(mJurusan === kelasJurusan || allowed.includes(kelasJurusan))) {
                        alert(`Mahasiswa dengan NIM ${selectedMahasiswa?.nim || '-'} (${mJurusan || selectedMahasiswa?.fakultas || '-'}) tidak dapat mengambil mata kuliah ${kelasJurusan}`);
                        return;
                      }
                      
                      if (mahasiswaId) {
                        onTambahMahasiswa(rencana.id, mahasiswaId, selectedMKIds);
                        document.getElementById(`mahasiswa-${rencana.id}`).value = '';
                        if (mkEl) {
                          Array.from(mkEl.options).forEach(o => o.selected = false);
                        }
                      }
                    }}
                    size="md"
                    variant="success"
                    className="w-full"
                  >
                    Tambah Mahasiswa
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Gunakan kolom cari dan filter prefix NIM untuk mempercepat pencarian. Daftar difilter berdasarkan jurusan kelas. Batas 24 SKS tetap divalidasi saat menambahkan.
                </p>
              </div>

              {/* Daftar Mahasiswa */}
              <div className="bg-white p-4 rounded border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Mahasiswa Terdaftar ({rencana.mahasiswa.length})
                </h4>
                {rencana.mahasiswa.length === 0 ? (
                  <p className="text-gray-500 text-sm">Belum ada mahasiswa</p>
                ) : (
                  <div className="space-y-2">
                    { (rencana.mahasiswa || []).map((entry) => {
                      const mahasiswaId = entry.id;
                      const m = mahasiswa.find((mah) => mah.id === mahasiswaId);
                      const totalSKS = hitungTotalSKS(mahasiswaId);
                      // get mata kuliah names for this student in this class
                      const names = (entry?.mataKuliahIds || []).map((mid) => {
                        return (rencana.mataKuliahList || []).find((x) => x.id === mid)?.nama || mataKuliah.find((x) => x.id === mid)?.nama || '';
                      }).filter(Boolean);
                      return (
                        <div
                          key={mahasiswaId}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded border border-gray-200"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{m?.nama}</p>
                            <p className="text-xs text-gray-600">{m?.nim} | Total SKS: {totalSKS}</p>
                            <p className="text-xs text-gray-500 mt-1">Mata Kuliah Terdaftar: {names.length ? names.join(', ') : 'Belum ada'}</p>
                          </div>
                          <Button
                            onClick={() => onHapusMahasiswa(rencana.id, mahasiswaId)}
                            size="sm"
                            variant="danger"
                          >
                            Hapus
                          </Button>
                        </div>
                      );
                    }) }
                  </div>
                )}
              </div>
            </div>

            {/* Footer Kelas */}
            <div className="bg-gray-100 px-4 py-3 flex justify-end">
              <Button
                onClick={() => onHapusKelas(rencana.id)}
                size="sm"
                variant="danger"
                disabled={rencana.mahasiswa.length > 0}
              >
                Hapus Kelas
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TableRencanaStudi;
