import AxiosInstance from "../AxiosInstance";

// Ambil semua mahasiswa
export const getAllMahasiswa = () => AxiosInstance.get("/mahasiswa");

// Ambil 1 mahasiswa
export const getMahasiswa = (id) => AxiosInstance.get(`/mahasiswa/${id}`);

// Ambil 1 mahasiswa by ID (alias untuk getMahasiswa)
export const getMahasiswaById = (id) => AxiosInstance.get(`/mahasiswa/${id}`);

// Ambil mahasiswa berdasarkan NIM (robust: try direct id then query by nim)
export const getMahasiswaByNim = async (nim) => {
	try {
		// Try direct id lookup first
		const res = await AxiosInstance.get(`/mahasiswa/${nim}`);
		// If found, return object-style response
		return { data: res.data };
	} catch (err) {
		// Fallback to query by nim
		const res = await AxiosInstance.get('/mahasiswa', { params: { nim } });
		return { data: res.data && res.data.length ? res.data[0] : null };
	}
};

// Tambah mahasiswa
export const storeMahasiswa = (data) => AxiosInstance.post("/mahasiswa", data);

// Update mahasiswa
export const updateMahasiswa = (id, data) => AxiosInstance.put(`/mahasiswa/${id}`, data);

// Hapus mahasiswa
export const deleteMahasiswa = (id) => AxiosInstance.delete(`/mahasiswa/${id}`);

// Delete mahasiswa by nim: find record by nim, then delete by actual id
export const deleteMahasiswaByNim = async (nim) => {
	// Try to get by direct id first
	try {
		// If a record exists with id === nim
		await AxiosInstance.get(`/mahasiswa/${nim}`);
		return await AxiosInstance.delete(`/mahasiswa/${nim}`);
	} catch (err) {
		// Otherwise search by nim
		const res = await AxiosInstance.get('/mahasiswa', { params: { nim } });
		const found = res.data && res.data.length ? res.data[0] : null;
		if (!found) throw new Error('Mahasiswa tidak ditemukan');
		return await AxiosInstance.delete(`/mahasiswa/${found.id}`);
	}
};
