import { NextResponse } from 'next/server';
import { getCareersJobs, saveCareerJob } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const jobs = await getCareersJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching careers jobs:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch jobs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.title || !body.department) {
      return NextResponse.json({ error: 'Title and department are required' }, { status: 400 });
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const saved = await saveCareerJob({ ...body, slug });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating career job:', error);
    return NextResponse.json({ error: error.message || 'Failed to create job' }, { status: 500 });
  }
}
