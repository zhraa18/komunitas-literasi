'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser')
    setIsLoggedIn(!!user)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser')
    setIsLoggedIn(false)
    router.push('/login')
  }

  const navItems = isLoggedIn
    ? [{ label: 'Logout', href: '#', action: handleLogout }]
    : [
        { label: 'Beranda', href: '/' },
        { label: 'Login', href: '/login' },
        { label: 'Daftar', href: '/register' },
        { label: 'Contact', href: '/kontak' }
      ]

  return (
    <nav className="bg-[#4f090b] text-white sticky top-0 w-full z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide hover:text-[#E8e4db] transition"
        >
          📚 Komunitas Literasi
        </Link>

        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div
          className={`${
            menuOpen ? 'block mt-4' : 'hidden'
          } md:flex gap-6 items-center md:mt-0`}
        >
          {navItems.map((item) =>
            item.action ? (
              <button
                key={item.label}
                onClick={() => {
                  item.action()
                  setMenuOpen(false)
                }}
                className="block md:inline-block px-4 py-2 rounded-md transition font-medium hover:bg-[#E8e4db] hover:text-[#4f090b]"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`block md:inline-block px-4 py-2 rounded-md transition font-medium hover:bg-[#E8e4db] hover:text-[#4f090b] ${
                  pathname === item.href ? 'bg-[#E8e4db] text-[#4f090b]' : ''
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
