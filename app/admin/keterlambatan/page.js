'use client'

import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Link from 'next/link'

export default function KeterlambatanPengembalian() {
  const [terlambat, setTerlambat] = useState([])
  const [now] = useState(new Date())

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'peminjaman'))
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.status === 'belum')

      const terlambatData = data
        .filter(p => {
          const jatuhTempo = new Date(p.tanggalJatuhTempo)
          return now > jatuhTempo
        })
        .map(p => {
          const jatuhTempo = new Date(p.tanggalJatuhTempo)
          const selisihHari = Math.floor((now - jatuhTempo) / (1000 * 60 * 60 * 24))
          const denda = selisihHari * 1000
          return { ...p, selisihHari, denda }
        })

      setTerlambat(terlambatData)
    }

    fetchData()
  }, [now])

  return (
    <div className="min-h-screen bg-[#fff7f7] px-6 py-10">
      <h1 className="text-3xl font-bold text-center text-[#4f090b] mb-6">Keterlambatan Pengembalian</h1>

      <Link href="/dashboard">
        <button className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Kembali ke Dashboard
        </button>
      </Link>

      {terlambat.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada keterlambatan saat ini.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-[#f5d9d9]">
              <tr>
                <th className="p-3 text-left">Nama</th>
                <th className="p-3 text-left">Judul Buku</th>
                <th className="p-3 text-left">Tanggal Pinjam</th>
                <th className="p-3 text-left">Jatuh Tempo</th>
                <th className="p-3 text-left">Hari Terlambat</th>
                <th className="p-3 text-left">Denda</th>
              </tr>
            </thead>
            <tbody>
              {terlambat.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.nama}</td>
                  <td className="p-3">{item.judul}</td>
                  <td className="p-3">{item.tanggalPinjam}</td>
                  <td className="p-3">{item.tanggalJatuhTempo}</td>
                  <td className="p-3">{item.selisihHari} hari</td>
                  <td className="p-3 text-red-600 font-semibold">Rp {item.denda.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
