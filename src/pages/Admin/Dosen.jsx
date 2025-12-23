import { useState } from "react";
import Card from "../Layouts/Components/atoms/Card";
import Heading from "../Layouts/Components/atoms/Heading";
import Button from "../Layouts/Components/atoms/Button";
import Pagination from "../Layouts/Components/atoms/Pagination";
import DosenModal from "./DosenModal";
import DosenTable from "./DosenTable";

import { useDosenList, useCreateDosen, useUpdateDosen, useDeleteDosen } from "../../Utils/Queries/useDosenQueries";
import { hasPermission } from "../../Utils/Helpers/AuthHelpers";
import { confirmDelete, confirmUpdate } from "../../Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "../../Utils/Helpers/ToastHelpers";

const Dosen = () => {
  const [selectedDosen, setSelectedDosen] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // React Query hooks with pagination
  const { data: result = { data: [], pagination: { currentPage: 1, totalPages: 0, totalItems: 0 } }, isLoading, error } = useDosenList(currentPage, pageSize);
  const dosen = result.data || [];
  const pagination = result.pagination || { currentPage: 1, totalPages: 0, totalItems: 0 };

  const createMut = useCreateDosen();
  const updateMut = useUpdateDosen();
  const deleteMut = useDeleteDosen();

  const storeDosen = async (newDosen) => {
    try {
      await createMut.mutateAsync(newDosen);
      toastSuccess("Data berhasil ditambahkan!");
      setIsModalOpen(false);
      setSelectedDosen(null);
    } catch (err) {
      toastError("Gagal menambahkan data dosen");
    }
  };

  const updateDosen = async (updatedDosen) => {
    try {
      await updateMut.mutateAsync({ id: updatedDosen.id, data: updatedDosen });
      toastSuccess("Data berhasil diupdate!");
    } catch (err) {
      toastError("Gagal mengupdate data dosen");
    }
  };

  const deleteDosen = async (id) => {
    try {
      await deleteMut.mutateAsync(id);
      toastSuccess("Data berhasil dihapus!");
    } catch (err) {
      toastError("Gagal menghapus data dosen");
    }
  };

  const openAddModal = () => {
    setIsModalOpen(true);
    setSelectedDosen(null);
  };

  const openEditModal = (dosenItem) => {
    setIsModalOpen(true);
    setSelectedDosen(dosenItem);
  };

  const handleSubmit = async (formData) => {
    if (selectedDosen) {
      await updateDosen(formData);
      setIsModalOpen(false);
      setSelectedDosen(null);
    } else {
      const exists = dosen.find((d) => d.nidn === formData.nidn);
      if (exists) {
        toastError("NIDN sudah terdaftar!");
        return;
      }
      await storeDosen(formData);
      setIsModalOpen(false);
      setSelectedDosen(null);
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      await deleteDosen(id);
    });
  };

  if (isLoading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="text-red-600 p-4">Error memuat data</p>;

  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <Heading as="h2" className="mb-0 text-left">Daftar Dosen</Heading>
        {hasPermission('write') && <Button onClick={openAddModal}>+ Tambah Dosen</Button>}
      </div>

      <DosenTable
        dosen={dosen}
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

      <DosenModal
        isModalOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedDosen={selectedDosen}
        dosen={dosen}
      />
    </Card>
  );
};

export default Dosen;
