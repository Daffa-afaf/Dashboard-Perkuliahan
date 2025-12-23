import { Link } from "react-router-dom";
import Button from "../Layouts/Components/atoms/Button";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete, onDetail, canEdit = true, canDelete = true }) => {
  const handleDelete = (nim) => {
    onDelete(nim);
  };

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIM</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-center">Status</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {mahasiswa.map((mhs, index) => (
          <tr
            key={mhs.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{mhs.nim}</td>
            <td className="py-2 px-4">{mhs.nama}</td>
            <td className="py-2 px-4 text-center">
              <span className={`px-2 py-1 rounded text-xs ${mhs.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {mhs.status ? 'Aktif' : 'Tidak Aktif'}
              </span>
            </td>
            <td className="py-2 px-4 text-center space-x-2">
              <Link
                to={`/admin/mahasiswa/${mhs.nim}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Detail
              </Link>
              {canEdit && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(mhs)}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(mhs.nim)}
                >
                  Hapus
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;
