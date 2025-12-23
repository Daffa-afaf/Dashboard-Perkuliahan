import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import { getDosenById } from "../../Utils/Apis/DosenApi";
import { useRencanaStudiList } from "../../Utils/Queries/useRencanaStudiQueries";
import { useMataKuliahList } from "../../Utils/Queries/useMataKuliahQueries";
import { useKelasList } from "../../Utils/Queries/useKelasQueries";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const DosenDetail = () => {
  const { id } = useParams();
  const [dosen, setDosen] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch rencanaStudi untuk kalkulasi SKS
  const { data: rencanaStudiResult = { data: [] } } = useRencanaStudiList(1, 200);
  const rencanaStudiList = rencanaStudiResult.data || [];

  // Fetch matakuliah untuk info SKS
  const { data: mataKuliahResult = { data: [] } } = useMataKuliahList(1, 100);
  const mataKuliahList = mataKuliahResult.data || [];

  // Fetch kelas untuk info nama kelas
  const { data: kelasResult = { data: [] } } = useKelasList(1, 100);
  const kelasList = kelasResult.data || [];

  useEffect(() => {
    const fetchDosen = async () => {
      try {
        const res = await getDosenById(id);
        setDosen(res.data);
      } catch (err) {
        toastError("Gagal memuat data dosen");
      } finally {
        setLoading(false);
      }
    };
    fetchDosen();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!dosen) {
    return <p className="text-red-600">Data dosen tidak ditemukan.</p>;
  }

  // Hitung SKS terpakai dari rencanaStudi
  const rencanaStudisForDosen = rencanaStudiList.filter(
    (rs) => rs.dosenId === dosen.id
  );

  const sksTerpakai = rencanaStudisForDosen.reduce((total, rs) => {
    const mk = mataKuliahList.find((m) => m.id === rs.mataKuliahId);
    return total + (mk ? mk.sks : 0);
  }, 0);

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Dosen</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">NIDN</td>
            <td className="py-2 px-4">{dosen.nidn || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{dosen.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Email</td>
            <td className="py-2 px-4">{dosen.email || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Jurusan</td>
            <td className="py-2 px-4">{dosen.jurusan || "-"}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Pangkat</td>
            <td className="py-2 px-4">{dosen.pangkat || "-"}</td>
          </tr>
          <tr className="bg-blue-50 font-semibold">
            <td className="py-2 px-4 font-medium">SKS Terpakai / Max</td>
            <td className="py-2 px-4">
              <span className={sksTerpakai > dosen.maxSks ? "text-red-600" : "text-green-600"}>
                {sksTerpakai} / {dosen.maxSks || 12} SKS
              </span>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Daftar Kelas yang Diampu */}
      {rencanaStudisForDosen.length > 0 && (
        <div className="mt-6">
          <Heading as="h3" className="mb-3 text-sm">
            Kelas yang Diampu ({rencanaStudisForDosen.length})
          </Heading>
          <table className="table-auto text-xs w-full border">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-1 px-2 text-left">Kelas</th>
                <th className="py-1 px-2 text-left">Mata Kuliah</th>
                <th className="py-1 px-2 text-center">SKS</th>
                <th className="py-1 px-2 text-center">Peserta</th>
              </tr>
            </thead>
            <tbody>
              {rencanaStudisForDosen.map((rs) => {
                const mk = mataKuliahList.find((m) => m.id === rs.mataKuliahId);
                const kelas = kelasList.find((k) => k.id === rs.kelasId);
                return (
                  <tr key={rs.id} className="border-t">
                    <td className="py-1 px-2">{kelas?.nama}</td>
                    <td className="py-1 px-2">{mk?.nama}</td>
                    <td className="py-1 px-2 text-center">{mk?.sks}</td>
                    <td className="py-1 px-2 text-center">{rs.terdaftar}/{rs.kapasitas}</td>
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

export default DosenDetail;
