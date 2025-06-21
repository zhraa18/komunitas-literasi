'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { db } from '../../lib/firebase'
import { doc, getDoc, updateDoc, collection, addDoc } from 'firebase/firestore'

export default function FormPeminjaman() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bukuId = searchParams.get('id')

  const [buku, setBuku] = useState(null)
  const [form, setForm] = useState({
    nama: '',
    alamat: '',
    telepon: ''
  })

  useEffect(() => {
    const fetchBuku = async () => {
      if (bukuId) {
        const docRef = doc(db, 'buku', bukuId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setBuku({ id: docSnap.id, ...docSnap.data() })
        }
      }
    }

    fetchBuku()
  }, [bukuId])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!buku) return

    try {
      // Hitung tanggal pinjam dan jatuh tempo
      const tanggalPinjam = new Date()
      const tanggalJatuhTempo = new Date(tanggalPinjam)
      tanggalJatuhTempo.setDate(tanggalPinjam.getDate() + 7) // 7 hari ke depan

      const formatTanggal = (date) => {
        return date.toISOString().split('T')[0] // hasil: YYYY-MM-DD
      }

      // 1. Tambah ke koleksi peminjaman
      await addDoc(collection(db, 'peminjaman'), {
        userId: localStorage.getItem('userId'),
        bukuId: buku.id,
        judul: buku.judul,
        nama: form.nama,
        alamat: form.alamat,
        noTelepon: form.telepon,
        tanggalPinjam: formatTanggal(tanggalPinjam),
        tanggalJatuhTempo: formatTanggal(tanggalJatuhTempo),
        status: 'belum'
      })

      // 2. Kurangi stok buku
      const bukuRef = doc(db, 'buku', buku.id)
      await updateDoc(bukuRef, {
        stok: buku.stok - 1
      })

      alert('Peminjaman berhasil!')
      router.push('/user/riwayat-peminjaman')
    } catch (error) {
      console.error('❌ Gagal menyimpan:', error)
      alert('Gagal melakukan peminjaman.')
    }
  }

  if (!buku) return <p className="text-center mt-10">Memuat detail buku...</p>

  return (
    <div className="max-w-xl mx-auto py-10 px-6 bg-white shadow-md mt-10 rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#4f090b]">Formulir Peminjaman Buku</h1>

      <div className="mb-4">
        <p><strong>Judul Buku:</strong> {buku.judul}</p>
        <p><strong>Stok Tersisa:</strong> {buku.stok}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama lengkap"
          className="w-full border px-4 py-2 rounded"
          value={form.nama}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="alamat"
          placeholder="Alamat"
          className="w-full border px-4 py-2 rounded"
          value={form.alamat}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="telepon"
          placeholder="Nomor Telepon"
          className="w-full border px-4 py-2 rounded"
          value={form.telepon}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Pinjam Buku
        </button>
      </form>
    </div>
  )
}
