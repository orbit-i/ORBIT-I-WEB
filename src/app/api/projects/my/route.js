import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAuth } from '@/lib/authServer';
import { formatProject } from '@/server/controllers/projectController';

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const clientId = auth.user.id;

    const [projects] = await pool.query(
      'SELECT * FROM project_details WHERE client_id = ? ORDER BY id',
      [clientId]
    );

    if (projects.length === 0) {
      return NextResponse.json([]);
    }

    const projectIds = projects.map((p) => p.id);
    const [milestones] = await pool.query(
      `SELECT * FROM project_milestones WHERE project_id IN (?) ORDER BY sequence_number`,
      [projectIds]
    );

    const milestonesByProject = {};
    milestones.forEach((m) => {
      if (!milestonesByProject[m.project_id]) milestonesByProject[m.project_id] = [];
      milestonesByProject[m.project_id].push(m);
    });

    const response = projects.map((p) =>
      formatProject(p, milestonesByProject[p.id] || [])
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error('getMyProjects error:', error);
    return NextResponse.json({ error: error.message || 'Server error loading projects' }, { status: 500 });
  }
}
