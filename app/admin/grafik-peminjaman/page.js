// app/admin/grafik-peminjaman/page.js
'use client'

import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, getDocs } from 'firebase/firestore'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import Link from 'next/link'

export default function GrafikPeminjaman() {
  const [data, setData] = useState([])
  const [mostBorrowed, setMostBorrowed] = useState(null)
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalBorrows, setTotalBorrows] = useState(0)

  useEffect(() => {
    const fetchPeminjaman = async () => {
      const snapshot = await getDocs(collection(db, 'peminjaman'))
      const all = snapshot.docs.map(doc => doc.data())

      const countByJudul = all.reduce((acc, curr) => {
        acc[curr.judul] = (acc[curr.judul] || 0) + 1
        return acc
      }, {})

      const chartData = Object.keys(countByJudul).map(judul => ({
        judul,
        total: countByJudul[judul],
      }))

      const sorted = [...chartData].sort((a, b) => b.total - a.total)

      setData(chartData)
      setMostBorrowed(sorted[0]?.judul || '-')
      setTotalBooks(chartData.length)
      setTotalBorrows(all.length)
    }

    fetchPeminjaman()
  }, [])

  return (
    <div className="min-h-screen bg-[#fff5f5] px-6 py-10">
      <Link href="/dashboard">
        <button className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          ← Kembali ke Dashboard
        </button>
      </Link>

      <h1 className="text-3xl font-bold text-center text-[#4f090b] mb-8">📊 Grafik Peminjaman Buku</h1>

      {data.length === 0 ? (
        <p className="text-center text-gray-600">Belum ada data peminjaman.</p>
      ) : (
        <>
          {/* Grafik */}
          <div className="bg-white p-6 rounded-xl shadow-md max-w-5xl mx-auto">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="judul" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value}x dipinjam`, 'Total']} />
                <Bar dataKey="total" fill="#4f090b" barSize={20} radius={[0, 10, 10, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Ringkasan Bawah */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="bg-[#ffdee9] text-[#4f090b] rounded-lg p-5 shadow-md flex flex-col items-center">
              <div className="text-3xl">📚</div>
              <div className="text-sm mt-2 text-gray-600">Buku Paling Banyak Dipinjam</div>
              <div className="text-xl font-bold">{mostBorrowed}</div>
            </div>

            <div className="bg-[#d0f4de] text-[#1a3e2e] rounded-lg p-5 shadow-md flex flex-col items-center">
              <div className="text-3xl">📘</div>
              <div className="text-sm mt-2 text-gray-600">Total Judul Buku Dipinjam</div>
              <div className="text-xl font-bold">{totalBooks}</div>
            </div>

            <div className="bg-[#d0e8ff] text-[#002e5d] rounded-lg p-5 shadow-md flex flex-col items-center">
              <div className="text-3xl">🔁</div>
              <div className="text-sm mt-2 text-gray-600">Total Seluruh Peminjaman</div>
              <div className="text-xl font-bold">{totalBorrows}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
