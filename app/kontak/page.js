'use client'
// pages/contact.js
import Image from 'next/image'

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#fff5f5] flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-[#4f0a0b] mb-6">👩‍💻 Biodata & Kontak</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col items-center">
        <Image
          src="/me.png" 
          alt="Foto Profil"
          width={150}
          height={150}
          className="rounded-full mb-4 object-cover"
        />
        <h2 className="text-xl font-semibold text-[#4f0a0b] mb-1">Fatimah Zahra (Zahraa)</h2>
        <p className="text-gray-700 mb-4 text-sm">Mahasiswa Sistem Informasi | Pengembang Web |</p>

        <div className="w-full text-left text-sm text-gray-600 space-y-2">
          <p><span className="font-semibold">📍 Alamat:</span> Bandung, Indonesia</p>
          <p><span className="font-semibold">📧 Email:</span> zaraazahh@email.com</p>
          <p><span className="font-semibold">📱 No HP:</span> 08xxxxxxxxxx</p>
          <p><span className="font-semibold">🌐 Website:</span> komunitas-literasi.vercel.app</p>
        </div>
      </div>

      <a
        href="/"
        className="mt-6 text-sm text-[#4f0a0b] underline hover:text-[#2d0809]"
      >
        ← Kembali ke Dashboard
      </a>
    </div>
  )
}
