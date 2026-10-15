import { NextResponse } from 'next/server';
import { getCertificateByCode } from '@/server/utils/cmsStorage';

const formatDate = (d) => {
  if (!d) return null;
  try {
    return new Date(d).toISOString().split('T')[0];
  } catch {
    return String(d);
  }
};

export async function GET(request, { params }) {
  try {
    const { code } = await params;
    if (!code) {
      return NextResponse.json({ error: 'Certificate code is required' }, { status: 400 });
    }

    const upperCode = decodeURIComponent(code).trim().toUpperCase();
    const cert = await getCertificateByCode(upperCode);

    if (!cert) {
      return NextResponse.json({ error: `Certificate not found with code : ${code}` }, { status: 404 });
    }

    return NextResponse.json({
      name: cert.name,
      role: cert.role,
      department: cert.department,
      startDate: formatDate(cert.start_date),
      endDate: formatDate(cert.end_date),
      duration: cert.duration,
      issuedBy: cert.issued_by || 'ORBIT-I Private Limited',
      status: cert.status || 'COMPLETED',
      certificateCode: cert.certificate_code,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to verify certificate at this time. Please try again later.' }, { status: 500 });
  }
}
