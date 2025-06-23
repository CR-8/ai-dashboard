import { NextResponse } from 'next/server';
import globalCache from '../../../lib/cache-manager.js';

export async function GET() {
  try {
    const cacheStats = globalCache.getStats();
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      cache: {
        totalEntries: cacheStats.totalEntries,
        entries: cacheStats.cacheEntries.map(entry => ({
          key: entry.key,
          ageSeconds: entry.age,
          sizeBytes: entry.size,
          fresh: entry.age < 300 // 5 minutes
        })),
        rateLimits: cacheStats.rateLimitTracking
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      uptime: process.uptime()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    // Clear the cache
    globalCache.cache.clear();
    globalCache.rateLimits.clear();
    
    return NextResponse.json({ 
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
