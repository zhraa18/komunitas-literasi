'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '../lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const q = query(
        collection(db, 'users'),
        where('username', '==', username),
        where('password', '==', password)
      )
      const snapshot = await getDocs(q)

      if (!snapshot.empty) {
        const userDoc = snapshot.docs[0]
        const userData = userDoc.data()

        localStorage.setItem('userId', userDoc.id)
        localStorage.setItem('loggedInUser', JSON.stringify(userData))

        router.push('/dashboard')
      } else {
        alert('Username atau password salah!')
      }
    } catch (error) {
      console.error('❌ Login gagal:', error)
      alert('Terjadi kesalahan saat login.')
    }
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-[#4f0a0b] to-white" />

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl max-w-md w-full p-8">
        <h2 className="text-3xl font-bold text-white mb-6 text-center font-droid">
          Masuk ke Komunitas
        </h2>

        <form onSubmit={handleLogin} className="space-y-5 font-droid">
          <div>
            <label className="block text-sm text-white mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/60"
              placeholder="nama_kamu"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-white mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-white/30 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/60"
              placeholder="********"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4f0a0b] text-white font-semibold py-2 rounded-xl hover:bg-[#2d0809] transition"
          >
            Masuk
          </button>
        </form>

        {/* BOX ESTETIK INFO ADMIN */}
        <div className="mt-6 text-xs text-white bg-white/10 border border-white/20 rounded-xl p-3 text-center backdrop-blur-md shadow-inner">
          <p className="opacity-80">🔐 <span className="font-medium">Info Akun Admin</span></p>
          <p className="opacity-70">Username: <code className="text-white">admin</code></p>
          <p className="opacity-70">Password: <code className="text-white">admin123</code></p>
        </div>

        <p className="mt-6 text-center text-sm text-gray-200">
          Belum punya akun?{' '}
          <Link href="/register" className="text-white underline hover:text-gray-300">
            Daftar Sekarang
          </Link>
        </p>
      </div>

      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientFlow 10s ease infinite;
        }
        @keyframes gradientFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </main>
  )
}
