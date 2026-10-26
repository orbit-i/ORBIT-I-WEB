import { NextResponse } from 'next/server';
import { saveInquiry } from '@/server/utils/cmsStorage';
import { sendContactEmail } from '@/server/utils/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, service, message, utm } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const saved = await saveInquiry({
      name: name.trim(),
      email: email.trim(),
      company: (company || '').trim(),
      service: (service || '').trim(),
      message: message.trim(),
      utm: utm || {},
    });

    sendContactEmail({ name, email, company, service, message, utm }).catch((err) => {
      console.warn('Mail dispatch note:', err.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will contact you within 24 hours.',
      inquiry: saved,
    }, { status: 201 });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    return NextResponse.json({ error: 'Unable to submit inquiry at this moment. Please email contactus@orbit-i.tech directly.' }, { status: 500 });
  }
}
