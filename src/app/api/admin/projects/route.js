import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAdmin } from '@/lib/authServer';
import { formatProject } from '@/server/controllers/projectController';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    let projects = [];
    try {
      const [dbProjects] = await pool.query('SELECT * FROM project_details ORDER BY id DESC');
      projects = dbProjects || [];
    } catch (dbErr) {
      console.warn('MySQL projects query unavailable, returning empty list:', dbErr.message);
      return NextResponse.json([]);
    }

    if (projects.length === 0) {
      return NextResponse.json([]);
    }

    let milestones = [];
    try {
      const projectIds = projects.map((p) => p.id);
      const [dbMilestones] = await pool.query(
        'SELECT * FROM project_milestones WHERE project_id IN (?) ORDER BY sequence_number',
        [projectIds]
      );
      milestones = dbMilestones || [];
    } catch {}

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
    console.error('getAllProjects error:', error);
    return NextResponse.json([]);
  }
}
