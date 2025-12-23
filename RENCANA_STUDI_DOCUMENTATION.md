# Dokumentasi Fitur Rencana Studi Mahasiswa

## Overview
Fitur Rencana Studi Mahasiswa memungkinkan admin/operator untuk mengelola kelas, dosen, dan mahasiswa dengan validasi SKS otomatis.

## Komponen yang Dibuat

### 1. RencanaStudi.jsx (Halaman Utama)
**Lokasi:** `src/pages/Admin/RencanaStudi.jsx`

**Fungsi Utama:**
- Menampilkan daftar kelas yang telah dibuat
- Mengelola kelas, dosen, dan mahasiswa
- Menghitung total SKS per mahasiswa
- Validasi SKS dan kapasitas kelas

**State yang Dikelola:**
```javascript
- rencanaKelas: Array of kelas objects
- showModal: Boolean untuk menampilkan modal
```

**Struktur Data Kelas:**
```javascript
{
  id: string,
  kelasId: string,
  mataKuliahId: string,
  mataKuliahNama: string,
  sks: number,
  dosenId: string | null,
  dosenNama: string,
  mahasiswa: Array<string>, // Array of mahasiswa IDs
  kapasitas: number (default: 45)
}
```

**Fitur Utama:**
1. **Tambah Kelas Baru** - Membuat kelas untuk mata kuliah tertentu dengan dosen pengampu
2. **Edit Dosen** - Mengubah dosen pengampu untuk kelas tertentu
3. **Tambah Mahasiswa** - Menambahkan mahasiswa dengan validasi:
   - Tidak duplikat
   - Total SKS tidak melebihi 24 SKS
   - Kapasitas kelas tidak penuh (max 45)
4. **Hapus Mahasiswa** - Menghapus mahasiswa dari kelas
5. **Hapus Kelas** - Menghapus kelas (hanya jika kosong)
6. **Hitung Total SKS** - Menampilkan total SKS per mahasiswa

### 2. TableRencanaStudi.jsx (Komponen Tabel)
**Lokasi:** `src/pages/Admin/TableRencanaStudi.jsx`

**Props:**
```javascript
{
  rencanaKelas: Array,
  dosen: Array,
  mahasiswa: Array,
  onEditDosen: Function,
  onTambahMahasiswa: Function,
  onHapusMahasiswa: Function,
  onHapusKelas: Function,
  hitungTotalSKS: Function
}
```

**Fitur:**
- Menampilkan setiap kelas dalam card/accordion style
- Dropdown untuk memilih dosen
- Dropdown untuk menambah mahasiswa (filter otomatis)
- List mahasiswa terdaftar dengan total SKS
- Aksi hapus untuk mahasiswa dan kelas

**Validasi Input:**
- Mahasiswa yang ditampilkan di dropdown hanya yang:
  - Belum terdaftar di kelas ini
  - Total SKS-nya + SKS mata kuliah ≤ 24 SKS

### 3. ModalRencanaStudi.jsx (Modal Tambah Kelas)
**Lokasi:** `src/pages/Admin/ModalRencanaStudi.jsx`

**Props:**
```javascript
{
  mataKuliah: Array,
  dosen: Array,
  onSave: Function,
  onClose: Function
}
```

**Form Fields:**
- Mata Kuliah (required) - Dropdown dengan info SKS
- Dosen Pengampu (required) - Dropdown dengan info jurusan

**Validasi:**
- Semua field harus diisi
- Mata kuliah dan dosen harus dipilih

## Data Flow

```
RencanaStudi.jsx
├── Fetch Data (Mahasiswa, Dosen, MataKuliah, Kelas)
├── Initialize rencanaKelas state
├── Handler Functions:
│   ├── handleTambahKelas() → setRencanaKelas
│   ├── handleEditDosen() → setRencanaKelas
│   ├── handleTambahMahasiswa() → Validasi + setRencanaKelas
│   ├── handleHapusMahasiswa() → Confirm + setRencanaKelas
│   ├── handleHapusKelas() → Confirm + setRencanaKelas
│   └── hitungTotalSKS() → Calculate
├── Pass to TableRencanaStudi
└── Modal ModalRencanaStudi untuk input
```

## Alur Penggunaan

### Membuat Kelas Baru
1. Klik tombol "Tambah Kelas"
2. Pilih Mata Kuliah dari dropdown
3. Pilih Dosen Pengampu dari dropdown
4. Klik "Buat Kelas"
5. Kelas baru akan muncul di tabel

