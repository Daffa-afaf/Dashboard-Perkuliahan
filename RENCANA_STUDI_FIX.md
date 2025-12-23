# Perbaikan Logic Rencana Studi

## Masalah yang Diselesaikan
User melaporkan bahwa di menu **Rencana Studi** masih ada logic yang salah:
- Di kelas Teknik Informatika bisa memilih mata kuliah dari jurusan lain (Anatomi, Rangkaian Listrik, dll)
- Dosen dari jurusan lain (Kedokteran, Hukum) bisa muncul di pilihan dosen pengampu kelas Teknik Informatika
- Mahasiswa dari fakultas tertentu bisa mendaftar mata kuliah dari fakultas lain

## Solusi yang Diterapkan

### 1. Modal Rencana Studi (`ModalRencanaStudi.jsx`)
**Perubahan:**
- Menambahkan dropdown **Jurusan** sebagai filter utama
- Dropdown Mata Kuliah hanya menampilkan MK yang sesuai dengan jurusan yang dipilih
- Dropdown Dosen hanya menampilkan dosen yang jurusannya sesuai dengan jurusan yang dipilih
- Field mata kuliah dan dosen di-disable hingga jurusan dipilih terlebih dahulu

**Validasi:**
- User wajib memilih jurusan sebelum bisa submit
- Auto-reset mata kuliah dan dosen ketika jurusan berubah

### 2. Tabel Rencana Studi (`TableRencanaStudi.jsx`)
**Perubahan:**
- Menambahkan helper function `getKelasJurusan()` untuk mendapatkan jurusan dari kelas
- Menambahkan helper function `getMahasiswaFakultas()` untuk mendapatkan fakultas mahasiswa

**Filter Dosen:**
- Dropdown dosen pengampu kelas hanya menampilkan dosen dengan jurusan yang sama dengan kelas

**Filter Mahasiswa:**
- Dropdown mahasiswa hanya menampilkan mahasiswa dengan fakultas yang sesuai dengan jurusan kelas
- Menampilkan info fakultas mahasiswa di dropdown
- Validasi tambahan saat tombol "Tambah Mahasiswa" diklik

**Filter Mata Kuliah:**
- Dropdown mata kuliah difilter berdasarkan fakultas mahasiswa yang dipilih
- Implementasi dynamic filtering: ketika mahasiswa dipilih, mata kuliah otomatis difilter

**Validasi:**
- Alert error jika mahasiswa atau mata kuliah belum dipilih
- Alert error jika mahasiswa dari fakultas berbeda mencoba mengambil mata kuliah
- Pesan error yang jelas: "Mahasiswa dari fakultas X tidak dapat mengambil mata kuliah Y"

### 3. Component Utama (`RencanaStudi.jsx`)
**Perubahan:**
- Menambahkan field `jurusan` ke setiap item di `rencanaKelas`
- Field jurusan diambil dari `k.jurusan` atau `matchedMK.jurusan` (fallback)
- Data jurusan disimpan untuk digunakan oleh komponen child

## Struktur Database
Database sudah diupdate (via script `fixKelasDosenMatching.js`) dengan struktur:

```json
{
  "kelas": [
    {
      "id": "3",
      "kode": "IK-A",
      "nama": "Ilmu Komputer A",
      "jurusan": "Ilmu Komputer",
      "rencanaStudiIds": ["5", "6"],
      "mahasiswaIds": ["A11.2020.00861", ...]
    }
  ],
  "mataKuliah": [
    {
      "id": "5",
      "kode": "IK101",
      "nama": "Algoritma Lanjut",
      "jurusan": "Ilmu Komputer",
      "sks": 3,
      "dosenId": "7"
    }
  ],
  "mahasiswa": [
    {
      "nim": "A11.2020.00861",
      "nama": "Novi Wijaya",
      "fakultas": "Ilmu Komputer"
    }
  ],
  "dosen": [
    {
      "id": "7",
      "nama": "Dr. Zulkifli Hidayat",
      "jurusan": "Ilmu Komputer"
    }
  ]
}
```

## 8 Jurusan yang Didukung
1. Teknik Elektro
2. Teknik Mesin
3. Ilmu Komputer
4. Sistem Informasi
5. Ekonomi Manajemen
6. Ekonomi Akuntansi
7. Ilmu Hukum
8. Kedokteran Umum

## Testing
Verifikasi dilakukan dengan PowerShell:
- ✓ Kelas "Ilmu Komputer A" hanya memiliki MK IK101 & IK102
- ✓ Mata Kuliah Ilmu Komputer (IK101, IK102) memiliki dosenId "7" (Dr. Zulkifli Hidayat)
- ✓ Mata Kuliah Kedokteran (KD101, KD102) memiliki dosenId "6" (Prof. Candra Lestari)
- ✓ Mahasiswa A11.2020.00861 memiliki fakultas "Ilmu Komputer"
- ✓ Build aplikasi sukses tanpa error

## Hasil Akhir
✅ **FIXED**: Kelas Teknik Informatika **HANYA** menampilkan mata kuliah Ilmu Komputer dan Sistem Informasi  
✅ **FIXED**: Dosen pengampu **HANYA** dari jurusan yang sesuai  
✅ **FIXED**: Mahasiswa **TIDAK BISA** mengambil mata kuliah dari fakultas lain  
✅ **FIXED**: Validasi di UI dengan alert yang jelas  

## File yang Dimodifikasi
1. `src/pages/Admin/ModalRencanaStudi.jsx` - Tambah dropdown jurusan + filter
2. `src/pages/Admin/TableRencanaStudi.jsx` - Filter mahasiswa, dosen, mata kuliah berdasarkan jurusan
3. `src/pages/Admin/RencanaStudi.jsx` - Simpan field jurusan di state

## Catatan Penting
- Logic filtering sekarang **konsisten** di seluruh aplikasi (Mata Kuliah, Kelas, Rencana Studi)
- Semua komponen menggunakan field `jurusan` atau `fakultas` untuk filtering
- User experience lebih baik dengan dropdown yang di-disable hingga prasyarat terpenuhi
- Error message jelas dan informatif
