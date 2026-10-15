import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT COUNT(*) as count FROM client_information WHERE role = 'ADMIN'");
    const adminCount = Number(rows[0]?.count || 0);
    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount,
    });
  } catch (error) {
    return NextResponse.json({
      setupRequired: true,
      note: 'Database offline or initial setup mode active',
    });
  }
}
