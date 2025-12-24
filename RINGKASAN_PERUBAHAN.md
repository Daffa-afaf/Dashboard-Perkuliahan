# RINGKASAN PERUBAHAN - Logika SKS dan Nilai Mahasiswa

## 🎯 Tujuan
Memperbaiki logika penampilan SKS dan Nilai Mahasiswa agar konsisten dengan Rencana Studi, bukan hard-coded dari field mahasiswa.

## 📋 Masalah yang Diperbaiki

### Sebelumnya (Tidak Logis)
```
NIM: A13.2020.00001
Nama: Bela Putra
Status: Aktif ✓
SKS Terpakai: 0 ✗ (Aktif tapi SKS 0?)
Nilai Akhir: A ✗ (Punya nilai tapi SKS 0?)
```

### Sesudahnya (Logis)
```
Status Aktif + SKS > 0 + Ada Nilai → Menampilkan nilai
Status Aktif + SKS > 0 + Belum Ada Nilai → "Menunggu nilai"  
Status Tidak Aktif + SKS = 0 → "Tidak ada data"
```

## 📂 File yang Ditambah/Diubah

### 1. **BARU**: `src/Utils/Helpers/MahasiswaHelpers.jsx`
**Isi**: 5 helper functions untuk kalkulasi data dari rencana studi
- `calculateTotalSks()` - Hitung total SKS
- `calculateMahasiswaStatus()` - Tentukan status (Aktif/Tidak Aktif)
- `calculateNilaiAkhir()` - Hitung nilai akhir (rata-rata)
- `getRencanaStudisForMahasiswa()` - Ambil daftar rencana studi
- `validateMahasiswaData()` - Validasi konsistensi data

**Ukuran**: ~150 lines (aman)

### 2. **DIUBAH**: `src/pages/Admin/MahasiswaDetail.jsx`
**Perubahan**:
- Import 4 helper functions dari `MahasiswaHelpers`
- Ubah logika kalkulasi SKS dari loop manual → `calculateTotalSks()`
- Ubah logika status dari kelas enrollment → `calculateMahasiswaStatus()`
- Ubah tampilan nilai dari `mahasiswa.nilai_akhir` → `calculateNilaiAkhir()`
- Tambah kolom "Nilai" di tabel mata kuliah
- Ubah display logic untuk menampilkan pesan yang lebih informatif

**Perubahan baris**: ~30 baris diubah/ditambah

## 🔧 Perubahan Teknis

### Helper Function: `calculateTotalSks`
```javascript
const sksTerpakai = calculateTotalSks(
  mahasiswa.id,           // ID mahasiswa
  rencanaStudiList,      // Data dari DB
  mataKuliahList         // Data mata kuliah
);
// Output: number (total SKS)
```

### Helper Function: `calculateMahasiswaStatus`
```javascript
const statusMahasiswa = calculateMahasiswaStatus(
  mahasiswa.id,
  rencanaStudiList,
  mataKuliahList
);
// Output: boolean (true = Aktif, false = Tidak Aktif)
```

### Helper Function: `calculateNilaiAkhir`
```javascript
const nilaiAkhir = calculateNilaiAkhir(
  mahasiswa.id,
  rencanaStudiList
);
// Output: string ("A", "B", "C", "-", dll)
// Logika: Rata-rata dari semua mata kuliah yang punya nilai
```

## 📊 Logika Penentuan Status

```
IF SKS > 0:
  Status = "Aktif" ✅ (HIJAU)
ELSE:
  Status = "Tidak Aktif" ❌ (MERAH)
```

## 📝 Logika Perhitungan Nilai

```
1. Filter rencana studi yang punya grade/nilai
2. Konversi grade ke angka: A=4.0, B=3.0, C=2.0, D=1.0, E=0.0
3. Hitung rata-rata
4. Konversi kembali ke grade:
   - >= 3.5 → A
   - >= 2.5 → B
   - >= 1.5 → C
   - >= 0.5 → D
   - < 0.5 → E
5. Jika tidak ada nilai sama sekali → "-"
```

## 🧪 Testing Scenarios

### Scenario 1: Mahasiswa Aktif dengan Nilai
```
Rencana Studi: 3 mata kuliah (MK1, MK2, MK3)
Grade: A, B, A
SKS: 3, 4, 3 = 10 total
Nilai Akhir: (4.0 + 3.0 + 4.0) / 3 = 3.67 ≈ A
Status: Aktif ✓

Display:
- Status: "Aktif" (hijau)
- SKS: "10 / 24 SKS" (hijau)
- Nilai: "A"
```

### Scenario 2: Mahasiswa Aktif Tanpa Nilai
```
Rencana Studi: 2 mata kuliah (baru diambil)
Grade: (kosong)
SKS: 3 + 4 = 7 total
Nilai Akhir: "-"
Status: Aktif ✓

Display:
- Status: "Aktif" (hijau)
- SKS: "7 / 24 SKS" (hijau)
- Nilai: "Menunggu nilai" (italic)
```

### Scenario 3: Mahasiswa Tidak Aktif
```
Rencana Studi: (kosong)
Grade: (tidak ada)
SKS: 0
Nilai Akhir: "-"
Status: Tidak Aktif

Display:
- Status: "Tidak Aktif" (merah)
- SKS: "0 / 24 SKS" (abu-abu)
- Nilai: "Tidak ada data" (italic)
```

## ⚠️ Catatan Penting

1. **Rencana Studi Kosong**: Database `rencanaStudi` saat ini kosong
   - Perlu populate dengan data sebelum testing
   - Gunakan script `scripts/populateRencanaStudiData.js` untuk reference

2. **Field Grade**: Struktur rencana studi perlu ditambah field untuk nilai
   - Option A: `grades: { "mahasiswaId": "A", ... }`
   - Option B: Struktur terpisah dengan `mahasiswaId-gradeId` mapping

3. **Backward Compatibility**: Field lama di table mahasiswa (`nilai_akhir`, `sksTerpakai`) tidak lagi dipakai
   - Tapi tidak ada masalah jika tetap ada (hanya tidak ditampilkan)

4. **API Rencana Studi**: Perlu pastikan API mengembalikan:
   - `mahasiswaIds[]` - daftar mahasiswa
   - `mataKuliahId` - ID mata kuliah
   - `grade` atau `nilai` per mahasiswa

## 🚀 Next Steps (Optional)

1. **Populate Database**: Insert data rencana studi ke `db.json`
2. **Update Form Rencana Studi**: Tambah input untuk nilai/grade
3. **Menu Mahasiswa**: Tambah kolom "SKS Aktif" di tabel list
4. **Validasi**: Tambah warning jika ada inkonsistensi data
5. **Report**: Buat laporan progress mahasiswa per semester

## ✅ Verification Checklist

- [x] Helper functions dibuat
- [x] MahasiswaDetail.jsx diupdate
- [x] Logika SKS dari rencana studi ✓
- [x] Logika status dari SKS ✓
- [x] Logika nilai dari rencana studi ✓
- [x] Display message informatif ✓
- [x] Dokumentasi lengkap ✓
- [ ] Database populated (manual)
- [ ] Testing di browser
- [ ] Edge cases tested

---

**Status**: ✅ Implementasi Selesai  
**Tanggal**: 24 Desember 2025  
**Testing**: Perlu populate database terlebih dahulu
