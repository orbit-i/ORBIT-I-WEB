import { NextResponse } from 'next/server';
import { getChatbotQAs, saveChatbotQA } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const qas = await getChatbotQAs();
    return NextResponse.json(qas);
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
    if (!body.question || !body.answer) {
      return NextResponse.json({ error: 'Question and Answer are required' }, { status: 400 });
    }

    const newQA = await saveChatbotQA(body);
    return NextResponse.json({ success: true, qa: newQA }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
