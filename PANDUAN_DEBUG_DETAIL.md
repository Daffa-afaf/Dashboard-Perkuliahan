# 🔍 PANDUAN DEBUG - Status Inconsistency

## Kronologi Masalah
1. **List Mahasiswa**: Bela Putra (A13.2020.00001) → Status: **Aktif** ✅
2. **Detail Mahasiswa**: Bela Putra (A13.2020.00001) → Status: **Tidak Aktif** ❌
3. **Rencana Studi**: Terdapat **22 SKS** yang sudah dicatat

## Root Cause Analysis

### Kemungkinan 1: Pagination Data Rencana Studi (PALING MUNGKIN)
**File**: `/src/pages/Admin/MahasiswaDetail.jsx` line 23
```javascript
// LAMA (PROBLEMATIC):
const { data: rencanaStudiResult = { data: [] } } = useRencanaStudiList(1, 200);
const rencanaStudiList = rencanaStudiResult.data || [];

// BARU (FIXED):
const { data: rencanaStudiList = [] } = useRencanaStudiListAll();
```

**Masalah**: `useRencanaStudiList(1, 200)` hanya mengambil:
- Page 1 dari rencana studi
- Maksimal 200 item per page
- Jika total data > 200, sisa data tidak di-fetch!

**Solusi**: `useRencanaStudiListAll()` mengambil SEMUA data tanpa pagination

---

## 🛠️ STEP-BY-STEP DEBUG

### Langkah 1: Buka DevTools
1. Buka halaman Mahasiswa Detail di browser
2. Tekan `F12` untuk buka Developer Tools
3. Buka tab **Console**

### Langkah 2: Jalankan Full Debug
Copy-paste di console:
```javascript
fullDebug()
```

**Output yang diharapkan**:
- ✅ Total rencana studi: [angka positif]
- ✅ Sample struktur data: [JSON object]
- ✅ Rencana studi untuk A13.2020.00001: [jumlah items]
- ✅ Total SKS: 22
- ✅ Status: AKTIF ✅

### Langkah 3: Debug Spesifik Mahasiswa
Jika ingin cek mahasiswa lain:
```javascript
checkMahasiswa('A13.2020.00002')
checkMahasiswa('A13.2020.00003')
```

### Langkah 4: Debug Data Matching
Untuk debug apakah mahasiswa ID cocok:
```javascript
debugSksCalculation('A13.2020.00001')
```

**Cari di output**:
- Apakah "Rencana studi ditemukan" > 0?
- Apakah ada mata kuliah yang di-list?
- Apakah Total SKS sesuai harapan?

---

## 📊 Struktur Data yang Diharapkan

### Rencana Studi (db/db.json)
```javascript
{
  id: "rs_001",
  mataKuliahId: "mk_001",
  mahasiswaIds: ["A13.2020.00001", "A13.2020.00002"],  // ← Kemungkinan 1
  // atau
  mahasiswa: [{id: "A13.2020.00001"}, ...],             // ← Kemungkinan 2
  // atau
  mahasiswaId: "A13.2020.00001"                         // ← Kemungkinan 3
}
```

### Mata Kuliah (db/db.json)
```javascript
{
  id: "mk_001",
  nama: "Pemrograman Web",
  sks: 3,
  nilaiMin: 'D',
  dosen: "dosen_001"
}
```

---

## ✅ CHECKLIST DEBUGGING

### Data Fetching
- [ ] Rencana studi API mengembalikan data?
  ```javascript
  debugRencanaStudi()
  ```
- [ ] Total item > 200? (kemungkinan ada pagination issue)
- [ ] Struktur data sesuai salah satu format di atas?

### Mahasiswa Matching
- [ ] Mahasiswa A13.2020.00001 ditemukan di rencana studi?
  ```javascript
  checkMahasiswa('A13.2020.00001')
  ```
- [ ] SKS dihitung dengan benar?
- [ ] Status menjadi "AKTIF" jika SKS > 0?

### Component Logic
- [ ] Helper function `calculateTotalSks()` di-call dengan data yang benar?
- [ ] Helper function `calculateMahasiswaStatus()` di-call dengan SKS yang benar?

---

## 🚀 TESTING SETELAH FIX

Setelah fix diterapkan (menggunakan `useRencanaStudiListAll`):

