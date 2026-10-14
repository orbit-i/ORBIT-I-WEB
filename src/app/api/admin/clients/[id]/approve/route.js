import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAdmin } from '@/lib/authServer';

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { id } = await params;

    const [clients] = await pool.query('SELECT id FROM client_information WHERE id = ?', [id]);
    if (clients.length === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    await pool.query('UPDATE client_information SET approved = 1 WHERE id = ?', [id]);

    return new Response('Client approved successfully', { status: 200 });
  } catch (error) {
    console.error('approveClient error:', error);
    return NextResponse.json({ error: error.message || 'Server error approving client' }, { status: 500 });
  }
}
