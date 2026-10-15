import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { saveCertificate, getCertificateByCode } from '@/server/utils/cmsStorage';

export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name, role, department, startDate, endDate, duration, certificateCode } = body;

    if (!name || !role || !department || !startDate || !endDate || !duration || !certificateCode) {
      return NextResponse.json({ error: 'All certificate fields are required' }, { status: 400 });
    }

    const upperCode = certificateCode.trim().toUpperCase();

    // Check if code already exists in DB or fallback
    const existing = await getCertificateByCode(upperCode);
    if (existing) {
      return NextResponse.json({ error: `Certificate code ${upperCode} already exists` }, { status: 400 });
    }

    const cert = await saveCertificate({
      name: name.trim(),
      role: role.trim(),
      department: department.trim(),
      startDate,
      endDate,
      duration: duration.trim(),
      certificateCode: upperCode,
      status: 'COMPLETED',
      issuedBy: 'ORBIT-I Private Limited',
    });

    return new Response(`Certificate created successfully with code: ${upperCode}`, { status: 201 });
  } catch (error) {
    console.error('Create certificate error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating certificate' }, { status: 500 });
  }
}
