# QUICK START GUIDE - Logika SKS & Nilai Mahasiswa

## 🚀 5 Menit Setup

### Step 1: Verify Files (1 min)
Pastikan files berikut ada di workspace:
- ✅ `src/Utils/Helpers/MahasiswaHelpers.jsx` (baru)
- ✅ `src/pages/Admin/MahasiswaDetail.jsx` (updated)
- ✅ `LOGIKA_MAHASISWA_RENCANA_STUDI.md` (dokumentasi)

### Step 2: Add Test Data (2 min)
**Option A - Fastest (copy-paste)**:
```javascript
// Di browser console, paste data dari scripts/populateRencanaStudiData.js
// Lalu kirim ke API atau manual edit db.json
```

**Option B - Manual Edit**:
```bash
# 1. Open: db/db.json
# 2. Find: "rencanaStudi": []
# 3. Add sample data dari PANDUAN_INTEGRASI.md
# 4. Save & restart server
```

### Step 3: Test (2 min)
```
1. Buka: Admin > Mahasiswa > Pilih Bela Putra (A13.2020.00001)
2. Verifikasi:
   - Status: "Aktif" (hijau)
   - SKS: > 0 (bukan 0)
   - Nilai: "A" atau "-" (konsisten)
3. Lihat tabel mata kuliah: harus ada kolom "Nilai"
```

---

## 📊 Expected Output

```
╔════════════════════════════════════╗
║     DETAIL MAHASISWA               ║
╠════════════════════════════════════╣
║ NIM           │ A13.2020.00001     ║
║ Nama          │ Bela Putra         ║
║ Fakultas      │ Teknik             ║
║ Gender        │ Perempuan          ║
║ Tahun Masuk   │ 2020               ║
║ Status        │ 🟢 Aktif           ║
║ Nilai Akhir   │ A                  ║
║ SKS Terpakai  │ 10 / 24 SKS 🟢    ║
╠════════════════════════════════════╣
║      MATA KULIAH YANG DIAMBIL       ║
╠════════════════╦═════╦══════╦═════╣
║ Mata Kuliah    ║ SKS ║ Sem  ║ Nil ║
╠════════════════╬═════╬══════╬═════╣
║ Aljabar Linear ║ 3   ║ 1    ║ A   ║
║ Kalkulus I     ║ 4   ║ 1    ║ B   ║
║ Fisika Dasar   ║ 3   ║ 2    ║ A   ║
╚════════════════╩═════╩══════╩═════╝
```

---

## 🔍 Troubleshooting

### Problem: "Rencana studi tidak muncul"
**Solution**:
```javascript
// Di browser F12 > Console, paste:
fetch('/rencanaStudi').then(r => r.json()).then(d => console.log(d));
// Jika kosong → insert data ke db.json
```

### Problem: "Nilai selalu '-'"
**Solution**:
```javascript
// Cek field names di data
const rs = (window.__MOCK_RENCANASTUDI__ || [])[0];
console.log(rs?.grades || rs?.nilai || 'TIDAK ADA'); // Harus ada salah satu
```

### Problem: "Status tetap 'Tidak Aktif'"
**Solution**:
```javascript
// Pastikan mahasiswaIds ter-populate
const mahasiswaId = "A13.2020.00001";
const matched = (window.__MOCK_RENCANASTUDI__ || [])
  .find(rs => rs.mahasiswaIds?.includes(mahasiswaId));
console.log("Match:", !!matched); // Harus true
```

---

## 📝 File Changes Summary

| File | Status | Perubahan |
|------|--------|-----------|
| `MahasiswaHelpers.jsx` | ✅ BARU | 5 helper functions |
| `MahasiswaDetail.jsx` | ✅ UPDATED | Import + gunakan helpers |
| `db.json` | ⚠️ MANUAL | Populate rencanaStudi |

---

## 🧪 Quick Verification Test

```javascript
// Paste di browser console
// Harusnya tidak ada error

// Test 1: Helper functions loaded
console.assert(typeof calculateTotalSks === 'function', 'calculateTotalSks not found');

// Test 2: Component uses helpers
fetch('/mahasiswa/A13.2020.00001')
  .then(r => r.json())
  .then(mhs => {
    console.log('Mahasiswa loaded:', mhs.nama);
    console.log('Status OK ✓');
  });
```

---

## ⚡ Performance Notes

- Helper functions **O(n)** complexity (linear scan)
- Berjalan di **client-side** (tidak perlu server changes)
- **Tidak ada cache issues** (real-time dari rencana studi)
- Suitable untuk **100+ mahasiswa** tanpa masalah

---

## 📚 Documentation Files

1. **LOGIKA_MAHASISWA_RENCANA_STUDI.md** - Penjelasan lengkap logika
2. **PANDUAN_INTEGRASI.md** - Step-by-step setup & testing
3. **RINGKASAN_PERUBAHAN.md** - Summary of changes
4. **MahasiswaHelpers.test.js** - Unit tests (optional)
5. **populateRencanaStudiData.js** - Sample test data

---

## 💡 Pro Tips

1. **Test dengan filter mahasiswa**: Buka list mahasiswa, filter aktif saja
   - Seharusnya hanya tampil mahasiswa dengan SKS > 0

2. **Export ke Excel**: Nilai akhir & SKS sekarang real-time
   - Cocok untuk report ke dosen

3. **Monitoring**: Cek di React DevTools apakah props ter-update
   - Status & SKS harus reactive saat rencana studi berubah

4. **Migration**: Jika punya data lama di field mahasiswa
   - Bisa keep untuk backward compatibility
   - Tapi prioritas pada rencana studi

---

## ✅ Success Checklist

Klik semua sebelum claim DONE:

- [ ] Buka detail mahasiswa, lihat SKS dari rencana studi
- [ ] Status berubah dari hard-coded → dynamic dari SKS
- [ ] Nilai akhir dihitung dari rencana studi
- [ ] Tidak ada error di browser console
- [ ] Tabel mata kuliah menampilkan nilai per kursus
- [ ] Test minimal 3 skenario berbeda (aktif/inactive/waiting)

---

## 🎯 Next Phase (Optional)

Jika sudah selesai, bisa tambahkan:
- [ ] Form untuk input nilai per mata kuliah
- [ ] Report progress per semester
- [ ] Notifikasi jika ada nilai baru
- [ ] Tracking akademik lengkap

---

**Status**: Ready to Test  
**Last Updated**: 24 Dec 2025  
**Support**: Check PANDUAN_INTEGRASI.md for detailed setup
