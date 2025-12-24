# PANDUAN INTEGRASI - Rencana Studi ke Database

## 📌 Langkah-Langkah Implementasi

### Tahap 1: Update Struktur Database

#### A. Modifikasi `db.json`
Tambahkan atau update collection `rencanaStudi` dengan struktur berikut:

```json
{
  "rencanaStudi": [
    {
      "id": "rs-001",
      "kelasId": "1",
      "mataKuliahId": "1",
      "mahasiswaIds": ["A13.2020.00001", "A13.2020.00002"],
      "grades": {
        "A13.2020.00001": "A",
        "A13.2020.00002": "B"
      },
      "terdaftar": 2,
      "createdAt": "2025-12-24T00:00:00Z",
      "updatedAt": "2025-12-24T00:00:00Z"
    }
  ]
}
```

#### B. Penjelasan Field
- `id`: Unique identifier untuk rencana studi
- `kelasId`: Referensi ke kelas
- `mataKuliahId`: Referensi ke mata kuliah
- `mahasiswaIds[]`: Array ID mahasiswa yang mengambil
- `grades`: Object mapping `mahasiswaId -> gradeValue`
  - Contoh: `"A13.2020.00001": "A"` = Bela Putra dapat nilai A
- `terdaftar`: Jumlah mahasiswa yang terdaftar (= length of mahasiswaIds)

### Tahap 2: Test Data Insertion

#### Option A: Manual Edit db.json
```bash
# 1. Buka file db.json
# 2. Cari atau tambah array "rencanaStudi": []
# 3. Tambahkan data dari populateRencanaStudiData.js
# 4. Save file
```

#### Option B: Via Postman / API Call
```
POST /rencanaStudi
Content-Type: application/json

{
  "id": "rs-001",
  "kelasId": "1",
  "mataKuliahId": "1",
  "mahasiswaIds": ["A13.2020.00001", "A13.2020.00002"],
  "grades": {
    "A13.2020.00001": "A",
    "A13.2020.00002": "B"
  },
  "terdaftar": 2
}
```

#### Option C: Via Browser Console
```javascript
// Import helper jika sudah di-load
import { sampleRencanaStudi } from './scripts/populateRencanaStudiData.js';

// Bulk insert (perlu API support)
sampleRencanaStudi.forEach(rs => {
  fetch('/rencanaStudi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rs)
  });
});
```

### Tahap 3: Testing

#### Step 1: Akses Detail Mahasiswa
```
Navigate to: Admin > Mahasiswa > Detail Mahasiswa
```

#### Step 2: Verify Data untuk Bela Putra (A13.2020.00001)
```
Expected dengan sample data:
- NIM: A13.2020.00001
- Nama: Bela Putra
- Status: Aktif (hijau) ✓
- SKS Terpakai: 10 / 24 SKS ✓ (3 mata kuliah × SKS)
- Nilai Akhir: A ✓ (rata-rata dari 3 nilai)

Tabel Mata Kuliah:
┌─────────────────┬─────┬──────────┬───────┐
│ Mata Kuliah     │ SKS │ Semester │ Nilai │
├─────────────────┼─────┼──────────┼───────┤
│ Aljabar Linear  │ 3   │ 1        │ A     │
│ Kalkulus I      │ 4   │ 1        │ B     │
│ Fisika Dasar    │ 3   │ 2        │ A     │
└─────────────────┴─────┴──────────┴───────┘
```

#### Step 3: Test Mahasiswa Tanpa Nilai (A13.2021.00081)
```
Expected:
- Status: Aktif (hijau)
- SKS Terpakai: 7 / 24 SKS
- Nilai Akhir: "Menunggu nilai" (italic gray)

Tabel Mata Kuliah:
┌──────────────────────┬─────┬──────────┬───────────────┐
│ Mata Kuliah          │ SKS │ Semester │ Nilai         │
├──────────────────────┼─────┼──────────┼───────────────┤
│ Pemrograman Web      │ 3   │ 3        │ Menunggu      │
│ Basis Data           │ 4   │ 3        │ Menunggu      │
└──────────────────────┴─────┴──────────┴───────────────┘
```

#### Step 4: Test Mahasiswa Tidak Aktif
```
Navigate ke mahasiswa tanpa rencana studi (misal: A13.2023.00241)

Expected:
- Status: Tidak Aktif (merah)
- SKS Terpakai: 0 / 24 SKS (abu-abu)
- Nilai Akhir: "Tidak ada data" (italic gray)
- Tabel Mata Kuliah: (kosong)
```

