import { NextResponse } from 'next/server';
import { updateChatbotQA, deleteChatbotQA } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateChatbotQA(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Q&A item not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, qa: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await deleteChatbotQA(id);
    return NextResponse.json({ success: true, message: 'Q&A deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
