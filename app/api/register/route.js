import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const filePath = path.join(process.cwd(), 'app', 'data', 'users.json')

export async function POST(req) {
  const body = await req.json()
  const { nama, username, password, whatsapp } = body

  // Baca file JSON
  const raw = fs.readFileSync(filePath)
  const users = JSON.parse(raw)

  // Cek apakah username sudah ada
  const exist = users.find((u) => u.username === username)
  if (exist) {
    return NextResponse.json({ message: 'Username sudah digunakan' }, { status: 400 })
  }

  // Tambahkan user baru
  const newUser = {
    nama,
    username,
    password,
    whatsapp,
    role: 'pengunjung', // Set default role
  }

  users.push(newUser)
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2))

  return NextResponse.json({ message: 'Akun berhasil dibuat', user: newUser }, { status: 201 })
}
