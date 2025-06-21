'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, CornerUpLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export default function KelolaBuku() {
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({
    id: '',
    judul: '',
    penulis: '',
    tahun: '',
    cover: '',
    bahasa: '',
    stok: '',
    detail: '',
    file: null,
  })
  const [editMode, setEditMode] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'buku'))
        const fetchedBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBooks(fetchedBooks)
      } catch (err) {
        console.error('Gagal mengambil data buku:', err)
      }
    }
    fetchBooks()
  }, [])

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'file') {
      setForm({ ...form, file: files[0] })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

 const uploadToCloudinary = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Upload error:', errorText)
    throw new Error('Upload ke Cloudinary gagal')
  }

  const data = await res.json()
  return data.url
}


  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      let coverUrl = form.cover

      if (form.file) {
        coverUrl = await uploadToCloudinary(form.file)
      }

      const bookData = {
        judul: form.judul,
        penulis: form.penulis,
        tahun: form.tahun,
        bahasa: form.bahasa,
        stok: form.stok,
        detail: form.detail,
        cover: coverUrl,
      }

      if (editMode) {
        await updateDoc(doc(db, 'buku', form.id), bookData)
        setBooks(books.map((b) => (b.id === form.id ? { ...bookData, id: form.id } : b)))
      } else {
        const docRef = await addDoc(collection(db, 'buku'), bookData)
        setBooks([...books, { ...bookData, id: docRef.id }])
      }

      setForm({ id: '', judul: '', penulis: '', tahun: '', cover: '', bahasa: '', stok: '', detail: '', file: null })
      setEditMode(false)
      setUploading(false)
    } catch (err) {
      console.error('Gagal menyimpan ke Firestore:', err)
      alert('Gagal menyimpan ke database!')
      setUploading(false)
    }
  }

  const handleEdit = (book) => {
    setForm({ ...book, file: null })
    setEditMode(true)
  }

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'buku', id))
      setBooks(books.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Gagal menghapus buku:', err)
      alert('Gagal menghapus dari database!')
    }
  }

  return (
    <div className="min-h-screen flex font-sans bg-[#fff5f5]">
      <aside className="w-20 bg-[#4f090b] text-white flex flex-col items-center py-6 space-y-6 shadow-lg">
        <Link href="/dashboard">
          <button title="Kembali">
            <CornerUpLeft className="w-6 h-6 hover:text-gray-200" />
          </button>
        </Link>
      </aside>

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#4f090b] mb-6">Kelola Buku</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 mb-10">
          <input type="text" name="judul" value={form.judul} onChange={handleChange} placeholder="Judul Buku" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="penulis" value={form.penulis} onChange={handleChange} placeholder="Penulis" required className="w-full border px-3 py-2 rounded" />
          <input type="number" name="tahun" value={form.tahun} onChange={handleChange} placeholder="Tahun Terbit" required className="w-full border px-3 py-2 rounded" />
          <input type="text" name="bahasa" value={form.bahasa} onChange={handleChange} placeholder="Bahasa" className="w-full border px-3 py-2 rounded" />
          <input type="number" name="stok" value={form.stok} onChange={handleChange} placeholder="Stok" className="w-full border px-3 py-2 rounded" />
          <textarea name="detail" value={form.detail} onChange={handleChange} placeholder="Detail Buku" className="w-full border px-3 py-2 rounded h-24 resize-none" />

          <input type="file" name="file" accept="image/*" onChange={handleChange} className="block" />

          <button type="submit" disabled={uploading} className="bg-[#4f090b] text-white px-4 py-2 rounded hover:bg-[#351f21]">
            {editMode ? 'Update Buku' : uploading ? 'Mengunggah...' : 'Tambah Buku'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {books.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-lg shadow-md border border-[#f0dada] flex gap-4 items-start">
              <div className="w-20 h-28 bg-[#f8dcdc] rounded shadow-inner flex-shrink-0 overflow-hidden">
   <Image
  src={b.cover?.startsWith('http') ? b.cover : '/book-placeholder.png'}
  alt={b.judul}
  width={400}
  height={300}
  className="object-contain w-full h-full"
/>




              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-[#4f090b]">{b.judul}</h2>
                <p className="text-sm text-gray-600">Penulis: {b.penulis}</p>
                <p className="text-sm text-gray-600">Tahun: {b.tahun}</p>
                <p className="text-sm text-gray-600">Bahasa: {b.bahasa}</p>
                <p className="text-sm text-gray-600">Stok: {b.stok}</p>
                <p className="text-sm text-gray-700 italic mb-2">"{b.detail}"</p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(b)} className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm flex items-center gap-1">
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center gap-1">
                    <Trash2 className="w-4 h-4" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
