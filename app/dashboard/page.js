'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/login')
    }
  }, [router])

  if (user === null) return null

  const roleMenus = {
    admin: [
      { id: '01', desc: 'Kelola Buku', href: '/admin/kelola-buku' },
      { id: '02', desc: 'Laporan Peminjaman', href: '/admin/laporan-peminjaman' },
      { id: '03', desc: 'Keterlambatan pengembalian', href: '/admin/keterlambatan' },
      { id: '04', desc: 'Grafik Peminjaman', href: '/admin/grafik-peminjaman' },
    ],
    pengunjung: [
      { id: '01', desc: 'Pinjam Buku', href: '/user/buku-tersedia' },
      { id: '02', desc: 'Riwayat Peminjaman', href: '/user/riwayat-peminjaman' },
    ],
  }

  const userMenus = roleMenus[user.role] || []

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-gradient-to-br from-white via-[#fcecec] to-[#f3d5d5]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#4f090b] text-white p-6 shadow-xl flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-6 leading-tight">
            Komunitas Literasi
          </h2>
          <p className="text-sm text-gray-300">
            "Membangun budaya baca dan saling berbagi ilmu dalam komunitas yang hangat."
          </p>
        </div>
        <div className="text-xs text-center text-gray-400 mt-10">&copy; 2025 Komunitas Literasi</div>
      </aside>

      {/* Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-12">
        {/* Right Side Welcome Text */}
        <div className="flex flex-col justify-center items-start text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#4f090b] leading-tight mb-6 drop-shadow">
            Selamat Datang di Dashboard {user.role}
          </h1>
          <p className="text-base md:text-lg text-gray-700 max-w-md">
            Halo, <span className="font-bold text-[#4f090b]">{user.nama}</span>. Silakan akses fitur-fitur sesuai peranmu melalui menu di sebelah kiri.
          </p>
        </div>

        {/* Left Side Numbered Boxes as Menu */}
        <div className="space-y-6 flex flex-col justify-center">
          {userMenus.map((item) => (
            <a
              key={item.id}
              href={item.href}
              className="bg-[#6d1e23] text-white rounded-xl shadow-lg p-6 flex items-center gap-6 hover:scale-[1.03] transition-transform hover:bg-[#851f25]"
            >
              <div className="text-4xl font-extrabold text-white w-12">{item.id}</div>
              <p className="text-base leading-snug">{item.desc}</p>
            </a>
          ))}
        </div>
      </main>
    </div>
  )
}
