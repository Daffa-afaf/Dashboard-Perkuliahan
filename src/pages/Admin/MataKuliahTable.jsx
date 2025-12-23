import React from "react";
import Button from "../Layouts/Components/atoms/Button";

const MataKuliahTable = ({ matakuliah, openEditModal, onDelete, canEdit = true, canDelete = true }) => {
  const list = matakuliah || [];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kode
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKS
            </th>
            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jurusan
            </th>
            <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {list.map((mk) => (
            <tr key={mk.id} className="hover:bg-gray-50">
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                {mk.kode}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                {mk.nama}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                {mk.sks}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                {mk.jurusan}
              </td>
              <td className="py-4 px-4 whitespace-nowrap text-center">
                {canEdit && (
                  <Button
                    onClick={() => openEditModal(mk)}
                    className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button
                    onClick={() => onDelete(mk.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs"
                  >
                    Hapus
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MataKuliahTable;
