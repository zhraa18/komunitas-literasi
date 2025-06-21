'use client'

import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import Link from 'next/link'

export default function RiwayatPeminjamanUser() {
  const [data, setData] = useState([])
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const uid = localStorage.getItem('userId') // pastikan userId tersimpan di localStorage
    setUserId(uid)
  }, [])

  useEffect(() => {
    if (!userId) return

    const q = query(collection(db, 'peminjaman'), where('userId', '==', userId))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setData(data)
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [userId])

  return (
    <div className="min-h-screen p-8 bg-[#fdf8f8]">
      <h1 className="text-2xl font-bold mb-6 text-center text-[#4f090b]">Riwayat Peminjaman Anda</h1>

      <Link href="/dashboard">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Kembali ke Dashboard
        </button>
      </Link>

      {data.length === 0 ? (
        <p className="text-center text-gray-500">Belum ada riwayat peminjaman.</p>
      ) : (
        <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-[#f5d9d9] text-left">
              <th className="p-3">Judul Buku</th>
              <th className="p-3">Tanggal Pinjam</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3">{item.judul}</td>
                <td className="p-3">{item.tanggalPinjam}</td>
                <td
                  className={`p-3 font-semibold text-sm 
                    ${
                      item.status === 'belum'
                        ? 'text-red-600 bg-red-50 px-2 py-1 rounded'
                        : 'text-green-600 bg-green-50 px-2 py-1 rounded'
                    }
                  `}
                >
                  {item.status === 'belum' ? 'Belum Dikembalikan' : 'Sudah Dikembalikan'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
