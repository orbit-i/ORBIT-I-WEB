import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Please upload a valid PDF or text file' }, { status: 400 });
    }

    const fileName = file.name || 'document';
    const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let extractedText = '';
    let numPages = 1;

    if (fileName.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf') {
      try {
        const pdfParse = require('pdf-parse');
        const parsed = await pdfParse(buffer);
        extractedText = parsed.text || '';
        numPages = parsed.numpages || 1;
      } catch (parseErr) {
        console.error('PDF parse error:', parseErr);
        return NextResponse.json(
          { error: `Could not parse PDF content: ${parseErr.message}. Make sure the PDF is not password-protected.` },
          { status: 400 }
        )
      }
    } else {
      // Plain text, markdown, or JSON
      extractedText = buffer.toString('utf8');
    }

    // Clean up excessive whitespace or formatting
    const cleanedText = extractedText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (!cleanedText) {
      return NextResponse.json(
        { error: 'The uploaded file contains no readable text or is an image-only scanned document.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      title: cleanTitle,
      content_text: cleanedText,
      numPages,
      wordCount: cleanedText.split(/\s+/).filter(Boolean).length,
      fileName,
    });
  } catch (error) {
    console.error('Upload PDF route error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing file' }, { status: 500 });
  }
}

