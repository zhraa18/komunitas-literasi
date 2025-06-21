// pages/api/upload.js

export const config = {
  api: {
    bodyParser: false,
  },
}

import { IncomingForm } from 'formidable'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const form = new IncomingForm({ multiples: false })
  form.uploadDir = './'
  form.keepExtensions = true

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Form parse error', error: err })
    }

    const filePath = files.file.filepath
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'cover-buku',
      })

      fs.unlinkSync(filePath)
      return res.status(200).json({ url: result.secure_url })
    } catch (uploadErr) {
      return res.status(500).json({ message: 'Cloudinary upload error', error: uploadErr })
    }
  })
}
