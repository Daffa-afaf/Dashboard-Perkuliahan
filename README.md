# 🎓 Dashboard Perkuliahan

Sistem manajemen perkuliahan berbasis web yang dirancang untuk mengelola data mahasiswa, dosen, mata kuliah, kelas, dan rencana studi dengan sistem validasi SKS otomatis dan filtering berbasis NIM prefix per jurusan.

## 📋 Deskripsi Project

Dashboard Perkuliahan adalah aplikasi web modern yang dibangun dengan React dan Vite untuk mengelola sistem akademik perguruan tinggi. Aplikasi ini memiliki fitur lengkap mulai dari manajemen master data hingga pengelolaan rencana studi mahasiswa dengan validasi SKS real-time.

## ✨ Fitur Utama

### 🏠 Dashboard
- Statistik ringkasan (total mahasiswa, dosen, kelas, mata kuliah)
- Grafik visualisasi data akademik
- Overview sistem perkuliahan

### 👨‍🎓 Manajemen Mahasiswa
- CRUD mahasiswa dengan validasi NIM
- Status mahasiswa otomatis (Aktif/Tidak Aktif berdasarkan enrollment)
- Detail profil mahasiswa dengan SKS terpakai
- Filtering dan pencarian mahasiswa
- Pagination untuk handling data besar (1000+ mahasiswa)

### 👨‍🏫 Manajemen Dosen
- CRUD dosen dengan spesialisasi jurusan
- Pencocokan dosen-mata kuliah berdasarkan jurusan
- Detail profil dosen dengan mata kuliah yang diampu
- Filter dosen per fakultas/jurusan

### 📚 Manajemen Mata Kuliah
- CRUD mata kuliah dengan informasi SKS
- Kategorisasi berdasarkan jurusan dan semester
- Detail mata kuliah dengan daftar kelas terkait

### 🏫 Manajemen Kelas
- CRUD kelas perkuliahan
- Assignment dosen pengampu
- Tracking kapasitas kelas (max 45 mahasiswa)
- Monitoring jumlah mahasiswa terdaftar

### 📊 Rencana Studi (Fitur Unggulan)
- **NIM Prefix System**: Identifikasi mahasiswa berdasarkan kode jurusan
  - A11: Ilmu Komputer
  - A13: Teknik Elektro
  - B11: Ekonomi Manajemen
  - C11: Ilmu Hukum
  - D11: Kedokteran Umum
- **Filter Jurusan dengan Card Menu**: Tampilan interaktif untuk melihat mahasiswa per jurusan
- **Validasi SKS Otomatis**: 
  - Batas maksimal 24 SKS per mahasiswa
  - Perhitungan SKS real-time
  - Warning jika melebihi batas
- **Cross-Jurusan Prevention**: Mahasiswa hanya bisa mengambil mata kuliah sesuai jurusannya
- **Multi Mata Kuliah per Kelas**: Satu mahasiswa bisa mengambil beberapa mata kuliah dalam satu kelas
- **Search & Filter**: Pencarian mahasiswa dengan filter NIM prefix
- **Persistent Data**: Semua perubahan tersimpan ke database dengan React Query

### 👤 Manajemen User & Autentikasi
- Login/Register dengan JWT
- Role-based access (Admin, User)
- Protected routes dan permission management

## 🛠️ Teknologi yang Digunakan

### Frontend
- **React 18.x** - Library UI modern
- **React Router v7** - Routing dengan nested layouts
- **Vite 5.x** - Build tool super cepat dengan HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Query v5** - Data fetching dan state management
- **Axios** - HTTP client untuk REST API
- **SweetAlert2** - Modal dialogs yang cantik
- **React Toastify** - Notification system

### Backend/Database
- **JSON Server** - Mock REST API untuk development
- **db.json** - File-based database dengan struktur relasional

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 📁 Struktur Project

