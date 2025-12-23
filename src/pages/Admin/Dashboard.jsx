import React from 'react';
import Card from '../Layouts/Components/atoms/Card';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useMahasiswaList } from '../../Utils/Queries/useMahasiswaQueries';
import { useDosenList } from '../../Utils/Queries/useDosenQueries';
import { useMataKuliahList } from '../../Utils/Queries/useMataKuliahQueries';
import { useKelasList } from '../../Utils/Queries/useKelasQueries';

const Dashboard = () => {
  // Fetch data from all entities (use large pageSize to get all records for charts)
  const { data: mahasiswaResult } = useMahasiswaList(1, 2000);
  const { data: dosenResult } = useDosenList(1, 200);
  const { data: mataKuliahResult } = useMataKuliahList(1, 100);
  const { data: kelasResult } = useKelasList(1, 100);

  const mahasiswa = mahasiswaResult?.data || [];
  const dosen = dosenResult?.data || [];
  const mataKuliah = mataKuliahResult?.data || [];
  const kelas = kelasResult?.data || [];

  // === DATA PROCESSING ===

  // 1. Mahasiswa per Fakultas (BarChart)
  const mahasiswaPerFakultas = (() => {
    const grouped = {};
    mahasiswa.forEach((m) => {
      const fak = m.fakultas || 'Tidak Ditentukan';
      grouped[fak] = (grouped[fak] || 0) + 1;
    });
    return Object.entries(grouped).map(([fakultas, count]) => ({
      fakultas,
      jumlah: count,
    }));
  })();

  // 2. Rasio Gender Mahasiswa (PieChart)
  const genderRatio = (() => {
    let laki = 0, perempuan = 0;
    mahasiswa.forEach((m) => {
      if (m.gender === 'Laki-laki') laki++;
      else if (m.gender === 'Perempuan') perempuan++;
    });
    return [
      { name: 'Laki-laki', value: laki },
      { name: 'Perempuan', value: perempuan },
    ];
  })();

  // 3. Tren Pendaftaran Mahasiswa (LineChart)
  const trendPendaftaran = (() => {
    const grouped = {};
    mahasiswa.forEach((m) => {
      const tahun = m.tahun_masuk || 2020;
      grouped[tahun] = (grouped[tahun] || 0) + 1;
    });
    return Object.entries(grouped)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([tahun, count]) => ({
        tahun,
        jumlah: count,
      }));
  })();

  // 4. Nilai Mahasiswa per Fakultas (BarChart Horizontal)
  const nilaiPerFakultas = (() => {
    const grouped = {};
    mahasiswa.forEach((m) => {
      const fakultas = m.fakultas || 'Tidak Ditentukan';
      if (!grouped[fakultas]) {
        grouped[fakultas] = { A: 0, B: 0, C: 0 };
      }
      const nilai = m.nilai_akhir || 'C';
      if (nilai === 'A') grouped[fakultas].A++;
      else if (nilai === 'B') grouped[fakultas].B++;
      else grouped[fakultas].C++;
    });
    return Object.entries(grouped).map(([fakultas, values]) => ({
      fakultas,
      A: values.A,
      B: values.B,
      C: values.C,
    }));
  })();

  // 5. Pangkat Dosen (AreaChart)
  const pangkatDosen = (() => {
    const grouped = {};
    dosen.forEach((d) => {
      const pangkat = d.pangkat || 'Tidak Ditentukan';
      grouped[pangkat] = (grouped[pangkat] || 0) + 1;
    });
    return Object.entries(grouped).map(([pangkat, count]) => ({
      pangkat,
      jumlah: count,
    }));
  })();

  // Colors palette
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  // Statistik Ringkas
  const stats = [
    {
      label: 'Total Mahasiswa',
      value: mahasiswa.length,
      color: 'bg-blue-500',
      icon: '👥',
    },
    {
      label: 'Total Dosen',
      value: dosen.length,
      color: 'bg-green-500',
      icon: '👨‍🏫',
    },
    {
      label: 'Mata Kuliah',
      value: mataKuliah.length,
      color: 'bg-yellow-500',
      icon: '📚',
    },
    {
      label: 'Total Kelas',
      value: kelas.length,
      color: 'bg-purple-500',
      icon: '🏛️',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Akademik</h1>
        <p className="text-gray-600 mt-1">Visualisasi data akademik dan statistik keseluruhan</p>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`${stat.color} rounded-lg p-6 text-white shadow-lg hover:shadow-xl transition`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium opacity-90">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bar - Mahasiswa per Fakultas */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">📊 Mahasiswa per Fakultas</h2>
            <p className="text-sm text-gray-500">Distribusi jumlah mahasiswa di setiap fakultas</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={mahasiswaPerFakultas} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="fakultas" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                formatter={(value) => [`${value} mahasiswa`, 'Jumlah']}
              />
              <Bar dataKey="jumlah" fill="#3B82F6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 2: Pie - Rasio Gender */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">👫 Rasio Gender Mahasiswa</h2>
            <p className="text-sm text-gray-500">Perbandingan mahasiswa laki-laki dan perempuan</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={genderRatio}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {genderRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                formatter={(value) => `${value} orang`}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 3: Line - Tren Pendaftaran */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">📈 Tren Pendaftaran Mahasiswa</h2>
            <p className="text-sm text-gray-500">Pertumbuhan jumlah mahasiswa baru per tahun</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trendPendaftaran}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="tahun"
                label={{ value: 'Tahun Masuk', position: 'insideBottom', offset: -5 }}
              />
              <YAxis label={{ value: 'Jumlah Mahasiswa', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                formatter={(value) => `${value} mahasiswa`}
              />
              <Line 
                type="monotone" 
                dataKey="jumlah" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 4: Stacked Bar - Nilai Mahasiswa per Fakultas */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">📊 Distribusi Nilai per Fakultas</h2>
            <p className="text-sm text-gray-500">Sebaran nilai A, B, C di setiap fakultas</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart 
              data={nilaiPerFakultas}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="fakultas"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                formatter={(value) => `${value} mahasiswa`}
              />
              <Legend />
              <Bar dataKey="A" fill="#10B981" name="Nilai A" stackId="a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="B" fill="#F59E0B" name="Nilai B" stackId="a" radius={[8, 8, 0, 0]} />
              <Bar dataKey="C" fill="#EF4444" name="Nilai C" stackId="a" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Chart 5: Area - Pangkat Dosen */}
        <Card className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">🎓 Distribusi Pangkat Dosen</h2>
            <p className="text-sm text-gray-500">Jumlah dosen berdasarkan pangkat akademik</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart 
              data={pangkatDosen}
              margin={{ top: 20, right: 30, left: 0, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="pangkat"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#FFF' }}
                formatter={(value) => `${value} dosen`}
              />
              <Area 
                type="monotone" 
                dataKey="jumlah" 
                stroke="#8B5CF6" 
                fill="#8B5CF6" 
                fillOpacity={0.6}
                name="Jumlah Dosen"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Summary Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Ringkasan Data</h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Total Mahasiswa</span>
              <span className="font-semibold text-gray-800">{mahasiswa.length}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Total Dosen</span>
              <span className="font-semibold text-gray-800">{dosen.length}</span>
            </div>
            <div className="flex justify-between border-b pb-3">
              <span className="text-gray-600">Total Mata Kuliah</span>
              <span className="font-semibold text-gray-800">{mataKuliah.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Kelas</span>
              <span className="font-semibold text-gray-800">{kelas.length}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-800 mb-4">ℹ️ Informasi Sistem</h3>
          <div className="space-y-3">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
              <p className="text-xs font-medium text-blue-900">Tahun Akademik</p>
              <p className="text-lg font-bold text-blue-700">2025/2026</p>
            </div>
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
              <p className="text-xs font-medium text-green-900">Status Sistem</p>
              <p className="text-lg font-bold text-green-700">✓ Aktif & Berjalan</p>
            </div>
            <div className="bg-purple-50 border-l-4 border-purple-500 p-3 rounded">
              <p className="text-xs font-medium text-purple-900">Semester Berjalan</p>
              <p className="text-lg font-bold text-purple-700">Semester Ganjil</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
