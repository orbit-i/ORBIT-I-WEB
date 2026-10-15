import { NextResponse } from 'next/server';
import { updateTeamMember, deleteTeamMember } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const updated = await updateTeamMember(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: error.message || 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    await deleteTeamMember(id);
    return NextResponse.json({ success: true, message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete team member' }, { status: 500 });
  }
}
