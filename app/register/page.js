'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import Link from 'next/link'

export default function RegisterPage() {
  const [nama, setNama] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()

    try {
      const q = query(collection(db, 'users'), where('username', '==', username))
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        alert('Username sudah terdaftar!')
        return
      }

      const newUser = {
        nama,
        username,
        password,
        whatsapp,
        role: 'pengunjung'
      }

      await addDoc(collection(db, 'users'), newUser)
      alert('Akun berhasil didaftarkan!')
      router.push('/login')
    } catch (err) {
      console.error('Gagal mendaftar:', err)
      alert('Terjadi kesalahan saat daftar.')
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Gradasi background maroon ke putih */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-[#4f0a0b] to-white" />

      {/* Box form register */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg shadow-xl rounded-3xl max-w-md w-full p-8 border border-white/20">
        <h1 className="text-3xl font-bold text-white text-center mb-6">Daftar Akun Baru</h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            placeholder="Nama Lengkap"
            required
            className="w-full p-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300"
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full p-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300"
          />
          <input
            type="text"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Nomor WhatsApp"
            required
            className="w-full p-2 border border-white/30 rounded-lg bg-white/10 text-white placeholder-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-[#4f0a0b] text-white font-semibold py-2 rounded-lg hover:bg-[#351f21] transition"
          >
            Daftar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-white">
          Sudah punya akun?{' '}
          <Link href="/login" className="underline hover:text-gray-300">
            Masuk di sini
          </Link>
        </p>
      </div>

      {/* Animasi gradasi */}
      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientFlow 10s ease infinite;
        }
        @keyframes gradientFlow {
          0%, 100% {
            background-position: left bottom;
          }
          50% {
            background-position: right top;
          }
        }
      `}</style>
    </main>
  )
}
