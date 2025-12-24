# Solusi: Logika SKS dan Nilai Mahasiswa dari Rencana Studi

## Masalah yang Diidentifikasi

1. **Inkonsistensi Data**: Mahasiswa aktif (Status = "Aktif") tapi SKS = 0, padahal sudah punya Nilai Akhir
2. **Sumber Data Ambigu**: SKS dan Nilai Akhir ditampilkan dari field mahasiswa, bukan dari rencana studi aktual
3. **Logika Status Tidak Tepat**: Status hanya berdasarkan enrollment di kelas, bukan di rencana studi

## Solusi yang Diimplementasikan

### 1. Helper Functions (`MahasiswaHelpers.jsx`)

Dibuat 5 fungsi helper untuk menghitung data mahasiswa dari rencana studi:

#### a. `calculateTotalSks(mahasiswaId, rencanaStudiList, mataKuliahList)`
- Menghitung total SKS dari rencana studi yang diambil mahasiswa
- Logika: Filter rencana studi → ambil SKS dari mata kuliah → jumlahkan

#### b. `calculateMahasiswaStatus(mahasiswaId, rencanaStudiList, mataKuliahList)`
- Status "Aktif" = memiliki minimal 1 rencana studi dengan SKS > 0
- Status "Tidak Aktif" = tidak ada rencana studi atau SKS = 0

#### c. `calculateNilaiAkhir(mahasiswaId, rencanaStudiList)`
- Menghitung nilai akhir dari rata-rata nilai semua mata kuliah
- Konversi: A=4.0, B=3.0, C=2.0, D=1.0, E=0.0
- Jika tidak ada nilai, tampilkan "-"

#### d. `getRencanaStudisForMahasiswa(mahasiswaId, rencanaStudiList)`
- Mengambil daftar rencana studi yang diambil mahasiswa
- Digunakan untuk menampilkan detail mata kuliah

#### e. `validateMahasiswaData(...)`
- Helper untuk validasi data (deteksi inkonsistensi)
- Berguna untuk debugging dan quality assurance

### 2. Update `MahasiswaDetail.jsx`

#### Import Helper Functions
```jsx
import {
  calculateTotalSks,
  calculateMahasiswaStatus,
  calculateNilaiAkhir,
  getRencanaStudisForMahasiswa,
} from "../../Utils/Helpers/MahasiswaHelpers";
```

#### Penghitungan Data
```jsx
const sksTerpakai = calculateTotalSks(mahasiswa.id, rencanaStudiList, mataKuliahList);
const statusMahasiswa = calculateMahasiswaStatus(mahasiswa.id, rencanaStudiList, mataKuliahList);
const nilaiAkhir = calculateNilaiAkhir(mahasiswa.id, rencanaStudiList);
const rencanaStudisForMahasiswa = getRencanaStudisForMahasiswa(mahasiswa.id, rencanaStudiList);
```

#### Tampilan yang Lebih Logis
- **SKS = 0**: Tampilkan abu-abu (tidak ada status)
- **SKS > 0**: Tampilkan hijau (aktif)
- **Nilai = "-"**: Tampilkan "Menunggu nilai" jika aktif, "Tidak ada data" jika tidak aktif
- **Tabel Mata Kuliah**: Tambah kolom "Nilai" untuk menampilkan nilai per mata kuliah

## Struktur Data Rencana Studi (yang direncanakan)

```json
{
  "rencanaStudi": [
    {
      "id": "1",
      "kelasId": "1",
      "mataKuliahId": "1",
      "mahasiswaIds": ["A13.2020.00001", "A13.2020.00002"],
      "grades": {
        "A13.2020.00001": "A",
        "A13.2020.00002": "B"
      },
      "terdaftar": 2
    }
  ]
}
```

Atau struktur alternatif dengan nilai per mahasiswa:

```json
{
  "rencanaStudiDetail": [
    {
      "id": "1",
      "mahasiswaId": "A13.2020.00001",
      "mataKuliahId": "1",
      "kelasId": "1",
      "grade": "A",
      "status": "lulus"
    }
  ]
}
```

## Logika yang Diterapkan

### Status Mahasiswa
| SKS Terpakai | Nilai | Status | Keterangan |
|-------------|-------|--------|-----------|
| 0 | - | Tidak Aktif | Belum terdaftar di rencana studi |
| > 0 | - | Aktif | Sudah terdaftar, menunggu nilai |
| > 0 | A/B/C | Aktif | Sudah terdaftar, sudah ada nilai |
| (irrelevant) | - | Tidak Aktif | Tidak ada nilai karena tidak ada SKS |

### Perhitungan Nilai Akhir
- **Rata-rata nilai** dari semua mata kuliah yang diambil
- Jika ada mata kuliah belum ada nilai, tidak masuk hitungan
- Jika semua belum ada nilai, tampilkan "-" dengan keterangan "Menunggu nilai"

### Perhitungan SKS
- **Total SKS** = Σ (SKS mata kuliah di setiap rencana studi mahasiswa)
- Hanya mata kuliah yang terdaftar di rencana studi yang dihitung
- Memastikan data real-time dari rencana studi, bukan hard-coded

## Keuntungan Implementasi Ini

1. ✅ **Data Konsisten**: Status, SKS, dan nilai selalu sinkron dengan rencana studi
2. ✅ **Dynamic**: Tidak perlu update manual, langsung dari rencana studi
3. ✅ **User Friendly**: Tampilan lebih logis dan informatif
4. ✅ **Scalable**: Mudah ditambah fitur lain (tracking per semester, etc)
5. ✅ **Maintainable**: Logika terpusat di helper functions

## Next Steps

1. **Populasi Database**: Masukkan data rencana studi ke `db.json`
   - Tambahkan field `grade` atau `nilai` di rencana studi
   - Pastikan `mahasiswaIds` ter-populate dengan benar

2. **Update Form**: Saat input rencana studi, tambah field untuk input nilai

3. **Unit Testing**: Test helper functions dengan berbagai skenario
   - Mahasiswa aktif dengan nilai
   - Mahasiswa aktif tanpa nilai
   - Mahasiswa tidak aktif

4. **Menu Mahasiswa**: Tampilkan SKS yang sedang jalani (optional)
   - Bisa tambah kolom di tabel mahasiswa: "SKS Aktif"
   - Atau tambah badge di status

## File yang Dimodifikasi

- ✅ [src/Utils/Helpers/MahasiswaHelpers.jsx](src/Utils/Helpers/MahasiswaHelpers.jsx) - **BARU**
- ✅ [src/pages/Admin/MahasiswaDetail.jsx](src/pages/Admin/MahasiswaDetail.jsx) - Diupdate

## Catatan Penting

- Rencana studi saat ini kosong di database
- Perlu populate database dengan data rencana studi untuk testing
- Field `grade` atau `nilai` perlu ditambah ke struktur rencana studi
- Untuk mahasiswa baru (2023) dengan SKS = 0, status akan otomatis "Tidak Aktif"
