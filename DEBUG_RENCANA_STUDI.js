/**
 * DEBUG SCRIPT - Untuk cek data rencana studi
 * Paste di browser console (F12) untuk debug
 */

// ============================================
// 1. CEK DATA RENCANA STUDI
// ============================================
async function debugRencanaStudi() {
  console.clear();
  console.log("%c=== DEBUG RENCANA STUDI ===\n", "color: blue; font-weight: bold; font-size: 16px");

  try {
    const response = await fetch('/rencanaStudi');
    const data = await response.json();
    const rencanaStudi = Array.isArray(data) ? data : data.data || [];

    console.log(`%cTotal rencana studi: ${rencanaStudi.length}\n`, "color: green; font-weight: bold");

    // Cek struktur data
    if (rencanaStudi.length > 0) {
      console.log("%cSample struktur data:\n", "color: orange; font-weight: bold");
      console.log(JSON.stringify(rencanaStudi[0], null, 2));
    }

    // Cek rencana studi untuk mahasiswa tertentu
    const mahasiswaId = "A13.2020.00001";
    const filtered = rencanaStudi.filter(rs => {
      // Check berbagai struktur
      if (rs.mahasiswaIds?.includes?.(mahasiswaId)) return true;
      if (rs.mahasiswa?.some?.(m => 
        typeof m === 'string' ? m === mahasiswaId : m.id === mahasiswaId
      )) return true;
      if (rs.mahasiswaId === mahasiswaId) return true;
      return false;
    });

    console.log(`\n%cRencana studi untuk ${mahasiswaId}: ${filtered.length} found\n`, "color: green; font-weight: bold");
    if (filtered.length > 0) {
      console.log("Daftar rencana studi:");
      filtered.forEach((rs, idx) => {
        console.log(`  ${idx + 1}. ID: ${rs.id}, Mata Kuliah: ${rs.mataKuliahId}`);
      });
    }

    return rencanaStudi;
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// 2. CEK DATA MATA KULIAH
// ============================================
async function debugMataKuliah() {
  console.clear();
  console.log("%c=== DEBUG MATA KULIAH ===\n", "color: blue; font-weight: bold; font-size: 16px");

  try {
    const response = await fetch('/mataKuliah');
    const data = await response.json();
    const mataKuliah = Array.isArray(data) ? data : data.data || [];

    console.log(`%cTotal mata kuliah: ${mataKuliah.length}\n`, "color: green; font-weight: bold");

    if (mataKuliah.length > 0) {
      console.log("%cSample struktur data:\n", "color: orange; font-weight: bold");
      console.log(JSON.stringify(mataKuliah[0], null, 2));
    }

    return mataKuliah;
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// 3. SIMULASI PERHITUNGAN SKS
// ============================================
async function debugSksCalculation(mahasiswaId = "A13.2020.00001") {
  console.clear();
  console.log(`%c=== DEBUG SKS CALCULATION untuk ${mahasiswaId} ===\n`, "color: blue; font-weight: bold; font-size: 16px");

  try {
    // Fetch data
    const rsResponse = await fetch('/rencanaStudi');
    const rsData = await rsResponse.json();
    const rencanaStudi = Array.isArray(rsData) ? rsData : rsData.data || [];

    const mkResponse = await fetch('/mataKuliah');
    const mkData = await mkResponse.json();
    const mataKuliah = Array.isArray(mkData) ? mkData : mkData.data || [];

    // Filter rencana studi
    const filtered = rencanaStudi.filter(rs => {
      if (rs.mahasiswaIds?.includes?.(mahasiswaId)) return true;
      if (rs.mahasiswa?.some?.(m => 
        typeof m === 'string' ? m === mahasiswaId : m.id === mahasiswaId
      )) return true;
      if (rs.mahasiswaId === mahasiswaId) return true;
      return false;
    });

    console.log(`%cRencana studi ditemukan: ${filtered.length}\n`, "color: green");

    // Hitung SKS
    let totalSks = 0;
    filtered.forEach((rs, idx) => {
      const mk = mataKuliah.find(m => m.id === rs.mataKuliahId);
      const sks = mk ? mk.sks : 0;
      totalSks += sks;
      console.log(`${idx + 1}. MK: ${mk?.nama || rs.mataKuliahId} (ID: ${rs.mataKuliahId}), SKS: ${sks}`);
    });

    console.log(`\n%cTotal SKS: ${totalSks}\n`, "color: green; font-weight: bold; font-size: 14px");
    console.log(`%cStatus: ${totalSks > 0 ? "AKTIF ✅" : "TIDAK AKTIF ❌"}\n`, 
      totalSks > 0 ? "color: green; font-weight: bold" : "color: red; font-weight: bold");

  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// 4. FULL DEBUG
// ============================================
async function fullDebug() {
  console.clear();
  console.log("%c╔════════════════════════════════════╗", "color: blue; font-weight: bold; font-size: 14px");
  console.log("%c║       FULL SYSTEM DEBUG            ║", "color: blue; font-weight: bold; font-size: 14px");
  console.log("%c╚════════════════════════════════════╝\n", "color: blue; font-weight: bold; font-size: 14px");

  const rs = await debugRencanaStudi();
  console.log("\n" + "=".repeat(50) + "\n");
  
  const mk = await debugMataKuliah();
  console.log("\n" + "=".repeat(50) + "\n");
  
  await debugSksCalculation("A13.2020.00001");

  console.log("\n%c✅ Debug Complete\n", "color: green; font-weight: bold");
}

// ============================================
// 5. CUSTOM MAHASISWA CHECK
// ============================================
async function checkMahasiswa(mahasiswaId) {
  console.log(`\n%cChecking: ${mahasiswaId}\n`, "color: purple; font-weight: bold");
  await debugSksCalculation(mahasiswaId);
}

// ============================================
// EXPORT / GLOBAL FUNCTIONS
// ============================================

if (typeof window !== 'undefined') {
  window.debugRencanaStudi = debugRencanaStudi;
  window.debugMataKuliah = debugMataKuliah;
  window.debugSksCalculation = debugSksCalculation;
  window.fullDebug = fullDebug;
  window.checkMahasiswa = checkMahasiswa;

  console.log("%c📌 DEBUG FUNCTIONS LOADED\n\nAvailable functions:", "color: blue; font-weight: bold; font-size: 12px");
  console.log("  - debugRencanaStudi()         : Cek data rencana studi");
  console.log("  - debugMataKuliah()            : Cek data mata kuliah");
  console.log("  - debugSksCalculation()        : Simulasi perhitungan SKS");
  console.log("  - fullDebug()                  : Jalankan semua debug");
  console.log("  - checkMahasiswa(nim)          : Check mahasiswa tertentu\n");
  console.log("Contoh: fullDebug() atau checkMahasiswa('A13.2020.00001')");
}

export { debugRencanaStudi, debugMataKuliah, debugSksCalculation, fullDebug, checkMahasiswa };
