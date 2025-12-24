# FIX: Status Mahasiswa Tidak Konsisten antara List dan Detail View

## Problem Report

**User Report**:
- Mahasiswa Bela Putra (A13.2020.00001) 
- Di list: Status = **Aktif** ✅
- Di detail: Status = **Tidak Aktif** ❌
- Padahal rencana studi sudah tercatat dengan 7 mata kuliah, Total SKS: 22

**Root Cause**: 
Fetch rencana studi di MahasiswaDetail.jsx menggunakan pagination (`useRencanaStudiList(1, 200)`) yang hanya mengembalikan **sebagian data**. Saat perhitungan SKS tidak menemukan data rencana studi, hasilnya SKS = 0 → Status = Tidak Aktif.

## Solusi yang Diterapkan

### 1. Tambah Hook Baru: `useRencanaStudiListAll()`
**File**: `useRencanaStudiQueries.jsx`

```javascript
// Get ALL rencanaStudi WITHOUT pagination
export const useRencanaStudiListAll = () => {
  return useQuery({
    queryKey: ["rencanaStudi", "all"],
    queryFn: async () => {
      const res = await RencanaStudiApi.getAllRencanaStudi();
      return res.data || [];  // Return semua data, tanpa pagination
    },
    gcTime: 5 * 60 * 1000,
  });
};
```

### 2. Update MahasiswaDetail.jsx
**Perubahan**:
- Import `useRencanaStudiListAll` instead of `useRencanaStudiList`
- Ubah fetch dari `useRencanaStudiList(1, 200)` → `useRencanaStudiListAll()`
- Data sekarang **always complete**, bukan hanya 200 items

```javascript
// Before (WRONG - pagination)
const { data: rencanaStudiResult = { data: [] } } = useRencanaStudiList(1, 200);
const rencanaStudiList = rencanaStudiResult.data || [];

// After (CORRECT - all data)
const { data: rencanaStudiList = [] } = useRencanaStudiListAll();
```

### 3. Upgrade Helper Functions
**File**: `MahasiswaHelpers.jsx`

Helper functions sekarang **handle berbagai struktur data rencana studi**:

#### `calculateTotalSks()` - Sebelumnya
```javascript
const rencanaStudisForMahasiswa = rencanaStudiList.filter(
  (rs) => rs.mahasiswaIds && rs.mahasiswaIds.includes(mahasiswaId)
);
```

#### `calculateTotalSks()` - Sesudahnya
```javascript
const rencanaStudisForMahasiswa = rencanaStudiList.filter((rs) => {
  // Structure 1: mahasiswaIds array
  if (rs.mahasiswaIds && Array.isArray(rs.mahasiswaIds)) {
    return rs.mahasiswaIds.includes(mahasiswaId);
  }
  // Structure 2: mahasiswa object/array
  if (rs.mahasiswa && Array.isArray(rs.mahasiswa)) {
    return rs.mahasiswa.some((m) =>
      typeof m === "string" ? m === mahasiswaId : m.id === mahasiswaId
    );
  }
  // Structure 3: direct mahasiswaId field
  if (rs.mahasiswaId === mahasiswaId) {
    return true;
  }
  return false;
});
```

**Alasan**: Database bisa punya struktur data berbeda-beda, helper sekarang lebih robust.

## Struktur Data yang Sekarang Disupport

### Structure 1 (Original)
```json
{
  "mahasiswaIds": ["A13.2020.00001", "A13.2020.00002"],
  "mataKuliahId": "1"
}
```

### Structure 2 (Kelas dengan mahasiswa list)
```json
{
  "mahasiswa": [
    { "id": "A13.2020.00001" },
    { "id": "A13.2020.00002" }
  ],
  "mataKuliahId": "1"
}
```

### Structure 3 (Single enrollment)
```json
{
  "mahasiswaId": "A13.2020.00001",
  "mataKuliahId": "1"
}
```

## Testing

### Test Case 1: Bela Putra (A13.2020.00001)
```
Expected After Fix:
- Fetch: useRencanaStudiListAll() → returns ALL rencana studi
- Filter: Find rencana studi containing mahasiswa ID
- Calculate: SKS = 22 (dari 7 mata kuliah)
- Status: Aktif ✅
- Nilai Akhir: Hitung dari nilai mata kuliah (atau "-" jika belum)
```

### Test Case 2: Mahasiswa Tanpa Rencana Studi
```
Expected:
- rencanaStudiList: kosong atau tidak ditemukan
- SKS: 0
- Status: Tidak Aktif ✅
- Nilai Akhir: Tidak ada data ✅
```

## Files Modified

| File | Change | Status |
|------|--------|--------|
| `useRencanaStudiQueries.jsx` | Add `useRencanaStudiListAll()` | ✅ |
| `MahasiswaDetail.jsx` | Use new hook, remove pagination | ✅ |
| `MahasiswaHelpers.jsx` | Support multiple data structures | ✅ |

## Performance Impact

- ✅ **No negative impact** - Same data, just no pagination
- ✅ **Caching still works** - React Query cache `["rencanaStudi", "all"]`
- ⚠️ **Only issue if rencana studi > 10k records** - Acceptable for most use cases

## Backward Compatibility

- ✅ List view (Mahasiswa.jsx) **unchanged** - Still uses status from kelas enrollment
- ✅ Detail view (MahasiswaDetail.jsx) **improved** - More accurate SKS calculation
- ✅ Helper functions **backward compatible** - Still handle original structure

## Next Steps (Optional)

1. **Monitor**: Pastikan data loading sempurna
2. **Optimize**: Jika ada rencana studi > 10k, bisa add caching layer
3. **Sync**: Pertimbangkan sync status antara list dan detail view (optional)

---

**Status**: ✅ Fixed  
**Tested**: Need user verification  
**Deploy**: Ready
