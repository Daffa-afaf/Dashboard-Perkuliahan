import { useState } from "react";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import Button from "../Layouts/Components/atoms/Button";
import Pagination from "../Layouts/Components/atoms/Pagination";
import KelasTable from "./KelasTable";
import KelasModal from "./KelasModal";

import { useKelasList, useCreateKelas, useUpdateKelas, useDeleteKelas } from "../../Utils/Queries/useKelasQueries";
import { useRencanaStudiList } from "../../Utils/Queries/useRencanaStudiQueries";
import { useMataKuliahList } from "../../Utils/Queries/useMataKuliahQueries";
import { useDosenList } from "../../Utils/Queries/useDosenQueries";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";
import { confirmDelete } from "../../Utils/Helpers/SwalHelpers";
import { hasPermission } from "../../Utils/Helpers/AuthHelpers";

const Kelas = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingKelas, setEditingKelas] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // React Query hooks with pagination
  const { data: result = { data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } }, isLoading, error } = useKelasList(currentPage, pageSize);
  const kelas = result.data || [];
  const pagination = result.pagination || { currentPage: 1, totalPages: 0, totalItems: 0 };

  // Fetch rencanaStudi for all kelas
  const { data: rencanaStudiResult = { data: [] } } = useRencanaStudiList(1, 100);
  const rencanaStudiList = rencanaStudiResult.data || [];

  // Fetch matakuliah and dosen for table display
  const { data: mataKuliahResult = { data: [] } } = useMataKuliahList(1, 100);
  const mataKuliahList = mataKuliahResult.data || [];

  const { data: dosenResult = { data: [] } } = useDosenList(1, 200);
  const dosenList = dosenResult.data || [];

  const createMut = useCreateKelas();
  const updateMut = useUpdateKelas();
  const deleteMut = useDeleteKelas();

  const handleAdd = () => {
    setEditingKelas(null);
    setShowModal(true);
  };

  const handleEdit = (kelasItem) => {
    setEditingKelas(kelasItem);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete("Apakah Anda yakin ingin menghapus kelas ini?");
    if (confirmed) {
      try {
        await deleteMut.mutateAsync(id);
        toastSuccess("Kelas berhasil dihapus");
      } catch (err) {
        toastError("Gagal menghapus kelas");
      }
    }
  };

  const handleSave = async (kelasData) => {
    try {
      if (editingKelas) {
        await updateMut.mutateAsync({ id: editingKelas.id, data: kelasData });
        toastSuccess("Kelas berhasil diperbarui");
      } else {
        await createMut.mutateAsync(kelasData);
        toastSuccess("Kelas berhasil ditambahkan");
      }
      setShowModal(false);
      setEditingKelas(null);
    } catch (err) {
      toastError("Gagal menyimpan kelas");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingKelas(null);
  };

  if (isLoading) {
    return <p className="p-4">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600 p-4">Error memuat data</p>;
  }

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Heading as="h2">Kelas</Heading>
          {hasPermission('write') && <Button onClick={handleAdd}>Tambah Kelas</Button>}
        </div>
        <KelasTable
          kelas={kelas}
          rencanaStudiList={rencanaStudiList}
          mataKuliahList={mataKuliahList}
          dosenList={dosenList}
          openEditModal={handleEdit}
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
      </Card>
      {showModal && (
        <KelasModal
          kelas={editingKelas}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Kelas;
