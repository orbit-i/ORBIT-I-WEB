import { NextResponse } from 'next/server';
import { updateCmsPage, deleteCmsPage } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateCmsPage(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating CMS page:', error);
    return NextResponse.json({ error: error.message || 'Failed to update CMS page' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await deleteCmsPage(id);
    return NextResponse.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Error deleting CMS page:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete CMS page' }, { status: 500 });
  }
}
