/**
 * Script untuk populate database dengan contoh data Rencana Studi
 * Run di Node REPL atau browser console setelah load app
 * 
 * Gunakan untuk testing logika mahasiswa-rencana studi
 */

// Contoh data rencana studi untuk testing
const sampleRencanaStudi = [
  {
    id: "rs-001",
    kelasId: "1",
    mataKuliahId: "1",
    nama: "Rencana Studi Kelas 1 - MK 1",
    mahasiswaIds: ["A13.2020.00001", "A13.2020.00002", "A13.2020.00016"],
    // Nilai per mahasiswa (tambah field ini ke struktur database)
    grades: {
      "A13.2020.00001": "A",
      "A13.2020.00002": "B",
      "A13.2020.00016": "B"
    },
    terdaftar: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "rs-002",
    kelasId: "1",
    mataKuliahId: "2",
    nama: "Rencana Studi Kelas 1 - MK 2",
    mahasiswaIds: ["A13.2020.00001", "A13.2020.00002", "A13.2020.00016"],
    grades: {
      "A13.2020.00001": "B",
      "A13.2020.00002": "A",
      "A13.2020.00016": "C"
    },
    terdaftar: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "rs-003",
    kelasId: "1",
    mataKuliahId: "3",
    nama: "Rencana Studi Kelas 1 - MK 3",
    mahasiswaIds: ["A13.2020.00001", "A13.2020.00002"],
    grades: {
      "A13.2020.00001": "A", // Untuk Bela Putra
      "A13.2020.00002": "B"
    },
    terdaftar: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Contoh mahasiswa tanpa nilai (masih progress)
  {
    id: "rs-004",
    kelasId: "2",
    mataKuliahId: "4",
    nama: "Rencana Studi Kelas 2 - MK 4",
    mahasiswaIds: ["A13.2021.00081", "A13.2021.00082"],
    grades: {
      // Belum ada nilai untuk semester yang sedang berlangsung
    },
    terdaftar: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // Contoh mahasiswa dengan nilai sebagian
  {
    id: "rs-005",
    kelasId: "2",
    mataKuliahId: "5",
    nama: "Rencana Studi Kelas 2 - MK 5",
    mahasiswaIds: ["A13.2021.00081"],
    grades: {
      "A13.2021.00081": "A"
    },
    terdaftar: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Untuk testing, bisa paste data ini ke Postman dan POST ke:
 * POST /rencanaStudi (bulk insert)
 * 
 * Atau insert satu-satu:
 * 
 * Contoh request curl:
 * ```
 * curl -X POST http://localhost:3000/rencanaStudi \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "id": "rs-001",
 *     "kelasId": "1",
 *     "mataKuliahId": "1",
 *     "mahasiswaIds": ["A13.2020.00001", "A13.2020.00002"],
 *     "grades": {
 *       "A13.2020.00001": "A",
 *       "A13.2020.00002": "B"
 *     },
 *     "terdaftar": 2
 *   }'
 * ```
 */

// Untuk test lokal di browser console:
// Copy sampleRencanaStudi ke clipboard, lalu:
// 1. Open DevTools (F12)
// 2. Buka tab "Network"
// 3. Paste di console:

/*
// Mock test di browser
const testCalculateSks = () => {
  const rencanaStudiList = [
    {
      id: "rs-001",
      mataKuliahId: "1",
      mahasiswaIds: ["A13.2020.00001"]
    },
    {
      id: "rs-002",
      mataKuliahId: "2",
      mahasiswaIds: ["A13.2020.00001"]
    },
    {
      id: "rs-003",
      mataKuliahId: "3",
      mahasiswaIds: ["A13.2020.00001"]
    }
  ];

  const mataKuliahList = [
    { id: "1", nama: "Kalkulus", sks: 3, semester: 1 },
    { id: "2", nama: "Fisika", sks: 4, semester: 1 },
    { id: "3", nama: "Kimia", sks: 3, semester: 2 }
  ];

  // Expected: 3 + 4 + 3 = 10 SKS
  const result = calculateTotalSks("A13.2020.00001", rencanaStudiList, mataKuliahList);
  console.log("Total SKS:", result); // Should be 10
};
*/

/**
 * DATA REFERENCE untuk mata kuliah (dari db.json yang ada):
 * 
 * MK 1: "Aljabar Linear" - 3 SKS
 * MK 2: "Kalkulus I" - 4 SKS  
 * MK 3: "Fisika Dasar" - 3 SKS
 * MK 4: "Pemrograman Web" - 3 SKS
 * MK 5: "Basis Data" - 4 SKS
 * 
 * Jadi untuk "A13.2020.00001" (Bela Putra) dengan:
 * - rs-001 (MK 1): 3 SKS, Grade A
 * - rs-002 (MK 2): 4 SKS, Grade B
 * - rs-003 (MK 3): 3 SKS, Grade A
 * 
 * Total SKS: 3 + 4 + 3 = 10 SKS
 * Nilai Akhir: (A:4.0 + B:3.0 + A:4.0) / 3 = 11/3 = 3.67 ≈ A
 * Status: Aktif (ada SKS > 0)
 */

console.log(
  "%cDATA RENCANA STUDI UNTUK TESTING:\n\n",
  "color: blue; font-weight: bold; font-size: 14px"
);
console.log(JSON.stringify(sampleRencanaStudi, null, 2));

console.log(
  "%c\nUntuk insert ke database:\n1. POST /rencanaStudi dengan data di atas\n2. Atau manual edit db.json\n",
  "color: green; font-weight: bold"
);

// Export untuk use di test
if (typeof module !== "undefined" && module.exports) {
  module.exports = { sampleRencanaStudi };
}
