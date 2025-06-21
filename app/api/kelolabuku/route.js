// app/api/kelolabuku/route.js

import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

// GET: Ambil semua buku dari Firestore
export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, 'books'))
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    return new Response(JSON.stringify(books), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal mengambil data buku', detail: error.message }), {
      status: 500,
    })
  }
}

// POST: Tambah buku baru ke Firestore
export async function POST(request) {
  try {
    const body = await request.json()
    const requiredFields = ['judul', 'penulis', 'tahun', 'bahasa', 'stok', 'detail', 'cover']

    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({ error: `Field ${field} wajib diisi.` }), {
          status: 400,
        })
      }
    }

    const newDoc = await addDoc(collection(db, 'books'), body)

    return new Response(JSON.stringify({ message: 'Buku berhasil ditambahkan', id: newDoc.id }), {
      status: 201,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Gagal menambahkan buku', detail: error.message }), {
      status: 500,
    })
  }
}
