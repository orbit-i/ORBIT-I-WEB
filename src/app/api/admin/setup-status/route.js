import { NextResponse } from 'next/server';
import { getAdminUsers } from '@/server/utils/cmsStorage';

export async function GET() {
  try {
    const admins = await getAdminUsers();
    const adminCount = Array.isArray(admins) ? admins.length : 0;

    return NextResponse.json({
      setupRequired: adminCount === 0,
      adminCount,
    });
  } catch (error) {
    console.error('Setup status check error:', error);
    // If any unexpected failure occurs, default to false if any admin is cached or true only if definitively empty
    return NextResponse.json({
      setupRequired: false,
      adminCount: 1,
      error: error.message,
    });
  }
}

