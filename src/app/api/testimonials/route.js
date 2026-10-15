import { NextResponse } from 'next/server';
import { getTestimonials, saveTestimonial } from '@/server/utils/cmsStorage';
import { verifyAdmin } from '@/lib/authServer';

export async function GET() {
  try {
    const testimonials = await getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!body.client_name || !body.content) {
      return NextResponse.json({ error: 'Client name and review content are required' }, { status: 400 });
    }

    const saved = await saveTestimonial(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: error.message || 'Failed to create testimonial' }, { status: 500 });
  }
}
