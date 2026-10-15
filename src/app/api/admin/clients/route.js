import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { verifyAdmin } from '@/lib/authServer';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    let rows = [];
    try {
      const [dbRows] = await pool.query(
        `SELECT id, name, email, phone, company, approved, role, created_at
         FROM client_information
         ORDER BY created_at DESC`
      );
      rows = dbRows || [];
    } catch (dbErr) {
      console.warn('MySQL clients query unavailable, returning empty list:', dbErr.message);
      rows = [];
    }

    const response = rows.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company,
      approved: Boolean(c.approved),
      role: c.role,
      createdAt: c.created_at,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error('getAllClients error:', error);
    return NextResponse.json([]);
  }
}
