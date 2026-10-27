import { NextResponse } from 'next/server';
import { getChatbotDocs, saveChatbotDoc, deleteChatbotDoc } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const docs = await getChatbotDocs();
    return NextResponse.json(docs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.title || !body.content_text) {
      return NextResponse.json({ error: 'Document title and content text are required' }, { status: 400 });
    }

    const newDoc = await saveChatbotDoc(body);
    return NextResponse.json({ success: true, doc: newDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
    }

    await deleteChatbotDoc(id);
    return NextResponse.json({ success: true, message: 'Document removed from knowledge base' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