### Menambah Mahasiswa ke Kelas
1. Pada kelas yang diinginkan, dropdown "Tambah Mahasiswa"
2. Pilih mahasiswa dari dropdown
3. Sistem otomatis memvalidasi:
   - Tidak duplikat
   - Total SKS ≤ 24
   - Kapasitas ≤ 45
4. Klik "Tambah"
5. Mahasiswa muncul di list "Mahasiswa Terdaftar"

### Mengubah Dosen
1. Pada kelas yang diinginkan, dropdown "Ubah Dosen Pengampu"
2. Pilih dosen baru
3. Klik "Update"
4. Nama dosen akan berubah

### Menghapus Mahasiswa
1. Di list "Mahasiswa Terdaftar", klik "Hapus"
2. Konfirmasi dialog
3. Mahasiswa terhapus dari kelas

### Menghapus Kelas
1. Kelas harus kosong (tidak memiliki mahasiswa)
2. Klik tombol "Hapus Kelas" di footer kelas
3. Konfirmasi dialog
4. Kelas terhapus

## Validasi & Aturan Bisnis

### SKS (Satuan Kredit Semester)
- Setiap mahasiswa maksimal dapat mengambil **24 SKS per semester**
- Sistem akan menampilkan peringatan jika melebihi batas
- Filter otomatis di dropdown untuk mencegah melebihi batas

### Kapasitas Kelas
- Setiap kelas dapat menampung maksimal **45 mahasiswa**
- Sistem akan menolak jika kapasitas penuh

### Integritas Data
- Mahasiswa tidak dapat duplicate dalam satu kelas
- Kelas tidak dapat dihapus jika masih memiliki mahasiswa
- Validasi dilakukan di UI dan akan di-enforce di API nantinya

## Statistik yang Ditampilkan

1. **Total Kelas** - Jumlah kelas yang telah dibuat
2. **Total Mahasiswa Terdaftar** - Jumlah semua mahasiswa di semua kelas
3. **Kapasitas Terpakai** - Persentase penggunaan kapasitas total
4. **Info SKS Mahasiswa** - Grid menampilkan:
   - Nama dan NIM mahasiswa
   - Total SKS saat ini
   - Status (Belum Ada / Normal / Melebihi)

## Database Struktur

### Tabel `matakuliah`
```json
{
  "id": "string",
  "nama": "string",
  "sks": "number",
  "semester": "number"
}
```

### Tabel `dosen`
```json
{
  "id": "string",
  "nidn": "string",
  "nama": "string",
  "email": "string",
  "jurusan": "string"
}
```

### Tabel `mahasiswa`
```json
{
  "id": "string",
  "nim": "string",
  "nama": "string"
}
```

### Storage Local (Sementara)
Data rencanaKelas disimpan di React state. Untuk production, perlu API endpoint:
- GET `/rencana-studi` - Ambil semua rencana studi
- POST `/rencana-studi` - Buat rencana studi baru
- PUT `/rencana-studi/:id` - Update rencana studi
- DELETE `/rencana-studi/:id` - Hapus rencana studi

## Routing

URL: `/admin/rencana-studi`

Menu Sidebar: "Rencana Studi" dengan icon 📋

## Testing Checklist

- [ ] Membuat kelas baru dengan mata kuliah dan dosen
- [ ] Menambah mahasiswa ke kelas
- [ ] Validasi SKS mencegah > 24 SKS
- [ ] Validasi duplikat mahasiswa
- [ ] Mengubah dosen pengampu
- [ ] Menghapus mahasiswa dari kelas
- [ ] Menghapus kelas kosong
- [ ] Mencoba menghapus kelas yang tidak kosong (harus error)
- [ ] Melihat total SKS per mahasiswa dengan benar
- [ ] Kapasitas terpakai dihitung dengan benar

## Future Enhancements

1. Integrasi API untuk penyimpanan data persistent
2. Export data ke PDF/Excel
3. Import data dari CSV
4. Jadwal kuliah per kelas
5. Absensi mahasiswa
6. Nilai dan transkrip
7. Nota kualitas (IPK) calculation
8. Validasi prerequisite mata kuliah
9. Collision detection untuk jadwal kuliah
10. Analytics dan reporting dashboard
