// app/api/upload/route.js

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), {
      status: 400,
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (err, result) => {
        if (err) {
          reject(
            new Response(JSON.stringify({ error: 'Upload failed' }), {
              status: 500,
            })
          );
        } else {
          resolve(
            new Response(JSON.stringify({ url: result.secure_url }), {
              status: 200,
            })
          );
        }
      })
      .end(buffer);
  });
}
