import { NextResponse } from 'next/server';
import { updateCareerJob, deleteCareerJob } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateCareerJob(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating career job:', error);
    return NextResponse.json({ error: error.message || 'Failed to update job' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await deleteCareerJob(id);
    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting career job:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete job' }, { status: 500 });
  }
}
