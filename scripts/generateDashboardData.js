/**
 * Generator untuk membuat dataset mahasiswa & dosen berdasarkan distribusi agregat
 * untuk keperluan screenshot dashboard yang realistis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Target distributions dari requirement
const TARGET_DATA = {
  students: [
    { id: 1, faculty: 'Teknik', count: 320 },
    { id: 2, faculty: 'Ekonomi', count: 210 },
    { id: 3, faculty: 'Kedokteran', count: 150 },
    { id: 4, faculty: 'Hukum', count: 180 },
    { id: 5, faculty: 'Ilmu Komputer', count: 260 }
  ],
  genderRatio: [
    { id: 1, gender: 'Laki-laki', count: 600 },
    { id: 2, gender: 'Perempuan', count: 520 } // Adjusted to match total 1120
  ],
  registrations: [
    { id: 1, year: 2020, total: 280 },
    { id: 2, year: 2021, total: 280 },
    { id: 3, year: 2022, total: 280 },
    { id: 4, year: 2023, total: 280 }
  ],
  gradeDistribution: [
    { subject: 'Teknik', A: 120, B: 100, C: 100 },
    { subject: 'Ekonomi', A: 70, B: 80, C: 60 },
    { subject: 'Kedokteran', A: 60, B: 50, C: 40 },
    { subject: 'Hukum', A: 70, B: 60, C: 50 },
    { subject: 'Ilmu Komputer', A: 100, B: 90, C: 70 }
  ],
  lecturerRanks: [
    { rank: 'Asisten Ahli', count: 30 },
    { rank: 'Lektor', count: 50 },
    { rank: 'Lektor Kepala', count: 40 },
    { rank: 'Profesor', count: 10 }
  ]
};

// Name pools
const FIRST_NAMES = {
  male: ['Andi', 'Budi', 'Candra', 'Dedi', 'Eka', 'Fahmi', 'Gilang', 'Hendra', 'Irwan', 'Joko', 'Kurnia', 'Lutfi', 'Mahendra', 'Nanda', 'Oscar', 'Prasetyo', 'Rizky', 'Samsul', 'Tono', 'Usman', 'Vino', 'Wahyu', 'Xavier', 'Yoga', 'Zulkifli', 'Arif', 'Bagas', 'Cahyo', 'Danu', 'Edi'],
  female: ['Ani', 'Bella', 'Citra', 'Dewi', 'Elsa', 'Fitri', 'Gita', 'Hani', 'Indah', 'Julia', 'Kiki', 'Lina', 'Maya', 'Novi', 'Olivia', 'Putri', 'Qori', 'Rina', 'Sari', 'Tina', 'Umi', 'Vina', 'Wulan', 'Yuni', 'Zahra', 'Ayu', 'Bela', 'Clara', 'Diah', 'Eva']
};

const LAST_NAMES = ['Wijaya', 'Santoso', 'Pratama', 'Kusuma', 'Firmansyah', 'Rahman', 'Putra', 'Hartono', 'Lestari', 'Cahyani', 'Sari', 'Dewi', 'Prasasti', 'Amalia', 'Permata', 'Nugroho', 'Setiawan', 'Hidayat', 'Gunawan', 'Saputra'];

const LECTURER_TITLES = ['Dr.', 'Prof.'];
const JURUSAN_LIST = ['Teknik Informatika', 'Sistem Informasi', 'Teknik Elektro', 'Teknik Mesin', 'Ekonomi Manajemen', 'Ekonomi Akuntansi', 'Ilmu Hukum', 'Kedokteran Umum', 'Ilmu Komputer'];

function generateName(gender) {
  const firstPool = gender === 'Laki-laki' ? FIRST_NAMES.male : FIRST_NAMES.female;
  const first = firstPool[Math.floor(Math.random() * firstPool.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${first} ${last}`;
}

function generateLecturerName() {
  const title = LECTURER_TITLES[Math.floor(Math.random() * LECTURER_TITLES.length)];
  const gender = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan';
  const name = generateName(gender);
  return `${title} ${name}`;
}

function generateMahasiswa() {
  const mahasiswaList = [];
  let nimCounter = 1;

  // Generate students for each faculty
  TARGET_DATA.students.forEach(facultyData => {
    const facultyName = facultyData.faculty;
    const count = facultyData.count;
    
    // Get grade distribution for this faculty
    const gradeInfo = TARGET_DATA.gradeDistribution.find(g => g.subject === facultyName);
    const grades = [];
    if (gradeInfo) {
      for (let i = 0; i < gradeInfo.A; i++) grades.push('A');
      for (let i = 0; i < gradeInfo.B; i++) grades.push('B');
      for (let i = 0; i < gradeInfo.C; i++) grades.push('C');
    }
    
    // Shuffle grades to mix distribution
    for (let i = grades.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [grades[i], grades[j]] = [grades[j], grades[i]];
    }
    
    // Distribute across years proportionally
    const yearDist = TARGET_DATA.registrations.map(r => ({
      year: r.year,
      count: Math.round((r.total / 1120) * count)
    }));

    // Distribute gender proportionally
    const maleCount = Math.round((600 / 1120) * count);
    const femaleCount = count - maleCount;

    // Create gender array
    const genders = [];
    for (let i = 0; i < maleCount; i++) genders.push('Laki-laki');
    for (let i = 0; i < femaleCount; i++) genders.push('Perempuan');
    
    // Shuffle genders to mix
    for (let i = genders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [genders[i], genders[j]] = [genders[j], genders[i]];
    }

    // Create year array
    const years = [];
    yearDist.forEach(yd => {
      for (let i = 0; i < yd.count; i++) years.push(yd.year);
    });
    
    // Fill remaining to match count
    while (years.length < count) years.push(2023);

    for (let i = 0; i < count; i++) {
      const year = years[i] || 2023;
      const gender = genders[i] || 'Laki-laki';
      const nilai = grades[i % grades.length] || 'B';

      // Generate entry
      const nim = `A11.${year}.${String(nimCounter).padStart(5, '0')}`;
      mahasiswaList.push({
        id: nim,
        nim: nim,
        nama: generateName(gender),
        fakultas: facultyName,
        gender: gender,
        tahun_masuk: year,
        nilai_akhir: nilai
      });
      nimCounter++;
    }
  });

  return mahasiswaList;
}

function generateDosen() {
  const dosenList = [];
  let nidnCounter = 1000000000;

  TARGET_DATA.lecturerRanks.forEach(rankData => {
    const pangkat = rankData.rank;
    const count = rankData.count;

    for (let i = 0; i < count; i++) {
      const nidn = String(nidnCounter++);
      const nama = generateLecturerName();
      const email = nama.toLowerCase().replace(/\s+/g, '.').replace('dr.', '').replace('prof.', '') + '@univ.ac.id';
      const jurusan = JURUSAN_LIST[Math.floor(Math.random() * JURUSAN_LIST.length)];

      dosenList.push({
        id: String(dosenList.length + 1),
        nidn: nidn,
        nama: nama,
        email: email,
        jurusan: jurusan,
        pangkat: pangkat
      });
    }
  });

  return dosenList;
}

function generateMataKuliah() {
  return [
    { id: '1', nama: 'Pemrograman Web', sks: 3, semester: 3 },
    { id: '2', nama: 'Basis Data', sks: 3, semester: 4 },
    { id: '3', nama: 'Algoritma dan Struktur Data', sks: 3, semester: 2 },
    { id: '4', nama: 'Pemrograman Berorientasi Objek', sks: 4, semester: 2 },
    { id: '5', nama: 'Sistem Operasi', sks: 3, semester: 3 },
    { id: '6', nama: 'Jaringan Komputer', sks: 3, semester: 4 },
    { id: '7', nama: 'Mobile Programming', sks: 3, semester: 5 },
    { id: '8', nama: 'Machine Learning', sks: 4, semester: 6 },
    { id: '9', nama: 'Keamanan Jaringan', sks: 3, semester: 5 },
    { id: '10', nama: 'Interaksi Manusia dan Komputer', sks: 2, semester: 3 },
    { id: '11', nama: 'Rekayasa Perangkat Lunak', sks: 3, semester: 5 },
    { id: '12', nama: 'Kecerdasan Buatan', sks: 4, semester: 6 }
  ];
}

function generateKelas() {
  return [
    { id: '1', kode: 'TI-3A', nama: 'Teknik Informatika 3A', semester: '5' },
    { id: '2', kode: 'TI-3B', nama: 'Teknik Informatika 3B', semester: '5' },
    { id: '3', kode: 'SI-4A', nama: 'Sistem Informasi 4A', semester: '7' },
    { id: '4', kode: 'TI-4A', nama: 'Teknik Informatika 4A', semester: '7' },
    { id: '5', kode: 'EK-2A', nama: 'Ekonomi 2A', semester: '3' },
    { id: '6', kode: 'HK-3A', nama: 'Hukum 3A', semester: '5' }
  ];
}

function generateUsers() {
  return [
    {
      id: '1',
      email: 'admin@email.com',
      password: '123456',
      name: 'Admin',
      role: 'admin',
      permissions: ['manage_users', 'read', 'write', 'delete']
    },
    {
      id: '2',
      email: 'user@email.com',
      password: '123456',
      name: 'User Demo',
      role: 'user',
      permissions: ['read']
    }
  ];
}

// Main execution
console.log(' Generating dashboard data...\n');

const mahasiswa = generateMahasiswa();
console.log(` Generated ${mahasiswa.length} mahasiswa records`);

const dosen = generateDosen();
console.log(` Generated ${dosen.length} dosen records`);

const matakuliah = generateMataKuliah();
console.log(` Generated ${matakuliah.length} mata kuliah records`);

const kelas = generateKelas();
console.log(` Generated ${kelas.length} kelas records`);

const user = generateUsers();
console.log(` Generated ${user.length} user records`);

// Compile database
const database = {
  mahasiswa,
  user,
  dosen,
  matakuliah,
  kelas
};

// Write to db.json
const dbPath = path.join(__dirname, '..', 'db', 'db.json');
fs.writeFileSync(dbPath, JSON.stringify(database, null, 2), 'utf8');

console.log(`\n Database written to: ${dbPath}`);
console.log('\n Summary:');
console.log(`   - Total Mahasiswa: ${mahasiswa.length}`);
console.log(`   - Total Dosen: ${dosen.length}`);
console.log(`   - Total Mata Kuliah: ${matakuliah.length}`);
console.log(`   - Total Kelas: ${kelas.length}`);
console.log(`   - Total Users: ${user.length}`);
console.log('\n Done! Restart json-server to load new data.\n');
