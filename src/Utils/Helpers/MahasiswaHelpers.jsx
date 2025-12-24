/**
 * Helper function untuk kalkulasi data mahasiswa dari rencana studi
 */

/**
 * Hitung total SKS dari rencana studi mahasiswa
 * @param {string} mahasiswaId - ID mahasiswa
 * @param {array} rencanaStudiList - Daftar rencana studi
 * @param {array} mataKuliahList - Daftar mata kuliah
 * @returns {number} Total SKS yang diambil
 */
export const calculateTotalSks = (mahasiswaId, rencanaStudiList, mataKuliahList) => {
  if (!mahasiswaId || !rencanaStudiList || !mataKuliahList) return 0;

  // Handle berbagai struktur data rencana studi
  const rencanaStudisForMahasiswa = rencanaStudiList.filter((rs) => {
    // Structure 1: mahasiswaIds array
    if (rs.mahasiswaIds && Array.isArray(rs.mahasiswaIds)) {
      return rs.mahasiswaIds.includes(mahasiswaId);
    }
    // Structure 2: mahasiswa object/array dengan id property
    if (rs.mahasiswa && Array.isArray(rs.mahasiswa)) {
      return rs.mahasiswa.some((m) =>
        typeof m === "string" ? m === mahasiswaId : m.id === mahasiswaId
      );
    }
    // Structure 3: direct mahasiswaId field
    if (rs.mahasiswaId === mahasiswaId) {
      return true;
    }
    return false;
  });

  return rencanaStudisForMahasiswa.reduce((total, rs) => {
    const mk = mataKuliahList.find((m) => m.id === rs.mataKuliahId);
    return total + (mk ? mk.sks : 0);
  }, 0);
};

/**
 * Hitung status mahasiswa berdasarkan enrollment di rencana studi
 * Status "Aktif" jika mahasiswa terdaftar di minimal 1 rencana studi dengan SKS > 0
 * @param {string} mahasiswaId - ID mahasiswa
 * @param {array} rencanaStudiList - Daftar rencana studi
 * @param {array} mataKuliahList - Daftar mata kuliah
 * @returns {boolean} Status aktif atau tidak
 */
export const calculateMahasiswaStatus = (mahasiswaId, rencanaStudiList, mataKuliahList) => {
  if (!mahasiswaId || !rencanaStudiList || !mataKuliahList) return false;

  const totalSks = calculateTotalSks(mahasiswaId, rencanaStudiList, mataKuliahList);
  return totalSks > 0;
};

/**
 * Hitung nilai akhir dari rencana studi mahasiswa
 * Nilai akhir adalah rata-rata dari semua nilai mata kuliah yang diambil
 * Jika belum ada nilai (null/undefined), tampilkan "-"
 * @param {string} mahasiswaId - ID mahasiswa
 * @param {array} rencanaStudiList - Daftar rencana studi
 * @returns {string} Nilai akhir (A/B/C/D/E) atau "-"
 */
