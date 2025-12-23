import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../db/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Mapping fakultas ke prefix NIM (simplified untuk demo)
const FAKULTAS_TO_PREFIXES = {
  'Ilmu Komputer': ['A11'], // A11: Ilmu Komputer
  'Teknik': ['A13'],        // A13: Teknik Elektro
  'Ekonomi': ['B11'],       // B11: Ekonomi Manajemen
  'Hukum': ['C11'],         // C11: Ilmu Hukum
  'Kedokteran': ['D11'],    // D11: Kedokteran Umum
};

// Group mahasiswa berdasarkan fakultas
const grouped = {};
db.mahasiswa.forEach((m) => {
  const fak = m.fakultas || 'Unknown';
  if (!grouped[fak]) grouped[fak] = [];
  grouped[fak].push(m);
});

console.log('📊 Distribusi Mahasiswa per Fakultas:');
Object.keys(grouped).forEach((fak) => {
  console.log(`   ${fak}: ${grouped[fak].length} mahasiswa`);
});
console.log('');

// Update NIM dengan prefix yang sesuai
let updated = 0;
Object.keys(grouped).forEach((fakultas) => {
  const students = grouped[fakultas];
  const prefixes = FAKULTAS_TO_PREFIXES[fakultas];
  
  if (!prefixes || prefixes.length === 0) {
    console.log(`⚠️  Fakultas "${fakultas}" tidak memiliki mapping prefix, dilewati.`);
    return;
  }

  // Distribusi merata untuk fakultas dengan multiple prefix
  const studentsPerPrefix = Math.ceil(students.length / prefixes.length);
  
  students.forEach((m, idx) => {
    const prefixIndex = Math.floor(idx / studentsPerPrefix);
    const newPrefix = prefixes[prefixIndex] || prefixes[0];
    
    // Parse NIM lama: A11.2020.00001 -> ["A11", "2020", "00001"]
    const oldParts = (m.nim || '').split('.');
    if (oldParts.length >= 3) {
      const [oldPrefix, year, number] = oldParts;
      const newNim = `${newPrefix}.${year}.${number}`;
      
      if (oldPrefix !== newPrefix) {
        m.nim = newNim;
        m.id = newNim; // Update ID juga karena biasanya sama dengan NIM
        updated++;
      }
    }
  });
  
  console.log(`✅ ${fakultas}: ${students.length} mahasiswa didistribusikan ke prefix ${prefixes.join(', ')}`);
});

// Write back to db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');

console.log('');
console.log(`✨ Selesai! ${updated} mahasiswa berhasil diupdate.`);
console.log('');
console.log('📋 Distribusi Final:');
// Count by new prefix
const prefixCount = {};
db.mahasiswa.forEach((m) => {
  const prefix = (m.nim || '').split('.')[0];
  prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
});
Object.keys(prefixCount).sort().forEach((prefix) => {
  console.log(`   ${prefix}: ${prefixCount[prefix]} mahasiswa`);
});
