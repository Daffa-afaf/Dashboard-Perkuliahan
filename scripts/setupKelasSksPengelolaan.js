import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, '../db/db.json');

const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// ===== 1. Update dosen dengan maxSks dan sksTerpakai =====
db.dosen = db.dosen.map((dosen, idx) => ({
  ...dosen,
  maxSks: 12, // standard dosen bisa max 12 SKS per semester
  sksTerpakai: 0, // akan di-update saat assign ke rencanaStudi
}));

// ===== 2. Update mahasiswa dengan maxSks dan sksTerpakai =====
db.mahasiswa = db.mahasiswa.map((mhs) => ({
  ...mhs,
  maxSks: 24, // standard mahasiswa bisa max 24 SKS per semester
  sksTerpakai: 0, // akan di-update saat register rencanaStudi
}));

// ===== 3. Add dosenId ke matakuliah =====
db.matakuliah = db.matakuliah.map((mk, idx) => {
  // Assign dosen dari list dosen, round-robin
  const dosenIdx = idx % db.dosen.length;
  return {
    ...mk,
    dosenId: String(db.dosen[dosenIdx].id), // constraint: 1 mataKuliah = 1 dosen
  };
});

// ===== 4. Create rencanaStudi collection =====
// rencanaStudi = relasi antara Kelas, MataKuliah, Dosen, dan daftar Mahasiswa
const rencanaStudiList = [];
let rsCounter = 1;

// For each kelas, assign 3-5 mata kuliah
db.kelas.forEach((kelas) => {
  // Pilih mata kuliah berdasarkan semester kelas
  const mataKuliahForSemester = db.matakuliah.filter(
    (mk) => mk.semester == kelas.semester || mk.semester == parseInt(kelas.semester) - 1
  );

  // Ambil 3-4 mata kuliah unik
  const selectedMK = mataKuliahForSemester.slice(0, Math.min(4, mataKuliahForSemester.length));

  selectedMK.forEach((mk) => {
    const dosen = db.dosen.find((d) => d.id == mk.dosenId);
    const rencanaStudi = {
      id: String(rsCounter++),
      kelasId: kelas.id,
      mataKuliahId: mk.id,
      dosenId: mk.dosenId,
      mahasiswaIds: [], // akan di-populate saat mahasiswa register
      kapasitas: 40, // max mahasiswa per kelas per mata kuliah
      terdaftar: 0,
    };
    rencanaStudiList.push(rencanaStudi);
  });
});

db.rencanaStudi = rencanaStudiList;

// ===== 5. Update kelas dengan rencanaStudiIds =====
db.kelas = db.kelas.map((kelas) => ({
  ...kelas,
  rencanaStudiIds: rencanaStudiList
    .filter((rs) => rs.kelasId === kelas.id)
    .map((rs) => rs.id),
  mahasiswaIds: [], // akan di-populate saat mahasiswa join kelas
}));

// ===== 6. Populate sample mahasiswa ke kelas dan rencanaStudi =====
// Distribute mahasiswa ke kelas berdasarkan semester/tahun_masuk
const tahunSekarang = new Date().getFullYear();
db.mahasiswa.forEach((mhs) => {
  // Cari kelas yang cocok berdasarkan semester/tahun_masuk
  const kelas = db.kelas.find((k) => {
    const tahunExpectGraduation = mhs.tahun_masuk + 4; // 4 tahun studi
    const semesterCurrent = (tahunSekarang - mhs.tahun_masuk) * 2 + 1;
    return parseInt(k.semester) >= semesterCurrent && parseInt(k.semester) <= semesterCurrent + 1;
  });

  if (kelas) {
    // Add mahasiswa ke kelas
    if (!kelas.mahasiswaIds) kelas.mahasiswaIds = [];
    kelas.mahasiswaIds.push(mhs.id);

    // Add mahasiswa ke 2-3 rencanaStudi dalam kelas
    const rencanaStudisInKelas = rencanaStudiList.filter((rs) => rs.kelasId === kelas.id);
    const numToRegister = Math.min(3, rencanaStudisInKelas.length);
    for (let i = 0; i < numToRegister; i++) {
      const rs = rencanaStudisInKelas[i];
      if (rs.terdaftar < rs.kapasitas) {
        rs.mahasiswaIds.push(mhs.id);
        rs.terdaftar++;

        // Update mahasiswa sksTerpakai
        const mataKuliah = db.matakuliah.find((mk) => mk.id === rs.mataKuliahId);
        if (mataKuliah) {
          mhs.sksTerpakai += mataKuliah.sks;
        }
      }
    }
  }
});

// ===== 7. Update dosen sksTerpakai =====
db.dosen.forEach((dosen) => {
  const rencanaStudisForDosen = rencanaStudiList.filter((rs) => rs.dosenId === dosen.id);
  dosen.sksTerpakai = rencanaStudisForDosen.reduce((total, rs) => {
    const mk = db.matakuliah.find((m) => m.id === rs.mataKuliahId);
    return total + (mk ? mk.sks : 0);
  }, 0);
});

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
console.log('✓ Database updated dengan rencanaStudi, SKS tracking, dan dosenId di matakuliah');
console.log(`✓ Created ${rencanaStudiList.length} rencanaStudi entries`);
console.log(`✓ Distributed mahasiswa across kelas dan rencanaStudi`);