export const calculateNilaiAkhir = (mahasiswaId, rencanaStudiList) => {
  if (!mahasiswaId || !rencanaStudiList) return "-";

  // Ambil rencana studi mahasiswa dengan berbagai struktur data
  const rencanaStudisForMahasiswa = rencanaStudiList.filter((rs) => {
    if (rs.mahasiswaIds && Array.isArray(rs.mahasiswaIds)) {
      return rs.mahasiswaIds.includes(mahasiswaId);
    }
    if (rs.mahasiswa && Array.isArray(rs.mahasiswa)) {
      return rs.mahasiswa.some((m) =>
        typeof m === "string" ? m === mahasiswaId : m.id === mahasiswaId
      );
    }
    if (rs.mahasiswaId === mahasiswaId) {
      return true;
    }
    return false;
  });

  // Filter rencana studi yang memiliki nilai
  // Handle struktur: grade, nilai, grades object, nilai object, dll
  const rencanaStudisWithGrade = rencanaStudisForMahasiswa.filter((rs) => {
    // Direct grade/nilai field
    if (rs.grade || rs.nilai) {
      return true;
    }
    // grades object: { mahasiswaId: grade }
    if (rs.grades && typeof rs.grades === "object") {
      return !!rs.grades[mahasiswaId];
    }
    // nilai object: { mahasiswaId: nilai }
    if (rs.nilai_per_mahasiswa && typeof rs.nilai_per_mahasiswa === "object") {
      return !!rs.nilai_per_mahasiswa[mahasiswaId];
    }
    return false;
  });

  if (rencanaStudisWithGrade.length === 0) {
    return "-";
  }

  // Hitung rata-rata nilai
  const gradeValues = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'E': 0.0,
  };

  const totalPoints = rencanaStudisWithGrade.reduce((sum, rs) => {
    let grade = null;
    
    // Ambil grade dari berbagai struktur
    if (rs.grades && typeof rs.grades === "object") {
      grade = rs.grades[mahasiswaId];
    } else if (rs.nilai_per_mahasiswa && typeof rs.nilai_per_mahasiswa === "object") {
      grade = rs.nilai_per_mahasiswa[mahasiswaId];
    } else {
      grade = rs.grade || rs.nilai;
    }
    
    return sum + (gradeValues[grade] || 0);
  }, 0);

  const averagePoints = totalPoints / rencanaStudisWithGrade.length;

  // Konversi kembali ke grade
  if (averagePoints >= 3.5) return 'A';
  if (averagePoints >= 2.5) return 'B';
  if (averagePoints >= 1.5) return 'C';
  if (averagePoints >= 0.5) return 'D';
  return 'E';
};

/**
 * Dapatkan rencana studi yang diambil mahasiswa
 * @param {string} mahasiswaId - ID mahasiswa
 * @param {array} rencanaStudiList - Daftar rencana studi
 * @returns {array} Array rencana studi untuk mahasiswa
 */
export const getRencanaStudisForMahasiswa = (mahasiswaId, rencanaStudiList) => {
  if (!mahasiswaId || !rencanaStudiList) return [];

  // Handle berbagai struktur data rencana studi
  return rencanaStudiList.filter((rs) => {
    // Structure 1: mahasiswaIds array
    if (rs.mahasiswaIds && Array.isArray(rs.mahasiswaIds)) {
      return rs.mahasiswaIds.includes(mahasiswaId);
    }
    // Structure 2: mahasiswa object/array dengan id property
    if (rs.mahasiswa && Array.isArray(rs.mahasiswa)) {
      return rs.mahasiswa.some((m) =>
        typeof m === "string" ? m === mahasiswaId : m.id === mahasiswaId
      );
    }
    // Structure 3: direct mahasiswaId field
    if (rs.mahasiswaId === mahasiswaId) {
      return true;
    }
    return false;
  });
};

/**
 * Validasi data mahasiswa
 * Cek apakah data mahasiswa konsisten dengan rencana studi
 * @param {object} mahasiswa - Data mahasiswa
 * @param {array} rencanaStudiList - Daftar rencana studi
 * @param {array} mataKuliahList - Daftar mata kuliah
 * @returns {object} Status validasi dan pesan
 */
export const validateMahasiswaData = (mahasiswa, rencanaStudiList, mataKuliahList) => {
  const calculatedSks = calculateTotalSks(mahasiswa.id, rencanaStudiList, mataKuliahList);
  const calculatedStatus = calculateMahasiswaStatus(mahasiswa.id, rencanaStudiList, mataKuliahList);
  const calculatedNilai = calculateNilaiAkhir(mahasiswa.id, rencanaStudiList);

  const issues = [];

  // Cek jika status aktif tapi SKS 0
  if (calculatedStatus && calculatedSks === 0) {
    issues.push('Status Aktif tapi SKS 0');
  }

  // Cek jika punya nilai tapi SKS 0
  if (calculatedNilai !== '-' && calculatedSks === 0) {
    issues.push('Memiliki Nilai akhir tapi SKS 0');
  }

  // Cek jika status tidak aktif tapi punya nilai
  if (!calculatedStatus && calculatedNilai !== '-') {
    issues.push('Status Tidak Aktif tapi memiliki nilai');
  }

  return {
    isValid: issues.length === 0,
    issues,
    calculatedSks,
    calculatedStatus,
    calculatedNilai,
  };
};
