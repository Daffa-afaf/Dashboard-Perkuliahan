import { useState } from "react";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import Button from "../Layouts/Components/atoms/Button";
import Pagination from "../Layouts/Components/atoms/Pagination";
import MataKuliahTable from "./MataKuliahTable";
import MataKuliahModal from "./MataKuliahModal";

import { useMataKuliahList, useCreateMataKuliah, useUpdateMataKuliah, useDeleteMataKuliah } from "../../Utils/Queries/useMataKuliahQueries";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";
import { confirmDelete } from "../../Utils/Helpers/SwalHelpers";
import { hasPermission } from "../../Utils/Helpers/AuthHelpers";

const MataKuliah = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingMatakuliah, setEditingMatakuliah] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // React Query hooks with pagination
  const { data: result = { data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } }, isLoading, error } = useMataKuliahList(currentPage, pageSize);
  const matakuliah = result.data || [];
  const pagination = result.pagination || { currentPage: 1, totalPages: 0, totalItems: 0 };

  const createMut = useCreateMataKuliah();
  const updateMut = useUpdateMataKuliah();
  const deleteMut = useDeleteMataKuliah();

  const handleAdd = () => {
    setEditingMatakuliah(null);
    setShowModal(true);
  };

  const handleEdit = (matakuliah) => {
    setEditingMatakuliah(matakuliah);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmed = await confirmDelete("Apakah Anda yakin ingin menghapus mata kuliah ini?");
    if (confirmed) {
      try {
        await deleteMut.mutateAsync(id);
        toastSuccess("Mata kuliah berhasil dihapus");
      } catch (err) {
        toastError("Gagal menghapus mata kuliah");
      }
    }
  };

  const handleSave = async (matakuliahData) => {
    try {
      if (editingMatakuliah) {
        await updateMut.mutateAsync({ id: editingMatakuliah.id, data: matakuliahData });
        toastSuccess("Mata kuliah berhasil diperbarui");
      } else {
        await createMut.mutateAsync(matakuliahData);
        toastSuccess("Mata kuliah berhasil ditambahkan");
      }
      setShowModal(false);
      setEditingMatakuliah(null);
    } catch (err) {
      toastError("Gagal menyimpan mata kuliah");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMatakuliah(null);
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
          <Heading as="h2">Mata Kuliah</Heading>
          {hasPermission('write') && <Button onClick={handleAdd}>Tambah Mata Kuliah</Button>}
        </div>
        <MataKuliahTable
          matakuliah={matakuliah}
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
        <MataKuliahModal
          matakuliah={editingMatakuliah}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default MataKuliah;
