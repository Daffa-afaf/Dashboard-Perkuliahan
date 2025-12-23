import { useState, useEffect } from 'react';
import { getNimPrefix, mapNimToJurusan } from '../../Utils/Helpers/NimHelpers';
import Card from '../Layouts/Components/atoms/Card';
import Heading from '../Layouts/Components/atoms/Heading';
import Button from '../Layouts/Components/atoms/Button';
import TableRencanaStudi from './TableRencanaStudi';
import ModalRencanaStudi from './ModalRencanaStudi';
import { useMahasiswaList } from '../../Utils/Queries/useMahasiswaQueries';
import { useDosenList } from '../../Utils/Queries/useDosenQueries';
import { useMataKuliahList } from '../../Utils/Queries/useMataKuliahQueries';
import { useKelasList, useUpdateKelas } from '../../Utils/Queries/useKelasQueries';
import { hasPermission } from '../../Utils/Helpers/AuthHelpers';
import { confirmDelete } from '../../Utils/Helpers/SwalHelpers';
import { toastSuccess, toastError } from '../../Utils/Helpers/ToastHelpers';

const RencanaStudi = () => {
  const [showModal, setShowModal] = useState(false);
  const [rencanaKelas, setRencanaKelas] = useState([]);
  const [selectedJurusan, setSelectedJurusan] = useState(''); // Track jurusan terpilih

  // React Query hooks
  const { data: mahasiswaResult } = useMahasiswaList(1, 5000);
  const { data: dosenResult } = useDosenList(1, 100);
  const { data: mataKuliahResult } = useMataKuliahList(1, 100);
  const { data: kelasResult } = useKelasList(1, 100);
  const updateKelasMutation = useUpdateKelas();

  // Extract data
  const mahasiswa = mahasiswaResult?.data || [];
  const dosen = dosenResult?.data || [];
  const mataKuliah = mataKuliahResult?.data || [];
  const kelas = kelasResult?.data || [];

  // Initialize rencana studi dengan struktur yang lebih detail
  useEffect(() => {
    if (kelas.length > 0) {
      const rencana = kelas.map((k) => {
        // try to resolve mata kuliah from kelas if possible
        let matchedMK = null;
        if (k.mataKuliahId) {
          matchedMK = mataKuliah.find((mk) => mk.id === k.mataKuliahId);
        }
        if (!matchedMK) {
          // try to match by name heuristically
          const nameLower = (k.nama || '').toLowerCase();
          matchedMK = mataKuliah.find((mk) => {
            if (!mk.nama) return false;
            const mkLower = mk.nama.toLowerCase();
            return nameLower.includes(mkLower) || mkLower.includes(nameLower);
          });
        }

        // Get jurusan from kelas or from matched mata kuliah
        const kelasJurusan = k.jurusan || matchedMK?.jurusan || '';

        return {
          id: k.id,
          kelasId: k.id,
          kelasNama: k.nama || '',
          kelasKode: k.kode || '',
          jurusan: kelasJurusan, // Tambahkan field jurusan
          mataKuliahId: matchedMK ? matchedMK.id : null,
          mataKuliahNama: matchedMK ? matchedMK.nama : '',
          sks: matchedMK ? matchedMK.sks : k.sks || 3,
          dosenId: k.dosenId || null,
          dosenNama: k.dosenNama || 'Belum ditentukan',
          mataKuliahList: matchedMK ? [matchedMK] : [],
          // normalize mahasiswa entries to objects { id, mataKuliahIds }
          mahasiswa: (k.mahasiswa || []).map((m) => (typeof m === 'string' ? { id: m, mataKuliahIds: k.mataKuliahId ? [k.mataKuliahId] : [] } : (typeof m === 'object' ? m : { id: m, mataKuliahIds: [] }))),
          kapasitas: k.kapasitas || 45,
        };
      });
      setRencanaKelas(rencana);
    }
  }, [kelas, mataKuliah]);

  // Hitung total SKS mahasiswa berdasarkan mata kuliah yang dipilih pada setiap kelas
  const hitungTotalSKS = (mahasiswaId) => {
    let totalSKS = 0;
    rencanaKelas.forEach((rk) => {
      const entry = (rk.mahasiswa || []).find((e) => e.id === mahasiswaId);
      if (entry && Array.isArray(entry.mataKuliahIds)) {
        entry.mataKuliahIds.forEach((mkId) => {
          // cari SKS dari mataKuliahList kelas terlebih dahulu, lalu global
          const mkObj = (rk.mataKuliahList || []).find((m) => m.id === mkId) || mataKuliah.find((m) => m.id === mkId);
          if (mkObj) totalSKS += mkObj.sks || 0;
        });
      }
    });
    return totalSKS;
  };

  // Tambah kelas baru
  const handleTambahKelas = (data) => {
    const mkList = (data.mataKuliahIds || []).map((id) => mataKuliah.find((mk) => mk.id === id)).filter(Boolean);
    const sksTotalForClass = mkList.reduce((s, m) => s + (m.sks || 0), 0) || (mkList[0]?.sks || 3);

    const newKelas = {
      id: Date.now().toString(),
      kelasNama: data.kelasNama || (mkList[0]?.nama ? `${mkList[0].nama} - Kelas` : 'Kelas Baru'),
      kelasKode: data.kelasKode || '',
      mataKuliahList: mkList,
      mataKuliahId: mkList[0]?.id || null,
      mataKuliahNama: mkList[0]?.nama || '',
      sks: sksTotalForClass,
      dosenId: data.dosenId,
      dosenNama: dosen.find((d) => d.id === data.dosenId)?.nama || 'Belum ditentukan',
      mahasiswa: [],
      kapasitas: 45,
    };
    setRencanaKelas([...rencanaKelas, newKelas]);
    setShowModal(false);
    toastSuccess('Kelas baru berhasil ditambahkan');
  };

  // Edit dosen pada kelas
  const handleEditDosen = async (kelasId, dosenId) => {
    const dosenData = dosen.find((d) => d.id === dosenId);
    const kelasData = kelas.find((k) => k.id === kelasId);
    
    if (!kelasData) {
      toastError('Kelas tidak ditemukan');
      return;
    }

    try {
      // Update ke database
      await updateKelasMutation.mutateAsync({
        id: kelasId,
        data: {
          ...kelasData,
          dosenId,
          dosenNama: dosenData?.nama || 'Belum ditentukan',
        },
      });

      // Update state lokal
      setRencanaKelas(
        rencanaKelas.map((rk) =>
          rk.id === kelasId
            ? { ...rk, dosenId, dosenNama: dosenData?.nama || 'Belum ditentukan' }
            : rk
        )
      );
      toastSuccess('Dosen berhasil diubah');
    } catch (error) {
      toastError('Gagal mengubah dosen: ' + error.message);
    }
  };

  // Tambah mahasiswa ke kelas dengan pilihan mata kuliah (array of mk ids)
  const handleTambahMahasiswa = async (kelasId, mahasiswaId, selectedMKIds = []) => {
    const rencana = rencanaKelas.find((rk) => rk.id === kelasId);
    if (!rencana) return;

    // Validasi kapasitas (jumlah student entries)
    if ((rencana.mahasiswa || []).length >= rencana.kapasitas) {
      toastError('Kapasitas kelas penuh');
      return;
    }

    // Validasi duplikat
    if ((rencana.mahasiswa || []).some((e) => e.id === mahasiswaId)) {
      toastError('Mahasiswa sudah terdaftar di kelas ini');
      return;
    }

    // compute added SKS from selectedMKIds
    const addedSKS = (selectedMKIds || []).reduce((sum, id) => {
      const mkObj = (rencana.mataKuliahList || []).find((m) => m.id === id) || mataKuliah.find((m) => m.id === id);
      return sum + (mkObj?.sks || 0);
    }, 0);

    // Validasi SKS global
    const totalSKS = hitungTotalSKS(mahasiswaId);
    const newTotal = totalSKS + addedSKS;
    if (newTotal > 24) {
      toastError(
        `Mahasiswa sudah memiliki ${totalSKS} SKS. Menambah ${addedSKS} SKS akan melebihi batas maksimal 24 SKS`
      );
      return;
    }

    const newEntry = { id: mahasiswaId, mataKuliahIds: selectedMKIds };
    const kelasData = kelas.find((k) => k.id === kelasId);
    
    if (!kelasData) {
      toastError('Kelas tidak ditemukan');
      return;
    }

    try {
      // Prepare updated mahasiswa arrays
      const updatedMahasiswaArray = [...(rencana.mahasiswa || []), newEntry];
      const updatedMahasiswaIds = updatedMahasiswaArray.map((e) => e.id);

      // Update ke database
      await updateKelasMutation.mutateAsync({
        id: kelasId,
        data: {
          ...kelasData,
          mahasiswaIds: updatedMahasiswaIds,
          mahasiswa: updatedMahasiswaArray,
        },
      });

      // Update state lokal
      setRencanaKelas(
        rencanaKelas.map((rk) =>
          rk.id === kelasId
            ? { ...rk, mahasiswa: updatedMahasiswaArray }
            : rk
        )
      );
      toastSuccess('Mahasiswa berhasil ditambahkan');
    } catch (error) {
      toastError('Gagal menambahkan mahasiswa: ' + error.message);
    }
  };

  // Hapus mahasiswa dari kelas
  const handleHapusMahasiswa = async (kelasId, mahasiswaId) => {
    const confirmed = await confirmDelete(
      'Apakah Anda yakin ingin menghapus mahasiswa ini dari kelas?'
    );
    if (confirmed) {
      const rencana = rencanaKelas.find((rk) => rk.id === kelasId);
      const kelasData = kelas.find((k) => k.id === kelasId);
      
      if (!kelasData || !rencana) {
        toastError('Kelas tidak ditemukan');
        return;
      }

      try {
        // Prepare updated mahasiswa arrays
        const updatedMahasiswaArray = (rencana.mahasiswa || []).filter((entry) => entry.id !== mahasiswaId);
        const updatedMahasiswaIds = updatedMahasiswaArray.map((e) => e.id);

        // Update ke database
        await updateKelasMutation.mutateAsync({
          id: kelasId,
          data: {
            ...kelasData,
            mahasiswaIds: updatedMahasiswaIds,
            mahasiswa: updatedMahasiswaArray,
          },
        });

        // Update state lokal
        setRencanaKelas(
          rencanaKelas.map((rk) =>
            rk.id === kelasId
              ? {
                  ...rk,
                  mahasiswa: updatedMahasiswaArray,
                }
              : rk
          )
        );
        toastSuccess('Mahasiswa berhasil dihapus dari kelas');
      } catch (error) {
        toastError('Gagal menghapus mahasiswa: ' + error.message);
      }
    }
  };

  // Hapus kelas
  const handleHapusKelas = async (kelasId) => {
    const rencana = rencanaKelas.find((rk) => rk.id === kelasId);
    if (rencana && rencana.mahasiswa.length > 0) {
      toastError('Tidak dapat menghapus kelas yang masih memiliki mahasiswa');
      return;
    }

    const confirmed = await confirmDelete(
      'Apakah Anda yakin ingin menghapus kelas ini?'
    );
    if (confirmed) {
      setRencanaKelas(rencanaKelas.filter((rk) => rk.id !== kelasId));
      toastSuccess('Kelas berhasil dihapus');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Heading as="h1">Rencana Studi Mahasiswa</Heading>
          <p className="text-gray-600 text-sm mt-1">
            Kelola kelas, dosen, dan mahasiswa dengan validasi SKS otomatis
          </p>
        </div>
        {hasPermission('write') && (
          <Button onClick={() => setShowModal(true)} className="bg-blue-600 text-white">
            + Tambah Kelas
          </Button>
        )}
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Kelas</p>
            <p className="text-3xl font-bold text-blue-600">{rencanaKelas.length}</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Total Mahasiswa Terdaftar</p>
            <p className="text-3xl font-bold text-green-600">
              {rencanaKelas.reduce((sum, rk) => sum + (rk.mahasiswa || []).length, 0)}
            </p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-gray-600 text-sm">Kapasitas Terpakai</p>
            <p className="text-3xl font-bold text-yellow-600">
              {rencanaKelas.length > 0
                ? Math.round(
                    (rencanaKelas.reduce((sum, rk) => sum + (rk.mahasiswa || []).length, 0) /
                      (rencanaKelas.length * 45)) *
                      100
                  )
                : 0}
              %
            </p>
          </div>
        </Card>
      </div>

      {/* Tabel Rencana Studi */}
      <Card>
        <TableRencanaStudi
          rencanaKelas={rencanaKelas}
          dosen={dosen}
          mahasiswa={mahasiswa}
          mataKuliah={mataKuliah}
          onEditDosen={handleEditDosen}
          onTambahMahasiswa={handleTambahMahasiswa}
          onHapusMahasiswa={handleHapusMahasiswa}
          onHapusKelas={handleHapusKelas}
          hitungTotalSKS={hitungTotalSKS}
        />
      </Card>

      {/* Info SKS Mahasiswa - dengan filter per jurusan */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Total SKS per Mahasiswa (Filter Jurusan)</h3>
        <MahasiswaSKSPanel 
          mahasiswa={mahasiswa} 
          rencanaKelas={rencanaKelas}
          hitungTotalSKS={hitungTotalSKS}
          selectedJurusan={selectedJurusan}
          onSelectJurusan={setSelectedJurusan}
        />
      </Card>

      {/* Cari Mahasiswa (Ringkasan Kelas & Mata Kuliah) */}
      <Card>
        <h3 className="text-lg font-bold text-gray-800 mb-4">Cari Mahasiswa: Kelas & Mata Kuliah</h3>
        <SearchMahasiswaPanel mahasiswa={mahasiswa} rencanaKelas={rencanaKelas} />
      </Card>

      {/* Modal Tambah Kelas */}
      {showModal && (
        <ModalRencanaStudi
          mataKuliah={mataKuliah}
          dosen={dosen}
          onSave={handleTambahKelas}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default RencanaStudi;

// Sub-component: SearchMahasiswaPanel
function SearchMahasiswaPanel({ mahasiswa = [], rencanaKelas = [] }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const filtered = mahasiswa
    .filter((m) => !query || (m.nama?.toLowerCase().includes(query.toLowerCase()) || m.nim?.toLowerCase().includes(query.toLowerCase())))
    .slice(0, 20);

  const selected = mahasiswa.find((m) => m.id === selectedId) || filtered[0];

  const enrollment = [];
  rencanaKelas.forEach((rk) => {
    const entry = (rk.mahasiswa || []).find((e) => e.id === (selected?.id || ''));
    if (entry) {
      const mkNames = (entry.mataKuliahIds || []).map((mid) => {
        return (rk.mataKuliahList || []).find((x) => x.id === mid)?.nama || rk.mataKuliahNama || '';
      }).filter(Boolean);
      enrollment.push({
        kelas: rk.kelasNama || rk.kelasKode || '-',
        dosen: rk.dosenNama || '-',
        mk: mkNames.length ? mkNames.join(', ') : (rk.mataKuliahNama || '-'),
      });
    }
  });

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Cari Nama / NIM</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik minimal 2 karakter..."
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pilih Mahasiswa</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">(Top 20 hasil)</option>
            {filtered.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nama} ({m.nim}) - {m.fakultas}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selected ? (
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Mahasiswa:</span> {selected.nama} ({selected.nim}) • {selected.fakultas} • Prefix {getNimPrefix(selected.nim)}
            </p>
            <span className="text-xs text-gray-500">{enrollment.length} kelas</span>
          </div>
          <div className="mt-2 divide-y rounded border">
            {enrollment.length === 0 ? (
              <p className="text-sm text-gray-500 p-3">Belum terdaftar di kelas manapun.</p>
            ) : (
              enrollment.map((row, idx) => (
                <div key={idx} className="p-3 bg-white">
                  <p className="text-sm"><span className="font-semibold">Kelas:</span> {row.kelas}</p>
                  <p className="text-sm"><span className="font-semibold">Dosen:</span> {row.dosen}</p>
                  <p className="text-sm"><span className="font-semibold">Mata Kuliah:</span> {row.mk}</p>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// Sub-component: MahasiswaSKSPanel - dengan filter per jurusan
function MahasiswaSKSPanel({ mahasiswa = [], rencanaKelas = [], hitungTotalSKS, selectedJurusan, onSelectJurusan }) {
  // Daftar jurusan dengan prefix dan warna unik
  const JURUSAN_LIST = [
    { prefix: 'A11', nama: 'Ilmu Komputer', color: 'blue', bgColor: 'bg-blue-50' },
    { prefix: 'A13', nama: 'Teknik Elektro', color: 'purple', bgColor: 'bg-purple-50' },
    { prefix: 'B11', nama: 'Ekonomi Manajemen', color: 'amber', bgColor: 'bg-amber-50' },
    { prefix: 'C11', nama: 'Ilmu Hukum', color: 'red', bgColor: 'bg-red-50' },
    { prefix: 'D11', nama: 'Kedokteran Umum', color: 'green', bgColor: 'bg-green-50' },
  ];
  
  // Filter mahasiswa berdasarkan prefix yang dipilih
  const mahasiswaTerpilih = selectedJurusan 
    ? mahasiswa.filter((m) => getNimPrefix(m.nim || '') === selectedJurusan)
    : [];
  
  // Count mahasiswa per jurusan
  const countPerJurusan = JURUSAN_LIST.map((j) => ({
    ...j,
    count: mahasiswa.filter((m) => getNimPrefix(m.nim || '') === j.prefix).length,
  }));
  
  // Status warna berdasarkan kondisi SKS
  const getStatusColor = (totalSKS) => {
    if (totalSKS === 0) return 'bg-gray-100';
    if (totalSKS > 24) return 'bg-red-100';
    return 'bg-green-100';
  };
  
  const getStatusBadge = (totalSKS) => {
    if (totalSKS === 0) return { text: 'Belum Ada', classes: 'text-gray-700 bg-gray-200' };
    if (totalSKS > 24) return { text: 'Melebihi', classes: 'text-red-700 bg-red-200' };
    return { text: 'Normal', classes: 'text-green-700 bg-green-200' };
  };

  return (
    <div className="space-y-4">
      {/* Card Menu Jurusan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {countPerJurusan.map((j) => (
          <button
            key={j.prefix}
            onClick={() => onSelectJurusan(selectedJurusan === j.prefix ? '' : j.prefix)}
            style={{
              backgroundColor: selectedJurusan === j.prefix ? '#dcfce7' : '#f9fafb',
              borderColor: selectedJurusan === j.prefix ? '#22c55e' : '#e5e7eb',
              borderWidth: '2px',
              borderRadius: '0.5rem',
              padding: '1rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
            className="hover:bg-gray-100"
          >
            <p className="font-semibold text-gray-800 text-sm">{j.nama}</p>
            <p style={{ color: selectedJurusan === j.prefix ? '#000000' : '#1f2937' }} className="text-lg font-bold mt-1">
              {j.count}
            </p>
            <p className="text-xs text-gray-600 mt-1">Kode: {j.prefix}</p>
          </button>
        ))}
      </div>

      {/* Tampilan List Mahasiswa */}
      {selectedJurusan ? (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-semibold text-gray-700">
              Menampilkan {mahasiswaTerpilih.length} mahasiswa
            </p>
            <button
              onClick={() => onSelectJurusan('')}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Tutup Filter
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mahasiswaTerpilih.map((m) => {
              const totalSKS = hitungTotalSKS(m.id);
              const statusBadge = getStatusBadge(totalSKS);
              const bgColor = getStatusColor(totalSKS);

              return (
                <div key={m.id} className={`${bgColor} p-4 rounded-lg border border-gray-200`}>
                  <p className="font-semibold text-gray-800">{m.nama}</p>
                  <p className="text-sm text-gray-600">{m.nim}</p>
                  <p className="text-xs text-gray-500 mt-1">{m.fakultas}</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xl font-bold text-blue-600">{totalSKS} SKS</span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded ${statusBadge.classes}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            Klik card jurusan di atas untuk melihat mahasiswa dan SKS mereka
          </p>
        </div>
      )}
    </div>
  );
}
