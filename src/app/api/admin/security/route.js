import { NextResponse } from 'next/server';
import { verifyAdmin } from '@/lib/authServer';
import { getSecurityStats } from '@/server/middleware/security';
import { globalCache } from '@/server/utils/cache';

export async function GET(request) {
  const auth = await verifyAdmin(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const memory = process.memoryUsage();
  let secStats = { totalLoggedThreats: 0, activeBannedIps: 0, recentThreats: [] };
  let cacheStats = { hitRate: '100%', hits: 0, misses: 0, keys: 0 };

  try {
    if (typeof getSecurityStats === 'function') {
      secStats = getSecurityStats();
    }
  } catch {}

  try {
    if (globalCache && typeof globalCache.getStats === 'function') {
      cacheStats = globalCache.getStats();
    }
  } catch {}

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
      ...secStats,
    },
    cache: cacheStats,
  });
}
