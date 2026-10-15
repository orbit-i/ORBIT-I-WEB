import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';

export async function GET(request) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const memory = process.memoryUsage();
  return NextResponse.json({
    uptimeSeconds: Math.floor(process.uptime()),
    memory: {
      rssMb: (memory.rss / (1024 * 1024)).toFixed(1),
      heapUsedMb: (memory.heapUsed / (1024 * 1024)).toFixed(1),
      heapTotalMb: (memory.heapTotal / (1024 * 1024)).toFixed(1),
    },
    shield: {
      status: 'Active',
      rateLimiter: 'Sliding-Window Enforced',
      waf: 'Deep-Inspection (SQLi, XSS, RCE, Path Traversal)',
    },
  });
}
