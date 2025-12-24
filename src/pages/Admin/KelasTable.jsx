import { useState } from "react";
import Button from "../Layouts/Components/atoms/Button";

const KelasTable = ({ kelas = [], openEditModal, onDelete, canEdit = true, canDelete = true, rencanaStudiList = [], mataKuliahList = [], dosenList = [] }) => {
  const [expandedKelas, setExpandedKelas] = useState(null);

  const handleDelete = (id) => {
    onDelete(id);
  };

  const toggleExpand = (id) => {
    setExpandedKelas(expandedKelas === id ? null : id);
  };

  const getRencanaStudiForKelas = (kelasId) => {
    return rencanaStudiList.filter((rs) => rs.kelasId === kelasId);
  };

  const getMataKuliahCount = (kelasData) => {
    // Get unique mata kuliah IDs from all students in this class
    if (!kelasData.mahasiswa || kelasData.mahasiswa.length === 0) return 0;
    
    const allMataKuliahIds = new Set();
    kelasData.mahasiswa.forEach(mhs => {
      if (mhs.mataKuliahIds && Array.isArray(mhs.mataKuliahIds)) {
        mhs.mataKuliahIds.forEach(id => allMataKuliahIds.add(id));
      }
    });
    
    return allMataKuliahIds.size;
  };

  const getMataKuliahDetails = (kelasData) => {
    // Get all unique mata kuliah for this class
    if (!kelasData.mahasiswa || kelasData.mahasiswa.length === 0) return [];
    
    const allMataKuliahIds = new Set();
    kelasData.mahasiswa.forEach(mhs => {
      if (mhs.mataKuliahIds && Array.isArray(mhs.mataKuliahIds)) {
        mhs.mataKuliahIds.forEach(id => allMataKuliahIds.add(id));
      }
    });
    
    return Array.from(allMataKuliahIds).map(mkId => 
      mataKuliahList.find(m => m.id === mkId)
    ).filter(Boolean);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-blue-600 text-white text-xs">
          <tr>
            <th className="py-2 px-3 text-left">Kode</th>
            <th className="py-2 px-3 text-left">Nama Kelas</th>
            <th className="py-2 px-3 text-center">Semester</th>
            <th className="py-2 px-3 text-center">MK</th>
            <th className="py-2 px-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-xs">
          {kelas.length > 0 ? (
            kelas.map((k, index) => {
              const mkCount = getMataKuliahCount(k);
              const mkDetails = getMataKuliahDetails(k);
              const isExpanded = expandedKelas === k.id;
              return (
                <>
                  <tr
                    key={k.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="py-1.5 px-3 font-medium">{k.kode}</td>
                    <td className="py-1.5 px-3">{k.nama}</td>
                    <td className="py-1.5 px-3 text-center">{k.semester}</td>
                    <td className="py-1.5 px-3 text-center">
                      <button
                        className="text-blue-600 hover:underline font-medium"
                        onClick={() => toggleExpand(k.id)}
                      >
                        {mkCount} {isExpanded ? "▼" : "▶"}
                      </button>
                    </td>
                    <td className="py-1.5 px-3 text-center space-x-1">
                      {canEdit && (
                        <Button
                          size="sm"
                          variant="warning"
                          onClick={() => openEditModal(k)}
                        >
                          Edit
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(k.id)}
                        >
                          Hapus
                        </Button>
                      )}
                    </td>
                  </tr>
                  {/* Expandable row */}
                  {isExpanded && (
                    <tr className="bg-blue-50">
                      <td colSpan="5" className="py-2 px-3">
                        <div className="text-xs space-y-1">
                          {mkDetails.length > 0 ? (
                            mkDetails.map((mk) => {
                              const dosen = dosenList.find((d) => d.id === mk?.dosenId);
                              return (
                                <div key={mk?.id} className="flex justify-between items-center bg-white px-2 py-1 rounded">
                                  <div>
                                    <span className="font-medium">{mk?.nama}</span>
                                    <span className="text-gray-500 ml-1">({mk?.sks} SKS)</span>
                                  </div>
                                  <div className="text-gray-600">
                                    Dosen: {dosen?.nama || 'Belum ada dosen'}
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-gray-500 text-center py-2">
                              Tidak ada mata kuliah
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          ) : (
            <tr>
              <td colSpan="5" className="py-4 px-3 text-center text-gray-500">
                Tidak ada data kelas
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default KelasTable;
