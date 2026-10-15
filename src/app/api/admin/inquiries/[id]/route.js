import { NextResponse } from 'next/server';
import { updateInquiryStatus, deleteInquiry } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    await updateInquiryStatus(id, body.status || 'CONTACTED');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json({ error: error.message || 'Failed to update inquiry' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await deleteInquiry(id);
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete inquiry' }, { status: 500 });
  }
}
