import { NextResponse } from 'next/server';
import { servicesList } from '@/data/servicesData';
import fs from 'fs';
import path from 'path';

const OVERRIDES_FILE = path.join(process.cwd(), 'src', 'data', 'servicesOverrides.json');

export async function GET(request, { params }) {
  const { slug } = await params;
  
  let svc = servicesList.find((s) => s.slug === slug);
  if (!svc) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  try {
    if (fs.existsSync(OVERRIDES_FILE)) {
      const overrides = JSON.parse(fs.readFileSync(OVERRIDES_FILE, 'utf-8'));
      if (overrides[slug]) {
        svc = { ...svc, ...overrides[slug] };
      }
    }
  } catch {}

  return NextResponse.json(svc, {
    headers: {
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
    },
  });
}
