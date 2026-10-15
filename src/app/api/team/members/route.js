import { NextResponse } from 'next/server';
import { getTeamMembers, saveTeamMember } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const members = await getTeamMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.name || !body.designation) {
      return NextResponse.json({ error: 'Name and designation are required' }, { status: 400 });
    }

    const saved = await saveTeamMember(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: error.message || 'Failed to create team member' }, { status: 500 });
  }
}
