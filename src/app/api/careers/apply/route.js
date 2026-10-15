import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { pool } from '@/server/config/db';
import { sendCareerApplicationEmail } from '@/server/utils/mailer';

export async function POST(request) {
  try {
    const formData = await request.formData();

    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const phone = formData.get('phone')?.toString().trim();
    const city = formData.get('city')?.toString().trim() || 'Not specified';
    const roleId = formData.get('roleId')?.toString().trim();
    const roleTitle = formData.get('roleTitle')?.toString().trim() || 'General Position';
    const category = formData.get('category')?.toString().trim() || 'internship';
    const linkedin = formData.get('linkedin')?.toString().trim() || '';
    const coverNote = formData.get('coverNote')?.toString().trim() || '';

    const cvFile = formData.get('cv');

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Name, email, and contact number are required.' }, { status: 400 });
    }

    if (!cvFile || typeof cvFile === 'string' || cvFile.size === 0) {
      return NextResponse.json({ error: 'Please upload a valid CV / Resume file (PDF, DOC, DOCX).' }, { status: 400 });
    }

    // Validate file type
    const originalName = cvFile.name || 'Resume.pdf';
    const ext = path.extname(originalName).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx'];

    if (!allowedExts.includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF, DOC, and DOCX files are accepted.' }, { status: 400 });
    }

    // Limit to 10MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (cvFile.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
    }

    // Prepare upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const sanitizedBase = name.replace(/[^a-zA-Z0-9]/g, '_');
    const cvFileName = `${sanitizedBase}_CV_${Date.now()}${ext}`;
    const cvFilePath = path.join(uploadDir, cvFileName);

    const buffer = Buffer.from(await cvFile.arrayBuffer());
    fs.writeFileSync(cvFilePath, buffer);

    const cvUrl = `/uploads/cvs/${cvFileName}`;

    const applicationSummary = `--- CAREER APPLICATION ---
Position: ${roleTitle} (${category.toUpperCase()})
Candidate: ${name}
Email: ${email}
Phone: ${phone}
City: ${city}
LinkedIn / Portfolio: ${linkedin || 'None'}
CV File: ${cvUrl}
---------------------------
Candidate Cover Note:
${coverNote || 'No additional note provided.'}
`.trim();

    // 1. Save to Database (contact_inquiries)
    try {
      await pool.query(
        `INSERT INTO contact_inquiries (name, email, company, service, message, status, created_at)
         VALUES (?, ?, ?, ?, ?, 'NEW', NOW())`,
        [name, email, city, `Career Application: ${roleTitle}`, applicationSummary]
      );
    } catch (dbErr) {
      console.warn('DB inquiry insertion fallback:', dbErr.message);
      // Also write to local fallback so inquiries tab in admin always has it
      const fallbackFile = path.join(process.cwd(), 'src', 'data', 'cmsStorageFallback.json');
      try {
        if (fs.existsSync(fallbackFile)) {
          const store = JSON.parse(fs.readFileSync(fallbackFile, 'utf8'));
          if (!store.contact_inquiries) store.contact_inquiries = [];
          store.contact_inquiries.unshift({
            id: Date.now(),
            name,
            email,
            company: city,
            service: `Career Application: ${roleTitle}`,
            message: applicationSummary,
            status: 'NEW',
            created_at: new Date().toISOString(),
          });
          fs.writeFileSync(fallbackFile, JSON.stringify(store, null, 2), 'utf8');
        }
      } catch (fErr) {
        console.error('Fallback save error:', fErr);
      }
    }

    // 2. Dispatch Email with CV attached
    sendCareerApplicationEmail({
      name,
      email,
      phone,
      city,
      roleTitle,
      category,
      linkedin,
      coverNote,
      cvFilePath,
      cvFileName,
      cvUrl,
    }).catch((mailErr) => {
      console.error('Mail delivery warning:', mailErr.message);
    });

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully. Your CV has been received by our hiring team.',
      cvUrl,
    }, { status: 201 });
  } catch (error) {
    console.error('Career application submission error:', error);
    return NextResponse.json({ error: error.message || 'Server error processing application' }, { status: 500 });
  }
}
