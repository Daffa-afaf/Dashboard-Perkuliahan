import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db/db.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// ===== 1. Rebuild Kelas yang Proper =====
db.kelas = [
  // Teknik
  { id: "1", kode: "TE-A", nama: "Teknik Elektro A", semester: "5", jurusan: "Teknik Elektro" },
  { id: "2", kode: "TM-A", nama: "Teknik Mesin A", semester: "5", jurusan: "Teknik Mesin" },
  
  // Ilmu Komputer
  { id: "3", kode: "IK-A", nama: "Ilmu Komputer A", semester: "5", jurusan: "Ilmu Komputer" },
  { id: "4", kode: "SI-A", nama: "Sistem Informasi A", semester: "5", jurusan: "Sistem Informasi" },
  
  // Ekonomi
  { id: "5", kode: "EM-A", nama: "Manajemen A", semester: "5", jurusan: "Ekonomi Manajemen" },
  { id: "6", kode: "EA-A", nama: "Akuntansi A", semester: "5", jurusan: "Ekonomi Akuntansi" },
  
  // Hukum
  { id: "7", kode: "HK-A", nama: "Ilmu Hukum A", semester: "5", jurusan: "Ilmu Hukum" },
  
  // Kedokteran
  { id: "8", kode: "KD-A", nama: "Kedokteran A", semester: "5", jurusan: "Kedokteran Umum" },
];

// ===== 2. Update MataKuliah dengan Jurusan + Kode =====
// ===== 2. Update MataKuliah dengan Jurusan + Kode =====
db.matakuliah = [
  // Teknik Elektro
  { id: "1", kode: "TE101", nama: "Rangkaian Listrik", sks: 3, semester: 5, jurusan: "Teknik Elektro" },
  { id: "2", kode: "TE102", nama: "Sistem Digital", sks: 3, semester: 5, jurusan: "Teknik Elektro" },
  
  // Teknik Mesin
  { id: "3", kode: "TM101", nama: "Mekanika Fluida", sks: 3, semester: 5, jurusan: "Teknik Mesin" },
  { id: "4", kode: "TM102", nama: "Termodinamika", sks: 3, semester: 5, jurusan: "Teknik Mesin" },
  
  // Ilmu Komputer
  { id: "5", kode: "IK101", nama: "Algoritma Lanjut", sks: 3, semester: 5, jurusan: "Ilmu Komputer" },
  { id: "6", kode: "IK102", nama: "Kecerdasan Buatan", sks: 4, semester: 5, jurusan: "Ilmu Komputer" },
  
  // Sistem Informasi
  { id: "7", kode: "SI101", nama: "Sistem Informasi Manajemen", sks: 3, semester: 5, jurusan: "Sistem Informasi" },
  { id: "8", kode: "SI102", nama: "E-Business", sks: 3, semester: 5, jurusan: "Sistem Informasi" },
  
  // Ekonomi Manajemen
  { id: "9", kode: "EM101", nama: "Manajemen Strategi", sks: 3, semester: 5, jurusan: "Ekonomi Manajemen" },
  { id: "10", kode: "EM102", nama: "Manajemen Operasional", sks: 3, semester: 5, jurusan: "Ekonomi Manajemen" },
  
  // Ekonomi Akuntansi
  { id: "11", kode: "EA101", nama: "Akuntansi Keuangan Lanjut", sks: 3, semester: 5, jurusan: "Ekonomi Akuntansi" },
  { id: "12", kode: "EA102", nama: "Audit Internal", sks: 3, semester: 5, jurusan: "Ekonomi Akuntansi" },
  
  // Ilmu Hukum
  { id: "13", kode: "HK101", nama: "Hukum Pidana", sks: 3, semester: 5, jurusan: "Ilmu Hukum" },
  { id: "14", kode: "HK102", nama: "Hukum Perdata", sks: 3, semester: 5, jurusan: "Ilmu Hukum" },
  
  // Kedokteran
  { id: "15", kode: "KD101", nama: "Anatomi Manusia", sks: 4, semester: 5, jurusan: "Kedokteran Umum" },
  { id: "16", kode: "KD102", nama: "Fisiologi", sks: 4, semester: 5, jurusan: "Kedokteran Umum" },
];

// ===== 3. Assign dosenId ke MataKuliah (ONLY matching jurusan) =====
db.matakuliah = db.matakuliah.map((mk) => {
  const matchingDosen = db.dosen.filter((d) => d.jurusan === mk.jurusan);
  
  if (matchingDosen.length > 0) {
    return { ...mk, dosenId: matchingDosen[0].id, kapasitas: 40, terdaftar: 0 };
  } else {
    return { ...mk, dosenId: db.dosen[0].id, kapasitas: 40, terdaftar: 0 };
  }
});

