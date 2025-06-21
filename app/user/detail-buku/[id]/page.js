'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { db } from '../../../lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function DetailBukuPage() {
  const { id } = useParams()
  const [buku, setBuku] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const docRef = doc(db, 'buku', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setBuku(docSnap.data())
        }
      }
    }
    fetchData()
  }, [id])

  if (!buku) {
    return <p className="text-center mt-10 text-gray-500">Memuat data buku...</p>
  }

  return (
    <main className="min-h-screen bg-[#fff5f5] px-4 py-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <Link href="../buku-tersedia" className="flex items-center text-[#4f090b] hover:underline mb-6">
          <ArrowLeft className="mr-2" />
          Kembali ke Daftar Buku
        </Link>

        <div className="bg-white rounded-3xl shadow-lg border border-[#f5c7c7] overflow-hidden">
          {/* Cover */}
          <div className="w-full h-[400px] bg-[#fff5f5] relative flex justify-center items-center">
            <Image
              src={buku.cover?.startsWith('http') ? buku.cover : '/book-placeholder.png'}
              alt={buku.judul}
              width={250}
              height={350}
              className="rounded-xl shadow-md object-contain"
            />
          </div>

          {/* Detail Box */}
          <div className="grid md:grid-cols-2 gap-6 p-6">
            {/* Kiri: Info Buku */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[#4f090b]">{buku.judul}</h2>
              <p><span className="font-semibold text-[#4f090b]">Penulis:</span> {buku.penulis}</p>
              <p><span className="font-semibold text-[#4f090b]">Tahun:</span> {buku.tahun}</p>
              <p><span className="font-semibold text-[#4f090b]">Bahasa:</span> {buku.bahasa || 'Tidak tersedia'}</p>
              <p><span className="font-semibold text-[#4f090b]">Halaman:</span> {buku.halaman || 'Tidak diketahui'}</p>
              <p><span className="font-semibold text-[#4f090b]">Stok:</span> {buku.stok || 0}</p>
            </div>

            {/* Kanan: Deskripsi */}
            <div className="bg-[#fff9f9] p-4 border border-[#f0dada] rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-[#4f090b] mb-2">Deskripsi</h3>
              <p className="text-gray-700 leading-relaxed">
                {buku.detail || 'Deskripsi belum tersedia untuk buku ini.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
