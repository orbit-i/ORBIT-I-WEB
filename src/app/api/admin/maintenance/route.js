import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { getMaintenanceConfig, saveMaintenanceConfig } from '@/server/utils/cmsStorage';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const config = getMaintenanceConfig();
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const updated = saveMaintenanceConfig(body);

    return NextResponse.json({
      success: true,
      message: updated.enabled
        ? 'Maintenance mode activated with custom route visibility rules'
        : 'Maintenance mode deactivated. All website pages are live online.',
      config: updated,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  return POST(request);
}

