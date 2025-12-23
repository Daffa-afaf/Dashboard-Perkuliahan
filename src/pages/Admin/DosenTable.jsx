import { Link } from "react-router-dom";
import Button from "../Layouts/Components/atoms/Button";

const DosenTable = ({ dosen, openEditModal, onDelete, canEdit = true, canDelete = true }) => {
  const handleDelete = (id) => {
    onDelete(id);
  };

  return (
    <table className="w-full text-sm text-gray-700">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="py-2 px-4 text-left">NIDN</th>
          <th className="py-2 px-4 text-left">Nama</th>
          <th className="py-2 px-4 text-left">Email</th>
          <th className="py-2 px-4 text-left">Jurusan</th>
          <th className="py-2 px-4 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {dosen.map((dsn, index) => (
          <tr
            key={dsn.id}
            className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
          >
            <td className="py-2 px-4">{dsn.nidn}</td>
            <td className="py-2 px-4">{dsn.nama}</td>
            <td className="py-2 px-4">{dsn.email}</td>
            <td className="py-2 px-4">{dsn.jurusan}</td>
            <td className="py-2 px-4 text-center space-x-2">
              <Link
                to={`/admin/dosen/${dsn.id}`}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded"
              >
                Detail
              </Link>
              {canEdit && (
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => openEditModal(dsn)}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(dsn.id)}
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

export default DosenTable;
