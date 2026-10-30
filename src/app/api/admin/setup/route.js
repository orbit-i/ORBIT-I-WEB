import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      error: 'Security Lockout: Public administrator setup is permanently disabled. Administrator accounts can only be created by an authenticated SuperAdmin inside the Control Vault.',
    },
    { status: 403 }
  );
}
