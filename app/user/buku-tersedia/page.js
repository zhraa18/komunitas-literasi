'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CornerUpLeft, Search } from 'lucide-react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function BukuTersedia() {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksRef = collection(db, 'buku')
        const snapshot = await getDocs(booksRef)

        const booksData = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(book => book.stok > 0)

        setBooks(booksData)
        setFilteredBooks(booksData)
      } catch (error) {
        console.error('❌ Error fetch buku:', error)
      }
    }

    fetchBooks()
  }, [])

  useEffect(() => {
    const filtered = books.filter((b) =>
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.penulis.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredBooks(filtered)
  }, [search, books])

  return (
    <div className="min-h-screen bg-[#fff5f5] px-4 sm:px-8 py-10 relative">
      {/* Tombol kembali */}
      <Link href="/dashboard" className="absolute top-6 left-6">
        <button title="Kembali">
          <CornerUpLeft className="w-6 h-6 text-[#4f090b] hover:text-gray-700" />
        </button>
      </Link>

      {/* Judul Halaman */}
      <h1 className="text-3xl font-bold text-[#4f090b] mb-6 text-center font-droid">Daftar Buku Tersedia</h1>

      {/* Form Pencarian */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau penulis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4f090b]/50 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Daftar Buku */}
      {filteredBooks.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada buku ditemukan.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredBooks.map((buku) => (
            <div
              key={buku.id}
              className="bg-white rounded-2xl shadow-md border border-[#f0dada] overflow-hidden transition hover:shadow-lg"
            >
              <div className="w-full h-60 bg-white flex items-center justify-center overflow-hidden">
  <Image
    src={buku.cover?.startsWith('http') ? buku.cover : '/book-placeholder.png'}
    alt={buku.judul}
    width={160}
    height={240}
    className="object-contain max-h-full"
  />
</div>


              <div className="p-4 space-y-2">
                <h2 className="text-lg font-semibold text-[#4f090b]">{buku.judul}</h2>
                <p className="text-sm text-gray-700">Penulis: {buku.penulis}</p>
                <p className="text-sm text-gray-700">Tahun: {buku.tahun}</p>
                {buku.bahasa && <p className="text-sm text-gray-700">Bahasa: {buku.bahasa}</p>}
                {buku.stok && <p className="text-sm text-gray-700">Stok: {buku.stok}</p>}

                <div className="pt-3 flex gap-2">
                  <Link href={`/user/peminjaman?id=${buku.id}`}>
                    <button className="bg-green-600 text-white px-4 py-1.5 rounded hover:bg-green-700 text-sm">
                      Pinjam
                    </button>
                  </Link>
                  <Link href={`/user/detail-buku/${buku.id}`}>
                    <button className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm">
                      Detail
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
