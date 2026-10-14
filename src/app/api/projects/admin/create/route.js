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
    const { title, description, deadline, clientId } = body;

    if (!title || !description || !deadline || !clientId) {
      return NextResponse.json({ error: 'Title, description, deadline, and clientId are required' }, { status: 400 });
    }

    const [clients] = await pool.query('SELECT id FROM client_information WHERE id = ?', [clientId]);
    if (clients.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    await pool.query(
      `INSERT INTO project_details 
       (project_title, project_description, deadline, client_id, progress_percentage, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, 'PLANING', NOW(), NOW())`,
      [title, description, deadline, clientId]
    );

    return new Response('Project created successfully', { status: 200 });
  } catch (error) {
    console.error('createProject error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating project' }, { status: 500 });
  }
}
