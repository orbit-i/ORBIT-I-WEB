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
    const { name, role, department, startDate, endDate, duration, certificateCode } = body;

    if (!name || !role || !department || !startDate || !endDate || !duration || !certificateCode) {
      return NextResponse.json({ error: 'All certificate fields are required' }, { status: 400 });
    }

    const upperCode = certificateCode.trim().toUpperCase();

    const [existing] = await pool.query(
      'SELECT id FROM intern_certificates WHERE certificate_code = ?',
      [upperCode]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Certificate code already exists' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO intern_certificates 
       (name, role, department, start_date, end_date, duration, status, certificate_code, issued_by, issued_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'COMPLETED', ?, 'ORBIT-I Private Limited', CURDATE(), NOW())`,
      [name, role, department, startDate, endDate, duration, upperCode]
    );

    return new Response(`Certificate created successfully with code: ${upperCode}`, { status: 201 });
  } catch (error) {
    console.error('Create certificate error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating certificate' }, { status: 500 });
  }
}
