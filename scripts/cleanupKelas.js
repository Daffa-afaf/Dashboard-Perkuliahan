import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../db/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Jurusan yang tetap dipakai (5 jurusan)
const ACTIVE_JURUSAN = [
  'Ilmu Komputer',
  'Teknik Elektro',
  'Ekonomi Manajemen',
  'Ilmu Hukum',
  'Kedokteran Umum'
];

console.log('📋 Kelas sebelum cleanup:');
db.kelas.forEach(k => {
  console.log(`   ${k.kode} - ${k.nama} (${k.jurusan})`);
});
console.log('');

// Filter hanya kelas dengan jurusan yang aktif
const kelasAwal = db.kelas.length;
db.kelas = db.kelas.filter(k => ACTIVE_JURUSAN.includes(k.jurusan));
const kelasAkhir = db.kelas.length;

console.log(`✅ Kelas dihapus: ${kelasAwal - kelasAkhir} kelas`);
console.log('');
console.log('📋 Kelas setelah cleanup:');
db.kelas.forEach(k => {
  console.log(`   ${k.kode} - ${k.nama} (${k.jurusan})`);
});

// Juga cleanup mataKuliah yang tidak sesuai (jika ada)
if (db.mataKuliah && Array.isArray(db.mataKuliah)) {
  const mkAwal = db.mataKuliah.length;
  db.mataKuliah = db.mataKuliah.filter(mk => ACTIVE_JURUSAN.includes(mk.jurusan));
  const mkAkhir = db.mataKuliah.length;

  console.log('');
  console.log(`✅ Mata Kuliah dihapus: ${mkAwal - mkAkhir} mata kuliah`);
  console.log(`   Sisa: ${mkAkhir} mata kuliah aktif`);
} else {
  console.log('');
  console.log('⚠️  Field mataKuliah tidak ditemukan di database');
}

// Cleanup rencanaStudi yang referensi ke kelas yang dihapus (jika ada)
if (db.rencanaStudi && Array.isArray(db.rencanaStudi)) {
  const kelasIds = new Set(db.kelas.map(k => k.id));
  
  const rsAwal = db.rencanaStudi.length;
  db.rencanaStudi = db.rencanaStudi.filter(rs => kelasIds.has(rs.kelasId));
  const rsAkhir = db.rencanaStudi.length;

  console.log(`✅ Rencana Studi dibersihkan: ${rsAwal - rsAkhir} entries dihapus`);
  console.log(`   Sisa: ${rsAkhir} rencana studi aktif`);
}

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log('');
console.log('✨ Cleanup selesai! Database sudah disederhanakan ke 5 jurusan.');
