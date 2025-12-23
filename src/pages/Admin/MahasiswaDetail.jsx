import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import { getMahasiswaById, getMahasiswaByNim } from "../../Utils/Apis/MahasiswaApi";
import { useRencanaStudiList } from "../../Utils/Queries/useRencanaStudiQueries";
import { useMataKuliahList } from "../../Utils/Queries/useMataKuliahQueries";
import { useKelasList } from "../../Utils/Queries/useKelasQueries";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const MahasiswaDetail = () => {
  const { nim } = useParams();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch rencanaStudi untuk kalkulasi SKS
  const { data: rencanaStudiResult = { data: [] } } = useRencanaStudiList(1, 200);
  const rencanaStudiList = rencanaStudiResult.data || [];

  // Fetch matakuliah untuk info SKS
  const { data: mataKuliahResult = { data: [] } } = useMataKuliahList(1, 100);
  const mataKuliahList = mataKuliahResult.data || [];
  
  // Fetch kelas untuk status mahasiswa
  const { data: kelasResult } = useKelasList(1, 100);
  const kelas = kelasResult?.data || [];

  useEffect(() => {
    const fetchMahasiswa = async () => {
      try {
        // Try robust lookup by NIM
        const res = await getMahasiswaByNim(nim);
        setMahasiswa(res.data || null);
      } catch (err) {
        toastError("Gagal memuat data mahasiswa");
      } finally {
        setLoading(false);
      }
    };
    fetchMahasiswa();
  }, [nim]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!mahasiswa) {
    return <p className="text-red-600">Data mahasiswa tidak ditemukan.</p>;
  }

  // Hitung SKS terpakai dari rencanaStudi
  const rencanaStudisForMahasiswa = rencanaStudiList.filter(
    (rs) => rs.mahasiswaIds && rs.mahasiswaIds.includes(mahasiswa.id)
  );
  
  const sksTerpakai = rencanaStudisForMahasiswa.reduce((total, rs) => {
    const mk = mataKuliahList.find((m) => m.id === rs.mataKuliahId);
    return total + (mk ? mk.sks : 0);
  }, 0);
  
  // Hitung status mahasiswa berdasarkan enrollment di kelas
  const isEnrolled = kelas.some((k) => 
    (k.mahasiswaIds || []).includes(mahasiswa.id) || 
    (k.mahasiswa || []).some((m) => 
      (typeof m === 'string' ? m === mahasiswa.id : m.id === mahasiswa.id)
    )
  );
  const statusMahasiswa = isEnrolled;

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mahasiswa</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIM</td>
            <td className="py-2 px-4">{mahasiswa.nim}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mahasiswa.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Fakultas</td>
            <td className="py-2 px-4">{mahasiswa.fakultas || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Gender</td>
            <td className="py-2 px-4">{mahasiswa.gender || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Tahun Masuk</td>
            <td className="py-2 px-4">{mahasiswa.tahun_masuk || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Status</td>
            <td className="py-2 px-4">
              <span className={`px-2 py-1 rounded text-xs ${statusMahasiswa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {statusMahasiswa ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nilai Akhir</td>
            <td className="py-2 px-4">{mahasiswa.nilai_akhir || "-"}</td>
          </tr>
          <tr className="bg-blue-50 font-semibold">
            <td className="py-2 px-4 font-medium">SKS Terpakai / Max</td>
            <td className="py-2 px-4">
              <span className={sksTerpakai > mahasiswa.maxSks ? "text-red-600" : "text-green-600"}>
                {sksTerpakai} / {mahasiswa.maxSks || 24} SKS
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Daftar Mata Kuliah yang diambil */}
      {rencanaStudisForMahasiswa.length > 0 && (
        <div className="mt-6">
          <Heading as="h3" className="mb-3 text-sm">Mata Kuliah yang Diambil ({rencanaStudisForMahasiswa.length})</Heading>
          <table className="table-auto text-xs w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-1 px-2 text-left">Mata Kuliah</th>
                <th className="py-1 px-2 text-center">SKS</th>
                <th className="py-1 px-2 text-center">Semester</th>
              </tr>
            </thead>
            <tbody>
              {rencanaStudisForMahasiswa.map((rs) => {
                const mk = mataKuliahList.find((m) => m.id === rs.mataKuliahId);
                return (
                  <tr key={rs.id} className="border-t">
                    <td className="py-1 px-2">{mk?.nama}</td>
                    <td className="py-1 px-2 text-center">{mk?.sks}</td>
                    <td className="py-1 px-2 text-center">{mk?.semester}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default MahasiswaDetail;