import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAdmin } from '@/lib/authServer';

export async function PATCH(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;
    const body = await request.json();
    const { progress, status } = body;

    const [projects] = await pool.query('SELECT id FROM project_details WHERE id = ?', [id]);
    if (projects.length === 0) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const parsedProgress = parseInt(progress, 10);
    const validProgress = isNaN(parsedProgress) ? 0 : Math.min(100, Math.max(0, parsedProgress));

    await pool.query(
      `UPDATE project_details 
       SET progress_percentage = ?, status = COALESCE(?, status), updated_at = NOW()
       WHERE id = ?`,
      [validProgress, status || null, id]
    );

    return new Response('Progress updated successfully', { status: 200 });
  } catch (error) {
    console.error('updateProgress error:', error);
    return NextResponse.json({ error: error.message || 'Server error updating progress' }, { status: 500 });
  }
}
