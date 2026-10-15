import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { getAdminUsers } from '@/server/utils/cmsStorage';

export async function GET() {
  try {
    let adminCount = 0;
    try {
      const [rows] = await pool.query("SELECT COUNT(*) as count FROM client_information WHERE role = 'ADMIN'");
      adminCount = Number(rows[0]?.count || 0);
    } catch {
      adminCount = 0;
    }

    if (adminCount === 0) {
      const fallbackAdmins = await getAdminUsers();
      adminCount = fallbackAdmins.length;
    }

    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount,
    });
  } catch (error) {
    const fallbackAdmins = await getAdminUsers();
    return NextResponse.json({
      setupRequired: fallbackAdmins.length === 0,
      adminCount: fallbackAdmins.length,
    });
  }
}
