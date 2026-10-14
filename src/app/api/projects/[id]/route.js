import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAuth } from '@/lib/authServer';
import { formatProject } from '@/server/controllers/projectController';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const [rows] = await pool.query('SELECT * FROM project_details WHERE id = ?', [id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const project = rows[0];

    if (auth.user.role !== 'ADMIN' && project.client_id !== auth.user.id) {
      return NextResponse.json({ error: 'Unauthorized to view this project' }, { status: 403 });
    }

    const [milestones] = await pool.query(
      'SELECT * FROM project_milestones WHERE project_id = ? ORDER BY sequence_number',
      [id]
    );

    return NextResponse.json(formatProject(project, milestones));
  } catch (error) {
    console.error('getProject error:', error);
    return NextResponse.json({ error: error.message || 'Server error loading project' }, { status: 500 });
  }
}