### Test 1: Hardrefresh
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

### Test 2: Clear Cache
```javascript
// Di console, jalankan:
localStorage.clear();
location.reload();
```

### Test 3: Check Network
1. Buka DevTools → Network tab
2. Filter: `rencanaStudi`
3. Cek apakah ada multiple requests atau hanya 1?
4. Response size seberapa besar? (jika > 500KB, mungkin ada banyak data)

### Test 4: Verify Detail View
1. Go to Admin > Mahasiswa > List
2. Klik Bela Putra (A13.2020.00001)
3. Verifikasi:
   - [ ] Status = "Aktif" (bukan "Tidak Aktif")
   - [ ] SKS Terpakai = 22 (bukan 0)
   - [ ] Nilai Akhir = [calculated] atau "Menunggu nilai" (bukan kosong)
   - [ ] Mata kuliah ada di tabel

---

## 🔧 POTENTIAL FIXES

### Fix 1: Gunakan useRencanaStudiListAll (SUDAH DITERAPKAN)
**File**: `/src/Utils/Queries/useRencanaStudiQueries.jsx`
```javascript
export const useRencanaStudiListAll = () => {
  return useQuery({
    queryKey: ["rencanaStudi", "all"],
    queryFn: async () => {
      const res = await RencanaStudiApi.getAllRencanaStudi();
      return res.data || [];  // Tanpa pagination!
    },
    gcTime: 5 * 60 * 1000,
  });
};
```

### Fix 2: Update MahasiswaDetail.jsx (SUDAH DITERAPKAN)
**File**: `/src/pages/Admin/MahasiswaDetail.jsx` line 1-23
```javascript
import { useRencanaStudiListAll } from "@/Utils/Queries/useRencanaStudiQueries";

// Di component:
const { data: rencanaStudiList = [] } = useRencanaStudiListAll();
```

### Fix 3: Upgrade Helper Functions (SUDAH DITERAPKAN)
**File**: `/src/Utils/Helpers/MahasiswaHelpers.jsx`

Sekarang support 3 struktur data:
1. `mahasiswaIds` array
2. `mahasiswa` object/array
3. `mahasiswaId` field

---

## 📝 COMMANDS UNTUK QUICK DEBUG

```javascript
// 1. Full system debug
fullDebug()

// 2. Check specific mahasiswa
checkMahasiswa('A13.2020.00001')

// 3. Debug individual data
debugRencanaStudi()
debugMataKuliah()
debugSksCalculation('A13.2020.00001')

// 4. Force clear and reload
localStorage.clear(); location.reload();
```

---

## 🎯 EXPECTED RESULTS SETELAH FIX

### Before Fix ❌
```
List View:
  - Bela Putra: Status = Aktif

Detail View:
  - Status = Tidak Aktif
  - SKS = 0
  - Nilai = Tidak ada data
```

### After Fix ✅
```
List View:
  - Bela Putra: Status = Aktif

Detail View:
  - Status = Aktif
  - SKS = 22
  - Nilai = [calculated] atau "Menunggu nilai"
```

---

## 💡 NOTES

1. **Cache Issue**: React Query cache 5 menit. Jika tidak berubah, lakukan hardrefresh.
2. **Data Validation**: Pastikan db.json memiliki data rencana studi untuk mahasiswa ini.
3. **Browser DevTools**: Console sangat membantu untuk debug struktur data sebenarnya.
4. **Network Tab**: Gunakan untuk verifikasi data yang di-fetch dari server.

---

## ❓ FAQ DEBUGGING

**Q: Output menunjukkan "Rencana studi ditemukan: 0"**
A: Berarti mahasiswa ID tidak cocok dengan struktur rencana studi. Check struktur data di db.json.

**Q: Total SKS tetap 0 setelah fix**
A: Kemungkinan:
1. Data rencana studi belum di-populate ke database
2. Mata kuliah tidak ditemukan (mataKuliahId tidak match)
3. Helper function menggunakan struktur data yang berbeda

**Q: Status berubah jadi Aktif tapi kemudian berubah Tidak Aktif**
A: Cache issue. Lakukan:
```javascript
localStorage.clear(); location.reload();
```

**Q: Component tidak re-render setelah data berubah**
A: Pastikan menggunakan hook yang benar dan depend on correct queryKey.

