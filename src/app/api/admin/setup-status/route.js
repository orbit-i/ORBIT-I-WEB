import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    setupRequired: false,
    isLocked: true,
    adminCount: 1,
  });
}
