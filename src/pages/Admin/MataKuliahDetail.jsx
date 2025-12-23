import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import { getMataKuliahById } from "../../Utils/Apis/MataKuliahApi";
import { toastError } from "../../Utils/Helpers/ToastHelpers";

const MataKuliahDetail = () => {
  const { id } = useParams();
  const [mataKuliah, setMataKuliah] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMataKuliah = async () => {
      try {
        const res = await getMataKuliahById(id);
        setMataKuliah(res.data);
      } catch (err) {
        toastError("Gagal memuat data mata kuliah");
      } finally {
        setLoading(false);
      }
    };
    fetchMataKuliah();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!mataKuliah) {
    return <p className="text-red-600">Data mata kuliah tidak ditemukan.</p>;
  }

  return (
    <Card>
      <Heading as="h2" className="mb-4 text-left">Detail Mata Kuliah</Heading>
      <table className="table-auto text-sm w-full">
        <tbody>
          <tr>
            <td className="py-2 px-4 font-medium">Kode</td>
            <td className="py-2 px-4">{mataKuliah.kode}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Nama</td>
            <td className="py-2 px-4">{mataKuliah.nama}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">SKS</td>
            <td className="py-2 px-4">{mataKuliah.sks}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 font-medium">Jurusan</td>
            <td className="py-2 px-4">{mataKuliah.jurusan}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default MataKuliahDetail;