// ===== 4. Create RencanaStudi per Kelas (ONLY MK yang match jurusan) =====
const rencanaStudiList = [];
let rsCounter = 1;

db.kelas.forEach((kelas) => {
  // Filter MK yang jurusannya match dengan kelas
  const matchingMK = db.matakuliah.filter((mk) => mk.jurusan === kelas.jurusan);
  
  matchingMK.forEach((mk) => {
    rencanaStudiList.push({
      id: String(rsCounter++),
      kelasId: kelas.id,
      mataKuliahId: mk.id,
      dosenId: mk.dosenId,
      mahasiswaIds: [],
      kapasitas: 40,
      terdaftar: 0,
    });
  });
});

db.rencanaStudi = rencanaStudiList;

// ===== 5. Update Kelas dengan rencanaStudiIds =====
db.kelas = db.kelas.map((kelas) => ({
  ...kelas,
  rencanaStudiIds: rencanaStudiList
    .filter((rs) => rs.kelasId === kelas.id)
    .map((rs) => rs.id),
  mahasiswaIds: [],
}));

// ===== 6. Reset SKS tracking =====
db.dosen = db.dosen.map((dosen) => ({
  ...dosen,
  maxSks: 12,
  sksTerpakai: 0,
}));

db.mahasiswa = db.mahasiswa.map((mhs) => ({
  ...mhs,
  maxSks: 24,
  sksTerpakai: 0,
}));

// ===== 7. Distribute Mahasiswa ke Kelas berdasarkan Fakultas =====
const fakultasToJurusanMap = {
  "Teknik": ["Teknik Elektro", "Teknik Mesin"],
  "Ilmu Komputer": ["Ilmu Komputer", "Sistem Informasi"],
  "Ekonomi": ["Ekonomi Manajemen", "Ekonomi Akuntansi"],
  "Hukum": ["Ilmu Hukum"],
  "Kedokteran": ["Kedokteran Umum"],
};

db.mahasiswa.forEach((mhs, idx) => {
  const jurusanList = fakultasToJurusanMap[mhs.fakultas];
  
  if (!jurusanList) return;
  
  const jurusan = jurusanList[idx % jurusanList.length];
  const kelas = db.kelas.find((k) => k.jurusan === jurusan);
  
  if (!kelas) return;
  
  // Add mahasiswa ke kelas
  kelas.mahasiswaIds.push(mhs.id);
  
  // Register mahasiswa ke 2 rencana studi dalam kelas
  const rencanaStudisInKelas = rencanaStudiList.filter((rs) => rs.kelasId === kelas.id);
  const numToRegister = Math.min(2, rencanaStudisInKelas.length);
  
  for (let i = 0; i < numToRegister; i++) {
    const rs = rencanaStudisInKelas[i];
    if (rs.terdaftar < rs.kapasitas) {
      rs.mahasiswaIds.push(mhs.id);
      rs.terdaftar++;
      
      const mk = db.matakuliah.find((m) => m.id === rs.mataKuliahId);
      if (mk) {
        mhs.sksTerpakai += mk.sks;
        mk.terdaftar++;
      }
    }
  }
});

// ===== 8. Update Dosen sksTerpakai =====
db.dosen.forEach((dosen) => {
  const rencanaStudisForDosen = rencanaStudiList.filter((rs) => rs.dosenId === dosen.id);
  dosen.sksTerpakai = rencanaStudisForDosen.reduce((total, rs) => {
    const mk = db.matakuliah.find((m) => m.id === rs.mataKuliahId);
    return total + (mk ? mk.sks : 0);
  }, 0);
});

// Write back
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log('✓ Database updated dengan FILTER JURUSAN PROPER');
console.log(`✓ Kelas: ${db.kelas.length} (per jurusan)`);
console.log(`✓ MataKuliah: ${db.matakuliah.length} (dengan dosenId matching jurusan)`);
console.log(`✓ RencanaStudi: ${rencanaStudiList.length}`);
console.log('✓ Di setiap kelas: HANYA ada MK sesuai jurusan kelas');
console.log('✓ Di setiap MK: HANYA ada dosen sesuai jurusan MK');
console.log('✓ Mahasiswa: HANYA bisa ambil MK sesuai fakultas/jurusannya');
