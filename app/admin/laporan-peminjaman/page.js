'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Link from 'next/link'

export default function LaporanPeminjamanAdmin() {
  const [peminjaman, setPeminjaman] = useState([])
  const [now] = useState(new Date())

  useEffect(() => {
    const fetchPeminjaman = async () => {
      const snapshot = await getDocs(collection(db, 'peminjaman'))
      const data = snapshot.docs.map(doc => {
        const d = doc.data()
        const jatuhTempo = new Date(d.tanggalJatuhTempo)
        const terlambat = now > jatuhTempo && d.status === 'belum'
        const denda = terlambat
          ? Math.floor((now - jatuhTempo) / (1000 * 60 * 60 * 24)) * 1000
          : 0

        return {
          id: doc.id,
          ...d,
          tanggalJatuhTempo: d.tanggalJatuhTempo,
          terlambat,
          denda,
        }
      })
      setPeminjaman(data)
    }

    fetchPeminjaman()
  }, [now])

  const updateStatus = async (peminjamanItem, status) => {
    try {
      const peminjamanRef = doc(db, 'peminjaman', peminjamanItem.id)

      // Update status peminjaman
      await updateDoc(peminjamanRef, { status })

      // Jika status "sudah", tambahkan stok buku
      if (status === 'sudah') {
        const bukuRef = doc(db, 'buku', peminjamanItem.bukuId)
        const bukuSnap = await getDoc(bukuRef)
        if (bukuSnap.exists()) {
          const bukuData = bukuSnap.data()
          const stokBaru = (bukuData.stok || 0) + 1
          await updateDoc(bukuRef, { stok: stokBaru })
        }
      }

      // Update tampilan lokal
      setPeminjaman(prev =>
        prev.map(p => p.id === peminjamanItem.id ? { ...p, status } : p)
      )
      alert('Status dan stok berhasil diperbarui.')
    } catch (error) {
      console.error('❌ Gagal memperbarui status:', error)
      alert('Terjadi kesalahan saat memperbarui status.')
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Laporan Peminjaman</h1>

      <Link href="/dashboard">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Kembali ke Dashboard
        </button>
      </Link>

      {peminjaman.length === 0 ? (
        <p className="text-gray-500 text-center">Belum ada data peminjaman.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#f5d9d9] text-left">
                <th className="p-3">Nama</th>
                <th className="p-3">Buku</th>
                <th className="p-3">Tanggal Pinjam</th>
                <th className="p-3">Jatuh Tempo</th>
                <th className="p-3">Status</th>
                <th className="p-3">Denda</th>
                <th className="p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {peminjaman.map(p => (
                <tr key={p.id} className="border-t">
                  <td className="p-3">{p.nama}</td>
                  <td className="p-3">{p.judul}</td>
                  <td className="p-3">{p.tanggalPinjam}</td>
                  <td className="p-3">{p.tanggalJatuhTempo}</td>
                  <td className={`p-3 font-semibold ${p.status === 'belum' ? 'text-red-600' : 'text-green-600'}`}>
                    {p.status === 'belum' ? 'Belum Dikembalikan' : 'Sudah Dikembalikan'}
                  </td>
                  <td className="p-3 text-sm">
                    {p.terlambat ? (
                      <span className="text-red-600 font-bold">Rp {p.denda.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-500 italic">-</span>
                    )}
                  </td>
                  <td className="p-3 space-x-2">
                    <button
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      onClick={() => updateStatus(p, 'sudah')}
                    >
                      Sudah
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      onClick={() => updateStatus(p, 'belum')}
                    >
                      Belum
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
