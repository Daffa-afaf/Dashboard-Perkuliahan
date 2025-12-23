import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../db/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

console.log('🔄 Clearing mahasiswaIds dari semua kelas...');
console.log('');

// Clear semua mahasiswaIds dari kelas
db.kelas.forEach(k => {
  const before = (k.mahasiswaIds || []).length;
  k.mahasiswaIds = [];
  k.mahasiswa = [];
  console.log(`   ${k.nama}: ${before} mahasiswa dihapus`);
});

// Clear semua rencanaStudi
if (db.rencanaStudi && Array.isArray(db.rencanaStudi)) {
  const before = db.rencanaStudi.length;
  db.rencanaStudi = [];
  console.log(`   RencanaStudi: ${before} entries dihapus`);
}

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log('');
console.log('✨ Selesai! Semua kelas sekarang kosong dan siap untuk diisi ulang.');
console.log('');
console.log('📝 Gunakan UI Rencana Studi untuk menambahkan mahasiswa ke kelas.');
