import { NextResponse } from 'next/server';
import { servicesList } from '@/data/servicesData';
import fs from 'fs';
import path from 'path';
import { verifyAdmin } from '@/lib/authServer';

const OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'servicesOverrides.json');

function getMergedServices() {
  let overrides = {};
  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
    }
  } catch {}

  return servicesList.map((svc) => {
    if (overrides[svc.slug]) {
      return { ...svc, ...overrides[svc.slug] };
    }
    return svc;
  });
}

export async function GET() {
  const list = getMergedServices();
  return NextResponse.json(list, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      'X-Cache': 'DYNAMIC',
    },
  });
}

export async function PUT(request) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const updatedService = await request.json();
    if (!updatedService || !updatedService.slug) {
      return NextResponse.json({ error: 'Service slug required' }, { status: 400 });
    }

    let overrides = {};
    try {
      if (fs.existsSync(OVERRIDES_FILE)) {
        overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
      }
    } catch {}

    overrides[updatedService.slug] = {
      ...(overrides[updatedService.slug] || {}),
      ...updatedService,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(overrides, null, 2), 'utf-8');

    return NextResponse.json({
      message: 'Service details and SEO metadata updated successfully.',
      service: overrides[updatedService.slug],
    });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Error updating service' }, { status: 500 });
  }
}
