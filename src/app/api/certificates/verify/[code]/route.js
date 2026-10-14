import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';

const formatDate = (d) => (d ? new Date(d).toISOString().split('T')[0] : null);

export async function GET(request, { params }) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ error: 'Certificate code is required' }, { status: 400 });
    }

    const upperCode = code.trim().toUpperCase();
    const [rows] = await pool.query(
      `SELECT name, role, department, start_date, end_date, duration, status, certificate_code, issued_by
       FROM intern_certificates
       WHERE certificate_code = ?`,
      [upperCode]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: `Certificate not found with code : ${code}` }, { status: 400 });
    }

    const cert = rows[0];

    return NextResponse.json({
      name: cert.name,
      role: cert.role,
      department: cert.department,
      startDate: formatDate(cert.start_date),
      endDate: formatDate(cert.end_date),
      duration: cert.duration,
      issuedBy: cert.issued_by || 'ORBIT-I Private Limited',
      status: cert.status,
      certificateCode: cert.certificate_code,
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return NextResponse.json({ error: error.message || 'Server error verifying certificate' }, { status: 500 });
  }
}
