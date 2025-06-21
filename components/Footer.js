import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#351f21] text-[#E8e4db] mt-16">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6 text-sm">
        
        {/* Info Komunitas */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Komunitas Literasi</h4>
          <p className="mb-2">
            Menyebarkan semangat membaca dan menulis lewat pertemuan literasi rutin.
          </p>
          <p>&copy; {new Date().getFullYear()} Komunitas Literasi</p>
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Navigasi</h4>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
            <li><Link href="/katalog" className="hover:text-white transition">Katalog Buku</Link></li>
            <li><Link href="/register" className="hover:text-white transition">Daftar Akun</Link></li>
            <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Hubungi Kami</h4>
          <ul className="space-y-2">
            <li>📍 Lokasi: Rumah Literasi, Yogyakarta</li>
            <li>📧 Email: komunitasliterasi@email.com</li>
            <li>📱 WhatsApp: <a href="https://wa.me/6281234567890" target="_blank" className="hover:text-white transition">+62 812-3456-7890</a></li>
          </ul>
        </div>
      </div>

      {/* Bar bawah */}
      <div className="text-center py-4 bg-[#4f090b] text-white text-xs">
        Dibuat dengan ❤️ oleh Tim Komunitas Literasi
      </div>
    </footer>
  )
}
