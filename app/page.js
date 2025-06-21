'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const bukuPreview = [
    {
      id: 1,
      judul: 'Laskar Pelangi',
      penulis: 'Andrea Hirata',
      cover: '/laskarpelangi.jpg',
    },
    {
      id: 2,
      judul: 'Bumi',
      penulis: 'Tere Liye',
      cover: '/bumi.jpg',
    },
    {
      id: 3,
      judul: 'Negeri 5 Menara',
      penulis: 'Ahmad Fuadi',
      cover: '/negeri5menara.jpg',
    },
  ]

  return (
    <main className="min-h-screen relative font-droid overflow-hidden bg-white">
      {/* Animated Maroon Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(-45deg,_#4f090b,_#751616,_#aa4b4b,_#f8dcdc)] bg-[length:400%_400%] animate-gradient-x" />

      {/* Main Content */}
      <section className="relative z-10 px-6 md:px-20 py-20">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-20">
          <div className="md:w-1/2 md:pl-8">
           <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              “<br />Komunitas Literasi Indonesia
            </h1>
            <p className="text-lg text-brown mb-6 max-w-lg">
              Menumbuhkan semangat membaca dan berbagi di tengah masyarakat.
            </p>
            <Link href="/register">
              <button className="bg-white text-[#4f090b] px-6 py-3 rounded-full hover:bg-[#e8e4db] font-medium transition">
                Daftar Sekarang
              </button>
            </Link>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/logo.png"
              width={600}
              height={500}
              alt="Hero"
              className="object-contain"
            />
          </div>
        </div>

        {/* Book Showcase Style Grid */}
        <div className="bg-white/80 rounded-3xl px-6 py-10 shadow-xl">
          <div className="text-center mb-10">
             <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              “
            </h1>
            <h2 className="text-4xl font-bold text-[#4f090b] mb-2">Perpustakaan Komunitas</h2>
            <p className="text-gray-700">Pilih buku favoritmu dan pinjam disini</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {bukuPreview.map((buku) => (
              <div
                key={buku.id}
                className="text-black p-4 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 flex flex-col items-center"
              >
                <Image
                  src={buku.cover}
                  alt={buku.judul}
                  width={200}
                  height={280}
                  className="rounded-lg object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-center mb-1">{buku.judul}</h3>
                <p className="text-sm italic text-black-200 text-center">by {buku.penulis}</p>
                <Link href={`/katalog/${buku.id}`} className="mt-3">
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tailwind Gradient Animation */}
      <style jsx>{`
        @keyframes gradientX {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </main>
  )
}
