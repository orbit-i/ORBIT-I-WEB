import { NextResponse } from 'next/server';
import { pool } from '@/server/config/db';
import { sendContactEmail } from '@/server/utils/mailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, company, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    await pool.query(
      `INSERT INTO contact_inquiries (name, email, company, service, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'NEW', NOW())`,
      [name, email, company || null, service || null, message]
    );

    sendContactEmail({ name, email, company, service, message }).catch((err) => {
      console.error('Mail dispatch error:', err.message);
    });

    return new Response('Thank you for reaching out. We will contact you within 24 hours.', { status: 201 });
  } catch (error) {
    console.error('Contact inquiry error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing contact inquiry' }, { status: 500 });
  }
}
