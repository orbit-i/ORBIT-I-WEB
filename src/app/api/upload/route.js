import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let buffer = null;
    let fileName = '';
    let ext = 'png';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') || formData.get('image');
      if (!file || typeof file === 'string') {
        return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      const originalName = file.name || 'image.png';
      ext = path.extname(originalName).replace('.', '').toLowerCase() || 'png';
    } else if (contentType.includes('application/json')) {
      const body = await request.json();
      if (!body.image) {
        return NextResponse.json({ error: 'No base64 image data provided' }, { status: 400 });
      }
      const match = body.image.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (match) {
        ext = match[1] === 'jpeg' ? 'jpg' : match[1];
        buffer = Buffer.from(match[2], 'base64');
      } else {
        buffer = Buffer.from(body.image, 'base64');
      }
    } else {
      return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
    }

    // Validate image format
    const allowed = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
    if (!allowed.includes(ext.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid file format. Allowed: PNG, JPG, WEBP, SVG, GIF.' }, { status: 400 });
    }

    // Size limit 10MB
    if (buffer.length > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }

    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    fileName = `orbit-${uniqueId}.${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${fileName}`,
        fileName,
        sizeBytes: buffer.length,
      });
    } catch (fsErr) {
      console.warn('Filesystem write failed, falling back to base64 data URI:', fsErr.message);
      // Fallback: return data URI so image works even on read-only environments
      const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      const dataUri = `data:${mime};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        fileName,
        sizeBytes: buffer.length,
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Error uploading image' }, { status: 500 });
  }
}