```
Pertemuan-3-React/
├── db/
│   ├── db.json              # Database utama (mahasiswa, dosen, kelas, dll)
│   └── dosen.json           # Backup data dosen
├── scripts/
│   ├── updateNimPrefixes.js    # Script update NIM mahasiswa ke prefix baru
│   ├── cleanupKelas.js         # Script cleanup kelas unused
│   ├── clearKelasData.js       # Script reset enrollment data
│   └── generateDashboardData.js # Script generate dummy data
├── src/
│   ├── Data/
│   │   └── Dummy.js            # Data dummy untuk testing
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Mahasiswa.jsx
│   │   │   ├── MahasiswaTable.jsx
│   │   │   ├── MahasiswaModal.jsx
│   │   │   ├── MahasiswaDetail.jsx
│   │   │   ├── Dosen.jsx
│   │   │   ├── DosenTable.jsx
│   │   │   ├── DosenModal.jsx
│   │   │   ├── DosenDetail.jsx
│   │   │   ├── MataKuliah.jsx
│   │   │   ├── MataKuliahTable.jsx
│   │   │   ├── MataKuliahModal.jsx
│   │   │   ├── MataKuliahDetail.jsx
│   │   │   ├── Kelas.jsx
│   │   │   ├── KelasTable.jsx
│   │   │   ├── KelasModal.jsx
│   │   │   ├── RencanaStudi.jsx      # Halaman utama rencana studi
│   │   │   ├── TableRencanaStudi.jsx # Tabel kelas dengan inline forms
│   │   │   ├── ModalRencanaStudi.jsx # Modal tambah kelas baru
│   │   │   ├── Users.jsx
│   │   │   └── UserModal.jsx
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── Layouts/
│   │   │   ├── AdminLayout.jsx       # Layout utama dengan sidebar
│   │   │   ├── AuthLayout.jsx
│   │   │   └── Components/
│   │   │       ├── ProtectedRoute.jsx
│   │   │       ├── PermissionRoute.jsx
│   │   │       └── atoms/            # Reusable components
│   │   └── PageNotFound.jsx
│   ├── Utils/
│   │   ├── Apis/
│   │   │   ├── AuthApi.jsx
│   │   │   ├── MahasiswaApi.jsx
│   │   │   ├── DosenApi.jsx
│   │   │   ├── MataKuliahApi.jsx
│   │   │   └── KelasApi.jsx
│   │   ├── Queries/
│   │   │   ├── useMahasiswaQueries.jsx  # React Query hooks
│   │   │   ├── useDosenQueries.jsx
│   │   │   ├── useMataKuliahQueries.jsx
│   │   │   └── useKelasQueries.jsx
│   │   ├── Helpers/
│   │   │   ├── AuthHelpers.jsx
│   │   │   ├── NimHelpers.jsx          # NIM prefix mapping logic
│   │   │   ├── PaginationHelpers.jsx
│   │   │   ├── SwalHelpers.jsx
│   │   │   └── ToastHelpers.jsx
│   │   ├── AxiosInstance.jsx           # Axios config
│   │   └── DarkModeContext.jsx
│   ├── App.css
│   └── main.jsx                        # Entry point
├── public/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Cara Menjalankan Project

### Prerequisites
Pastikan sudah terinstall:
- **Node.js** (v18 atau lebih tinggi)
- **npm** atau **yarn**
- **Git**

### 1. Clone Repository
```bash
git clone https://github.com/Daffa-afaf/Dashboard-Perkuliahan.git
cd Dashboard-Perkuliahan
```

### 2. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 3. Jalankan JSON Server (Backend)
Buka terminal pertama dan jalankan:
```bash
npm run serve
# atau
npx json-server --watch db/db.json --port 3000
```
Server akan berjalan di `http://localhost:3000`

### 4. Jalankan Development Server (Frontend)
Buka terminal kedua dan jalankan:
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`

### 5. Login ke Aplikasi
Default credentials (bisa dilihat di `db/db.json`):
- **Username**: admin / user
- **Password**: (sesuai data di database)

## 📦 Available Scripts

```bash
# Development
npm run dev          # Jalankan Vite dev server dengan HMR
npm run serve        # Jalankan JSON Server di port 3000

# Production
npm run build        # Build untuk production
npm run preview      # Preview production build

# Linting
npm run lint         # Check code dengan ESLint
```

## 🔧 Maintenance Scripts

### Update NIM Prefix Mahasiswa
```bash
node scripts/updateNimPrefixes.js
```
Script ini mengupdate NIM mahasiswa ke format baru dengan prefix jurusan (A11, A13, B11, C11, D11).

### Cleanup Kelas Unused
```bash
node scripts/cleanupKelas.js
```
Membersihkan kelas yang tidak aktif atau duplikat.

### Reset Enrollment Data
```bash
node scripts/clearKelasData.js
```
Menghapus semua data enrollment mahasiswa dari kelas (untuk fresh start).

### Generate Dashboard Data
```bash
node scripts/generateDashboardData.js
```
Generate data dummy untuk testing dashboard.

## 🎨 Fitur UI/UX

- **Responsive Design**: Optimal di desktop, tablet, dan mobile
- **Dark Mode Support**: Theme switching (light/dark)
- **Loading States**: Skeleton loading dan spinners
- **Toast Notifications**: Feedback untuk setiap aksi
- **Modal Confirmations**: SweetAlert2 untuk konfirmasi delete/update
- **Pagination**: Handling data besar dengan efisien
- **Search & Filter**: Real-time filtering di setiap tabel
- **Interactive Cards**: Card menu jurusan dengan hover effects
- **Color-coded Status**: Badge warna untuk status SKS mahasiswa

## 🔐 Authentication & Authorization

- **JWT-based Authentication**: Token stored in localStorage
- **Protected Routes**: Route guards dengan React Router
- **Role-based Permissions**: 
  - Admin: Full access (CRUD semua data)
  - User: Read-only access
- **Auto-logout**: Session management

## 🐛 Known Issues & Solutions

### Port Already in Use
Jika port 5173 atau 3000 sudah digunakan:
```bash
# Vite akan otomatis mencari port lain (5174, 5175, dst)
# Atau kill process di port tersebut:
npx kill-port 5173
npx kill-port 3000
```

### CORS Issues
JSON Server sudah dikonfigurasi untuk allow CORS. Jika masih ada masalah, restart server.

### Data Tidak Tersimpan
Pastikan JSON Server sudah running sebelum melakukan operasi CRUD.
