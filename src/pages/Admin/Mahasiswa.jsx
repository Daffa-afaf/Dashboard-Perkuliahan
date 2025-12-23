import { useState } from "react";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import Button from "../Layouts/Components/atoms/Button";
import Pagination from "../Layouts/Components/atoms/Pagination";
import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";

import { useMahasiswaList, useCreateMahasiswa, useUpdateMahasiswa, useDeleteMahasiswa } from "../../Utils/Queries/useMahasiswaQueries";
import { useKelasList } from "../../Utils/Queries/useKelasQueries";
import { hasPermission } from "../../Utils/Helpers/AuthHelpers";
import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // React Query hooks with pagination
  const { data: result = { data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } }, isLoading, error } = useMahasiswaList(currentPage, pageSize);
  const { data: kelasResult } = useKelasList(1, 100);
  const kelas = kelasResult?.data || [];
  
  // Compute status mahasiswa berdasarkan enrollment di kelas
  const mahasiswaWithStatus = (result.data || []).map((mhs) => {
    // Cek apakah mahasiswa terdaftar di kelas manapun
    const isEnrolled = kelas.some((k) => 
      (k.mahasiswaIds || []).includes(mhs.id) || 
      (k.mahasiswa || []).some((m) => 
        (typeof m === 'string' ? m === mhs.id : m.id === mhs.id)
      )
    );
    return {
      ...mhs,
      status: isEnrolled, // true = Aktif, false = Tidak Aktif
    };
  });
  
  const mahasiswa = mahasiswaWithStatus;
  const pagination = result.pagination || { currentPage: 1, totalPages: 0, totalItems: 0 };

  const createMut = useCreateMahasiswa();
  const updateMut = useUpdateMahasiswa();
  const deleteMut = useDeleteMahasiswa();

  const storeMahasiswa = async (newMahasiswa) => {
    try {
      await createMut.mutateAsync(newMahasiswa);
      toastSuccess("Data berhasil ditambahkan!");
      setIsModalOpen(false);
      setSelectedMahasiswa(null);
    } catch (err) {
      toastError("Gagal menambahkan data mahasiswa");
    }
  };

  const updateMahasiswa = async (updatedMahasiswa) => {
    try {
      await updateMut.mutateAsync({ id: updatedMahasiswa.id, data: updatedMahasiswa });
      toastSuccess("Data berhasil diupdate!");
    } catch (err) {
      toastError("Gagal mengupdate data mahasiswa");
    }
  };

  const deleteMahasiswa = async (idOrNim) => {
    try {
      await deleteMut.mutateAsync(idOrNim);
      toastSuccess("Data berhasil dihapus!");
    } catch (err) {
      toastError("Gagal menghapus data mahasiswa");
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setSelectedMahasiswa(null);
  };

  const openEditModal = (mhs) => {
    setIsModalOpen(true);
    setSelectedMahasiswa(mhs);
  };

  const handleSubmit = async (formData) => {
    if (selectedMahasiswa) {
      confirmUpdate(async () => {
        await updateMahasiswa(formData);
        setIsModalOpen(false);
        setSelectedMahasiswa(null);
      });
    } else {
      const exists = mahasiswa.find((m) => m.nim === formData.nim);
      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }
      await storeMahasiswa(formData);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      await deleteMahasiswa(id);
    });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-600 p-4">Error memuat data</p>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">Daftar Mahasiswa</Heading>
        {hasPermission('write') && <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>}
      </div>

      <MahasiswaTable
        mahasiswa={mahasiswa}
        openEditModal={openEditModal}
        onDelete={handleDelete}
        canEdit={hasPermission('write')}
        canDelete={hasPermission('write')}
      />

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
        mahasiswa={mahasiswa}
      />
    </Card>
  );
};

export default Mahasiswa;
