import { NextResponse } from 'next/server';
import { getCmsPages, saveCmsPage } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const pages = await getCmsPages();
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching CMS pages:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch CMS pages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.title || !body.slug) {
      return NextResponse.json({ error: 'Title and Slug are required' }, { status: 400 });
    }

    const saved = await saveCmsPage(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating CMS page:', error);
    return NextResponse.json({ error: error.message || 'Failed to create CMS page' }, { status: 500 });
  }
}
