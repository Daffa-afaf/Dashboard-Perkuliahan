export const NIM_PREFIX_TO_JURUSAN = {
  A11: 'Ilmu Komputer',
  A13: 'Teknik Elektro',
  B11: 'Ekonomi Manajemen',
  C11: 'Ilmu Hukum',
  D11: 'Kedokteran Umum',
};

export function getNimPrefix(nim = '') {
  // Example NIM: A11.2020.00861 -> prefix A11
  if (typeof nim !== 'string') return '';
  const part = nim.split('.')[0] || '';
  return part.toUpperCase();
}

export function mapNimToJurusan(nim = '', fallbackJurusan = '') {
  const prefix = getNimPrefix(nim);
  // Prioritas: prefix NIM dulu, baru fallback ke fakultas
  return NIM_PREFIX_TO_JURUSAN[prefix] || fallbackJurusan || '';
}

export function listAvailablePrefixesFromMahasiswa(list = []) {
  const set = new Set();
  list.forEach((m) => {
    const p = getNimPrefix(m?.nim);
    if (p) set.add(p);
  });
  return Array.from(set).sort();
}

// Mapping Fakultas -> Daftar Jurusan yang valid (simplified untuk demo)
export const FACULTAS_TO_JURUSAN = {
  Teknik: ['Teknik Elektro'],
  'Ilmu Komputer': ['Ilmu Komputer'],
  Ekonomi: ['Ekonomi Manajemen'],
  Hukum: ['Ilmu Hukum'],
  Kedokteran: ['Kedokteran Umum'],
};

export function allowedJurusanForFaculty(fakultas = '') {
  return FACULTAS_TO_JURUSAN[fakultas] || [];
}
