import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAdmin } from '@/lib/authServer';

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { title, description, dueDate, sequenceNumber, projectId } = body;

    if (!title || !description || !projectId) {
      return NextResponse.json({ error: 'Title, description, and projectId are required' }, { status: 400 });
    }

    const [projects] = await pool.query('SELECT id FROM project_details WHERE id = ?', [projectId]);
    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await pool.query(
      `INSERT INTO project_milestones
       (title, description, due_date, sequence_number, project_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'PENDING', CURDATE())`,
      [title, description, dueDate || null, sequenceNumber || 1, projectId]
    );

    return new Response('Milestone added successfully', { status: 200 });
  } catch (error) {
    console.error('addMilestone error:', error);
    return NextResponse.json({ error: error.message || 'Server error adding milestone' }, { status: 500 });
  }
}
