import { NextResponse } from 'next/server';
import { getMaintenanceConfig } from '@/server/utils/cmsStorage';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getMaintenanceConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      {
        enabled: false,
        error: error.message,
      },
      { status: 200 }
    );
  }
}