## 🔧 API Endpoints yang Digunakan

### GET Endpoints (Read-only)
```
GET /rencanaStudi              # List semua rencana studi (paging)
GET /rencanaStudi/{id}         # Detail rencana studi
GET /rencanaStudi?kelasId={id} # Filter by kelas
```

### Expected Response Format
```json
{
  "data": [
    {
      "id": "rs-001",
      "kelasId": "1",
      "mataKuliahId": "1",
      "mahasiswaIds": ["A13.2020.00001"],
      "grades": {
        "A13.2020.00001": "A"
      },
      "terdaftar": 1
    }
  ]
}
```

## 📋 Checklist Integrasi

### Database Setup
- [ ] Struct rencanaStudi ditambah di db.json
- [ ] Sample data sudah diinsert (minimal 3 rencana studi)
- [ ] Mahasiswa terlibat sudah ada di table mahasiswa
- [ ] Mata kuliah sudah ada di table mataKuliah

### Code Verification
- [ ] `MahasiswaHelpers.jsx` sudah ada
- [ ] `MahasiswaDetail.jsx` sudah import helpers
- [ ] No TypeScript/syntax errors
- [ ] Network tab bersih (no 404 for rencanaStudi)

### Testing
- [ ] Test Scenario 1: Aktif dengan nilai ✓
- [ ] Test Scenario 2: Aktif tanpa nilai ✓
- [ ] Test Scenario 3: Tidak aktif ✓
- [ ] Browser console clear (no errors)

### Optimization (Optional)
- [ ] Add caching untuk rencanaStudi
- [ ] Add loading skeleton while fetching
- [ ] Add error boundary
- [ ] Add unit tests untuk helpers

## ⚠️ Troubleshooting

### Issue: "Rencana Studi tidak muncul"
**Kemungkinan**:
1. Database kosong → INSERT data
2. API belum ter-load → refresh page
3. Query params tidak tepat → check network tab

**Solusi**:
```javascript
// Debug di browser console
// 1. Check jika data ter-fetch
const { data } = await fetch('/rencanaStudi').then(r => r.json());
console.log(data); // Harus ada

// 2. Check jika helper function bekerja
const sks = calculateTotalSks("A13.2020.00001", data, mataKuliahList);
console.log(sks); // Harus > 0 jika ada data
```

### Issue: "Nilai Akhir selalu '-'"
**Kemungkinan**:
1. Field `grades` kosong → update grades
2. Helper tidak detect nilai → check field name
3. Data format berbeda → validate struktur

**Solusi**:
```javascript
// Cek data structure
const rs = data[0]; // rencana studi pertama
console.log(rs.grades); // Harus ada: { "mahasiswaId": "A", ... }
```

### Issue: "Status selalu Tidak Aktif"
**Kemungkinan**:
1. SKS = 0 → insert rencana studi
2. mahasiswaIds tidak match → pastikan ID sama

**Solusi**:
```javascript
// Cek matching ID
const mahasiswaId = "A13.2020.00001";
const rs = data.find(r => r.mahasiswaIds.includes(mahasiswaId));
console.log(rs); // Harus ada
```

## 📚 Reference Files

- **Database Schema**: [db.json](db/db.json)
- **Sample Data**: [populateRencanaStudiData.js](scripts/populateRencanaStudiData.js)
- **Helper Functions**: [MahasiswaHelpers.jsx](src/Utils/Helpers/MahasiswaHelpers.jsx)
- **Component Update**: [MahasiswaDetail.jsx](src/pages/Admin/MahasiswaDetail.jsx)
- **Documentation**: [LOGIKA_MAHASISWA_RENCANA_STUDI.md](LOGIKA_MAHASISWA_RENCANA_STUDI.md)

## 🎯 Success Criteria

✅ **Done** jika:
1. Detail mahasiswa aktif menampilkan SKS dari rencana studi
2. Status berubah otomatis berdasarkan SKS
3. Nilai akhir dihitung dari rencana studi
4. Tidak ada error di console
5. Data konsisten di seluruh aplikasi

---

**Duration**: ~15-30 menit untuk setup
**Difficulty**: Easy-Medium
**Priority**: High (blocking feature)
